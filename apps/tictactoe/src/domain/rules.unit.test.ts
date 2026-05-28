import { describe, expect, it } from 'vitest'

import { getGameState, getWinner, getWinnerToken, isBoardFull, isDraw } from './rules'
import type { Board } from './types'

// Helper: build board from string layout
// e.g. 'XOX OX  O' → ['X','O','X',null,'O','X',null,null,'O']
const b = (layout: string): Board =>
  layout.split('').map((c) => (c === 'X' || c === 'O' ? c : null))

describe('getWinner', () => {
  it('returns null for an empty board', () => {
    expect(getWinner(b('         '))).toBeNull()
  })

  it('detects row wins', () => {
    // Top row
    expect(getWinner(b('XXX      '))).toEqual({ token: 'X', line: [0, 1, 2] })
    // Middle row
    expect(getWinner(b('   OOO   '))).toEqual({ token: 'O', line: [3, 4, 5] })
    // Bottom row
    expect(getWinner(b('      XXX'))).toEqual({ token: 'X', line: [6, 7, 8] })
  })

  it('detects column wins', () => {
    // Left column
    expect(getWinner(b('X  X  X  '))).toEqual({ token: 'X', line: [0, 3, 6] })
    // Center column
    expect(getWinner(b(' O  O  O '))).toEqual({ token: 'O', line: [1, 4, 7] })
    // Right column
    expect(getWinner(b('  X  X  X'))).toEqual({ token: 'X', line: [2, 5, 8] })
  })

  it('detects diagonal wins', () => {
    // Top-left to bottom-right
    expect(getWinner(b('X   X   X'))).toEqual({ token: 'X', line: [0, 4, 8] })
    // Top-right to bottom-left
    expect(getWinner(b('  O O O  '))).toEqual({ token: 'O', line: [2, 4, 6] })
  })

  it('returns null when no winner', () => {
    expect(getWinner(b('XO  X  O '))).toBeNull()
  })
})

describe('getWinnerToken', () => {
  it('returns the winning token', () => {
    expect(getWinnerToken(b('XXX      '))).toBe('X')
    expect(getWinnerToken(b('OOO      '))).toBe('O')
  })

  it('returns null when no winner', () => {
    expect(getWinnerToken(b('         '))).toBeNull()
  })
})

describe('isBoardFull', () => {
  it('returns false for an empty board', () => {
    expect(isBoardFull(b('         '))).toBe(false)
  })

  it('returns false for a partially filled board', () => {
    expect(isBoardFull(b('XO XOX   '))).toBe(false)
  })

  it('returns true for a full board', () => {
    expect(isBoardFull(b('XOXXOOOXX'))).toBe(true)
  })
})

describe('isDraw', () => {
  it('returns false for an empty board', () => {
    expect(isDraw(b('         '))).toBe(false)
  })

  it('returns false when there is a winner', () => {
    // Full board but X wins top row
    expect(isDraw(b('XXXOOXXOO'))).toBe(false)
  })

  it('returns true for a full board with no winner', () => {
    // X O X
    // X X O
    // O X O  → draw
    expect(isDraw(b('XOXXXOOXO'))).toBe(true)
  })
})

describe('getGameState', () => {
  it('returns initial state for empty board', () => {
    const state = getGameState(b('         '))
    expect(state.winner).toBeNull()
    expect(state.winLine).toBeNull()
    expect(state.isDraw).toBe(false)
    expect(state.isOver).toBe(false)
  })

  it('returns winner state', () => {
    const state = getGameState(b('XXX      '))
    expect(state.winner).toBe('X')
    expect(state.winLine).toEqual([0, 1, 2])
    expect(state.isDraw).toBe(false)
    expect(state.isOver).toBe(true)
  })

  it('returns draw state', () => {
    const state = getGameState(b('XOXXXOOXO'))
    expect(state.winner).toBeNull()
    expect(state.winLine).toBeNull()
    expect(state.isDraw).toBe(true)
    expect(state.isOver).toBe(true)
  })

  it('returns in-progress state', () => {
    const state = getGameState(b('XO       '))
    expect(state.winner).toBeNull()
    expect(state.isDraw).toBe(false)
    expect(state.isOver).toBe(false)
  })
})
