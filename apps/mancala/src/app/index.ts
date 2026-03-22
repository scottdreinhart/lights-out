/**
 * Application layer barrel export.
 * Re-exports all React hooks and services.
 *
 * Usage: import { useThemeContext, useSoundEffects } from '@/app'
 */

export * from './aiService'
export * from './crashLogger'
export * from './haptics'
export { SoundProvider, useSoundContext } from './SoundContext'
export { useSoundEffects } from './useSoundEffects'
export * from './storageService'
export { ThemeProvider, useThemeContext } from './ThemeContext'
export { useGameState } from './useGameState'
export type { GameStateHook } from './useGameState'
export { useStats } from './useStats'
export { useSwipe } from '@games/app-hook-utils'
export * from './wasmAIService'
