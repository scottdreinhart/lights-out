/**
 * Application layer barrel export.
 * Re-exports all React hooks and services.
 *
 * Usage: import { useThemeContext, useSoundEffects } from '@/app'
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
export { SoundProvider, useSoundContext } from '@games/sound-context'
export * from './connectFourAiService'
export { logCrash, getCrashLogs, clearCrashLogs, markFatalCrash, getFatalCrash, clearFatalCrash } from '@games/diagnostics-utils'
export * from './haptics'
export * from './storageService'
export { ThemeProvider, useThemeContext } from './ThemeContext'

// App-specific hooks
export { useSwipe } from '@games/app-hook-utils'
export * from './securityModules'
export { useConnectFourApp, useGame, useStats } from './hooks'
export type { UseConnectFourAppReturn } from './hooks/useConnectFourApp'
