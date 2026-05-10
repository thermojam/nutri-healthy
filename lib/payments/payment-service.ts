/**
 * Payment Service
 * Сервис для управления платежами с использованием паттерна Strategy
 * Предоставляет единый интерфейс для работы с разными платежными провайдерами
 */

import { getPaymentProvider, getPaymentProviderWithFallback } from "./payment-provider-factory";
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
import { recordPaymentOperation } from "./metrics";
import { paymentLogger } from "./secure-logger";
import { checkRateLimit, RateLimitError } from "./rate-limiter";
import { validateWebhookRequest } from "./webhook-validator";

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
            // Проверка rate limit по orderId
            const rateLimit = await checkRateLimit("createPayment", data.orderId);
            if (!rateLimit.allowed) {
                return {
                    success: false,
                    error: `Rate limit exceeded. Please try again in ${Math.ceil(rateLimit.resetIn / 1000)} seconds`,
                };
            }

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

            // Используем fallback стратегию для основной операции
            const provider = await getPaymentProviderWithFallback();
            const confirmation = await recordPaymentOperation(
                () => withRetry(
                    () => provider.createPayment(sanitizedData),
                    "createPayment"
                ),
                "createPayment",
                provider.code,
                sanitizedData.amount
            );

            // Обновляем заказ с информацией о платеже
            await Order.findByIdAndUpdate(data.orderId, {
                paymentId: confirmation.paymentId,
                paymentProvider: provider.code,
                status: "pending",
            });

            paymentLogger.logSuccess("createPayment", "Payment created successfully", {
                paymentId: confirmation.paymentId,
                orderId: data.orderId,
                amount: sanitizedData.amount,
            });

            return {
                success: true,
                paymentUrl: confirmation.confirmationUrl,
                paymentId: confirmation.paymentId,
            };
        } catch (error) {
            paymentLogger.logError("createPayment", "Failed to create payment", error, {
                orderId: data.orderId,
                amount: sanitizedData.amount,
            });
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
        // Проверка rate limit по paymentId
        const rateLimit = await checkRateLimit("getPaymentStatus", paymentId);
        if (!rateLimit.allowed) {
            throw new RateLimitError("getPaymentStatus", rateLimit.resetIn);
        }

        const provider = getPaymentProvider();
        return await recordPaymentOperation(
            () => withRetry(
                () => provider.getPaymentStatus(paymentId),
                "getPaymentStatus"
            ),
            "getPaymentStatus",
            provider.code
        );
    }

    /**
     * Возврат средств
     */
    async refund(data: RefundData): Promise<RefundResult> {
        try {
            // Проверка rate limit по paymentId
            const rateLimit = await checkRateLimit("refund", data.paymentId);
            if (!rateLimit.allowed) {
                throw new RateLimitError("refund", rateLimit.resetIn);
            }

            // Валидация данных возврата
            const validationErrors = validateRefundData(data);
            if (validationErrors.length > 0) {
                paymentLogger.logWarning("refund", "Refund validation failed", { errors: validationErrors });
                throw new Error(`Validation failed: ${validationErrors.map(e => e.message).join(", ")}`);
            }

            const provider = getPaymentProvider();
            const result = await recordPaymentOperation(
                () => withRetry(
                    () => provider.refund(data),
                    "refund"
                ),
                "refund",
                provider.code,
                data.amount
            );

            paymentLogger.logSuccess("refund", "Refund processed successfully", {
                refundId: result.refundId,
                paymentId: data.paymentId,
                amount: data.amount,
            });

            return result;
        } catch (error) {
            paymentLogger.logError("refund", "Refund failed", error, {
                paymentId: data.paymentId,
                amount: data.amount,
            });
            throw error;
        }
    }

    /**
     * Обработка вебхука от платежной системы
     */
    async handleWebhook(
        payload: unknown,
        signature?: string,
        providerCode?: string,
        secret?: string
    ): Promise<PaymentWebhookResult> {
        try {
            const provider = getPaymentProvider();

            // Валидируем вебхук перед обработкой
            if (signature && secret && providerCode) {
                const validation = await validateWebhookRequest(
                    payload,
                    signature,
                    providerCode as "yookassa" | "paykeeper",
                    secret
                );

                if (!validation.valid) {
                    paymentLogger.logWarning("handleWebhook", "Webhook validation failed", {
                        provider: providerCode,
                        error: validation.error,
                        isReplayed: validation.isReplayed,
                    });
                    return {
                        orderId: "",
                        status: "error",
                        paymentId: "",
                        success: false,
                        error: validation.error || "Webhook validation failed",
                    };
                }
            }

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

            paymentLogger.logSuccess("handleWebhook", "Webhook processed successfully", {
                orderId: webhookData.orderId,
                paymentId: webhookData.paymentId,
                status: webhookData.status,
            });

            return {
                ...webhookData,
                success: true,
            };
        } catch (error) {
            paymentLogger.logError("handleWebhook", "Webhook handling failed", error);
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
