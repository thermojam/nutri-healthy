/**
 * Retry policy для платежных операций (Reliability, SLA compliance)
 */

interface RetryConfig {
  maxAttempts: number;
  initialDelayMs: number;
  maxDelayMs: number;
  backoffMultiplier: number;
  retryableStatusCodes: number[];
}

const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxAttempts: 3,
  initialDelayMs: 100,
  maxDelayMs: 5000,
  backoffMultiplier: 2,
  retryableStatusCodes: [408, 429, 500, 502, 503, 504],
};

/**
 * Определение, можно ли повторить операцию
 */
export function isRetryableError(error: unknown, statusCode?: number): boolean {
  // HTTP ошибки
  if (statusCode) {
    return DEFAULT_RETRY_CONFIG.retryableStatusCodes.includes(statusCode);
  }

  if (!error) return false;

  // Сетевые ошибки
  if (error instanceof TypeError) {
    const message = error.message.toLowerCase();
    return (
      message.includes("fetch") ||
      message.includes("network") ||
      message.includes("timeout")
    );
  }

  return false;
}

/**
 * Вычисление задержки перед повтором (exponential backoff)
 */
export function calculateBackoffDelay(
  attempt: number,
  config: RetryConfig = DEFAULT_RETRY_CONFIG
): number {
  const exponentialDelay = config.initialDelayMs * Math.pow(config.backoffMultiplier, attempt - 1);
  const jitterDelay = exponentialDelay + Math.random() * exponentialDelay * 0.1;
  return Math.min(jitterDelay, config.maxDelayMs);
}

/**
 * Wrapper для операции с retry логикой
 */
export async function withRetry<T>(
  operation: (attempt: number) => Promise<T>,
  operationName: string = "operation",
  config: RetryConfig = DEFAULT_RETRY_CONFIG
): Promise<T> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= config.maxAttempts; attempt++) {
    try {
      return await operation(attempt);
    } catch (error) {
      lastError = error;
      const statusCode = error instanceof Error && "statusCode" in error
        ? (error as any).statusCode
        : undefined;

      if (attempt < config.maxAttempts && isRetryableError(error, statusCode)) {
        const delay = calculateBackoffDelay(attempt, config);
        console.log(
          `${operationName}: Attempt ${attempt} failed, retrying in ${delay}ms...`,
          { error: error instanceof Error ? error.message : error }
        );
        await new Promise((resolve) => setTimeout(resolve, delay));
      } else {
        throw error;
      }
    }
  }

  throw lastError;
}

/**
 * Статистика retries для мониторинга
 */
export interface RetryStats {
  operationName: string;
  totalAttempts: number;
  totalRetries: number;
  successOnAttempt: number;
  totalTimeMs: number;
}

/**
 * Wrapper с метриками
 */
export async function withRetryAndMetrics<T>(
  operation: (attempt: number) => Promise<T>,
  operationName: string = "operation"
): Promise<{ result: T; stats: RetryStats }> {
  const startTime = Date.now();
  let successAttempt = 0;

  const result = await withRetry(
    async (attempt) => {
      successAttempt = attempt;
      return operation(attempt);
    },
    operationName
  );

  return {
    result,
    stats: {
      operationName,
      totalAttempts: successAttempt,
      totalRetries: successAttempt - 1,
      successOnAttempt: successAttempt,
      totalTimeMs: Date.now() - startTime,
    },
  };
}
