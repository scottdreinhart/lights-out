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
export { SoundProvider, useSoundContext } from '@games/sound-context'
export { logCrash, getCrashLogs, clearCrashLogs, markFatalCrash, getFatalCrash, clearFatalCrash } from '@games/diagnostics-utils'
import { vibrate } from './haptics'
import { load, loadNullable, remove, save } from './storageService'
import { ThemeProvider, useThemeContext } from './ThemeContext'

export { vibrate, load, loadNullable, remove, save, ThemeProvider, useThemeContext }

// App-specific hooks
import { securityModules, securityModulesReady } from './securityModules'
import { useGame, useTheme, useStats, useSoundEffects } from './hooks'

export { securityModules, securityModulesReady, useGame, useTheme, useStats, useSoundEffects }
export type { SoundEffects } from './hooks/useSoundEffects'
