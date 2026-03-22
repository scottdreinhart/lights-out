import { GameState, Player } from './types'

/**
 * Checks if the game is over.
 * For Nim (Normal Play): all piles empty.
 * For Nim (Misere Play): the last player to take an object loses.
 * This implementation is for Misere Play (standard variety).
 */
export const checkGameOver = (state: GameState): boolean => {
  return state.piles.every((p) => p.count === 0)
}

/**
 * Determines the winner once the game is over.
 * In Normal play: current player (next to move) has no objects left to take, so they lose.
 * In Misère play: last player to take an object loses, so the current player (next to move) wins.
 */
export const getWinner = (state: GameState): Player | null => {
  if (!checkGameOver(state)) {
    return null
  }
  // If it's your turn and there are no objects:
  // Normal: you lose (CPU just took the last one) -> winner is whoever is NOT current
  // Misère: you win (CPU just took the last one) -> winner is current
  return state.mode === 'normal'
    ? state.currentPlayer === 'human'
      ? 'cpu'
      : 'human'
    : state.currentPlayer
}
