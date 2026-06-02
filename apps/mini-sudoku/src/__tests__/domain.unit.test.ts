import { createBoard, createGameState, isGameComplete, makeMove } from '@/domain'
import { describe, expect, it } from 'vitest'

describe('Sudoku Domain Logic', () => {
  it('should create a valid game state', () => {
    const state = createGameState('medium')
    expect(state.board).toBeDefined()
    expect(state.solution).toBeDefined()
    expect(state.difficulty).toBe('medium')
    expect(state.moves).toEqual([])
  })

  it('should create a board with correct dimensions', () => {
    const board = createBoard('easy')
    expect(board.grid).toHaveLength(9)
    expect(board.grid[0]).toHaveLength(9)
  })

  it('should detect game completion', () => {
    const state = createGameState('easy')
    // Initially not complete
    expect(isGameComplete(state)).toBe(false)
  })

  it('should track moves', () => {
    const state = createGameState('medium')
    const newState = makeMove(state, 0, 0, 1)
    expect(newState.moves).toHaveLength(1)
    expect(newState.moves[0].value).toBe(1)
  })
})
