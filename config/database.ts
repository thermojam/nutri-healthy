/**
 * Конфигурация базы данных MongoDB
 */

export const databaseConfig = {
    /**
     * URI подключения к MongoDB
     */
    uri: process.env.MONGODB_URI!,

    /**
     * Опции подключения Mongoose
     */
    options: {
        bufferCommands: false,
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        family: 4,
    },

    /**
     * Таймаут переподключения при ошибке
     */
    reconnectTimeout: 5000,

    /**
     * Максимальное количество попыток переподключения
     */
    maxReconnectAttempts: 5,
};

/**
 * Проверка наличия необходимых переменных окружения для БД
 */
export function validateDatabaseConfig(): void {
    if (!databaseConfig.uri) {
        throw new Error(
            'MONGODB_URI is not defined. Please add it to your .env.local file.'
        );
    }

    // Валидация формата URI (базовая)
    if (!databaseConfig.uri.startsWith('mongodb://') &&
        !databaseConfig.uri.startsWith('mongodb+srv://')) {
        throw new Error(
            'MONGODB_URI must start with mongodb:// or mongodb+srv://'
        );
    }
}

/**
 * Информация о регионе хранения данных (для 152-ФЗ)
 */
export const dataStorageInfo = {
    region: 'RU',
    compliance: ['152-ФЗ'],
    provider: process.env.MONGODB_PROVIDER || 'unknown',
};
