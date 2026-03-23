/**
 * Долими (Dolemi) - Модуль рассрочки
 * Документация: https://dolemi.ru/developers
 */

interface DolemiConfig {
    merchantId: string;
    apiKey: string;
}

interface CreateDolemiPaymentData {
    orderId: string;
    amount: number;
    currency: string;
    description: string;
    email: string;
    phone: string;
    firstName: string;
    lastName: string;
    installments: number; // 4 платежа
}

interface DolemiPaymentResponse {
    payment_id: string;
    status: string;
    payment_url: string;
    amount: number;
    installments: {
        count: number;
        amount_per_installment: number;
        schedule: Array<{
            date: string;
            amount: number;
            status: string;
        }>;
    };
}

interface DolemiWebhookEvent {
    event_type: string;
    payment_id: string;
    order_id: string;
    status: string;
    amount: number;
    installment_number?: number;
}

export class DolemiService {
    private config: DolemiConfig;
    private baseUrl = 'https://api.dolemi.ru/v1';

    constructor(config: DolemiConfig) {
        this.config = config;
    }

    /**
     * Создание платежа в рассрочку
     */
    async createPayment(data: CreateDolemiPaymentData): Promise<DolemiPaymentResponse> {
        const response = await fetch(`${this.baseUrl}/payments/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.config.apiKey}`,
                'X-Merchant-ID': this.config.merchantId,
            },
            body: JSON.stringify({
                order_id: data.orderId,
                amount: data.amount,
                currency: data.currency,
                description: data.description,
                customer: {
                    email: data.email,
                    phone: data.phone,
                    first_name: data.firstName,
                    last_name: data.lastName,
                },
                installments: {
                    count: data.installments,
                    type: 'standard', // standard: 4 платежа без процентов
                },
                return_url: `${process.env.NEXT_PUBLIC_URL}/payment/success`,
                webhook_url: `${process.env.NEXT_PUBLIC_URL}/api/payment/dolemi-webhook`,
            }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(`Dolemi error: ${error.message || 'Unknown error'}`);
        }

        return response.json();
    }

    /**
     * Получение информации о платеже
     */
    async getPayment(paymentId: string): Promise<DolemiPaymentResponse> {
        const response = await fetch(`${this.baseUrl}/payments/${paymentId}`, {
            headers: {
                'Authorization': `Bearer ${this.config.apiKey}`,
                'X-Merchant-ID': this.config.merchantId,
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch Dolemi payment info');
        }

        return response.json();
    }

    /**
     * Отмена платежа
     */
    async cancelPayment(paymentId: string, reason: string): Promise<void> {
        const response = await fetch(`${this.baseUrl}/payments/${paymentId}/cancel`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.config.apiKey}`,
                'X-Merchant-ID': this.config.merchantId,
            },
            body: JSON.stringify({
                reason,
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to cancel Dolemi payment');
        }
    }

    /**
     * Возврат средств
     */
    async refundPayment(paymentId: string, amount: number, reason: string): Promise<void> {
        const response = await fetch(`${this.baseUrl}/payments/${paymentId}/refund`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.config.apiKey}`,
                'X-Merchant-ID': this.config.merchantId,
            },
            body: JSON.stringify({
                amount,
                reason,
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to refund Dolemi payment');
        }
    }

    /**
     * Обработка webhook от Долими
     */
    async handleWebhook(event: DolemiWebhookEvent): Promise<{ orderId: string; status: string }> {
        const { event_type, order_id, status } = event;

        console.log(`Dolemi webhook: ${event_type} for payment ${event.payment_id}`);

        return {
            orderId: order_id,
            status,
        };
    }

    /**
     * Расчет графика платежей (стандартный: 4 платежа)
     */
    calculateInstallmentPlan(amount: number, installments: number = 4): {
        amountPerInstallment: number;
        total: number;
        schedule: Array<{ date: string; amount: number }>;
    } {
        const amountPerInstallment = Math.round(amount / installments);
        const schedule = [];
        const today = new Date();

        for (let i = 0; i < installments; i++) {
            const paymentDate = new Date(today);
            paymentDate.setDate(paymentDate.getDate() + (i * 14)); // Каждые 2 недели

            schedule.push({
                date: paymentDate.toISOString().split('T')[0],
                amount: i === installments - 1 
                    ? amount - (amountPerInstallment * (installments - 1)) // Последний платеж с копейками
                    : amountPerInstallment,
            });
        }

        return {
            amountPerInstallment,
            total: amount,
            schedule,
        };
    }
}

// Экспорт экземпляра сервиса
export const dolemiService = new DolemiService({
    merchantId: process.env.DOLEMI_MERCHANT_ID || '',
    apiKey: process.env.DOLEMI_API_KEY || '',
});
