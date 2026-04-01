/**
 * Tango Board Component
 * Visual representation of the Tango slide puzzle board
 */

import React from 'react'
import type { Board, Position } from '../domain'
import { TILE_COLORS } from '../domain'
import styles from './TangoBoard.module.css'

interface TangoBoardProps {
  board: Board
  onTileClick: (position: Position) => void
  highlightedTile?: Position | null
  size: number
}

export const TangoBoard: React.FC<TangoBoardProps> = ({
  board,
  onTileClick,
  highlightedTile,
  size,
}) => {
  const renderTile = (row: number, col: number) => {
    const value = board[row][col]
    const isEmpty = value === 0
    const isHighlighted = highlightedTile &&
      highlightedTile.row === row &&
      highlightedTile.col === col

    let className = styles.tile
    if (isEmpty) className += ` ${styles.empty}`
    if (isHighlighted) className += ` ${styles.highlighted}`

    return (
      <div
        key={`${row}-${col}`}
        className={className}
        onClick={() => !isEmpty && onTileClick({ row, col })}
        role="button"
        tabIndex={isEmpty ? -1 : 0}
        aria-label={isEmpty ? 'Empty space' : `Tile ${value}`}
        onKeyDown={(e) => {
          if (!isEmpty && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault()
            onTileClick({ row, col })
          }
        }}
      >
        {!isEmpty && (
          <span className={styles.tileNumber}>
            {value}
          </span>
        )}
      </div>
    )
  }

  return (
    <div
      className={styles.board}
      style={{ '--board-size': size } as React.CSSProperties}
      role="grid"
      aria-label={`Tango puzzle board of size ${size}x${size}`}
    >
      {board.map((row, rowIndex) =>
        row.map((_, colIndex) => renderTile(rowIndex, colIndex))
      )}
    </div>
  )
}