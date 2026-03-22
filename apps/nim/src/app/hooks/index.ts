// Shared infrastructure (consolidated from @games/app-hook-utils)
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

// App-specific hooks
export { useGame } from './useGame'
export { useSoundEffects } from './useSoundEffects'
export { useStats } from './useStats'
export { useTheme, getThemeColorPalette } from './useTheme'
export { useSwipeGesture, useDropdownBehavior } from '@games/assets-shared/hooks'
export { useWasmParticles } from './useWasmParticles'

// Utility hooks — reusable patterns
export { useDebounce } from './useDebounce'
export { useToggle } from './useToggle'
export { useLocalStorage } from './useLocalStorage'
export { useDarkMode } from './useDarkMode'

// Capacitor native bridge — access to native Android/iOS APIs
export {
  useCapacitor,
  useAppLifecycle as useCapacitorAppLifecycle,
  useCapacitorHaptics,
  useCapacitorStorage,
} from './useCapacitor'

// Cross-platform bridges
export { usePlatform } from './usePlatform'
export { useIonicPlatform } from './useIonicPlatform'
export { useHaptics } from './useHaptics'
export { useGamePersistence } from './useGamePersistence'
export { useAppLifecycle, useAppPauseResume, useAppBeforeUnload } from './useAppLifecycle'

// Ionic hooks — notifications and dialogs
export { useIonicToast } from './useIonicToast'

export type { DeviceInfo as CapacitorDeviceInfo } from '@capacitor/device'
export type { Platform } from './usePlatform'
export type { IonicPlatformInfo } from './useIonicPlatform'