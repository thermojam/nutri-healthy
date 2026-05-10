/**
 * Метрики платежной системы для мониторинга и аналитики
 * Отслеживаются: успешные платежи, ошибки, время ответа, конверсия
 */

interface PaymentMetric {
  timestamp: number;
  operationName: string;
  duration: number;
  success: boolean;
  provider: string;
  amount?: number;
  errorCode?: string;
}

interface MetricsStats {
  total: number;
  succeeded: number;
  failed: number;
  successRate: number;
  avgDuration: number;
  by_provider: Record<string, MetricsStats>;
}

class PaymentMetricsCollector {
  private metrics: PaymentMetric[] = [];
  private maxMetrics = 10000; // Кеш последних 10000 метрик

  /**
   * Записать метрику операции
   */
  recordMetric(metric: PaymentMetric): void {
    this.metrics.push({
      ...metric,
      timestamp: metric.timestamp || Date.now(),
    });

    // Очистка старых метрик если превышен лимит
    if (this.metrics.length > this.maxMetrics) {
      this.metrics = this.metrics.slice(-this.maxMetrics);
    }
  }

  /**
   * Получить статистику за последний период
   */
  getStats(timeWindowMs: number = 3600000): MetricsStats {
    const now = Date.now();
    const recentMetrics = this.metrics.filter(m => now - m.timestamp <= timeWindowMs);

    if (recentMetrics.length === 0) {
      return {
        total: 0,
        succeeded: 0,
        failed: 0,
        successRate: 0,
        avgDuration: 0,
        by_provider: {},
      };
    }

    const succeeded = recentMetrics.filter(m => m.success).length;
    const by_provider: Record<string, MetricsStats> = {};

    // Группируем по провайдерам
    for (const provider of Array.from(new Set(recentMetrics.map(m => m.provider)))) {
      const providerMetrics = recentMetrics.filter(m => m.provider === provider);
      const providerSucceeded = providerMetrics.filter(m => m.success).length;

      by_provider[provider] = {
        total: providerMetrics.length,
        succeeded: providerSucceeded,
        failed: providerMetrics.length - providerSucceeded,
        successRate: (providerSucceeded / providerMetrics.length) * 100,
        avgDuration:
          providerMetrics.reduce((sum, m) => sum + m.duration, 0) / providerMetrics.length,
        by_provider: {},
      };
    }

    return {
      total: recentMetrics.length,
      succeeded,
      failed: recentMetrics.length - succeeded,
      successRate: (succeeded / recentMetrics.length) * 100,
      avgDuration:
        recentMetrics.reduce((sum, m) => sum + m.duration, 0) / recentMetrics.length,
      by_provider,
    };
  }

  /**
   * Получить метрики по типам ошибок
   */
  getErrorStats(timeWindowMs: number = 3600000): Record<string, number> {
    const now = Date.now();
    const recentErrors = this.metrics.filter(
      m => !m.success && now - m.timestamp <= timeWindowMs
    );

    const errorStats: Record<string, number> = {};
    for (const metric of recentErrors) {
      const errorCode = metric.errorCode || "unknown";
      errorStats[errorCode] = (errorStats[errorCode] || 0) + 1;
    }

    return errorStats;
  }

  /**
   * Очистить все метрики
   */
  clear(): void {
    this.metrics = [];
  }

  /**
   * Получить все метрики (для debug)
   */
  getAll(limit: number = 100): PaymentMetric[] {
    return this.metrics.slice(-limit);
  }
}

/**
 * Глобальный экземпляр collector
 */
export const paymentMetrics = new PaymentMetricsCollector();

/**
 * Wrapper функция для записи метрик операции
 */
export async function recordPaymentOperation<T>(
  operation: () => Promise<T>,
  operationName: string,
  provider: string,
  amount?: number
): Promise<T> {
  const startTime = Date.now();

  try {
    const result = await operation();
    const duration = Date.now() - startTime;

    paymentMetrics.recordMetric({
      timestamp: Date.now(),
      operationName,
      duration,
      success: true,
      provider,
      amount,
    });

    return result;
  } catch (error) {
    const duration = Date.now() - startTime;
    const errorCode = error instanceof Error ? error.constructor.name : "UnknownError";

    paymentMetrics.recordMetric({
      timestamp: Date.now(),
      operationName,
      duration,
      success: false,
      provider,
      amount,
      errorCode,
    });

    throw error;
  }
}

/**
 * API endpoint для получения метрик (для мониторинга/аналитики)
 */
export function getPaymentMetricsSnapshot() {
  return {
    stats: paymentMetrics.getStats(),
    errors: paymentMetrics.getErrorStats(),
    timestamp: Date.now(),
  };
}
