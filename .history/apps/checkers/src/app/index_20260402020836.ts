/**
 * Application layer barrel export.
 * Re-exports all React hooks and services.
 *
 * Usage: import { useTheme, useSoundEffects } from '@/app'
 */

export * from './aiService'
export * from './haptics'
export * from './crashLogger'
export { SoundProvider, useSoundContext } from './SoundContext'
export * from './storageService'
export { ThemeProvider, useThemeContext } from './ThemeContext'
export * from './useGame'
export { RESPONSIVE_BREAKPOINTS } from '@/domain'
export type {
	ContentDensity as ResponsiveContentDensity,
	NavMode as ResponsiveNavMode,
} from '@/domain'
export { useResponsiveState } from '@games/app-hook-utils'
export { useSoundEffects } from './useSoundEffects'
export { useStats } from './useStats'
export { default as useTheme } from './useTheme'
export { useSwipe } from '@games/app-hook-utils'
