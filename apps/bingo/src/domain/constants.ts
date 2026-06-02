/**
 * Bingo domain constants.
 * Single source of truth for all magic numbers and configuration.
 */

/** Standard bingo card grid size (5x5). */
export const GRID_SIZE = 5

/** Number range for each column in BINGO. */
export const COLUMN_RANGES = {
  B: [1, 15] as [number, number],
  I: [16, 30] as [number, number],
  N: [31, 45] as [number, number],
  G: [46, 60] as [number, number],
  O: [61, 75] as [number, number],
} as const

/** Total number of balls in a standard 75-ball bingo game. */
export const TOTAL_BALLS = 75

/** Minimum number of cards per game. */
export const MIN_CARDS = 1

/** Maximum number of cards per game. */
export const MAX_CARDS = 10

/** Supported winning patterns. */
export const WINNING_PATTERNS = [
  'horizontal',
  'vertical',
  'diagonal-left',
  'diagonal-right',
  'four-corners',
  'blackout',
] as const

export type WinningPattern = (typeof WINNING_PATTERNS)[number]
