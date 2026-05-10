/**
 * Безопасное логирование платежных операций
 * Маскирует чувствительные данные (согласно 152-ФЗ, 54-ФЗ)
 */

interface SensitiveData {
  [key: string]: unknown;
}

/**
 * Маскировать чувствительные данные в логах
 */
function maskSensitiveData(data: unknown, depth: number = 0): unknown {
  if (depth > 10) return "[circular]";
  if (data === null || data === undefined) return data;

  if (typeof data === "string") {
    // Маска для API ключей и токенов
    if (data.length > 20 && (data.includes("_") || data.match(/^[a-zA-Z0-9]+$/))) {
      return data.substring(0, 4) + "*".repeat(Math.max(4, data.length - 8)) + data.slice(-4);
    }
    return data;
  }

  if (typeof data === "object") {
    if (Array.isArray(data)) {
      return data.map(item => maskSensitiveData(item, depth + 1));
    }

    const masked: SensitiveData = {};
    for (const [key, value] of Object.entries(data)) {
      const lowerKey = key.toLowerCase();

      // Чувствительные поля
      if (
        lowerKey.includes("secret") ||
        lowerKey.includes("key") ||
        lowerKey.includes("token") ||
        lowerKey.includes("password") ||
        lowerKey.includes("api") ||
        lowerKey.includes("signature")
      ) {
        const strValue = String(value);
        masked[key] = strValue.substring(0, 4) + "***" + strValue.slice(-4);
      } else if (
        lowerKey.includes("email") ||
        lowerKey.includes("phone") ||
        lowerKey.includes("card")
      ) {
        masked[key] = maskPersonalData(value);
      } else {
        masked[key] = maskSensitiveData(value, depth + 1);
      }
    }
    return masked;
  }

  return data;
}

/**
 * Маска персональных данных (152-ФЗ)
 */
function maskPersonalData(data: unknown): unknown {
  if (typeof data !== "string") return data;

  // Маска email
  if (data.includes("@")) {
    const [local, domain] = data.split("@");
    return local.substring(0, 2) + "***@" + domain;
  }

  // Маска телефона
  if (data.match(/^\+?\d{10,}/)) {
    return data.substring(0, 3) + "***" + data.slice(-4);
  }

  // Маска имени
  if (data.length > 5) {
    return data.substring(0, 2) + "*".repeat(data.length - 4) + data.slice(-2);
  }

  return data;
}

/**
 * Уровни логирования платежных операций
 */
enum LogLevel {
  DEBUG = "DEBUG",
  INFO = "INFO",
  WARN = "WARN",
  ERROR = "ERROR",
}

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  operation: string;
  message: string;
  data?: unknown;
  duration?: number;
  error?: string;
}

/**
 * Безопасный логгер для платежной системы
 */
export class PaymentSecureLogger {
  private logs: LogEntry[] = [];
  private maxLogs = 5000;
  private enableConsoleLogging = true;

  /**
   * Логирование операции платежа
   */
  logOperation(
    operation: string,
    message: string,
    data?: unknown,
    level: LogLevel = LogLevel.INFO,
    duration?: number
  ): void {
    const maskedData = data ? maskSensitiveData(data) : undefined;

    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      operation,
      message,
      data: maskedData,
      duration,
    };

    this.logs.push(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    if (this.enableConsoleLogging) {
      const logFn = this.getConsoleLogFn(level);
      logFn(`[${operation}] ${message}`, maskedData);
    }
  }

  /**
   * Логирование успешной операции
   */
  logSuccess(operation: string, message: string, data?: unknown, duration?: number): void {
    this.logOperation(operation, message, data, LogLevel.INFO, duration);
  }

  /**
   * Логирование ошибки
   */
  logError(
    operation: string,
    message: string,
    error: unknown,
    data?: unknown,
    duration?: number
  ): void {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: LogLevel.ERROR,
      operation,
      message,
      data: data ? maskSensitiveData(data) : undefined,
      duration,
      error: error instanceof Error ? error.message : String(error),
    };

    this.logs.push(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    if (this.enableConsoleLogging) {
      console.error(`[${operation}] ${message}:`, error, entry.data);
    }
  }

  /**
   * Логирование предупреждения
   */
  logWarning(operation: string, message: string, data?: unknown): void {
    this.logOperation(operation, message, data, LogLevel.WARN);
  }

  /**
   * Получить консольную функцию логирования
   */
  private getConsoleLogFn(level: LogLevel): typeof console.log {
    switch (level) {
      case LogLevel.ERROR:
        return console.error;
      case LogLevel.WARN:
        return console.warn;
      case LogLevel.DEBUG:
        return console.debug;
      default:
        return console.log;
    }
  }

  /**
   * Получить логи за период (для аудита)
   */
  getLogs(
    filter?: {
      operation?: string;
      level?: LogLevel;
      since?: Date;
    },
    limit: number = 100
  ): LogEntry[] {
    let filtered = this.logs;

    if (filter) {
      if (filter.operation) {
        filtered = filtered.filter(l => l.operation === filter.operation);
      }
      if (filter.level) {
        filtered = filtered.filter(l => l.level === filter.level);
      }
      if (filter.since) {
        filtered = filtered.filter(l => new Date(l.timestamp) >= filter.since);
      }
    }

    return filtered.slice(-limit);
  }

  /**
   * Очистить логи
   */
  clear(): void {
    this.logs = [];
  }

  /**
   * Переключить консольное логирование
   */
  setConsoleLogging(enabled: boolean): void {
    this.enableConsoleLogging = enabled;
  }
}

/**
 * Глобальный экземпляр логгера
 */
export const paymentLogger = new PaymentSecureLogger();
