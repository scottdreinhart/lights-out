/**
 * Banking System Constants
 *
 * Standard table configurations, chip sets, and gaming rules.
 */

import type { TableConfig, BettingLimits } from './types'

// ┌─────────────────────────────────────────────────────────┐
// │ STANDARD TABLE VARIANTS                                 │
// └─────────────────────────────────────────────────────────┘

/**
 * Casual Table: Low stakes, beginner-friendly
 * Min: $5, Max: $1000
 * Good for: Learning, relaxed play
 */
export const BETTING_LIMITS_CASUAL: BettingLimits = {
  minBet: 5,
  maxBet: 1000,
  currency: 'USD',
}

/**
 * Mid-Stakes Table: Standard casino play
 * Min: $25, Max: $5000
 * Good for: Experienced players, moderate risk
 */
export const BETTING_LIMITS_MID: BettingLimits = {
  minBet: 25,
  maxBet: 5000,
  currency: 'USD',
}

/**
 * High Roller Table: Premium stakes
 * Min: $100, Max: $50000
 * Good for: VIPs, high-risk high-reward
 */
export const BETTING_LIMITS_HIGH_ROLLER: BettingLimits = {
  minBet: 100,
  maxBet: 50000,
  currency: 'USD',
}

// ┌─────────────────────────────────────────────────────────┐
// │ STANDARD CHIP SETS BY TABLE                             │
// └─────────────────────────────────────────────────────────┘

/**
 * Chip denominations available at each table type
 * (subset of [1, 5, 10, 25, 50, 100, 500, 1000])
 */
export const CHIP_SET_CASUAL = [1, 5, 10, 25, 50, 100] as const
export const CHIP_SET_MID = [5, 10, 25, 50, 100, 500] as const
export const CHIP_SET_HIGH_ROLLER = [25, 50, 100, 500, 1000, 5000] as const

// ┌─────────────────────────────────────────────────────────┐
// │ RECOMMENDED STARTING BANKROLLS                          │
// └─────────────────────────────────────────────────────────┘

/**
 * Table variants with recommended starting bankroll
 * (20x minimum bet is industry standard for variance protection)
 */
export const RECOMMENDED_BANKROLLS = {
  casual: {
    minBet: 5,
    recommended: 100, // 20x min
    comfortable: 500, // 100x min for extended play
  },
  mid: {
    minBet: 25,
    recommended: 500, // 20x min
    comfortable: 2500, // 100x min
  },
  highRoller: {
    minBet: 100,
    recommended: 2000, // 20x min
    comfortable: 10000, // 100x min
  },
} as const

// ┌─────────────────────────────────────────────────────────┐
// │ TABLE FACTORY HELPER                                    │
// └─────────────────────────────────────────────────────────┘

/**
 * Factory function to create a table config
 * Used by games (blackjack, poker, etc.) to configure their tables
 */
export const createTableConfig = (
  gameId: string,
  variant: 'casual' | 'mid' | 'high-roller',
  overrides?: Partial<TableConfig>,
): TableConfig => {
  const baseConfigs: Record<string, TableConfig> = {
    casual: {
      id: `${gameId}-casual`,
      gameId,
      variant: 'casual',
      name: 'Casual Table',
      description: 'Perfect for learning. Low stakes, relaxed pace.',
      limits: BETTING_LIMITS_CASUAL,
      recommendedChips: [...CHIP_SET_CASUAL],
      isAvailable: true,
    },
    mid: {
      id: `${gameId}-mid`,
      gameId,
      variant: 'mid',
      name: 'Mid-Stakes Table',
      description: 'Standard casino experience. Moderate stakes.',
      limits: BETTING_LIMITS_MID,
      recommendedChips: [...CHIP_SET_MID],
      isAvailable: true,
    },
    'high-roller': {
      id: `${gameId}-high-roller`,
      gameId,
      variant: 'high-roller',
      name: 'High Roller Table',
      description: 'VIP experience. Premium stakes and service.',
      limits: BETTING_LIMITS_HIGH_ROLLER,
      recommendedChips: [...CHIP_SET_HIGH_ROLLER],
      isAvailable: true,
    },
  }

  return {
    ...baseConfigs[variant],
    ...overrides,
  }
}

// ┌─────────────────────────────────────────────────────────┐
// │ RESPONSIBLE GAMING THRESHOLDS                           │
// └─────────────────────────────────────────────────────────┘

export const RESPONSIBLE_GAMING = {
  sessionWarningMinutes: 60,
  sessionMaxMinutes: 120,
  dailyLossLimit: 1000, // Stop at $1000 loss per day
  weeklyLossLimit: 5000,
  monthlyLossLimit: 20000,
} as const

// ┌─────────────────────────────────────────────────────────┐
// │ CURRENCY & PAYMENT RULES                                │
// └─────────────────────────────────────────────────────────┘

export const SUPPORTED_CURRENCIES = ['USD', 'EUR', 'GBP', 'JPY'] as const

/**
 * Minimum buy-in amounts by currency
 */
export const MINIMUM_BUY_IN = {
  USD: 10,
  EUR: 10,
  GBP: 10,
  JPY: 1000,
} as const

/**
 * Maximum buy-in amounts (compliance + fraud prevention)
 */
export const MAXIMUM_BUY_IN = {
  USD: 100000,
  EUR: 100000,
  GBP: 100000,
  JPY: 10000000,
} as const
