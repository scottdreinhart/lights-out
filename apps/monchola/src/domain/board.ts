/**
 * Monchola — Domain Board Operations
 * Pure functions for creating and manipulating the game board.
 * No React, no DOM — purely functional transformations.
 */

import type { CellOwner, GameState, MoncholaBoard, Player } from './types'

export const DEFAULT_BOARD_SIZE = 9

/**
 * Create a fresh empty board.
 */
export function createBoard(size: number = DEFAULT_BOARD_SIZE): MoncholaBoard {
  return {
    cells: Array<CellOwner>(size).fill(0),
    size,
  }
}

/**
 * Create the initial game state.
 */
export function createInitialState(): GameState {
  return {
    phase: 'idle',
    board: createBoard(),
    currentPlayer: 'human',
    humanScore: 0,
    cpuScore: 0,
    winner: null,
    turnCount: 0,
  }
}

/**
 * Apply a move for the given player at the given cell index.
 * Returns a new state — never mutates.
 */
export function applyMove(state: GameState, cellIndex: number, player: Player): GameState {
  if (state.phase !== 'playing') {
    return state
  }
  if (!Number.isInteger(cellIndex) || cellIndex < 0 || cellIndex >= state.board.cells.length) {
    return state
  }
  if (state.board.cells.slice(cellIndex, cellIndex + 1)[0] !== 0) {
    return state
  }

  const mark: CellOwner = player === 'human' ? 1 : 2
  const newCells = [...state.board.cells] as CellOwner[]
  newCells.splice(cellIndex, 1, mark)

  const newHumanScore = player === 'human' ? state.humanScore + 1 : state.humanScore
  const newCpuScore = player === 'cpu' ? state.cpuScore + 1 : state.cpuScore
  const nextPlayer: Player = player === 'human' ? 'cpu' : 'human'

  return {
    ...state,
    board: { ...state.board, cells: newCells },
    humanScore: newHumanScore,
    cpuScore: newCpuScore,
    currentPlayer: nextPlayer,
    turnCount: state.turnCount + 1,
  }
}

/**
 * Get all empty cell indices.
 */
export function getEmptyCells(board: MoncholaBoard): number[] {
  return board.cells.map((v, i) => (v === 0 ? i : -1)).filter((i) => i !== -1)
}
