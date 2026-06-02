import { useCrossclimbGame } from '@/app'
import type { Difficulty } from '@/domain'
import React from 'react'
import { CrossclimbBoard } from './CrossclimbBoard'
import styles from './CrossclimbGame.module.css'

export const CrossclimbGame: React.FC = () => {
  const [difficulty, setDifficulty] = React.useState<Difficulty>('easy')
  const {
    gameState,
    moveToNode,
    getHint,
    solveCompletely,
    resetCurrentGame,
    changeDifficulty,
    gameTime,
    hintNode,
    canMoveToNode,
  } = useCrossclimbGame(difficulty)
  const isGameComplete = gameState.isComplete
  const currentPath = gameState.currentPath

  const handleNodeClick = (nodeId: string) => {
    if (!isGameComplete) {
      moveToNode(nodeId)
    }
  }

  const handleHint = () => {
    getHint()
  }

  const handleSolve = () => {
    solveCompletely()
  }

  const handleReset = () => {
    resetCurrentGame()
  }

  const checkpointCount = gameState.graph.checkpoints.length
  const collectedCheckpointCount = gameState.graph.checkpoints.filter((nodeId) =>
    gameState.collectedCheckpoints.has(nodeId),
  ).length

  const handleDifficultyChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const nextDifficulty = event.target.value as Difficulty
    setDifficulty(nextDifficulty)
    changeDifficulty(nextDifficulty)
  }

  return (
    <div className={styles.crossclimbGame}>
      <div className={styles.gameHeader}>
        <h1 className={styles.title}>Crossclimb</h1>
        <div className={styles.gameInfo}>
          <div className={styles.score}>
            <span className={styles.label}>Moves:</span>
            <span className={styles.value}>{gameState.moves}</span>
          </div>
          <div className={styles.checkpoints}>
            <span className={styles.label}>Checkpoints:</span>
            <span className={styles.value}>
              {collectedCheckpointCount} / {checkpointCount}
            </span>
          </div>
          <div className={styles.difficulty}>
            <span className={styles.label}>Time:</span>
            <span className={styles.value}>{gameTime}s</span>
          </div>
        </div>
      </div>

      <div className={styles.gameBoard}>
        <CrossclimbBoard
          graph={gameState.graph}
          currentPath={currentPath}
          hintNode={hintNode}
          onNodeClick={handleNodeClick}
          canMoveToNode={canMoveToNode}
        />
      </div>

      <div className={styles.gameControls}>
        <label className={styles.label} htmlFor="difficulty-select">
          Difficulty
        </label>
        <select
          id="difficulty-select"
          className={styles.controlButton}
          value={difficulty}
          onChange={handleDifficultyChange}
          aria-label="Select puzzle difficulty"
        >
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
          <option value="expert">Expert</option>
        </select>
        <button
          className={styles.controlButton}
          onClick={handleHint}
          disabled={isGameComplete}
          aria-label="Get hint for next move"
        >
          Hint
        </button>
        <button
          className={styles.controlButton}
          onClick={handleSolve}
          disabled={isGameComplete}
          aria-label="Solve the entire puzzle"
        >
          Solve
        </button>
        <button className={styles.controlButton} onClick={handleReset} aria-label="Reset the game">
          Reset
        </button>
      </div>

      {isGameComplete && (
        <div className={styles.completionMessage} role="status" aria-live="polite">
          Puzzle solved! You reached the end and collected all checkpoints.
        </div>
      )}

      <div className={styles.instructions}>
        <p>
          Click nodes to build a path from start to finish. Collect all checkpoints along the way.
          Use hints to see the next optimal move, or solve to see the complete solution.
        </p>
      </div>
    </div>
  )
}
