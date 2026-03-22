/**
 * Crash logger service factory — error logging and reporting
 */
export function createCrashLoggerService() {
  return {
    logError: (error: Error | string, context?: Record<string, any>): void => {
      const message = typeof error === 'string' ? error : error.message
      const stack = typeof error === 'string' ? undefined : error.stack

      console.error('[APP ERROR]', message, {
        ...context,
        stack,
        timestamp: new Date().toISOString(),
      })

      // In production, would send to error tracking service (Sentry, etc.)
    },

    captureException: (error: Error | string, context?: Record<string, any>): void => {
      const message = typeof error === 'string' ? error : error.message
      const stack = typeof error === 'string' ? undefined : error.stack

      console.error('[EXCEPTION]', message, {
        ...context,
        stack,
        timestamp: new Date().toISOString(),
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
      })

      // In production, would send to error tracking service (Sentry, etc.)
    },

    logWarning: (message: string, context?: Record<string, any>): void => {
      console.warn('[APP WARNING]', message, {
        ...context,
        timestamp: new Date().toISOString(),
      })
    },

    logInfo: (message: string, context?: Record<string, any>): void => {
      console.log('[APP INFO]', message, {
        ...context,
        timestamp: new Date().toISOString(),
      })
    },
  }
}
