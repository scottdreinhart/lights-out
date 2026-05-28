/**
 * Statistics Hook - Tracks player performance and game statistics
 *
 * Manages persistent statistics like win rate, games played, total winnings, etc.
 * Integrates with local storage for persistence across sessions.
 */

import type { HandHistory, PlayerStatistics } from '@/domain'
import { loadWithFallback, saveJson } from '@games/storage-utils'
import { useCallback, useEffect, useState } from 'react'

const STATS_STORAGE_KEY = 'blackjack-player-stats'

const createInitialStats = (): PlayerStatistics => ({
  totalGamesPlayed: 0,
  totalHandsPlayed: 0,
  winRate: 0,
  blackjackRate: 0,
  averageBet: 0,
  totalWinnings: 0,
  bestStreak: 0,
  worstStreak: 0,
  gamesPlayed: 0,
  wins: 0,
  blackjacks: 0,
  currentStreak: 0,
})

export function useStats() {
  const [stats, setStats] = useState<PlayerStatistics>(() =>
    loadWithFallback(STATS_STORAGE_KEY, createInitialStats()),
  )

  // Save stats to localStorage whenever they change
  useEffect(() => {
    saveJson(STATS_STORAGE_KEY, stats)
  }, [stats])

  const updateStats = useCallback((handHistory: HandHistory) => {
    setStats((current) => {
      const newTotalGames = current.totalGamesPlayed + 1
      const newTotalHands = current.totalHandsPlayed + handHistory.handsPlayed
      const newTotalWinnings =
        current.totalWinnings + handHistory.totalAmountWon - handHistory.totalAmountLost

      // Calculate win rate (hands won / total hands)
      const totalWins = current.totalHandsPlayed * current.winRate + handHistory.handsWon
      const newWinRate = totalWins / newTotalHands

      // Calculate blackjack rate (blackjacks per 100 hands)
      const totalBlackjacks =
        current.totalHandsPlayed * current.blackjackRate + handHistory.blackjackCount
      const newBlackjackRate = totalBlackjacks / newTotalHands

      // Calculate average bet (simplified - could be weighted by games)
      const newAverageBet =
        (current.averageBet * current.totalGamesPlayed +
          handHistory.totalAmountWon +
          handHistory.totalAmountLost) /
        newTotalGames

      // Update streaks (simplified - would need more complex logic for proper streak tracking)
      const newBestStreak = Math.max(current.bestStreak, handHistory.handsWon)
      const newWorstStreak = Math.min(current.worstStreak, handHistory.handsLost)

      return {
        totalGamesPlayed: newTotalGames,
        totalHandsPlayed: newTotalHands,
        winRate: newWinRate,
        blackjackRate: newBlackjackRate,
        averageBet: newAverageBet,
        totalWinnings: newTotalWinnings,
        bestStreak: newBestStreak,
        worstStreak: newWorstStreak,
        gamesPlayed: newTotalGames,
        wins: Math.round(totalWins),
        blackjacks: Math.round(totalBlackjacks),
        currentStreak:
          handHistory.handsWon > 0
            ? Math.max(0, current.currentStreak + handHistory.handsWon)
            : Math.min(0, current.currentStreak - handHistory.handsLost),
      }
    })
  }, [])

  const resetStats = useCallback(() => {
    const initialStats = createInitialStats()
    setStats(initialStats)
    saveJson(STATS_STORAGE_KEY, initialStats)
  }, [])

  return {
    stats,
    updateStats,
    resetStats,
  }
}

export default useStats
