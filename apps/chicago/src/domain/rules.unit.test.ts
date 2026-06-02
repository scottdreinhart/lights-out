import { describe, expect, it } from 'vitest'

import { applyMove, createInitialBoard, isValidMove } from '@/domain/board'
import { checkGameOver, getWinner } from '@/domain/rules'

describe('createInitialBoard', () => {
  it('creates piles with given counts', () => {
    const state = createInitialBoard([3, 5])
    expect(state.piles).toHaveLength(2)
    expect(state.piles[0].count).toBe(3)
  })

  it('starts with human as default player', () => {
    const state = createInitialBoard([1])
    expect(state.currentPlayer).toBe('human')
  })
})

describe('isValidMove', () => {
  it('allows removing stones from a pile with enough count', () => {
    const state = createInitialBoard([4])
    expect(isValidMove(state, { pileId: 0, removeCount: 2 })).toBe(true)
  })

  it('rejects removing more stones than available', () => {
    const state = createInitialBoard([2])
    expect(isValidMove(state, { pileId: 0, removeCount: 5 })).toBe(false)
  })

  it('rejects 0 removal', () => {
    const state = createInitialBoard([2])
    expect(isValidMove(state, { pileId: 0, removeCount: 0 })).toBe(false)
  })
})

describe('applyMove', () => {
  it('reduces pile count correctly', () => {
    const state = createInitialBoard([8, 5])
    const next = applyMove(state, { pileId: 1, removeCount: 3 })
    expect(next.piles[1].count).toBe(2)
    expect(next.piles[0].count).toBe(8) // untouched
  })
})

describe('checkGameOver', () => {
  it('returns true when all piles are empty', () => {
    const state = createInitialBoard([0, 0])
    expect(checkGameOver(state)).toBe(true)
  })

  it('returns false when any pile has stones', () => {
    const state = createInitialBoard([0, 3])
    expect(checkGameOver(state)).toBe(false)
  })
})

describe('getWinner', () => {
  it('returns null when game is not over', () => {
    const state = createInitialBoard([3])
    expect(getWinner(state)).toBeNull()
  })

  it('returns a valid player when game is over', () => {
    const state = createInitialBoard([0, 0])
    expect(['human', 'cpu']).toContain(getWinner(state))
  })
})
