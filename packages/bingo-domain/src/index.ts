/**
 * Domain layer barrel export — game logic and rules.
 */

// Types and constants
export {
  COLUMNS,
  COLUMN_RANGES,
  GRID_SIZE,
  WINNING_PATTERNS,
  type BingoCard,
  type BingoCell,
  type BingoColumn,
  type BingoGameState,
  type DrawResult,
} from './types'

// Variant configurations
export {
  BINGO_VARIANTS,
  VARIANT_IDS,
  getTimeLimit,
  getTotalNumbers,
  getVariantConfig,
  hasPowerUps,
  supportsPatternBonus,
  supportsSpeedBonus,
  type BingoVariantConfig,
  type BingoVariantId,
} from './variants'

// Card operations
export {
  checkWinningPatterns,
  createBingoCard,
  createBingoCards,
  getMarkedCells,
  hasCompleteColumn,
  hasCompleteDiagonalLeft,
  hasCompleteDiagonalRight,
  hasCompleteRow,
  hasFourCorners,
  isBlackout,
  isWinner,
  markNumber,
} from './card'

// Game rules and state management
export {
  checkCardWin,
  createGameState,
  drawNumber,
  drawNumbers,
  getCardHint,
  getCardPatterns,
  getGameStats,
  getRemainingNumbers,
  peekNextNumber,
  resetGame,
} from './rules'

// Scoring and scoring calculations
export {
  calculateScore,
  getPatternBonus,
  getPatternPoints,
  getPowerUpPenalty,
  getSpeedMultiplier,
  getSurvivalBonus,
  type ScoreBreakdown,
} from './scoring'
