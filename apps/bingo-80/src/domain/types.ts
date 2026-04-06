/**
 * Swedish Bingo (Bingo-80) - Game types
 * 80 balls, 4x4 grid layout
 */

export interface Card {
  id: string
  squares: (number | null)[]
  marked: boolean[]
}

export interface GameState {
  cards: Card[]
  drawnNumbers: Set<number>
  winners: string[]
  gameActive: boolean
  currentDrawn: number | null
}

export interface DrawResult {
  number: number
  drawnCount: number
  totalNumbers: number
}
