import { describe, expect, it } from 'vitest'

import { BOARD_SIZE, CPU_DELAY_MS, TOKENS, WIN_LINES } from './constants'

describe('TOKENS', () => {
  it('defines HUMAN as X', () => {
    expect(TOKENS.HUMAN).toBe('X')
  })

  it('defines CPU as O', () => {
    expect(TOKENS.CPU).toBe('O')
  })
})

describe('BOARD_SIZE', () => {
  it('is 3', () => {
    expect(BOARD_SIZE).toBe(3)
  })
})

describe('CPU_DELAY_MS', () => {
  it('is a positive number', () => {
    expect(CPU_DELAY_MS).toBeGreaterThan(0)
  })
})

describe('WIN_LINES', () => {
  it('has 8 winning combinations', () => {
    expect(WIN_LINES).toHaveLength(8)
  })

  it('each line has exactly 3 cell indices', () => {
    for (const line of WIN_LINES) {
      expect(line).toHaveLength(3)
    }
  })

  it('all indices are in range 0-8', () => {
    for (const line of WIN_LINES) {
      for (const idx of line) {
        expect(idx).toBeGreaterThanOrEqual(0)
        expect(idx).toBeLessThan(9)
      }
    }
  })

  it('includes all 3 rows', () => {
    expect(WIN_LINES).toContainEqual([0, 1, 2])
    expect(WIN_LINES).toContainEqual([3, 4, 5])
    expect(WIN_LINES).toContainEqual([6, 7, 8])
  })

  it('includes all 3 columns', () => {
    expect(WIN_LINES).toContainEqual([0, 3, 6])
    expect(WIN_LINES).toContainEqual([1, 4, 7])
    expect(WIN_LINES).toContainEqual([2, 5, 8])
  })

  it('includes both diagonals', () => {
    expect(WIN_LINES).toContainEqual([0, 4, 8])
    expect(WIN_LINES).toContainEqual([2, 4, 6])
  })
})
