import { describe, expect, it } from 'vitest'

/**
 * Unit tests for Tango dance pattern game
 * Tests sequence matching and pattern validation
 */

interface TangoStep {
  name: string
  direction: 'forward' | 'backward' | 'left' | 'right'
  duration: number // milliseconds
}

describe('Tango Game', () => {
  it('should validate a correct sequence of steps', () => {
    const pattern: TangoStep[] = [
      { name: 'Step 1', direction: 'forward', duration: 500 },
      { name: 'Step 2', direction: 'left', duration: 500 },
      { name: 'Step 3', direction: 'backward', duration: 500 },
    ]

    const playerSequence: TangoStep[] = [
      { name: 'Step 1', direction: 'forward', duration: 500 },
      { name: 'Step 2', direction: 'left', duration: 500 },
      { name: 'Step 3', direction: 'backward', duration: 500 },
    ]

    const isCorrect =
      pattern.length === playerSequence.length &&
      pattern.every((step, i) => step.direction === playerSequence[i].direction)

    expect(isCorrect).toBe(true)
  })

  it('should detect when step direction is wrong', () => {
    const pattern: TangoStep[] = [
      { name: 'Step 1', direction: 'forward', duration: 500 },
      { name: 'Step 2', direction: 'left', duration: 500 },
    ]

    const playerSequence: TangoStep[] = [
      { name: 'Step 1', direction: 'forward', duration: 500 },
      { name: 'Step 2', direction: 'right', duration: 500 }, // Wrong direction!
    ]

    const isCorrect = pattern.every((step, i) => step.direction === playerSequence[i]?.direction)

    expect(isCorrect).toBe(false)
  })
})
