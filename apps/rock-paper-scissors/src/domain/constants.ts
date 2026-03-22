/**
 * Game constants — magic numbers & config extracted to a single source of truth.
 */

import type { GameStats } from './types'

export const CPU_DELAY_MS = 400

export const DEFAULT_STATS: GameStats = {
  playerWins: 0,
  cpuWins: 0,
  draws: 0,
  totalRounds: 0,
}
