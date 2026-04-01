/**
 * SudokuBoard Organism Component
 * Main 9×9 game board with all controls
 */

import type { Board, Cell } from '@/domain'
import React from 'react'
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
  onCellChange,
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
        <div key={`row-pos-${rowIndex}`} className={styles.row}>
          {row.map((cell, colIndex) => {
            const isCellEditable = (() => {
              if (rowIndex < 0 || rowIndex >= 4 || colIndex < 0 || colIndex >= 4) {
                return false
              }
              const editableRow = editableBoard.grid[rowIndex]
              return editableRow && editableRow[colIndex] !== 0
            })()
            return (
              <SudokuCell
                key={`cell-r${rowIndex}c${colIndex}`}
                value={cell}
                isEditable={isCellEditable}
                isSelected={selectedCell?.row === rowIndex && selectedCell?.col === colIndex}
                onClick={() => handleCellClick(rowIndex, colIndex)}
                onChange={(value) => handleCellChange(rowIndex, colIndex, value)}
              />
            )
          })}
        </div>
      ))}
    </div>
  )
}
