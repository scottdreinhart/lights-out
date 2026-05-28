import { describe, expect, it } from 'vitest'

import { createInitialBoard } from './board'
import { applyMove, evaluateGameResult, getValidMoves, isValidMove } from './rules'

describe('reversi rules', () => {
  it('provides four valid opening moves for black', () => {
    const board = createInitialBoard()
    const moves = getValidMoves(board, 'black')

    expect(moves).toHaveLength(4)
  })

  it('validates a legal opening move and applies flips', () => {
    const board = createInitialBoard()
    const legal = { row: 2, col: 3 }

    expect(isValidMove(board, legal, 'black')).toBe(true)

    const move = getValidMoves(board, 'black').find(
      (candidate) => candidate.position.row === legal.row && candidate.position.col === legal.col,
    )

    expect(move).toBeDefined()

    const next = applyMove(board, move!, 'black')
    const after = evaluateGameResult(next)

    expect(next[legal.row * 8 + legal.col]).toBe('black')
    expect(after.status).toBe('playing')
  })
})
