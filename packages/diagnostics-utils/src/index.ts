/**
 * @games/diagnostics-utils
 *
 * Shared diagnostics and logging utilities for all game apps.
 * Includes crash logging, error tracking, and development-only debugging.
 */

export { logCrash, getCrashLogs, clearCrashLogs, markFatalCrash, getFatalCrash, clearFatalCrash } from './crashLogger'
