/**
 * Central type definitions — pure domain types, no framework dependencies.
 */

export type Player = 'red' | 'black'
export type OpponentMode = 'cpu' | 'local'

export interface Position {
  row: number
  col: number
}

export interface Piece {
  player: Player
  isKing: boolean
}

export type Square = Piece | null
export type Board = Square[][]

export interface Move {
  from: Position
  to: Position
  path: Position[]
  captures: Position[]
  becomesKing: boolean
}

export interface MoveResult {
  board: Board
  move: Move
}

export interface AiMoveRequest {
  type: 'compute-move'
  board: Board
  player: Player
}

export interface AiMoveResult {
  type: 'result'
  move: Move | null
}

export interface AiMoveError {
  type: 'error'
  error: string
}

export type AiMoveResponse = AiMoveResult | AiMoveError

export type Winner = Player | null

export interface GameStats {
  wins: number
  losses: number
  streak: number
  bestStreak: number
}
