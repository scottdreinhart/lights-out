/**
 * Zip Game Component
 * Main Zip maze navigation interface
 */

import React, { useState } from 'react'
import { useZipGame } from '../app'
import type { Difficulty, Direction } from '../domain'
import { ZipBoard } from './ZipBoard'
import styles from './ZipGame.module.css'

export const ZipGame: React.FC = () => {
  const [difficulty, setDifficulty] = useState<Difficulty>('medium')
  const [showHint, setShowHint] = useState(false)
  const [hintPosition, setHintPosition] = useState<Position | null>(null)

  const {
    gameState,
    gameTime,
    moveCount,
    makePlayerMove,
    canMove,
    newPuzzle,
    resetCurrentGame,
    getHint,
    solveCompletely,
    changeDifficulty,
  } = useZipGame(difficulty)

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (gameState.isComplete) return

    let direction: Direction | null = null

    switch (e.key) {
      case 'ArrowUp':
      case 'w':
      case 'W':
        direction = 'up'
        break
      case 'ArrowDown':
      case 's':
      case 'S':
        direction = 'down'
        break
      case 'ArrowLeft':
      case 'a':
      case 'A':
        direction = 'left'
        break
      case 'ArrowRight':
      case 'd':
      case 'D':
        direction = 'right'
        break
    }

    if (direction && canMove(direction)) {
      e.preventDefault()
      makePlayerMove(direction)
      setShowHint(false)
      setHintPosition(null)
    }
  }

  const handleHint = () => {
    const hint = getHint()
    if (hint) {
      setHintPosition(hint)
      setShowHint(true)
      // Auto-hide hint after 3 seconds
      setTimeout(() => {
        setShowHint(false)
        setHintPosition(null)
      }, 3000)
    }
  }

  const handleDifficultyChange = (newDifficulty: Difficulty) => {
    setDifficulty(newDifficulty)
    changeDifficulty(newDifficulty)
    setShowHint(false)
    setHintPosition(null)
  }

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const collectedItems = gameState.collectedItems.length
  const totalItems = gameState.items.length
  const progressPercent = totalItems > 0 ? (collectedItems / totalItems) * 100 : 100

  return (
    <div className={styles.game} onKeyDown={handleKeyDown} tabIndex={0}>
      <header className={styles.header}>
        <h1 className={styles.title}>Zip Maze Navigation</h1>
        <p className={styles.subtitle}>
          Navigate through the maze, collect all items, and reach the goal!
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
            <option value="easy">Easy (8×6)</option>
            <option value="medium">Medium (12×8)</option>
            <option value="hard">Hard (16×10)</option>
            <option value="expert">Expert (20×12)</option>
          </select>
        </div>
      </div>

      <div className={`${styles.status} ${gameState.isComplete ? styles.success : styles.info}`}>
        {gameState.isComplete
          ? `🎉 Maze Complete! Collected ${collectedItems}/${totalItems} items in ${formatTime(gameTime)} with ${moveCount} moves!`
          : `Collect ${totalItems - collectedItems} more items and reach the goal`
        }
      </div>

      <div className={styles.progress}>
        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <span className={styles.progressText}>
          Items: {collectedItems}/{totalItems}
        </span>
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
          <div className={styles.statValue}>{gameState.maze[0].length}×{gameState.maze.length}</div>
        </div>
      </div>

      <ZipBoard
        maze={gameState.maze}
        playerPosition={gameState.playerPosition}
        highlightedPosition={showHint ? hintPosition : null}
      />

      <div className={styles.controls}>
        <button className={`${styles.button} ${styles.secondary}`} onClick={resetCurrentGame}>
          Reset
        </button>
        <button className={`${styles.button} ${styles.primary}`} onClick={newPuzzle}>
          New Maze
        </button>
        <button className={`${styles.button} ${styles.secondary}`} onClick={handleHint}>
          Hint
        </button>
        <button className={`${styles.button} ${styles.danger}`} onClick={solveCompletely}>
          Solve All
        </button>
      </div>

      <div className={styles.instructions}>
        <h3>How to Play:</h3>
        <ul>
          <li>Use arrow keys or WASD to move through the maze</li>
          <li>Navigate to collect all golden items (★)</li>
          <li>Reach the red goal (G) after collecting all items</li>
          <li>Avoid hitting walls - you can only move through open paths</li>
          <li>Use hints to see the next optimal move</li>
          <li>Solve All will complete the maze automatically</li>
        </ul>
      </div>
    </div>
  )
}