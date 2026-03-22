/**
 * useStats — win/loss/streak tracking persisted to localStorage.
 * Configured via shared factory with app-specific storage key.
 */

import { createUseStatsHook } from '@games/app-hook-utils'

import { DEFAULT_STATS } from '@/domain'

import { load, save } from './storageService'

export const useStats = createUseStatsHook({
  storageKey: 'cho-han-stats',
  defaultStats: DEFAULT_STATS,
  load,
  save,
})
