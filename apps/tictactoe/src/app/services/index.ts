import {
  createStorageService,
  createHapticsService,
  createSoundsService,
  createCrashLoggerService,
} from '@games/common'

// Game-specific AI engine (not in common)
export { ensureWasmReady, computeAiMove, computeAiMoveAsync } from './aiEngine'

// Create singleton instances of common services
const storage = createStorageService()
const haptics = createHapticsService()
const sounds = createSoundsService()
const crashLogger = createCrashLoggerService()

// Re-export storage methods (with convenience aliases for domain-specific names)
export const { load, save, remove, clear } = storage
export const loadStats = storage.load
export const saveStats = storage.save
export const removeStats = storage.remove
export const clearStats = storage.clear
export const loadTheme = storage.load
export const saveTheme = storage.save

// Re-export haptics methods
export const { vibrate, tick, tap, heavy, success, error } = haptics
export const playTickFeedback = haptics.tick
export const playTapFeedback = haptics.tap
export const playHeavyFeedback = haptics.heavy

// Re-export crash logger methods
export const { logError, captureException } = crashLogger

// Re-export sounds service
export { sounds }
