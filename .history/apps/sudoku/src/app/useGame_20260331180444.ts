import type { Cell, Difficulty, GameState } from '@/domain'
import { calculateGameTime, createGameState, isGameComplete, makeMove } from '@/domain'
import { useCallback, useState } from 'react'

export const useGame = (difficulty: Difficulty) => {
  const [gameState, setGameState] = useState<GameState>(() => createGameState(difficulty))
  const [isComplete, setIsComplete] = useState(false)

  const handleCellChange = useCallback((row: number, col: number, value: Cell) => {
    setGameState((prevState) => {
      const newState = makeMove(prevState, row, col, value)
      if (isGameComplete(newState)) {
        setIsComplete(true)
      }
      return newState
    })
  }, [])

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
