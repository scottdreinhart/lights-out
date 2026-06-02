import { describe, expect, it } from 'vitest'
import {
  DIFFICULTY_PATTERN_REQUIREMENTS,
  PATTERN_MULTIPLIER_PROGRESSION,
  PATTERN_MULTIPLIERS,
  PATTERN_POINTS,
} from './constants'

describe('Pattern Bingo Constants', () => {
  describe('PATTERN_POINTS', () => {
    it('defines points for line pattern', () => {
      expect(PATTERN_POINTS.LINE).toBe(100)
    })

    it('defines points for corners pattern', () => {
      expect(PATTERN_POINTS.CORNERS).toBe(150)
    })

    it('defines points for frame pattern', () => {
      expect(PATTERN_POINTS.FRAME).toBe(200)
    })

    it('defines points for plus pattern', () => {
      expect(PATTERN_POINTS.PLUS).toBe(175)
    })

    it('defines points for full house pattern', () => {
      expect(PATTERN_POINTS.FULL_HOUSE).toBe(500)
    })

    it('all point values are positive integers', () => {
      Object.values(PATTERN_POINTS).forEach((points) => {
        expect(typeof points).toBe('number')
        expect(points).toBeGreaterThan(0)
        expect(Number.isInteger(points)).toBe(true)
      })
    })
  })
  describe('PATTERN_MULTIPLIER_PROGRESSION', () => {
    it('defines multipliers for progression levels', () => {
      expect(PATTERN_MULTIPLIER_PROGRESSION).toBeDefined()
    })

    it('multipliers increase with progression', () => {
      expect(PATTERN_MULTIPLIER_PROGRESSION.base).toBeLessThanOrEqual(
        PATTERN_MULTIPLIER_PROGRESSION.second,
      )
      expect(PATTERN_MULTIPLIER_PROGRESSION.second).toBeLessThanOrEqual(
        PATTERN_MULTIPLIER_PROGRESSION.third,
      )
      expect(PATTERN_MULTIPLIER_PROGRESSION.third).toBeLessThanOrEqual(
        PATTERN_MULTIPLIER_PROGRESSION.fourth_plus,
      )
    })

    it('all multipliers are valid numbers', () => {
      Object.values(PATTERN_MULTIPLIER_PROGRESSION).forEach((multiplier) => {
        expect(typeof multiplier).toBe('number')
        expect(multiplier).toBeGreaterThan(0)
      })
    })
  })

  describe('PATTERN_MULTIPLIERS', () => {
    it('is an array of multiplier values', () => {
      expect(Array.isArray(PATTERN_MULTIPLIERS)).toBe(true)
      expect(PATTERN_MULTIPLIERS.length).toBeGreaterThan(0)
    })

    it('contains only positive numbers', () => {
      PATTERN_MULTIPLIERS.forEach((multiplier) => {
        expect(typeof multiplier).toBe('number')
        expect(multiplier).toBeGreaterThan(0)
      })
    })
  })

  describe('DIFFICULTY_PATTERN_REQUIREMENTS', () => {
    it('defines requirements for easy difficulty', () => {
      expect(DIFFICULTY_PATTERN_REQUIREMENTS.easy).toBeDefined()
      expect(DIFFICULTY_PATTERN_REQUIREMENTS.easy.patternsToWin).toBeGreaterThan(0)
    })

    it('defines requirements for medium difficulty', () => {
      expect(DIFFICULTY_PATTERN_REQUIREMENTS.medium).toBeDefined()
      expect(DIFFICULTY_PATTERN_REQUIREMENTS.medium.patternsToWin).toBeGreaterThan(0)
    })

    it('defines requirements for hard difficulty', () => {
      expect(DIFFICULTY_PATTERN_REQUIREMENTS.hard).toBeDefined()
      expect(DIFFICULTY_PATTERN_REQUIREMENTS.hard.patternsToWin).toBeGreaterThan(0)
    })

    it('pattern requirements increase with difficulty', () => {
      expect(DIFFICULTY_PATTERN_REQUIREMENTS.easy.patternsToWin).toBeLessThan(
        DIFFICULTY_PATTERN_REQUIREMENTS.medium.patternsToWin,
      )
      expect(DIFFICULTY_PATTERN_REQUIREMENTS.medium.patternsToWin).toBeLessThan(
        DIFFICULTY_PATTERN_REQUIREMENTS.hard.patternsToWin,
      )
    })

    it('call intervals decrease with difficulty', () => {
      expect(DIFFICULTY_PATTERN_REQUIREMENTS.easy.callInterval).toBeGreaterThan(
        DIFFICULTY_PATTERN_REQUIREMENTS.medium.callInterval,
      )
      expect(DIFFICULTY_PATTERN_REQUIREMENTS.medium.callInterval).toBeGreaterThan(
        DIFFICULTY_PATTERN_REQUIREMENTS.hard.callInterval,
      )
    })
  })
})
