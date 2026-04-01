import { Button } from '@/ui/atoms'
import React from 'react'
import styles from './NumberPad.module.css'

export interface NumberPadProps {
  selectedDigit: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | undefined
  onDigitSelect: (digit: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9) => void
  onClear: () => void
  onUndo?: () => void
  onHint?: () => void
  canUndo?: boolean
  canHint?: boolean
}

/**
 * NumberPad molecule — 3x3 grid of number buttons (1-9) with action buttons
 * Formatted as:
 *   1 2 3
 *   4 5 6
 *   7 8 9
 *   [Clear] [Undo] [Hint]
 *
 * All buttons are square, 58px × 58px for optimal touch targets on mobile/tablet.
 */
export const NumberPad: React.FC<NumberPadProps> = ({
  selectedDigit,
  onDigitSelect,
  onClear,
  onUndo,
  onHint,
  canUndo = false,
  canHint = false,
}) => {
  return (
    <div className={styles.numberPad}>
      {/* Numbers Grid: 3x3 */}
      <div className={styles.numberGrid}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => (
          <Button
            key={digit}
            className={styles.numberButton}
            size="square"
            variant={selectedDigit === digit ? 'primary' : 'secondary'}
            onClick={() => onDigitSelect(digit as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9)}
            title={`Select digit ${digit}`}
            aria-label={`Digit ${digit}`}
            aria-pressed={selectedDigit === digit}
          >
            {digit}
          </Button>
        ))}
      </div>

      {/* Action Buttons: Clear, Undo, Hint */}
      <div className={styles.actionButtons}>
        <Button
          className={styles.actionButton}
          size="square"
          variant="secondary"
          onClick={onClear}
          title="Clear selected cell"
          aria-label="Clear"
        >
          Clear
        </Button>
        {onUndo && (
          <Button
            className={styles.actionButton}
            size="square"
            variant={canUndo ? 'secondary' : 'disabled'}
            onClick={onUndo}
            disabled={!canUndo}
            title={canUndo ? 'Undo last move' : 'No moves to undo'}
            aria-label="Undo"
          >
            Undo
          </Button>
        )}
        {onHint && (
          <Button
            className={styles.actionButton}
            size="square"
            variant={canHint ? 'secondary' : 'disabled'}
            onClick={onHint}
            disabled={!canHint}
            title={canHint ? 'Get a hint' : 'No hints available'}
            aria-label="Hint"
          >
            Hint
          </Button>
        )}
      </div>
    </div>
  )
}

export default NumberPad
