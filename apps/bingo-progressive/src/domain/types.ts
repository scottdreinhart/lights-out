/**
 * Progressive Bingo - Game types
 * Standard 5x5 grid with progressive jackpot levels
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
  level: number
  jackpot: number
}

export interface DrawResult {
  number: number
  drawnCount: number
  totalNumbers: number
}
