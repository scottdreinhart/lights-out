/**
 * SudokuBoard Organism Component
 * Main 9×9 game board with all controls
 */

import React from 'react'
import type { Board, Cell } from '@/domain'
import { SudokuCell } from '../atoms/SudokuCell'
import styles from './SudokuBoard.module.css'

interface SudokuBoardProps {
  board: Board
  editableBoard: Board
  selectedCell?: { row: number; col: number }
  onCellSelect: (row: number, col: number) => void
  onCellChange: (row: number, col: number, value: Cell) => void
}

export const SudokuBoard: React.FC<SudokuBoardProps> = ({
  board,
  editableBoard,
  selectedCell,
  onCellSelect,
  onCellChange
}) => {
  const handleCellClick = (row: number, col: number) => {
    onCellSelect(row, col)
  }

  const handleCellChange = (row: number, col: number, value: Cell) => {
    onCellChange(row, col, value)
  }

  return (
    <div className={styles.board}>
      {board.grid.map((row, rowIndex) => (
        <div key={`row-${rowIndex}`} className={styles.row}>
          {row.map((cell, colIndex) => (
            <SudokuCell
              key={`cell-r${rowIndex}c${colIndex}`}
              value={cell}
              isEditable={editableBoard.grid[rowIndex][colIndex] !== 0}
              isSelected={
                selectedCell?.row === rowIndex && selectedCell?.col === colIndex
              }
              onClick={() => handleCellClick(rowIndex, colIndex)}
              onChange={(value) => handleCellChange(rowIndex, colIndex, value)}
            />
          ))}
        </div>
      ))}
    </div>
  )
}
