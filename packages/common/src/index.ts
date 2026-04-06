/**
 * @games/common — Shared code, patterns, and utilities for all game applications
 *
 * Exports:
 * - Shared context factories (Sound, Theme) - for new games
 * - Shared hook factories (Stats, GameBoard, SoundEffects)
 * - Shared services (Storage, Haptics, Sounds, CrashLogger)
 * - Shared UI atoms (ErrorBoundary, OfflineIndicator)
 * - Shared UI molecules (HamburgerMenu)
 * - Shared types and constants
 */

// ── Contexts (Factories for new games) ───────────────────────────────────────
export { createSoundContext } from './context/createSoundContext'
export { createThemeContext } from './context/createThemeContext'
export type { SoundContextType, ThemeContextType } from './context/types'

// ── Hooks ───────────────────────────────────────────────────────────────────
export { createUseGameBoardHook } from './hooks/createUseGameBoardHook'
export { createUseStatsHook } from './hooks/createUseStatsHook'
export type {
  SoundActionMap,
  UseGameBoardConfig,
  UseSoundEffectsConfig,
  UseStatsConfig,
} from './hooks/types'
export { useSoundEffects } from './hooks/useSoundEffects'

// ── Services ────────────────────────────────────────────────────────────────
export { createCrashLoggerService } from './services/createCrashLoggerService'
export { createHapticsService } from './services/createHapticsService'
export { createSoundsService } from './services/createSoundsService'
export { createStorageService } from './services/createStorageService'

// ── Platform (Conditional Capacitor, Electron, Web) ─────────────────────────
export { capacitor } from './platform/capacitorAdapter'
export type { CapacitorAdapter } from './platform/capacitorAdapter'

// ── UI Components ───────────────────────────────────────────────────────────
export { ErrorBoundary } from './ui/atoms/ErrorBoundary'
export { OfflineIndicator } from './ui/atoms/OfflineIndicator'
export { default as SoundToggle } from './ui/atoms/SoundToggle'
export { SudokuCell } from './ui/atoms/SudokuCell'
export { GameLogo } from './ui/atoms/GameLogo'
export type { GameLogoProps } from './ui/atoms/GameLogo'
export { HamburgerMenu } from './ui/molecules/HamburgerMenu'
export type { MenuItem } from './ui/molecules/HamburgerMenu'
export { SplashScreen } from './organisms/SplashScreen'
export type { SplashScreenProps } from './organisms/SplashScreen'
// ── Re-exports from app-hook-utils (for convenience) ───────────────────
export { useResponsiveState } from '@games/app-hook-utils'
export type { ResponsiveState } from '@games/app-hook-utils'
// ── Types ───────────────────────────────────────────────────────────────────
export type { DieValue, GameState, GameStats } from './types'
