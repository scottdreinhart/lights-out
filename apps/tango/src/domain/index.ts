/**
 * Tango Domain Layer
 * Public API for Tango slide puzzle logic
 */

export type {
  Board,
  Difficulty,
  Move,
  MoveResult,
  Position,
  PuzzleConfig,
  SolutionStats,
  TangoState,
} from './types'

export {
  BOARD_SIZES,
  DEFAULT_SIZE,
  MAX_SIZE,
  MIN_SIZE,
  PUZZLE_CONFIGS,
  SHUFFLE_MOVES,
  TILE_COLORS,
} from './constants'

export {
  createEmptyBoard,
  createSolvedBoard,
  createTangoGameState,
  findEmptyPosition,
  getValidMoves,
  isBoardSolved,
  isValidMove,
  makeMove,
  shuffleBoard,
  updateGameState,
} from './rules'

export {
  calculateParity,
  generateHint,
  getSolutionStats,
  isSolvable,
  solvePuzzleAStar,
  solvePuzzleBFS,
} from './ai'
