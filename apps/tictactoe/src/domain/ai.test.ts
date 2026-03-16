import { describe, expect, it } from 'vitest'

import { chooseCpuMoveMedium, chooseCpuMoveRandom, chooseCpuMoveSmart } from './ai'
import { createEmptyBoard } from './board'
import type { Board } from './types'

// Helper: build board from string
const b = (layout: string): Board =>
  layout.split('').map((c) => (c === 'X' || c === 'O' ? c : null))

describe('chooseCpuMoveRandom', () => {
  it('returns a valid empty cell index', () => {
    const board = b('XO  X  O ')
    const move = chooseCpuMoveRandom(board)
    expect(board[move]).toBeNull()
  })

  it('throws when board is full', () => {
    expect(() => chooseCpuMoveRandom(b('XOXXOOOXX'))).toThrow('No empty cells')
  })

  it('returns the only available cell when one remains', () => {
    //  X | O | X
    //  O | X | O
    //  O | X | _  (index 8 is empty)
    const board = b(`${'XOXXOOOXX'.slice(0, 8)} `)
    expect(chooseCpuMoveRandom(board)).toBe(8)
  })
})

describe('chooseCpuMoveSmart', () => {
  it('takes a winning move when available', () => {
    // O has cells 0,1 — should take 2 to win the top row
    const board = b('OO X X   ')
    expect(chooseCpuMoveSmart(board, 'O', 'X')).toBe(2)
  })

  it('blocks the opponent from winning', () => {
    // X has cells 0,1 — CPU (O) should block at 2
    const board = b('XX  O    ')
    expect(chooseCpuMoveSmart(board, 'O', 'X')).toBe(2)
  })

  it('prefers center when no immediate win/block', () => {
    const board = b('X        ')
    expect(chooseCpuMoveSmart(board, 'O', 'X')).toBe(4)
  })

  it('prefers corners when center is taken', () => {
    const board = b('    X    ')
    const move = chooseCpuMoveSmart(board, 'O', 'X')
    expect([0, 2, 6, 8]).toContain(move)
  })

  it('throws when board is full', () => {
    expect(() => chooseCpuMoveSmart(b('XOXXOOOXX'), 'O', 'X')).toThrow('No empty cells')
  })
})

describe('chooseCpuMoveMedium', () => {
  it('takes a winning move when available', () => {
    const board = b('OO X X   ')
    expect(chooseCpuMoveMedium(board, 'O', 'X')).toBe(2)
  })

  it('blocks the opponent from winning', () => {
    const board = b('XX  O    ')
    expect(chooseCpuMoveMedium(board, 'O', 'X')).toBe(2)
  })

  it('returns a valid empty cell when no win/block', () => {
    const board = createEmptyBoard()
    const move = chooseCpuMoveMedium(board, 'O', 'X')
    expect(move).toBeGreaterThanOrEqual(0)
    expect(move).toBeLessThan(9)
    expect(board[move]).toBeNull()
  })

  it('throws when board is full', () => {
    expect(() => chooseCpuMoveMedium(b('XOXXOOOXX'), 'O', 'X')).toThrow('No empty cells')
  })
})
