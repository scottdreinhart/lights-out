/**
 * useStats — win/loss/streak tracking persisted to localStorage.
 * Standard logic uses shared helpers; PvP logic is game-specific.
 */

import { useCallback, useState } from 'react'

import { nextLossStats, nextWinStats } from '@games/stats-utils'

import { DEFAULT_STATS } from '@/domain'
import type { GameStats } from '@/domain'

import { storageService } from '../services/storageService'

const loadStats = (): GameStats => storageService.loadGameStats() ?? DEFAULT_STATS

export const useStats = () => {
  const [stats, setStats] = useState<GameStats>(loadStats)

  const persist = useCallback((nextStats: GameStats) => {
    setStats(nextStats)
    storageService.saveGameStats(nextStats)
  }, [])

  const recordWin = useCallback(() => {
    persist(nextWinStats(stats))
  }, [stats, persist])

  const recordLoss = useCallback(() => {
    persist(nextLossStats(stats))
  }, [stats, persist])

  const recordPvpWin = useCallback(
    (winner: 'player1' | 'player2') => {
      const nextStreakWinner =
        stats.streakWinner === winner ? stats.streakWinner : winner
      const nextStreakCount =
        stats.streakWinner === winner ? stats.streakCount + 1 : 1

      const shouldUpdateBest = nextStreakCount > stats.bestStreakCount

      persist({
        ...stats,
        pvp1Wins: winner === 'player1' ? stats.pvp1Wins + 1 : stats.pvp1Wins,
        pvp2Wins: winner === 'player2' ? stats.pvp2Wins + 1 : stats.pvp2Wins,
        streakWinner: nextStreakWinner,
        streakCount: nextStreakCount,
        bestStreakWinner: shouldUpdateBest ? winner : stats.bestStreakWinner,
        bestStreakCount: shouldUpdateBest ? nextStreakCount : stats.bestStreakCount,
      })
    },
    [stats, persist],
  )

  const resetStats = useCallback(() => {
    persist(DEFAULT_STATS)
  }, [persist])

  return {
    stats,
    recordWin,
    recordLoss,
    recordPvpWin,
    resetStats,
  }
}
