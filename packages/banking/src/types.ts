/**
 * Banking System Types
 *
 * Shared types for cross-game bankroll management and table configuration.
 * Framework-agnostic; used throughout app and game layers.
 */

// ┌─────────────────────────────────────────────────────────┐
// │ BANKROLL TYPES                                          │
// └─────────────────────────────────────────────────────────┘

/**
 * Player bankroll (starting funds for gaming session)
 */
export interface Bankroll {
  id: string
  playerId: string
  amount: number // Total funds available
  currency: 'USD' | 'EUR' | 'GBP' | 'JPY' // Future: crypto support
  createdAt: Date
  updatedAt: Date
  isActive: boolean
}

// ┌─────────────────────────────────────────────────────────┐
// │ TABLE CONFIGURATION TYPES                               │
// └─────────────────────────────────────────────────────────┘

/**
 * Table variant (Casual, Mid-Stakes, High Roller, etc.)
 */
export type TableVariant = 'casual' | 'mid' | 'high-roller' | 'custom'

/**
 * Betting limits for a table
 */
export interface BettingLimits {
  minBet: number
  maxBet: number
  currency: string
}

/**
 * Table configuration with betting and chip rules
 */
export interface TableConfig {
  id: string
  gameId: string // which game (blackjack, poker, etc.)
  variant: TableVariant
  name: string // "Casual Table", "High Roller"
  description?: string
  limits: BettingLimits
  recommendedChips: number[] // which chip denoms to show (e.g., [5, 10, 25, 100])
  houseRules?: {
    dealerHitsSoft17?: boolean
    doubleDownAllowed?: boolean
    splitAllowed?: boolean
    surrenderAllowed?: boolean
    [key: string]: any
  }
  isAvailable: boolean
}

// ┌─────────────────────────────────────────────────────────┐
// │ SESSION & HISTORY TYPES                                 │
// └─────────────────────────────────────────────────────────┘

/**
 * Gaming session state
 */
export interface GamingSession {
  id: string
  playerId: string
  gameId: string // which game (blackjack, poker, etc.)
  tableId: string // which table variant
  startingBalance: number
  currentBalance: number
  totalBet: number
  totalWon: number
  totalLost: number
  handsPlayed: number
  startedAt: Date
  endedAt?: Date
  status: 'active' | 'paused' | 'completed'
}

/**
 * Bet history for analytics and replay
 */
export interface BetRecord {
  id: string
  sessionId: string
  gameId: string
  tableId: string
  amount: number
  result: 'win' | 'loss' | 'push' | 'cancelled'
  payout: number // amount won (0 if loss)
  timestamp: Date
  metadata?: {
    handNumber?: number
    dealerCard?: string
    playerCards?: string[]
    [key: string]: any
  }
}

// ┌─────────────────────────────────────────────────────────┐
// │ VENTURE/CASHIER TYPES (Future Integration)              │
// └─────────────────────────────────────────────────────────┘

/**
 * Real-world payment method
 * (Future: credit card, crypto, PayPal, etc.)
 */
export interface PaymentMethod {
  id: string
  playerId: string
  type: 'credit-card' | 'crypto' | 'bank-transfer' | 'paypal'
  isDefault: boolean
  maskedValue: string // Last 4 digits, etc.
  [key: string]: any
}

/**
 * Cashier transaction (buy-in, cash-out, reload)
 */
export interface CashierTransaction {
  id: string
  playerId: string
  type: 'buy-in' | 'cash-out' | 'reload' | 'bonus'
  amount: number
  currency: string
  paymentMethod: PaymentMethod
  status: 'pending' | 'completed' | 'failed' | 'cancelled'
  timestamp: Date
  notes?: string
}

// ┌─────────────────────────────────────────────────────────┐
// │ RULES ENFORCEMENT TYPES                                 │
// └─────────────────────────────────────────────────────────┘

/**
 * Responsible gaming limit
 */
export interface ResponsibleGamingLimit {
  playerId: string
  dailyLimit?: number
  weeklyLimit?: number
  monthlyLimit?: number
  sessionDurationMinutes?: number
  enforceAt: 'warning' | 'hard-stop'
}

/**
 * Betting validation result
 */
export interface BettingValidation {
  isValid: boolean
  reason?: string // "Exceeds maximum", "Below minimum", "Insufficient balance"
  suggestedAmount?: number // What they can bet instead
}
