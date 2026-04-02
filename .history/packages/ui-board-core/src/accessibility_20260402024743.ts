import type { Position } from './BoardGrid'

/**
 * Accessibility helpers for board games
 * Provides standard descriptions and aria-labels for board positions
 */

/**
 * Convert board position to human-readable notation
 * Supports algebraic notation (a1) and row/col notation (row 0, col 0)
 *
 * @example
 * positionToText({ row: 0, col: 0 }) -> "row 1, column 1" (1-indexed)
 * positionToAlgebraic({ row: 0, col: 0 }) -> "a1" (standard chess notation)
 */
export function positionToText(position: Position, oneIndexed = true): string {
  const row = oneIndexed ? position.row + 1 : position.row
  const col = oneIndexed ? position.col + 1 : position.col
  return `row ${row}, column ${col}`
}

export function positionToAlgebraic(position: Position): string {
  const col = String.fromCharCode('a'.charCodeAt(0) + position.col)
  const row = 8 - position.row // Inverted for chess notation
  return `${col}${row}`
}

/**
 * Describe a square's color (dark/light) based on position
 * Useful for checkers, chess, etc.
 */
export function describeSquareColor(position: Position): string {
  const isDark = (position.row + position.col) % 2 === 0
  return isDark ? 'dark' : 'light'
}

/**
 * Build an aria-label for a board position with context
 * Combines position, color, content, and state
 */
export interface DescribePositionOptions {
  position: Position
  content?: string // e.g., "red checker", "white pawn", "number 5"
  hasContent?: boolean
  state?: {
    selected?: boolean
    focused?: boolean
    target?: boolean
    disabled?: boolean
    locked?: boolean
    hint?: boolean
  }
  squareColor?: boolean // Include dark/light description
  useAlgebraic?: boolean // Use chess notation instead of row/col
  gameContext?: string // e.g., "checkers board", "sudoku puzzle"
}

/**
 * Generate a complete accessibility description for a board cell
 *
 * @example
 * describePosition({
 *   position: { row: 2, col: 3 },
 *   content: 'red checker, king',
 *   state: { selected: true },
 *   squareColor: true,
 * })
 * // -> "dark square row 3, column 4: red checker, king, selected"
 *
 * @example
 * describePosition({
 *   position: { row: 0, col: 0 },
 *   content: '5',
 *   state: { locked: true },
 *   useAlgebraic: true,
 *   gameContext: 'sudoku, hard difficulty'
 * })
 * // -> "a8 (sudoku, hard difficulty): 5, locked"
 */
export function describePosition({
  position,
  content,
  hasContent = !!content,
  state = {},
  squareColor = true,
  useAlgebraic = false,
  gameContext,
}: DescribePositionOptions): string {
  const parts: string[] = []

  // Position
  if (useAlgebraic) {
    parts.push(positionToAlgebraic(position))
  } else {
    parts.push(positionToText(position))
  }

  // Square color
  if (squareColor) {
    parts.push(describeSquareColor(position))
  }

  // Game context
  if (gameContext) {
    parts.push(`(${gameContext})`)
  }

  // Content
  if (hasContent && content) {
    parts.push(content)
  } else if (hasContent && !content) {
    parts.push('empty')
  }

  // State
  const stateDescriptions: string[] = []
  if (state.selected) stateDescriptions.push('selected')
  if (state.focused) stateDescriptions.push('keyboard focus')
  if (state.target) stateDescriptions.push('legal target')
  if (state.disabled) stateDescriptions.push('disabled')
  if (state.locked) stateDescriptions.push('locked')
  if (state.hint) stateDescriptions.push('hint')

  if (stateDescriptions.length > 0) {
    parts.push(stateDescriptions.join(', '))
  }

  return parts.join(', ')
}

/**
 * Build a brief navigation help string for keyboard users
 */
export function getKeyboardHelpText(
  gameContext: string = 'board game',
): string {
  return `Keyboard navigation: arrow keys or WASD to move, space or enter to select, escape or Q to cancel. ${gameContext}.`
}

/**
 * Accessibility enhancement: Announce position on navigation
 * Can be used with aria-live regions to announce keyboard movement
 *
 * @example
 * <div role="status" aria-live="polite" aria-atomic="true">
 *   {describePosition({ position: keyboardFocus, ... })}
 * </div>
 */
export function announcePositionChange(
  from: Position | null,
  to: Position,
  context = 'Moved to',
): string {
  return `${context} ${positionToText(to)}`
}

/**
 * Standard roles for board elements
 */
export const A11Y_ROLES = {
  BOARD: 'grid',
  CELL: 'gridcell',
  INTERACTIVE_CELL: 'button',
  STATUS: 'status',
  REGION: 'region',
} as const

/**
 * ARIA attributes helpers
 */
export function buildGridAriaAttributes(rows: number, cols: number) {
  return {
    role: A11Y_ROLES.BOARD,
    'aria-rowcount': rows,
    'aria-colcount': cols,
    'aria-label': `${rows} by ${cols} game board`,
  }
}

/**
 * Check if two positions are equal (utility for comparisons)
 */
export function positionsEqual(a: Position | null, b: Position | null): boolean {
  if (!a || !b) return false
  return a.row === b.row && a.col === b.col
}
