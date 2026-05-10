/**
 * Payment Service
 * Сервис для управления платежами с использованием паттерна Strategy
 * Предоставляет единый интерфейс для работы с разными платежными провайдерами
 */

import { getPaymentProvider } from "./payment-provider-factory";
import type {
    PaymentData,
    PaymentConfirmation,
    PaymentStatus,
    RefundData,
    RefundResult,
} from "./providers/abstract-payment-provider";
import { Order } from "@/lib/db/models/Order";
import { validatePaymentData, validateRefundData, sanitizePaymentData } from "./validation";
import { withRetry } from "./retry-policy";

export interface CreatePaymentResult {
    success: boolean;
    paymentUrl?: string;
    paymentId?: string;
    error?: string;
}

export interface PaymentWebhookResult {
    orderId: string;
    status: string;
    paymentId: string;
    success: boolean;
    error?: string;
}

/**
 * PaymentService - фасад для работы с платежными системами
 */
export class PaymentService {
    /**
     * Создание платежа
     * Автоматически использует активный платежный провайдер
     */
    async createPayment(data: PaymentData): Promise<CreatePaymentResult> {
        try {
            // Валидация входящих данных
            const validationErrors = validatePaymentData(data);
            if (validationErrors.length > 0) {
                console.warn("PaymentService: Validation failed", validationErrors);
                return {
                    success: false,
                    error: `Validation failed: ${validationErrors.map(e => e.message).join(", ")}`,
                };
            }

            // Санитизация данных
            const sanitizedData = sanitizePaymentData(data);

            const provider = getPaymentProvider();
            const confirmation = await withRetry(
                () => provider.createPayment(sanitizedData),
                "createPayment"
            );

            // Обновляем заказ с информацией о платеже
            await Order.findByIdAndUpdate(data.orderId, {
                paymentId: confirmation.paymentId,
                paymentProvider: provider.code,
                status: "pending",
            });

            return {
                success: true,
                paymentUrl: confirmation.confirmationUrl,
                paymentId: confirmation.paymentId,
            };
        } catch (error) {
            console.error("PaymentService: Create payment failed", error);
            return {
                success: false,
                error:
                    error instanceof Error
                        ? error.message
                        : "Failed to create payment",
            };
        }
    }

    /**
     * Получение статуса платежа
     */
    async getPaymentStatus(
        paymentId: string,
        providerCode?: string
    ): Promise<PaymentStatus> {
        const provider = getPaymentProvider();
        return await withRetry(
            () => provider.getPaymentStatus(paymentId),
            "getPaymentStatus"
        );
    }

    /**
     * Возврат средств
     */
    async refund(data: RefundData): Promise<RefundResult> {
        try {
            // Валидация данных возврата
            const validationErrors = validateRefundData(data);
            if (validationErrors.length > 0) {
                console.warn("PaymentService: Refund validation failed", validationErrors);
                throw new Error(`Validation failed: ${validationErrors.map(e => e.message).join(", ")}`);
            }

            const provider = getPaymentProvider();
            return await withRetry(
                () => provider.refund(data),
                "refund"
            );
        } catch (error) {
            console.error("PaymentService: Refund failed", error);
            throw error;
        }
    }

    /**
     * Обработка вебхука от платежной системы
     */
    async handleWebhook(
        payload: unknown,
        signature?: string,
        providerCode?: string
    ): Promise<PaymentWebhookResult> {
        try {
            const provider = getPaymentProvider();
            const webhookData = await provider.handleWebhook(payload, signature);

            // Обновляем статус заказа
            if (webhookData.orderId) {
                const status = this.mapWebhookStatus(webhookData.status);
                await Order.findByIdAndUpdate(webhookData.orderId, {
                    status,
                    paidAt:
                        status === "succeeded" ? new Date() : undefined,
                });
            }

            return {
                ...webhookData,
                success: true,
            };
        } catch (error) {
            console.error("PaymentService: Webhook handling failed", error);
            return {
                orderId: "",
                status: "error",
                paymentId: "",
                success: false,
                error:
                    error instanceof Error ? error.message : "Webhook handling failed",
            };
        }
    }

    /**
     * Маппинг статусов вебхука в статусы заказа
     */
    private mapWebhookStatus(webhookStatus: string): string {
        const statusMap: Record<string, string> = {
            succeeded: "paid",
            pending: "pending",
            canceled: "canceled",
            refunded: "refunded",
        };
        return statusMap[webhookStatus] || "pending";
    }

    /**
     * Проверка доступности платежной системы
     */
    async isPaymentSystemAvailable(): Promise<boolean> {
        try {
            const provider = getPaymentProvider();
            return await provider.isAvailable();
        } catch (error) {
            console.error("PaymentService: Availability check failed", error);
            return false;
        }
    }
}

// Экспорт единственного экземпляра сервиса
export const paymentService = new PaymentService();
