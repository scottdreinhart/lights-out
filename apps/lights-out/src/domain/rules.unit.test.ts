import { describe, expect, it } from 'vitest'

import { getGridSize, isSolved, toggleCell } from '@/domain/board'
import { checkWin, getMoveCount } from '@/domain/rules'
import type { Board } from '@/domain/types'

// ─── Helpers ──────────────────────────────────────────────────────────────────

const SIZE = 5

/** Create a fully-off board (all solved). */
function allOff(): Board {
  return Array.from({ length: SIZE }, () => Array<boolean>(SIZE).fill(false))
}

/** Create a board with a single light on at (row, col). */
function singleOn(row: number, col: number): Board {
  const board = allOff()
  board[row][col] = true
  return board
}

// ─── getGridSize ──────────────────────────────────────────────────────────────

describe('getGridSize', () => {
  it('returns 5', () => {
    expect(getGridSize()).toBe(5)
  })
})

// ─── isSolved ─────────────────────────────────────────────────────────────────

describe('isSolved', () => {
  it('returns true for a fully-off board', () => {
    expect(isSolved(allOff())).toBe(true)
  })

  it('returns false when any light is on', () => {
    expect(isSolved(singleOn(0, 0))).toBe(false)
    expect(isSolved(singleOn(2, 2))).toBe(false)
  })
})

// ─── toggleCell ───────────────────────────────────────────────────────────────

describe('toggleCell', () => {
  it('toggles the clicked cell from off to on', () => {
    const board = allOff()
    const next = toggleCell(board, 2, 2)
    expect(next[2][2]).toBe(true)
  })

  it('toggles the clicked cell from on to off', () => {
    const board = allOff()
    board[2][2] = true
    const next = toggleCell(board, 2, 2)
    expect(next[2][2]).toBe(false)
  })

  it('toggles all 4 cardinal neighbors', () => {
    const board = allOff()
    const next = toggleCell(board, 2, 2)
    expect(next[1][2]).toBe(true) // up
    expect(next[3][2]).toBe(true) // down
    expect(next[2][1]).toBe(true) // left
    expect(next[2][3]).toBe(true) // right
  })

  it('does not toggle out-of-bounds neighbors at top-left corner', () => {
    const board = allOff()
    const next = toggleCell(board, 0, 0)
    // Out of bounds neighbors should not cause errors
    expect(next[0][0]).toBe(true)
    expect(next[0][1]).toBe(true) // right
    expect(next[1][0]).toBe(true) // down
    // No change at [-1][0] or [0][-1] (out of bounds)
  })

  it('does not mutate the original board', () => {
    const board = allOff()
    const copy = board.map((r) => [...r])
    toggleCell(board, 2, 2)
    expect(board).toEqual(copy)
  })

  it('solves 1-light scenario: toggle center of a single-light cross', () => {
    // If only center is on, toggling top should toggle center off making board solvable
    const board = allOff()
    board[2][2] = true // center on
    // Toggle center to start solving
    const next = toggleCell(board, 2, 2)
    // Center flips off; neighbors all flip on
    expect(next[2][2]).toBe(false)
  })
})

// ─── checkWin ─────────────────────────────────────────────────────────────────

describe('checkWin', () => {
  it('returns true for all-off board', () => {
    expect(checkWin(allOff())).toBe(true)
  })

  it('returns false when any cell is on', () => {
    const board = allOff()
    board[0][0] = true
    expect(checkWin(board)).toBe(false)
  })

  it('returns false even if only one light remains', () => {
    const board = allOff()
    board[4][4] = true
    expect(checkWin(board)).toBe(false)
  })
})

// ─── getMoveCount ─────────────────────────────────────────────────────────────

describe('getMoveCount', () => {
  it('returns 0 for solved board', () => {
    expect(getMoveCount(allOff())).toBe(0)
  })

  it('returns at least 1 when lights are on', () => {
    const board = allOff()
    board[0][0] = true
    expect(getMoveCount(board)).toBeGreaterThan(0)
  })

  it('increases estimate with more lights on', () => {
    const twoLights = allOff()
    twoLights[0][0] = true
    twoLights[4][4] = true

    const fiveLights = allOff()
    for (let i = 0; i < 5; i++) {
      fiveLights[0][i] = true
    }

    expect(getMoveCount(fiveLights)).toBeGreaterThanOrEqual(getMoveCount(twoLights))
  })
})
