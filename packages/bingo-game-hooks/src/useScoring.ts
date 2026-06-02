/**
 * Scoring calculation hook for Bingo.
 * Integrates scoring system with game state to calculate and track scores.
 */

import {
  calculateScore,
  getPowerUpPenalty,
  getSurvivalBonus,
  type BingoGameState,
  type BingoVariantId,
  type ScoreBreakdown,
} from '@games/bingo-domain'
import { useCallback, useMemo, useState } from 'react'

export interface PlayerScore {
  cardId: string
  pattern: string
  score: ScoreBreakdown
  winTime: number // timestamp when won
  numbersDrawn: number
}

export interface GameScores {
  totalScores: Map<string, number> // cardId -> total points
  winHistory: PlayerScore[] // all wins in game history
  currentMultiplier: number // active multiplier if applicable
  powerUpsUsed: number // for power-bingo penalty tracking
}

export function useScoring(variantId: BingoVariantId, gameState: BingoGameState) {
  const [scores, setScores] = useState<GameScores>({
    totalScores: new Map(),
    winHistory: [],
    currentMultiplier: 1.0,
    powerUpsUsed: 0,
  })

  /**
   * Calculate score for a card when it wins with a specific pattern.
   */
  const scoreWin = useCallback(
    (cardId: string, pattern: string): ScoreBreakdown => {
      const breakdown = calculateScore(
        pattern,
        variantId,
        gameState.drawnNumbers.size,
        gameState.cards.length > 0 ? gameState.cards[0].grid.flat().length : 75,
      )

      const newPlayerScore: PlayerScore = {
        cardId,
        pattern,
        score: breakdown,
        winTime: Date.now(),
        numbersDrawn: gameState.drawnNumbers.size,
      }

      setScores((prev) => {
        const updatedScores = new Map(prev.totalScores)
        const currentTotal = updatedScores.get(cardId) ?? 0
        updatedScores.set(cardId, currentTotal + breakdown.totalPoints)

        return {
          ...prev,
          totalScores: updatedScores,
          winHistory: [...prev.winHistory, newPlayerScore],
          currentMultiplier: breakdown.multiplier,
        }
      })

      return breakdown
    },
    [variantId, gameState],
  )

  /**
   * Calculate survival bonus (for survival variant).
   */
  const calculateSurvival = useCallback(
    (elapsedSeconds: number, timeLimitSeconds: number): number => {
      const bonus = getSurvivalBonus(elapsedSeconds, timeLimitSeconds)

      setScores((prev) => {
        const updatedScores = new Map(prev.totalScores)
        // Award survival bonus to all cards equally
        gameState.cards.forEach((card) => {
          const currentTotal = updatedScores.get(card.id) ?? 0
          updatedScores.set(card.id, currentTotal + bonus)
        })

        return {
          ...prev,
          totalScores: updatedScores,
        }
      })

      return bonus
    },
    [gameState.cards],
  )

  /**
   * Apply power-up penalty (for power-bingo variant).
   */
  const applyPowerUpPenalty = useCallback((): void => {
    setScores((prev) => {
      const penalty = getPowerUpPenalty(prev.powerUpsUsed + 1)
      const updatedScores = new Map(prev.totalScores)

      // Apply penalty to all cards
      updatedScores.forEach((score, cardId) => {
        const penaltyAmount = Math.floor(score * (penalty / 100))
        updatedScores.set(cardId, score - penaltyAmount)
      })

      return {
        ...prev,
        totalScores: updatedScores,
        powerUpsUsed: prev.powerUpsUsed + 1,
      }
    })
  }, [])

  /**
   * Reset scores for a new game.
   */
  const resetScores = useCallback((): void => {
    setScores({
      totalScores: new Map(),
      winHistory: [],
      currentMultiplier: 1.0,
      powerUpsUsed: 0,
    })
  }, [])

  /**
   * Get total score for a specific card.
   */
  const getCardScore = useCallback(
    (cardId: string): number => {
      return scores.totalScores.get(cardId) ?? 0
    },
    [scores.totalScores],
  )

  /**
   * Get leaderboard (sorted by score).
   */
  const getLeaderboard = useMemo((): Array<{ cardId: string; score: number }> => {
    return Array.from(scores.totalScores.entries())
      .map(([cardId, score]) => ({ cardId, score }))
      .sort((a, b) => b.score - a.score)
  }, [scores.totalScores])

  /**
   * Get win statistics.
   */
  const getStats = useMemo(
    () => ({
      totalWins: scores.winHistory.length,
      totalPoints: Array.from(scores.totalScores.values()).reduce((a, b) => a + b, 0),
      highestSingleWin: scores.winHistory.reduce(
        (max, win) => Math.max(max, win.score.totalPoints),
        0,
      ),
      averageWinPoints:
        scores.winHistory.length > 0
          ? scores.winHistory.reduce((sum, win) => sum + win.score.totalPoints, 0) /
            scores.winHistory.length
          : 0,
    }),
    [scores],
  )

  return {
    scores,
    scoreWin,
    calculateSurvival,
    applyPowerUpPenalty,
    resetScores,
    getCardScore,
    getLeaderboard,
    getStats,
  }
}
