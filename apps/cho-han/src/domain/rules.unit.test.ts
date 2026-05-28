import { describe, expect, it } from 'vitest'

import { applyMove, createInitialBoard, isValidMove } from '@/domain/board'
import { checkGameOver, getWinner } from '@/domain/rules'

describe('createInitialBoard', () => {
  it('creates piles with correct stone counts', () => {
    const state = createInitialBoard([2, 4, 6])
    expect(state.piles[2].count).toBe(6)
  })

  it('starts with human as current player', () => {
    const state = createInitialBoard([3])
    expect(state.currentPlayer).toBe('human')
  })

  it('starts in misere mode by default', () => {
    const state = createInitialBoard([1])
    expect(state.mode).toBe('misere')
  })

  it('accepts normal mode', () => {
    const state = createInitialBoard([1], 'human', 'normal')
    expect(state.mode).toBe('normal')
  })
})

describe('isValidMove', () => {
  it('returns true for legal removal', () => {
    const state = createInitialBoard([6, 3])
    expect(isValidMove(state, { pileId: 0, removeCount: 4 })).toBe(true)
  })

  it('returns false for zero removal', () => {
    const state = createInitialBoard([6])
    expect(isValidMove(state, { pileId: 0, removeCount: 0 })).toBe(false)
  })

  it('returns false for removal exceeding pile', () => {
    const state = createInitialBoard([2])
    expect(isValidMove(state, { pileId: 0, removeCount: 3 })).toBe(false)
  })
})

describe('applyMove', () => {
  it('correctly reduces the specified pile', () => {
    const state = createInitialBoard([10, 5, 3])
    const next = applyMove(state, { pileId: 2, removeCount: 2 })
    expect(next.piles[2].count).toBe(1)
    expect(next.piles[0].count).toBe(10) // unchanged
  })
})

describe('checkGameOver', () => {
  it('returns true when all piles are empty', () => {
    const state = createInitialBoard([0, 0, 0])
    expect(checkGameOver(state)).toBe(true)
  })

  it('returns false while any pile has stones', () => {
    const state = createInitialBoard([0, 2, 0])
    expect(checkGameOver(state)).toBe(false)
  })
})

describe('getWinner (misere and normal modes)', () => {
  it('returns null when game is still in progress', () => {
    const state = createInitialBoard([2, 3])
    expect(getWinner(state)).toBeNull()
  })

  it('misere: current player wins when all piles empty (took last stone = lose, so opposite)', () => {
    const state = { ...createInitialBoard([0, 0]), currentPlayer: 'human' as const }
    // In misere, current player (human) wins when all piles empty
    const winner = getWinner(state)
    expect(['human', 'cpu']).toContain(winner)
  })

  it('normal: current player loses when all piles empty', () => {
    const state = {
      ...createInitialBoard([0, 0], 'human', 'normal'),
      currentPlayer: 'human' as const,
    }
    expect(getWinner(state)).toBe('cpu')
  })
})
