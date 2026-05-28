import { describe, expect, it } from 'vitest'

import { applyMove, createInitialBoard, isValidMove } from '@/domain/board'
import { checkGameOver, getWinner } from '@/domain/rules'

// ship-captain-crew shares the Nim-variant scaffolded domain.

describe('createInitialBoard (ship-captain-crew)', () => {
  it('creates piles with expected counts', () => {
    const state = createInitialBoard([3, 3, 3])
    expect(state.piles).toHaveLength(3)
    expect(state.piles[0].count).toBe(3)
  })

  it('starts with human as current player', () => {
    const state = createInitialBoard([1])
    expect(state.currentPlayer).toBe('human')
  })
})

describe('isValidMove (ship-captain-crew)', () => {
  it('allows removing stones within pile count', () => {
    const state = createInitialBoard([4, 2])
    expect(isValidMove(state, { pileId: 1, removeCount: 2 })).toBe(true)
  })

  it('rejects removing more than available', () => {
    const state = createInitialBoard([3])
    expect(isValidMove(state, { pileId: 0, removeCount: 4 })).toBe(false)
  })
})

describe('applyMove (ship-captain-crew)', () => {
  it('reduces pile count after move', () => {
    const state = createInitialBoard([6, 4])
    const next = applyMove(state, { pileId: 0, removeCount: 2 })
    expect(next.piles[0].count).toBe(4)
    expect(next.piles[1].count).toBe(4) // unchanged
  })
})

describe('checkGameOver (ship-captain-crew)', () => {
  it('true when all empty', () => {
    expect(checkGameOver(createInitialBoard([0, 0, 0]))).toBe(true)
  })

  it('false when any pile non-empty', () => {
    expect(checkGameOver(createInitialBoard([0, 1, 0]))).toBe(false)
  })
})

describe('getWinner (ship-captain-crew)', () => {
  it('returns null during game', () => {
    expect(getWinner(createInitialBoard([2]))).toBeNull()
  })

  it('returns valid player at game over', () => {
    expect(['human', 'cpu']).toContain(getWinner(createInitialBoard([0, 0])))
  })
})
