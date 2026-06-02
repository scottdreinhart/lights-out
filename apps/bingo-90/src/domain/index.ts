/**
 * Domain layer barrel export — bingo-90 app.
 * Re-exports from the shared @games/bingo-core package.
 *
 * Usage: import { generateBingoCard, BINGO_VARIANTS } from '@/domain'
 */

export {
  BINGO_VARIANTS,
  StandardBingoRules,
  checkBingo,
  checkLine,
  generateBingoCard,
} from '@games/bingo-core'

export type { Board, Cell, Difficulty, GameState, Move, Theme } from '@games/bingo-core'
