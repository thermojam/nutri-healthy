/**
 * Валидация платежных данных (Security, 152-ФЗ, 54-ФЗ)
 */

import {PaymentData, RefundData} from "./providers/abstract-payment-provider";

interface PaymentValidationError {
    field: string;
    message: string;
}

/**
 * Валидация данных платежа
 */
export function validatePaymentData(data: PaymentData): PaymentValidationError[] {
    const errors: PaymentValidationError[] = [];

    // Валидация orderId (UUID формат, защита от injection)
    if (!data.orderId || typeof data.orderId !== "string") {
        errors.push({field: "orderId", message: "Order ID required"});
    } else if (!/^[a-f0-9\-]{36}$/i.test(data.orderId) && !/^\d+$/.test(data.orderId)) {
        errors.push({field: "orderId", message: "Invalid order ID format"});
    }

    // Валидация суммы
    if (!data.amount || data.amount <= 0) {
        errors.push({field: "amount", message: "Amount must be greater than 0"});
    } else if (data.amount > 999999999) {
        errors.push({field: "amount", message: "Amount exceeds maximum limit"});
    } else if (!/^\d+(\.\d{1,2})?$/.test(data.amount.toString())) {
        errors.push({field: "amount", message: "Invalid amount format (max 2 decimal places)"});
    }

    // Валидация currency
    if (data.currency !== "RUB") {
        errors.push({field: "currency", message: "Only RUB currency supported"});
    }

    // Валидация description (защита от HTML/SQL injection)
    if (!data.description || typeof data.description !== "string") {
        errors.push({field: "description", message: "Description required"});
    } else if (data.description.length > 1000) {
        errors.push({field: "description", message: "Description exceeds maximum length (1000)"});
    } else if (/<[a-z][\s\S]*>/i.test(data.description)) {
        errors.push({field: "description", message: "HTML tags not allowed"});
    }

    // Валидация email (ст. 11 152-ФЗ)
    if (data.email) {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
            errors.push({field: "email", message: "Invalid email format"});
        }
    }

    // Валидация телефона (ст. 11 152-ФЗ)
    if (data.phone) {
        if (!/^[\d\+\-\(\)\s]{10,20}$/.test(data.phone)) {
            errors.push({field: "phone", message: "Invalid phone format"});
        }
    }

    // Валидация имени (защита от injection)
    if (data.customerName) {
        if (data.customerName.length > 100) {
            errors.push({field: "customerName", message: "Name exceeds maximum length"});
        }
    }

    return errors;
}

/**
 * Валидация данных возврата
 */
export function validateRefundData(data: RefundData): PaymentValidationError[] {
    const errors: PaymentValidationError[] = [];

    if (!data.paymentId) {
        errors.push({field: "paymentId", message: "Payment ID required"});
    }

    if (!data.amount || data.amount <= 0) {
        errors.push({field: "amount", message: "Refund amount must be greater than 0"});
    }

    if (!data.description || data.description.length === 0) {
        errors.push({field: "description", message: "Refund reason required"});
    }

    return errors;
}

/**
 * Приведение платежных данных к безопасному виду
 */
export function sanitizePaymentData(data: PaymentData): PaymentData {
    return {
        orderId: data.orderId.trim(),
        amount: Math.round(data.amount * 100) / 100, // Корректировка до 2 знаков
        currency: data.currency,
        description: data.description.trim().substring(0, 1000),
        email: data.email?.trim().toLowerCase(),
        phone: data.phone?.trim(),
        customerName: data.customerName?.trim(),
    };
}

/**
 * Валидатор как middleware
 */
export function createPaymentValidator() {
    return {
        validate: (data: PaymentData) => {
            const errors = validatePaymentData(data);
            if (errors.length > 0) {
                throw new ValidationError("Payment validation failed", errors);
            }
            return sanitizePaymentData(data);
        },
    };
}

/**
 * Кастомная ошибка валидации
 */
export class ValidationError extends Error {
    constructor(
        public message: string,
        public errors?: PaymentValidationError[]
    ) {
        super(message);
        this.name = "ValidationError";
    }
}
