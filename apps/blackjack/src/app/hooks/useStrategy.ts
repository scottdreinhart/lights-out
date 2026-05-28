/**
 * useStrategy Hook
 *
 * Unified strategy management combining basic strategy advice and card counting.
 * Provides comprehensive learning and advisory features.
 */

import type { GameAction, StrategyHint, StrategyMode, StrategyState } from '@/domain'
import type { Card } from '@games/card-deck-core'
import { useCallback } from 'react'
import { useBasicStrategy } from './useBasicStrategy'
import { useCardCounting } from './useCardCounting'

interface UseStrategyProps {
  deckCount: number
  strategyMode: StrategyMode
  learningModeEnabled: boolean
}

interface UseStrategyResult {
  strategyState: StrategyState
  currentHint: StrategyHint | null
  sessionAccuracy: number
  getStrategyHint: (
    playerHard: number,
    playerSoft: number | undefined,
    dealerUpCard: Card,
    playerAction: GameAction,
  ) => void
  recordCardSeen: (card: Card) => void
  resetSession: () => void
  getStrategySummary: () => string
}

const isBasicStrategyEnabled = (strategyMode: StrategyMode): boolean =>
  strategyMode === 'basic' || strategyMode === 'learning'

const isCardCountingEnabled = (strategyMode: StrategyMode): boolean =>
  strategyMode === 'card-counting' || strategyMode === 'learning'

export const useStrategy = ({
  deckCount,
  strategyMode,
  learningModeEnabled,
}: UseStrategyProps): UseStrategyResult => {
  // Initialize sub-strategies
  const basicStrategyEnabled = isBasicStrategyEnabled(strategyMode)
  const cardCountingEnabled = isCardCountingEnabled(strategyMode)

  const basicStrategy = useBasicStrategy({
    enabled: basicStrategyEnabled,
    learningMode: learningModeEnabled,
  })

  const cardCounting = useCardCounting({
    deckCount,
    enabled: cardCountingEnabled,
    learningMode: learningModeEnabled,
  })

  // Build combined strategy state
  const strategyState: StrategyState = {
    mode: strategyMode,
    basicStrategyEnabled,
    cardCountingEnabled,
    learningModeEnabled,
    countingState: cardCounting.countingState,
    currentHint: basicStrategy.currentHint ?? cardCounting.currentHint ?? undefined,
    sessionStats: {
      correctDecisions: basicStrategy.correctDecisions,
      totalDecisions: basicStrategy.totalDecisions,
      accuracyRate: basicStrategy.accuracyRate,
    },
  }

  const currentHint = basicStrategy.currentHint ?? cardCounting.currentHint ?? null

  // Get strategy hint for current situation
  const getStrategyHint = useCallback(
    (
      playerHard: number,
      playerSoft: number | undefined,
      dealerUpCard: Card,
      playerAction: GameAction,
    ): void => {
      if (!basicStrategyEnabled) {
        return
      }

      basicStrategy.getRecommendation(
        playerSoft !== undefined ? { hard: playerHard, soft: playerSoft } : playerHard,
        dealerUpCard,
        playerAction,
      )

      // Note: Card counting hint comes from seeing cards, not from hand recommendations
    },
    [basicStrategyEnabled, basicStrategy],
  )

  // Record card for counting
  const recordCardSeen = useCallback(
    (card: Card) => {
      if (cardCountingEnabled) {
        cardCounting.recordCard(card)
      }
    },
    [cardCountingEnabled, cardCounting],
  )

  // Reset session statistics
  const resetSession = useCallback(() => {
    basicStrategy.resetStats()
    cardCounting.resetCounting()
  }, [basicStrategy, cardCounting])

  // Get summary of session performance
  const getStrategySummary = useCallback((): string => {
    const parts: string[] = []

    if (basicStrategyEnabled) {
      parts.push(
        `Basic Strategy: ${basicStrategy.correctDecisions}/${basicStrategy.totalDecisions} correct (${basicStrategy.accuracyRate.toFixed(1)}%)`,
      )
    }

    if (cardCountingEnabled) {
      parts.push(
        `Card Counting: TC=${cardCounting.countingState.trueCount.toFixed(2)}, Accuracy=${cardCounting.countAccuracy.toFixed(0)}%, Difficulty=${cardCounting.difficulty}`,
      )
    }

    return parts.length > 0 ? parts.join(' | ') : 'No strategy enabled'
  }, [basicStrategyEnabled, cardCountingEnabled, basicStrategy, cardCounting])

  return {
    strategyState,
    currentHint,
    sessionAccuracy: basicStrategy.accuracyRate,
    getStrategyHint,
    recordCardSeen,
    resetSession,
    getStrategySummary,
  }
}

export default useStrategy
