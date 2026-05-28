/**
 * Queens Domain Layer
 * Public API for N-Queens puzzle logic
 */

export type { Board, MoveResult, QueenPosition, QueensState, SolutionStats } from './types'

export { Difficulty } from './types'

export {
  BOARD_COLORS,
  BOARD_SIZES,
  DEFAULT_SIZE,
  MAX_SIZE,
  MIN_SIZE,
  QUEEN_COLORS,
} from './constants'

export {
  countConflicts,
  createEmptyBoard,
  createGameState,
  getValidMoves,
  isBoardComplete,
  isBoardSolved,
  isValidPlacement,
  placeQueen,
  removeQueen,
} from './rules'

export { findFirstSolution, generatePuzzle, isSolvable, solveNQueens } from './ai'
