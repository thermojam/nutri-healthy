/**
 * Яндекс Сплит - Модуль рассрочки
 * Документация: https://yookassa.ru/developers/payment-methods/split-payments
 */

interface YandexSplitConfig {
    shopId: string;
    secretKey: string;
}

interface CreateSplitPaymentData {
    orderId: string;
    amount: number;
    currency: string;
    description: string;
    email?: string;
    installments?: number; // Количество платежей
}

interface YandexSplitResponse {
    id: string;
    status: string;
    amount: {
        value: string;
        currency: string;
    };
    split_plan: {
        installments: number;
        first_installment: number;
        regular_installment: number;
    };
    confirmation: {
        type: string;
        confirmation_url: string;
    };
}

export class YandexSplitService {
    private config: YandexSplitConfig;
    private baseUrl = 'https://api.yookassa.ru/v3';

    constructor(config: YandexSplitConfig) {
        this.config = config;
    }

    /**
     * Создание платежа в рассрочку
     */
    async createSplitPayment(data: CreateSplitPaymentData): Promise<YandexSplitResponse> {
        const auth = Buffer.from(`${this.config.shopId}:${this.config.secretKey}`).toString('base64');

        const response = await fetch(`${this.baseUrl}/payments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Idempotence-Key': crypto.randomUUID(),
                'Authorization': `Basic ${auth}`,
            },
            body: JSON.stringify({
                amount: {
                    value: data.amount.toFixed(2),
                    currency: data.currency,
                },
                capture: true,
                confirmation: {
                    type: 'redirect',
                    return_url: `${process.env.NEXT_PUBLIC_URL}/payment/success`,
                },
                description: data.description,
                metadata: {
                    order_id: data.orderId,
                    payment_type: 'split',
                },
                installment_plan: data.installments ? {
                    type: 'split',
                    installments: data.installments,
                } : undefined,
                receipt: data.email ? {
                    email: data.email,
                } : undefined,
            }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(`Yandex Split error: ${error.description || 'Unknown error'}`);
        }

        return response.json();
    }

    /**
     * Получение информации о рассрочке
     */
    async getSplitPayment(paymentId: string): Promise<YandexSplitResponse> {
        const auth = Buffer.from(`${this.config.shopId}:${this.config.secretKey}`).toString('base64');

        const response = await fetch(`${this.baseUrl}/payments/${paymentId}`, {
            headers: {
                'Authorization': `Basic ${auth}`,
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch split payment info');
        }

        return response.json();
    }

    /**
     * Расчет графика платежей
     */
    calculateInstallmentPlan(amount: number, installments: number): {
        firstInstallment: number;
        regularInstallment: number;
        total: number;
    } {
        // Яндекс Сплит: первый платеж 25%, остальные равными долями
        const firstInstallment = Math.round(amount * 0.25);
        const remainingAmount = amount - firstInstallment;
        const regularInstallment = Math.round(remainingAmount / (installments - 1));

        return {
            firstInstallment,
            regularInstallment,
            total: firstInstallment + (regularInstallment * (installments - 1)),
        };
    }
}

// Экспорт экземпляра сервиса
export const yandexSplitService = new YandexSplitService({
    shopId: process.env.YANDEX_SPLIT_SHOP_ID || '',
    secretKey: process.env.YANDEX_SPLIT_SECRET_KEY || '',
});
