/**
 * Bingo game rules and scoring logic
 * Pure functions for game mechanics and validation
 */

import { checkWin } from './card'
import { SCORE_THRESHOLDS } from './constants'
import type {
  BonusConfig,
  Card,
  PlayerAccuracy,
  RoundTimerConfig,
  ScoreResult,
  SpeedRating,
  StampAttempt,
  StampingMode,
  WinDetection,
} from './types'

/**
 * Generate next random number (1-90 for standard bingo)
 */
export const getNextNumber = (
  maxNumber = 90,
  usedNumbers: Set<number> = new Set(),
): number | null => {
  if (usedNumbers.size >= maxNumber) {
    return null // All numbers called
  }

  let number: number
  do {
    number = Math.floor(Math.random() * maxNumber) + 1
  } while (usedNumbers.has(number))

  return number
}

/**
 * Detect if a card has won with specific pattern
 */
export const detectWin = (card: Card, patternType: string = 'line-horizontal'): WinDetection => {
  const won = checkWin(card, patternType as any)
  return {
    won,
    pattern: won ? (patternType as any) : undefined,
  }
}

/**
 * Calculate score with bonuses
 */
export const calculateScore = (
  baseScore: number = SCORE_THRESHOLDS.baseWin,
  bonuses: {
    speedBonus?: number
    reactionBonus?: number
    multiCardBonus?: number
    patternBonus?: number
  } = {},
): ScoreResult => {
  const totalScore = baseScore + Object.values(bonuses).reduce((sum, b) => sum + (b || 0), 0)

  return {
    baseScore,
    bonuses,
    totalScore,
    breakdown: {
      base: baseScore,
      ...Object.fromEntries(Object.entries(bonuses).filter(([, v]) => v !== undefined)),
    },
  }
}

/**
 * Calculate speed bonus (if player completes pattern quickly after their winning number is called)
 */
export const getSpeedBonus = (
  completionTime: number,
  winningNumberCallTime: number,
  bonusConfig: BonusConfig,
): number => {
  if (!bonusConfig.speedBonus.enabled) {
    return 0
  }

  const timeDifference = completionTime - winningNumberCallTime
  if (timeDifference <= bonusConfig.speedBonus.timeThreshold) {
    return bonusConfig.speedBonus.baseMultiplier
  }

  return 0
}

/**
 * Calculate rapid marking bonus (marks within 500ms of call)
 */
export const getRapidMarkingBonus = (
  markTimestamps: Record<string, number>,
  callRecords: Array<{ number: number; calledAt: number }>,
  bonusConfig: BonusConfig,
): number => {
  if (!bonusConfig.reactionBonus.enabled) {
    return 0
  }

  let bonusCount = 0

  Object.values(markTimestamps).forEach((markTime) => {
    const recentCall = callRecords.find(
      (call) =>
        markTime >= call.calledAt &&
        markTime <= call.calledAt + bonusConfig.reactionBonus.timeThreshold,
    )
    if (recentCall) {
      bonusCount++
    }
  })

  return Math.min(
    bonusCount * bonusConfig.reactionBonus.pointsPerCell,
    bonusConfig.reactionBonus.pointsPerCell * 25,
  )
}

/**
 * Validate that a card is in valid game state
 */
export const validateCard = (card: Card): { valid: boolean; errors: string[] } => {
  const errors: string[] = []

  if (!card.id) {
    errors.push('Card missing ID')
  }

  if (!card.playerId) {
    errors.push('Card missing player ID')
  }

  if (!card.grid || card.grid.length === 0) {
    errors.push('Card missing grid')
  }

  if (card.grid) {
    if (!card.grid.every((row) => row.length === card.dimensions.cols)) {
      errors.push('Card grid has inconsistent column count')
    }

    if (card.grid.length !== card.dimensions.rows) {
      errors.push('Card dimensions mismatch')
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

/**
 * Check if a number is valid for a card (within bounds)
 */
export const isValidNumber = (number: number, maxNumber = 90): boolean => {
  return number >= 1 && number <= maxNumber && Number.isInteger(number)
}

/**
 * Get all possible winning patterns
 */
export const getPossiblePatterns = (): string[] => {
  return ['line-horizontal', 'line-vertical', 'line-diagonal', 'corners', 'frame', 'full-house']
}

/**
 * MANUAL STAMPING MODE: Validate a stamp attempt
 *
 * In manual mode, the player must manually mark the called number.
 * Returns validation result and whether the stamp was correct.
 */
export const validateStampAttempt = (
  attempt: StampAttempt,
  currentCalledNumbers: number[],
): {
  valid: boolean
  correct: boolean
  penalty: number
  reason?: string
} => {
  // Check if number was actually called
  const numberCalled = currentCalledNumbers.includes(attempt.number)

  if (!numberCalled) {
    return {
      valid: false,
      correct: false,
      penalty: 10,
      reason: `Number ${attempt.number} was not called yet. Incorrect stamp.`,
    }
  }

  return {
    valid: true,
    correct: true,
    penalty: 0,
    reason: 'Stamp valid and correct',
  }
}

/**
 * MANUAL STAMPING MODE: Detect missed stamps
 *
 * Compares called numbers with marked cells to find which numbers
 * were called but not marked by the player.
 */
export const detectMissedStamps = (
  card: Card,
  calledNumbers: number[],
): {
  missedNumbers: number[]
  missCount: number
  penalty: number
} => {
  const marked = new Set<number>()

  // Collect all marked numbers on card
  card.grid.forEach((row) => {
    row.forEach((cell) => {
      if (cell.marked) {
        marked.add(cell.number)
      }
    })
  })

  // Find numbers that were called but not marked
  const missedNumbers = calledNumbers.filter((num) => !marked.has(num))

  return {
    missedNumbers,
    missCount: missedNumbers.length,
    penalty: missedNumbers.length * 5, // 5 points per missed stamp
  }
}

/**
 * MANUAL STAMPING MODE: Track player accuracy
 *
 * Calculates accuracy metrics for a player in manual stamping mode.
 */
export const calculatePlayerAccuracy = (
  playerId: string,
  stampAttempts: StampAttempt[],
  totalNumbersCalled: number,
  card: Card,
): PlayerAccuracy => {
  // Count invalid stamps (wrong numbers marked)
  const invalidStamps = stampAttempts.filter((s) => !s.success).length

  // Count missed stamps (called but not marked)
  const calledNumbers = stampAttempts.map((s) => s.number)
  const missed = detectMissedStamps(card, calledNumbers)

  // Accumulate penalty
  const errorPenalty = invalidStamps * 10
  const missedPenalty = missed.penalty

  return {
    playerId,
    totalNumbersCalled,
    stampsMissed: missed.missCount,
    stampErrors: invalidStamps,
    accumulatedPenalty: errorPenalty + missedPenalty,
  }
}

/**
 * ROUND TIMER: Calculate speed rating
 *
 * Measures how quickly the player completed their pattern relative to
 * the round time limit.
 */
export const calculateSpeedRating = (
  roundStartTime: number,
  completionTime: number,
  roundTotalTime: number, // milliseconds
  accuracy: PlayerAccuracy,
): SpeedRating => {
  const timeToComplete = completionTime - roundStartTime

  // Speed score: 100 = instant completion, 0 = used full round time
  const speedScore = Math.max(0, 100 - (timeToComplete / roundTotalTime) * 100)

  // Accuracy score: deduct 1 point per 5 errors
  const errorDeduction = accuracy.accumulatedPenalty / 5
  const accuracyScore = Math.max(0, 100 - errorDeduction)

  // Combined rating: average of speed and accuracy
  const combinedRating = (speedScore + accuracyScore) / 2

  return {
    timeToComplete,
    totalRoundTime: roundTotalTime,
    speedScore: Math.round(speedScore),
    accuracyScore: Math.round(accuracyScore),
    combinedRating: Math.round(combinedRating),
  }
}

/**
 * ROUND TIMER: Calculate early completion bonus
 *
 * Awards bonus points if player completes pattern before round time expires
 * and signals completion early.
 */
export const getEarlyCompletionBonus = (
  timeUsed: number,
  roundTotalTime: number,
  config: RoundTimerConfig,
): number => {
  if (!config.earlyCompletionBonus) {
    return 0
  }

  const timeRemaining = roundTotalTime - timeUsed
  const percentageRemaining = timeRemaining / roundTotalTime

  // Grant bonus only if completed within 70% of round time
  if (percentageRemaining < 0.3) {
    return 0
  }

  // Bonus scales with how much time was left
  // Max 50 bonus points for completing in first 30% of time
  return Math.round(percentageRemaining * 50)
}

/**
 * MANUAL STAMPING MODE: Calculate final score with accuracy penalties
 *
 * Combines base score with speed bonus but deducts penalties for
 * accuracy errors in manual stamping mode.
 */
export const calculateManualModeScore = (
  baseScore: number,
  speedRating: SpeedRating,
  accuracy: PlayerAccuracy,
  stampingMode: StampingMode,
): ScoreResult => {
  if (stampingMode !== 'manual') {
    // Auto mode: no accuracy penalties
    return calculateScore(baseScore, {
      speedBonus: Math.round(speedRating.speedScore / 10),
    })
  }

  // Manual mode: apply accuracy penalties
  const speedBonus = Math.round(speedRating.combinedRating / 10) // 0-10 bonus
  const accuracyPenalty = accuracy.accumulatedPenalty

  const totalScore = Math.max(baseScore + speedBonus - accuracyPenalty, 0)

  return {
    baseScore,
    bonuses: {
      speedBonus,
    },
    totalScore,
    breakdown: {
      base: baseScore,
      speedBonus,
      accuracyPenalty: -accuracyPenalty,
    },
  }
}

/**
 * STAMPING MODE: Auto-mark numbers as they're called
 *
 * In auto mode, automatically marks all instances of a called number
 * on all cards.
 */
export const autoMarkNumber = (card: Card, calledNumber: number, timestamp: number): Card => {
  const updatedGrid = card.grid.map((row) =>
    row.map((cell) => {
      if (cell.number === calledNumber && !cell.marked) {
        return {
          ...cell,
          marked: true,
          markedAt: timestamp,
        }
      }
      return cell
    }),
  )

  return {
    ...card,
    grid: updatedGrid,
    markedAt: {
      ...card.markedAt,
      [`${calledNumber}`]: timestamp,
    },
  }
}
