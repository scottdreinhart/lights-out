/**
 * @games/ui-hooks — Consolidated UI/Presentation Hook Factories
 *
 * This module re-exports factory functions from @games/app-hook-utils
 * for creating standardized UI hooks (theme, sound effects, stats, responsive state).
 *
 * Apps should use these factories to create their hook instances:
 * ```tsx
 * import { createUseThemeHook, createUseSoundEffectsHook, createUseStatsHook } from '@games/ui-hooks/factories'
 *
 * export const useTheme = createUseThemeHook({ ... app-specific config ... })
 * export const useSoundEffects = createUseSoundEffectsHook({ ... app-specific sounds ... })
 * export const useStats = createUseStatsHook({ ... app-specific stats type ... })
 * ```
 */

export { createUseSoundEffectsHook, createUseContextSoundEffectsHook, createUseToggleableSoundEffectsHook } from '@games/app-hook-utils'
export type { StandardSoundEffects, ToggleableSoundEffects } from '@games/app-hook-utils'

export { createUseStatsHook } from '@games/app-hook-utils'
export type { UseStatsResult } from '@games/app-hook-utils'

export { createUseThemeHook } from '@games/app-hook-utils'
export type { ThemeSettingsShape, UseThemeResult } from '@games/app-hook-utils'

/**
 * useResponsiveState is already implemented as a hook, not a factory
 */
export { useResponsiveState } from '@games/app-hook-utils'
export type { ResponsiveState } from '@games/app-hook-utils'
