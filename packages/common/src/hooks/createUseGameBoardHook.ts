import { useState, useCallback } from 'react'
import type { UseGameBoardConfig } from './types'

/**
 * Factory for creating game board state hooks.
 * Games extend this with their specific logic (AI, scoring, etc.)
 */
export function createUseGameBoardHook<B>(config: UseGameBoardConfig<B>) {
  return function useGameBoard() {
    const [board, setBoard] = useState<B>(config.createBoard())
    const [moveCount, setMoveCount] = useState(0)

    const reset = useCallback(() => {
      setBoard(config.createBoard())
      setMoveCount(0)
    }, [])

    const updateBoard = useCallback((newBoard: B) => {
      setBoard(newBoard)
      setMoveCount((prev) => prev + 1)
    }, [])

    return {
      board,
      moveCount,
      reset,
      updateBoard,
    }
  }
}
