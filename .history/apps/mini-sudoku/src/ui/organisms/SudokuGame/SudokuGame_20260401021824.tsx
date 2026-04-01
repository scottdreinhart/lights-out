import React, { useState } from 'react'
import { useGame, useResponsiveState } from '@/app/index'
import { Card, Button } from '@/ui/atoms'
import { SudokuBoard } from '@/ui/molecules'
import { Difficulty } from '@/domain'
import styles from './SudokuGame.module.css'

export const SudokuGame: React.FC = () => {
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.MEDIUM)
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

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`
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
          <div className={styles.stats}>
            <div className={styles.stat}>
              <div>Time</div>
              <span className={styles.statValue}>{formatTime(elapsedTime)}</span>
            </div>
            <div className={styles.stat}>
              <div>Difficulty</div>
              <span className={styles.statValue}>{difficulty.toUpperCase()}</span>
            </div>
          </div>

          {isComplete && (
            <div className={styles.completion}>
              <div className={styles.completionMessage}>🎉 Puzzle Complete!</div>
              <span className={styles.completionTime}>{formatTime(elapsedTime)}</span>
            </div>
          )}

          <div className={styles.difficultyButtons}>
            <Button
              size="sm"
              variant={difficulty === 'easy' ? 'primary' : 'secondary'}
              onClick={() => handleDifficultyChange('easy')}
            >
              Easy
            </Button>
            <Button
              size="sm"
              variant={difficulty === 'medium' ? 'primary' : 'secondary'}
              onClick={() => handleDifficultyChange('medium')}
            >
              Medium
            </Button>
            <Button
              size="sm"
              variant={difficulty === 'hard' ? 'primary' : 'secondary'}
              onClick={() => handleDifficultyChange('hard')}
            >
              Hard
            </Button>
            <Button
              size="sm"
              variant={difficulty === 'expert' ? 'primary' : 'secondary'}
              onClick={() => handleDifficultyChange('expert')}
            >
              Expert
            </Button>
          </div>

          <Button onClick={handleReset} variant="danger" size="lg">
            New Game
          </Button>
        </div>
      </div>
    </Card>
  )
}
