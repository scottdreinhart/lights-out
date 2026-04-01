import React, { useState } from 'react'
import { useGame } from '@/app/index'
import { Card } from '@/ui/atoms'
import { SudokuBoard, GameStats, CompletionDisplay, DifficultySelector, GameControls } from '@/ui/molecules'
import { Difficulty } from '@/domain'
import styles from './SudokuGame.module.css'

export const SudokuGame: React.FC = () => {
  const [difficulty, setDifficulty] = useState<Difficulty>('medium')
  const { gameState, isComplete, elapsedTime, handleCellChange, resetGame } =
    useGame(difficulty)
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | undefined>()

  const handleDifficultyChange = (newDifficulty: Difficulty) => {
    setDifficulty(newDifficulty)
    setSelectedCell(undefined)
  }

  const handleReset = () => {
    resetGame()
    setSelectedCell(undefined)
  }

  return (
    <Card className={styles.gameCard} title="Sudoku">
      <div className={styles.gameContainer}>
        <div className={styles.boardSection}>
          <SudokuBoard
            board={gameState.board}
            editableBoard={gameState.solution}
            selectedCell={selectedCell}
            onCellSelect={(row, col) => setSelectedCell({ row, col })}
            onCellChange={handleCellChange}
          />
        </div>

        <div className={styles.sidebar}>
          <GameStats
            elapsedTime={elapsedTime}
            difficulty={difficulty}
          />

          <CompletionDisplay
            isComplete={isComplete}
            elapsedTime={elapsedTime}
          />

          <DifficultySelector
            difficulty={difficulty}
            onDifficultyChange={handleDifficultyChange}
          />

          <GameControls onReset={handleReset} />
        </div>
      </div>
    </Card>
  )
}
