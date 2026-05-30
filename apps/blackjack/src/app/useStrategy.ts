/**
 * useStrategy Hook
 *
 * Unified strategy management combining basic strategy advice and card counting.
 * Provides comprehensive learning and advisory features.
 */

import type { GameAction, StrategyHint, StrategyMode, StrategyState } from '@/domain'
import type { Card } from '@games/card-deck-core'
import { useCallback, useEffect, useState } from 'react'
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

export const useStrategy = ({
  deckCount,
  strategyMode,
  learningModeEnabled,
}: UseStrategyProps): UseStrategyResult => {
  const [currentHint, setCurrentHint] = useState<StrategyHint | null>(null)

  // Initialize sub-strategies
  const basicStrategy = useBasicStrategy({
    enabled: strategyMode === 'basic' || strategyMode === 'learning',
    learningMode: learningModeEnabled,
  })

  const cardCounting = useCardCounting({
    deckCount,
    enabled: strategyMode === 'card-counting' || strategyMode === 'learning',
    learningMode: learningModeEnabled,
  })

  // Build combined strategy state
  const strategyState: StrategyState = {
    mode: strategyMode,
    basicStrategyEnabled: strategyMode === 'basic' || strategyMode === 'learning',
    cardCountingEnabled: strategyMode === 'card-counting' || strategyMode === 'learning',
    learningModeEnabled,
    countingState: cardCounting.countingState,
    currentHint: basicStrategy.currentHint ?? cardCounting.currentHint ?? undefined,
    sessionStats: {
      correctDecisions: basicStrategy.correctDecisions,
      totalDecisions: basicStrategy.totalDecisions,
      accuracyRate: basicStrategy.accuracyRate,
    },
  }

  // Update hint when either strategy changes
  useEffect(() => {
    setCurrentHint(basicStrategy.currentHint || cardCounting.currentHint || null)
  }, [basicStrategy.currentHint, cardCounting.currentHint])

  // Get strategy hint for current situation
  const getStrategyHint = useCallback(
    (
      playerHard: number,
      playerSoft: number | undefined,
      dealerUpCard: Card,
      playerAction: GameAction,
    ): void => {
      if (strategyMode === 'none') {return}

      if (strategyMode === 'basic' || strategyMode === 'learning') {
        basicStrategy.getRecommendation(
          playerSoft !== undefined ? { hard: playerHard, soft: playerSoft } : playerHard,
          dealerUpCard,
          playerAction,
        )
      }

      // Note: Card counting hint comes from seeing cards, not from hand recommendations
    },
    [strategyMode, basicStrategy],
  )

  // Record card for counting
  const recordCardSeen = useCallback(
    (card: Card) => {
      if (strategyMode === 'card-counting' || strategyMode === 'learning') {
        cardCounting.recordCard(card)
      }
    },
    [strategyMode, cardCounting],
  )

  // Reset session statistics
  const resetSession = useCallback(() => {
    basicStrategy.resetStats()
    cardCounting.resetCounting()
  }, [basicStrategy, cardCounting])

  // Get summary of session performance
  const getStrategySummary = useCallback((): string => {
    const parts: string[] = []

    if (strategyMode === 'basic' || strategyMode === 'learning') {
      parts.push(
        `Basic Strategy: ${basicStrategy.correctDecisions}/${basicStrategy.totalDecisions} correct (${basicStrategy.accuracyRate.toFixed(1)}%)`,
      )
    }

    if (strategyMode === 'card-counting' || strategyMode === 'learning') {
      parts.push(
        `Card Counting: TC=${cardCounting.countingState.trueCount.toFixed(2)}, Accuracy=${cardCounting.countAccuracy.toFixed(0)}%, Difficulty=${cardCounting.difficulty}`,
      )
    }

    return parts.length > 0 ? parts.join(' | ') : 'No strategy enabled'
  }, [strategyMode, basicStrategy, cardCounting])

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
