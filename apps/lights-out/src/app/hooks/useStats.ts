/**
 * useStats — win/loss/streak tracking persisted to localStorage.
 * Configured via shared factory with app-specific storage key.
 */

import { createUseStatsHook } from '@games/app-hook-utils'

import { DEFAULT_STATS } from '@/domain'

import { load, save } from '../services/storageService'

export const useStats = createUseStatsHook({
  storageKey: 'lights-out-stats',
  defaultStats: DEFAULT_STATS,
  load,
  save,
})
