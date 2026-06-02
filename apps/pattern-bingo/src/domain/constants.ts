/**
 * Pattern Bingo - Variant-Specific Constants
 *
 * Pattern mode requires completing multiple different winning patterns.
 * Each pattern type has different point values, and completing patterns
 * consecutively builds multipliers for increased rewards.
 */

/**
 * Pattern-specific point values
 *
 * These are the base points awarded for completing each pattern type.
 * Multipliers are applied based on consecutive pattern completions.
 */
export const PATTERN_BASE_POINTS = {
  line: 100, // Single line (horizontal, vertical, or diagonal)
  corners: 150, // Four corners of the card
  frame: 200, // Border frame (outer ring of 16 cells)
  plus: 175, // Plus/cross pattern (center + cardinal directions)
  fullHouse: 500, // All cells marked (25 cells)
} as const

/**
 * Pattern multiplier system
 *
 * Completing patterns consecutively (without losing a round) builds multipliers.
 * These multipliers apply to subsequent pattern earnings.
 *
 * Examples:
 * - 1st pattern: 100 points (1.0x base multiplier)
 * - 2nd pattern: 150 points (1.5x multiplier of base points)
 * - 3rd pattern: 200 points (2.0x multiplier)
 * - 4th+ pattern: 250 points (2.5x multiplier, caps at 2.5x)
 */
export const PATTERN_MULTIPLIER_PROGRESSION = {
  base: 1.0, // 1st pattern (no multiplier)
  second: 1.5, // 2nd consecutive pattern
  third: 2.0, // 3rd consecutive pattern
  fourth_plus: 2.5, // 4th+ consecutive patterns (maximum)
} as const

/**
 * Legacy aliases for hook compatibility
 * These match the expected imports in the hook file
 */
export const PATTERN_POINTS = {
  LINE: PATTERN_BASE_POINTS.line,
  CORNERS: PATTERN_BASE_POINTS.corners,
  FRAME: PATTERN_BASE_POINTS.frame,
  PLUS: PATTERN_BASE_POINTS.plus,
  FULL_HOUSE: PATTERN_BASE_POINTS.fullHouse,
} as const

export const PATTERN_MULTIPLIERS = [
  PATTERN_MULTIPLIER_PROGRESSION.base,
  PATTERN_MULTIPLIER_PROGRESSION.second,
  PATTERN_MULTIPLIER_PROGRESSION.third,
  PATTERN_MULTIPLIER_PROGRESSION.fourth_plus,
] as const

/**
 * Difficulty-based pattern earning rates
 *
 * How many patterns must be completed per difficulty level
 * to advance or win the game (varies by game mode).
 */
export const DIFFICULTY_PATTERN_REQUIREMENTS = {
  easy: {
    patternsToWin: 5, // Must complete 5 different patterns to win
    callInterval: 5000, // Base call interval in ms (5 seconds)
    roundTimeout: 300, // Round time limit in seconds (5 minutes)
  },
  medium: {
    patternsToWin: 7, // Must complete 7 different patterns
    callInterval: 3000, // 3 seconds
    roundTimeout: 180, // 3 minutes
  },
  hard: {
    patternsToWin: 10, // Must complete 10 different patterns
    callInterval: 1500, // 1.5 seconds
    roundTimeout: 120, // 2 minutes
  },
  expert: {
    patternsToWin: 15, // Must complete 15 different patterns
    callInterval: 800, // 0.8 seconds
    roundTimeout: 90, // 1.5 minutes
  },
} as const

/**
 * Pattern diversity bonus
 *
 * Bonus points awarded for completing a variety of pattern types
 * rather than repeating the same pattern.
 */
export const PATTERN_DIVERSITY_BONUS = {
  perUniquePatternType: 25, // Points for completing each unique pattern type
  allPatternsCompleted: 200, // Bonus for completing all 5 pattern types in one game
} as const

/**
 * Speed rating configuration for pattern bingo
 *
 * Pattern completion speed affects scoring multipliers
 */
export const PATTERN_SPEED_RATING_CONFIG = {
  maxSpeedScore: 100,
  maxAccuracyScore: 100,
  speedScoreWeight: 0.4, // 40% of combined rating based on speed
  accuracyScoreWeight: 0.6, // 60% of combined rating based on accuracy
} as const

/**
 * Get base points for a pattern type
 * @param patternType - Pattern type ('line' | 'corners' | 'frame' | 'plus' | 'fullHouse')
 * @returns Base points for pattern
 */
export const getPatternBasePoints = (patternType: keyof typeof PATTERN_BASE_POINTS): number => {
  return PATTERN_BASE_POINTS[patternType] ?? 0
}

/**
 * Get multiplier for consecutive pattern completion
 * @param patternNumber - Which pattern in the sequence (1-indexed)
 * @returns Multiplier to apply (1.0 = base, 2.5 = capped)
 */
export const getPatternMultiplier = (patternNumber: number): number => {
  if (patternNumber <= 1) {
    return PATTERN_MULTIPLIER_PROGRESSION.base
  }
  if (patternNumber === 2) {
    return PATTERN_MULTIPLIER_PROGRESSION.second
  }
  if (patternNumber === 3) {
    return PATTERN_MULTIPLIER_PROGRESSION.third
  }
  return PATTERN_MULTIPLIER_PROGRESSION.fourth_plus // Cap at 2.5x
}

/**
 * Calculate final points for pattern completion
 * @param basePoints - Base points for pattern type
 * @param multiplier - Progression multiplier (from consecutive patterns)
 * @param speedRating - Speed rating (0-100)
 * @returns Final points awarded
 */
export const calculatePatternPoints = (
  basePoints: number,
  multiplier: number,
  speedRating: number = 50,
): number => {
  const speedBonus = (speedRating / 100) * (basePoints * 0.1) // Up to 10% speed bonus
  return Math.floor(basePoints * multiplier + speedBonus)
}
