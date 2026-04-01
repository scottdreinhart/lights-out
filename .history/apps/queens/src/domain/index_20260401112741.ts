/**
 * Queens Domain Layer
 * Public API for N-Queens puzzle logic
 */

export type {
  Board,
  QueenPosition,
  QueensState,
  MoveResult,
  SolutionStats
} from './types'

export { Difficulty } from './types'

export {
  BOARD_SIZES,
  DEFAULT_SIZE,
  MAX_SIZE,
  MIN_SIZE,
  QUEEN_COLORS,
  BOARD_COLORS
} from './constants'

export {
  createEmptyBoard,
  isValidPlacement,
  isBoardComplete,
  isBoardSolved,
  countConflicts,
  placeQueen,
  removeQueen,
  getValidMoves,
  createGameState
} from './rules'

export {
  solveNQueens,
  findFirstSolution,
  isSolvable,
  generatePuzzle
} from './ai'