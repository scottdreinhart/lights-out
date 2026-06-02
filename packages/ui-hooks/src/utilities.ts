/**
 * @games/ui-hooks — Setup Utilities
 *
 * Helper functions to simplify standardized hook setup across apps.
 * These utilities reduce boilerplate when creating app-specific hook instances.
 */

import type { createUseThemeHook, createUseSoundEffectsHook, createUseStatsHook } from '@games/app-hook-utils'

/**
 * Theme hook setup helper
 *
 * Provides a standard template for creating useTheme instances.
 * Apps should extend this with their specific configuration.
 *
 * @example
 * ```tsx
 * export const useTheme = setupUseTheme({
 *   storageKey: 'my-app-theme',
 *   defaultSettings: { mode: 'dark' },
 *   colorThemes: MY_COLOR_THEMES,
 *   // ... other required fields
 * })
 * ```
 */
export interface ThemeSetupConfig {
  storageKey: string
  defaultSettings: Record<string, unknown>
  colorThemes: Record<string, unknown>
  themeColors: Record<string, string>
  createThemeLoaders: Function
  load: (key: string, defaultValue?: unknown) => unknown
  save: (key: string, value: unknown) => void
  getLayerStack?: Function
  layerStackToCssVars?: Function
  getBackgroundCssValue?: Function
  preloadAllSprites?: Function
  gameboardCssVars?: Record<string, string>
}

/**
 * Sound effects hook setup helper
 *
 * Provides a standard template for creating useSoundEffects instances.
 * Apps should provide sound functions that will be wrapped by the factory.
 *
 * @example
 * ```tsx
 * export const useSoundEffects = setupUseSoundEffects({
 *   useSoundContext,
 *   sounds: {
 *     playSelect: () => audioContext.play('select'),
 *     playConfirm: () => audioContext.play('confirm'),
 *     // ... other sounds
 *   }
 * })
 * ```
 */
export interface SoundEffectsSetupConfig {
  useSoundContext: () => unknown
  sounds: Record<string, () => void | Promise<void>>
}

/**
 * Stats hook setup helper
 *
 * Provides a standard template for creating useStats instances.
 * Apps should provide the stats type and storage configuration.
 *
 * @example
 * ```tsx
 * interface MyGameStats {
 *   wins: number
 *   losses: number
 *   draws: number
 * }
 *
 * export const useStats = setupUseStats<MyGameStats>({
 *   storageKey: 'my-app-stats',
 *   defaultStats: { wins: 0, losses: 0, draws: 0 },
 *   load,
 *   save,
 * })
 * ```
 */
export interface StatsSetupConfig<T extends Record<string, unknown>> {
  storageKey: string
  defaultStats: T
  load: (key: string, defaultValue?: unknown) => unknown
  save: (key: string, value: unknown) => void
}

/**
 * Responsive state setup helper
 *
 * useResponsiveState doesn't require setup, but we export it for consistency.
 */
export function getResponsiveStateInfo(): { description: string } {
  return {
    description: 'useResponsiveState is a built-in hook from @games/app-hook-utils. Import it directly.',
  }
}

/**
 * Standard UI hooks configuration schema
 *
 * Provides a standardized structure for apps to declare their UI hooks setup.
 */
export interface StandardUIHooksConfig {
  theme: ThemeSetupConfig
  soundEffects?: SoundEffectsSetupConfig
  stats?: StatsSetupConfig<Record<string, unknown>>
}
