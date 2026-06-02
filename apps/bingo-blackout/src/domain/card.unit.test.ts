import { describe, expect, it } from 'vitest'
import { checkWinningPatterns, createBingoCard, createBingoCards, markNumber } from './card'

describe('bingo-blackout card logic', () => {
  it('creates a 5x5 card with center free space', () => {
    const card = createBingoCard()
    expect(card.grid).toHaveLength(5)
    expect(card.grid[0]).toHaveLength(5)
    expect(card.grid[2][2].isFreeSpace).toBe(true)
    expect(card.grid[2][2].marked).toBe(true)
  })

  it('generates numbers in 1-90 segmented ranges', () => {
    const card = createBingoCard()
    for (let row = 0; row < 5; row++) {
      expect(card.grid[row][0].number).toBeGreaterThanOrEqual(1)
      expect(card.grid[row][0].number).toBeLessThanOrEqual(18)
      expect(card.grid[row][1].number).toBeGreaterThanOrEqual(19)
      expect(card.grid[row][1].number).toBeLessThanOrEqual(36)
      expect(card.grid[row][3].number).toBeGreaterThanOrEqual(55)
      expect(card.grid[row][3].number).toBeLessThanOrEqual(72)
      expect(card.grid[row][4].number).toBeGreaterThanOrEqual(73)
      expect(card.grid[row][4].number).toBeLessThanOrEqual(90)
    }
  })

  it('detects blackout only after all playable cells are marked', () => {
    const card = createBingoCard()
    expect(checkWinningPatterns(card)).toEqual([])

    card.grid
      .flat()
      .filter((cell) => !cell.isFreeSpace && cell.number !== null)
      .forEach((cell) => markNumber(card, cell.number as number))

    expect(checkWinningPatterns(card)).toEqual(['blackout'])
  })

  it('creates multiple cards with unique ids', () => {
    const cards = createBingoCards(3)
    expect(cards).toHaveLength(3)
    const ids = new Set(cards.map((card) => card.id))
    expect(ids.size).toBe(3)
  })
})
