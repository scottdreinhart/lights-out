/**
 * useStats — win/loss/streak tracking persisted to localStorage.
 */

import { createUseStatsHook } from '@games/app-hook-utils'

import { DEFAULT_STATS } from '@/domain'
import type { GameStats } from '@/domain'

import { load, save } from './storageService'

export const useStats = createUseStatsHook<GameStats>({
  storageKey: 'hangman-stats',
  defaultStats: DEFAULT_STATS,
  load,
  save,
})
