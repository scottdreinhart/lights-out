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
export { createUseStatsHook } from './hooks/createUseStatsHook'
export { createUseGameBoardHook } from './hooks/createUseGameBoardHook'
export { useSoundEffects } from './hooks/useSoundEffects'
export type { UseStatsConfig, UseGameBoardConfig, SoundActionMap, UseSoundEffectsConfig } from './hooks/types'

// ── Services ────────────────────────────────────────────────────────────────
export { createStorageService } from './services/createStorageService'
export { createHapticsService } from './services/createHapticsService'
export { createSoundsService } from './services/createSoundsService'
export { createCrashLoggerService } from './services/createCrashLoggerService'

// ── UI Components ───────────────────────────────────────────────────────────
export { ErrorBoundary } from './ui/atoms/ErrorBoundary'
export { OfflineIndicator } from './ui/atoms/OfflineIndicator'
export { default as SoundToggle } from './ui/atoms/SoundToggle'
export { SudokuCell } from './ui/atoms/SudokuCell'
export { HamburgerMenu } from './ui/molecules/HamburgerMenu'

// ── Types ───────────────────────────────────────────────────────────────────
export type { GameStats, GameState } from './types'
