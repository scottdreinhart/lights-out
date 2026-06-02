/**
 * Bingo Core Types - Shared across all bingo variants
 * Framework-agnostic, pure TypeScript
 */

/**
 * Basic grid cell - represents one number on a bingo card
 */
export type Cell = {
  number: number
  marked: boolean
  markedAt?: number // timestamp when marked
}

/**
 * Bingo card - 5×5, 3×3, or variant grid of cells
 */
export type Card = {
  id: string
  playerId: string
  grid: Cell[][]
  dimensions: { rows: number; cols: number }
  columnBounds?: [number, number][] // For 5×5 BINGO columns
  pattern?: CardPattern
  markedAt: Record<string, number> // key: "row,col", value: timestamp
}

/**
 * Card pattern (can vary per variant)
 */
export type CardPattern =
  | 'line-horizontal'
  | 'line-vertical'
  | 'line-diagonal'
  | 'corners'
  | 'frame'
  | 'full-house'
  | 'custom'

/**
 * Stamping mode - how numbers are marked on the card
 */
export type StampingMode = 'auto' | 'manual'

/**
 * Stamp attempt record - tracks manual stamp attempts
 */
export type StampAttempt = {
  number: number
  row: number
  col: number
  attemptedAt: number // timestamp
  success: boolean // was this the correct number called?
  calledNumbers: number[] // which numbers had been called at this attempt time
}

/**
 * Round timer configuration - how each round is timed
 */
export type RoundTimerConfig = {
  enabled: boolean
  totalDuration: number // seconds per round
  speedRating: boolean // enable speed rating based on completion time
  earlyCompletionBonus: boolean // bonus for hitting "done" early
}

/**
 * Speed rating result - performance metric for round completion
 */
export type SpeedRating = {
  timeToComplete: number // milliseconds from round start to completion
  totalRoundTime: number // milliseconds per round
  speedScore: number // 0-100 scale
  accuracyScore: number // 0-100 scale (100 = no missed stamps in manual mode)
  combinedRating: number // (speedScore + accuracyScore) / 2
}

/**
 * Player accuracy tracking (manual stamping mode)
 */
export type PlayerAccuracy = {
  playerId: string
  totalNumbersCalled: number
  stampsMissed: number // numbers called but not marked in manual mode
  stampErrors: number // incorrect stamps (marked wrong numbers)
  accumulatedPenalty: number // points deducted for errors
}

/**
 * Called number record - tracks which numbers have been called and when
 */
export type CallRecord = {
  number: number
  callOrder: number // 1st call, 2nd call, etc.
  calledAt: number // game clock timestamp
  visual: string // "B-7" format
}

/**
 * Game difficulties with associated configurations
 */
export type Difficulty = 'easy' | 'medium' | 'hard' | 'expert'

/**
 * Configuration for a difficulty level
 */
export type DifficultyConfig = {
  difficulty: Difficulty
  callInterval: number // milliseconds between number calls
  cardsPerPlayer: number // how many cards each player gets
  playerCount: { min: number; max: number }
  timeout?: number // seconds before game ends
  createsWhenFirstCalled?: number // when first number is called in some variants
}

/**
 * Game state - complete current state of a bingo game
 */
export type GameState = {
  id: string
  difficulty: Difficulty
  cards: Card[]
  calledNumbers: CallRecord[]
  gameStartTime: number
  gameEndTime?: number
  isGameActive: boolean
  currentCallIndex: number // which call are we on (0-90)
  stampingMode: StampingMode // 'auto' or 'manual'
  roundStartTime?: number // when current round started
  roundEndTime?: number // when current round ended (player hit "done" or time expired)
  stampAttempts?: StampAttempt[] // only populated in manual mode
  playerAccuracy?: Record<string, PlayerAccuracy> // keyed by playerId, manual mode only
  winner?: {
    playerId: string
    cardId: string
    pattern: CardPattern
    completedAt: number
    bonusPoints: number
    speedRating?: SpeedRating // performance data
  }
}

/**
 * Score calculation result
 */
export type ScoreResult = {
  baseScore: number
  bonuses: {
    speedBonus?: number
    reactionBonus?: number
    multiCardBonus?: number
    patternBonus?: number
  }
  totalScore: number
  breakdown: Record<string, number>
}

/**
 * Player in a bingo game
 */
export type Player = {
  id: string
  name: string
  cards: string[] // array of card IDs
  totalScore: number
  roundScores: number[]
  isActive: boolean
}

/**
 * Win detection result
 */
export type WinDetection = {
  won: boolean
  pattern?: CardPattern
  coordinate?: { row: number; col: number }
  foundAt?: {
    row: number
    col: number
  }[]
}

/**
 * Bonus configuration - how to calculate bonuses
 */
export type BonusConfig = {
  speedBonus: {
    enabled: boolean
    baseMultiplier: number
    timeThreshold: number // ms to complete pattern after call
  }
  reactionBonus: {
    enabled: boolean
    pointsPerCell: number
    timeThreshold: number // ms to mark after call (500ms)
  }
  multiCardBonus: {
    enabled: boolean
    pointsPerCard: number
  }
  patternBonus: {
    enabled: boolean
    bonusByPattern: Record<CardPattern, number>
  }
}

/**
 * Complete game configuration
 */
export type GameConfig = {
  difficulty: Difficulty
  difficultyConfig: DifficultyConfig
  maxNumbers: number // 1-90 for standard bingo
  cardDimensions: { rows: number; cols: number }
  bonusConfig: BonusConfig
  freeCenterSpace: boolean
  allowRepeats: boolean // can same number be called twice?
  stampingMode: StampingMode // 'auto' or 'manual'
  roundTimerConfig: RoundTimerConfig // timer settings for rounds
}
