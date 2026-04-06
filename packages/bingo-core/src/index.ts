// Bingo Core Library - Shared components for bingo game variants

// Types and interfaces
export type {
  BingoNumber,
  BingoCard,
  DrawnNumbers,
  BingoPattern,
  BingoGameState,
  BingoVariantConfig,
  CardGenerationOptions,
  BingoRules,
  BingoCardProps,
  BingoDrawPanelProps,
  BingoGameProps,
  UseBingoGameReturn
} from './types.js';

// Rules and game logic
export { StandardBingoRules, createBingoRules } from './rules.js';

// Card generation and utilities
export {
  generateBingoCard,
  validateBingoCard,
  generateBingoCards,
  formatBingoCard,
  areCardsEqual,
  getCardNumbers
} from './card.js';

// Predefined variants
export {
  BINGO_75,
  BINGO_90,
  BINGO_80,
  MINI_BINGO,
  PATTERN_BINGO,
  SPEED_BINGO,
  BLACKOUT_BINGO,
  FOUR_CORNERS_BINGO,
  X_BINGO,
  T_BINGO,
  U_BINGO,
  L_BINGO,
  H_BINGO,
  CENTER_CROSS_BINGO,
  INNER_SQUARE_BINGO,
  OUTER_FRAME_BINGO,
  BINGO_VARIANTS,
  getBingoVariant,
  getBingoVariantKeys,
  getAllBingoVariants
} from './variants.js';

// UI Components
export { DrawPanel } from './ui/index.js';