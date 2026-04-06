import type { SimonColor, SimonRuleConfig } from '@games/simon-engine'
import { getColorSequence } from '@games/simon-engine'
import type { SimonGameState } from './types'

/**
 * Audio frequencies for each Simon color (Hz)
 * Sourced from original Simon electronic device
 */
export const SIMON_FREQUENCIES: Record<SimonColor, number> = {
  red: 1000,
  green: 1500,
  yellow: 2000,
  blue: 500,
  orange: 1250,
  purple: 750,
  cyan: 1750,
  pink: 1200,
}

/**
 * Visual colors for UI rendering
 */
export const SIMON_COLOR_VALUES: Record<SimonColor, string> = {
  red: '#FF4444',
  green: '#44FF44',
  yellow: '#FFFF44',
  blue: '#4444FF',
  orange: '#FF8844',
  purple: '#FF44FF',
  cyan: '#44FFFF',
  pink: '#FF66BB',
}

/**
 * Create initial game state
 */
export function createInitialGameState(rules: SimonRuleConfig): SimonGameState {
  const colors = getColorSequence(rules.colorCount)
  const firstColor = colors[Math.floor(Math.random() * colors.length)]

  // Multiplayer player count
  const playerCount = rules.multiplayerMode ? 4 : 1

  return {
    // Sequence
    sequence: [firstColor],
    playerInput: [],
    currentRound: 1,
    sequenceIndex: 0,

    // Game state
    phase: 'idle',
    gameOver: false,
    gameOverReason: null,
    winner: null,

    // Score
    score: 0,
    highScore: 0,
    roundsCompleted: 0,
    timeElapsed: 0,
    startTime: null,

    // Multiplayer
    currentPlayer: 1,
    playersActive: Array(playerCount).fill(true),
    playerScores: Object.fromEntries(Array.from({ length: playerCount }, (_, i) => [i + 1, 0])),

    // UI
    activeColor: null,
    colorFlashDuration: 500, // 500ms normal flash
    message: 'Press Start to begin',

    // Error
    error: null,
  }
}

/**
 * Generate next color in sequence
 */
export function generateNextColor(colors: SimonColor[]): SimonColor {
  return colors[Math.floor(Math.random() * colors.length)]
}

/**
 * Get speed multiplier based on difficulty level and round number
 */
export function getSpeedMultiplier(
  difficultyLevel: 1 | 2 | 3 | 4,
  roundNumber: number,
  speedIncreaseEnabled: boolean,
): number {
  if (!speedIncreaseEnabled) {
    return 1
  }

  // Baseline speed per difficulty
  let baseMultiplier = 1
  switch (difficultyLevel) {
    case 1:
      baseMultiplier = 0.8 // Slow
      break
    case 2:
      baseMultiplier = 1.0 // Normal
      break
    case 3:
      baseMultiplier = 1.2 // Fast
      break
    case 4:
      baseMultiplier = 1.5 // Very fast
      break
  }

  // Speed increases at thresholds: 5, 9, 13, 17, etc.
  let speedIncrease = 1
  if (roundNumber >= 5) speedIncrease = 1.05
  if (roundNumber >= 9) speedIncrease = 1.1
  if (roundNumber >= 13) speedIncrease = 1.15
  if (roundNumber >= 17) speedIncrease = 1.2
  if (roundNumber >= 21) speedIncrease = 1.25

  return baseMultiplier * speedIncrease
}

/**
 * Calculate flash duration based on speed
 */
export function getFlashDuration(baseFlashMs: number, speedMultiplier: number): number {
  return Math.max(100, baseFlashMs / speedMultiplier)
}

/**
 * Check if player input is correct so far
 */
export function isInputCorrect(
  playerInput: SimonColor[],
  sequence: SimonColor[],
): 'correct' | 'mismatch' | 'incomplete' {
  if (playerInput.length === 0) {
    return 'incomplete'
  }

  for (let i = 0; i < playerInput.length; i++) {
    if (playerInput[i] !== sequence[i]) {
      return 'mismatch'
    }
  }

  if (playerInput.length < sequence.length) {
    return 'incomplete'
  }

  return 'correct'
}

/**
 * Check if sequence generation should stop
 */
export function shouldEndGame(currentRound: number, maxSequenceLength: number): boolean {
  return currentRound > maxSequenceLength
}

/**
 * Calculate delay between device playback signals (ms)
 */
export function getPlaybackDelay(
  baseDelayMs: number,
  speedMultiplier: number,
  flashDuration: number,
): number {
  // Total time: flash + pause = baseDelay / speedMultiplier + flashDuration
  const pauseTime = baseDelayMs / speedMultiplier - flashDuration
  return Math.max(50, pauseTime)
}
