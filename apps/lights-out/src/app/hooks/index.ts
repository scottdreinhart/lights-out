// Import consolidat hooks from shared packages
export {
  logWebVitals,
  useAppScreens,
  useDeviceInfo,
  useDropdownBehavior,
  useKeyboardControls,
  useLongPress,
  useMediaQuery,
  useOnlineStatus,
  usePerformanceMetrics,
  usePlayableSoundActions,
  useResponsiveState,
  useServiceLoader,
  useSoundController,
  useWindowSize,
} from '@games/app-hook-utils'

// Import specialized UI hooks from assets-shared
export { useSwipeGesture } from '@games/assets-shared/hooks'

// Import local app-specific hooks
export { useGame } from './useGame'
export { useSoundEffects } from './useSoundEffects'
export { useStats } from './useStats'
export { default as useTheme } from './useTheme'

// Import Capacitor and Electron hooks (platform-specific)
export {
  useAppState,
  useIsAndroid,
  useIsCapacitor,
  useIsIOS,
  useIsWeb,
  useKeyboardManager,
  useStatusBar,
} from './useCapacitor'

export {
  useAppVersion,
  useElectron,
  useIsDevMode,
  useIsElectron,
  useWindowControls,
} from './useElectron'
