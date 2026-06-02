/**
 * Blackjack Card Counting - Hi-Lo System
 *
 * Pure functions for Hi-Lo card counting system.
 * Educational implementation; not for cheating!
 */

import type { Card, Rank } from '@games/card-deck-core'
import type { CardCountingState } from './types'

// Re-export for convenience
export type { Rank }

// ┌─────────────────────────────────────────────────────────┐
// │ HI-LO COUNTING SYSTEM                                   │
// │ 2-6: +1, 7-9: 0, 10-A: -1                              │
// └─────────────────────────────────────────────────────────┘

const HI_LO_VALUES: Record<Rank, number> = {
  '2': 1,
  '3': 1,
  '4': 1,
  '5': 1,
  '6': 1,
  '7': 0,
  '8': 0,
  '9': 0,
  '10': -1,
  J: -1,
  Q: -1,
  K: -1,
  A: -1,
  joker: 0, // Jokers not used in blackjack, neutral value
}

// ┌─────────────────────────────────────────────────────────┐
// │ COUNTING STATE MANAGEMENT                               │
// └─────────────────────────────────────────────────────────┘

/**
 * Create initial card counting state
 */
export const createCardCountingState = (deckCount: number): CardCountingState => ({
  runningCount: 0,
  trueCount: 0,
  decksRemaining: deckCount,
  advantage: 0,
  betMultiplier: 1,
})

/**
 * Update running count based on dealt card
 */
export const updateRunningCount = (currentCount: number, card: Card): number => {
  return currentCount + HI_LO_VALUES[card.rank]
}

/**
 * Calculate true count (running count / decks remaining)
 */
export const calculateTrueCount = (runningCount: number, decksRemaining: number): number => {
  if (decksRemaining <= 0) {
    return 0
  }
  return Math.round((runningCount / decksRemaining) * 100) / 100
}

/**
 * Calculate player advantage based on true count
 * Rough approximation: each +1 TC = +0.5% player advantage
 */
export const calculateAdvantage = (trueCount: number): number => {
  // Each unit of true count adds about 0.48-0.6% advantage
  return trueCount * 0.5
}

/**
 * Calculate recommended bet multiplier based on true count
 * Higher true count = increase bet
 */
export const calculateBetMultiplier = (trueCount: number, minTC: number = 1): number => {
  if (trueCount < minTC) {
    return 1
  } // Bet minimum when TC is low

  // Linear scaling: TC=1 → 2x, TC=2 → 3x, TC=3 → 4x, etc.
  const rawMultiplier = Math.min(trueCount + 1, 10) // Cap at 10x
  return Math.round(rawMultiplier * 10) / 10
}

/**
 * Update counting state with new card dealt
 */
export const updateCountingState = (
  state: CardCountingState,
  card: Card,
  cardsDealt: number,
  totalCardsInShoe: number,
): CardCountingState => {
  const newRunningCount = updateRunningCount(state.runningCount, card)
  const decksRemaining = Math.max(0, (totalCardsInShoe - cardsDealt) / 52)
  const newTrueCount = calculateTrueCount(newRunningCount, decksRemaining)
  const advantage = calculateAdvantage(newTrueCount)
  const betMultiplier = calculateBetMultiplier(newTrueCount)

  return {
    runningCount: newRunningCount,
    trueCount: newTrueCount,
    decksRemaining,
    advantage,
    betMultiplier,
  }
}

/**
 * Reset counting state when shoe is reshuffled
 */
export const resetCountingState = (deckCount: number): CardCountingState => {
  return createCardCountingState(deckCount)
}

// ┌─────────────────────────────────────────────────────────┐
// │ COUNT VISUALIZATION & STRATEGIES                        │
// └─────────────────────────────────────────────────────────┘

/**
 * Get visual representation of hi-lo value
 */
export const getCountValueDisplay = (card: Card): string => {
  const value = HI_LO_VALUES[card.rank]
  if (value > 0) {
    return `+${value}`
  }
  if (value < 0) {
    return `${value}`
  }
  return '0'
}

/**
 * Get card counting strategy advice
 */
export const getCountingStrategyAdvice = (trueCount: number): string => {
  if (trueCount >= 2) {
    return `High count (+${trueCount.toFixed(1)})! Increase bet and play aggressively`
  }
  if (trueCount >= 1) {
    return `Slightly favorable (+${trueCount.toFixed(1)}). Play conservative`
  }
  if (trueCount <= -2) {
    return `Low count (${trueCount.toFixed(1)}). Reduce bet and play cautiously`
  }
  if (trueCount <= -1) {
    return `Slightly unfavorable (${trueCount.toFixed(1)}). Bet minimum`
  }

  return 'Neutral count. Standard play'
}

/**
 * Get card counting status (educational level)
 */
export const getCountingDifficulty = (trueCount: number, accuracy: number): string => {
  if (accuracy >= 95 && trueCount >= 1) {
    return 'Expert'
  }
  if (accuracy >= 85) {
    return 'Advanced'
  }
  if (accuracy >= 70) {
    return 'Intermediate'
  }
  return 'Beginner'
}

/**
 * Calculate penetration percentage
 * Penetration = (cards dealt / total cards) * 100
 */
export const calculatePenetration = (cardsDealt: number, totalCards: number): number => {
  return Math.round((cardsDealt / totalCards) * 100)
}

/**
 * Suggest shoe reshuffle point based on penetration
 * Typically casinos reshuffle at 70-75% penetration
 */
export const shouldReshuffleShoe = (penetration: number): boolean => {
  return penetration >= 75
}

// ┌─────────────────────────────────────────────────────────┐
// │ EDUCATIONAL FEEDBACK                                    │
// └─────────────────────────────────────────────────────────┘

/**
 * Evaluate counting accuracy
 */
export const evaluateCountingAccuracy = (
  playerCount: number,
  trueCount: number,
): { isCorrect: boolean; feedback: string } => {
  const countDifference = Math.abs(playerCount - trueCount)

  if (countDifference === 0) {
    return {
      isCorrect: true,
      feedback: "🎯 Perfect count! You're excellent at tracking!",
    }
  }

  if (countDifference <= 0.5) {
    return {
      isCorrect: true,
      feedback: `✅ Close! Off by ${countDifference.toFixed(1)} (rounding is OK)`,
    }
  }

  if (countDifference <= 1) {
    return {
      isCorrect: true,
      feedback: `👍 Good approximation (off by ${countDifference.toFixed(1)})`,
    }
  }

  return {
    isCorrect: false,
    feedback: `❌ Count mismatch. You said ${playerCount}, true count is ${trueCount.toFixed(1)}. Keep practicing!`,
  }
}

/**
 * Get brief explanation of hi-lo system
 */
export const getHiLoExplanation = (): string => {
  return `
Hi-Lo Card Counting:
• Low cards (2-6): +1 (good for player)
• Neutral cards (7-9): 0
• High cards (10-A): -1 (good for dealer)

Running Count: Sum of all values seen
True Count: Running Count ÷ Decks Remaining

A higher true count (+) means the player has an advantage!
  `
}

/**
 * Get bet sizing strategy for card counting
 */
export const getBetSizingStrategy = (
  trueCount: number,
  minBet: number,
  maxBet: number,
): { minBet: number; suggestedBet: number; maxBet: number } => {
  const multiplier = calculateBetMultiplier(trueCount)
  const suggestedBet = Math.min(minBet * multiplier, maxBet)

  return {
    minBet,
    suggestedBet: Math.round(suggestedBet),
    maxBet,
  }
}
