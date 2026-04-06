/**
 * Application layer barrel export.
 * Re-exports all React hooks and services.
 *
 * Usage: import { useSimonSays } from '@/app'
 */

export { useSimonSays } from './hooks'

export {
  useMediaQuery,
  useWindowSize,
  useResponsiveState,
  useDeviceInfo,
  useAppScreens,
  useServiceLoader,
  useOnlineStatus,
  useLongPress,
  usePerformanceMetrics,
  logWebVitals,
  type DeviceInfo,
  type DeviceType,
  type WindowSize,
} from '@games/app-hook-utils'

// Local services
export * from './haptics'
export * from './crashLogger'
export * from './storageService'
export { SoundProvider, useSoundContext } from './SoundContext'
export { ThemeProvider, useThemeContext } from './ThemeContext'

// App-specific hooks
export { useStats } from './useStats'
