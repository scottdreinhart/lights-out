/**
 * Simon Says — Domain Board Operations
 * Pure functions for creating and managing Simon Says sequence state.
 * No React, no DOM — purely functional transformations.
 */

import type { SimonColor } from './rules/simon.rules'
import type { SimonGameState } from './types'

/**
 * Create the initial Simon Says game state.
 */
export function createInitialState(): SimonGameState {
  return {
    sequence: [],
    playerInput: [],
    currentRound: 0,
    sequenceIndex: 0,
    phase: 'idle',
    gameOver: false,
    gameOverReason: null,
    winner: null,
    score: 0,
    highScore: 0,
    roundsCompleted: 0,
    timeElapsed: 0,
    startTime: null,
    message: 'Press Start to play',
    error: null,
  }
}

/**
 * Add the next color to the device sequence.
 */
export function appendToSequence(state: SimonGameState, color: SimonColor): SimonGameState {
  return {
    ...state,
    sequence: [...state.sequence, color],
  }
}

/**
 * Record a player's color input.
 */
export function addPlayerInput(state: SimonGameState, color: SimonColor): SimonGameState {
  return {
    ...state,
    playerInput: [...state.playerInput, color],
  }
}

/**
 * Reset player input for the next round.
 */
export function clearPlayerInput(state: SimonGameState): SimonGameState {
  return {
    ...state,
    playerInput: [],
    sequenceIndex: 0,
  }
}
