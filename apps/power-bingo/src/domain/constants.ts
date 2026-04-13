/**
 * Power Bingo - Variant-Specific Constants
 * 
 * Power Bingo introduces a power-up system that allows players to activate
 * special abilities to gain strategic advantages. Power-ups are earned based
 * on difficulty and pattern completion frequency.
 */

/**
 * Power-up earning rates
 * 
 * Players earn power-ups based on how many patterns they complete relative to difficulty.
 * Values represent how many patterns must be completed to earn one power-up.
 * 
 * Examples:
 * - Easy (1): One power-up earned every 1 pattern completed
 * - Medium (1.5): One power-up earned every 1.5 patterns (roughly 67% of patterns)
 * - Hard (2): One power-up earned every 2 patterns completed
 * - Expert (3): One power-up earned every 3 patterns completed
 */
export const POWER_UP_EARNING_RATES = {
  easy: 1.0, // 1 power-up per pattern
  medium: 1.5, // 1 power-up per 1.5 patterns
  hard: 2.0, // 1 power-up per 2 patterns
  expert: 3.0, // 1 power-up per 3 patterns
} as const

/**
 * Power-up inventory limits
 * 
 * How many of each type a player can hold at once
 */
export const POWER_UP_INVENTORY_LIMITS = {
  autoMark: 5, // Max 5 auto-mark power-ups
  instantPattern: 3, // Max 3 instant pattern power-ups
  doublePoints: 4, // Max 4 double points power-ups
  shield: 2, // Max 2 shield power-ups
  timeExtend: 3, // Max 3 time extension power-ups
} as const

/**
 * Power-up effect durations and quantities
 */
export const POWER_UP_EFFECTS = {
  autoMark: {
    quantity: 3, // Marks 3 random numbers on the card
    pointReduction: 0, // No penalty
    cooldown: 0, // Can be used immediately
  },
  instantPattern: {
    quantity: 1, // Completes one pattern instantly
    pointReduction: 50, // Reduced points (half of normal pattern value)
    cooldown: 0,
  },
  doublePoints: {
    quantity: 1, // Doubles points for next pattern
    duration: 1, // Duration: 1 pattern completion
    multiplier: 2.0,
    cooldown: 0,
  },
  shield: {
    quantity: 1, // Blocks one wrong stamp attempt
    duration: Infinity, // Lasts until used
    penaltyReduction: 10, // Prevents 10-point error penalty
    cooldown: 0,
  },
  timeExtend: {
    quantity: 1, // Extends game time
    secondsAdded: 30, // +30 seconds
    cooldown: 0,
  },
} as const

/**
 * Power-up activation requirements
 * 
 * Conditions that must be met to use each power-up
 */
export const POWER_UP_ACTIVATION_REQUIREMENTS = {
  autoMark: {
    minimumPatternProgress: 0, // Can use anytime
    requiresManualStamping: false, // Works in both auto and manual stamping
  },
  instantPattern: {
    minimumPatternProgress: 1, // Must have completed at least 1 pattern first
    requiresManualStamping: false,
  },
  doublePoints: {
    minimumPatternProgress: 0,
    requiresManualStamping: false,
  },
  shield: {
    minimumPatternProgress: 0,
    requiresManualStamping: true, // Only useful in manual stamping mode
    blockWrongStamps: true,
  },
  timeExtend: {
    minimumPatternProgress: 1,
    requiresManualStamping: false,
    timeRemainingThreshold: 30, // Only usable when <30s remaining (optional rule)
  },
} as const

/**
 * Power-up drop rates and weight system
 * 
 * Determines which power-ups appear more frequently
 * Higher weight = more common
 */
export const POWER_UP_RARITIES = {
  autoMark: {
    weight: 100, // Very common
    rarity: 'common',
  },
  instantPattern: {
    weight: 50, // Uncommon
    rarity: 'uncommon',
  },
  doublePoints: {
    weight: 75, // Common
    rarity: 'common',
  },
  shield: {
    weight: 30, // Rare
    rarity: 'rare',
  },
  timeExtend: {
    weight: 40, // Uncommon to rare
    rarity: 'uncommon',
  },
} as const

/**
 * Difficulty-specific power-up availability
 * 
 * Some power-ups may be disabled on certain difficulties
 */
export const DIFFICULTY_POWER_UP_AVAILABILITY = {
  easy: {
    available: ['autoMark', 'instantPattern', 'doublePoints', 'shield', 'timeExtend'],
    disabledPowerUps: [],
  },
  medium: {
    available: ['autoMark', 'instantPattern', 'doublePoints', 'shield', 'timeExtend'],
    disabledPowerUps: [],
  },
  hard: {
    available: ['autoMark', 'doublePoints', 'shield', 'timeExtend'],
    disabledPowerUps: ['instantPattern'], // Too powerful for hard difficulty
  },
  expert: {
    available: ['doublePoints', 'shield', 'timeExtend'],
    disabledPowerUps: ['autoMark', 'instantPattern'], // Minimal assistance
  },
} as const

/**
 * Strategic power-up combinations
 * 
 * Bonus points for using multiple power-ups in same round
 */
export const POWER_UP_COMBO_BONUSES = {
  twoInRound: 25, // Use 2 power-ups in same round
  threeInRound: 75, // Use 3 power-ups in same round
  fourInRound: 150, // Use 4 power-ups in same round
  allFiveInGame: 500, // Use all 5 power-up types in one game
} as const

/**
 * Get earning rate for a difficulty
 * @param difficulty - Game difficulty ('easy' | 'medium' | 'hard' | 'expert')
 * @returns Patterns required per power-up earned
 */
export const getPowerUpEarningRate = (
  difficulty: keyof typeof POWER_UP_EARNING_RATES
): number => {
  return POWER_UP_EARNING_RATES[difficulty] ?? POWER_UP_EARNING_RATES.medium
}

/**
 * Check if power-up is available for a difficulty
 * @param powerUpType - Type of power-up
 * @param difficulty - Game difficulty
 * @returns Whether power-up is available
 */
export const isPowerUpAvailable = (
  powerUpType: string,
  difficulty: keyof typeof DIFFICULTY_POWER_UP_AVAILABILITY
): boolean => {
  const availability = DIFFICULTY_POWER_UP_AVAILABILITY[difficulty]
  return availability?.available.includes(powerUpType) ?? false
}
