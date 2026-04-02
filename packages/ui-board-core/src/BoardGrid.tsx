import type { ReactNode } from 'react'
import { useMemo } from 'react'
import Tile, { type TileContent, type TileState } from './Tile'

/**
 * Position on a rectangular board
 */
export interface Position {
  row: number
  col: number }

/**
 * A single cell/square on the board with its content and state
 */
export interface BoardCell {
  position: Position
  content?: TileContent
  state?: TileState
  isDarkSquare?: boolean
  isPlayable?: boolean
  ariaLabel?: string
}

/**
 * BoardGridProps for configurable board rendering
 */
export interface BoardGridProps {
  // Grid structure
  rows: number
  cols: number
  cells: BoardCell[]

  // Keyboard navigation
  keyboardFocus?: Position | null
  selectedPosition?: Position | null

  // Handlers
  onCellClick?: (position: Position) => void
  onCellDoubleClick?: (position: Position) => void

  // Styling
  className?: string
  style?: React.CSSProperties
  cellClassName?: string

  // Accessibility
  ariaLabel?: string
  ariaDescription?: string

  // Responsiveness
  responsive?: {
    touchOptimized?: boolean
    supportsHover?: boolean
    prefersReducedMotion?: boolean
    compactViewport?: boolean
  }

  // Rendering
  renderCell?: (cell: BoardCell, isSelected: boolean, isFocused: boolean) => ReactNode
}

/**
 * Helper: Check if two positions are equal
 */
function positionsEqual(a: Position | null, b: Position | null): boolean {
  if (!a || !b) return false
  return a.row === b.row && a.col === b.col
}

/**
 * Generic BoardGrid component for grid-based games
 *
 * Features:
 * - Renders rectangular grids (checkers 8x8, tic-tac-toe 3x3, etc.)
 * - Keyboard navigation support (track focused cell)
 * - Selection support (track selected cell)
 * - Rich accessibility (ARIA grid semantics, keyboard hints)
 * - Responsive styling (touch optimization, hover states)
 * - Game-specific customization (custom cell rendering)
 *
 * Games using this:
 * - Checkers, Tic-Tac-Toe, Connect-Four, Queens, Minesweeper, Reversi, Battleship, Pinpoint
 *
 * @example
 * // Simple checkers board
 * <BoardGrid
 *   rows={8}
 *   cols={8}
 *   cells={checkersBoard.map((row, r) =>
 *     row.map((piece, c) => ({
 *       position: { row: r, col: c },
 *       content: piece ? { type: 'custom', customRender: () => <CheckersPiece /> } : undefined,
 *       isDarkSquare: (r + c) % 2 === 0,
 *       isPlayable: (r + c) % 2 === 0,
 *     }))
 *   ).flat()}
 *   keyboardFocus={focus}
 *   selectedPosition={selected}
 *   onCellClick={handleClick}
 * />
 *
 * @example
 * // Custom cell rendering
 * <BoardGrid
 *   rows={9}
 *   cols={9}
 *   cells={sudokuBoard}
 *   renderCell={(cell, isSelected, isFocused) => (
 *     <SudokuCell
 *       value={cell.content?.value}
 *       selected={isSelected}
 *       focused={isFocused}
 *     />
 *   )}
 * />
 */
export function BoardGrid({
  rows,
  cols,
  cells,
  keyboardFocus,
  selectedPosition,
  onCellClick,
  onCellDoubleClick,
  className = '',
  style,
  cellClassName = '',
  ariaLabel,
  ariaDescription,
  responsive = {},
  renderCell,
}: BoardGridProps) {
  // Build lookup map for O(1) cell access by position
  const cellMap = useMemo(() => {
    const map = new Map<string, BoardCell>()
    cells.forEach((cell) => {
      const key = `${cell.position.row},${cell.position.col}`
      map.set(key, cell)
    })
    return map
  }, [cells])

  // Render all cells in row-major order
  const renderedCells = useMemo(() => {
    const result: ReactNode[] = []

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const position = { row, col }
        const key = `${row},${col}`
        const cell = cellMap.get(key) || {
          position,
          isDarkSquare: (row + col) % 2 === 0,
          isPlayable: true,
        }

        const isSelected = positionsEqual(selectedPosition, position)
        const isFocused = positionsEqual(keyboardFocus, position)

        // Use custom render if provided, otherwise use default Tile
        if (renderCell) {
          result.push(
            <div key={key} className={`grid-cell ${cellClassName}`.trim()}>
              {renderCell(cell, isSelected, isFocused)}
            </div>,
          )
        } else {
          result.push(
            <Tile
              key={key}
              position={position}
              content={cell.content}
              state={{
                ...cell.state,
                selected: isSelected,
                focused: isFocused,
              }}
              isDarkSquare={cell.isDarkSquare}
              isPlayable={cell.isPlayable}
              className={cellClassName}
              ariaLabel={cell.ariaLabel}
              onClick={onCellClick}
              onDoubleClick={onCellDoubleClick}
              responsive={responsive}
            />,
          )
        }
      }
    }

    return result
  }, [rows, cols, cellMap, selectedPosition, keyboardFocus, renderCell, cellClassName, onCellClick, onCellDoubleClick, responsive])

  const gridClassName = [
    'board-grid',
    `board-grid--${rows}x${cols}`,
    responsive.touchOptimized ? 'board-grid--touch' : '',
    responsive.compactViewport ? 'board-grid--compact' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <section
      className={gridClassName}
      role="grid"
      aria-label={
        ariaLabel ||
        `Game board (${rows}×${cols}). Use arrow keys to navigate, space/enter to select.`
      }
      aria-description={ariaDescription}
      style={style}
    >
      <div
        className="board-grid__grid"
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
          gap: 0,
          aspectRatio: `${cols}/${rows}`,
        }}
      >
        {renderedCells}
      </div>
    </section>
  )
}

export default BoardGrid
