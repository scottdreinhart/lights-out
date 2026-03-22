/**
 * Application layer barrel export.
 * Re-exports all React hooks and services.
 *
 * Usage: import { useTheme, useSoundEffects } from '@/app'
 */

// Shared infrastructure
export {
  useKeyboardControls,
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
export { BREAKPOINTS, SHORT_VIEWPORT_HEIGHT } from './breakpoints'
export type { BreakpointKey } from './breakpoints'
export * from './haptics'
export * from './crashLogger'
export * from './storageService'
export { SoundProvider, useSoundContext } from './SoundContext'
export { ThemeProvider, useThemeContext } from './ThemeContext'
export type { ContentDensity, NavMode, ResponsiveState } from '@/domain'

// App-specific hooks
export { useGame } from './useGame'
export type { GameCallbacks } from './useGame'
export { useGameEvents } from './useGameEvents'
export { useStats } from './useStats'
export { useSwipe } from '@games/app-hook-utils'
