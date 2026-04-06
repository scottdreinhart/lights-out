import type React from 'react'
import styles from './BoardSquare.module.css'

/**
 * Props for a single square on the n-queens board
 */
interface BoardSquareProps {
  /** Row index (0-based) */
  row: number
  /** Column index (0-based) */
  col: number
  /** Whether this square has a queen placed on it */
  hasQueen: boolean
  /** Whether this square is currently selected (keyboard navigation) */
  selected?: boolean
  /** Whether this square is highlighted (hint, conflict, etc.) */
  highlighted?: boolean
  /** Whether this square is disabled */
  disabled?: boolean
  /** Callback when square is clicked */
  onClick?: () => void
}

/**
 * BoardSquare — Single square on an n-queens board
 *
 * Renders a button-style square that can display a queen and respond to:
 * - Click events
 * - Keyboard navigation (selected state)
 * - Hint highlighting
 * - Conflict Display
 *
 * Accessibility:
 * - Semantic button element
 * - aria-label for screen readers
 * - Focus visible for keyboard navigation
 * - Disabled state when not usable
 */
export const BoardSquare: React.FC<BoardSquareProps> = ({
  row,
  col,
  hasQueen,
  selected = false,
  highlighted = false,
  disabled = false,
  onClick,
}) => {
  const classes: string[] = [styles.square]

  if (hasQueen) {
    classes.push(styles.queen)
  }

  if (selected && !disabled) {
    classes.push(styles.selected)
  }

  if (highlighted && !disabled) {
    classes.push(styles.hint)
  }

  if (disabled) {
    classes.push(styles.disabled)
  }

  return (
    <button
      type="button"
      className={classes.join(' ')}
      onClick={onClick}
      disabled={disabled}
      aria-label={`queens-square-${row}-${col}${hasQueen ? '-has-queen' : ''}`}
      aria-pressed={hasQueen}
    />
  )
}
