/**
 * Application layer barrel export.
 * Re-exports all React hooks and services.
 *
 * Usage: import { useTheme, useSoundEffects } from '@/app'
 */

export { useSwipe } from '@games/app-hook-utils'
export { SoundProvider, useSoundContext } from '@games/sound-context'
export * from './crashLogger'
export * from './haptics'
export * from './storageService'
export { ThemeProvider, useThemeContext } from './ThemeContext'
export { useGame } from './useGame'
export { useSoundEffects } from './useSoundEffects'
export { useStats } from './useStats'
