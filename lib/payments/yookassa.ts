/**
 * ЮKassa - Платежный модуль
 * Документация: https://yookassa.ru/developers/api
 */

interface YooKassaConfig {
    shopId: string;
    secretKey: string;
    returnUrl: string;
}

interface CreatePaymentData {
    orderId: string;
    amount: number;
    currency: string;
    description: string;
    email?: string;
    phone?: string;
}

interface YooKassaPaymentResponse {
    id: string;
    status: string;
    amount: {
        value: string;
        currency: string;
    };
    confirmation: {
        type: string;
        confirmation_url: string;
    };
    created_at: string;
}

interface YooKassaWebhookEvent {
    type: string;
    object: {
        id: string;
        status: string;
        amount: {
            value: string;
            currency: string;
        };
        metadata: {
            order_id: string;
        };
    };
}

export class YooKassaService {
    private config: YooKassaConfig;
    private baseUrl = 'https://api.yookassa.ru/v3';

    constructor(config: YooKassaConfig) {
        this.config = config;
    }

    /**
     * Создание платежа
     */
    async createPayment(data: CreatePaymentData): Promise<YooKassaPaymentResponse> {
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
                    return_url: this.config.returnUrl,
                },
                description: data.description,
                metadata: {
                    order_id: data.orderId,
                },
                receipt: data.email ? {
                    email: data.email,
                } : undefined,
            }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(`YooKassa error: ${error.description || 'Unknown error'}`);
        }

        return response.json();
    }

    /**
     * Получение информации о платеже
     */
    async getPayment(paymentId: string): Promise<YooKassaPaymentResponse> {
        const auth = Buffer.from(`${this.config.shopId}:${this.config.secretKey}`).toString('base64');

        const response = await fetch(`${this.baseUrl}/payments/${paymentId}`, {
            headers: {
                'Authorization': `Basic ${auth}`,
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch payment info');
        }

        return response.json();
    }

    /**
     * Подтверждение платежа (capture)
     */
    async capturePayment(paymentId: string, amount?: number): Promise<YooKassaPaymentResponse> {
        const auth = Buffer.from(`${this.config.shopId}:${this.config.secretKey}`).toString('base64');

        const response = await fetch(`${this.baseUrl}/payments/${paymentId}/capture`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Idempotence-Key': crypto.randomUUID(),
                'Authorization': `Basic ${auth}`,
            },
            body: JSON.stringify({
                amount: amount ? {value: amount.toFixed(2), currency: 'RUB'} : undefined,
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to capture payment');
        }

        return response.json();
    }

    /**
     * Возврат средств (refund)
     */
    async refundPayment(paymentId: string, amount: number): Promise<YooKassaPaymentResponse> {
        const auth = Buffer.from(`${this.config.shopId}:${this.config.secretKey}`).toString('base64');

        const response = await fetch(`${this.baseUrl}/refunds`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Idempotence-Key': crypto.randomUUID(),
                'Authorization': `Basic ${auth}`,
            },
            body: JSON.stringify({
                payment_id: paymentId,
                amount: {
                    value: amount.toFixed(2),
                    currency: 'RUB',
                },
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to refund payment');
        }

        return response.json();
    }

    /**
     * Обработка webhook от ЮKassa
     */
    async handleWebhook(event: YooKassaWebhookEvent): Promise<{ orderId: string; status: string }> {
        const {type, object} = event;

        console.log(`YooKassa webhook: ${type} for payment ${object.id}`);

        return {
            orderId: object.metadata.order_id,
            status: object.status,
        };
    }
}

// Экспорт экземпляра сервиса
export const yookassaService = new YooKassaService({
    shopId: process.env.YOOKASSA_SHOP_ID || '',
    secretKey: process.env.YOOKASSA_SECRET_KEY || '',
    returnUrl: process.env.YOOKASSA_RETURN_URL || 'http://localhost:3000/payment/success',
});
