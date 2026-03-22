/**
 * Board operations — pure functions for creating and manipulating game state.
 * No React, no DOM — purely functional transformations.
 */

import { selectCPUMove } from './ai'
import { determineGameWinner, determineRoundWinner, isGameOver } from './rules'
import type { GameState, Move, Round } from './types'

/**
 * Create a new game with initial state.
 */
export function createGame(bestOf: number = 3): GameState {
  return {
    rounds: [],
    playerScore: 0,
    cpuScore: 0,
    bestOf,
    isGameOver: false,
    gameWinner: null,
  }
}

/**
 * Play a single round and return the updated game state.
 * Optionally accepts a predefined cpuMove instead of determining one with AI.
 */
export function playRound(gameState: GameState, playerMove: Move, cpuMove?: Move): GameState {
  // Don't allow moves if game is already over
  if (gameState.isGameOver) {
    return gameState
  }

  // Get CPU move: use provided move or determine with AI
  const finalCpuMove = cpuMove ?? selectCPUMove(gameState.rounds)

  // Determine round outcome
  const result = determineRoundWinner(playerMove, finalCpuMove)

  // Create new round
  const newRound: Round = {
    playerMove,
    cpuMove: finalCpuMove,
    result,
  }

  // Update scores
  const playerScore = gameState.playerScore + (result === 'win' ? 1 : 0)
  const cpuScore = gameState.cpuScore + (result === 'loss' ? 1 : 0)

  // Check if game is over
  const gameOver = isGameOver(playerScore, cpuScore, gameState.bestOf)
  const gameWinner = determineGameWinner(playerScore, cpuScore, gameState.bestOf)

  return {
    rounds: [...gameState.rounds, newRound],
    playerScore,
    cpuScore,
    bestOf: gameState.bestOf,
    isGameOver: gameOver,
    gameWinner,
  }
}

/**
 * Reset the game to initial state.
 */
export function resetGame(bestOf: number = 3): GameState {
  return createGame(bestOf)
}
