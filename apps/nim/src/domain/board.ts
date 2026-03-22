import { GameMode, GameState, Move, Player } from './types'

/**
 * Creates the initial game state from a list of counts.
 */
export const createInitialBoard = (
  initialCounts: number[],
  startingPlayer: Player = 'human',
  mode: GameMode = 'misere',
): GameState => ({
  piles: initialCounts.map((count, id) => ({ id, count })),
  currentPlayer: startingPlayer,
  winner: null,
  isGameOver: false,
  mode,
  lastMove: null,
})

/**
 * Validates whether a move is legal.
 */
export const isValidMove = (state: GameState, move: Move): boolean => {
  const pile = state.piles.find((p) => p.id === move.pileId)
  return !!pile && move.removeCount > 0 && move.removeCount <= pile.count
}

/**
 * Applies a move to the board and returns a new state.
 */
export const applyMove = (state: GameState, move: Move): GameState => {
  if (!isValidMove(state, move)) {
    return state
  }

  const newPiles = state.piles.map((p) =>
    p.id === move.pileId ? { ...p, count: p.count - move.removeCount } : p,
  )

  return {
    ...state,
    piles: newPiles,
  }
}
