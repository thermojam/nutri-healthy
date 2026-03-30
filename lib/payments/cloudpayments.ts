/**
 * CloudPayments - Платежный модуль для рекуррентных платежей
 * Документация: https://cloudpayments.ru/Docs/Api
 */

interface CloudPaymentsConfig {
    publicId: string;
    apiSecret: string;
    returnUrl: string;
}

interface CreatePaymentData {
    orderId: string;
    amount: number;
    currency: string;
    description: string;
    email?: string;
    phone?: string;
    accountId?: string; // ID пользователя для рекуррентных платежей
}

interface CloudPaymentsWidgetResponse {
    Model: {
        TransactionId: number;
        PaRes: string;
        TermUrl: string;
    };
    Success: boolean;
    Message: string;
}

interface CloudPaymentsChargeResponse {
    Success: boolean;
    TransactionId: number;
    Amount: number;
    Currency: string;
    CardHolderMessage: string;
    Reason: string;
}

interface CloudPaymentsWebhookEvent {
    Type: string; // 'TransactionStatusChanged' | 'RecurrentPayFailed'
    TransactionId: number;
    Amount: number;
    Currency: string;
    OrderId: string;
    AccountId: string;
    Status: string;
}

export class CloudPaymentsService {
    private config: CloudPaymentsConfig;
    private baseUrl = 'https://api.cloudpayments.ru';

    constructor(config: CloudPaymentsConfig) {
        this.config = config;
    }

    /**
     * Создание платежа через виджет
     */
    async createPayment(data: CreatePaymentData): Promise<CloudPaymentsWidgetResponse> {
        const auth = Buffer.from(`${this.config.publicId}:${this.config.apiSecret}`).toString('base64');

        const response = await fetch(`${this.baseUrl}/payments/widgets/generate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${auth}`,
            },
            body: JSON.stringify({
                Amount: data.amount,
                Currency: data.currency,
                Description: data.description,
                OrderId: data.orderId,
                AccountId: data.accountId,
                Email: data.email,
                Skin: 'mini', // mini, classic, bright
                Language: 'ru',
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to create CloudPayments widget');
        }

        return response.json();
    }

    /**
     * Проверка платежа (3DS)
     */
    async verify3DS(paRes: string, md: string): Promise<CloudPaymentsWidgetResponse> {
        const auth = Buffer.from(`${this.config.publicId}:${this.config.apiSecret}`).toString('base64');

        const response = await fetch(`${this.baseUrl}/payments/post3ds`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${auth}`,
            },
            body: JSON.stringify({
                PaRes: paRes,
                Md: md,
            }),
        });

        if (!response.ok) {
            throw new Error('3DS verification failed');
        }

        return response.json();
    }

    /**
     * Завершение платежа (confirm)
     */
    async confirmPayment(transactionId: number, otp?: string): Promise<CloudPaymentsChargeResponse> {
        const auth = Buffer.from(`${this.config.publicId}:${this.config.apiSecret}`).toString('base64');

        const response = await fetch(`${this.baseUrl}/payments/confirm`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${auth}`,
            },
            body: JSON.stringify({
                TransactionId: transactionId,
                Otp: otp, // Для 3DS платежей
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to confirm payment');
        }

        return response.json();
    }

    /**
     * Рекуррентный платеж (по токену карты)
     */
    async recurrentPayment(data: CreatePaymentData & { token: string }): Promise<CloudPaymentsChargeResponse> {
        const auth = Buffer.from(`${this.config.publicId}:${this.config.apiSecret}`).toString('base64');

        const response = await fetch(`${this.baseUrl}/payments/recurrent`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${auth}`,
            },
            body: JSON.stringify({
                Amount: data.amount,
                Currency: data.currency,
                Description: data.description,
                OrderId: data.orderId,
                AccountId: data.accountId,
                Email: data.email,
                Token: data.token, // Токен карты из предыдущей транзакции
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to process recurrent payment');
        }

        return response.json();
    }

    /**
     * Возврат средств (refund)
     */
    async refundPayment(transactionId: number, amount: number, reason: string = 'Refund'): Promise<CloudPaymentsChargeResponse> {
        const auth = Buffer.from(`${this.config.publicId}:${this.config.apiSecret}`).toString('base64');

        const response = await fetch(`${this.baseUrl}/payments/refund`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${auth}`,
            },
            body: JSON.stringify({
                TransactionId: transactionId,
                Amount: amount,
                Reason: reason,
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to refund payment');
        }

        return response.json();
    }

    /**
     * Обработка webhook от CloudPayments
     */
    async handleWebhook(event: CloudPaymentsWebhookEvent): Promise<{ orderId: string; status: string; paymentId: string }> {
        const {Type, OrderId, Status} = event;

        console.log(`CloudPayments webhook: ${Type} for transaction ${event.TransactionId}`);

        return {
            orderId: OrderId,
            status: Status,
            paymentId: event.TransactionId.toString(),
        };
    }

    /**
     * Проверка статуса транзакции
     */
    async getTransactionStatus(transactionId: number): Promise<{ status: string; amount: number }> {
        const auth = Buffer.from(`${this.config.publicId}:${this.config.apiSecret}`).toString('base64');

        const response = await fetch(`${this.baseUrl}/payments/get`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${auth}`,
            },
            body: JSON.stringify({
                TransactionId: transactionId,
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to get transaction status');
        }

        const data = await response.json();
        return {
            status: data.Status,
            amount: data.Amount,
        };
    }
}

// Экспорт экземпляра сервиса
export const cloudpaymentsService = new CloudPaymentsService({
    publicId: process.env.CLOUDPAYMENTS_PUBLIC_ID || '',
    apiSecret: process.env.CLOUDPAYMENTS_API_SECRET || '',
    returnUrl: process.env.CLOUDPAYMENTS_RETURN_URL || 'http://localhost:3000/payment/success',
});
