/**
 * Mini Bingo (3x3) game types and data structures.
 * Fast-paced bingo with small cards for quick gameplay.
 */

export interface BingoCell {
  number: number
  marked: boolean
}

export interface BingoCard {
  id: number
  numbers: number[][]  // 3x3 grid
}

export interface GameState {
  cards: BingoCard[]
  drawnNumbers: Set<number>
  winners: number[]  // Card IDs
  gameActive: boolean
  currentDrawn: number | null
}

export interface DrawResult {
  number: number
  winners: number[]
}
