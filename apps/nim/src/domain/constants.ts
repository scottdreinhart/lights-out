/**
 * Game constants — magic numbers & config extracted to a single source of truth.
 */

import type { GamePreset, GameStats } from './types'

export const CPU_DELAY_MS = 400

export const GAME_PRESETS: readonly GamePreset[] = [
  { name: 'Classic', counts: [3, 5, 7] },
  { name: 'Simple', counts: [1, 3, 5] },
  { name: 'Challenge', counts: [2, 5, 8] },
  { name: 'Quick', counts: [1, 2, 3] },
  { name: 'Grand', counts: [5, 7, 9] },
]

export const DEFAULT_COUNTS = [3, 5, 7]

export const DEFAULT_STATS: GameStats = {
  wins: 0,
  losses: 0,
  streak: 0,
  bestStreak: 0,
  pvp1Wins: 0,
  pvp2Wins: 0,
  streakWinner: 'player1',
  streakCount: 0,
  bestStreakWinner: 'player1',
  bestStreakCount: 0,
}
