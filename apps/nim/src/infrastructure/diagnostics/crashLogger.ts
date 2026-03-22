/**
 * Crash Logger — Error and diagnostic logging
 * Uses PlatformApi for platform-agnostic diagnostics
 */

import { resolvePlatformApi } from '../platform/resolvePlatformApi'

const IS_DEV: boolean =
  typeof import.meta !== 'undefined' && (import.meta.env as Record<string, unknown>)?.DEV === true

function stringifyDetails(details: unknown): string | undefined {
  if (!details) {
    return undefined
  }
  if (details instanceof Error) {
    return details.stack ?? details.message
  }
  try {
    return JSON.stringify(details)
  } catch {
    return String(details)
  }
}

export const crashLogger = {
  /**
   * Log an error with optional context details
   */
  error(message: string, context?: Record<string, any>): void {
    const platform = resolvePlatformApi()
    const details = stringifyDetails(context)

    if (IS_DEV) {
      console.error('[CRASH LOG]', message, details)
    }

    platform.diagnostics.logError(message, context)
  },

  /**
   * Log a warning
   */
  warn(message: string): void {
    const platform = resolvePlatformApi()

    if (IS_DEV) {
      console.warn('[WARN]', message)
    }

    platform.diagnostics.logWarning(message)
  },

  /**
   * Log an informational message
   */
  info(message: string): void {
    const platform = resolvePlatformApi()

    if (IS_DEV) {
      console.log('[INFO]', message)
    }

    platform.diagnostics.logInfo(message)
  },

  /**
   * Track a custom event for analytics
   */
  trackEvent(eventName: string, data?: Record<string, any>): void {
    const platform = resolvePlatformApi()
    platform.diagnostics.trackEvent(eventName, data)
  },
}
