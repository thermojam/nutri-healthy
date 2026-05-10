/**
 * Платежная конфигурация с поддержкой test/live режимов
 * Единая переменная ENV_TYPE переключает все провайдеры и endpoints
 */

export type EnvironmentType = "test" | "live";

interface ProviderConfig {
  shopId: string;
  apiKey: string;
  webhookSecret: string;
  apiBaseUrl: string;
  returnUrl: string;
}

interface PaymentConfig {
  env: EnvironmentType;
  yookassa: ProviderConfig;
  paykeeper: ProviderConfig;
}

/**
 * Загрузка конфига на основе ENV_TYPE
 */
export function loadPaymentConfig(): PaymentConfig {
  const envType = (process.env.PAYMENT_ENV_TYPE || "test") as EnvironmentType;

  if (envType === "live" && !process.env.YOOKASSA_LIVE_SHOP_ID) {
    console.warn(
      "⚠️  PAYMENT_ENV_TYPE=live, но YOOKASSA_LIVE_SHOP_ID не установлен. Используется тестовый режим."
    );
  }

  const returnUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";

  return {
    env: envType,
    yookassa: {
      shopId:
        envType === "live"
          ? process.env.YOOKASSA_LIVE_SHOP_ID || ""
          : process.env.YOOKASSA_TEST_SHOP_ID || "",
      apiKey:
        envType === "live"
          ? process.env.YOOKASSA_LIVE_API_KEY || ""
          : process.env.YOOKASSA_TEST_API_KEY || "",
      webhookSecret:
        envType === "live"
          ? process.env.YOOKASSA_LIVE_WEBHOOK_SECRET || ""
          : process.env.YOOKASSA_TEST_WEBHOOK_SECRET || "",
      apiBaseUrl: "https://api.yookassa.ru/v3",
      returnUrl: `${returnUrl}/payment/success`,
    },
    paykeeper: {
      shopId:
        envType === "live"
          ? process.env.PAYKEEPER_LIVE_SHOP_ID || ""
          : process.env.PAYKEEPER_TEST_SHOP_ID || "",
      apiKey:
        envType === "live"
          ? process.env.PAYKEEPER_LIVE_API_KEY || ""
          : process.env.PAYKEEPER_TEST_API_KEY || "",
      webhookSecret:
        envType === "live"
          ? process.env.PAYKEEPER_LIVE_WEBHOOK_SECRET || ""
          : process.env.PAYKEEPER_TEST_WEBHOOK_SECRET || "",
      apiBaseUrl:
        envType === "live"
          ? "https://api.paykeeper.ru/api/v1"
          : "https://sandbox.paykeeper.ru/api/v1",
      returnUrl: `${returnUrl}/payment/success`,
    },
  };
}

/**
 * Кеширование конфига для переиспользования в приложении
 */
let cachedConfig: PaymentConfig | null = null;

export function getPaymentConfig(): PaymentConfig {
  if (!cachedConfig) {
    cachedConfig = loadPaymentConfig();
  }
  return cachedConfig;
}

/**
 * Сброс кеша (для тестирования)
 */
export function resetPaymentConfig(): void {
  cachedConfig = null;
}
