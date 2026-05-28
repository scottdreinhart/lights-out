/**
 * @games/ui-hooks — Consolidated UI Hooks Package
 *
 * This package consolidates and standardizes UI/presentation hooks across all game apps:
 * - useTheme: Theme/mode/colorblind mode management
 * - useSoundEffects: Sound effect integration
 * - useStats: Game statistics and persistence
 * - useResponsiveState: Responsive breakpoint management
 *
 * Exports are organized into two entry points:
 * - Default export: Utilities for setting up hooks
 * - factories subpath: Factory functions for creating hook instances
 *
 * @example
 * // In an app's src/app/hooks/useTheme.ts:
 * import { createUseThemeHook } from '@games/ui-hooks/factories'
 *
 * export const useTheme = createUseThemeHook({
 *   storageKey: 'my-app-theme',
 *   // ... app-specific config
 * })
 */

export * from './utilities'

// Re-export factory functions at top level for discoverability
export {
  createUseThemeHook,
  createUseSoundEffectsHook,
  createUseContextSoundEffectsHook,
  createUseToggleableSoundEffectsHook,
  createUseStatsHook,
  useResponsiveState,
} from '@games/app-hook-utils'

export type {
  ThemeSettingsShape,
  UseThemeResult,
  StandardSoundEffects,
  ToggleableSoundEffects,
  UseStatsResult,
  ResponsiveState,
} from '@games/app-hook-utils'
