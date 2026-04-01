/**
 * Application layer barrel export.
 * Re-exports all React hooks and services.
 *
 * Usage: import { useTheme, useSoundEffects } from '@/app'
 */

// Shared infrastructure (all 10 hooks)
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

// Local services (minimal for heavily scaffolded app)
export * from './crashLogger'
export * from './haptics'
export { SoundProvider, useSoundContext } from './SoundContext'
export * from './storageService'
export { ThemeProvider, useThemeContext } from './ThemeContext'
