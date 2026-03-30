/**
 * Базовый интерфейс для всех платежных провайдеров
 * Реализует паттерн Strategy для гибкой замены платежных систем
 */

export interface PaymentData {
    orderId: string;
    amount: number;
    currency: "RUB";
    description: string;
    email?: string;
    phone?: string;
    customerName?: string;
}

export interface PaymentConfirmation {
    confirmationUrl: string;
    paymentId: string;
    status: string;
}

export interface PaymentStatus {
    paymentId: string;
    status: "pending" | "succeeded" | "canceled" | "refunded";
    amount?: number;
    paidAt?: Date;
}

export interface RefundData {
    paymentId: string;
    amount: number;
    description: string;
}

export interface RefundResult {
    refundId: string;
    status: "pending" | "succeeded" | "canceled";
}

/**
 * Абстрактный класс PaymentProvider
 * Определяет общий интерфейс для всех платежных систем
 */
export abstract class PaymentProvider {
    /**
     * Название провайдера (для администрирования)
     */
    abstract readonly name: string;

    /**
     * Код провайдера (для хранения в БД и конфиге)
     */
    abstract readonly code: string;

    /**
     * Инициализация провайдера (загрузка настроек, проверка подключения)
     */
    abstract initialize(): Promise<boolean>;

    /**
     * Создание платежа
     * @param data Данные платежа
     * @returns Данные для подтверждения оплаты
     */
    abstract createPayment(data: PaymentData): Promise<PaymentConfirmation>;

    /**
     * Получение статуса платежа
     * @param paymentId ID платежа
     * @returns Статус платежа
     */
    abstract getPaymentStatus(paymentId: string): Promise<PaymentStatus>;

    /**
     * Возврат средств
     * @param data Данные возврата
     * @returns Результат возврата
     */
    abstract refund(data: RefundData): Promise<RefundResult>;

    /**
     * Проверка доступности провайдера
     */
    abstract isAvailable(): Promise<boolean>;

    /**
     * Обработка вебхука от платежной системы
     * @param payload Тело запроса
     * @param signature Подпись запроса
     * @returns Распарсенные данные вебхука
     */
    abstract handleWebhook(payload: unknown, signature?: string): Promise<{
        orderId: string;
        status: string;
        paymentId: string;
    }>;
}

/**
 * Тип для фабрики платежных провайдеров
 */
export type PaymentProviderType = "yookassa" | "paykeeper" | "cloudpayments";

/**
 * Конфигурация для создания провайдера
 */
export interface PaymentProviderConfig {
    provider: PaymentProviderType;
    enabled: boolean;
    settings: Record<string, string>;
}
