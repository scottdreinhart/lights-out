/**
 * Game rules — win/loss/draw detection.
 * Pure functions operating on domain types only.
 */

import { calculateScore, getValidMoves, isBoardShut } from './board'
import type { GameState, Player } from './types'

/**
 * Check if a player has shut the box (instant win)
 */
export function hasShutBox(gameState: GameState): boolean {
  return isBoardShut(gameState.board)
}

/**
 * Check if the current player has any valid moves for the given dice sum
 */
export function hasValidMoves(gameState: GameState, diceSum: number): boolean {
  const validMoves = getValidMoves(gameState.board, diceSum)
  return validMoves.length > 0
}

/**
 * Check if the game is over (current player can't move)
 */
export function isGameOver(gameState: GameState, diceSum: number): boolean {
  return !hasValidMoves(gameState, diceSum)
}

/**
 * Calculate all player scores and determine winner(s)
 */
export function calculateAllScores(gameState: GameState): Player[] {
  const currentPlayer = gameState.players[gameState.currentPlayerIndex]
  const currentScore = calculateScore(gameState.board)

  return gameState.players.map((player) =>
    player.id === currentPlayer.id ? { ...player, score: currentScore } : player,
  )
}

/**
 * Determine the winner (lowest score)
 */
export function determineWinner(players: Player[]): Player {
  return players.reduce((lowest, player) => (player.score < lowest.score ? player : lowest))
}

/**
 * Check if a move would complete the box (all tiles closed)
 */
export function wouldCompleteBox(gameState: GameState, selectedTiles: number[]): boolean {
  const remainingTiles = Object.values(gameState.board.tiles).filter((isOpen) => isOpen)
  return remainingTiles.length === selectedTiles.length
}
