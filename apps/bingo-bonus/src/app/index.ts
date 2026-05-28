/**
 * Bingo Bonus App Layer
 * Reuses core hooks from @games/bingo-core
 * Bonus multiplier variant uses: useStamping, useRoundTimer, useSpeedRating
 */

export {
  useBingoCaller,
  useBingoContext,
  useBingoGame,
  useBingoPlayers,
  useBingoReactions,
  useBingoScoring,
  useRoundTimer,
  useSpeedRating,
  useStamping,
} from '@games/bingo-core/app'
export { ThemeProvider, useTheme } from '@games/theme-context'

// useGame canonical alias
export { useBingoGame as useGame } from '@games/bingo-core/app'
export * from './securityModules'
