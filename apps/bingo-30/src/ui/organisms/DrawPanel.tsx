/**
 * Draw Panel Component for Mini Bingo
 * Shows drawn numbers and draw controls
 */

import styles from './DrawPanel.module.css'

interface DrawPanelProps {
  currentNumber: number | null
  numbersDrawn: number
  totalNumbers: number
  onDraw: () => void
  onReset: () => void
  disabled?: boolean
  winners: number[]
}

export function DrawPanel({
  currentNumber,
  numbersDrawn,
  totalNumbers,
  onDraw,
  onReset,
  disabled = false,
  winners,
}: DrawPanelProps) {
  const winnerText = winners.length > 0 ? `Winner: Card ${winners[0] + 1}!` : ''

  return (
    <div className={styles.drawPanel}>
      <div className={styles.numberDisplay}>
        {currentNumber !== null ? (
          <>
            <div className={styles.label}>Current Number</div>
            <div className={styles.number}>{currentNumber}</div>
          </>
        ) : (
          <>
            <div className={styles.label}>Ready to Draw</div>
            <div className={styles.number}>--</div>
          </>
        )}
      </div>

      <div className={styles.stats}>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Drawn:</span>
          <span className={styles.statValue}>{numbersDrawn}</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Total:</span>
          <span className={styles.statValue}>{totalNumbers}</span>
        </div>
      </div>

      {winnerText && <div className={styles.winner}>{winnerText}</div>}

      <button onClick={onDraw} disabled={disabled} className={styles.drawButton}>
        Draw Number
      </button>
      <button onClick={onReset} className={styles.resetButton}>
        Reset
      </button>
    </div>
  )
}
