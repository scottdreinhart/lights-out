/**
 * Application layer barrel export.
 * Re-exports all React hooks and services.
 *
 * Usage: import { useGame, useSoundEffects } from '@/app'
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
export * from './haptics'
export * from './crashLogger'
export * from './sounds'
export * from './storageService'
export { SoundProvider, useSoundContext } from './SoundContext'
export { ThemeProvider, useThemeContext } from './ThemeContext'
export { computeAiMove, computeAiMoveAsync, ensureWasmReady, terminateAsyncAi } from './aiEngine'
export { placeMinesWithEngine } from './minePlacementEngine'

// App-specific hooks
export { useGame } from './useGame'
export { useSoundEffects } from './useSoundEffects'
export { useStats } from './useStats'
export { useSwipe } from '@games/app-hook-utils'
