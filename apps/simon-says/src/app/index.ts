/**
 * Application layer barrel export.
 * Re-exports all React hooks and services.
 *
 * Usage: import { useSimonSays } from '@/app'
 */

export * from './hooks'

export {
  logWebVitals,
  useAppScreens,
  useDeviceInfo,
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
export { logCrash, getCrashLogs, clearCrashLogs, markFatalCrash, getFatalCrash, clearFatalCrash } from '@games/diagnostics-utils'
export * from './haptics'
export { SoundProvider, useSoundContext } from './SoundContext'
export * from './storageService'
export { ThemeProvider, useThemeContext } from './ThemeContext'

// App-specific hooks
// useGame is the canonical alias — simon-says uses useSimonSays internally
export { useSimonSays as useGame } from './hooks'
export * from './securityModules'
