/**
 * bingo-90 — domain unit tests.
 * Tests 90-ball bingo card generation and variant configuration.
 */

import { describe, expect, it } from 'vitest'
import { BINGO_VARIANTS, generateBingoCard } from './index'

describe('bingo-90 domain', () => {
  describe('BINGO_VARIANTS', () => {
    it('includes the 90-ball variant', () => {
      expect(BINGO_VARIANTS).toHaveProperty('90-ball')
    })

    it('90-ball variant has correct number count', () => {
      const variant = BINGO_VARIANTS['90-ball']
      expect(variant).toBeDefined()
      expect(variant.numberRange.min).toBe(1)
      expect(variant.numberRange.max).toBe(90)
    })
  })

  describe('generateBingoCard', () => {
    it('generates a card for the 90-ball variant', () => {
      const variant = BINGO_VARIANTS['90-ball']
      const card = generateBingoCard({ variant })
      expect(card).toBeDefined()
    })

    it('generated card has numbers within 1-90 range', () => {
      const variant = BINGO_VARIANTS['90-ball']
      const card = generateBingoCard({ variant })
      const numbers = card.flat().filter((n) => n !== null && n !== 0) as number[]
      for (const n of numbers) {
        expect(n).toBeGreaterThanOrEqual(1)
        expect(n).toBeLessThanOrEqual(90)
      }
    })

    it('each called number appears at most once on the card', () => {
      const variant = BINGO_VARIANTS['90-ball']
      const card = generateBingoCard({ variant })
      const numbers = card.flat().filter((n) => n !== null && n !== 0) as number[]
      const unique = new Set(numbers)
      expect(unique.size).toBe(numbers.length)
    })
  })
})
