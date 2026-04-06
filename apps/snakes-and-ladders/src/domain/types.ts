/**
 * Domain types for Snakes and Ladders game.
 */

export type GamePhase = 'playing' | 'game-over'

export interface PlayerState {
  position: number
  name: string
}

export interface GameState {
  phase: GamePhase
  players: PlayerState[]
  currentPlayerIndex: number
  diceValue: number | null
  gameOver: boolean
  winner: string | null
}
