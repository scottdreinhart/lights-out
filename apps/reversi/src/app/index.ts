/**
 * Reversi app layer barrel export.
 * Re-exports all React hooks and services.
 *
 * Usage: import { useGame, useTheme, useSoundEffects } from '@/app'
 */

// Local services
export { logCrash, getCrashLogs, clearCrashLogs, markFatalCrash, getFatalCrash, clearFatalCrash } from '@games/diagnostics-utils'
export * from './haptics'
export { SoundProvider, useSoundContext } from './SoundContext'
export * from './storageService'
export { ThemeProvider, useThemeContext } from './ThemeContext'

// App-specific hooks
export { useReversiApp, useSoundEffects, useStats } from './hooks'
export type { UseReversiAppReturn } from './hooks/useReversiApp'

// useGame is the canonical alias — reversi uses useReversiGame internally
export * from './securityModules'
export { useReversiGame as useGame, useReversiGame } from './hooks/useReversiGame'
