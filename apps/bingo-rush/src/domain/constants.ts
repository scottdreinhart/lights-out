/**
 * Bingo Rush - Variant-Specific Constants
 *
 * Rush mode is a timed race where players compete against a global countdown.
 * Players can earn time extensions by completing patterns quickly.
 */

/**
 * Global timer duration per difficulty (in seconds)
 *
 * The entire game session uses a single global countdown timer.
 * All players see the same time remaining.
 */
export const GLOBAL_TIMER_SECONDS = {
  easy: 300, // 5 minutes
  medium: 180, // 3 minutes
  hard: 90, // 1.5 minutes
  expert: 45, // 45 seconds
} as const

// Alias for compatibility with hooks
export const GLOBAL_TIMERS = GLOBAL_TIMER_SECONDS

/**
 * Time extension configuration
 *
 * Players can earn time extensions by completing patterns quickly.
 * Extensions are limited to prevent infinite gameplay.
 */
export const EXTENSION_CONFIG = {
  secondsPerExtension: 20, // Base extension time (seconds added per extension)
  maxExtensions: 3, // Absolute maximum number of extensions per game
  extensionResetPerPattern: true, // Extension count resets each level/round (game-specific)
} as const

// Aliases for compatibility with hooks
export const EXTENSION_SECONDS = EXTENSION_CONFIG.secondsPerExtension
export const MAX_EXTENSIONS = EXTENSION_CONFIG.maxExtensions

/**
 * Extension earning criteria
 *
 * Extensions are earned by completing patterns within specific thresholds
 * relative to the time remaining.
 */
export const EXTENSION_EARNING = {
  speedRatingThreshold: 85, // Speed rating (0-100) must be ≥85 to earn extension
  accuracyThreshold: 90, // Accuracy must be ≥90% to earn extension
  timePercentageThreshold: 70, // Must complete pattern within 70% of available time
} as const

/**
 * Rush-specific score bonuses
 */
export const RUSH_SCORE_BONUSES = {
  basePatternBonus: 100, // Points for completing a pattern
  speedBonus: 50, // Additional bonus for fast pattern completion
  accuracyBonus: 25, // Additional bonus for accurate marking
  comebackBonus: 75, // Bonus for completing pattern when <10s remaining
  extensionEarned: 40, // Bonus for earning a time extension
  globalTimeRemaining: 1, // Points per second remaining at end of game
} as const

/**
 * Rush-specific difficulty modifiers
 */
export const RUSH_DIFFICULTY_MODIFIERS = {
  easy: 1.0, // Normal scoring
  medium: 1.2, // +20% bonus points
  hard: 1.5, // +50% bonus points
  expert: 2.0, // +100% bonus points (double scoring)
} as const

/**
 * Rush-specific pattern values
 *
 * Some patterns may be worth more points due to difficulty in time pressure
 */
export const RUSH_PATTERN_VALUES = {
  line: 100,
  corners: 150,
  frame: 200,
  plus: 175,
  fullHouse: 500,
} as const

/**
 * Get the global timer duration for a difficulty
 * @param difficulty - Game difficulty ('easy' | 'medium' | 'hard' | 'expert')
 * @returns Timer duration in seconds
 */
export const getGlobalTimer = (difficulty: keyof typeof GLOBAL_TIMER_SECONDS): number => {
  return GLOBAL_TIMER_SECONDS[difficulty] ?? GLOBAL_TIMER_SECONDS.medium
}

/**
 * Get the difficulty-based score multiplier
 * @param difficulty - Game difficulty
 * @returns Score multiplier (1.0 = normal)
 */
export const getDifficultyScoreMultiplier = (
  difficulty: keyof typeof RUSH_DIFFICULTY_MODIFIERS,
): number => {
  return RUSH_DIFFICULTY_MODIFIERS[difficulty] ?? RUSH_DIFFICULTY_MODIFIERS.medium
}
