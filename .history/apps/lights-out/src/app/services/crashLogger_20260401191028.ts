/**
 * Re-export crash logger from shared package
 */
export {
  clearCrashLogs,
  clearFatalCrash,
  getCrashLogs,
  getFatalCrash,
  logCrash,
  markFatalCrash,
} from '@games/crash-logger'
export type { CrashLogEntry, CrashLogLevel } from '@games/crash-logger'
