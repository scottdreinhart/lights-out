/**
 * Queens Board Component
 * Visual representation of N-Queens chessboard using shared BoardGrid
 */

import React from 'react'
import { BoardGrid, type BoardCell } from '@games/ui-board-core'
import type { Board } from '../domain'
import { BOARD_COLORS, QUEEN_COLORS } from '../domain'
import styles from './QueensBoard.module.css'

interface QueensBoardProps {
  board: Board
  onCellClick: (row: number, col: number) => void
  size: number
  conflicts?: number
  highlightedCells?: Array<{ row: number; col: number; type: 'hint' | 'conflict' }>
}

export const QueensBoard: React.FC<QueensBoardProps> = ({
  board,
  onCellClick,
  size,
  conflicts = 0,
  highlightedCells = [],
}) => {
  // Build cells array for BoardGrid
  const cells: BoardCell[] = []
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      const queenPos = board[row]
      const hasQueen = queenPos === col
      const highlight = highlightedCells.find((cell) => cell.row === row && cell.col === col)

      cells.push({
        row,
        col,
        content: hasQueen ? { type: 'icon', value: '♛' } : undefined,
        selected: false,
        focused: false,
        highlighted: highlight?.type === 'hint',
        error: highlight?.type === 'conflict',
      })
    }
  }

  // Custom render function for queen-specific styling
  const renderCell = (cell: BoardCell, isSelected: boolean, isFocused: boolean) => {
    const row = cell.row!
    const col = cell.col!
    const queenPos = board[row]
    const hasQueen = queenPos === col
    const highlight = highlightedCells.find((c) => c.row === row && c.col === col)

    // Calculate checkerboard color
    const isLight = (row + col) % 2 === 0
    const baseColor = isLight ? BOARD_COLORS.light : BOARD_COLORS.dark

    let backgroundColor = baseColor
    if (highlight) {
      switch (highlight.type) {
        case 'hint':
          backgroundColor = QUEEN_COLORS.candidate
          break
        case 'conflict':
          backgroundColor = QUEEN_COLORS.conflict
          break
      }
    }

    let cellClassName = styles.cell
    if (hasQueen) cellClassName += ` ${styles.queen}`
    if (highlight?.type === 'hint') cellClassName += ` ${styles.hint}`
    if (highlight?.type === 'conflict') cellClassName += ` ${styles.conflict}`

    return (
      <button
        className={cellClassName}
        style={{ backgroundColor }}
        onClick={() => onCellClick(row, col)}
        aria-label={`Cell ${row + 1}, ${col + 1}${hasQueen ? ' with queen' : ''}`}
        type="button"
      >
        {hasQueen && <span className={styles.queenIcon}>♛</span>}
      </button>
    )
  }

  return (
    <div className={styles.boardContainer}>
      <BoardGrid
        rows={size}
        cols={size}
        cells={cells}
        renderCell={renderCell}
        className={styles.board}
      />
      {conflicts > 0 && (
        <div
          style={{
            marginTop: '10px',
            color: QUEEN_COLORS.conflict,
            fontWeight: 'bold',
            textAlign: 'center',
          }}
        >
          Conflicts: {conflicts}
        </div>
      )}
    </div>
  )
}
