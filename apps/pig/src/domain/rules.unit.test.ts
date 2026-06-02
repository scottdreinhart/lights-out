import { describe, expect, it } from 'vitest'

import { applyMove, createInitialBoard, isValidMove } from '@/domain/board'
import { checkGameOver, getWinner } from '@/domain/rules'

// ─── pig / ship-captain-crew share the same scaffolded domain structure.
// Tests exercise the actual board and rules functions against the Nim-variant domain.

describe('createInitialBoard (pig)', () => {
  it('creates piles with given counts', () => {
    const state = createInitialBoard([6, 4, 2])
    expect(state.piles[0].count).toBe(6)
    expect(state.piles[2].count).toBe(2)
  })

  it('starts with human player', () => {
    const state = createInitialBoard([1])
    expect(state.currentPlayer).toBe('human')
  })
})

describe('isValidMove (pig)', () => {
  it('allows a move within pile bounds', () => {
    const state = createInitialBoard([5])
    expect(isValidMove(state, { pileId: 0, removeCount: 5 })).toBe(true)
  })

  it('rejects out-of-bounds remove count', () => {
    const state = createInitialBoard([2])
    expect(isValidMove(state, { pileId: 0, removeCount: 3 })).toBe(false)
  })
})

describe('applyMove (pig)', () => {
  it('decrements pile count correctly', () => {
    const state = createInitialBoard([10])
    const next = applyMove(state, { pileId: 0, removeCount: 4 })
    expect(next.piles[0].count).toBe(6)
  })
})

describe('checkGameOver (pig)', () => {
  it('returns true when all piles are empty', () => {
    const state = createInitialBoard([0, 0])
    expect(checkGameOver(state)).toBe(true)
  })

  it('returns false when piles have stones', () => {
    const state = createInitialBoard([0, 2])
    expect(checkGameOver(state)).toBe(false)
  })
})

describe('getWinner (pig)', () => {
  it('returns null when game is in progress', () => {
    const state = createInitialBoard([3, 5])
    expect(getWinner(state)).toBeNull()
  })

  it('returns a valid player when game is over', () => {
    const state = createInitialBoard([0, 0])
    const winner = getWinner(state)
    expect(['human', 'cpu']).toContain(winner)
  })
})
