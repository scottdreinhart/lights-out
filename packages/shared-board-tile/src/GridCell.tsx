import { memo } from 'react'
import type React from 'react'
import styles from './GridCell.module.css'

/**
 * Props for a shared grid cell component
 *
 * Supports:
 * - Board games: Battleship, Checkers, Queens, etc.
 * - Puzzle games: Sudoku, Magic Square, etc.
 * - Any grid-based game with tiles/cells
 */
export interface GridCellProps {
  /** Row index (0-based) */
  readonly row: number
  /** Column index (0-based) */
  readonly col: number

  /**
   * Content to display in the cell
   *
   * Can be:
   * - A number (for Sudoku, Bingo, Magic Square)
   * - A React component (for pieces, icons)
   * - A string (for symbols, text)
   * - null/undefined (for empty cells)
   *
   * @example
   * content={number}  // Displays: 5
   * content={<PieceIcon />}  // Displays: component
   * content="♛"  // Displays: queen symbol
   */
  readonly content?: React.ReactNode

  /**
   * Whether this cell is selected via keyboard navigation
   *
   * When true, applies `.selected` CSS class:
   * - Cyan outline + glow
   * - Shows current keyboard focus position
   */
  readonly selected?: boolean

  /**
   * Whether this cell is highlighted (hint, suggestion, conflict)
   *
   * When true, applies `.hint` CSS class:
   * - Gold box-shadow + glow
   * - Shows suggested moves, valid placements, conflicts
   */
  readonly highlighted?: boolean

  /**
   * Whether this cell is disabled (cannot interact)
   *
   * When true:
   * - onClick is ignored
   * - CSS opacity reduces to 0.6
   * - Cursor changes to default
   */
  readonly disabled?: boolean

  /**
   * Game-specific state class (optional)
   *
   * Applied as additional CSS class for game-specific styling
   *
   * @example
   * stateClass="with-ship"  // Applies .cellWithShip
   * stateClass="marked"  // Applies .cellMarked
   * stateClass="has-queen"  // Applies .cellHasQueen
   */
  readonly stateClass?: string

  /**
   * Click handler
   *
   * Called when cell is clicked (unless disabled)
   */
  readonly onClick?: () => void

  /**
   * Accessibility label for screen readers
   *
   * If not provided, generates as: `cell-${row}-${col}`
   */
  readonly ariaLabel?: string

  /**
   * Accessibility pressed state
   *
   * Use for toggle-like behaviors (cell is "selected" in interaction terms)
   */
  readonly ariaPressed?: boolean

  /**
   * Whether cell interaction is touch-optimized
   *
   * Applied as CSS class for touch-aware layouts
   */
  readonly touchOptimized?: boolean

  /**
   * Additional CSS classes (for game-specific styling)
   *
   * Space-separated class names
   */
  readonly className?: string
}

/**
 * GridCell — Shared grid cell component for all board-based games
 *
 * Provides:
 * - Standard 52×52px grid cell with theme styling
 * - Keyboard selection with cyan outline
 * - Hint highlighting with gold glow
 * - Touch-optimized hover handling
 * - Accessibility attributes
 * - Support for any content type (numbers, pieces, icons, etc.)
 *
 * Used by:
 * - Battleship (ships, hit/miss markers)
 * - Checkers (game pieces)
 * - Bingo (numbers, marked squares)
 * - Queens (queen pieces)
 * - Sudoku (numbers, candidates)
 * - Magic Square (numbers)
 * - Other grid-based games
 *
 * @example
 * ```tsx
 * // Battleship cell
 * <GridCell row={0} col={0} content={ship ? "🚢" : ""} onClick={() => fire(0, 0)} />
 *
 * // Bingo cell
 * <GridCell row={2} col={3} content={42} highlighted={isWinner} marked={isCalled} />
 *
 * // Queens cell
 * <GridCell row={1} col={5} content={hasQueen ? "♛" : null} selected={isSelected} />
 *
 * // Sudoku cell
 * <GridCell row={0} col={0} content={9} highlighted={isConflict} />
 * ```
 */
function GridCellComponent({
  row,
  col,
  content,
  selected = false,
  highlighted = false,
  disabled = false,
  stateClass,
  onClick,
  ariaLabel,
  ariaPressed,
  touchOptimized,
  className,
}: GridCellProps) {
  // Build class list from conditional states
  const classes: string[] = [styles.cell]

  if (selected && !disabled) {
    classes.push(styles.selected)
  }

  if (highlighted && !disabled) {
    classes.push(styles.hint)
  }

  if (disabled) {
    classes.push(styles.disabled)
  }

  if (touchOptimized) {
    classes.push(styles.touchOptimized)
  }

  // Apply game-specific state class (e.g., "with-ship", "marked", "has-queen")
  if (stateClass) {
    classes.push(styles[stateClass] || stateClass)
  }

  // Apply additional custom classes
  if (className) {
    classes.push(className)
  }

  // Generate default aria-label if not provided
  const label = ariaLabel || `cell-${row}-${col}`

  return (
    <button
      type="button"
      className={classes.join(' ')}
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      aria-pressed={ariaPressed}
      data-row={row}
      data-col={col}
    >
      {content}
    </button>
  )
}

export const GridCell = memo(GridCellComponent)
