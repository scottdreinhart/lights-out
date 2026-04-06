/**
 * @games/banking
 *
 * Shared bankroll, table configuration, and betting management system.
 * Used across all games for consistent economy and money management.
 */

// Export all types
export type {
  Bankroll,
  TableVariant,
  BettingLimits,
  TableConfig,
  GamingSession,
  BetRecord,
  PaymentMethod,
  CashierTransaction,
  ResponsibleGamingLimit,
  BettingValidation,
} from './types'

// Export all constants
export {
  BETTING_LIMITS_CASUAL,
  BETTING_LIMITS_MID,
  BETTING_LIMITS_HIGH_ROLLER,
  CHIP_SET_CASUAL,
  CHIP_SET_MID,
  CHIP_SET_HIGH_ROLLER,
  RECOMMENDED_BANKROLLS,
  createTableConfig,
  RESPONSIBLE_GAMING,
  SUPPORTED_CURRENCIES,
  MINIMUM_BUY_IN,
  MAXIMUM_BUY_IN,
} from './constants'

// Export all bankroll manager functions
export {
  createBankroll,
  updateBankrollAfterBet,
  validateBet,
  canAffordBet,
  getSuggestedBet,
  createGamingSession,
  updateSessionAfterRound,
  endSession,
  getSessionStats,
} from './bankroll-manager'
