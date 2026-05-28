import { afterEach, describe, expect, it, vi } from 'vitest'

import { selectMove } from './ai'
import { createInitialBoard } from './board'
import { getValidMoves } from './rules'

describe('reversi ai', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('returns one of the legal moves on easy', () => {
    const board = createInitialBoard()
    const legalMoves = getValidMoves(board, 'black')
    vi.spyOn(Math, 'random').mockReturnValue(0)

    const move = selectMove(board, 'black', 'easy')

    expect(move).not.toBeNull()
    expect(
      legalMoves.some(
        (candidate) =>
          candidate.position.row === move!.position.row &&
          candidate.position.col === move!.position.col,
      ),
    ).toBe(true)
  })

  it('returns null when no legal move exists', () => {
    const board = new Array(64).fill('black') as ReturnType<typeof createInitialBoard>

    const move = selectMove(board, 'white', 'hard')
    expect(move).toBeNull()
  })
})
