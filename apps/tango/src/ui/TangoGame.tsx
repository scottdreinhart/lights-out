/**
 * Tango Game Component
 * Main Tango slide puzzle interface
 */

import React, { useState } from 'react'
import { useTangoGame } from '../app'
import type { Difficulty, Position } from '../domain'
import { TangoBoard } from './TangoBoard'
import styles from './TangoGame.module.css'

export const TangoGame: React.FC = () => {
  const [difficulty, setDifficulty] = useState<Difficulty>('medium')
  const [showHint, setShowHint] = useState(false)
  const [hintTile, setHintTile] = useState<Position | null>(null)

  const {
    gameState,
    makeTileMove,
    canMove,
    resetGame,
    newPuzzle,
    getHint,
    solvePuzzle,
    solveCompletely,
    gameTime,
    isSolved,
    moveCount,
  } = useTangoGame(difficulty)

  const handleTileClick = (position: Position) => {
    if (canMove(position)) {
      makeTileMove(position)
      setShowHint(false)
      setHintTile(null)
    }
  }

  const handleHint = () => {
    const hint = getHint()
    if (hint) {
      setHintTile(hint)
      setShowHint(true)
      // Auto-hide hint after 3 seconds
      setTimeout(() => {
        setShowHint(false)
        setHintTile(null)
      }, 3000)
    }
  }

  const handleDifficultyChange = (newDifficulty: Difficulty) => {
    setDifficulty(newDifficulty)
    resetGame()
    setShowHint(false)
    setHintTile(null)
  }

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className={styles.game}>
      <header className={styles.header}>
        <h1 className={styles.title}>Tango Slide Puzzle</h1>
        <p className={styles.subtitle}>
          Slide the tiles to arrange them in numerical order
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
            <option value="easy">Easy (3×3)</option>
            <option value="medium">Medium (4×4)</option>
            <option value="hard">Hard (5×5)</option>
            <option value="expert">Expert (6×6)</option>
          </select>
        </div>
      </div>

      <div className={`${styles.status} ${isSolved ? styles.success : styles.info}`}>
        {isSolved
          ? `🎉 Solved in ${formatTime(gameTime)} with ${moveCount} moves!`
          : 'Slide tiles to arrange them in order (1, 2, 3, ..., empty space)'
        }
      </div>

      <div className={styles.stats}>
        <div className={styles.stat}>
          <div className={styles.statLabel}>Moves</div>
          <div className={styles.statValue}>{moveCount}</div>
        </div>
        <div className={styles.stat}>
          <div className={styles.statLabel}>Time</div>
          <div className={styles.statValue}>{formatTime(gameTime)}</div>
        </div>
        <div className={styles.stat}>
          <div className={styles.statLabel}>Size</div>
          <div className={styles.statValue}>{gameState.size}×{gameState.size}</div>
        </div>
      </div>

      <TangoBoard
        board={gameState.board}
        onTileClick={handleTileClick}
        highlightedTile={showHint ? hintTile : null}
        size={gameState.size}
      />

      <div className={styles.controls}>
        <button className={`${styles.button} ${styles.secondary}`} onClick={resetGame}>
          Reset
        </button>
        <button className={`${styles.button} ${styles.primary}`} onClick={newPuzzle}>
          New Puzzle
        </button>
        <button className={`${styles.button} ${styles.secondary}`} onClick={handleHint}>
          Hint
        </button>
        <button className={`${styles.button} ${styles.secondary}`} onClick={solvePuzzle}>
          Auto Move
        </button>
        <button className={`${styles.button} ${styles.danger}`} onClick={solveCompletely}>
          Solve All
        </button>
      </div>

      <div className={styles.instructions}>
        <h3>How to Play:</h3>
        <ul>
          <li>Click on a tile adjacent to the empty space to slide it</li>
          <li>Arrange tiles in numerical order from 1 to {gameState.size * gameState.size - 1}</li>
          <li>The empty space should be in the bottom-right corner</li>
          <li>Use hints if you get stuck</li>
          <li>Auto Move makes one optimal move, Solve All completes the puzzle</li>
        </ul>
      </div>
    </div>
  )
}