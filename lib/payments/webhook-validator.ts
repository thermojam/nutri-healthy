/**
 * Безопасная валидация вебхуков от платежных систем
 * Поддерживает versioning, timing-safe сравнение, и защиту от replay атак
 */

import crypto from "crypto";

interface WebhookValidationConfig {
  secret: string;
  version: string;
  allowedVersions?: string[];
}

interface WebhookValidationResult {
  valid: boolean;
  version: string;
  signature: string;
  timestamp: number;
  error?: string;
}

/**
 * Timing-safe сравнение строк (защита от timing attacks)
 */
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;

  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

/**
 * Валидатор вебхуков
 */
export class WebhookValidator {
  /**
   * Валидировать YooKassa вебхук
   * Подпись вычисляется как HMAC-SHA256(payload, secret)
   */
  static validateYooKassaWebhook(
    payload: string,
    signature: string,
    secret: string
  ): WebhookValidationResult {
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(payload)
      .digest("hex");

    const valid = timingSafeEqual(signature, expectedSignature);

    return {
      valid,
      version: "yookassa_v1",
      signature,
      timestamp: Date.now(),
      error: valid ? undefined : "Invalid YooKassa signature",
    };
  }

  /**
   * Валидировать PayKeeper вебхук
   * PayKeeper использует HMAC-SHA1
   */
  static validatePayKeeperWebhook(
    payload: string,
    signature: string,
    secret: string
  ): WebhookValidationResult {
    const expectedSignature = crypto
      .createHmac("sha1", secret)
      .update(payload)
      .digest("hex");

    const valid = timingSafeEqual(signature, expectedSignature);

    return {
      valid,
      version: "paykeeper_v1",
      signature,
      timestamp: Date.now(),
      error: valid ? undefined : "Invalid PayKeeper signature",
    };
  }

  /**
   * Универсальная валидация с версионированием
   */
  static validateWebhook(
    payload: unknown,
    signature: string,
    provider: "yookassa" | "paykeeper",
    secret: string
  ): WebhookValidationResult {
    const payloadString =
      typeof payload === "string" ? payload : JSON.stringify(payload);

    if (provider === "yookassa") {
      return this.validateYooKassaWebhook(payloadString, signature, secret);
    } else if (provider === "paykeeper") {
      return this.validatePayKeeperWebhook(payloadString, signature, secret);
    }

    return {
      valid: false,
      version: "unknown",
      signature,
      timestamp: Date.now(),
      error: `Unknown provider: ${provider}`,
    };
  }
}

/**
 * Детектор и защита от replay атак
 */
export class ReplayAttackProtection {
  private processedSignatures: Map<string, number> = new Map();
  private readonly expirationMs = 3600000; // 1 час
  private readonly cleanupIntervalMs = 300000; // 5 минут

  constructor() {
    // Периодическая очистка старых записей
    setInterval(() => this.cleanup(), this.cleanupIntervalMs);
  }

  /**
   * Проверить, был ли вебхук уже обработан
   */
  isReplayed(signature: string): boolean {
    return this.processedSignatures.has(signature);
  }

  /**
   * Пометить вебхук как обработанный
   */
  markProcessed(signature: string): void {
    this.processedSignatures.set(signature, Date.now());
  }

  /**
   * Очистить истекшие записи
   */
  private cleanup(): void {
    const now = Date.now();
    for (const [sig, timestamp] of this.processedSignatures.entries()) {
      if (now - timestamp > this.expirationMs) {
        this.processedSignatures.delete(sig);
      }
    }
  }

  /**
   * Получить статистику
   */
  getStats(): { processedCount: number; oldestSignatureAge: number } {
    const timestamps = Array.from(this.processedSignatures.values());
    const now = Date.now();

    return {
      processedCount: timestamps.length,
      oldestSignatureAge:
        timestamps.length > 0 ? now - Math.min(...timestamps) : 0,
    };
  }
}

/**
 * Глобальный экземпляр защиты от replay атак
 */
export const replayProtection = new ReplayAttackProtection();

/**
 * Middleware для валидации вебхука
 */
export async function validateWebhookRequest(
  payload: unknown,
  signature: string,
  provider: "yookassa" | "paykeeper",
  secret: string
): Promise<{
  valid: boolean;
  isReplayed: boolean;
  error?: string;
}> {
  // Проверяем подпись
  const validationResult = WebhookValidator.validateWebhook(
    payload,
    signature,
    provider,
    secret
  );

  if (!validationResult.valid) {
    return {
      valid: false,
      isReplayed: false,
      error: validationResult.error,
    };
  }

  // Проверяем replay атаку
  if (replayProtection.isReplayed(signature)) {
    return {
      valid: false,
      isReplayed: true,
      error: "Webhook signature already processed (replay attack detected)",
    };
  }

  // Помечаем как обработанный
  replayProtection.markProcessed(signature);

  return {
    valid: true,
    isReplayed: false,
  };
}
