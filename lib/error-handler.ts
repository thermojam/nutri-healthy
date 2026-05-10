import { logger } from './logger';

export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public code?: string,
    public context?: Record<string, any>,
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class ValidationError extends AppError {
  constructor(message: string, context?: Record<string, any>) {
    super(400, message, 'VALIDATION_ERROR', context);
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string, context?: Record<string, any>) {
    super(404, `${resource} not found`, 'NOT_FOUND', context);
    this.name = 'NotFoundError';
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized', context?: Record<string, any>) {
    super(401, message, 'UNAUTHORIZED', context);
    this.name = 'UnauthorizedError';
  }
}

export class RateLimitError extends AppError {
  constructor(retryAfter?: number, context?: Record<string, any>) {
    super(429, 'Too many requests', 'RATE_LIMIT_EXCEEDED', context);
    this.retryAfter = retryAfter;
    this.name = 'RateLimitError';
  }

  retryAfter?: number;
}

export function logError(error: unknown, context?: Record<string, any>): AppError {
  const appError = error instanceof AppError
    ? error
    : new AppError(500, 'Internal server error', 'INTERNAL_ERROR', context);

  logger.error(appError.message, appError as Error, {
    statusCode: appError.statusCode,
    code: appError.code,
    ...context,
  });

  return appError;
}

export async function withRetry<T>(
  operation: () => Promise<T>,
  maxAttempts = 3,
  delayMs = 1000,
): Promise<T> {
  let lastError: Error | undefined;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      if (attempt < maxAttempts) {
        await new Promise((resolve) => setTimeout(resolve, delayMs * attempt));
      }
    }
  }

  throw lastError;
}
