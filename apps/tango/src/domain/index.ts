/**
 * Tango Domain Layer
 * Public API for Tango slide puzzle logic
 */

export type {
  Board,
  Position,
  Move,
  TangoState,
  MoveResult,
  Difficulty,
  PuzzleConfig,
  SolutionStats
} from './types'

export {
  BOARD_SIZES,
  DEFAULT_SIZE,
  MIN_SIZE,
  MAX_SIZE,
  SHUFFLE_MOVES,
  TILE_COLORS,
  PUZZLE_CONFIGS,
} from './constants'
  MAX_SIZE,
  SHUFFLE_MOVES,
  TILE_COLORS,
  ANIMATION_DURATION,
  PUZZLE_CONFIGS
} from './constants'

export {
  createEmptyBoard,
  createSolvedBoard,
  findEmptyPosition,
  isValidMove,
  makeMove,
  isBoardSolved,
  getValidMoves,
  shuffleBoard,
  createTangoGameState,
  updateGameState
} from './rules'

export {
  calculateParity,
  isSolvable,
  solvePuzzleBFS,
  solvePuzzleAStar,
  generateHint,
  getSolutionStats
} from './ai'