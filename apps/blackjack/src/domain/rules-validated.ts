/**
 * Blackjack Validated Rules
 *
 * Wraps domain rules with input validation and sanitization.
 * This is the security boundary between untrusted input and game logic.
 *
 * Pattern:
 * - All external input goes through validators first
 * - Sanitizers ensure safe rendering of player-provided data
 * - Only validated data reaches domain rules
 * - Errors are classified and handled appropriately
 */

import { sanitizePlayerName } from '../app/sanitizers'
import { validateBetAmount, validateGameMove } from '../app/validators'
import * as rules from './rules'
import type { GameAction, GameState } from './types'

// ────────────────────────────────────────────────────────────────────────────
// Input Validation Wrapper Functions
// ────────────────────────────────────────────────────────────────────────────

/**
 * Safely process a player action with input validation
 *
 * Ensures action is one of the valid moves before processing game logic
 *
 * Example (before this layer):
 *   const action = userInput // Could be anything: 'hit', '<script>', 123, etc.
 *   const newState = rules.processPlayerAction(gameState, action) // UNSAFE!
 *
 * Example (with this layer):
 *   const action = userInput
 *   const result = validateAndProcessAction(gameState, action, newCard)
 *   if (result.ok) {
 *     const newState = result.value
 *   } else {
 *     console.error(result.error) // Input was rejected
 *   }
 */
export function validateAndProcessAction(
  gameState: GameState,
  action: unknown,
): { ok: true; value: GameState } | { ok: false; error: string } {
  // Validate action is one of the allowed moves
  const actionValidation = validateGameMove(action)
  if (!actionValidation.ok) {
    return { ok: false, error: actionValidation.error }
  }

  const validatedAction = actionValidation.value as GameAction

  try {
    // Call domain logic with validated input only
    const newState = rules.processPlayerAction(gameState, validatedAction)
    return { ok: true, value: newState }
  } catch (err) {
    // Catch any game-logic errors and classify them
    const message = err instanceof Error ? err.message : 'Unknown error'
    return { ok: false, error: `Game logic error: ${message}` }
  }
}

/**
 * Safely place a bet with input validation
 *
 * Ensures bet amount is a valid number within game limits
 */
export function validateAndPlaceBet(
  gameState: GameState,
  betAmount: unknown,
): { ok: true; value: GameState } | { ok: false; error: string } {
  // Validate bet amount
  const betValidation = validateBetAmount(betAmount)
  if (!betValidation.ok) {
    return { ok: false, error: betValidation.error }
  }

  const validatedBet = betValidation.value

  // Check if player exists and has sufficient balance
  const player = gameState.players[0]
  if (!player) {
    return { ok: false, error: 'No active player' }
  }

  if (validatedBet > player.balance) {
    return { ok: false, error: 'Insufficient balance for this bet' }
  }

  try {
    // Apply bet to current hand
    const newState: GameState = {
      ...gameState,
      players: [
        {
          ...player,
          currentHand: {
            ...player.currentHand,
            bet: validatedBet,
          },
        },
        ...gameState.players.slice(1),
      ],
    }
    return { ok: true, value: newState }
  } catch (err) {
    return { ok: false, error: 'Failed to place bet' }
  }
}

// ────────────────────────────────────────────────────────────────────────────
// Safe Domain Rules Re-exports (No Validation Needed)
// ────────────────────────────────────────────────────────────────────────────

// These functions don't take untrusted user input, so they're safe to call directly
export const calculateHandValue = rules.calculateHandValue
export const getHandValues = rules.getHandValues
export const getBestHandValue = rules.getBestHandValue
export const isBust = rules.isBust
export const isNaturalBlackjack = rules.isNaturalBlackjack
export const isTwentyOne = rules.isTwentyOne
export const canHit = rules.canHit
export const canStand = rules.canStand
export const canDoubleDown = rules.canDoubleDown
export const canSplit = rules.canSplit
export const determineOutcome = rules.determineOutcome
export const calculatePayout = rules.calculatePayout
export const createGameState = rules.createGameState
export const dealInitialHands = rules.dealInitialHands

// ────────────────────────────────────────────────────────────────────────────
// Rendering Safety: Sanitized Player Display Data
// ────────────────────────────────────────────────────────────────────────────

/**
 * Get sanitized player name for safe rendering
 *
 * Ensures any player-provided name is escaped for HTML rendering
 */
export function getSanitizedPlayerName(playerName: string): string {
  return sanitizePlayerName(playerName)
}

/**
 * Prepare game state for rendering with sanitized values
 *
 * Ensures all player-provided data is sanitized before display
 */
export function getSanitizedGameState(gameState: GameState): GameState {
  const player = gameState.players[0]
  if (!player) {
    return gameState
  }

  return {
    ...gameState,
    players: [
      {
        ...player,
        id: getSanitizedPlayerName(player.id),
      },
      ...gameState.players.slice(1),
    ],
  }
}

// ────────────────────────────────────────────────────────────────────────────
// Usage in Components (Example)
// ────────────────────────────────────────────────────────────────────────────

/**
 * EXAMPLE: How to use validated rules in a React component
 *
 * // ❌ UNSAFE (before validation layer):
 * function GameBoard() {
 *   const handlePlayerAction = (action: unknown) => {
 *     const newState = rules.processPlayerAction(gameState, action) // UNSAFE!
 *     setGameState(newState)
 *   }
 * }
 *
 * // ✅ SAFE (with validation layer):
 * function GameBoard() {
 *   const handlePlayerAction = (action: unknown) => {
 *     const result = validateAndProcessAction(gameState, action)
 *     if (result.ok) {
 *       setGameState(result.value)
 *     } else {
 *       console.error(`Invalid action: ${result.error}`)
 *     }
 *   }
 * }
 */
