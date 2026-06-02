/**
 * Bingo variant configurations - defines unique rules, scoring, and behavior per variant.
 */

export type BingoVariantId =
  | 'standard'
  | 'blackout'
  | 'bonus'
  | 'rush'
  | 'survival'
  | 'pattern'
  | 'power'
  | 'speed'

export interface BingoVariantConfig {
  id: BingoVariantId
  title: string
  helpText: string
  totalNumbers: number
  timeLimit?: number // in seconds, if applicable
  speedBonus?: boolean // if true, faster wins = higher multiplier
  patternBonus?: boolean // if true, bonus points for specific patterns
  powerUps?: boolean // if true, special abilities available
  description: string
}

export const BINGO_VARIANTS: Record<BingoVariantId, BingoVariantConfig> = {
  standard: {
    id: 'standard',
    title: 'BINGO',
    helpText: 'Mark patterns to win! Complete lines, diagonals, or the whole card.',
    totalNumbers: 75,
    description: 'Classic bingo. Win with horizontal, vertical, diagonal lines, or four corners.',
  },

  blackout: {
    id: 'blackout',
    title: 'BINGO BLACKOUT',
    helpText:
      'Mark off all numbers on your card to achieve blackout! First to cover all 90 squares wins.',
    totalNumbers: 90,
    description: 'Mark every number on your card to win. Requires full card completion (blackout).',
  },

  bonus: {
    id: 'bonus',
    title: 'BINGO BONUS',
    helpText: 'Earn bonus points for quick wins! Patterns and speed bonuses multiply your score.',
    totalNumbers: 75,
    patternBonus: true,
    speedBonus: true,
    description:
      'Earn bonus multipliers based on speed. Complete patterns quickly for extra points.',
  },

  rush: {
    id: 'rush',
    title: 'BINGO RUSH',
    helpText: 'Fast-paced bingo action! Mark numbers quickly and achieve patterns for rapid wins.',
    totalNumbers: 75,
    speedBonus: true,
    description: 'Speed matters! The faster you complete patterns, the higher your score.',
  },

  survival: {
    id: 'survival',
    title: 'BINGO SURVIVAL',
    helpText:
      'Survive the time limit! Mark patterns before time runs out. The longer you last, the harder it gets!',
    totalNumbers: 75,
    timeLimit: 300, // 5 minutes default
    description:
      'Race against the clock! Complete patterns before time expires. Difficulty increases over time.',
  },

  pattern: {
    id: 'pattern',
    title: 'PATTERN BINGO',
    helpText:
      'Mark patterns quickly and earn bonus multipliers! Special arrangement wins are worth extra points.',
    totalNumbers: 75,
    patternBonus: true,
    description:
      'Focus on specific patterns. Completing unique shapes and arrangements earns bonus multipliers.',
  },

  power: {
    id: 'power',
    title: 'POWER BINGO',
    helpText:
      'Unlock power-ups and special abilities! Use them strategically to gain advantages and win faster!',
    totalNumbers: 75,
    powerUps: true,
    description:
      'Unlock and collect power-ups during gameplay. Use them strategically to mark multiple cells or manipulate draws.',
  },

  speed: {
    id: 'speed',
    title: 'SPEED BINGO',
    helpText:
      'Lightning-fast draw rate! Keep up with the rapid number calls and win before anyone else!',
    totalNumbers: 75,
    speedBonus: true,
    description:
      'Ultra-fast draw rate and rapid gameplay. Reflexes matter in this high-speed variant.',
  },
}

export const VARIANT_IDS = Object.keys(BINGO_VARIANTS) as BingoVariantId[]

/**
 * Get variant configuration by ID.
 */
export function getVariantConfig(variantId: BingoVariantId): BingoVariantConfig {
  const config = BINGO_VARIANTS[variantId]
  if (!config) {
    throw new Error(`Unknown bingo variant: ${variantId}`)
  }
  return config
}

/**
 * Check if variant supports speed bonuses.
 */
export function supportsSpeedBonus(variantId: BingoVariantId): boolean {
  return BINGO_VARIANTS[variantId]?.speedBonus ?? false
}

/**
 * Check if variant supports pattern bonuses.
 */
export function supportsPatternBonus(variantId: BingoVariantId): boolean {
  return BINGO_VARIANTS[variantId]?.patternBonus ?? false
}

/**
 * Check if variant has power-ups.
 */
export function hasPowerUps(variantId: BingoVariantId): boolean {
  return BINGO_VARIANTS[variantId]?.powerUps ?? false
}

/**
 * Get total numbers for a variant.
 */
export function getTotalNumbers(variantId: BingoVariantId): number {
  return BINGO_VARIANTS[variantId]?.totalNumbers ?? 75
}

/**
 * Get time limit for a variant (if applicable, returns 0 if none).
 */
export function getTimeLimit(variantId: BingoVariantId): number {
  return BINGO_VARIANTS[variantId]?.timeLimit ?? 0
}
