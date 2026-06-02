import { describe, expect, it } from 'vitest'

import {
  calculateScore,
  getScoreableDiceIndices,
  hasScoreableDice,
  isValidSelection,
} from '@/domain/rules'

// ─── calculateScore ───────────────────────────────────────────────────────────

describe('calculateScore', () => {
  it('returns 0 for an empty dice set', () => {
    expect(calculateScore([])).toBe(0)
  })

  it('scores a single 1 as 100', () => {
    expect(calculateScore([1])).toBe(100)
  })

  it('scores a single 5 as 50', () => {
    expect(calculateScore([5])).toBe(50)
  })

  it('scores two 1s as 200', () => {
    expect(calculateScore([1, 1])).toBe(200)
  })

  it('scores three 1s as 1000', () => {
    expect(calculateScore([1, 1, 1])).toBe(1000)
  })

  it('scores four 1s as 1100 (1000 + extra 100)', () => {
    expect(calculateScore([1, 1, 1, 1])).toBe(1100)
  })

  it('scores three 2s as 200', () => {
    expect(calculateScore([2, 2, 2])).toBe(200)
  })

  it('scores three 3s as 300', () => {
    expect(calculateScore([3, 3, 3])).toBe(300)
  })

  it('scores three 4s as 400', () => {
    expect(calculateScore([4, 4, 4])).toBe(400)
  })

  it('scores three 5s as 500', () => {
    expect(calculateScore([5, 5, 5])).toBe(500)
  })

  it('scores four 5s as 550 (500 + extra 50)', () => {
    expect(calculateScore([5, 5, 5, 5])).toBe(550)
  })

  it('scores three 6s as 600', () => {
    expect(calculateScore([6, 6, 6])).toBe(600)
  })

  it('scores a straight (1,2,3,4,5,6) as 1500', () => {
    expect(calculateScore([1, 2, 3, 4, 5, 6])).toBe(1500)
  })

  it('scores a full house (e.g. 3+2) as 1500', () => {
    expect(calculateScore([3, 3, 3, 4, 4])).toBe(1500)
  })

  it('scores mixed dice: one 1 + one 5 as 150', () => {
    expect(calculateScore([1, 5])).toBe(150)
  })

  it('returns 0 for non-scoring dice (e.g. single 2)', () => {
    expect(calculateScore([2])).toBe(0)
  })

  it('returns 0 for non-scoring combination (e.g. two 3s)', () => {
    expect(calculateScore([3, 3])).toBe(0)
  })
})

// ─── hasScoreableDice ─────────────────────────────────────────────────────────

describe('hasScoreableDice', () => {
  it('returns false for empty array', () => {
    expect(hasScoreableDice([])).toBe(false)
  })

  it('returns true when a 1 is present', () => {
    expect(hasScoreableDice([1, 2, 3])).toBe(true)
  })

  it('returns true when a 5 is present', () => {
    expect(hasScoreableDice([2, 4, 5])).toBe(true)
  })

  it('returns true for three of a kind', () => {
    expect(hasScoreableDice([3, 3, 3])).toBe(true)
  })

  it('returns false when no score is possible', () => {
    expect(hasScoreableDice([2, 3, 4, 6])).toBe(false)
  })
})

// ─── isValidSelection ─────────────────────────────────────────────────────────

describe('isValidSelection', () => {
  it('returns true for a scoreable selection', () => {
    expect(isValidSelection([1])).toBe(true)
    expect(isValidSelection([5])).toBe(true)
    expect(isValidSelection([2, 2, 2])).toBe(true)
  })

  it('returns false for a non-scoreable selection', () => {
    expect(isValidSelection([2])).toBe(false)
    expect(isValidSelection([3, 4])).toBe(false)
  })
})

// ─── getScoreableDiceIndices ─────────────────────────────────────────────────

describe('getScoreableDiceIndices', () => {
  it('returns index of a 1 in hand', () => {
    const indices = getScoreableDiceIndices([2, 1, 3])
    expect(indices).toContain(1)
  })

  it('returns index of a 5 in hand', () => {
    const indices = getScoreableDiceIndices([2, 5, 3])
    expect(indices).toContain(1)
  })

  it('returns all indices for three of a kind', () => {
    const indices = getScoreableDiceIndices([4, 4, 4])
    expect(indices).toEqual(expect.arrayContaining([0, 1, 2]))
  })

  it('returns empty array when no dice are scoreable', () => {
    const indices = getScoreableDiceIndices([2, 3, 4, 6])
    expect(indices).toHaveLength(0)
  })
})
