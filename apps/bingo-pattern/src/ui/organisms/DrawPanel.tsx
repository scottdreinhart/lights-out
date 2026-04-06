import React from 'react'
import styles from './DrawPanel.module.css'

interface Props {
  currentNumber: number | null
  drawnCount: number
  patterns: string[]
  gameActive: boolean
  onDraw: () => void
  onReset: () => void
}

export const DrawPanel: React.FC<Props> = ({
  currentNumber,
  drawnCount,
  patterns,
  gameActive,
  onDraw,
  onReset,
}) => {
  return (
    <div className={styles.container}>
      <div className={styles.drawBox}>
        <div className={`${styles.number} ${currentNumber === null ? styles.empty : styles.drawn}`}>
          {currentNumber === null ? '?' : currentNumber}
        </div>
      </div>

      <div className={styles.stats}>
        <div className={styles.statItem}>
          <span className={styles.label}>Drawn</span>
          <span className={styles.value}>{drawnCount}</span>
        </div>

        {patterns.length > 0 && (
          <div className={styles.statItem}>
            <span className={styles.label}>Pattern Win!</span>
            <span className={styles.value}>{patterns[0]}</span>
          </div>
        )}
      </div>

      <div className={styles.controls}>
        <button
          onClick={onDraw}
          disabled={!gameActive}
          className={`${styles.button} ${styles.draw}`}
          aria-label="Draw number"
        >
          Draw
        </button>
        <button
          onClick={onReset}
          className={`${styles.button} ${styles.reset}`}
          aria-label="Reset game"
        >
          Reset
        </button>
      </div>
    </div>
  )
}
