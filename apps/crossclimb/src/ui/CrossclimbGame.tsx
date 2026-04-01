import { useCrossclimbGame, useResponsiveState } from '@/app'
import React from 'react'
import { CrossclimbBoard } from './CrossclimbBoard'
import styles from './CrossclimbGame.module.css'

export const CrossclimbGame: React.FC = () => {
  const responsive = useResponsiveState()
  const {
    gameState,
    moveToNode,
    getHint,
    solveCompletely,
    resetGame,
    isGameComplete,
    currentPath,
    hintPath,
    solutionPath,
  } = useCrossclimbGame()

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
    resetGame()
  }

  return (
    <div className={styles.crossclimbGame}>
      <div className={styles.gameHeader}>
        <h1 className={styles.title}>Crossclimb</h1>
        <div className={styles.gameInfo}>
          <div className={styles.score}>
            <span className={styles.label}>Path Length:</span>
            <span className={styles.value}>{currentPath.length - 1}</span>
          </div>
          <div className={styles.checkpoints}>
            <span className={styles.label}>Checkpoints:</span>
            <span className={styles.value}>
              {currentPath.filter((nodeId) => gameState.graph.nodes[nodeId].isCheckpoint).length} /{' '}
              {Object.values(gameState.graph.nodes).filter((node) => node.isCheckpoint).length}
            </span>
          </div>
          <div className={styles.difficulty}>
            <span className={styles.label}>Difficulty:</span>
            <span className={styles.value}>{gameState.difficulty}</span>
          </div>
        </div>
      </div>

      <div className={styles.gameBoard}>
        <CrossclimbBoard
          graph={gameState.graph}
          currentPath={currentPath}
          hintPath={hintPath}
          solutionPath={solutionPath}
          onNodeClick={handleNodeClick}
        />
      </div>

      <div className={styles.gameControls}>
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
          🎉 Congratulations! You completed the puzzle!
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
