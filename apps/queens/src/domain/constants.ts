/**
 * N-Queens Constants
 */

import { Difficulty } from './types'

/**
 * Board sizes for each difficulty
 */
export const BOARD_SIZES: Record<Difficulty, number> = {
  [Difficulty.EASY]: 4,
  [Difficulty.MEDIUM]: 6,
  [Difficulty.HARD]: 8,
  [Difficulty.EXPERT]: 10,
}

/**
 * Default board size
 */
export const DEFAULT_SIZE = BOARD_SIZES[Difficulty.HARD]

/**
 * Maximum board size for performance
 */
export const MAX_SIZE = 12

/**
 * Minimum board size
 */
export const MIN_SIZE = 4

/**
 * Animation delay for step-by-step solving (ms)
 */
export const STEP_DELAY = 500

/**
 * Colors for queen visualization
 */
export const QUEEN_COLORS = {
  placed: '#e74c3c',
  conflict: '#f39c12',
  valid: '#27ae60',
  candidate: '#3498db',
}

/**
 * Chessboard colors
 */
export const BOARD_COLORS = {
  light: '#f0d9b5',
  dark: '#b58863',
  highlight: '#ffff00',
  conflict: '#ff6b6b',
}