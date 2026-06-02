import { describe, expect, it } from 'vitest'
import { ALL_NUMBERS, GRID_SIZE, MAX_NUMBER } from './constants'

describe('Bingo-30 Constants', () => {
  describe('GRID_SIZE', () => {
    it('should be defined as 3 (3x3 grid)', () => {
      expect(GRID_SIZE).toBe(3)
    })

    it('should be a positive integer', () => {
      expect(Number.isInteger(GRID_SIZE)).toBe(true)
      expect(GRID_SIZE).toBeGreaterThan(0)
    })

    it('should match expected mini bingo dimensions', () => {
      const expectedCellCount = 9 // 3x3
      expect(GRID_SIZE * GRID_SIZE).toBe(expectedCellCount)
    })
  })

  describe('MAX_NUMBER', () => {
    it('should be defined as 25', () => {
      expect(MAX_NUMBER).toBe(25)
    })

    it('should be a positive integer', () => {
      expect(Number.isInteger(MAX_NUMBER)).toBe(true)
      expect(MAX_NUMBER).toBeGreaterThan(0)
    })

    it('should be greater than grid size squared (enough numbers for a card)', () => {
      expect(MAX_NUMBER).toBeGreaterThan(GRID_SIZE * GRID_SIZE)
    })
  })

  describe('ALL_NUMBERS', () => {
    it('should be defined', () => {
      expect(ALL_NUMBERS).toBeDefined()
    })

    it('should contain MAX_NUMBER elements', () => {
      expect(ALL_NUMBERS).toHaveLength(MAX_NUMBER)
    })

    it('should contain numbers from 1 to MAX_NUMBER', () => {
      for (let i = 0; i < MAX_NUMBER; i++) {
        expect(ALL_NUMBERS[i]).toBe(i + 1)
      }
    })

    it('should be a valid array of integers', () => {
      expect(Array.isArray(ALL_NUMBERS)).toBe(true)
      ALL_NUMBERS.forEach((num) => {
        expect(Number.isInteger(num)).toBe(true)
      })
    })

    it('should have no duplicates', () => {
      const uniqueNumbers = new Set(ALL_NUMBERS)
      expect(uniqueNumbers.size).toBe(ALL_NUMBERS.length)
    })

    it('should have all numbers in ascending order', () => {
      for (let i = 1; i < ALL_NUMBERS.length; i++) {
        expect(ALL_NUMBERS[i]).toBeGreaterThan(ALL_NUMBERS[i - 1])
      }
    })
  })
})
