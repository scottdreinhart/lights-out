import { createBoard, isSolved, toggleCell, type GameState } from '@/domain'
import { useCallback, useEffect, useState } from 'react'

export function useGame(): GameState & {
  handleCellClick: (row: number, col: number) => void
  resetGame: () => void
} {
  const [gameState, setGameState] = useState<GameState>(() => ({
    board: createBoard(),
    moves: 0,
    isSolved: false,
  }))

  useEffect(() => {
    const solved = isSolved(gameState.board)
    setGameState((prev) => (prev.isSolved === solved ? prev : { ...prev, isSolved: solved }))
  }, [gameState.board])

  const handleCellClick = useCallback(
    (row: number, col: number) => {
      if (gameState.isSolved) {
        return
      }

      setGameState((prev) => ({
        ...prev,
        board: toggleCell(prev.board, row, col),
        moves: prev.moves + 1,
      }))
    },
    [gameState.isSolved],
  )

  const resetGame = useCallback(() => {
    setGameState({
      board: createBoard(),
      moves: 0,
      isSolved: false,
    })
  }, [])

  return {
    ...gameState,
    handleCellClick,
    resetGame,
  }
}
