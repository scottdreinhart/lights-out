/**
 * Re-export crash logger from shared package
 */
export { logCrash, getCrashLogs, clearCrashLogs, markFatalCrash, getFatalCrash, clearFatalCrash } from '@games/crash-logger'
export type { CrashLogLevel, CrashLogEntry } from '@games/crash-logger'
