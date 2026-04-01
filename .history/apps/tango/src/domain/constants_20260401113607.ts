/**
 * Tango Domain Constants
 * Game configuration and constants
 */

import type { Difficulty, PuzzleConfig } from './types'

export const BOARD_SIZES = {
  easy: 3,    // 3x3 board
  medium: 4,  // 4x4 board
  hard: 5,    // 5x5 board
  expert: 6,  // 6x6 board
} as const

export const DEFAULT_SIZE = BOARD_SIZES.medium
export const MIN_SIZE = BOARD_SIZES.easy
export const MAX_SIZE = BOARD_SIZES.hard

export const SHUFFLE_MOVES = {
  easy: 10,
  medium: 50,
  hard: 100,
  expert: 200,
} as const

export const TILE_COLORS = {
  background: '#f0f0f0',
  border: '#ccc',
  empty: '#fff',
  solved: '#d4edda',
  text: '#333',
  highlight: '#e3f2fd',
} as const

export const ANIMATION_DURATION = 200 // milliseconds

export const PUZZLE_CONFIGS: Record<Difficulty, PuzzleConfig> = {
  easy: {
    size: BOARD_SIZES.easy,
    difficulty: 'easy',
    shuffleMoves: SHUFFLE_MOVES.easy,
  },
  medium: {
    size: BOARD_SIZES.medium,
    difficulty: 'medium',
    shuffleMoves: SHUFFLE_MOVES.medium,
  },
  hard: {
    size: BOARD_SIZES.hard,
    difficulty: 'hard',
    shuffleMoves: SHUFFLE_MOVES.hard,
  },
  expert: {
    size: BOARD_SIZES.expert,
    difficulty: 'expert',
    shuffleMoves: SHUFFLE_MOVES.expert,
  },
}