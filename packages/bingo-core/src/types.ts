// Core bingo types and interfaces for all variants

export type BingoNumber = number;
export type BingoCard = BingoNumber[][];
export type DrawnNumbers = Set<BingoNumber>;

// Standard bingo patterns
export type BingoPattern =
  | 'full-house'      // All numbers on card
  | 'line-horizontal' // Any horizontal line
  | 'line-vertical'   // Any vertical line
  | 'line-diagonal'   // Main diagonal
  | 'four-corners'    // Four corner numbers
  | 'letter-x'        // X pattern
  | 'letter-t'        // T pattern
  | 'letter-l'        // L pattern
  | 'letter-u'        // U pattern
  | 'letter-h'        // H pattern
  | 'center-cross'    // Center plus diagonals
  | 'outer-frame'     // Outer border
  | 'inner-square'    // Inner 3x3 square
  | 'blackout'        // All numbers (same as full-house)
  | 'custom';         // Variant-specific patterns

// Game state
export interface BingoGameState {
  card: BingoCard;
  drawnNumbers: DrawnNumbers;
  isComplete: boolean;
  winningPattern?: BingoPattern;
  score?: number;
}

// Variant configuration
export interface BingoVariantConfig {
  name: string;
  description: string;
  cardSize: { rows: number; cols: number };
  numberRange: { min: number; max: number };
  freeSpace?: { row: number; col: number };
  patterns: BingoPattern[];
  rules: string[];
  specialRules?: string[];
}

// Card generation options
export interface CardGenerationOptions {
  variant: BingoVariantConfig;
  seed?: number; // For reproducible cards
}

// Game rules interface
export interface BingoRules {
  isValidMove(state: BingoGameState, number: BingoNumber): boolean;
  checkWin(state: BingoGameState, pattern?: BingoPattern): boolean;
  getAvailablePatterns(state: BingoGameState): BingoPattern[];
  calculateScore(state: BingoGameState): number;
}

// Component props interfaces
export interface BingoCardProps {
  card: BingoCard;
  drawnNumbers: DrawnNumbers;
  variant: BingoVariantConfig;
  onNumberClick?: (number: BingoNumber) => void;
  className?: string;
}

export interface BingoDrawPanelProps {
  drawnNumbers: DrawnNumbers;
  currentNumber?: BingoNumber;
  onDrawNumber?: () => void;
  variant: BingoVariantConfig;
  className?: string;
}

export interface BingoGameProps {
  variant: BingoVariantConfig;
  onGameComplete?: (state: BingoGameState) => void;
  className?: string;
}

// Hook interfaces
export interface UseBingoGameReturn {
  gameState: BingoGameState;
  drawNumber: () => void;
  resetGame: () => void;
  isGameComplete: boolean;
  currentScore: number;
}