import { createUseStatsHook } from '@games/ui-hooks'

import type { GameStats } from '@/domain'
import { DEFAULT_STATS } from '@/domain'

import { load, save } from '../storageService'

export const useStats = createUseStatsHook<GameStats>({
  storageKey: 'cee-lo-stats',
  defaultStats: DEFAULT_STATS,
  load,
  save,
})

export default useStats
