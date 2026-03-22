import { createUseStatsHook } from '@games/app-hook-utils'

import { DEFAULT_STATS } from '@/domain/constants'
import type { GameStats } from '@/domain/types'

import { load, save } from '../services/storageService.ts'

const STORAGE_KEY = 'lights-out-stats'

export const useStats = createUseStatsHook<GameStats>({
  storageKey: STORAGE_KEY,
  defaultStats: DEFAULT_STATS,
  load,
  save,
})
