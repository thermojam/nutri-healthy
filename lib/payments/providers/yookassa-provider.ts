/**
 * YooKassa Payment Provider
 * Адаптер для существующей платежной системы ЮKassa
 */

import {
    PaymentProvider,
    PaymentData,
    PaymentConfirmation,
    PaymentStatus,
    RefundData,
    RefundResult,
} from "./abstract-payment-provider";

interface YooKassaConfig {
    shopId: string;
    secretKey: string;
    returnUrl: string;
    testMode: boolean;
}

export class YooKassaPaymentProvider extends PaymentProvider {
    readonly name = "ЮKassa";
    readonly code = "yookassa";

    private config: YooKassaConfig | null = null;
    private baseUrl = "https://api.yookassa.ru/v3/";

    constructor() {
        super();
        this.loadConfig();
    }

    private loadConfig(): void {
        this.config = {
            shopId: process.env.YOOKASSA_SHOP_ID || "",
            secretKey: process.env.YOOKASSA_SECRET_KEY || "",
            returnUrl: process.env.YOOKASSA_RETURN_URL || "",
            testMode: process.env.NODE_ENV === "development",
        };
    }

    async initialize(): Promise<boolean> {
        try {
            this.loadConfig();
            if (!this.config?.shopId || !this.config?.secretKey) {
                console.warn("YooKassa: Missing configuration");
                return false;
            }
            return true;
        } catch (error) {
            console.error("YooKassa: Initialization failed", error);
            return false;
        }
    }

    async isAvailable(): Promise<boolean> {
        // Простая проверка наличия конфигурации
        return !!(this.config?.shopId && this.config?.secretKey);
    }

    async createPayment(data: PaymentData): Promise<PaymentConfirmation> {
        if (!this.config) {
            throw new Error("YooKassa not initialized");
        }

        try {
            const response = await fetch(`${this.baseUrl}payments`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Basic ${Buffer.from(
                        `${this.config.shopId}:${this.config.secretKey}`
                    ).toString("base64")}`,
                },
                body: JSON.stringify({
                    amount: {
                        value: data.amount.toFixed(2),
                        currency: data.currency,
                    },
                    capture: true,
                    description: data.description,
                    confirmation: {
                        type: "redirect",
                        return_url: this.config.returnUrl,
                    },
                    payment_method_data: {
                        type: "bank_card",
                    },
                }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.description || "Failed to create payment");
            }

            const result = await response.json();

            return {
                confirmationUrl: result.confirmation?.confirmation_url || "",
                paymentId: result.id,
                status: result.status,
            };
        } catch (error) {
            console.error("YooKassa: Create payment failed", error);
            throw error;
        }
    }

    async getPaymentStatus(paymentId: string): Promise<PaymentStatus> {
        try {
            const response = await fetch(`${this.baseUrl}payments/${paymentId}`, {
                headers: {
                    Authorization: `Basic ${Buffer.from(
                        `${this.config?.shopId}:${this.config?.secretKey}`
                    ).toString("base64")}`,
                },
            });

            if (!response.ok) {
                throw new Error("Failed to get payment status");
            }

            const result = await response.json();

            return {
                paymentId,
                status: this.mapStatus(result.status),
                amount: parseFloat(result.amount.value),
                paidAt: result.paid_at ? new Date(result.paid_at) : undefined,
            };
        } catch (error) {
            console.error("YooKassa: Get payment status failed", error);
            throw error;
        }
    }

    async refund(data: RefundData): Promise<RefundResult> {
        try {
            const response = await fetch(`${this.baseUrl}refunds`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Basic ${Buffer.from(
                        `${this.config?.shopId}:${this.config?.secretKey}`
                    ).toString("base64")}`,
                },
                body: JSON.stringify({
                    payment_id: data.paymentId,
                    amount: {
                        value: data.amount.toFixed(2),
                        currency: "RUB",
                    },
                    description: data.description,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to process refund");
            }

            const result = await response.json();

            return {
                refundId: result.id,
                status: "succeeded",
            };
        } catch (error) {
            console.error("YooKassa: Refund failed", error);
            throw error;
        }
    }

    async handleWebhook(
        payload: unknown
    ): Promise<{ orderId: string; status: string; paymentId: string }> {
        const data = payload as Record<string, unknown>;
        const object = data.object as { metadata?: { order_id?: string }; id?: string } | undefined;

        return {
            orderId: String(object?.metadata?.order_id || ""),
            status: String(data.event || "unknown"),
            paymentId: String(object?.id || ""),
        };
    }

    private mapStatus(status: string): PaymentStatus["status"] {
        const statusMap: Record<string, PaymentStatus["status"]> = {
            succeeded: "succeeded",
            pending: "pending",
            canceled: "canceled",
            refunded: "refunded",
        };
        return statusMap[status] || "pending";
    }
}
