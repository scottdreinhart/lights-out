/**
 * Bingo Survival - Variant-Specific Constants
 *
 * Survival mode is an endless endurance game where players progress through
 * increasingly difficult levels with decreasing time limits per level.
 */

/**
 * Per-level time limits (in seconds)
 *
 * Level progression:
 * - Levels 1-3: 120 seconds (2 minutes) - introduction phase
 * - Levels 4-6: 90 seconds (1.5 minutes) - intermediate phase
 * - Levels 7-9: 60 seconds (1 minute) - advanced phase
 * - Level 10+: 45 seconds - expert phase (never changes, infinite levels)
 */
export const LEVEL_TIME_LIMITS = [
  // Levels 1-3 (Introduction)
  120, // Level 1
  120, // Level 2
  120, // Level 3
  // Levels 4-6 (Intermediate)
  90, // Level 4
  90, // Level 5
  90, // Level 6
  // Levels 7-9 (Advanced)
  60, // Level 7
  60, // Level 8
  60, // Level 9
  // Level 10+ (Expert)
  45, // Level 10+ (repeats this value for all levels ≥10)
] as const

/**
 * Get the time limit for a specific level
 * @param level - The current level (1-indexed)
 * @returns Time limit in seconds
 */
export const getLevelTimeLimit = (level: number): number => {
  if (level < 1) {
    return LEVEL_TIME_LIMITS[0]
  }
  if (level > LEVEL_TIME_LIMITS.length) {
    return LEVEL_TIME_LIMITS[LEVEL_TIME_LIMITS.length - 1]
  }
  return LEVEL_TIME_LIMITS[level - 1]
}

/**
 * Level-based difficulty scaling for bonus points
 */
export const LEVEL_BONUS_CONFIG = {
  baseMultiplier: 1.0, // Level 1 multiplier
  incrementPerLevel: 0.05, // +5% per level
  maxMultiplier: 3.0, // Cap at 3x bonus for very high levels
} as const

export const LEVEL_BONUS_MULTIPLIERS = 1 + LEVEL_BONUS_CONFIG.incrementPerLevel

/**
 * Get the bonus multiplier for a specific level
 * @param level - The current level (1-indexed)
 * @returns Bonus multiplier (1.0 = normal, 2.0 = double, etc.)
 */
export const getLevelBonusMultiplier = (level: number): number => {
  const multiplier =
    LEVEL_BONUS_CONFIG.baseMultiplier + (level - 1) * LEVEL_BONUS_CONFIG.incrementPerLevel
  return Math.min(multiplier, LEVEL_BONUS_CONFIG.maxMultiplier)
}

/**
 * Difficulty scaling based on level progression
 * Affects call interval (how fast numbers are called)
 */
export const LEVEL_DIFFICULTY_PROGRESSION = {
  // Base call interval (ms) - starts fast at level 1, doesn't decrease further
  initialCallInterval: 1500, // 1.5 seconds
  minCallInterval: 800, // 0.8 seconds (expert difficulty floor)
  // Levels don't increase call speed beyond expert baseline
} as const

/**
 * Survival-specific score bonuses
 */
export const SURVIVAL_SCORE_BONUSES = {
  perLevelComplete: 100, // Base points for completing a level
  perSuccessiveLevel: 50, // Additional points per level reached
  levelSurvivalStreak: 25, // Points per consecutive level without timeout
} as const

export const SURVIVAL_BASE_POINTS = SURVIVAL_SCORE_BONUSES.perLevelComplete
