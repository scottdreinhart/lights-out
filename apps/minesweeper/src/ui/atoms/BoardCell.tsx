import type { Cell, CellState } from '@/domain'
import styles from './BoardCell.module.css'

/**
 * Map cell game state to CSS module classes
 * 
 * Each cell state has a corresponding visual appearance
 */
const cellStateStyles: Record<CellState, string> = {
  hidden: styles.hidden,
  flagged: styles.flagged,
  revealed: styles.empty, // Will be overridden for numbered/mine cells
}

/**
 * Map cell content to CSS module number classes
 * 
 * Uses standard minesweeper color coding for numbers 1-8
 */
const numberStyles: Record<number, string> = {
  1: styles.n1,
  2: styles.n2,
  3: styles.n3,
  4: styles.n4,
  5: styles.n5,
  6: styles.n6,
  7: styles.n7,
  8: styles.n8,
}

/**
 * Generate appropriate content display for cell state
 */
function cellContent(cell: Pick<Cell, 'mine' | 'adjacentMines' | 'state'>): string {
  if (cell.state === 'flagged') {
    return '🚩'
  }

  if (cell.state === 'hidden') {
    return ''
  }

  if (cell.mine) {
    return '💣'
  }

  return cell.adjacentMines === 0 ? '' : String(cell.adjacentMines)
}

interface BoardCellProps {
  cell: Cell
  highlighted: boolean
  selected: boolean
  disabled: boolean
  cornerType?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | null
  onReveal: (row: number, col: number) => void
  onToggleFlag: (event: React.MouseEvent<HTMLButtonElement>, row: number, col: number) => void
  onChord: (event: React.MouseEvent<HTMLButtonElement>, row: number, col: number) => void
}

export function BoardCell({
  cell,
  highlighted,
  selected,
  disabled,
  cornerType,
  onReveal,
  onToggleFlag,
  onChord,
}: BoardCellProps) {
  // Build class list from component state
  const classes: string[] = [styles.cell]

  // Add state-specific styling
  classes.push(cellStateStyles[cell.state])

  // Add number color coding for revealed numbered cells
  if (cell.state === 'revealed' && !cell.mine && cell.adjacentMines > 0) {
    classes.push(numberStyles[cell.adjacentMines] || '')
  }

  // Add mine styling for revealed mines
  if (cell.state === 'revealed' && cell.mine) {
    classes.push(styles.mine)
  }

  // Add selection highlight (keyboard navigation)
  if (selected) {
    classes.push(styles.selected)
  }

  // Add hint/suggestion highlight
  if (highlighted) {
    classes.push(styles.hint)
  }

  // Add corner rounding for board edges
  if (cornerType) {
    const cornerKey = `corner${cornerType.split('-').map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join('')}`
    classes.push(styles[cornerKey as keyof typeof styles] || '')
  }

  // Add disabled state styling
  if (disabled) {
    classes.push(styles.disabled)
  }

  const className = classes.filter(Boolean).join(' ')

  return (
    <button
      type="button"
      className={className}
      data-number={cell.state === 'revealed' && !cell.mine ? cell.adjacentMines : undefined}
      onClick={() => onReveal(cell.row, cell.col)}
      onContextMenu={(event) => onToggleFlag(event, cell.row, cell.col)}
      onDoubleClick={(event) => onChord(event, cell.row, cell.col)}
      disabled={disabled}
      aria-label={`cell-${cell.row}-${cell.col}`}
    >
      {cellContent(cell)}
    </button>
  )
}
