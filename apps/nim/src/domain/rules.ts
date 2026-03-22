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

const getOtherPlayer = (player: Player): Player => {
  return player === 'human' ? 'cpu' : 'human'
}

/**
 * Determines winner once the game is over based on the player who just moved.
 * - Normal play: player who takes the last object wins.
 * - Misère play: player who takes the last object loses.
 */
export const getWinner = (state: GameState, mover: Player): Player | null => {
  if (!checkGameOver(state)) {
    return null
  }

  return state.mode === 'normal' ? mover : getOtherPlayer(mover)
}
