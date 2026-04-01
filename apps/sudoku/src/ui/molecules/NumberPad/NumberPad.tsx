import { Button } from '@/ui/atoms'
import React from 'react'
import styles from './NumberPad.module.css'

export interface NumberPadProps {
  digits: number[]
  selectedDigit: number | undefined
  onDigitSelect: (digit: number) => void
  onClear: () => void
  onUndo?: () => void
  onHint?: () => void
  canUndo?: boolean
  canHint?: boolean
}

/**
 * NumberPad molecule — grid of number buttons with action buttons
 * Formatted as square grid based on digits length (e.g., 3x3 for 9 digits, 2x2 for 4 digits)
 * All buttons are square, 58px × 58px for optimal touch targets on mobile/tablet.
 */
export const NumberPad: React.FC<NumberPadProps> = ({
  digits,
  selectedDigit,
  onDigitSelect,
  onClear,
  onUndo,
  onHint,
  canUndo = false,
  canHint = false,
}) => {
  const gridSize = Math.ceil(Math.sqrt(digits.length))

  return (
    <div className={styles.numberPad}>
      {/* Numbers Grid */}
      <div
        className={styles.numberGrid}
        style={{ gridTemplateColumns: `repeat(${gridSize}, 58px)` }}
      >
        {digits.map((digit) => (
          <Button
            key={digit}
            className={styles.numberButton}
            size="square"
            variant={selectedDigit === digit ? 'primary' : 'secondary'}
            onClick={() => onDigitSelect(digit)}
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
