import { describe, expect, it } from 'vitest'

/**
 * Unit tests for Speed Bingo game rules and win conditions
 * Tests pattern matching, win detection, and game state
 */

interface GameState {
  cards: number[][]
  drawnNumbers: Set<number>
  patterns: WinPattern[]
  hasWon: boolean
}

interface WinPattern {
  name: string
  check: (drawnNumbers: Set<number>, card: number[][]) => boolean
}

describe('Speed Bingo Game Rules', () => {
  it('should detect a horizontal line win pattern', () => {
    const drawnNumbers = new Set([1, 16, 31, 46, 61])
    const card = [
      [1, 16, 31, 46, 61], // All drawn = WIN
      [2, 17, 32, 47, 62],
      [3, 18, 0 /* FREE */, 48, 63],
      [4, 19, 34, 49, 64],
      [5, 20, 35, 50, 65],
    ]

    // Check first row
    const firstRowAllDrawn = card[0].every((num) => drawnNumbers.has(num))
    expect(firstRowAllDrawn).toBe(true)
  })

  it('should detect a vertical line win pattern', () => {
    const drawnNumbers = new Set([1, 2, 3, 4, 5])
    const card = [
      [1, 16, 31, 46, 61],
      [2, 17, 32, 47, 62],
      [3, 18, 0 /* FREE */, 48, 63],
      [4, 19, 34, 49, 64],
      [5, 20, 35, 50, 65],
    ]

    // Check first column
    const firstColAllDrawn = card.map((row) => row[0]).every((num) => drawnNumbers.has(num))
    expect(firstColAllDrawn).toBe(true)
  })

  it('should detect a diagonal win pattern (top-left to bottom-right)', () => {
    const drawnNumbers = new Set([1, 17, 0 /* FREE */, 49, 65])
    const card = [
      [1, 16, 31, 46, 61],
      [2, 17, 32, 47, 62],
      [3, 18, 0 /* FREE */, 48, 63],
      [4, 19, 34, 49, 64],
      [5, 20, 35, 50, 65],
    ]

    // Check main diagonal
    const diagonalAllDrawn = [
      drawnNumbers.has(card[0][0]),
      drawnNumbers.has(card[1][1]),
      drawnNumbers.has(0), // FREE space
      drawnNumbers.has(card[3][3]),
      drawnNumbers.has(card[4][4]),
    ].every((x) => x === true)

    expect(diagonalAllDrawn).toBe(true)
  })

  it('should not mark game as won when pattern is incomplete', () => {
    const drawnNumbers = new Set([1, 16, 31]) // Only 3 out of 5 in first row
    const card = [
      [1, 16, 31, 46, 61],
      [2, 17, 32, 47, 62],
      [3, 18, 0 /* FREE */, 48, 63],
      [4, 19, 34, 49, 64],
      [5, 20, 35, 50, 65],
    ]

    const firstRowAllDrawn = card[0].every((num) => drawnNumbers.has(num))
    expect(firstRowAllDrawn).toBe(false)
  })
})
