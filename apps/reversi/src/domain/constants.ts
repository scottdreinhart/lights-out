/**
 * Game constants — magic numbers & config extracted to a single source of truth.
 */

import type { GameStats } from './types'

export const BOARD_SIZE = 8
export const TOTAL_CELLS = BOARD_SIZE * BOARD_SIZE
export const CPU_DELAY_MS = 400
export const HARD_DEPTH = 4
export const MEDIUM_DEPTH = 2

export const DIRECTIONS: readonly [number, number][] = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
]

export const CORNERS: readonly [number, number][] = [
  [0, 0],
  [0, BOARD_SIZE - 1],
  [BOARD_SIZE - 1, 0],
  [BOARD_SIZE - 1, BOARD_SIZE - 1],
]

export const DEFAULT_STATS: GameStats = {
  wins: 0,
  losses: 0,
  draws: 0,
  gamesPlayed: 0,
  totalScore: 0,
  streak: 0,
  bestStreak: 0,
}
