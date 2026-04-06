/**
 * Bankroll Manager
 *
 * Pure functions for bankroll management, validation, and session tracking.
 * No side effects; can be tested independently.
 */

import type {
  Bankroll,
  BettingValidation,
  GamingSession,
  TableConfig,
} from './types'

// ┌─────────────────────────────────────────────────────────┐
// │ BANKROLL OPERATIONS                                     │
// └─────────────────────────────────────────────────────────┘

/**
 * Create a new bankroll
 */
export const createBankroll = (
  playerId: string,
  amount: number,
  currency: 'USD' | 'EUR' | 'GBP' | 'JPY',
): Bankroll => ({
  id: `bankroll-${Date.now()}-${Math.random().toString(36).slice(2)}`,
  playerId,
  amount,
  currency,
  createdAt: new Date(),
  updatedAt: new Date(),
  isActive: true,
})

/**
 * Update bankroll balance after a bet result
 * Returns updated bankroll or null if insufficient funds
 */
export const updateBankrollAfterBet = (
  bankroll: Bankroll,
  betAmount: number,
  payoutAmount: number,
): Bankroll | null => {
  const newAmount = bankroll.amount - betAmount + payoutAmount
  
  if (newAmount < 0) {
    return null // Bet exceeds balance
  }

  return {
    ...bankroll,
    amount: newAmount,
    updatedAt: new Date(),
  }
}

// ┌─────────────────────────────────────────────────────────┐
// │ BETTING VALIDATION                                      │
// └─────────────────────────────────────────────────────────┘

/**
 * Validate a bet against table limits and bankroll
 */
export const validateBet = (
  betAmount: number,
  tableConfig: TableConfig,
  currentBalance: number,
): BettingValidation => {
  const { minBet, maxBet } = tableConfig.limits

  // Check minimum
  if (betAmount < minBet) {
    return {
      isValid: false,
      reason: `Minimum bet is $${minBet}`,
      suggestedAmount: minBet,
    }
  }

  // Check maximum
  if (betAmount > maxBet) {
    return {
      isValid: false,
      reason: `Maximum bet is $${maxBet}`,
      suggestedAmount: maxBet,
    }
  }

  // Check balance
  if (betAmount > currentBalance) {
    return {
      isValid: false,
      reason: `Exceeds your balance of $${currentBalance}`,
      suggestedAmount: Math.min(maxBet, currentBalance),
    }
  }

  return { isValid: true }
}

/**
 * Can player afford a bet?
 */
export const canAffordBet = (
  betAmount: number,
  currentBalance: number,
): boolean => {
  return betAmount <= currentBalance && betAmount > 0
}

/**
 * Get suggested next bet to stay within limits
 */
export const getSuggestedBet = (
  currentBalance: number,
  tableConfig: TableConfig,
): number => {
  const { minBet, maxBet } = tableConfig.limits
  return Math.min(maxBet, Math.max(minBet, Math.floor(currentBalance / 10)))
}

// ┌─────────────────────────────────────────────────────────┐
// │ SESSION MANAGEMENT                                      │
// └─────────────────────────────────────────────────────────┘

/**
 * Create a new gaming session
 */
export const createGamingSession = (
  playerId: string,
  gameId: string,
  tableId: string,
  startingBalance: number,
): GamingSession => ({
  id: `session-${Date.now()}-${Math.random().toString(36).slice(2)}`,
  playerId,
  gameId,
  tableId,
  startingBalance,
  currentBalance: startingBalance,
  totalBet: 0,
  totalWon: 0,
  totalLost: 0,
  handsPlayed: 0,
  startedAt: new Date(),
  status: 'active',
})

/**
 * Update session after a hand/round
 */
export const updateSessionAfterRound = (
  session: GamingSession,
  betAmount: number,
  payoutAmount: number,
): GamingSession => {
  const gain = payoutAmount - betAmount
  const newBalance = session.currentBalance + gain

  return {
    ...session,
    currentBalance: newBalance,
    totalBet: session.totalBet + betAmount,
    totalWon:
      session.totalWon + (gain > 0 ? gain : 0),
    totalLost: session.totalLost + (gain < 0 ? Math.abs(gain) : 0),
    handsPlayed: session.handsPlayed + 1,
    updatedAt: new Date(),
  }
}

/**
 * End a gaming session
 */
export const endSession = (session: GamingSession): GamingSession => ({
  ...session,
  status: 'completed',
  endedAt: new Date(),
})

/**
 * Get session statistics
 */
export const getSessionStats = (session: GamingSession) => {
  const profit = session.currentBalance - session.startingBalance
  const profitPercent =
    session.startingBalance > 0
      ? ((profit / session.startingBalance) * 100).toFixed(2)
      : '0.00'
  const avgBet =
    session.handsPlayed > 0 ? session.totalBet / session.handsPlayed : 0

  return {
    startingBalance: session.startingBalance,
    endingBalance: session.currentBalance,
    profit,
    profitPercent,
    totalBet: session.totalBet,
    totalWon: session.totalWon,
    totalLost: session.totalLost,
    handsPlayed: session.handsPlayed,
    avgBet: avgBet.toFixed(2),
    duration:
      session.endedAt && session.startedAt
        ? Math.floor(
            (session.endedAt.getTime() - session.startedAt.getTime()) / 1000 / 60,
          ) + ' min'
        : 'in progress',
  }
}
