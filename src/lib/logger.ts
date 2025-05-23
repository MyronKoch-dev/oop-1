/**
 * Simple logger utility for consistent logging format
 * This could be expanded to use a proper logging library in the future
 */

type LogContext = Record<string, unknown>;

export const logger = {
  /**
   * Log an informational message
   */
  info: (message: string, context?: LogContext) => {
    if (process.env.NODE_ENV !== "production") {
      console.log(`[INFO] ${message}`, context || "");
    }
  },

  /**
   * Log a warning message
   */
  warn: (message: string, context?: LogContext) => {
    console.warn(`[WARN] ${message}`, context || "");
  },

  /**
   * Log an error message
   */
  error: (message: string, error?: unknown) => {
    const errorInfo =
      error instanceof Error
        ? { name: error.name, message: error.message, stack: error.stack }
        : error;
    console.error(`[ERROR] ${message}`, errorInfo || "");
  },

  /**
   * Log a debug message (only in development)
   */
  debug: (message: string, context?: LogContext) => {
    if (process.env.NODE_ENV === "development") {
      console.debug(`[DEBUG] ${message}`, context || "");
    }
  },
};
