/**
 * Константы приложения
 */

// ============================================
// НАВИГАЦИЯ
// ============================================

export const NAVIGATION_LINKS = [
    {href: "/#about", label: "Обо мне"},
    {href: "/#services", label: "Услуги"},
    {href: "/#cases", label: "Кейсы"},
    {href: "/#materials", label: "Материалы"},
    {href: "/#reviews", label: "Отзывы"},
    {href: "/#faq", label: "FAQ"},
    {href: "/#contact", label: "Контакты"},
] as const;

export const LEGAL_LINKS = [
    {href: "/legal/privacy-policy", label: "Политика конфиденциальности"},
    {href: "/legal/personal-data-consent", label: "Согласие на ПДн"},
    {href: "/legal/marketing-consent", label: "Согласие на рассылку"},
    {href: "/legal/contract", label: "Договор оферты"},
] as const;

export const SERVICE_LINKS = [
    {href: "/services/nutrition", label: "Нутрициология"},
    {href: "/services/health-coaching", label: "Health-коучинг"},
    {href: "/services/slavic-gymnastics", label: "Славянская гимнастика"},
] as const;

// ============================================
// СОЦИАЛЬНЫЕ СЕТИ
// ============================================

export const SOCIAL_LINKS = [
    {
        name: "Instagram",
        href: "https://instagram.com/username",
        icon: "instagram",
    },
    {
        name: "Telegram",
        href: "https://t.me/username",
        icon: "telegram",
    },
    {
        name: "YouTube",
        href: "https://youtube.com/@username",
        icon: "youtube",
    },
] as const;

// ============================================
// КОНТАКТЫ
// ============================================

export const CONTACT_INFO = {
    email: "info@yoursite.ru",
    phone: "+7 (999) 123-45-67",
    address: "г. Москва, Россия",
    workingHours: "Пн-Пт: 9:00 - 18:00",
} as const;

// ============================================
// УСЛУГИ
// ============================================

export const SERVICE_CATEGORIES = {
    NUTRITION: "nutrition",
    HEALTH_COACHING: "health_coaching",
    SLAVIC_GYMNASTICS: "slavic_gymnastics",
    OTHER: "other",
} as const;

export const SERVICE_TARIFFS = {
    BASE: "base",
    PREMIUM: "premium",
    VIP: "vip",
} as const;

export const SERVICE_FORMATS = {
    ONLINE: "online",
    OFFLINE: "offline",
    BOTH: "both",
} as const;

// ============================================
// СТАТЬИ И КОНТЕНТ
// ============================================

export const ARTICLE_CATEGORIES = {
    NUTRITION: "nutrition",
    PSYCHOLOGY: "psychology",
    WELLNESS: "wellness",
    LIFESTYLE: "lifestyle",
} as const;

export const VIDEO_CATEGORIES = {
    NUTRITION: "nutrition",
    PSYCHOLOGY: "psychology",
    WELLNESS: "wellness",
    GYMNASTICS: "gymnastics",
} as const;

// ============================================
// ПЛАТЕЖИ
// ============================================

export const PAYMENT_METHODS = {
    YOOKASSA: "yookassa",
    YANDEX_SPLIT: "yandex_split",
    DOLEMI: "dolemi",
} as const;

export const INSTALLMENT_PROVIDERS = {
    YANDEX: "yandex",
    DOLEMI: "dolemi",
} as const;

export const ORDER_STATUS = {
    PENDING: "pending",
    PAID: "paid",
    CANCELLED: "cancelled",
    REFUNDED: "refunded",
    COMPLETED: "completed",
    IN_PROGRESS: "in_progress",
} as const;

export const PAYMENT_STATUS = {
    PENDING: "pending",
    SENT: "sent",
    FAILED: "failed",
    CANCELLED: "cancelled",
} as const;

// ============================================
// ЮРИДИЧЕСКИЕ
// ============================================

export const CONSENT_TYPES = {
    PERSONAL_DATA: "personal_data",
    MARKETING: "marketing",
    CONTRACT: "contract",
    COOKIES: "cookies",
} as const;

export const MARKETING_CHANNELS = {
    EMAIL: "email",
    SMS: "sms",
    TELEGRAM: "telegram",
    WHATSAPP: "whatsapp",
} as const;

// ============================================
// НАЛОГООБЛОЖЕНИЕ (54-ФЗ)
// ============================================

export const SNO_TYPES = {
    OSN: "osn",
    USN_INCOME: "usn_income",
    USN_INCOME_OUTCOME: "usn_income_outcome",
    PATENT: "patent",
    ESI: "esi",
    NPD: "npd",
} as const;

export const TAX_RATES = {
    NONE: "none",
    VAT0: "vat0",
    VAT10: "vat10",
    VAT20: "vat20",
    VAT110: "vat110",
    VAT120: "vat120",
} as const;

export const PAYMENT_OBJECTS = {
    COMMODITY: "commodity",
    SERVICE: "service",
    JOB: "job",
    PROPERTY_RIGHT: "property_right",
    PAYMENT: "payment",
    OTHER: "other",
} as const;

// ============================================
// АУДИТ
// ============================================

export const AUDIT_ACTIONS = {
    CONSENT_GIVEN: "consent_given",
    CONSENT_WITHDRAWN: "consent_withdrawn",
    DATA_ACCESS: "data_access",
    DATA_UPDATE: "data_update",
    DATA_DELETE: "data_delete",
    LOGIN: "login",
    LOGOUT: "logout",
    PAYMENT_CREATED: "payment_created",
    RECEIPT_GENERATED: "receipt_generated",
} as const;

// ============================================
// ПРОЧЕЕ
// ============================================

export const DATE_FORMAT = {
    RU: "ru-RU",
    EN: "en-US",
} as const;

export const CURRENCY = {
    RUB: "RUB",
    USD: "USD",
    EUR: "EUR",
} as const;

export const LOCALE = {
    RU: "ru",
    EN: "en",
} as const;

export const THEME = {
    LIGHT: "light",
    DARK: "dark",
    SYSTEM: "system",
} as const;

export const ROLE = {
    CLIENT: "client",
    ADMIN: "admin",
} as const;
