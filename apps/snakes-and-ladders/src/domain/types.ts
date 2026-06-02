/**
 * Domain types for Snakes and Ladders game.
 * Pure data contracts only (no framework/runtime dependencies).
 */

export type PlayerId = 'human' | 'cpu'
export type GamePhase = 'playing' | 'game-over'

export interface PlayerState {
  id: PlayerId
  name: string
  position: number
}

export interface BoardEffect {
  type: 'ladder' | 'snake'
  from: number
  to: number
}

export interface TurnResult {
  playerId: PlayerId
  roll: number
  startPosition: number
  endPosition: number
  overshotFinish: boolean
  effect: BoardEffect | null
}

export interface GameState {
  phase: GamePhase
  players: readonly PlayerState[]
  currentPlayerIndex: number
  winnerId: PlayerId | null
  winnerName: string | null
  turnCount: number
  lastTurn: TurnResult | null
}
