/**
 * Queens Game Component
 * Main N-Queens puzzle interface
 */

import { ActionBar, Button, StatPill, StatsBar } from '@games/assets-shared'
import React, { useState } from 'react'
import { useQueensGame } from '../app'
import type { Difficulty } from '../domain'
import { QueensBoard } from './QueensBoard'
import styles from './QueensGame.module.css'

export const QueensGame: React.FC = () => {
  const [difficulty, setDifficulty] = useState<Difficulty>('hard')
  const {
    gameState,
    makeMove,
    removeQueenAt,
    resetGame,
    generateNewPuzzle,
    solvePuzzle,
    getHint,
    conflicts,
  } = useQueensGame(difficulty)

  const handleCellClick = (row: number, col: number) => {
    const currentQueen = gameState.board[row]

    if (currentQueen === col) {
      // Remove queen
      removeQueenAt(row)
    } else if (currentQueen === -1) {
      // Place queen
      makeMove(row, col)
    }
    // If there's already a queen in this row but different column, do nothing
  }

  const handleDifficultyChange = (newDifficulty: Difficulty) => {
    setDifficulty(newDifficulty)
    resetGame()
  }

  const handleHint = () => {
    const hint = getHint()
    if (hint) {
      // Could highlight the suggested cell
      console.log('Hint:', hint)
    }
  }

  const getStatusClass = () => {
    if (gameState.isSolved) {return styles.success}
    if (gameState.isComplete) {return styles.error}
    return styles.info
  }

  return (
    <div className={styles.game}>
      <header className={styles.header}>
        <h1 className={styles.title}>N-Queens Puzzle</h1>
        <p className={styles.subtitle}>
          Place {gameState.size} queens on the board so no queen attacks another
        </p>
      </header>

      <div className={styles.controls}>
        <div className={styles.controlGroup}>
          <label className={styles.label} htmlFor="difficulty-select">
            Difficulty:
          </label>
          <select
            id="difficulty-select"
            className={styles.select}
            value={difficulty}
            onChange={(e) => handleDifficultyChange(e.target.value as Difficulty)}
          >
            <option value="easy">Easy (4×4)</option>
            <option value="medium">Medium (6×6)</option>
            <option value="hard">Hard (8×8)</option>
            <option value="expert">Expert (10×10)</option>
          </select>
        </div>
      </div>

      <div className={`${styles.status} ${getStatusClass()}`}>
        {gameState.isSolved
          ? '✅ Solved! Well done!'
          : gameState.isComplete
            ? '❌ Invalid solution - queens are attacking each other'
            : 'In Progress - place your queens'}
      </div>

      <StatsBar className={styles.stats}>
        <StatPill label="Moves" value={gameState.moveCount} />
        <StatPill label="Mistakes" value={gameState.mistakes} />
        <StatPill label="Hints" value={gameState.hintCount} />
        <StatPill label="Conflicts" value={conflicts} />
      </StatsBar>

      <QueensBoard
        board={gameState.board}
        onCellClick={handleCellClick}
        size={gameState.size}
        conflicts={conflicts}
      />

      <ActionBar className={styles.controls}>
        <Button
          className={`${styles.button} ${styles.secondary}`}
          variant="secondary"
          onClick={resetGame}
        >
          Reset
        </Button>
        <Button
          className={`${styles.button} ${styles.primary}`}
          variant="primary"
          onClick={() => generateNewPuzzle('medium')}
        >
          New Puzzle
        </Button>
        <Button
          className={`${styles.button} ${styles.secondary}`}
          variant="secondary"
          onClick={solvePuzzle}
        >
          Solve
        </Button>
        <Button
          className={`${styles.button} ${styles.secondary}`}
          variant="secondary"
          onClick={handleHint}
        >
          Hint
        </Button>
      </ActionBar>

      <div className={styles.instructions}>
        <h3>How to Play:</h3>
        <ul>
          <li>Click on a square to place a queen in that row</li>
          <li>Queens cannot attack each other (same row, column, or diagonal)</li>
          <li>Place one queen per row</li>
          <li>Click on a queen to remove it</li>
          <li>Use hints if you get stuck</li>
        </ul>
      </div>
    </div>
  )
}
