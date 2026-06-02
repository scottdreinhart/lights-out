/**
 * Application layer barrel export.
 * Re-exports all React hooks and services.
 *
 * Usage: import { useGame, useSoundEffects } from '@/app'
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
export { computeAiMove, computeAiMoveAsync, ensureWasmReady, terminateAsyncAi } from './aiEngine'
export { logCrash, getCrashLogs, clearCrashLogs, markFatalCrash, getFatalCrash, clearFatalCrash } from '@games/diagnostics-utils'
export * from './haptics'
export { placeMinesWithEngine } from './minePlacementEngine'
export { SoundProvider, useSoundContext } from './SoundContext'
export * from './sounds'
export * from './storageService'
export { ThemeProvider, useThemeContext } from './ThemeContext'

// App-specific hooks
export { useSwipe } from '@games/app-hook-utils'
export * from './securityModules'
export * from './hooks'
export { useMinesweeperApp } from './hooks/useMinesweeperApp'
