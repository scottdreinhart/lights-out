import { describe, expect, it } from 'vitest'

import { applyMove, createInitialBoard, isValidMove } from '@/domain/board'
import { checkGameOver, getWinner } from '@/domain/rules'

// ─── Nim/Cee-Lo Domain Tests ─────────────────────────────────────────────────
// Note: This domain is scaffold-shared (Nim-style). Tests exercise actual behavior.

describe('createInitialBoard', () => {
  it('creates piles with given counts', () => {
    const state = createInitialBoard([3, 5, 7])
    expect(state.piles).toHaveLength(3)
    expect(state.piles[0].count).toBe(3)
    expect(state.piles[1].count).toBe(5)
    expect(state.piles[2].count).toBe(7)
  })

  it('starts with human as default player', () => {
    const state = createInitialBoard([1, 2, 3])
    expect(state.currentPlayer).toBe('human')
  })

  it('accepts a custom starting player', () => {
    const state = createInitialBoard([1, 2, 3], 'cpu')
    expect(state.currentPlayer).toBe('cpu')
  })

  it('starts with no winner and game not over', () => {
    const state = createInitialBoard([1, 2, 3])
    expect(state.winner).toBeNull()
    expect(state.isGameOver).toBe(false)
  })
})

describe('isValidMove', () => {
  it('allows removing stones from a pile with enough count', () => {
    const state = createInitialBoard([5, 3])
    expect(isValidMove(state, { pileId: 0, removeCount: 3 })).toBe(true)
  })

  it('rejects removing 0 stones', () => {
    const state = createInitialBoard([5, 3])
    expect(isValidMove(state, { pileId: 0, removeCount: 0 })).toBe(false)
  })

  it('rejects removing more stones than available', () => {
    const state = createInitialBoard([3])
    expect(isValidMove(state, { pileId: 0, removeCount: 5 })).toBe(false)
  })

  it('rejects moves on non-existent pile', () => {
    const state = createInitialBoard([3, 5])
    expect(isValidMove(state, { pileId: 99, removeCount: 1 })).toBe(false)
  })
})

describe('applyMove', () => {
  it('reduces the pile count by removeCount', () => {
    const state = createInitialBoard([5])
    const next = applyMove(state, { pileId: 0, removeCount: 2 })
    expect(next.piles[0].count).toBe(3)
  })

  it('returns unchanged state for invalid move', () => {
    const state = createInitialBoard([5])
    const next = applyMove(state, { pileId: 0, removeCount: 10 })
    expect(next.piles[0].count).toBe(5)
  })
})

describe('checkGameOver', () => {
  it('returns true when all piles are empty', () => {
    const state = createInitialBoard([0, 0, 0])
    expect(checkGameOver(state)).toBe(true)
  })

  it('returns false when any pile has stones', () => {
    const state = createInitialBoard([0, 1, 0])
    expect(checkGameOver(state)).toBe(false)
  })
})

describe('getWinner', () => {
  it('returns null when game is not over', () => {
    const state = createInitialBoard([5, 3])
    expect(getWinner(state)).toBeNull()
  })

  it('returns a player when game is over', () => {
    const state = createInitialBoard([0, 0])
    const winner = getWinner(state)
    expect(['human', 'cpu']).toContain(winner)
  })
})
