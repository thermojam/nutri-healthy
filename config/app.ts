/**
 * Конфигурация приложения
 */

export const appConfig = {
    /**
     * Название приложения
     */
    name: 'NutriHealthy',

    /**
     * Базовый URL приложения
     */
    baseUrl: process.env.NEXT_PUBLIC_URL || 'http://localhost:3000',

    /**
     * Окружение
     */
    env: process.env.NODE_ENV || 'development',

    /**
     * Версия приложения
     */
    version: '0.1.0',

    /**
     * Настройки авторизации
     */
    auth: {
        secret: process.env.NEXTAUTH_SECRET,
        url: process.env.NEXTAUTH_URL || 'http://localhost:3000',
    },

    /**
     * Настройки email
     */
    email: {
        from: process.env.EMAIL_FROM || 'noreply@yoursite.ru',
        to: process.env.EMAIL_TO || 'info@yoursite.ru',
        provider: process.env.EMAIL_PROVIDER || 'resend',
    },

    /**
     * Настройки аналитики
     */
    analytics: {
        yandexMetrica: process.env.YANDEX_METRICA_ID,
    },
};

/**
 * Проверка критических переменных окружения
 */
export function validateAppConfig(): void {
    const required = ['MONGODB_URI'];
    const missing = required.filter(key => !process.env[key]);

    if (missing.length > 0) {
        throw new Error(
            `Missing required environment variables: ${missing.join(', ')}`
        );
    }
}

/**
 * Конфигурация для разных окружений
 */
export const environmentConfigs = {
    development: {
        debug: true,
        verboseLogging: true,
        cacheEnabled: false,
    },
    production: {
        debug: false,
        verboseLogging: false,
        cacheEnabled: true,
    },
    test: {
        debug: true,
        verboseLogging: false,
        cacheEnabled: false,
    },
};

/**
 * Получить конфигурацию для текущего окружения
 */
export function getEnvironmentConfig() {
    return environmentConfigs[appConfig.env as keyof typeof environmentConfigs]
        || environmentConfigs.development;
}
