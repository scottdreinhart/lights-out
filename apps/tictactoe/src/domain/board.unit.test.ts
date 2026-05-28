import { describe, expect, it } from 'vitest'

import { applyMove, createEmptyBoard, getEmptyCells, isCellEmpty } from './board'

describe('createEmptyBoard', () => {
  it('creates a 9-cell board of nulls', () => {
    const board = createEmptyBoard()
    expect(board).toHaveLength(9)
    expect(board.every((c) => c === null)).toBe(true)
  })

  it('returns a new array each time', () => {
    const a = createEmptyBoard()
    const b = createEmptyBoard()
    expect(a).not.toBe(b)
    expect(a).toEqual(b)
  })
})

describe('isCellEmpty', () => {
  it('returns true for a null cell', () => {
    const board = createEmptyBoard()
    expect(isCellEmpty(board, 0)).toBe(true)
    expect(isCellEmpty(board, 4)).toBe(true)
    expect(isCellEmpty(board, 8)).toBe(true)
  })

  it('returns false for an occupied cell', () => {
    const board = applyMove(createEmptyBoard(), 4, 'X')
    expect(isCellEmpty(board, 4)).toBe(false)
  })

  it('returns false for out-of-bounds indices', () => {
    const board = createEmptyBoard()
    expect(isCellEmpty(board, -1)).toBe(false)
    expect(isCellEmpty(board, 9)).toBe(false)
    expect(isCellEmpty(board, 100)).toBe(false)
  })
})

describe('applyMove', () => {
  it('places a token on an empty cell', () => {
    const board = createEmptyBoard()
    const result = applyMove(board, 0, 'X')
    expect(result[0]).toBe('X')
  })

  it('returns a new board (immutable)', () => {
    const board = createEmptyBoard()
    const result = applyMove(board, 0, 'X')
    expect(result).not.toBe(board)
    expect(board[0]).toBeNull()
  })

  it('preserves other cells', () => {
    const board = applyMove(createEmptyBoard(), 0, 'X')
    const result = applyMove(board, 4, 'O')
    expect(result[0]).toBe('X')
    expect(result[4]).toBe('O')
    expect(result[8]).toBeNull()
  })

  it('throws when cell is occupied', () => {
    const board = applyMove(createEmptyBoard(), 0, 'X')
    expect(() => applyMove(board, 0, 'O')).toThrow('Cell 0 is not empty')
  })
})

describe('getEmptyCells', () => {
  it('returns all indices for an empty board', () => {
    expect(getEmptyCells(createEmptyBoard())).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8])
  })

  it('excludes occupied cells', () => {
    let board = createEmptyBoard()
    board = applyMove(board, 0, 'X')
    board = applyMove(board, 4, 'O')
    board = applyMove(board, 8, 'X')
    expect(getEmptyCells(board)).toEqual([1, 2, 3, 5, 6, 7])
  })

  it('returns empty array for a full board', () => {
    //  X | O | X
    //  O | X | O
    //  X | O | X
    const board = ['X', 'O', 'X', 'O', 'X', 'O', 'X', 'O', 'X'] as const
    expect(getEmptyCells([...board])).toEqual([])
  })
})
