/**
 * Tango Domain AI
 * Solving algorithms for the Tango slide puzzle
 */

import type { Board, Position, SolutionStats } from './types'
import { findEmptyPosition, isValidMove, makeMove, createSolvedBoard } from './rules'

export const calculateParity = (board: Board): 'even' | 'odd' => {
  const size = board.length
  const flatBoard = board.flat().filter(n => n !== 0)
  let inversions = 0

  for (let i = 0; i < flatBoard.length; i++) {
    for (let j = i + 1; j < flatBoard.length; j++) {
      if (flatBoard[i] > flatBoard[j]) {
        inversions++
      }
    }
  }

  return inversions % 2 === 0 ? 'even' : 'odd'
}

export const isSolvable = (board: Board): boolean => {
  const size = board.length

  // For odd-sized boards, always solvable
  if (size % 2 === 1) return true

  // For even-sized boards, check parity
  const parity = calculateParity(board)
  return parity === 'even'
}

export const solvePuzzleBFS = (board: Board): Position[] | null => {
  if (!isSolvable(board)) return null

  const size = board.length
  const solvedBoard = createSolvedBoard(size)
  const solvedKey = boardToString(solvedBoard)

  const queue: Array<{ board: Board; path: Position[] }> = [{ board, path: [] }]
  const visited = new Set<string>([boardToString(board)])

  while (queue.length > 0) {
    const { board: currentBoard, path } = queue.shift()!
    const currentKey = boardToString(currentBoard)

    if (currentKey === solvedKey) {
      return path
    }

    const emptyPos = findEmptyPosition(currentBoard)
    const validMoves = getValidMoves(currentBoard)

    for (const move of validMoves) {
      const newBoard = makeMove(currentBoard, move)
      const newKey = boardToString(newBoard)

      if (!visited.has(newKey)) {
        visited.add(newKey)
        queue.push({
          board: newBoard,
          path: [...path, move]
        })
      }
    }
  }

  return null // No solution found
}

export const solvePuzzleAStar = (board: Board): Position[] | null => {
  if (!isSolvable(board)) return null

  const size = board.length
  const solvedBoard = createSolvedBoard(size)
  const solvedKey = boardToString(solvedBoard)

  const heuristic = (board: Board): number => {
    let distance = 0
    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        const value = board[row][col]
        if (value !== 0) {
          const targetRow = Math.floor((value - 1) / size)
          const targetCol = (value - 1) % size
          distance += Math.abs(row - targetRow) + Math.abs(col - targetCol)
        }
      }
    }
    return distance
  }

  const openSet: Array<{ board: Board; path: Position[]; cost: number; heuristic: number }> = [{
    board,
    path: [],
    cost: 0,
    heuristic: heuristic(board)
  }]

  const visited = new Set<string>([boardToString(board)])

  while (openSet.length > 0) {
    // Find node with lowest f-score
    openSet.sort((a, b) => (a.cost + a.heuristic) - (b.cost + b.heuristic))
    const current = openSet.shift()!
    const currentKey = boardToString(current.board)

    if (currentKey === solvedKey) {
      return current.path
    }

    const emptyPos = findEmptyPosition(current.board)
    const validMoves = getValidMoves(current.board)

    for (const move of validMoves) {
      const newBoard = makeMove(current.board, move)
      const newKey = boardToString(newBoard)

      if (!visited.has(newKey)) {
        visited.add(newKey)
        openSet.push({
          board: newBoard,
          path: [...current.path, move],
          cost: current.cost + 1,
          heuristic: heuristic(newBoard)
        })
      }
    }
  }

  return null
}

export const generateHint = (board: Board): Position | null => {
  const solution = solvePuzzleAStar(board)
  return solution && solution.length > 0 ? solution[0] : null
}

export const getSolutionStats = (board: Board): SolutionStats => {
  const solvable = isSolvable(board)
  const parity = calculateParity(board)

  if (!solvable) {
    return { solvable: false, minimumMoves: -1, parity }
  }

  const solution = solvePuzzleAStar(board)
  const minimumMoves = solution ? solution.length : -1

  return { solvable: true, minimumMoves, parity }
}

const boardToString = (board: Board): string => {
  return board.flat().join(',')
}