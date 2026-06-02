import { describe, expect, it } from 'vitest'
import { checkWinningPatterns, createBingoCards, isWinner, markNumber } from './card'
import { GRID_SIZE, MAX_NUMBER } from './constants'

describe('Bingo-30 Card Generation & Validation', () => {
  describe('createBingoCards', () => {
    it('should create multiple cards with unique IDs', () => {
      const cards = createBingoCards(5)
      expect(cards).toHaveLength(5)
      const ids = cards.map((c) => c.id)
      const uniqueIds = new Set(ids)
      expect(uniqueIds.size).toBe(5)
    })

    it('should generate cards with correct grid size', () => {
      const cards = createBingoCards(3)
      cards.forEach((card) => {
        expect(card.numbers).toHaveLength(GRID_SIZE)
        card.numbers.forEach((row) => {
          expect(row).toHaveLength(GRID_SIZE)
        })
      })
    })

    it('should generate cards with numbers in range [1, MAX_NUMBER]', () => {
      const cards = createBingoCards(5)
      cards.forEach((card) => {
        card.numbers.forEach((row) => {
          row.forEach((num) => {
            expect(num).toBeGreaterThanOrEqual(1)
            expect(num).toBeLessThanOrEqual(MAX_NUMBER)
          })
        })
      })
    })

    it('should have no duplicate numbers on the same card', () => {
      const cards = createBingoCards(5)
      cards.forEach((card) => {
        const allNumbers = card.numbers.flat()
        const uniqueNumbers = new Set(allNumbers)
        expect(uniqueNumbers.size).toBe(allNumbers.length)
      })
    })

    it('should generate single card when count is 1', () => {
      const cards = createBingoCards(1)
      expect(cards).toHaveLength(1)
      expect(cards[0].id).toBe(0)
    })

    it('should handle zero cards', () => {
      const cards = createBingoCards(0)
      expect(cards).toHaveLength(0)
    })
  })

  describe('markNumber', () => {
    it('should return true when number exists on card', () => {
      const cards = createBingoCards(1)
      const card = cards[0]
      const numberOnCard = card.numbers[0][0]
      expect(markNumber(card, numberOnCard)).toBe(true)
    })

    it('should return false when number does not exist on card', () => {
      const cards = createBingoCards(1)
      const card = cards[0]
      // Find a number not on the card
      const cardNumbers = new Set(card.numbers.flat())
      for (let i = 1; i <= MAX_NUMBER; i++) {
        if (!cardNumbers.has(i)) {
          expect(markNumber(card, i)).toBe(false)
          return
        }
      }
    })
  })

  describe('checkWinningPatterns', () => {
    it('should detect a winning row', () => {
      const cards = createBingoCards(1)
      const card = cards[0]
      const drawnNumbers = new Set(card.numbers[0]) // First row
      expect(checkWinningPatterns(card, drawnNumbers)).toBe(true)
    })

    it('should detect a winning column', () => {
      const cards = createBingoCards(1)
      const card = cards[0]
      const drawnNumbers = new Set(card.numbers.map((row) => row[0])) // First column
      expect(checkWinningPatterns(card, drawnNumbers)).toBe(true)
    })

    it('should detect a winning diagonal (top-left to bottom-right)', () => {
      const cards = createBingoCards(1)
      const card = cards[0]
      const drawnNumbers = new Set(card.numbers.map((row, i) => row[i]))
      expect(checkWinningPatterns(card, drawnNumbers)).toBe(true)
    })

    it('should detect a winning diagonal (top-right to bottom-left)', () => {
      const cards = createBingoCards(1)
      const card = cards[0]
      const drawnNumbers = new Set(card.numbers.map((row, i) => row[GRID_SIZE - 1 - i]))
      expect(checkWinningPatterns(card, drawnNumbers)).toBe(true)
    })

    it('should not detect a winning pattern with incomplete row', () => {
      const cards = createBingoCards(1)
      const card = cards[0]
      const drawnNumbers = new Set([card.numbers[0][0], card.numbers[0][1]]) // Partial row
      expect(checkWinningPatterns(card, drawnNumbers)).toBe(false)
    })

    it('should not detect a winning pattern with empty drawn set', () => {
      const cards = createBingoCards(1)
      const card = cards[0]
      const drawnNumbers = new Set<number>()
      expect(checkWinningPatterns(card, drawnNumbers)).toBe(false)
    })
  })

  describe('isWinner', () => {
    it('should return true when card has winning pattern', () => {
      const cards = createBingoCards(1)
      const card = cards[0]
      const drawnNumbers = new Set(card.numbers[0]) // First row
      expect(isWinner(card, drawnNumbers)).toBe(true)
    })

    it('should return false when card does not have winning pattern', () => {
      const cards = createBingoCards(1)
      const card = cards[0]
      const drawnNumbers = new Set<number>()
      expect(isWinner(card, drawnNumbers)).toBe(false)
    })
  })
})
