/**
 * Application layer barrel export.
 * Re-exports all React hooks and services.
 *
 * Usage: import { useTheme, useSoundEffects } from '@/app'
 */

// Shared infrastructure
export {
  logWebVitals,
  useAppScreens,
  useDeviceInfo,
  useKeyboardControls,
  useLongPress,
  useMediaQuery,
  useOnlineStatus,
  usePerformanceMetrics,
  useResponsiveState,
  useServiceLoader,
  useWindowSize,
  type DeviceInfo,
  type DeviceType,
  type WindowSize,
} from '@games/app-hook-utils'

// Local services
export type { ContentDensity, NavMode, ResponsiveState } from '@/domain'
export { SoundProvider, useSoundContext } from '@games/sound-context'
export { BREAKPOINTS, SHORT_VIEWPORT_HEIGHT } from './breakpoints'
export type { BreakpointKey } from './breakpoints'
export { logCrash, getCrashLogs, clearCrashLogs, markFatalCrash, getFatalCrash, clearFatalCrash } from '@games/diagnostics-utils'
export * from './haptics'
export * from './storageService'
export { ThemeProvider, useThemeContext } from './ThemeContext'

// App-specific hooks
export { useSwipe } from '@games/app-hook-utils'
export * from './securityModules'
export * from './hooks'
