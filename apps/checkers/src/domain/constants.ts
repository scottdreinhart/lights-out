/**
 * Game constants — magic numbers & config extracted to a single source of truth.
 */

import type { GameStats, Player } from './types'

export const BOARD_SIZE = 8
export const HUMAN_PLAYER: Player = 'red'
export const CPU_PLAYER: Player = 'black'

export const CPU_DELAY_MS = 400

export const DEFAULT_STATS: GameStats = {
  wins: 0,
  losses: 0,
  streak: 0,
  bestStreak: 0,
}
