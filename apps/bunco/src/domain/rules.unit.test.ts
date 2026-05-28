import { describe, expect, it } from 'vitest'

import {
  getGameWinner,
  getRoundWinner,
  isRoundOver,
  scoreRoll,
  shouldContinueRolling,
} from './rules'
import type { DieValue } from './types'

// ─── scoreRoll ────────────────────────────────────────────────────────────────

describe('scoreRoll', () => {
  it('scores 21 points for a Bunco (three matching target)', () => {
    const result = scoreRoll([3, 3, 3] as [DieValue, DieValue, DieValue], 3)
    expect(result.points).toBe(21)
    expect(result.isBunco).toBe(true)
    expect(result.isMiniBunco).toBe(false)
  })

  it('scores 5 points for a mini Bunco (three of a kind, non-target)', () => {
    const result = scoreRoll([4, 4, 4] as [DieValue, DieValue, DieValue], 2)
    expect(result.points).toBe(5)
    expect(result.isBunco).toBe(false)
    expect(result.isMiniBunco).toBe(true)
  })

  it('scores 1 point per die matching target (2 matches = 2 points)', () => {
    const result = scoreRoll([2, 2, 5] as [DieValue, DieValue, DieValue], 2)
    expect(result.points).toBe(2)
    expect(result.matchCount).toBe(2)
    expect(result.isBunco).toBe(false)
    expect(result.isMiniBunco).toBe(false)
  })

  it('scores 0 points when no dice match target', () => {
    const result = scoreRoll([1, 2, 3] as [DieValue, DieValue, DieValue], 6)
    expect(result.points).toBe(0)
    expect(result.matchCount).toBe(0)
  })

  it('scores 1 point for a single die matching target', () => {
    const result = scoreRoll([1, 3, 5] as [DieValue, DieValue, DieValue], 3)
    expect(result.points).toBe(1)
    expect(result.matchCount).toBe(1)
  })
})

// ─── shouldContinueRolling ────────────────────────────────────────────────────

describe('shouldContinueRolling', () => {
  it('returns true when the roll scores points', () => {
    const result = scoreRoll([1, 1, 2] as [DieValue, DieValue, DieValue], 1)
    expect(shouldContinueRolling(result)).toBe(true)
  })

  it('returns false when no points are scored', () => {
    const result = scoreRoll([2, 3, 4] as [DieValue, DieValue, DieValue], 6)
    expect(shouldContinueRolling(result)).toBe(false)
  })
})

// ─── isRoundOver ─────────────────────────────────────────────────────────────

describe('isRoundOver', () => {
  it('returns true when human reaches 21', () => {
    expect(isRoundOver(21, 10)).toBe(true)
  })

  it('returns true when CPU reaches 21', () => {
    expect(isRoundOver(15, 21)).toBe(true)
  })

  it('returns false when both are below 21', () => {
    expect(isRoundOver(5, 10)).toBe(false)
  })

  it('returns true when both reach 21 simultaneously', () => {
    expect(isRoundOver(21, 21)).toBe(true)
  })
})

// ─── getRoundWinner ───────────────────────────────────────────────────────────

describe('getRoundWinner', () => {
  it('returns human when human reaches 21', () => {
    expect(getRoundWinner(21, 10)).toBe('human')
  })

  it('returns cpu when CPU reaches 21', () => {
    expect(getRoundWinner(10, 21)).toBe('cpu')
  })

  it('returns null when neither has reached 21', () => {
    expect(getRoundWinner(10, 15)).toBeNull()
  })
})

// ─── getGameWinner ────────────────────────────────────────────────────────────

describe('getGameWinner', () => {
  it('returns human when human has more round wins', () => {
    expect(getGameWinner(4, 2, 100, 80)).toBe('human')
  })

  it('returns cpu when CPU has more round wins', () => {
    expect(getGameWinner(2, 4, 80, 100)).toBe('cpu')
  })

  it('uses total score as tiebreaker when round wins are equal', () => {
    expect(getGameWinner(3, 3, 120, 100)).toBe('human')
    expect(getGameWinner(3, 3, 100, 120)).toBe('cpu')
  })

  it('returns human when all scores are tied (favor human)', () => {
    expect(getGameWinner(3, 3, 100, 100)).toBe('human')
  })
})
