/**
 * Queens Game Hook
 * React hook for N-Queens game state management
 */

import { useState, useCallback, useEffect } from 'react'
import type { Board, QueensState, Difficulty, MoveResult } from '../domain'
import {
  createGameState,
  placeQueen,
  removeQueen,
  isBoardSolved,
  countConflicts,
  generatePuzzle,
  solveNQueens,
  BOARD_SIZES
} from '../domain'

export function useQueensGame(initialDifficulty: Difficulty = Difficulty.HARD) {
  const size = BOARD_SIZES[initialDifficulty]

  const [gameState, setGameState] = useState<QueensState>(() => ({
    id: `queens-${Date.now()}`,
    board: createGameState(size),
    size,
    isComplete: false,
    isSolved: false,
    moveCount: 0,
    startTime: Date.now(),
    hintCount: 0,
    mistakes: 0
  }))

  // Update completion status
  useEffect(() => {
    const complete = gameState.board.every(pos => pos !== -1)
    const solved = isBoardSolved(gameState.board)

    setGameState(prev => ({
      ...prev,
      isComplete: complete,
      isSolved: solved
    }))
  }, [gameState.board])

  const makeMove = useCallback((row: number, col: number): MoveResult => {
    setGameState(prev => {
      const newBoard = [...prev.board]
      const result = placeQueen(newBoard, row, col)

      if (!result.success) {
        return {
          ...prev,
          mistakes: prev.mistakes + 1
        }
      }

      return {
        ...prev,
        board: newBoard,
        moveCount: prev.moveCount + 1
      }
    })

    return { success: true }
  }, [])

  const removeQueenAt = useCallback((row: number) => {
    setGameState(prev => {
      const newBoard = [...prev.board]
      const success = removeQueen(newBoard, row)

      return success ? {
        ...prev,
        board: newBoard,
        moveCount: prev.moveCount + 1
      } : prev
    })
  }, [])

  const resetGame = useCallback(() => {
    setGameState({
      id: `queens-${Date.now()}`,
      board: createGameState(size),
      size,
      isComplete: false,
      isSolved: false,
      moveCount: 0,
      startTime: Date.now(),
      hintCount: 0,
      mistakes: 0
    })
  }, [size])

  const generateNewPuzzle = useCallback((difficulty: 'easy' | 'medium' | 'hard' = 'medium') => {
    const puzzle = generatePuzzle(size, difficulty)
    setGameState({
      id: `queens-${Date.now()}`,
      board: puzzle,
      size,
      isComplete: false,
      isSolved: false,
      moveCount: 0,
      startTime: Date.now(),
      hintCount: 0,
      mistakes: 0
    })
  }, [size])

  const solvePuzzle = useCallback(() => {
    const { solutions } = solveNQueens(size)
    if (solutions.length > 0) {
      setGameState(prev => ({
        ...prev,
        board: solutions[0],
        isComplete: true,
        isSolved: true
      }))
    }
  }, [size])

  const getHint = useCallback(() => {
    // Find first empty row and suggest a valid move
    for (let row = 0; row < size; row++) {
      if (gameState.board[row] === -1) {
        // Find valid columns for this row
        for (let col = 0; col < size; col++) {
          const testBoard = [...gameState.board]
          if (placeQueen(testBoard, row, col).success) {
            setGameState(prev => ({
              ...prev,
              hintCount: prev.hintCount + 1
            }))
            return { row, col }
          }
        }
        break
      }
    }
    return null
  }, [gameState.board, size])

  return {
    gameState,
    makeMove,
    removeQueenAt,
    resetGame,
    generateNewPuzzle,
    solvePuzzle,
    getHint,
    conflicts: countConflicts(gameState.board)
  }
}