/**
 * useCardCounting Hook
 *
 * Manages Hi-Lo card counting state and provides educational feedback.
 * Tracks running count, true count, and betting recommendations.
 */

import type { CardCountingState, StrategyHint } from '@/domain'
import {
  calculatePenetration,
  createCardCountingState,
  evaluateCountingAccuracy,
  getBetSizingStrategy,
  getCountingDifficulty,
  getCountingStrategyAdvice,
  updateCountingState,
} from '@/domain'
import type { Card } from '@games/card-deck-core'
import { useCallback, useRef, useState } from 'react'

interface UseCardCountingProps {
  deckCount: number
  enabled: boolean
  learningMode: boolean
}

interface UseCardCountingResult {
  countingState: CardCountingState
  currentHint: StrategyHint | null
  countAccuracy: number
  difficulty: string
  penetrationPercent: number
  countAccuracyFeedback: string
  recordCard: (card: Card) => void
  calculateCurrentPlayerCount: (playerCount: number) => void
  resetCounting: () => void
  getBettingAdvice: (
    minBet: number,
    maxBet: number,
  ) => { minBet: number; suggestedBet: number; maxBet: number }
}

export const useCardCounting = ({
  deckCount,
  enabled,
  learningMode,
}: UseCardCountingProps): UseCardCountingResult => {
  const [countingState, setCountingState] = useState<CardCountingState>(
    createCardCountingState(deckCount),
  )
  const [currentHint, setCurrentHint] = useState<StrategyHint | null>(null)
  const [countAccuracy, setCountAccuracy] = useState(100)
  const [countAccuracyFeedback, setCountAccuracyFeedback] = useState('')
  const cardsDealtRef = useRef(0)
  const totalShoeCardsRef = useRef(deckCount * 52)

  const penetrationPercent = calculatePenetration(cardsDealtRef.current, totalShoeCardsRef.current)
  const difficulty = getCountingDifficulty(countingState.trueCount, countAccuracy)

  // Record card in the count
  const recordCard = useCallback(
    (card: Card) => {
      if (!enabled) {return}

      cardsDealtRef.current += 1
      const newState = updateCountingState(
        countingState,
        card,
        cardsDealtRef.current,
        totalShoeCardsRef.current,
      )

      setCountingState(newState)

      // Generate hint with strategy advice
      if (learningMode) {
        const advice = getCountingStrategyAdvice(newState.trueCount)
        const hint: StrategyHint = {
          type: 'counting',
          message: `RC: ${newState.runningCount} | TC: ${newState.trueCount.toFixed(2)} | ${advice}`,
          priority: Math.abs(newState.trueCount) > 1 ? 'high' : 'medium',
          showInLearningMode: true,
        }
        setCurrentHint(hint)
      }
    },
    [enabled, learningMode, countingState],
  )

  // Evaluate player's manual count against true count
  const calculateCurrentPlayerCount = useCallback(
    (playerCount: number) => {
      const feedback = evaluateCountingAccuracy(playerCount, countingState.trueCount)
      setCountAccuracyFeedback(feedback.feedback)

      // Update accuracy score (0-100)
      const difference = Math.abs(playerCount - countingState.trueCount)
      const newAccuracy = Math.max(0, 100 - difference * 20) // Each 0.5 point difference = 10% accuracy loss
      setCountAccuracy(newAccuracy)

      if (learningMode) {
        const hint: StrategyHint = {
          type: 'counting',
          message: feedback.feedback,
          priority: feedback.isCorrect ? 'low' : 'high',
          showInLearningMode: true,
        }
        setCurrentHint(hint)
      }
    },
    [countingState.trueCount, learningMode],
  )

  // Reset counting when shoe is reshuffled
  const resetCounting = useCallback(() => {
    setCountingState(createCardCountingState(deckCount))
    setCountAccuracy(100)
    setCountAccuracyFeedback('')
    setCurrentHint(null)
    cardsDealtRef.current = 0
    totalShoeCardsRef.current = deckCount * 52
  }, [deckCount])

  // Get betting advice based on current count
  const getBettingAdvice = useCallback(
    (minBet: number, maxBet: number) => {
      return getBetSizingStrategy(countingState.trueCount, minBet, maxBet)
    },
    [countingState.trueCount],
  )

  return {
    countingState,
    currentHint,
    countAccuracy,
    difficulty,
    penetrationPercent,
    countAccuracyFeedback,
    recordCard,
    calculateCurrentPlayerCount,
    resetCounting,
    getBettingAdvice,
  }
}
