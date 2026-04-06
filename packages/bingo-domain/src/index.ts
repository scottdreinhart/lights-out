/**
 * Domain layer barrel export — game logic and rules.
 */

// Types and constants
export {
  COLUMNS,
  COLUMN_RANGES,
  GRID_SIZE,
  WINNING_PATTERNS,
  type BingoColumn,
  type BingoCard,
  type BingoCell,
  type BingoGameState,
  type DrawResult,
} from './types'

// Card operations
export {
  createBingoCard,
  createBingoCards,
  markNumber,
  getMarkedCells,
  hasCompleteRow,
  hasCompleteColumn,
  hasCompleteDiagonalLeft,
  hasCompleteDiagonalRight,
  hasFourCorners,
  isBlackout,
  isWinner,
  checkWinningPatterns,
} from './card'

// Game rules and state management
export {
  createGameState,
  drawNumber,
  drawNumbers,
  peekNextNumber,
  getRemainingNumbers,
  checkCardWin,
  getCardPatterns,
  getCardHint,
  resetGame,
  getGameStats,
} from './rules'
