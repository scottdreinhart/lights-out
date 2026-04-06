import { useCallback } from 'react'
import styles from './DrawPanel.module.css'

export interface DrawPanelProps {
  card?: any
  drawnNumbers: number[]
  gameState: 'playing' | 'won' | 'idle'
  onDraw: () => void
  onReset: () => void
  onNewGame?: () => void
  canDraw?: boolean
  remainingCount?: number
  totalCount?: number
  currentNumber?: number | null
  disabled?: boolean
}

/**
 * Generic DrawPanel component for bingo game number drawing.
 * Displays current and drawn numbers with game progress.
 */
export const DrawPanel: React.FC<DrawPanelProps> = ({
  drawnNumbers,
  gameState,
  onDraw,
  onReset,
  onNewGame,
  canDraw = true,
  remainingCount = 0,
  totalCount = 75,
  currentNumber = null,
  disabled = false,
}) => {
  const getColumnLetter = (number: number): string => {
    if (number <= 15) return 'B'
    if (number <= 30) return 'I'
    if (number <= 45) return 'N'
    if (number <= 60) return 'G'
    return 'O'
  }

  const handleDraw = useCallback(() => {
    if (!canDraw || disabled) return
    onDraw()
  }, [canDraw, disabled, onDraw])

  const handleNewGame = useCallback(() => {
    if (onNewGame) {
      onNewGame()
    } else {
      onReset()
    }
  }, [onNewGame, onReset])

  const progressPercent =
    totalCount > 0 ? Math.round(((totalCount - (remainingCount || 0)) / totalCount) * 100) : 0
  const nextNumber = drawnNumbers.length > 0 ? drawnNumbers[drawnNumbers.length - 1] : null

  return (
    <div className={`${styles.root} ${disabled ? styles.disabled : ''}`}>
      <div className={styles.content}>
        {/* Current Number Display */}
        <div className={styles.numberDisplay}>
          {currentNumber !== null ? (
            <>
              <div className={styles.column}>
                {getColumnLetter(currentNumber)}
              </div>
              <div className={styles.number}>
                <div className={styles.value}>{currentNumber}</div>
              </div>
            </>
          ) : (
            <div className={styles.empty}>-</div>
          )}
        </div>

        {/* Stats */}
        <div className={styles.stats}>
          <div className={styles.stat}>
            <div className={styles.statLabel}>Drawn</div>
            <div className={styles.statValue}>{drawnNumbers.length}</div>
          </div>
          <div className={styles.stat}>
            <div className={styles.statLabel}>Remaining</div>
            <div className={styles.statValue}>{remainingCount || 0}</div>
          </div>
          <div className={styles.stat}>
            <div className={styles.statLabel}>Total</div>
            <div className={styles.statValue}>{totalCount}</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className={styles.progressContainer}>
          <div className={styles.progressLabel}>Progress: {progressPercent}%</div>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: `${progressPercent}%` }} />
          </div>
        </div>

        {/* Controls */}
        <div className={styles.controls}>
          <button
            type="button"
            className={styles.drawButton}
            onClick={handleDraw}
            disabled={!canDraw || disabled}
            aria-label="Draw next number"
          >
            {gameState === 'won' ? 'Game Over' : 'Draw Number'}
          </button>
          <button
            type="button"
            className={styles.resetButton}
            onClick={handleNewGame}
            aria-label="Start new game"
          >
            New Game
          </button>
        </div>

        {/* Game State Message */}
        {gameState === 'won' && (
          <div className={styles.gameOverMessage}>
            <p>🎉 Game Over! All numbers drawn.</p>
          </div>
        )}
      </div>
    </div>
  )
}
