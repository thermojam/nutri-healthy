/**
 * Стратегия fallback между платежными провайдерами
 * Если основной провайдер недоступен, автоматически переключаемся на резервный
 */

import { PaymentProvider, PaymentProviderType } from "./providers/abstract-payment-provider";

interface FallbackStrategy {
  primary: PaymentProviderType;
  fallbacks: PaymentProviderType[];
}

/**
 * Менеджер fallback стратегии
 */
export class FallbackManager {
  private strategy: FallbackStrategy;
  private providerAvailability: Map<PaymentProviderType, boolean> = new Map();

  constructor(strategy: FallbackStrategy = {
    primary: "yookassa",
    fallbacks: ["paykeeper"],
  }) {
    this.strategy = strategy;
  }

  /**
   * Получить доступный провайдер (primary или fallback)
   */
  async getAvailableProvider(
    getProvider: (type: PaymentProviderType) => PaymentProvider
  ): Promise<PaymentProvider> {
    const providersToTry = [this.strategy.primary, ...this.strategy.fallbacks];

    for (const providerType of providersToTry) {
      try {
        const provider = getProvider(providerType);
        const isAvailable = await provider.isAvailable();

        this.providerAvailability.set(providerType, isAvailable);

        if (isAvailable) {
          if (providerType !== this.strategy.primary) {
            console.warn(
              `⚠️  Primary provider (${this.strategy.primary}) unavailable. Using fallback: ${providerType}`
            );
          }
          return provider;
        }
      } catch (error) {
        console.error(
          `Failed to check availability for ${providerType}:`,
          error instanceof Error ? error.message : error
        );
        this.providerAvailability.set(providerType, false);
      }
    }

    throw new Error(
      `No payment providers available. Tried: ${providersToTry.join(", ")}`
    );
  }

  /**
   * Получить статус доступности всех провайдеров
   */
  getAvailabilityStatus(): Record<PaymentProviderType, boolean | null> {
    const status: Record<string, boolean | null> = {};
    for (const providerType of [this.strategy.primary, ...this.strategy.fallbacks]) {
      status[providerType] = this.providerAvailability.get(providerType) ?? null;
    }
    return status as Record<PaymentProviderType, boolean | null>;
  }

  /**
   * Сбросить кеш доступности (для принудительной проверки)
   */
  resetAvailabilityCache(): void {
    this.providerAvailability.clear();
  }

  /**
   * Установить статус доступности провайдера
   */
  setProviderStatus(provider: PaymentProviderType, available: boolean): void {
    this.providerAvailability.set(provider, available);
  }
}

/**
 * Глобальный fallback менеджер
 */
let fallbackManager: FallbackManager | null = null;

export function getFallbackManager(): FallbackManager {
  if (!fallbackManager) {
    fallbackManager = new FallbackManager();
  }
  return fallbackManager;
}

/**
 * Установить кастомную стратегию
 */
export function setFallbackStrategy(strategy: FallbackStrategy): void {
  fallbackManager = new FallbackManager(strategy);
}

/**
 * Decorator для операций с fallback
 */
export function withFallback<T>(
  operation: (provider: PaymentProvider) => Promise<T>,
  getProvider: (type: PaymentProviderType) => PaymentProvider,
  errorCallback?: (error: Error, provider: PaymentProviderType) => void
): Promise<T> {
  return new Promise(async (resolve, reject) => {
    const manager = getFallbackManager();
    const providersToTry = [manager["strategy"].primary, ...manager["strategy"].fallbacks];

    for (const providerType of providersToTry) {
      try {
        const provider = getProvider(providerType);
        const result = await operation(provider);
        resolve(result);
        return;
      } catch (error) {
        if (errorCallback) {
          errorCallback(error as Error, providerType);
        }

        if (providerType === providersToTry[providersToTry.length - 1]) {
          reject(
            new Error(
              `All payment providers failed. Last error: ${error instanceof Error ? error.message : error}`
            )
          );
        }
      }
    }
  });
}
