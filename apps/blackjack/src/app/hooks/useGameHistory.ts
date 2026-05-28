/**
 * Game History Hook - Tracks and persists game history
 *
 * Manages a list of past games with details about hands played, outcomes, and results.
 * Integrates with local storage for persistence across sessions.
 */

import type { HandHistory } from '@/domain'
import { loadWithFallback, saveJson } from '@games/storage-utils'
import { useCallback, useEffect, useState } from 'react'

const HISTORY_STORAGE_KEY = 'blackjack-game-history'
const MAX_HISTORY_ENTRIES = 100 // Keep last 100 games

export function useGameHistory() {
  const [history, setHistory] = useState<HandHistory[]>(() =>
    loadWithFallback(HISTORY_STORAGE_KEY, []),
  )

  // Save history to localStorage whenever it changes
  useEffect(() => {
    saveJson(HISTORY_STORAGE_KEY, history)
  }, [history])

  const addGameToHistory = useCallback((handHistory: HandHistory) => {
    setHistory((current) => {
      const newHistory = [handHistory, ...current]

      // Keep only the most recent entries
      if (newHistory.length > MAX_HISTORY_ENTRIES) {
        newHistory.splice(MAX_HISTORY_ENTRIES)
      }

      return newHistory
    })
  }, [])

  const clearHistory = useCallback(() => {
    setHistory([])
    saveJson(HISTORY_STORAGE_KEY, [])
  }, [])

  const getRecentGames = useCallback(
    (count: number = 10): HandHistory[] => {
      return history.slice(0, count)
    },
    [history],
  )

  const getGamesByDateRange = useCallback(
    (startDate: Date, endDate: Date): HandHistory[] => {
      return history.filter((game) => game.timestamp >= startDate && game.timestamp <= endDate)
    },
    [history],
  )

  const getTotalStats = useCallback((): {
    totalGames: number
    totalHands: number
    totalWon: number
    totalLost: number
    totalBlackjacks: number
  } => {
    return history.reduce(
      (acc, game) => ({
        totalGames: acc.totalGames + 1,
        totalHands: acc.totalHands + game.handsPlayed,
        totalWon: acc.totalWon + game.totalAmountWon,
        totalLost: acc.totalLost + game.totalAmountLost,
        totalBlackjacks: acc.totalBlackjacks + game.blackjackCount,
      }),
      {
        totalGames: 0,
        totalHands: 0,
        totalWon: 0,
        totalLost: 0,
        totalBlackjacks: 0,
      },
    )
  }, [history])

  return {
    history,
    addGameToHistory,
    clearHistory,
    getRecentGames,
    getGamesByDateRange,
    getTotalStats,
  }
}

export default useGameHistory
