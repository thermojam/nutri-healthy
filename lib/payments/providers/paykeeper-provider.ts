/**
 * PayKeeper Payment Provider
 * Реализация платежной системы PayKeeper
 * Документация: https://docs.paykeeper.ru/dokumentatsiya-json-api/
 */

import {
    PaymentProvider,
    PaymentData,
    PaymentConfirmation,
    PaymentStatus,
    RefundData,
    RefundResult,
} from "./abstract-payment-provider";

interface PayKeeperConfig {
    shopId: string;
    apiToken: string;
    returnUrl: string;
    testMode: boolean;
}

export class PayKeeperPaymentProvider extends PaymentProvider {
    readonly name = "PayKeeper";
    readonly code = "paykeeper";

    private config: PayKeeperConfig | null = null;
    private baseUrl = "https://paykeeper.ru/api/";

    constructor() {
        super();
        this.loadConfig();
    }

    private loadConfig(): void {
        this.config = {
            shopId: process.env.PAYKEEPER_SHOP_ID || "",
            apiToken: process.env.PAYKEEPER_API_TOKEN || "",
            returnUrl: process.env.PAYKEEPER_RETURN_URL || "",
            testMode: process.env.PAYKEEPER_TEST_MODE === "true" || process.env.NODE_ENV === "development",
        };
    }

    async initialize(): Promise<boolean> {
        try {
            this.loadConfig();
            if (!this.config?.shopId || !this.config?.apiToken) {
                console.warn("PayKeeper: Missing configuration");
                return false;
            }
            // Проверка подключения через тестовый запрос
            return await this.isAvailable();
        } catch (error) {
            console.error("PayKeeper: Initialization failed", error);
            return false;
        }
    }

    async isAvailable(): Promise<boolean> {
        // В тестовом режиме всегда доступен
        if (this.config?.testMode) {
            return true;
        }
        
        try {
            const response = await fetch(`${this.baseUrl}settings`, {
                method: "GET",
                headers: this.getAuthHeaders(),
            });
            return response.ok;
        } catch (error) {
            console.error("PayKeeper: Availability check failed", error);
            return false;
        }
    }

    async createPayment(data: PaymentData): Promise<PaymentConfirmation> {
        if (!this.config) {
            throw new Error("PayKeeper not initialized");
        }

        // Тестовый режим - возвращаем тестовую ссылку
        if (this.config.testMode) {
            console.log("PayKeeper: TEST MODE - creating test payment");
            return {
                confirmationUrl: `http://localhost:3000/payment/success?test=true&order_id=${data.orderId}`,
                paymentId: `test_${Date.now()}`,
                status: "pending",
            };
        }

        try {
            // Создаем счет через PayKeeper API
            const response = await fetch(`${this.baseUrl}invoice`, {
                method: "POST",
                headers: {
                    ...this.getAuthHeaders(),
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: new URLSearchParams({
                    sum: data.amount.toString(),
                    order_id: data.orderId,
                    clientid: data.customerName || "",
                    email: data.email || "",
                    phone: data.phone || "",
                    description: data.description,
                    return_url: this.config.returnUrl,
                }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.msg || "Failed to create payment");
            }

            const result = await response.json();

            return {
                confirmationUrl: result.url,
                paymentId: result.id,
                status: "pending",
            };
        } catch (error) {
            console.error("PayKeeper: Create payment failed", error);
            throw error;
        }
    }

    async getPaymentStatus(paymentId: string): Promise<PaymentStatus> {
        try {
            const response = await fetch(`${this.baseUrl}payment_info`, {
                method: "POST",
                headers: {
                    ...this.getAuthHeaders(),
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: new URLSearchParams({
                    id: paymentId,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to get payment status");
            }

            const result = await response.json();

            return {
                paymentId,
                status: this.mapStatus(result.status),
                amount: parseFloat(result.pay_amount),
                paidAt: result.success_datetime
                    ? new Date(result.success_datetime)
                    : undefined,
            };
        } catch (error) {
            console.error("PayKeeper: Get payment status failed", error);
            throw error;
        }
    }

    async refund(data: RefundData): Promise<RefundResult> {
        try {
            const response = await fetch(`${this.baseUrl}refund`, {
                method: "POST",
                headers: {
                    ...this.getAuthHeaders(),
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: new URLSearchParams({
                    id: data.paymentId,
                    sum: data.amount.toString(),
                    description: data.description,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to process refund");
            }

            const result = await response.json();

            return {
                refundId: result.refund_id,
                status: "succeeded",
            };
        } catch (error) {
            console.error("PayKeeper: Refund failed", error);
            throw error;
        }
    }

    async handleWebhook(
        payload: unknown,
        signature?: string
    ): Promise<{ orderId: string; status: string; paymentId: string }> {
        const data = payload as Record<string, unknown>;

        // Верификация подписи (если передана)
        if (signature && this.config?.apiToken) {
            const expectedSignature = this.createSignature(data);
            if (signature !== expectedSignature) {
                throw new Error("Invalid webhook signature");
            }
        }

        return {
            orderId: String(data.orderid || ""),
            status: String(data.status || "unknown"),
            paymentId: String(data.id || ""),
        };
    }

    private getAuthHeaders(): Record<string, string> {
        if (!this.config?.apiToken) {
            return {};
        }
        // Basic авторизация через токен
        const credentials = Buffer.from(
            `${this.config.shopId}:${this.config.apiToken}`
        ).toString("base64");
        return {
            Authorization: `Basic ${credentials}`,
        };
    }

    private createSignature(data: Record<string, unknown>): string {
        // Создаем подпись запроса
        const sortedKeys = Object.keys(data).sort();
        const signatureString = sortedKeys
            .map((key) => `${key}=${data[key]}`)
            .join("&");
        // Используем SHA256 для создания подписи
        const crypto = require("crypto");
        return crypto
            .createHmac("sha256", this.config?.apiToken || "")
            .update(signatureString)
            .digest("hex");
    }

    private mapStatus(status: string): PaymentStatus["status"] {
        const statusMap: Record<string, PaymentStatus["status"]> = {
            success: "succeeded",
            pending: "pending",
            canceled: "canceled",
            refunded: "refunded",
        };
        return statusMap[status] || "pending";
    }
}
