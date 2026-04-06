import { describe, expect, it } from 'vitest'

/**
 * Unit tests for Zip dice game rules
 * Tests dice rolling logic and scoring
 */

interface DiceRoll {
  dice: number[]
  sum: number
  isValid: boolean
}

describe('Zip Dice Game', () => {
  it('should correctly sum multiple dice values', () => {
    const roll: DiceRoll = {
      dice: [4, 3, 5, 2],
      sum: 14,
      isValid: true,
    }

    const calculatedSum = roll.dice.reduce((acc, val) => acc + val, 0)
    expect(calculatedSum).toBe(roll.sum)
  })

  it('should validate that all dice values are between 1-6', () => {
    const dice = [1, 3, 5, 6, 2]

    const isValid = dice.every((d) => d >= 1 && d <= 6)
    expect(isValid).toBe(true)
  })
})
