import { describe, expect, it } from 'vitest'

import {
  createGameState,
  executeMove,
  getFinalScore,
  isGameOver,
  whichSideIsEmpty,
} from '@/domain/rules'

// ─── createGameState ──────────────────────────────────────────────────────────

describe('createGameState', () => {
  it('creates a standard 14-position board', () => {
    const state = createGameState()
    expect(state.board).toHaveLength(14)
  })

  it('starts player 0 as current player', () => {
    const state = createGameState()
    expect(state.currentPlayer).toBe(0)
  })

  it('stores (index 6 and 13) start empty', () => {
    const state = createGameState()
    expect(state.board[6]).toBe(0) // player 0 store
    expect(state.board[13]).toBe(0) // player 1 store
  })

  it('distributes 4 stones per pit by default', () => {
    const state = createGameState()
    for (let i = 0; i < 6; i++) {
      expect(state.board[i]).toBe(4) // player 0 pits
    }
    for (let i = 7; i < 13; i++) {
      expect(state.board[i]).toBe(4) // player 1 pits
    }
  })

  it('accepts custom stone count', () => {
    const state = createGameState(2)
    expect(state.board[0]).toBe(2)
    expect(state.board[7]).toBe(2)
  })

  it('starts in playing phase with no winner', () => {
    const state = createGameState()
    expect(state.phase).toBe('playing')
    expect(state.winner).toBeNull()
  })
})

// ─── isGameOver ───────────────────────────────────────────────────────────────

describe('isGameOver', () => {
  it('returns false on a fresh board', () => {
    const { board } = createGameState()
    expect(isGameOver(board)).toBe(false)
  })

  it('returns true when player 0 side is all empty', () => {
    const board = Array(14).fill(4)
    board[6] = 0
    board[13] = 0
    // Clear player 0 pits
    for (let i = 0; i < 6; i++) {board[i] = 0}
    expect(isGameOver(board)).toBe(true)
  })

  it('returns true when player 1 side is all empty', () => {
    const board = Array(14).fill(4)
    board[6] = 0
    board[13] = 0
    for (let i = 7; i < 13; i++) {board[i] = 0}
    expect(isGameOver(board)).toBe(true)
  })
})

// ─── whichSideIsEmpty ─────────────────────────────────────────────────────────

describe('whichSideIsEmpty', () => {
  it('returns null on a fresh board', () => {
    const { board } = createGameState()
    expect(whichSideIsEmpty(board)).toBeNull()
  })

  it('returns 0 when player 0 side is empty', () => {
    const board = Array(14).fill(4)
    board[6] = 0
    board[13] = 0
    for (let i = 0; i < 6; i++) {board[i] = 0}
    expect(whichSideIsEmpty(board)).toBe(0)
  })

  it('returns 1 when player 1 side is empty', () => {
    const board = Array(14).fill(4)
    board[6] = 0
    board[13] = 0
    for (let i = 7; i < 13; i++) {board[i] = 0}
    expect(whichSideIsEmpty(board)).toBe(1)
  })
})

// ─── executeMove ──────────────────────────────────────────────────────────────

describe('executeMove', () => {
  it('returns isValid true for a legal first move', () => {
    const state = createGameState()
    const result = executeMove(state, 0) // pit 0 is valid for player 0
    expect(result.isValid).toBe(true)
  })

  it('returns isValid false for a move from an empty pit', () => {
    const state = createGameState(0) // all pits empty
    const result = executeMove(state, 0)
    expect(result.isValid).toBe(false)
  })

  it('changes the board state after a valid move', () => {
    const state = createGameState()
    const result = executeMove(state, 0)
    expect(result.newBoard).not.toEqual(state.board)
  })
})

// ─── getFinalScore ────────────────────────────────────────────────────────────

describe('getFinalScore', () => {
  it('returns a string summary of both player scores', () => {
    const { board } = createGameState()
    const score = getFinalScore(board)
    expect(typeof score).toBe('string')
    expect(score).toContain('Player 0')
    expect(score).toContain('Player 1')
  })
})
