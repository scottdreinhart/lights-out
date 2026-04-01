/**
 * Queens Board Component
 * Visual representation of N-Queens chessboard
 */

import React from 'react'
import type { Board } from '../domain'
import { BOARD_COLORS, QUEEN_COLORS } from '../domain'

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
  highlightedCells = []
}) => {
  const getCellStyle = (row: number, col: number) => {
    const isLight = (row + col) % 2 === 0
    const baseColor = isLight ? BOARD_COLORS.light : BOARD_COLORS.dark

    // Check if cell is highlighted
    const highlight = highlightedCells.find(cell => cell.row === row && cell.col === col)

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
      width: '50px',
      height: '50px',
      backgroundColor,
      border: '1px solid #333',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      fontSize: '24px',
      transition: 'background-color 0.2s'
    }
  }

  const renderCell = (row: number, col: number) => {
    const queenPos = board[row]
    const hasQueen = queenPos === col

    return (
      <div
        key={`${row}-${col}`}
        style={getCellStyle(row, col)}
        onClick={() => onCellClick(row, col)}
        onMouseEnter={(e) => {
          e.currentTarget.style.opacity = '0.8'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.opacity = '1'
        }}
      >
        {hasQueen && '♛'}
      </div>
    )
  }

  return (
    <div style={{ display: 'inline-block', border: '2px solid #333' }}>
      {Array.from({ length: size }, (_, row) => (
        <div key={row} style={{ display: 'flex' }}>
          {Array.from({ length: size }, (_, col) => renderCell(row, col))}
        </div>
      ))}
      {conflicts > 0 && (
        <div style={{
          marginTop: '10px',
          color: QUEEN_COLORS.conflict,
          fontWeight: 'bold'
        }}>
          Conflicts: {conflicts}
        </div>
      )}
    </div>
  )
}