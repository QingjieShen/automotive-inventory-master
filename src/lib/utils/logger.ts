/**
 * Structured Logging Utility
 * 
 * Provides structured logging with context for debugging and monitoring.
 * Supports different log levels and includes operation type, IDs, and timestamps.
 * 
 * Requirements: 11.1, 11.2, 11.3, 11.6, 11.7
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogContext {
  operation?: string;
  vehicleId?: string;
  vehicleImageId?: string;
  imageId?: string;
  imageType?: string;
  storeId?: string;
  userId?: string;
  apiEndpoint?: string;
  statusCode?: number;
  duration?: number;
  [key: string]: unknown;
}

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: LogContext;
  error?: string;
  stack?: string;
}

/**
 * Logger class for structured logging with context
 */
export class Logger {
  private serviceName: string;

  constructor(serviceName: string) {
    this.serviceName = serviceName;
  }

  /**
   * Log a debug message
   * @param message - Log message
   * @param context - Additional context
   */
  debug(message: string, context?: LogContext): void {
    this.log('debug', message, context);
  }

  /**
   * Log an info message
   * @param message - Log message
   * @param context - Additional context
   */
  info(message: string, context?: LogContext): void {
    this.log('info', message, context);
  }

  /**
   * Log a warning message
   * @param message - Log message
   * @param context - Additional context
   */
  warn(message: string, context?: LogContext): void {
    this.log('warn', message, context);
  }

  /**
   * Log an error message
   * @param message - Log message
   * @param error - Error object or message
   * @param context - Additional context
   */
  error(message: string, error?: Error | string, context?: LogContext): void {
    const errorMessage = error instanceof Error ? error.message : error;
    const stack = error instanceof Error ? error.stack : undefined;

    this.log('error', message, {
      ...context,
      error: errorMessage,
      stack,
    });
  }

  /**
   * Internal log method that formats and outputs log entries
   * @param level - Log level
   * @param message - Log message
   * @param context - Additional context
   */
  private log(level: LogLevel, message: string, context?: LogContext & { error?: string; stack?: string }): void {
    const logEntry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      context: {
        service: this.serviceName,
        ...this.sanitizeContext(context),
      },
    };

    // Extract error and stack from context if present
    if (context?.error) {
      logEntry.error = context.error;
      delete logEntry.context!.error;
    }

    if (context?.stack) {
      logEntry.stack = context.stack;
      delete logEntry.context!.stack;
    }

    // Output based on log level
    const output = JSON.stringify(logEntry, null, 2);

    switch (level) {
      case 'debug':
        console.debug(output);
        break;
      case 'info':
        console.info(output);
        break;
      case 'warn':
        console.warn(output);
        break;
      case 'error':
        console.error(output);
        break;
    }
  }

  /**
   * Sanitize context to remove sensitive data
   * 
   * Requirement 11.5: Ensure no sensitive data in logs
   * 
   * @param context - Context to sanitize
   * @returns Sanitized context
   */
  private sanitizeContext(context?: LogContext): LogContext | undefined {
    if (!context) {
      return undefined;
    }

    const sanitized = { ...context };

    // List of sensitive keys to redact
    const sensitiveKeys = [
      'apiKey',
      'apikey',
      'api_key',
      'password',
      'secret',
      'token',
      'authorization',
      'credentials',
      'key',
    ];

    // Redact sensitive values
    for (const key of Object.keys(sanitized)) {
      const lowerKey = key.toLowerCase();
      if (sensitiveKeys.some(sensitive => lowerKey.includes(sensitive))) {
        sanitized[key] = '[REDACTED]';
      }
    }

    return sanitized;
  }
}

/**
 * Create a logger instance for a specific service
 * @param serviceName - Name of the service
 * @returns Logger instance
 */
export function createLogger(serviceName: string): Logger {
  return new Logger(serviceName);
}
