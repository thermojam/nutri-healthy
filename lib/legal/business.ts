/**
 * Реквизиты ИП — единый источник истины.
 *
 * Читаются из переменных окружения BUSINESS_* (см. .env.example).
 * Используются:
 *   - подстановкой в Markdown legal-документов через {{BUSINESS_*}}
 *   - в footer, контактных секциях, email-шаблонах, страницах оплаты
 *
 * При отсутствии env-значения возвращается пустая строка (для опциональных
 * полей вроде RKN_REG_NUMBER) или плейсхолдер с явной маркировкой.
 */

function readEnv(key: string, fallback = ""): string {
    return process.env[key]?.trim() || fallback;
}

export interface BusinessInfo {
    fullName: string;
    inn: string;
    ogrnip: string;
    phone: string;
    phoneTel: string; // нормализованный для tel: ссылок
    email: string;
    domain: string;
    address: string;
    rknRegNumber: string;
    rknRegistered: boolean;
    siteUrl: string;
}

function normalizePhoneTel(phone: string): string {
    if (!phone) return "";
    return phone.replace(/[^\d+]/g, "");
}

function normalizeSiteUrl(domain: string): string {
    if (!domain) return "";
    if (domain.startsWith("http://") || domain.startsWith("https://")) return domain;
    return `https://${domain}`;
}

export const BUSINESS: BusinessInfo = (() => {
    const phone = readEnv("BUSINESS_PHONE");
    const domain = readEnv("BUSINESS_DOMAIN");
    const rknRegNumber = readEnv("BUSINESS_RKN_REG_NUMBER");

    return {
        fullName: readEnv("BUSINESS_FULL_NAME", "ИП Каменская К."),
        inn: readEnv("BUSINESS_INN"),
        ogrnip: readEnv("BUSINESS_OGRNIP"),
        phone,
        phoneTel: normalizePhoneTel(phone),
        email: readEnv("BUSINESS_EMAIL"),
        domain,
        address: readEnv("BUSINESS_ADDRESS"),
        rknRegNumber,
        rknRegistered: rknRegNumber.length > 0,
        siteUrl: normalizeSiteUrl(domain),
    };
})();
