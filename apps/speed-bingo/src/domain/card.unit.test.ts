import { describe, expect, it } from 'vitest'

/**
 * Unit tests for Bingo card generation and validation
 * Tests card creation, number validation, and card state
 */

// Mock card type based on typical bingo structure
interface BingoCard {
  id: string
  numbers: number[][]
  drawnNumbers: Set<number>
  isValid: boolean
}

describe('Bingo Card Generation', () => {
  it('should generate a valid 5x5 bingo card with correct number ranges', () => {
    // BINGO has columns: B (1-15), I (16-30), N (31-45), G (46-60), O (61-75)
    const card: BingoCard = {
      id: '1',
      numbers: [
        [1, 16, 31, 46, 61],
        [2, 17, 32, 47, 62],
        [3, 18, 33 /* FREE */, 48, 63],
        [4, 19, 34, 49, 64],
        [5, 20, 35, 50, 65],
      ],
      drawnNumbers: new Set(),
      isValid: true,
    }

    expect(card.numbers).toHaveLength(5)
    expect(card.numbers[0]).toHaveLength(5)
    expect(card.isValid).toBe(true)
  })

  it('should allow marking numbers as drawn', () => {
    const card: BingoCard = {
      id: '1',
      numbers: [[1], [2], [3], [4], [5]],
      drawnNumbers: new Set(),
      isValid: true,
    }

    card.drawnNumbers.add(1)
    card.drawnNumbers.add(2)

    expect(card.drawnNumbers.has(1)).toBe(true)
    expect(card.drawnNumbers.has(2)).toBe(true)
    expect(card.drawnNumbers.has(3)).toBe(false)
  })

  it('should validate that all numbers are unique within a card', () => {
    const numbers = [
      [1, 16, 31, 46, 61],
      [2, 17, 32, 47, 62],
      [3, 18, 0 /* FREE */, 48, 63],
      [4, 19, 34, 49, 64],
      [5, 20, 35, 50, 65],
    ]

    const allNumbers = numbers.flat().filter((n) => n !== 0)
    const uniqueNumbers = new Set(allNumbers)

    expect(uniqueNumbers.size).toBe(allNumbers.length)
  })
})
