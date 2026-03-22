/**
 * Game constants — magic numbers & config extracted to a single source of truth.
 */

import type { GameStats } from './types'

export const TOTAL_ROUNDS = 6
export const POINTS_TO_WIN_ROUND = 21
export const BUNCO_POINTS = 21
export const MINI_BUNCO_POINTS = 5
export const CPU_DELAY_MS = 1200
export const ROLL_ANIMATION_MS = 600

export const DEFAULT_STATS: GameStats = {
  wins: 0,
  losses: 0,
  streak: 0,
  bestStreak: 0,
}
