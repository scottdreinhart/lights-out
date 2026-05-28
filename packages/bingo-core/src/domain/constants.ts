/**
 * Bingo Core Constants - Shared configuration across all variants
 */

import type { BonusConfig, DifficultyConfig, GameConfig } from './types'

/**
 * Standard 5×5 bingo column bounds (B=1-15, I=16-30, N=31-45, G=46-60, O=61-75)
 * Some variants use 1-90 (Bingo-90) or other ranges
 */
export const COLUMN_BOUNDS_90 = [
  [1, 15],
  [16, 30],
  [31, 45],
  [46, 60],
  [61, 75],
] as const

export const COLUMN_BOUNDS_80 = [
  [1, 16],
  [17, 32],
  [33, 48],
  [49, 64],
  [65, 80],
] as const

export const COLUMN_BOUNDS_30 = [
  [1, 6],
  [7, 12],
  [13, 18],
  [19, 24],
  [25, 30],
] as const

/**
 * Difficulty configurations - standard across variants
 * Variants can override individual settings
 */
export const DIFFICULTY_CONFIGS: Record<string, DifficultyConfig> = {
  easy: {
    difficulty: 'easy',
    callInterval: 5000, // 5 seconds between calls
    cardsPerPlayer: 1,
    playerCount: { min: 1, max: 3 },
    timeout: 300, // 5 minutes
  },
  medium: {
    difficulty: 'medium',
    callInterval: 3000, // 3 seconds
    cardsPerPlayer: 1,
    playerCount: { min: 2, max: 6 },
    timeout: 180, // 3 minutes
  },
  hard: {
    difficulty: 'hard',
    callInterval: 1500, // 1.5 seconds
    cardsPerPlayer: 2,
    playerCount: { min: 4, max: 10 },
    timeout: 120, // 2 minutes
  },
  expert: {
    difficulty: 'expert',
    callInterval: 800, // 0.8 seconds
    cardsPerPlayer: 3,
    playerCount: { min: 6, max: 20 },
    timeout: 90, // 1.5 minutes
  },
}

/**
 * Standard bonus configuration
 */
export const DEFAULT_BONUS_CONFIG: BonusConfig = {
  speedBonus: {
    enabled: true,
    baseMultiplier: 50, // 50 points
    timeThreshold: 10000, // 10 seconds to complete pattern after call
  },
  reactionBonus: {
    enabled: true,
    pointsPerCell: 5, // 5 points per cell marked within threshold
    timeThreshold: 500, // 500ms to mark after number called
  },
  multiCardBonus: {
    enabled: true,
    pointsPerCard: 25, // 25 points for completing on 2nd+ card
  },
  patternBonus: {
    enabled: true,
    bonusByPattern: {
      'line-horizontal': 10,
      'line-vertical': 10,
      'line-diagonal': 15,
      corners: 20,
      frame: 30,
      'full-house': 100,
      custom: 0,
    },
  },
}

/**
 * Standard bingo game configuration
 */
export const DEFAULT_GAME_CONFIG: GameConfig = {
  difficulty: 'medium',
  difficultyConfig: DIFFICULTY_CONFIGS.medium,
  maxNumbers: 90,
  cardDimensions: { rows: 5, cols: 5 },
  bonusConfig: DEFAULT_BONUS_CONFIG,
  freeCenterSpace: true,
  allowRepeats: false,
  stampingMode: 'manual',
  roundTimerConfig: {
    enabled: true,
    totalDuration: 180,
    speedRating: true,
    earlyCompletionBonus: true,
  },
}

/**
 * Stamping mode penalties (manual stamping)
 */
export const STAMPING_PENALTIES = {
  wrongStamp: 10, // Points deducted for incorrect stamp attempt
  missedStamp: 5, // Points deducted for each missed stamp
} as const

/**
 * Speed rating configuration
 */
export const SPEED_RATING_CONFIG = {
  maxSpeedScore: 100, // Maximum speed rating (0-100)
  maxAccuracyScore: 100, // Maximum accuracy rating (0-100)
  maxCombinedRating: 100, // Maximum combined rating (0-100)
} as const

/**
 * Early completion bonus configuration
 */
export const EARLY_COMPLETION_CONFIG = {
  maxBonus: 50, // Maximum bonus points for early completion
  timeThresholdPercent: 30, // Max bonus when using ≤30% of available time; 0 bonus if ≥70% used
} as const

/**
 * Scoring thresholds
 */
export const SCORE_THRESHOLDS = {
  baseWin: 100,
  speedBonusMax: 50,
  reactionBonusPerCell: 5,
  reactionBonusMax: 125, // 25 cells * 5 points
  multiCardBonus: 25,
  perfectRound: 200,
}

/**
 * Time-based constants (in milliseconds)
 */
export const TIMING = {
  reactionThreshold: 500, // milliseconds to mark and get reaction bonus
  speedBonusWindow: 10000, // milliseconds from call to complete pattern
  callIntervalMin: 500,
  callIntervalMax: 10000,
  preGameCountdown: 3000, // 3 second countdown before calling starts
}

/**
 * Game patterns
 */
export const PATTERNS = {
  lineHorizontal: 'line-horizontal',
  lineVertical: 'line-vertical',
  lineDiagonal: 'line-diagonal',
  corners: 'corners',
  frame: 'frame',
  fullHouse: 'full-house',
  custom: 'custom',
} as const

/**
 * Bingo call letters (B-I-N-G-O for 5×5)
 */
export const BINGO_LETTERS = ['B', 'I', 'N', 'G', 'O'] as const

/**
 * Format a number as a call (e.g., "B-7")
 */
export const formatCall = (number: number, columnBounds = COLUMN_BOUNDS_90): string => {
  const columnIndex = columnBounds.findIndex(([min, max]) => number >= min && number <= max)
  if (columnIndex === -1) {
    return `${number}`
  }
  return `${BINGO_LETTERS[columnIndex]}-${number}`
}
