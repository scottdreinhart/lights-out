/**
 * useStats — player/cpu/draw round stats persisted to localStorage.
 */

import type { GameStats } from '@/domain'
import { DEFAULT_STATS } from '@/domain'
import { useCallback, useState } from 'react'

import { load, save } from './storageService'

const STORAGE_KEY = 'rock-paper-scissors-stats'

type StatsUpdater = (prev: GameStats) => GameStats

export function useStats() {
  const [stats, setStats] = useState<GameStats>(() => load(STORAGE_KEY, DEFAULT_STATS))

  const apply = useCallback((updater: StatsUpdater) => {
    setStats((prev) => {
      const next = updater(prev)
      save(STORAGE_KEY, next)
      return next
    })
  }, [])

  const recordWin = useCallback(() => {
    apply((prev) => ({
      ...prev,
      playerWins: prev.playerWins + 1,
      totalRounds: prev.totalRounds + 1,
    }))
  }, [apply])

  const recordLoss = useCallback(() => {
    apply((prev) => ({
      ...prev,
      cpuWins: prev.cpuWins + 1,
      totalRounds: prev.totalRounds + 1,
    }))
  }, [apply])

  const recordDraw = useCallback(() => {
    apply((prev) => ({
      ...prev,
      draws: prev.draws + 1,
      totalRounds: prev.totalRounds + 1,
    }))
  }, [apply])

  const resetStats = useCallback(() => {
    setStats(DEFAULT_STATS)
    save(STORAGE_KEY, DEFAULT_STATS)
  }, [])

  return {
    stats,
    recordWin,
    recordLoss,
    recordDraw,
    resetStats,
  }
}
