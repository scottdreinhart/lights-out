/**
 * useStats — win/loss/streak tracking persisted to localStorage.
 * Configured via shared factory with app-specific storage key.
 */

import { createUseStatsHook } from '@games/app-hook-utils'
import { load, save } from './storageService'

// Default stats for Simon Says
const DEFAULT_STATS = {
  wins: 0,
  losses: 0,
  streak: 0,
  bestStreak: 0,
  totalGames: 0,
  highScore: 0,
  averageScore: 0,
  totalTimePlayed: 0, // in seconds
}

export const useStats = createUseStatsHook({
  storageKey: 'simon-says-stats',
  defaultStats: DEFAULT_STATS,
  load,
  save,
})

