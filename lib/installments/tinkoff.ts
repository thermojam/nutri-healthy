/**
 * Тинькофф Рассрочка - Модуль рассрочки
 * Документация: https://www.tinkoff.ru/kassa/develop/payments/
 */

interface TinkoffConfig {
    terminalKey: string;
    secretKey: string;
}

interface CreateTinkoffPaymentData {
    orderId: string;
    amount: number;
    currency: string;
    description: string;
    email: string;
    phone: string;
    firstName: string;
    lastName: string;
    installments?: number;
}

interface TinkoffPaymentResponse {
    PaymentId: number;
    Status: string;
    Amount: number;
    TerminalKey: string;
    OrderId: string;
    PaymentURL: string;
}

interface TinkoffWebhookEvent {
    TerminalKey: string;
    PaymentId: number;
    OrderId: string;
    Status: string;
    Amount: number;
    RebillId?: string;
}

export class TinkoffInstallmentService {
    private config: TinkoffConfig;
    private baseUrl = 'https://securepay.tinkoff.ru/v2';

    constructor(config: TinkoffConfig) {
        this.config = config;
    }

    /**
     * Подпись запроса (Tinkoff signature)
     */
    private sign(data: Record<string, unknown>): string {
        const sortedKeys = Object.keys(data).sort();
        const values = sortedKeys.map(key => data[key]).join('');
        const signatureString = values + this.config.secretKey;
        
        // Используем crypto для SHA256
        const encoder = new TextEncoder();
        const dataBuffer = encoder.encode(signatureString);
        
        // В Node.js среде используем crypto module
        return require('crypto')
            .createHash('sha256')
            .update(signatureString)
            .digest('hex');
    }

    /**
     * Создание платежа в рассрочку
     */
    async createPayment(data: CreateTinkoffPaymentData): Promise<TinkoffPaymentResponse> {
        const payload = {
            TerminalKey: this.config.terminalKey,
            OrderId: data.orderId,
            Amount: data.amount,
            Currency: data.currency,
            Description: data.description,
            Email: data.email,
            Phone: data.phone,
            FirstName: data.firstName,
            LastName: data.lastName,
            PaymentType: 'INSTALLMENT',
            Installments: data.installments || 6,
            SuccessURL: `${process.env.NEXT_PUBLIC_URL}/payment/success`,
            FailURL: `${process.env.NEXT_PUBLIC_URL}/payment/cancel`,
        };

        const signature = this.sign(payload);

        const response = await fetch(`${this.baseUrl}/Init`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ...payload,
                Token: signature,
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to create Tinkoff payment');
        }

        const result = await response.json();

        if (!result.Success) {
            throw new Error(result.Error?.Message || 'Tinkoff payment failed');
        }

        return {
            PaymentId: result.PaymentId,
            Status: result.Status,
            Amount: result.Amount,
            TerminalKey: result.TerminalKey,
            OrderId: result.OrderId,
            PaymentURL: result.PaymentURL,
        };
    }

    /**
     * Получение статуса платежа
     */
    async getPaymentStatus(paymentId: number): Promise<{ Status: string; Amount: number }> {
        const payload = {
            TerminalKey: this.config.terminalKey,
            PaymentId: paymentId,
        };

        const signature = this.sign(payload);

        const response = await fetch(`${this.baseUrl}/GetState`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ...payload,
                Token: signature,
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to get Tinkoff payment status');
        }

        const result = await response.json();

        if (!result.Success) {
            throw new Error(result.Error?.Message || 'Failed to get status');
        }

        return {
            Status: result.Status,
            Amount: result.Amount,
        };
    }

    /**
     * Отмена платежа
     */
    async cancelPayment(paymentId: number): Promise<void> {
        const payload = {
            TerminalKey: this.config.terminalKey,
            PaymentId: paymentId,
        };

        const signature = this.sign(payload);

        const response = await fetch(`${this.baseUrl}/Cancel`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ...payload,
                Token: signature,
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to cancel Tinkoff payment');
        }

        const result = await response.json();

        if (!result.Success) {
            throw new Error(result.Error?.Message || 'Failed to cancel');
        }
    }

    /**
     * Возврат средств
     */
    async refundPayment(paymentId: number, amount: number): Promise<void> {
        const payload = {
            TerminalKey: this.config.terminalKey,
            PaymentId: paymentId,
            Amount: amount,
        };

        const signature = this.sign(payload);

        const response = await fetch(`${this.baseUrl}/Refund`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ...payload,
                Token: signature,
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to refund Tinkoff payment');
        }

        const result = await response.json();

        if (!result.Success) {
            throw new Error(result.Error?.Message || 'Failed to refund');
        }
    }

    /**
     * Создание рекуррентного платежа (для подписок)
     */
    async createRebillPayment(rebillId: string, amount: number, orderId: string): Promise<TinkoffPaymentResponse> {
        const payload = {
            TerminalKey: this.config.terminalKey,
            OrderId: orderId,
            Amount: amount,
            RebillId: rebillId,
        };

        const signature = this.sign(payload);

        const response = await fetch(`${this.baseUrl}/Rebill`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ...payload,
                Token: signature,
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to create rebill payment');
        }

        const result = await response.json();

        if (!result.Success) {
            throw new Error(result.Error?.Message || 'Rebill failed');
        }

        return {
            PaymentId: result.PaymentId,
            Status: result.Status,
            Amount: result.Amount,
            TerminalKey: result.TerminalKey,
            OrderId: result.OrderId,
            PaymentURL: '',
        };
    }

    /**
     * Обработка webhook от Тинькофф
     */
    async handleWebhook(event: TinkoffWebhookEvent): Promise<{ orderId: string; status: string }> {
        const { TerminalKey, OrderId, Status } = event;

        // Проверка TerminalKey
        if (TerminalKey !== this.config.terminalKey) {
            throw new Error('Invalid terminal key in webhook');
        }

        console.log(`Tinkoff webhook: Status ${Status} for payment ${event.PaymentId}`);

        return {
            orderId: OrderId,
            status: Status,
        };
    }

    /**
     * Расчет графика платежей
     */
    calculateInstallmentPlan(amount: number, installments: number = 6): {
        amountPerInstallment: number;
        total: number;
        schedule: Array<{ month: number; amount: number }>;
    } {
        const amountPerInstallment = Math.round(amount / installments);
        const schedule = [];
        const today = new Date();

        for (let i = 0; i < installments; i++) {
            const paymentDate = new Date(today);
            paymentDate.setMonth(paymentDate.getMonth() + i);

            schedule.push({
                month: i + 1,
                amount: i === installments - 1
                    ? amount - (amountPerInstallment * (installments - 1))
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
export const tinkoffInstallmentService = new TinkoffInstallmentService({
    terminalKey: process.env.TINKOFF_TERMINAL_KEY || '',
    secretKey: process.env.TINKOFF_SECRET_KEY || '',
});
