/**
 * useStats — win/loss/streak tracking persisted to localStorage.
 */

import { createUseStatsHook } from '@games/ui-hooks'

import type { GameStats } from '@/domain'
import { DEFAULT_STATS } from '@/domain'

import { load, save } from '../storageService'

export const useStats = createUseStatsHook<GameStats>({
  storageKey: 'checkers-stats',
  defaultStats: DEFAULT_STATS,
  load,
  save,
})
