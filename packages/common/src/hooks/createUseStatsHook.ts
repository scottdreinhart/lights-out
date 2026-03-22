import { useEffect, useState, useCallback } from 'react'

export interface UseStatsConfig<T> {
  storageKey: string
  defaultStats: T
  load: (key: string) => string | null
  save: (key: string, value: string) => void
}

export function createUseStatsHook<T extends Record<string, any>>(
  config: UseStatsConfig<T>
) {
  return function useStats() {
    const [stats, setStats] = useState<T>(config.defaultStats)
    const [isLoading, setIsLoading] = useState(true)

    // Load stats on mount
    useEffect(() => {
      try {
        const saved = config.load(config.storageKey)
        if (saved) {
          setStats(JSON.parse(saved))
        }
      } catch (error) {
        console.warn('Failed to load stats:', error)
      } finally {
        setIsLoading(false)
      }
    }, [])

    // Save stats function
    const saveStats = useCallback((newStats: T) => {
      setStats(newStats)
      try {
        config.save(config.storageKey, JSON.stringify(newStats))
      } catch (error) {
        console.warn('Failed to save stats:', error)
      }
    }, [])

    // Helper: record win
    const recordWin = useCallback(
      (score: number = 1) => {
        setStats((prev) => {
          const updated = {
            ...prev,
            wins: (prev.wins ?? 0) + 1,
            gamesPlayed: (prev.gamesPlayed ?? 0) + 1,
            totalScore: (prev.totalScore ?? 0) + score,
          } as T
          saveStats(updated)
          return updated
        })
      },
      [saveStats]
    )

    // Helper: record loss
    const recordLoss = useCallback(
      (score: number = 0) => {
        setStats((prev) => {
          const updated = {
            ...prev,
            losses: (prev.losses ?? 0) + 1,
            gamesPlayed: (prev.gamesPlayed ?? 0) + 1,
            totalScore: (prev.totalScore ?? 0) + score,
          } as T
          saveStats(updated)
          return updated
        })
      },
      [saveStats]
    )

    // Helper: record draw
    const recordDraw = useCallback(
      (score: number = 0) => {
        setStats((prev) => {
          const updated = {
            ...prev,
            draws: (prev.draws ?? 0) + 1,
            gamesPlayed: (prev.gamesPlayed ?? 0) + 1,
            totalScore: (prev.totalScore ?? 0) + score,
          } as T
          saveStats(updated)
          return updated
        })
      },
      [saveStats]
    )

    // Helper: reset stats
    const reset = useCallback(() => {
      saveStats(config.defaultStats)
    }, [saveStats])

    return {
      ...stats,
      isLoading,
      recordWin,
      recordLoss,
      recordDraw,
      reset,
      saveStats,
    }
  }
}
