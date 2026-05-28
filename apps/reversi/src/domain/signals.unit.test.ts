import { describe, expect, it } from 'vitest'

import { createInitialBoard } from './board'
import { getValidMoves } from './rules'
import { buildReversiSignalProfile } from './signals'
import type { GameResult } from './types'

const playing: GameResult = { status: 'playing' }

describe('buildReversiSignalProfile', () => {
  it('starts with low pressure and visible progress on the initial board', () => {
    const board = createInitialBoard()
    const validMoves = getValidMoves(board, 'black')

    const signals = buildReversiSignalProfile({
      board,
      currentPlayer: 'black',
      validMoves,
      mode: 'pvc',
      difficulty: 'medium',
      cpuThinking: false,
      result: playing,
      moveCount: 0,
    })

    expect(signals.pressure).toBeLessThan(50)
    expect(signals.progress).toBeGreaterThan(0)
  })

  it('raises pressure and focus when mobility is scarce', () => {
    const board = createInitialBoard()
    const crowded = [...board]
    for (let i = 0; i < crowded.length - 8; i++) {
      crowded[i] = i % 2 === 0 ? 'black' : 'white'
    }

    const sparseMoves = buildReversiSignalProfile({
      board: crowded,
      currentPlayer: 'black',
      validMoves: [],
      mode: 'pvc',
      difficulty: 'hard',
      cpuThinking: true,
      result: playing,
      moveCount: 24,
    })

    expect(sparseMoves.pressure).toBeGreaterThan(70)
    expect(sparseMoves.focus).toBeGreaterThan(60)
  })

  it('increases progress as the board fills', () => {
    const emptyBoard = createInitialBoard()
    const filledBoard = [...emptyBoard]
    for (let i = 0; i < filledBoard.length; i++) {
      filledBoard[i] = i % 2 === 0 ? 'black' : 'white'
    }

    const early = buildReversiSignalProfile({
      board: emptyBoard,
      currentPlayer: 'black',
      validMoves: getValidMoves(emptyBoard, 'black'),
      mode: 'pvp',
      difficulty: 'easy',
      cpuThinking: false,
      result: playing,
      moveCount: 0,
    })
    const late = buildReversiSignalProfile({
      board: filledBoard,
      currentPlayer: 'black',
      validMoves: [],
      mode: 'pvp',
      difficulty: 'easy',
      cpuThinking: false,
      result: playing,
      moveCount: 40,
    })

    expect(late.progress).toBeGreaterThan(early.progress)
  })
})
