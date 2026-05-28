/**
 * Application layer barrel export.
 * Re-exports all React hooks and services.
 *
 * Usage: import { useThemeContext, useSoundEffects } from '@/app'
 */

export { useSwipe } from '@games/app-hook-utils'
export * from './aiService'
export { logCrash, getCrashLogs, clearCrashLogs, markFatalCrash, getFatalCrash, clearFatalCrash } from '@games/diagnostics-utils'
export * from './haptics'
export { SoundProvider, useSoundContext } from './SoundContext'
export * from './storageService'
export { ThemeProvider, useThemeContext } from './ThemeContext'
export * from './securityModules'
export * from './hooks'

// useGame is the canonical alias — mancala uses useGameState internally
export { useGameState as useGame } from './hooks'
export * from './wasmAIService'
