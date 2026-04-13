/**
 * Bingo scoring system - handles points, bonuses, and multipliers per variant.
 */

import type { BingoVariantId } from './variants'

export interface ScoreBreakdown {
  basePoints: number
  speedBonus: number
  patternBonus: number
  multiplier: number
  totalPoints: number
}

/**
 * Base points for winning with different patterns.
 */
const PATTERN_POINTS: Record<string, number> = {
  horizontal: 50,
  vertical: 50,
  'diagonal-left': 75,
  'diagonal-right': 75,
  'four-corners': 100,
  blackout: 500,
}

/**
 * Calculate base points for a win.
 */
export function getPatternPoints(pattern: string): number {
  return PATTERN_POINTS[pattern] ?? 50
}

/**
 * Calculate speed bonus multiplier based on time elapsed.
 * Faster wins = higher multiplier (1.0 to 2.0x).
 * For now, using a simplified calculation based on game progression.
 */
export function getSpeedMultiplier(numbersDrawn: number, totalNumbers: number): number {
  // If less than 30% of numbers drawn, significant speed bonus
  const percentage = numbersDrawn / totalNumbers
  if (percentage < 0.3) return 2.0 // 2x multiplier
  if (percentage < 0.4) return 1.75 // 1.75x
  if (percentage < 0.5) return 1.5 // 1.5x
  if (percentage < 0.6) return 1.25 // 1.25x
  return 1.0 // No bonus after 60% of numbers drawn
}

/**
 * Calculate pattern bonus based on pattern type and variant.
 * Some patterns are worth more in certain variants.
 */
export function getPatternBonus(pattern: string, variantId: BingoVariantId): number {
  // Pattern Bingo: special arrangement bonuses
  if (variantId === 'pattern') {
    if (pattern === 'blackout') return 500 // Blackout is rare in pattern bingo
    if (pattern === 'four-corners') return 200 // Four corners worth extra
    if (pattern === 'diagonal-left' || pattern === 'diagonal-right') return 150
  }

  // Bonus variant: all patterns worth extra
  if (variantId === 'bonus') {
    return getPatternPoints(pattern) * 0.5 // 50% bonus
  }

  // Rush and Speed: normal bonuses
  if (pattern === 'four-corners') return 50
  if (pattern === 'diagonal-left' || pattern === 'diagonal-right') return 25

  return 0
}

/**
 * Calculate total score for a win.
 */
export function calculateScore(
  pattern: string,
  variantId: BingoVariantId,
  numbersDrawn: number,
  totalNumbers: number,
): ScoreBreakdown {
  const basePoints = getPatternPoints(pattern)
  const patternBonus = getPatternBonus(pattern, variantId)
  const speedMultiplier = getSpeedMultiplier(numbersDrawn, totalNumbers)

  // Apply multipliers based on variant
  let multiplier = 1.0

  if (variantId === 'bonus' || variantId === 'rush') {
    multiplier = speedMultiplier
  }

  if (variantId === 'pattern') {
    // Pattern bingo uses base multiplier
    multiplier = speedMultiplier * 0.8 // Slightly lower base multiplier
  }

  const totalPoints = Math.floor((basePoints + patternBonus) * multiplier)

  return {
    basePoints,
    speedBonus: Math.floor((speedMultiplier - 1.0) * 100), // As percentage
    patternBonus,
    multiplier,
    totalPoints,
  }
}

/**
 * Award bonus points for survival variant based on time survived.
 */
export function getSurvivalBonus(elapsedSeconds: number, timeLimitSeconds: number): number {
  if (elapsedSeconds <= 0) return 0

  // Award points for every second survived
  const timeBonus = elapsedSeconds * 10

  // Award multiplier if survived more than 50% of time limit
  let multiplier = 1.0
  if (elapsedSeconds > timeLimitSeconds * 0.5) {
    multiplier = 1.5
  }
  if (elapsedSeconds > timeLimitSeconds * 0.75) {
    multiplier = 2.0
  }

  return Math.floor(timeBonus * multiplier)
}

/**
 * Calculate score for power-up usage.
 * Power-ups might reduce score or apply multipliers based on difficulty.
 */
export function getPowerUpPenalty(powerUpsUsed: number): number {
  // Each power-up used reduces score by 5% (multiplicative)
  let penalty = 1.0
  for (let i = 0; i < powerUpsUsed; i++) {
    penalty *= 0.95 // 5% reduction per power-up
  }
  return Math.floor((1 - penalty) * 100) // Return as percentage penalty
}
