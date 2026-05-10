/**
 * Rate limiting для платежных операций
 * Защита от DDoS, перебора и случайных ошибок
 */

interface RateLimitConfig {
  maxRequestsPerWindow: number;
  windowSizeMs: number;
  perIdentifier?: boolean; // Лимит per orderId или глобальный
}

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

/**
 * Rate limiter для платежных операций
 */
export class PaymentRateLimiter {
  private limits: Map<string, RateLimitEntry> = new Map();
  private config: RateLimitConfig;

  constructor(config: RateLimitConfig = {
    maxRequestsPerWindow: 10, // 10 платежей
    windowSizeMs: 60000, // за минуту
    perIdentifier: true,
  }) {
    this.config = config;
  }

  /**
   * Проверить rate limit
   */
  checkLimit(identifier: string): { allowed: boolean; remaining: number; resetIn: number } {
    const now = Date.now();
    const entry = this.limits.get(identifier);

    // Если окна нет или оно истекло, создаем новое
    if (!entry || now >= entry.resetAt) {
      const newEntry: RateLimitEntry = {
        count: 1,
        resetAt: now + this.config.windowSizeMs,
      };
      this.limits.set(identifier, newEntry);
      return {
        allowed: true,
        remaining: this.config.maxRequestsPerWindow - 1,
        resetIn: this.config.windowSizeMs,
      };
    }

    // Увеличиваем счетчик
    entry.count++;

    if (entry.count > this.config.maxRequestsPerWindow) {
      const resetIn = entry.resetAt - now;
      return {
        allowed: false,
        remaining: 0,
        resetIn,
      };
    }

    return {
      allowed: true,
      remaining: this.config.maxRequestsPerWindow - entry.count,
      resetIn: entry.resetAt - now,
    };
  }

  /**
   * Сбросить лимит для идентификатора
   */
  reset(identifier: string): void {
    this.limits.delete(identifier);
  }

  /**
   * Сбросить все лимиты
   */
  resetAll(): void {
    this.limits.clear();
  }

  /**
   * Получить статистику
   */
  getStats(): { activeIdentifiers: number; totalLimits: number } {
    const now = Date.now();
    let active = 0;

    for (const entry of this.limits.values()) {
      if (now < entry.resetAt) {
        active++;
      }
    }

    return {
      activeIdentifiers: active,
      totalLimits: this.limits.size,
    };
  }

  /**
   * Очистить устаревшие entries
   */
  cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.limits.entries()) {
      if (now >= entry.resetAt) {
        this.limits.delete(key);
      }
    }
  }
}

/**
 * Разные rate limiters для разных операций
 */
export class PaymentRateLimiterManager {
  private limiters: Map<string, PaymentRateLimiter> = new Map();

  /**
   * Получить limiter для операции
   */
  getLimiter(operation: string): PaymentRateLimiter {
    if (!this.limiters.has(operation)) {
      const config = this.getConfigForOperation(operation);
      this.limiters.set(operation, new PaymentRateLimiter(config));
    }
    return this.limiters.get(operation)!;
  }

  /**
   * Конфиг для разных операций
   */
  private getConfigForOperation(operation: string): RateLimitConfig {
    switch (operation) {
      case "createPayment":
        return {
          maxRequestsPerWindow: 10,
          windowSizeMs: 60000, // 10 в минуту
          perIdentifier: true,
        };
      case "getPaymentStatus":
        return {
          maxRequestsPerWindow: 30,
          windowSizeMs: 60000, // 30 в минуту
          perIdentifier: true,
        };
      case "refund":
        return {
          maxRequestsPerWindow: 5,
          windowSizeMs: 60000, // 5 в минуту
          perIdentifier: true,
        };
      default:
        return {
          maxRequestsPerWindow: 20,
          windowSizeMs: 60000,
          perIdentifier: true,
        };
    }
  }
}

/**
 * Глобальный rate limiter manager
 */
const rateLimiterManager = new PaymentRateLimiterManager();

/**
 * Middleware для проверки rate limits
 */
export async function checkRateLimit(
  operation: string,
  identifier: string
): Promise<{ allowed: boolean; remaining: number; resetIn: number }> {
  const limiter = rateLimiterManager.getLimiter(operation);
  return limiter.checkLimit(identifier);
}

/**
 * Периодическая очистка rate limiter
 */
export function startRateLimiterCleanup(intervalMs: number = 300000): NodeJS.Timer {
  return setInterval(() => {
    for (const limiter of rateLimiterManager["limiters"].values()) {
      limiter.cleanup();
    }
  }, intervalMs);
}

/**
 * Rate limit error
 */
export class RateLimitError extends Error {
  constructor(
    public operation: string,
    public resetIn: number
  ) {
    super(`Rate limit exceeded for ${operation}. Reset in ${resetIn}ms`);
    this.name = "RateLimitError";
  }
}
