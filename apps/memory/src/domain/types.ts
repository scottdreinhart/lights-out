/**
 * Memory Game: Domain Types & Game State
 */

export interface Card {
  id: string
  value: number
  suit: string
  revealed: boolean
  matched: boolean
}

export interface GameState {
  cards: Card[]
  moves: number
  matches: number
  selectedCards: string[] // max 2
  isProcessing: boolean
  gameOver: boolean
  startTime: number
  mismatchPair?: string[] // Track mismatched pair for async flip
}
