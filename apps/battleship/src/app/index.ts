/**
 * Application layer barrel export.
 * Re-exports all React hooks and services.
 *
 * Usage: import { useTheme, useSoundEffects } from '@/app'
 */

export { useSwipe } from '@games/app-hook-utils'
export { SoundProvider, useSoundContext } from '@games/sound-context'
export { logCrash, getCrashLogs, clearCrashLogs, markFatalCrash, getFatalCrash, clearFatalCrash } from '@games/diagnostics-utils'
export * from './haptics'
export * from './securityModules'
export * from './storageService'
export { ThemeProvider, useThemeContext } from './ThemeContext'
export * from './hooks'
