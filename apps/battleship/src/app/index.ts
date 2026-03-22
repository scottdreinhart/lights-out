/**
 * Application layer barrel export.
 * Re-exports all React hooks and services.
 *
 * Usage: import { useTheme, useSoundEffects } from '@/app'
 */

export * from './haptics'
export * from './crashLogger'
export { SoundProvider, useSoundContext } from './SoundContext'
export * from './storageService'
export { ThemeProvider, useThemeContext } from './ThemeContext'
export { useGame } from './useGame'
export { useSoundEffects } from './useSoundEffects'
export { useStats } from './useStats'
export { useSwipe } from '@games/app-hook-utils'
