/**
 * Blackjack Strategy Advisor
 *
 * Provides basic strategy recommendations and card counting assistance.
 * Framework-agnostic domain logic for optimal blackjack play.
 */

import type { Card } from '@games/card-deck-core'
import type { BasicStrategyRecommendation, CardCountingState } from './types'

// ┌─────────────────────────────────────────────────────────┐
// │ BASIC STRATEGY TYPES                                    │
// └─────────────────────────────────────────────────────────┘

export type StrategyAction = 'hit' | 'stand' | 'double' | 'split' | 'surrender'
export type StrategyConfidence = 'always' | 'sometimes' | 'rarely' | 'never'

export interface StrategyRecommendation {
  action: StrategyAction
  confidence: StrategyConfidence
  reasoning: string
  expectedValue?: number // EV impact of following vs not following strategy
}

export interface StrategyContext {
  playerHand: Card[]
  dealerUpCard: Card
  canDouble: boolean
  canSplit: boolean
  canSurrender: boolean
  isSoft: boolean // Has an ace counting as 11
  isPair: boolean // Two cards of same rank
  handValue: number
}

// ┌─────────────────────────────────────────────────────────┐
// │ BASIC STRATEGY TABLES                                   │
// └─────────────────────────────────────────────────────────┘

// Hard totals (no ace counting as 11)
const HARD_STRATEGY_TABLE: Record<number, Record<string, StrategyAction>> = {
  21: {
    '2': 'stand',
    '3': 'stand',
    '4': 'stand',
    '5': 'stand',
    '6': 'stand',
    '7': 'stand',
    '8': 'stand',
    '9': 'stand',
    '10': 'stand',
    A: 'stand',
  },
  20: {
    '2': 'stand',
    '3': 'stand',
    '4': 'stand',
    '5': 'stand',
    '6': 'stand',
    '7': 'stand',
    '8': 'stand',
    '9': 'stand',
    '10': 'stand',
    A: 'stand',
  },
  19: {
    '2': 'stand',
    '3': 'stand',
    '4': 'stand',
    '5': 'stand',
    '6': 'stand',
    '7': 'stand',
    '8': 'stand',
    '9': 'stand',
    '10': 'stand',
    A: 'stand',
  },
  18: {
    '2': 'stand',
    '3': 'stand',
    '4': 'stand',
    '5': 'stand',
    '6': 'stand',
    '7': 'stand',
    '8': 'stand',
    '9': 'stand',
    '10': 'stand',
    A: 'stand',
  },
  17: {
    '2': 'stand',
    '3': 'stand',
    '4': 'stand',
    '5': 'stand',
    '6': 'stand',
    '7': 'stand',
    '8': 'stand',
    '9': 'stand',
    '10': 'stand',
    A: 'stand',
  },
  16: {
    '2': 'stand',
    '3': 'stand',
    '4': 'stand',
    '5': 'stand',
    '6': 'stand',
    '7': 'hit',
    '8': 'hit',
    '9': 'hit',
    '10': 'hit',
    A: 'hit',
  },
  15: {
    '2': 'stand',
    '3': 'stand',
    '4': 'stand',
    '5': 'stand',
    '6': 'stand',
    '7': 'hit',
    '8': 'hit',
    '9': 'hit',
    '10': 'hit',
    A: 'hit',
  },
  14: {
    '2': 'stand',
    '3': 'stand',
    '4': 'stand',
    '5': 'stand',
    '6': 'stand',
    '7': 'hit',
    '8': 'hit',
    '9': 'hit',
    '10': 'hit',
    A: 'hit',
  },
  13: {
    '2': 'stand',
    '3': 'stand',
    '4': 'stand',
    '5': 'stand',
    '6': 'stand',
    '7': 'hit',
    '8': 'hit',
    '9': 'hit',
    '10': 'hit',
    A: 'hit',
  },
  12: {
    '2': 'hit',
    '3': 'hit',
    '4': 'stand',
    '5': 'stand',
    '6': 'stand',
    '7': 'hit',
    '8': 'hit',
    '9': 'hit',
    '10': 'hit',
    A: 'hit',
  },
  11: {
    '2': 'double',
    '3': 'double',
    '4': 'double',
    '5': 'double',
    '6': 'double',
    '7': 'double',
    '8': 'double',
    '9': 'double',
    '10': 'double',
    A: 'hit',
  },
  10: {
    '2': 'double',
    '3': 'double',
    '4': 'double',
    '5': 'double',
    '6': 'double',
    '7': 'double',
    '8': 'double',
    '9': 'double',
    '10': 'hit',
    A: 'hit',
  },
  9: {
    '2': 'hit',
    '3': 'double',
    '4': 'double',
    '5': 'double',
    '6': 'double',
    '7': 'hit',
    '8': 'hit',
    '9': 'hit',
    '10': 'hit',
    A: 'hit',
  },
  8: {
    '2': 'hit',
    '3': 'hit',
    '4': 'hit',
    '5': 'hit',
    '6': 'hit',
    '7': 'hit',
    '8': 'hit',
    '9': 'hit',
    '10': 'hit',
    A: 'hit',
  },
  7: {
    '2': 'hit',
    '3': 'hit',
    '4': 'hit',
    '5': 'hit',
    '6': 'hit',
    '7': 'hit',
    '8': 'hit',
    '9': 'hit',
    '10': 'hit',
    A: 'hit',
  },
  6: {
    '2': 'hit',
    '3': 'hit',
    '4': 'hit',
    '5': 'hit',
    '6': 'hit',
    '7': 'hit',
    '8': 'hit',
    '9': 'hit',
    '10': 'hit',
    A: 'hit',
  },
  5: {
    '2': 'hit',
    '3': 'hit',
    '4': 'hit',
    '5': 'hit',
    '6': 'hit',
    '7': 'hit',
    '8': 'hit',
    '9': 'hit',
    '10': 'hit',
    A: 'hit',
  },
}

// Soft totals (ace counting as 11)
const SOFT_STRATEGY_TABLE: Record<number, Record<string, StrategyAction>> = {
  21: {
    '2': 'stand',
    '3': 'stand',
    '4': 'stand',
    '5': 'stand',
    '6': 'stand',
    '7': 'stand',
    '8': 'stand',
    '9': 'stand',
    '10': 'stand',
    A: 'stand',
  },
  20: {
    '2': 'stand',
    '3': 'stand',
    '4': 'stand',
    '5': 'stand',
    '6': 'stand',
    '7': 'stand',
    '8': 'stand',
    '9': 'stand',
    '10': 'stand',
    A: 'stand',
  },
  19: {
    '2': 'stand',
    '3': 'stand',
    '4': 'stand',
    '5': 'stand',
    '6': 'stand',
    '7': 'stand',
    '8': 'stand',
    '9': 'stand',
    '10': 'stand',
    A: 'stand',
  },
  18: {
    '2': 'stand',
    '3': 'double',
    '4': 'double',
    '5': 'double',
    '6': 'double',
    '7': 'stand',
    '8': 'stand',
    '9': 'hit',
    '10': 'hit',
    A: 'hit',
  },
  17: {
    '2': 'hit',
    '3': 'double',
    '4': 'double',
    '5': 'double',
    '6': 'double',
    '7': 'hit',
    '8': 'hit',
    '9': 'hit',
    '10': 'hit',
    A: 'hit',
  },
  16: {
    '2': 'hit',
    '3': 'hit',
    '4': 'double',
    '5': 'double',
    '6': 'double',
    '7': 'hit',
    '8': 'hit',
    '9': 'hit',
    '10': 'hit',
    A: 'hit',
  },
  15: {
    '2': 'hit',
    '3': 'hit',
    '4': 'double',
    '5': 'double',
    '6': 'double',
    '7': 'hit',
    '8': 'hit',
    '9': 'hit',
    '10': 'hit',
    A: 'hit',
  },
  14: {
    '2': 'hit',
    '3': 'hit',
    '4': 'hit',
    '5': 'double',
    '6': 'double',
    '7': 'hit',
    '8': 'hit',
    '9': 'hit',
    '10': 'hit',
    A: 'hit',
  },
  13: {
    '2': 'hit',
    '3': 'hit',
    '4': 'hit',
    '5': 'double',
    '6': 'double',
    '7': 'hit',
    '8': 'hit',
    '9': 'hit',
    '10': 'hit',
    A: 'hit',
  },
}

// Pairs strategy table
const PAIRS_STRATEGY_TABLE: Record<string, Record<string, StrategyAction>> = {
  'A,A': {
    '2': 'split',
    '3': 'split',
    '4': 'split',
    '5': 'split',
    '6': 'split',
    '7': 'split',
    '8': 'split',
    '9': 'split',
    '10': 'split',
    A: 'split',
  },
  '10,10': {
    '2': 'stand',
    '3': 'stand',
    '4': 'stand',
    '5': 'stand',
    '6': 'stand',
    '7': 'stand',
    '8': 'stand',
    '9': 'stand',
    '10': 'stand',
    A: 'stand',
  },
  '9,9': {
    '2': 'split',
    '3': 'split',
    '4': 'split',
    '5': 'split',
    '6': 'split',
    '7': 'stand',
    '8': 'split',
    '9': 'split',
    '10': 'stand',
    A: 'stand',
  },
  '8,8': {
    '2': 'split',
    '3': 'split',
    '4': 'split',
    '5': 'split',
    '6': 'split',
    '7': 'split',
    '8': 'split',
    '9': 'split',
    '10': 'split',
    A: 'split',
  },
  '7,7': {
    '2': 'split',
    '3': 'split',
    '4': 'split',
    '5': 'split',
    '6': 'split',
    '7': 'split',
    '8': 'hit',
    '9': 'hit',
    '10': 'hit',
    A: 'hit',
  },
  '6,6': {
    '2': 'split',
    '3': 'split',
    '4': 'split',
    '5': 'split',
    '6': 'split',
    '7': 'hit',
    '8': 'hit',
    '9': 'hit',
    '10': 'hit',
    A: 'hit',
  },
  '5,5': {
    '2': 'double',
    '3': 'double',
    '4': 'double',
    '5': 'double',
    '6': 'double',
    '7': 'double',
    '8': 'double',
    '9': 'double',
    '10': 'hit',
    A: 'hit',
  },
  '4,4': {
    '2': 'hit',
    '3': 'hit',
    '4': 'hit',
    '5': 'split',
    '6': 'split',
    '7': 'hit',
    '8': 'hit',
    '9': 'hit',
    '10': 'hit',
    A: 'hit',
  },
  '3,3': {
    '2': 'split',
    '3': 'split',
    '4': 'split',
    '5': 'split',
    '6': 'split',
    '7': 'split',
    '8': 'hit',
    '9': 'hit',
    '10': 'hit',
    A: 'hit',
  },
  '2,2': {
    '2': 'split',
    '3': 'split',
    '4': 'split',
    '5': 'split',
    '6': 'split',
    '7': 'split',
    '8': 'hit',
    '9': 'hit',
    '10': 'hit',
    A: 'hit',
  },
}

// ┌─────────────────────────────────────────────────────────┐
// │ BASIC STRATEGY FUNCTIONS                                │
// └─────────────────────────────────────────────────────────┘

/**
 * Gets the optimal basic strategy action for a given hand and dealer upcard
 */
export function getBasicStrategyAction(context: StrategyContext): StrategyAction {
  const { playerHand, dealerUpCard, canDouble, canSplit, canSurrender, isSoft, isPair, handValue } =
    context

  // Handle pairs first (highest priority)
  if (isPair && playerHand.length === 2) {
    const rank1 = playerHand[0].rank
    const rank2 = playerHand[1].rank
    const pairKey = `${rank1},${rank2}` as keyof typeof PAIRS_STRATEGY_TABLE

    if (PAIRS_STRATEGY_TABLE[pairKey]) {
      const dealerRank = dealerUpCard.rank === '10' ? '10' : dealerUpCard.rank
      const action = PAIRS_STRATEGY_TABLE[pairKey][dealerRank]

      // Check if action is available
      if (action === 'split' && !canSplit) {
        // Fall back to hard totals if can't split
        return getHardTotalAction(handValue, dealerUpCard)
      }

      return action
    }
  }

  // Handle soft totals
  if (isSoft) {
    const softValue = getSoftValue(playerHand)
    if (softValue >= 13 && softValue <= 21) {
      const dealerRank = dealerUpCard.rank === '10' ? '10' : dealerUpCard.rank
      const action = SOFT_STRATEGY_TABLE[softValue][dealerRank]

      // Check if double is available
      if (action === 'double' && !canDouble) {
        return action === 'double' ? 'hit' : action
      }

      return action
    }
  }

  // Handle hard totals
  return getHardTotalAction(handValue, dealerUpCard)
}

/**
 * Gets strategy action for hard totals
 */
function getHardTotalAction(handValue: number, dealerUpCard: Card): StrategyAction {
  if (handValue < 5 || handValue > 21) {
    return 'hit' // Shouldn't happen, but safety
  }

  const dealerRank = dealerUpCard.rank === '10' ? '10' : dealerUpCard.rank
  return HARD_STRATEGY_TABLE[handValue][dealerRank]
}

/**
 * Calculates soft value (with ace counting as 11)
 */
function getSoftValue(hand: Card[]): number {
  const values = hand.map((card) =>
    card.rank === 'A' ? 11 : card.rank === '10' ? 10 : parseInt(card.rank),
  )
  const total = values.reduce((sum, val) => sum + val, 0)

  // If bust with ace as 11, count it as 1
  if (total > 21 && values.includes(11)) {
    return total - 10 // Convert one ace from 11 to 1
  }

  return total
}

/**
 * Gets a complete strategy recommendation with confidence and reasoning
 */
export function getStrategyRecommendation(context: StrategyContext): StrategyRecommendation {
  const action = getBasicStrategyAction(context)

  // Determine confidence level
  let confidence: StrategyConfidence = 'always'
  let reasoning = ''

  switch (action) {
    case 'stand':
      confidence = 'always'
      reasoning = 'Stand - this is the mathematically optimal play'
      break
    case 'hit':
      confidence = 'always'
      reasoning = 'Hit - this is the mathematically optimal play'
      break
    case 'double':
      if (context.canDouble) {
        confidence = 'always'
        reasoning = 'Double down - this significantly increases your expected value'
      } else {
        confidence = 'never'
        reasoning = 'Would double down, but doubling is not allowed'
      }
      break
    case 'split':
      if (context.canSplit) {
        confidence = 'always'
        reasoning = 'Split - this is the mathematically optimal play'
      } else {
        confidence = 'never'
        reasoning = 'Would split, but splitting is not allowed'
      }
      break
    case 'surrender':
      if (context.canSurrender) {
        confidence = 'sometimes'
        reasoning = 'Surrender - this minimizes your loss in a bad situation'
      } else {
        confidence = 'never'
        reasoning = 'Would surrender, but surrender is not allowed'
      }
      break
  }

  return {
    action,
    confidence,
    reasoning,
    expectedValue: calculateExpectedValue(context, action),
  }
}

/**
 * Calculates expected value impact of following strategy vs basic hit/stand
 */
function calculateExpectedValue(context: StrategyContext, action: StrategyAction): number {
  // Simplified EV calculation - in reality this would be complex
  // For now, return a rough estimate based on common blackjack EV tables

  const { handValue, dealerUpCard } = context
  const _dealerValue =
    dealerUpCard.rank === 'A' ? 11 : dealerUpCard.rank === '10' ? 10 : parseInt(dealerUpCard.rank)

  // Rough EV impact (positive = good, negative = bad)
  switch (action) {
    case 'double':
      return handValue >= 9 && handValue <= 11 ? 0.15 : -0.05
    case 'split':
      return context.isPair && handValue >= 8 ? 0.1 : -0.02
    case 'stand':
      return handValue >= 17 ? 0.08 : handValue <= 11 ? -0.1 : 0.02
    case 'hit':
      return handValue <= 11 ? 0.05 : handValue >= 17 ? -0.08 : 0.01
    case 'surrender':
      return -0.03 // Surrender saves half your bet
    default:
      return 0
  }
}

// ┌─────────────────────────────────────────────────────────┐
// │ CARD COUNTING ASSISTANT                                 │
// └─────────────────────────────────────────────────────────┘

export interface CountingState {
  runningCount: number
  trueCount: number
  decksRemaining: number
  betSpread: number // Recommended bet multiplier
  advantage: 'player' | 'dealer' | 'neutral'
}

/**
 * Hi-Lo card counting system
 */
export function updateRunningCount(count: number, cards: Card[]): number {
  let newCount = count

  for (const card of cards) {
    const value = card.rank === '10' ? 10 : card.rank === 'A' ? 11 : parseInt(card.rank)

    if (value >= 2 && value <= 6) {
      newCount += 1 // Low cards = +1
    } else if (value >= 10) {
      newCount -= 1 // High cards = -1
    }
    // 7, 8, 9 = 0 (neutral)
  }

  return newCount
}

/**
 * Calculates true count and betting strategy
 */
export function getCountingState(runningCount: number, decksRemaining: number): CountingState {
  const trueCount = runningCount / decksRemaining

  // Bet spread based on true count
  let betSpread = 1
  if (trueCount >= 2) {
    betSpread = 2
  }
  if (trueCount >= 3) {
    betSpread = 4
  }
  if (trueCount >= 4) {
    betSpread = 8
  }
  if (trueCount >= 5) {
    betSpread = 16
  }

  // Determine advantage
  let advantage: 'player' | 'dealer' | 'neutral' = 'neutral'
  if (trueCount >= 1) {
    advantage = 'player'
  }
  if (trueCount <= -1) {
    advantage = 'dealer'
  }

  return {
    runningCount,
    trueCount,
    decksRemaining,
    betSpread,
    advantage,
  }
}

// ┌─────────────────────────────────────────────────────────┐
// │ HOOK-COMPATIBLE DOMAIN FUNCTIONS                        │
// └─────────────────────────────────────────────────────────┘

/**
 * Get basic strategy recommendation for a player action
 */
export function getBasicStrategyRecommendation(
  playerHard: number,
  playerSoft: number | undefined,
  dealerUpCard: Card,
  playerAction: 'hit' | 'stand' | 'double' | 'split' | 'surrender',
): BasicStrategyRecommendation {
  const context: StrategyContext = {
    playerHand: [], // Not needed for lookup
    dealerUpCard,
    canDouble: playerAction === 'double',
    canSplit: playerAction === 'split',
    canSurrender: playerAction === 'surrender',
    isSoft: playerSoft !== undefined,
    isPair: false, // Determined elsewhere
    handValue: playerSoft ?? playerHard,
  }

  const recommendedAction = getBasicStrategyAction(context)
  const isCorrect = recommendedAction === playerAction

  return {
    recommendedAction: recommendedAction as any,
    isCorrect,
    explanation: `Basic strategy suggests: ${recommendedAction}`,
  }
}

/**
 * Get basic strategy recommendation for a split decision
 */
export function getSplitStrategyRecommendation(
  cardRank: string,
  dealerUpCard: Card,
  playerAction: 'split' | 'nomatch' | 'hit' | 'stand',
): BasicStrategyRecommendation {
  const pairKey = `${cardRank},${cardRank}` as keyof typeof PAIRS_STRATEGY_TABLE
  const dealerRank = dealerUpCard.rank === '10' ? '10' : dealerUpCard.rank

  const recommendedAction = PAIRS_STRATEGY_TABLE[pairKey]?.[dealerRank] ?? 'stand'
  const isCorrect =
    (recommendedAction === 'split' && playerAction === 'split') ||
    (recommendedAction !== 'split' && playerAction !== 'split')

  return {
    recommendedAction: recommendedAction as any,
    isCorrect,
    explanation: `Split strategy for ${cardRank}s vs dealer ${dealerRank}: ${recommendedAction}`,
  }
}

/**
 * Get feedback on strategy accuracy
 */
export function getStrategyAccuracyFeedback(isCorrect: boolean, correctStreak: number): string {
  if (!isCorrect) {
    return '❌ Not optimal play'
  }

  if (correctStreak >= 100) {
    return '🏆 Perfect strategy!!'
  }
  if (correctStreak >= 50) {
    return '⭐ Excellent strategy knowledge!'
  }
  if (correctStreak >= 20) {
    return '✅ Great decision!'
  }
  if (correctStreak >= 10) {
    return '👍 Perfect play!'
  }
  return '✅ Good decision'
}

/**
 * Create initial card counting state
 */
export function createCardCountingState(deckCount: number): CardCountingState {
  return {
    runningCount: 0,
    trueCount: 0,
    decksRemaining: deckCount,
    advantage: 0,
    betMultiplier: 1,
  }
}

/**
 * Calculate shoe penetration percentage
 */
export function calculatePenetration(cardsDealt: number, totalCards: number): number {
  return totalCards > 0 ? (cardsDealt / totalCards) * 100 : 0
}

/**
 * Evaluate counting accuracy
 */
export function evaluateCountingAccuracy(
  playerCount: number,
  actualCount: number,
): { isCorrect: boolean; feedback: string } {
  const difference = Math.abs(playerCount - actualCount)

  if (difference < 0.5) {
    return { isCorrect: true, feedback: '✅ Perfect count!' }
  }

  if (difference < 1) {
    return { isCorrect: true, feedback: '✅ Very close!' }
  }

  if (difference < 2) {
    return { isCorrect: false, feedback: `Almost there! Off by ${difference.toFixed(2)}` }
  }

  return {
    isCorrect: false,
    feedback: `❌ Count off by ${difference.toFixed(2)}. Keep practicing!`,
  }
}

/**
 * Get bet sizing strategy based on true count
 */
export function getBetSizingStrategy(
  trueCount: number,
  minBet: number,
  maxBet: number,
): { minBet: number; suggestedBet: number; maxBet: number } {
  let multiplier = 1

  if (trueCount >= 5) {
    multiplier = Math.min(16, Math.max(1, trueCount * 2))
  } else if (trueCount >= 4) {
    multiplier = 8
  } else if (trueCount >= 3) {
    multiplier = 4
  } else if (trueCount >= 2) {
    multiplier = 2
  } else if (trueCount >= 1) {
    multiplier = 1.5
  } else if (trueCount <= -2) {
    multiplier = 0.5
  }

  const suggestedBet = Math.min(maxBet, Math.max(minBet, minBet * multiplier))

  return {
    minBet,
    suggestedBet: Math.round(suggestedBet),
    maxBet,
  }
}

/**
 * Get counting difficulty level based on metrics
 */
export function getCountingDifficulty(_trueCount: number, accuracy: number): string {
  if (accuracy < 50) {
    return 'Very Hard'
  }
  if (accuracy < 70) {
    return 'Hard'
  }
  if (accuracy < 85) {
    return 'Medium'
  }
  if (accuracy < 95) {
    return 'Easy'
  }
  return 'Very Easy'
}

/**
 * Get counting strategy advice based on true count
 */
export function getCountingStrategyAdvice(trueCount: number): string {
  if (trueCount >= 4) {
    return '🔴 Strong player advantage - Increase bet!'
  }
  if (trueCount >= 2) {
    return '🟡 Slight player advantage - Increase bet moderately'
  }
  if (trueCount >= 0) {
    return '⚪ Neutral count - Play normal bet'
  }
  if (trueCount >= -2) {
    return '🔵 Slight dealer advantage - Reduce bet'
  }
  return '🔴 Strong dealer advantage - Back off until reshuffle'
}

/**
 * Update card counting state with a new card
 */
export function updateCountingState(
  state: CardCountingState,
  card: Card,
  cardsDealt: number,
  totalCards: number,
): CardCountingState {
  let runningCount = state.runningCount

  // Hi-Lo counting system
  const cardValue =
    card.rank === '10' || card.rank === 'J' || card.rank === 'Q' || card.rank === 'K'
      ? '10'
      : card.rank
  const numValue = cardValue === 'A' ? 11 : cardValue === '10' ? 10 : parseInt(cardValue)

  if (numValue >= 2 && numValue <= 6) {
    runningCount += 1
  } else if (numValue >= 10 || numValue === 1) {
    // 10-value cards and aces
    runningCount -= 1
  }
  // 7, 8, 9 = 0 (neutral)

  const decksRemaining = Math.max(0.5, (totalCards - cardsDealt) / 52)
  const trueCount = decksRemaining > 0 ? runningCount / decksRemaining : runningCount

  // Calculate advantage (roughly 0.5% per point of true count)
  const advantage = trueCount * 0.5

  // Calculate bet multiplier
  let betMultiplier = 1
  if (trueCount >= 1) {
    betMultiplier = Math.min(8, Math.max(1, 1 + trueCount / 2))
  } else if (trueCount <= -1) {
    betMultiplier = Math.max(0.5, 1 + trueCount / 3)
  }

  return {
    runningCount,
    trueCount,
    decksRemaining,
    advantage,
    betMultiplier,
  }
}
