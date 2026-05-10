type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: Record<string, any>;
  error?: Error;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';

  private formatLog(entry: LogEntry): string {
    const { timestamp, level, message, context } = entry;
    let log = `[${timestamp}] ${level.toUpperCase()}: ${message}`;
    if (context) {
      log += ` ${JSON.stringify(context)}`;
    }
    return log;
  }

  debug(message: string, context?: Record<string, any>): void {
    if (this.isDevelopment) {
      const entry: LogEntry = {
        timestamp: new Date().toISOString(),
        level: 'debug',
        message,
        context,
      };
      console.debug(this.formatLog(entry));
    }
  }

  info(message: string, context?: Record<string, any>): void {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: 'info',
      message,
      context,
    };
    console.info(this.formatLog(entry));
  }

  warn(message: string, context?: Record<string, any>): void {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: 'warn',
      message,
      context,
    };
    console.warn(this.formatLog(entry));
  }

  error(message: string, error?: Error, context?: Record<string, any>): void {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: 'error',
      message,
      context,
      error,
    };
    const logMessage = this.formatLog(entry);
    if (error) {
      console.error(logMessage, error.stack);
    } else {
      console.error(logMessage);
    }
  }
}

export const logger = new Logger();
