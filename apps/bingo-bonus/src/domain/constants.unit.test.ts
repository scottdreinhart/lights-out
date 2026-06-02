/**
 * bingo-bonus — domain constants unit tests.
 * Tests bonus multipliers and bingo pattern definitions.
 */

import { describe, expect, it } from 'vitest'
import { BINGO_PATTERNS, BONUS_MULTIPLIER } from './index'

describe('bingo-bonus domain constants', () => {
  describe('BINGO_PATTERNS', () => {
    it('defines at least one bingo pattern', () => {
      expect(Object.keys(BINGO_PATTERNS).length).toBeGreaterThan(0)
    })

    it('all patterns have a name property', () => {
      for (const pattern of Object.values(BINGO_PATTERNS)) {
        expect(pattern).toHaveProperty('name')
      }
    })
  })

  describe('BONUS_MULTIPLIER', () => {
    it('is a positive number', () => {
      expect(BONUS_MULTIPLIER).toBeGreaterThan(0)
    })

    it('is greater than 1 (actual bonus)', () => {
      expect(BONUS_MULTIPLIER).toBeGreaterThan(1)
    })
  })
})
