import { useCallback, useState } from 'react'

import type { Difficulty } from '@/domain'

import { useGame } from './useGame'

type SelectedCell = { row: number; col: number }
type SelectedDigit = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9

export interface UseMiniSudokuAppReturn {
  difficulty: Difficulty
  elapsedTime: ReturnType<typeof useGame>['elapsedTime']
  gameState: ReturnType<typeof useGame>['gameState']
  handleCellChange: ReturnType<typeof useGame>['handleCellChange']
  handleDifficultyChange: (newDifficulty: Difficulty) => void
  handleReset: () => void
  isComplete: boolean
  selectedCell: SelectedCell | undefined
  selectedDigit: SelectedDigit
  setSelectedCell: (cell: SelectedCell | undefined) => void
  setSelectedDigit: (digit: SelectedDigit) => void
}

export const useMiniSudokuApp = (): UseMiniSudokuAppReturn => {
  const [difficulty, setDifficulty] = useState<Difficulty>('medium')
  const { gameState, isComplete, elapsedTime, handleCellChange, resetGame } = useGame(difficulty)
  const [selectedCell, setSelectedCell] = useState<SelectedCell | undefined>()
  const [selectedDigit, setSelectedDigit] = useState<SelectedDigit>(1)

  const handleDifficultyChange = useCallback((newDifficulty: Difficulty) => {
    setDifficulty(newDifficulty)
    setSelectedCell(undefined)
  }, [])

  const handleReset = useCallback(() => {
    resetGame()
    setSelectedCell(undefined)
  }, [resetGame])

  return {
    difficulty,
    elapsedTime,
    gameState,
    handleCellChange,
    handleDifficultyChange,
    handleReset,
    isComplete,
    selectedCell,
    selectedDigit,
    setSelectedCell,
    setSelectedDigit,
  }
}

export default useMiniSudokuApp
