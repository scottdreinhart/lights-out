/**
 * Application layer barrel export — bingo-90 app.
 * Re-exports hooks and services for the 90-ball Bingo game.
 *
 * Usage: import { useGame } from '@/app'
 */

export { useGame } from '@games/bingo-game-hooks'

export { SoundProvider, useSoundContext } from '@games/sound-context'
export { ThemeProvider, useTheme } from '@games/theme-context'
export * from './securityModules'
