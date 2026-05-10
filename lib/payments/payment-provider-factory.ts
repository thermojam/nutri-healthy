/**
 * Payment Provider Factory
 * Фабрика для создания и управления платежными провайдерами
 * Реализует паттерн Factory Method с поддержкой fallback
 */

import {
    PaymentProvider,
    PaymentProviderType,
    PaymentProviderConfig,
} from "./providers/abstract-payment-provider";
import { YooKassaPaymentProvider } from "./providers/yookassa-provider";
import { PayKeeperPaymentProvider } from "./providers/paykeeper-provider";
import { getFallbackManager } from "./fallback-strategy";

/**
 * Менеджер платежных провайдеров
 * Управляет активным провайдером и переключением между ними
 */
export class PaymentProviderManager {
    private static instance: PaymentProviderManager;
    private providers: Map<PaymentProviderType, PaymentProvider> = new Map();
    private activeProviderType: PaymentProviderType = "yookassa";
    private initialized = false;

    private constructor() {}

    /**
     * Получение единственного экземпляра (Singleton)
     */
    static getInstance(): PaymentProviderManager {
        if (!PaymentProviderManager.instance) {
            PaymentProviderManager.instance = new PaymentProviderManager();
        }
        return PaymentProviderManager.instance;
    }

    /**
     * Инициализация всех доступных провайдеров
     */
    async initialize(configs?: PaymentProviderConfig[]): Promise<void> {
        if (this.initialized) {
            return;
        }

        // Регистрируем доступные провайдеры
        this.registerProvider("yookassa", new YooKassaPaymentProvider());
        this.registerProvider("paykeeper", new PayKeeperPaymentProvider());

        // Инициализируем провайдеры
        for (const [type, provider] of this.providers) {
            try {
                const isAvailable = await provider.initialize();
                if (!isAvailable) {
                    console.warn(`Provider ${type} is not available`);
                }
            } catch (error) {
                console.error(`Failed to initialize provider ${type}:`, error);
            }
        }

        this.initialized = true;
    }

    /**
     * Регистрация провайдера
     */
    registerProvider(type: PaymentProviderType, provider: PaymentProvider): void {
        this.providers.set(type, provider);
    }

    /**
     * Получение активного провайдера с fallback поддержкой
     */
    async getActiveProvider(): Promise<PaymentProvider> {
        const fallbackManager = getFallbackManager();
        try {
            return await fallbackManager.getAvailableProvider((type) => this.getProvider(type));
        } catch (error) {
            // Fallback: вернуть основной провайдер даже если он недоступен
            const provider = this.providers.get(this.activeProviderType);
            if (provider) {
                console.warn(
                    `Fallback failed, using primary provider anyway: ${this.activeProviderType}`
                );
                return provider;
            }
            throw new Error(`Provider ${this.activeProviderType} not found`);
        }
    }

    /**
     * Получение провайдера по типу
     */
    getProvider(type: PaymentProviderType): PaymentProvider {
        const provider = this.providers.get(type);
        if (!provider) {
            throw new Error(`Provider ${type} not found`);
        }
        return provider;
    }

    /**
     * Переключение активного провайдера
     */
    async setActiveProvider(type: PaymentProviderType): Promise<boolean> {
        const provider = this.providers.get(type);
        if (!provider) {
            console.error(`Provider ${type} not found`);
            return false;
        }

        const isAvailable = await provider.isAvailable();
        if (!isAvailable) {
            console.error(`Provider ${type} is not available`);
            return false;
        }

        this.activeProviderType = type;
        console.log(`Switched to payment provider: ${type}`);
        return true;
    }

    /**
     * Получение текущего активного провайдера
     */
    getActiveProviderType(): PaymentProviderType {
        return this.activeProviderType;
    }

    /**
     * Получение списка всех доступных провайдеров
     */
    getAvailableProviders(): PaymentProviderType[] {
        return Array.from(this.providers.keys());
    }

    /**
     * Проверка доступности провайдера
     */
    async isProviderAvailable(type: PaymentProviderType): Promise<boolean> {
        const provider = this.providers.get(type);
        if (!provider) {
            return false;
        }
        return await provider.isAvailable();
    }

    /**
     * Получение статуса всех провайдеров
     */
    async getProvidersStatus(): Promise<
        Array<{ type: PaymentProviderType; name: string; available: boolean }>
    > {
        const status = [];
        for (const [type, provider] of this.providers) {
            const available = await provider.isAvailable();
            status.push({
                type,
                name: provider.name,
                available,
            });
        }
        return status;
    }
}

/**
 * Утилита для получения активного провайдера (синхронная, без fallback)
 */
export function getPaymentProvider(): PaymentProvider {
    const manager = PaymentProviderManager.getInstance();
    // Автоматическая инициализация при первом вызове
    if (!manager["initialized"]) {
        manager["initialized"] = true;

        const yookassa = new YooKassaPaymentProvider();
        const paykeeper = new PayKeeperPaymentProvider();

        manager.registerProvider("yookassa", yookassa);
        manager.registerProvider("paykeeper", paykeeper);
    }
    const provider = manager.providers.get(manager.activeProviderType);
    if (!provider) {
        throw new Error(`Provider ${manager.activeProviderType} not found`);
    }
    return provider;
}

/**
 * Утилита для получения активного провайдера (асинхронная, с fallback)
 */
export async function getPaymentProviderWithFallback(): Promise<PaymentProvider> {
    const manager = PaymentProviderManager.getInstance();
    // Автоматическая инициализация при первом вызове
    if (!manager["initialized"]) {
        manager["initialized"] = true;

        const yookassa = new YooKassaPaymentProvider();
        const paykeeper = new PayKeeperPaymentProvider();

        manager.registerProvider("yookassa", yookassa);
        manager.registerProvider("paykeeper", paykeeper);
    }
    return await manager.getActiveProvider();
}

/**
 * Утилита для переключения провайдера
 */
export async function switchPaymentProvider(
    type: PaymentProviderType
): Promise<boolean> {
    return await PaymentProviderManager.getInstance().setActiveProvider(type);
}
