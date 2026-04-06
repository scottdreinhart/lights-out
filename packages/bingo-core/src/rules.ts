// Core bingo rules and pattern checking logic

import type {
  BingoGameState,
  BingoNumber,
  BingoPattern,
  BingoRules,
  BingoVariantConfig,
  DrawnNumbers
} from './types.js';

// Standard bingo rules implementation
export class StandardBingoRules implements BingoRules {
  private variant: BingoVariantConfig;

  constructor(variant: BingoVariantConfig) {
    this.variant = variant;
  }

  isValidMove(state: BingoGameState, number: BingoNumber): boolean {
    // Number must be in valid range
    const { min, max } = this.variant.numberRange;
    if (number < min || number > max) return false;

    // Number must not already be drawn
    return !state.drawnNumbers.has(number);
  }

  checkWin(state: BingoGameState, pattern?: BingoPattern): boolean {
    if (pattern) {
      return this.checkPattern(state, pattern);
    }

    // Check all available patterns
    return this.variant.patterns.some(p => this.checkPattern(state, p));
  }

  getAvailablePatterns(state: BingoGameState): BingoPattern[] {
    return this.variant.patterns.filter(pattern => this.checkPattern(state, pattern));
  }

  calculateScore(state: BingoGameState): number {
    // Base score is number of drawn numbers
    const baseScore = state.drawnNumbers.size;

    // Bonus for completing multiple patterns
    const completedPatterns = this.getAvailablePatterns(state).length;
    const patternBonus = completedPatterns * 10;

    return baseScore + patternBonus;
  }

  private checkPattern(state: BingoGameState, pattern: BingoPattern): boolean {
    const { card } = state;
    const { rows, cols } = this.variant.cardSize;

    switch (pattern) {
      case 'full-house':
      case 'blackout':
        return this.checkFullHouse(card, state.drawnNumbers);

      case 'line-horizontal':
        return this.checkHorizontalLines(card, state.drawnNumbers, rows);

      case 'line-vertical':
        return this.checkVerticalLines(card, state.drawnNumbers, rows, cols);

      case 'line-diagonal':
        return this.checkDiagonalLines(card, state.drawnNumbers, rows, cols);

      case 'four-corners':
        return this.checkFourCorners(card, state.drawnNumbers, rows, cols);

      case 'letter-x':
        return this.checkXPattern(card, state.drawnNumbers, rows, cols);

      case 'letter-t':
        return this.checkTPattern(card, state.drawnNumbers, rows, cols);

      case 'letter-l':
        return this.checkLPattern(card, state.drawnNumbers, rows, cols);

      case 'letter-u':
        return this.checkUPattern(card, state.drawnNumbers, rows, cols);

      case 'letter-h':
        return this.checkHPattern(card, state.drawnNumbers, rows, cols);

      case 'center-cross':
        return this.checkCenterCross(card, state.drawnNumbers, rows, cols);

      case 'outer-frame':
        return this.checkOuterFrame(card, state.drawnNumbers, rows, cols);

      case 'inner-square':
        return this.checkInnerSquare(card, state.drawnNumbers, rows, cols);

      default:
        return false;
    }
  }

  private checkFullHouse(card: BingoNumber[][], drawnNumbers: DrawnNumbers): boolean {
    return card.every(row =>
      row.every(num => num === 0 || drawnNumbers.has(num))
    );
  }

  private checkHorizontalLines(card: BingoNumber[][], drawnNumbers: DrawnNumbers, rows: number): boolean {
    for (let row = 0; row < rows; row++) {
      if (card[row].every(num => num === 0 || drawnNumbers.has(num))) {
        return true;
      }
    }
    return false;
  }

  private checkVerticalLines(card: BingoNumber[][], drawnNumbers: DrawnNumbers, rows: number, cols: number): boolean {
    for (let col = 0; col < cols; col++) {
      let complete = true;
      for (let row = 0; row < rows; row++) {
        const num = card[row][col];
        if (num !== 0 && !drawnNumbers.has(num)) {
          complete = false;
          break;
        }
      }
      if (complete) return true;
    }
    return false;
  }

  private checkDiagonalLines(card: BingoNumber[][], drawnNumbers: DrawnNumbers, rows: number, cols: number): boolean {
    // Main diagonal (top-left to bottom-right)
    let mainDiagonal = true;
    for (let i = 0; i < Math.min(rows, cols); i++) {
      const num = card[i][i];
      if (num !== 0 && !drawnNumbers.has(num)) {
        mainDiagonal = false;
        break;
      }
    }
    if (mainDiagonal) return true;

    // Anti-diagonal (top-right to bottom-left)
    let antiDiagonal = true;
    for (let i = 0; i < Math.min(rows, cols); i++) {
      const num = card[i][cols - 1 - i];
      if (num !== 0 && !drawnNumbers.has(num)) {
        antiDiagonal = false;
        break;
      }
    }
    return antiDiagonal;
  }

  private checkFourCorners(card: BingoNumber[][], drawnNumbers: DrawnNumbers, rows: number, cols: number): boolean {
    const corners = [
      card[0][0],
      card[0][cols - 1],
      card[rows - 1][0],
      card[rows - 1][cols - 1]
    ];
    return corners.every(num => num === 0 || drawnNumbers.has(num));
  }

  private checkXPattern(card: BingoNumber[][], drawnNumbers: DrawnNumbers, rows: number, cols: number): boolean {
    if (rows !== cols) return false; // X pattern requires square grid

    for (let i = 0; i < rows; i++) {
      // Check main diagonal
      const mainNum = card[i][i];
      if (mainNum !== 0 && !drawnNumbers.has(mainNum)) return false;

      // Check anti-diagonal
      const antiNum = card[i][rows - 1 - i];
      if (antiNum !== 0 && !drawnNumbers.has(antiNum)) return false;
    }
    return true;
  }

  private checkTPattern(card: BingoNumber[][], drawnNumbers: DrawnNumbers, rows: number, cols: number): boolean {
    const centerCol = Math.floor(cols / 2);

    // Top row
    for (let col = 0; col < cols; col++) {
      const num = card[0][col];
      if (num !== 0 && !drawnNumbers.has(num)) return false;
    }

    // Center column
    for (let row = 0; row < rows; row++) {
      const num = card[row][centerCol];
      if (num !== 0 && !drawnNumbers.has(num)) return false;
    }

    return true;
  }

  private checkLPattern(card: BingoNumber[][], drawnNumbers: DrawnNumbers, rows: number, cols: number): boolean {
    // Left column
    for (let row = 0; row < rows; row++) {
      const num = card[row][0];
      if (num !== 0 && !drawnNumbers.has(num)) return false;
    }

    // Bottom row
    for (let col = 0; col < cols; col++) {
      const num = card[rows - 1][col];
      if (num !== 0 && !drawnNumbers.has(num)) return false;
    }

    return true;
  }

  private checkUPattern(card: BingoNumber[][], drawnNumbers: DrawnNumbers, rows: number, cols: number): boolean {
    // Left column
    for (let row = 0; row < rows; row++) {
      const num = card[row][0];
      if (num !== 0 && !drawnNumbers.has(num)) return false;
    }

    // Right column
    for (let row = 0; row < rows; row++) {
      const num = card[row][cols - 1];
      if (num !== 0 && !drawnNumbers.has(num)) return false;
    }

    // Bottom row
    for (let col = 0; col < cols; col++) {
      const num = card[rows - 1][col];
      if (num !== 0 && !drawnNumbers.has(num)) return false;
    }

    return true;
  }

  private checkHPattern(card: BingoNumber[][], drawnNumbers: DrawnNumbers, rows: number, cols: number): boolean {
    const centerRow = Math.floor(rows / 2);

    // Top row
    for (let col = 0; col < cols; col++) {
      const num = card[0][col];
      if (num !== 0 && !drawnNumbers.has(num)) return false;
    }

    // Center row
    for (let col = 0; col < cols; col++) {
      const num = card[centerRow][col];
      if (num !== 0 && !drawnNumbers.has(num)) return false;
    }

    // Bottom row
    for (let col = 0; col < cols; col++) {
      const num = card[rows - 1][col];
      if (num !== 0 && !drawnNumbers.has(num)) return false;
    }

    return true;
  }

  private checkCenterCross(card: BingoNumber[][], drawnNumbers: DrawnNumbers, rows: number, cols: number): boolean {
    const centerRow = Math.floor(rows / 2);
    const centerCol = Math.floor(cols / 2);

    // Center number
    const centerNum = card[centerRow][centerCol];
    if (centerNum !== 0 && !drawnNumbers.has(centerNum)) return false;

    // Main diagonal
    for (let i = 0; i < Math.min(rows, cols); i++) {
      const num = card[i][i];
      if (num !== 0 && !drawnNumbers.has(num)) return false;
    }

    // Anti-diagonal
    for (let i = 0; i < Math.min(rows, cols); i++) {
      const num = card[i][cols - 1 - i];
      if (num !== 0 && !drawnNumbers.has(num)) return false;
    }

    return true;
  }

  private checkOuterFrame(card: BingoNumber[][], drawnNumbers: DrawnNumbers, rows: number, cols: number): boolean {
    // Top row
    for (let col = 0; col < cols; col++) {
      const num = card[0][col];
      if (num !== 0 && !drawnNumbers.has(num)) return false;
    }

    // Bottom row
    for (let col = 0; col < cols; col++) {
      const num = card[rows - 1][col];
      if (num !== 0 && !drawnNumbers.has(num)) return false;
    }

    // Left column (excluding corners already checked)
    for (let row = 1; row < rows - 1; row++) {
      const num = card[row][0];
      if (num !== 0 && !drawnNumbers.has(num)) return false;
    }

    // Right column (excluding corners already checked)
    for (let row = 1; row < rows - 1; row++) {
      const num = card[row][cols - 1];
      if (num !== 0 && !drawnNumbers.has(num)) return false;
    }

    return true;
  }

  private checkInnerSquare(card: BingoNumber[][], drawnNumbers: DrawnNumbers, rows: number, cols: number): boolean {
    if (rows < 3 || cols < 3) return false;

    const startRow = Math.floor((rows - 3) / 2);
    const startCol = Math.floor((cols - 3) / 2);

    for (let row = startRow; row < startRow + 3; row++) {
      for (let col = startCol; col < startCol + 3; col++) {
        const num = card[row][col];
        if (num !== 0 && !drawnNumbers.has(num)) return false;
      }
    }

    return true;
  }
}

// Factory function to create rules for a variant
export function createBingoRules(variant: BingoVariantConfig): BingoRules {
  return new StandardBingoRules(variant);
}