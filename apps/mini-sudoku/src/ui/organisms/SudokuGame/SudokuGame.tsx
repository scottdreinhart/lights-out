import type { UseMiniSudokuAppReturn } from '@/app'
import { useMiniSudokuInput } from '@/app'
import { Card } from '@/ui/atoms'
import {
  CompletionDisplay,
  DifficultySelector,
  GameControls,
  GameStats,
  SudokuBoard,
} from '@/ui/molecules'
import React from 'react'
import styles from './SudokuGame.module.css'

interface SudokuGameProps {
  app: UseMiniSudokuAppReturn
}

export const SudokuGame: React.FC<SudokuGameProps> = ({ app }) => {
  // Unified keyboard input handler for grid navigation and digit input
  useMiniSudokuInput({
    selectedCell: app.selectedCell,
    editableBoard: app.gameState.solution,
    onCellSelect: (row, col) => app.setSelectedCell({ row, col }),
    onCellChange: app.handleCellChange,
  })

  return (
    <Card className={styles.gameCard} title="Sudoku">
      <div className={styles.gameContainer}>
        <div className={styles.boardSection}>
          <SudokuBoard
            board={app.gameState.board}
            editableBoard={app.gameState.solution}
            selectedCell={app.selectedCell}
            onCellSelect={(row, col) => app.setSelectedCell({ row, col })}
            onCellChange={app.handleCellChange}
          />
        </div>

        <div className={styles.sidebar}>
          <GameStats elapsedTime={app.elapsedTime} difficulty={app.difficulty} />

          <CompletionDisplay isComplete={app.isComplete} elapsedTime={app.elapsedTime} />

          <DifficultySelector
            difficulty={app.difficulty}
            onDifficultyChange={app.handleDifficultyChange}
          />

          <GameControls onReset={app.handleReset} />
        </div>
      </div>
    </Card>
  )
}
