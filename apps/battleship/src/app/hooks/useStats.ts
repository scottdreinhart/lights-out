import { useCallback, useState } from 'react'

import { nextLossStats, nextWinStats, type StatsShape } from '@games/stats-utils'

import type { GameStats } from '@/domain'
import { DEFAULT_STATS } from '@/domain'

import { load, save } from '../storageService'

const STORAGE_KEY = 'battleship-stats'

export interface UseStatsResult {
  stats: GameStats
  recordWin: () => void
  recordLoss: () => void
  resetStats: () => void
}

export const useStats = (): UseStatsResult => {
  const [stats, setStats] = useState<GameStats>(() => load<GameStats>(STORAGE_KEY, DEFAULT_STATS) ?? DEFAULT_STATS)

  const recordWin = useCallback(() => {
    setStats((previous) => {
      const next = nextWinStats(previous as StatsShape) as GameStats
      save(STORAGE_KEY, next)
      return next
    })
  }, [])

  const recordLoss = useCallback(() => {
    setStats((previous) => {
      const next = nextLossStats(previous as StatsShape) as GameStats
      save(STORAGE_KEY, next)
      return next
    })
  }, [])

  const resetStats = useCallback(() => {
    save(STORAGE_KEY, DEFAULT_STATS)
    setStats(DEFAULT_STATS)
  }, [])

  return { stats, recordWin, recordLoss, resetStats }
}