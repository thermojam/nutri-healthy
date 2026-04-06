/**
 * Фискализация чеков (54-ФЗ)
 * Интеграция с ОФД Атол / Мой Налог
 */

import { ReceiptData, ReceiptItem } from '@/lib/types';

interface AtolConfig {
    login: string;
    password: string;
    sno: string;
    email: string;
    baseUrl: string;
}

interface AtolReceiptRequest {
    external_id: string;
    service: {
        callback_url: string;
    };
    receipts: Array<{
        sums: {
            cash: number;
            electronic: number;
            prepaid: number;
            credit: number;
            other: number;
        };
        items: Array<{
            name: string;
            price: number;
            quantity: number;
            amount: number;
            tax: {
                type: string;
            };
            payment_method: string;
            payment_object: string;
        }>;
        client?: {
            email?: string;
            phone?: string;
        };
        total: number;
    }>;
}

interface AtolReceiptResponse {
    uuid: string;
    status: string;
    error?: {
        code: number;
        text: string;
    };
}

interface AtolStatusResponse {
    status: string;
    error?: {
        code: number;
        text: string;
    };
    payload?: {
        fiscal_receipt_number: string;
        fiscal_receipt_date: string;
        fiscal_sign: string;
        registration_number: string;
        factory_number: string;
    };
}

export class ReceiptService {
    private config: AtolConfig;

    constructor(config: AtolConfig) {
        this.config = config;
    }

    /**
     * Получить токен доступа
     */
    private async getToken(): Promise<string> {
        const response = await fetch(`${this.config.baseUrl}/v2/get_token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                login: this.config.login,
                pass: this.config.password,
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to get Atol token');
        }

        const data = await response.json();
        return data.token;
    }

    /**
     * Маппинг налоговой ставки
     */
    private mapTaxRate(taxRate: string): string {
        const mapping: Record<string, string> = {
            none: 'none',
            vat0: 'vat0',
            vat10: 'vat10',
            vat20: 'vat20',
            vat110: 'vat110',
            vat120: 'vat120',
        };
        return mapping[taxRate] || 'none';
    }

    /**
     * Маппинг способа оплаты
     */
    private mapPaymentMethod(method: string): string {
        const mapping: Record<string, string> = {
            full_prepayment: 'full_prepayment',
            prepayment: 'prepayment',
            advance: 'advance',
            full_payment: 'full_payment',
            partial_payment: 'partial_payment',
            credit: 'credit',
            credit_payment: 'credit_payment',
        };
        return mapping[method] || 'full_payment';
    }

    /**
     * Маппинг предмета расчета
     */
    private mapPaymentObject(obj: string): string {
        const mapping: Record<string, string> = {
            commodity: 'commodity',
            service: 'service',
            job: 'job',
            property_right: 'property_right',
            payment: 'payment',
            other: 'other',
        };
        return mapping[obj] || 'service';
    }

    /**
     * Создание чека (продажа)
     */
    async createReceipt(data: ReceiptData): Promise<AtolReceiptResponse> {
        const token = await this.getToken();

        const receipt: AtolReceiptRequest = {
            external_id: data.orderId,
            service: {
                callback_url: `${process.env.NEXT_PUBLIC_URL}/api/payment/receipt-webhook`,
            },
            receipts: [{
                sums: {
                    cash: 0,
                    electronic: data.total,
                    prepaid: 0,
                    credit: 0,
                    other: 0,
                },
                items: data.items.map((item: ReceiptItem) => ({
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                    amount: item.amount,
                    tax: {
                        type: this.mapTaxRate(item.taxRate),
                    },
                    payment_method: this.mapPaymentMethod(item.paymentMethod),
                    payment_object: this.mapPaymentObject(item.paymentObject),
                })),
                client: {
                    email: data.customer.email,
                    phone: data.customer.phone,
                },
                total: data.total,
            }],
        };

        const response = await fetch(`${this.config.baseUrl}/v2/apply/${this.config.sno}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Token': token,
            },
            body: JSON.stringify(receipt),
        });

        if (!response.ok) {
            throw new Error('Failed to create receipt');
        }

        return response.json();
    }

    /**
     * Создание чека возврата (refund)
     */
    async createRefundReceipt(data: ReceiptData): Promise<AtolReceiptResponse> {
        const token = await this.getToken();

        const receipt: AtolReceiptRequest = {
            external_id: `${data.orderId}_refund`,
            service: {
                callback_url: `${process.env.NEXT_PUBLIC_URL}/api/payment/receipt-webhook`,
            },
            receipts: [{
                // Для Атол возврат определяется через отрицательные суммы или отдельный endpoint
                sums: {
                    cash: 0,
                    electronic: -data.total, // Отрицательная сумма для возврата
                    prepaid: 0,
                    credit: 0,
                    other: 0,
                },
                items: data.items.map((item: ReceiptItem) => ({
                    name: item.name,
                    price: -item.price, // Отрицательная цена для возврата
                    quantity: item.quantity,
                    amount: -item.amount, // Отрицательная сумма для возврата
                    tax: {
                        type: this.mapTaxRate(item.taxRate),
                    },
                    payment_method: this.mapPaymentMethod(item.paymentMethod),
                    payment_object: this.mapPaymentObject(item.paymentObject),
                })),
                client: {
                    email: data.customer.email,
                    phone: data.customer.phone,
                },
                total: -data.total,
            }],
        };

        const response = await fetch(`${this.config.baseUrl}/v2/apply/${this.config.sno}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Token': token,
            },
            body: JSON.stringify(receipt),
        });

        if (!response.ok) {
            throw new Error('Failed to create refund receipt');
        }

        return response.json();
    }

    /**
     * Проверка статуса чека
     */
    async getReceiptStatus(uuid: string): Promise<AtolStatusResponse> {
        const token = await this.getToken();

        const response = await fetch(`${this.config.baseUrl}/v2/report/${uuid}`, {
            headers: {
                'Token': token,
            },
        });

        if (!response.ok) {
            throw new Error('Failed to get receipt status');
        }

        return response.json();
    }

    /**
     * Формирование чека для самозанятых (Мой Налог)
     */
    async createNpdReceipt(data: ReceiptData): Promise<void> {
        // TODO: Интеграция с API "Мой Налог"
        // Для самозанятых используется отдельное API
        console.log('NPD receipt creation not implemented yet');
    }
}

// Экспорт экземпляра сервиса
export const receiptService = new ReceiptService({
    login: process.env.ATOL_LOGIN || '',
    password: process.env.ATOL_PASSWORD || '',
    sno: process.env.ATOL_SNO || 'npd',
    email: process.env.ATOL_EMAIL || '',
    baseUrl: 'https://online.atol.ru',
});
