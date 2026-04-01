/**
 * Общие типы приложения
 */

import type {
    IUser,
    IService,
    IOrder,
    IReceipt,
    IConsent,
    IAuditLog,
    IArticle,
    IVideo,
    IWebinar,
    ICase,
    IEducation,
    ITestimonial,
} from "@/lib/db/models/index";

// ============================================
// ЭКСПОРТ ТИПОВ ИЗ МОДЕЛЕЙ
// ============================================

export type User = IUser;
export type Service = IService;
export type Order = IOrder;
export type Receipt = IReceipt;
export type Consent = IConsent;
export type AuditLog = IAuditLog;
export type Article = IArticle;
export type Video = IVideo;
export type Webinar = IWebinar;
export type Case = ICase;
export type Education = IEducation;
export type Testimonial = ITestimonial;

// ============================================
// ТИПЫ ДЛЯ ФОРМ
// ============================================

export interface ContactFormData {
    firstName: string;
    lastName: string;
    patronymic?: string;
    email: string;
    phone?: string;
    personalDataConsent: boolean;
    contractAcceptance: boolean;
    marketingConsent?: boolean;
    marketingChannels?: ("email" | "sms" | "telegram" | "whatsapp")[];
}

export interface OrderFormData extends ContactFormData {
    serviceId: string;
    tariff: "base" | "premium" | "vip";
}

export interface SubscribeFormData {
    email: string;
    marketingConsent: boolean;
    marketingChannels: ("email" | "sms" | "telegram" | "whatsapp")[];
}

export interface FeedbackFormData {
    name: string;
    email: string;
    phone?: string;
    message: string;
    personalDataConsent: boolean;
}

export interface WithdrawConsentFormData {
    consentType: "personal_data" | "marketing" | "contract" | "cookies";
    email: string;
}

// ============================================
// ТИПЫ ДЛЯ API ОТВЕТОВ
// ============================================

export interface ApiResponse<T = unknown> {
    success: boolean;
    data?: T;
    error?: string;
    details?: unknown;
    message?: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

// ============================================
// ТИПЫ ДЛЯ КОМПОНЕНТОВ
// ============================================

export interface SectionProps {
    data?: Record<string, unknown>;
    className?: string;
}

export interface CardProps {
    title: string;
    description?: string;
    children?: React.ReactNode;
    className?: string;
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "outline" | "ghost" | "link";
    size?: "sm" | "md" | "lg";
    isLoading?: boolean;
    children: React.ReactNode;
}

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
    hint?: string;
}

export interface FormFieldProps {
    label: string;
    error?: string;
    hint?: string;
    children: React.ReactNode;
}

// ============================================
// ТИПЫ ДЛЯ ПЛАТЕЖЕЙ
// ============================================

export interface PaymentData {
    orderId: string;
    amount: number;
    currency: "RUB";
    description: string;
    email?: string;
    phone?: string;
}

export interface PaymentConfirmation {
    confirmation_url: string;
    payment_id: string;
    status: string;
}

export interface InstallmentData {
    provider: "yandex" | "dolemi";
    amount: number;
    installments: number;
    orderId: string;
}

// ============================================
// ТИПЫ ДЛЯ CHEKOV (54-ФЗ)
// ============================================

export interface ReceiptItem {
    name: string;
    quantity: number;
    price: number;
    amount: number;
    taxRate: "none" | "vat0" | "vat10" | "vat20" | "vat110" | "vat120";
    paymentMethod: "full_prepayment" | "prepayment" | "advance" | "full_payment" | "partial_payment" | "credit" | "credit_payment";
    paymentObject: "commodity" | "service" | "job" | "property_right" | "payment" | "other";
}

export interface ReceiptData {
    orderId: string;
    userId: string;
    type: "payment" | "refund";
    items: ReceiptItem[];
    total: number;
    customer: {
        email?: string;
        phone?: string;
        inn?: string;
        name?: string;
    };
}

// ============================================
// ТИПЫ ДЛЯ АУДИТА
// ============================================

export interface AuditLogData {
    userId?: string;
    action: string;
    entityType: string;
    entityId: string;
    details?: Record<string, unknown>;
    ipAddress: string;
    userAgent: string;
}

// ============================================
// ТИПЫ ДЛЯ SEO
// ============================================

export interface SeoData {
    title: string;
    description: string;
    keywords?: string[];
    ogImage?: string;
    canonical?: string;
    noindex?: boolean;
}

export interface ArticleSeo extends SeoData {
    author: string;
    publishedTime: string;
    modifiedTime?: string;
    section?: string;
    tags?: string[];
}

// ============================================
// ТИПЫ ДЛЯ НАВИГАЦИИ
// ============================================

export interface NavLink {
    href: string;
    label: string;
    icon?: string;
    external?: boolean;
}

export interface FooterLink extends NavLink {
    description?: string;
}

// ============================================
// ВСПОМОГАТЕЛЬНЫЕ ТИПЫ
// ============================================

export type Nullable<T> = T | null;

export type Optional<T, K extends keyof T> = Partial<Pick<T, K>> & Omit<T, K>;

export type ReadonlyDeep<T> = {
    readonly [K in keyof T]: ReadonlyDeep<T[K]>;
};

export type ValueOf<T> = T[keyof T];

export type AsyncFunction<T = unknown, A extends unknown[] = unknown[]> = (
    ...args: A
) => Promise<T>;

// ============================================
// ТИПЫ ДЛЯ СОРТИРОВКИ И ФИЛЬТРАЦИИ
// ============================================

export type SortOrder = "asc" | "desc";

export interface SortOptions {
    field: string;
    order: SortOrder;
}

export interface FilterOptions {
    [key: string]: string | number | boolean | string[];
}

export interface QueryOptions {
    page?: number;
    limit?: number;
    sort?: SortOptions;
    filters?: FilterOptions;
    search?: string;
}
