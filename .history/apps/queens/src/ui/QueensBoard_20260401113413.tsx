/**
 * Queens Board Component
 * Visual representation of N-Queens chessboard
 */

import React from 'react'
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
  const getCellStyle = (row: number, col: number) => {
    const isLight = (row + col) % 2 === 0
    const baseColor = isLight ? BOARD_COLORS.light : BOARD_COLORS.dark

    // Check if cell is highlighted
    const highlight = highlightedCells.find((cell) => cell.row === row && cell.col === col)

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

    return {
      backgroundColor,
    }
  }

  const renderCell = (row: number, col: number) => {
    const queenPos = board[row]
    const hasQueen = queenPos === col

    let className = styles.cell
    if (hasQueen) className += ` ${styles.queen}`

    // Check for highlights
    const highlight = highlightedCells.find((cell) => cell.row === row && cell.col === col)
    if (highlight) {
      if (highlight.type === 'hint') className += ` ${styles.hint}`
      if (highlight.type === 'conflict') className += ` ${styles.conflict}`
    }

    return (
      <div
        key={`${row}-${col}`}
        className={className}
        style={getCellStyle(row, col)}
        onClick={() => onCellClick(row, col)}
        role="button"
        tabIndex={0}
        aria-label={`Cell ${row + 1}, ${col + 1}${hasQueen ? ' with queen' : ''}`}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onCellClick(row, col)
          }
        }}
      >
        {hasQueen && <span className={styles.queenIcon}>♛</span>}
      </div>
    )
  }

  return (
    <div
      className={styles.board}
      style={{ '--board-size': size } as React.CSSProperties}
      role="grid"
      aria-label={`Queens board of size ${size}x${size}`}
    >
      {Array.from({ length: size }, (_, row) => (
        <div key={row} style={{ display: 'contents' }}>
          {Array.from({ length: size }, (_, col) => renderCell(row, col))}
        </div>
      ))}
      {conflicts > 0 && (
        <div
          style={{
            marginTop: '10px',
            color: QUEEN_COLORS.conflict,
            fontWeight: 'bold',
            textAlign: 'center',
            gridColumn: '1 / -1',
          }}
        >
          Conflicts: {conflicts}
        </div>
      )}
    </div>
  )
}
