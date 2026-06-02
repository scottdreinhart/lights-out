import { describe, expect, it } from 'vitest'

import { applyMove, createInitialBoard, isValidMove } from '@/domain/board'
import { checkGameOver, getWinner } from '@/domain/rules'

// ─── Nim Domain Tests ─────────────────────────────────────────────────────────

describe('createInitialBoard (Nim)', () => {
  it('creates piles with given counts', () => {
    const state = createInitialBoard([1, 3, 5, 7])
    expect(state.piles).toHaveLength(4)
    expect(state.piles[3].count).toBe(7)
  })

  it('starts with human player by default', () => {
    const state = createInitialBoard([3])
    expect(state.currentPlayer).toBe('human')
  })

  it('defaults to misere mode', () => {
    const state = createInitialBoard([1])
    expect(state.mode).toBe('misere')
  })
})

describe('isValidMove (Nim)', () => {
  it('allows taking any number up to pile count', () => {
    const state = createInitialBoard([7])
    expect(isValidMove(state, { pileId: 0, removeCount: 7 })).toBe(true)
  })

  it('rejects taking 0 objects', () => {
    const state = createInitialBoard([5])
    expect(isValidMove(state, { pileId: 0, removeCount: 0 })).toBe(false)
  })

  it('rejects taking more than available', () => {
    const state = createInitialBoard([3])
    expect(isValidMove(state, { pileId: 0, removeCount: 4 })).toBe(false)
  })

  it('rejects moves on non-existent pile', () => {
    const state = createInitialBoard([3, 5])
    expect(isValidMove(state, { pileId: 5, removeCount: 1 })).toBe(false)
  })
})

describe('applyMove (Nim)', () => {
  it('reduces pile count by removeCount', () => {
    const state = createInitialBoard([5, 3])
    const next = applyMove(state, { pileId: 0, removeCount: 3 })
    expect(next.piles[0].count).toBe(2)
    expect(next.piles[1].count).toBe(3) // unchanged
  })

  it('returns unchanged state for invalid move', () => {
    const state = createInitialBoard([2])
    const next = applyMove(state, { pileId: 0, removeCount: 10 })
    expect(next.piles[0].count).toBe(2)
  })
})

describe('checkGameOver (Nim)', () => {
  it('returns true when all piles are empty', () => {
    const state = createInitialBoard([0, 0, 0, 0])
    expect(checkGameOver(state)).toBe(true)
  })

  it('returns false while at least one pile has stones', () => {
    const state = createInitialBoard([0, 0, 1, 0])
    expect(checkGameOver(state)).toBe(false)
  })
})

describe('getWinner (Nim) — normal and misere', () => {
  it('returns null when game is not over', () => {
    const state = createInitialBoard([1, 3, 5])
    expect(getWinner(state, 'human')).toBeNull()
  })

  it('normal: mover wins when they take the last stone', () => {
    const state = { ...createInitialBoard([0, 0], 'human', 'normal') }
    expect(getWinner(state, 'human')).toBe('human')
  })

  it('misere: mover loses when they take the last stone', () => {
    const state = { ...createInitialBoard([0, 0], 'human', 'misere') }
    expect(getWinner(state, 'human')).toBe('cpu')
  })
})
