/**
 * Application layer barrel export.
 * Re-exports all React hooks and services.
 *
 * Usage: import { useTheme, useSoundEffects } from '@/app'
 */

export { RESPONSIVE_BREAKPOINTS } from '@/domain'
export type {
  ContentDensity as ResponsiveContentDensity,
  NavMode as ResponsiveNavMode,
} from '@/domain'
export { useKeyboardControls, useResponsiveState, useSwipe } from '@games/app-hook-utils'
export { SoundProvider, useSoundContext } from '@games/sound-context'
export { logCrash, getCrashLogs, clearCrashLogs, markFatalCrash, getFatalCrash, clearFatalCrash } from '@games/diagnostics-utils'
export * from './aiService'
export * from './haptics'
export * from './useGame'
export * from './hooks'
export * from './securityModules'
export * from './storageService'
export { ThemeProvider, useThemeContext } from './ThemeContext'
