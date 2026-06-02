import { describe, expect, it } from 'vitest'
import { checkWinningPatterns, createBingoCard, createBingoCards, markNumber } from './card'

describe('speed-bingo card logic', () => {
  it('creates a 5x5 card with center free space', () => {
    const card = createBingoCard()
    expect(card.grid).toHaveLength(5)
    expect(card.grid[0]).toHaveLength(5)
    expect(card.grid[2][2].isFreeSpace).toBe(true)
    expect(card.grid[2][2].marked).toBe(true)
  })

  it('generates cards with numbers in standard BINGO ranges', () => {
    const card = createBingoCard()
    for (let row = 0; row < 5; row++) {
      expect(card.grid[row][0].number).toBeGreaterThanOrEqual(1)
      expect(card.grid[row][0].number).toBeLessThanOrEqual(15)
      expect(card.grid[row][1].number).toBeGreaterThanOrEqual(16)
      expect(card.grid[row][1].number).toBeLessThanOrEqual(30)
      expect(card.grid[row][3].number).toBeGreaterThanOrEqual(46)
      expect(card.grid[row][3].number).toBeLessThanOrEqual(60)
      expect(card.grid[row][4].number).toBeGreaterThanOrEqual(61)
      expect(card.grid[row][4].number).toBeLessThanOrEqual(75)
    }
  })

  it('marks matching numbers and detects line winners', () => {
    const card = createBingoCard()
    const targetRowNumbers = card.grid[0]
      .map((cell) => cell.number)
      .filter((n): n is number => n !== null)
    targetRowNumbers.forEach((number) => markNumber(card, number))
    expect(checkWinningPatterns(card)).toContain('horizontal-top')
  })

  it('creates multiple cards with unique ids', () => {
    const cards = createBingoCards(3)
    expect(cards).toHaveLength(3)
    const ids = new Set(cards.map((card) => card.id))
    expect(ids.size).toBe(3)
  })
})
