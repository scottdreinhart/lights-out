// Predefined bingo variant configurations

import type { BingoVariantConfig } from './types.js';

// Standard 75-ball bingo (5x5 grid, numbers 1-75)
export const BINGO_75: BingoVariantConfig = {
  name: '75-Ball Bingo',
  description: 'Classic American bingo with 5x5 card and numbers 1-75',
  cardSize: { rows: 5, cols: 5 },
  numberRange: { min: 1, max: 75 },
  freeSpace: { row: 2, col: 2 },
  patterns: ['full-house', 'line-horizontal', 'line-vertical', 'line-diagonal', 'four-corners'],
  rules: [
    '5x5 grid with numbers 1-75',
    'Center square is free space',
    'Numbers distributed: B(1-15), I(16-30), N(31-45), G(46-60), O(61-75)',
    'First to complete a winning pattern wins'
  ]
};

// 90-ball bingo (9x3 grid, numbers 1-90)
export const BINGO_90: BingoVariantConfig = {
  name: '90-Ball Bingo',
  description: 'British-style bingo with 9x3 card and numbers 1-90',
  cardSize: { rows: 3, cols: 9 },
  numberRange: { min: 1, max: 90 },
  patterns: ['line-horizontal', 'line-vertical', 'full-house'],
  rules: [
    '3x3 grid with numbers 1-90',
    'No free spaces',
    'Numbers called randomly',
    'First to complete a line or full house wins'
  ]
};

// 80-ball bingo (4x4 grid, numbers 1-80)
export const BINGO_80: BingoVariantConfig = {
  name: '80-Ball Bingo',
  description: 'Swedish-style bingo with 4x4 card and numbers 1-80',
  cardSize: { rows: 4, cols: 4 },
  numberRange: { min: 1, max: 80 },
  patterns: ['line-horizontal', 'line-vertical', 'line-diagonal', 'full-house'],
  rules: [
    '4x4 grid with numbers 1-80',
    'No free spaces',
    'Numbers called randomly',
    'Multiple winning patterns available'
  ]
};

// Mini bingo (3x3 grid, numbers 1-25)
export const MINI_BINGO: BingoVariantConfig = {
  name: 'Mini Bingo',
  description: 'Quick 3x3 bingo for short games',
  cardSize: { rows: 3, cols: 3 },
  numberRange: { min: 1, max: 25 },
  patterns: ['line-horizontal', 'line-vertical', 'line-diagonal', 'full-house'],
  rules: [
    '3x3 grid with numbers 1-25',
    'No free spaces',
    'Fast-paced gameplay',
    'Good for beginners or quick rounds'
  ]
};

// Pattern bingo (5x5 with special patterns)
export const PATTERN_BINGO: BingoVariantConfig = {
  name: 'Pattern Bingo',
  description: '75-ball bingo with special winning patterns',
  cardSize: { rows: 5, cols: 5 },
  numberRange: { min: 1, max: 75 },
  freeSpace: { row: 2, col: 2 },
  patterns: ['letter-x', 'letter-t', 'letter-l', 'letter-u', 'letter-h', 'four-corners', 'outer-frame'],
  rules: [
    '5x5 grid with numbers 1-75',
    'Center square is free space',
    'Special patterns: X, T, L, U, H shapes',
    'Four corners and outer frame patterns',
    'More challenging than standard bingo'
  ]
};

// Speed bingo (5x5, faster gameplay)
export const SPEED_BINGO: BingoVariantConfig = {
  name: 'Speed Bingo',
  description: 'Fast-paced bingo with quicker number calling',
  cardSize: { rows: 5, cols: 5 },
  numberRange: { min: 1, max: 75 },
  freeSpace: { row: 2, col: 2 },
  patterns: ['line-horizontal', 'line-vertical'],
  rules: [
    '5x5 grid with numbers 1-75',
    'Center square is free space',
    'Numbers called every 3-5 seconds',
    'Only horizontal and vertical lines count',
    'Race against time to complete patterns'
  ]
};

// Blackout bingo (5x5, all squares must be marked)
export const BLACKOUT_BINGO: BingoVariantConfig = {
  name: 'Blackout Bingo',
  description: 'Challenging bingo where all squares must be marked',
  cardSize: { rows: 5, cols: 5 },
  numberRange: { min: 1, max: 75 },
  freeSpace: { row: 2, col: 2 },
  patterns: ['blackout'],
  rules: [
    '5x5 grid with numbers 1-75',
    'Center square is free space',
    'All squares must be marked to win',
    'Longer games, higher stakes',
    'Requires patience and good number tracking'
  ]
};

// Four corners bingo
export const FOUR_CORNERS_BINGO: BingoVariantConfig = {
  name: 'Four Corners Bingo',
  description: 'Simple bingo focusing on corner squares',
  cardSize: { rows: 5, cols: 5 },
  numberRange: { min: 1, max: 75 },
  freeSpace: { row: 2, col: 2 },
  patterns: ['four-corners'],
  rules: [
    '5x5 grid with numbers 1-75',
    'Center square is free space',
    'Only four corner squares need to be marked',
    'Quick games, good for multiple rounds',
    'Easy to understand for beginners'
  ]
};

// X bingo (diagonal pattern)
export const X_BINGO: BingoVariantConfig = {
  name: 'X Bingo',
  description: 'Bingo with X-shaped winning pattern',
  cardSize: { rows: 5, cols: 5 },
  numberRange: { min: 1, max: 75 },
  freeSpace: { row: 2, col: 2 },
  patterns: ['letter-x'],
  rules: [
    '5x5 grid with numbers 1-75',
    'Center square is free space',
    'X pattern: both diagonals must be complete',
    'Challenging pattern requiring strategy',
    'Good for experienced players'
  ]
};

// T bingo (T-shaped pattern)
export const T_BINGO: BingoVariantConfig = {
  name: 'T Bingo',
  description: 'Bingo with T-shaped winning pattern',
  cardSize: { rows: 5, cols: 5 },
  numberRange: { min: 1, max: 75 },
  freeSpace: { row: 2, col: 2 },
  patterns: ['letter-t'],
  rules: [
    '5x5 grid with numbers 1-75',
    'Center square is free space',
    'T pattern: top row + center column',
    'Unique pattern requiring careful tracking',
    'Adds variety to standard bingo'
  ]
};

// U bingo (U-shaped pattern)
export const U_BINGO: BingoVariantConfig = {
  name: 'U Bingo',
  description: 'Bingo with U-shaped winning pattern',
  cardSize: { rows: 5, cols: 5 },
  numberRange: { min: 1, max: 75 },
  freeSpace: { row: 2, col: 2 },
  patterns: ['letter-u'],
  rules: [
    '5x5 grid with numbers 1-75',
    'Center square is free space',
    'U pattern: sides + bottom row',
    'Interesting pattern for variety',
    'Good for themed bingo nights'
  ]
};

// L bingo (L-shaped pattern)
export const L_BINGO: BingoVariantConfig = {
  name: 'L Bingo',
  description: 'Bingo with L-shaped winning pattern',
  cardSize: { rows: 5, cols: 5 },
  numberRange: { min: 1, max: 75 },
  freeSpace: { row: 2, col: 2 },
  patterns: ['letter-l'],
  rules: [
    '5x5 grid with numbers 1-75',
    'Center square is free space',
    'L pattern: left column + bottom row',
    'Classic pattern variation',
    'Easy to visualize and track'
  ]
};

// H bingo (H-shaped pattern)
export const H_BINGO: BingoVariantConfig = {
  name: 'H Bingo',
  description: 'Bingo with H-shaped winning pattern',
  cardSize: { rows: 5, cols: 5 },
  numberRange: { min: 1, max: 75 },
  freeSpace: { row: 2, col: 2 },
  patterns: ['letter-h'],
  rules: [
    '5x5 grid with numbers 1-75',
    'Center square is free space',
    'H pattern: top + center + bottom rows',
    'Challenging horizontal pattern',
    'Requires good number distribution tracking'
  ]
};

// Center cross bingo
export const CENTER_CROSS_BINGO: BingoVariantConfig = {
  name: 'Center Cross Bingo',
  description: 'Bingo with center plus diagonal cross pattern',
  cardSize: { rows: 5, cols: 5 },
  numberRange: { min: 1, max: 75 },
  freeSpace: { row: 2, col: 2 },
  patterns: ['center-cross'],
  rules: [
    '5x5 grid with numbers 1-75',
    'Center square is free space',
    'Pattern: center + both diagonals',
    'Complex pattern for advanced players',
    'Requires strategic number tracking'
  ]
};

// Inner square bingo
export const INNER_SQUARE_BINGO: BingoVariantConfig = {
  name: 'Inner Square Bingo',
  description: 'Bingo with inner 3x3 square pattern',
  cardSize: { rows: 5, cols: 5 },
  numberRange: { min: 1, max: 75 },
  freeSpace: { row: 2, col: 2 },
  patterns: ['inner-square'],
  rules: [
    '5x5 grid with numbers 1-75',
    'Center square is free space',
    'Inner 3x3 square must be complete',
    'Focuses on center of the card',
    'Good for players who prefer center numbers'
  ]
};

// Outer frame bingo
export const OUTER_FRAME_BINGO: BingoVariantConfig = {
  name: 'Outer Frame Bingo',
  description: 'Bingo with outer border frame pattern',
  cardSize: { rows: 5, cols: 5 },
  numberRange: { min: 1, max: 75 },
  freeSpace: { row: 2, col: 2 },
  patterns: ['outer-frame'],
  rules: [
    '5x5 grid with numbers 1-75',
    'Center square is free space',
    'Outer border must be complete',
    'Ignores center numbers',
    'Good for edge number preference'
  ]
};

// Registry of all available variants
export const BINGO_VARIANTS: Record<string, BingoVariantConfig> = {
  '75-ball': BINGO_75,
  '90-ball': BINGO_90,
  '80-ball': BINGO_80,
  'mini': MINI_BINGO,
  'pattern': PATTERN_BINGO,
  'speed': SPEED_BINGO,
  'blackout': BLACKOUT_BINGO,
  'four-corners': FOUR_CORNERS_BINGO,
  'x-bingo': X_BINGO,
  't-bingo': T_BINGO,
  'u-bingo': U_BINGO,
  'l-bingo': L_BINGO,
  'h-bingo': H_BINGO,
  'center-cross': CENTER_CROSS_BINGO,
  'inner-square': INNER_SQUARE_BINGO,
  'outer-frame': OUTER_FRAME_BINGO
};

// Get variant by key
export function getBingoVariant(key: string): BingoVariantConfig | undefined {
  return BINGO_VARIANTS[key];
}

// Get all variant keys
export function getBingoVariantKeys(): string[] {
  return Object.keys(BINGO_VARIANTS);
}

// Get all variants
export function getAllBingoVariants(): BingoVariantConfig[] {
  return Object.values(BINGO_VARIANTS);
}