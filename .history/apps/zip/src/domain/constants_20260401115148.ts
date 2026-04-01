/**
 * Zip Domain Constants
 * Game configuration and constants
 */

import type { Difficulty, MazeConfig } from './types'

export const MAZE_SIZES = {
  easy: { width: 8, height: 6 },
  medium: { width: 12, height: 8 },
  hard: { width: 16, height: 10 },
  expert: { width: 20, height: 12 },
} as const

export const ITEM_COUNTS = {
  easy: 3,
  medium: 5,
  hard: 8,
  expert: 12,
} as const

export const MAZE_CONFIGS: Record<Difficulty, MazeConfig> = {
  easy: {
    ...MAZE_SIZES.easy,
    itemCount: ITEM_COUNTS.easy,
    difficulty: 'easy',
  },
  medium: {
    ...MAZE_SIZES.medium,
    itemCount: ITEM_COUNTS.medium,
    difficulty: 'medium',
  },
  hard: {
    ...MAZE_SIZES.hard,
    itemCount: ITEM_COUNTS.hard,
    difficulty: 'hard',
  },
  expert: {
    ...MAZE_SIZES.expert,
    itemCount: ITEM_COUNTS.expert,
    difficulty: 'expert',
  },
} as const

export const DIRECTIONS: Record<Direction, Position> = {
  up: { row: -1, col: 0 },
  down: { row: 1, col: 0 },
  left: { row: 0, col: -1 },
  right: { row: 0, col: 1 },
} as const

export const CELL_COLORS = {
  empty: '#ffffff',
  wall: '#333333',
  start: '#4caf50',
  goal: '#f44336',
  item: '#ff9800',
  player: '#2196f3',
} as const

export const CELL_SYMBOLS = {
  empty: '',
  wall: '█',
  start: 'S',
  goal: 'G',
  item: '★',
  player: 'P',
} as const

export const MOVEMENT_COSTS = {
  empty: 1,
  item: 2, // Bonus for collecting items
  goal: 1,
} as const

export const DEFAULT_DIFFICULTY: Difficulty = 'medium'