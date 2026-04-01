/**
 * Zip Board Component
 * Visual representation of the maze navigation board
 */

import React from 'react'
import type { Maze, Position } from '../domain'
import { CELL_COLORS, CELL_SYMBOLS } from '../domain'
import styles from './ZipBoard.module.css'

interface ZipBoardProps {
  maze: Maze
  playerPosition: Position
  highlightedPosition?: Position | null
  onCellClick?: (position: Position) => void
}

export const ZipBoard: React.FC<ZipBoardProps> = ({
  maze,
  playerPosition,
  highlightedPosition,
  onCellClick,
}) => {
  const renderCell = (row: number, col: number) => {
    const cell = maze[row][col]
    const isPlayer = row === playerPosition.row && col === playerPosition.col
    const isHighlighted = highlightedPosition &&
      row === highlightedPosition.row && col === highlightedPosition.col

    let cellType = cell.type
    if (isPlayer) cellType = 'player'

    let className = styles.cell
    if (cellType === 'wall') className += ` ${styles.wall}`
    if (cellType === 'start') className += ` ${styles.start}`
    if (cellType === 'goal') className += ` ${styles.goal}`
    if (cellType === 'item') className += ` ${styles.item}`
    if (cellType === 'player') className += ` ${styles.player}`
    if (isHighlighted) className += ` ${styles.highlighted}`

    const isCollected = cell.type === 'item' && cell.collected

    return (
      <div
        key={`${row}-${col}`}
        className={className}
        onClick={() => onCellClick?.({ row, col })}
        role="button"
        tabIndex={cellType !== 'wall' ? 0 : -1}
        aria-label={`${cellType} at row ${row + 1}, column ${col + 1}`}
        onKeyDown={(e) => {
          if (cellType !== 'wall' && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault()
            onCellClick?.({ row, col })
          }
        }}
      >
        {!isCollected && CELL_SYMBOLS[cellType]}
      </div>
    )
  }

  return (
    <div className={styles.board}>
      {maze.map((row, rowIndex) => (
        <div key={rowIndex} className={styles.row}>
          {row.map((_, colIndex) => renderCell(rowIndex, colIndex))}
        </div>
      ))}
    </div>
  )
}