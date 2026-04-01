import { useState, useCallback } from 'react'
import { createGameState, makeMove, isGameComplete, calculateGameTime } from '@/domain'
import type { GameState, Difficulty, Cell } from '@/domain'

export const useGame = (difficulty: Difficulty) => {
  const [gameState, setGameState] = useState<GameState>(() => createGameState(difficulty))
  const [isComplete, setIsComplete] = useState(false)

  const handleCellChange = useCallback(
    (row: number, col: number, value: Cell) => {
      setGameState(prevState => {
        const newState = makeMove(prevState, row, col, value)
        if (isGameComplete(newState)) {
          setIsComplete(true)
        }
        return newState
      })
    },
    [],
  )

  const resetGame = useCallback(() => {
    setGameState(createGameState(difficulty))
    setIsComplete(false)
  }, [difficulty])

  const elapsedTime = calculateGameTime(gameState.startedAt)

  return {
    gameState,
    isComplete,
    elapsedTime,
    handleCellChange,
    resetGame,
  }
}
