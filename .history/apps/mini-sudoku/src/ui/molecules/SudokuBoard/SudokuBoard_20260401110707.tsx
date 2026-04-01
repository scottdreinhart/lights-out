import React from 'react'
import { SudokuCell } from '@/ui/atoms'
import styles from './SudokuBoard.module.css'
import type { Board, Cell } from '@/domain'

interface SudokuBoardProps {
  board: Board
  editableBoard: Board
  selectedCell?: { row: number; col: number }
  onCellSelect?: (row: number, col: number) => void
  onCellChange?: (row: number, col: number, value: Cell) => void
}

export const SudokuBoard: React.FC<SudokuBoardProps> = ({
  board,
  editableBoard,
  selectedCell,
  onCellSelect,
  onCellChange,
}) => {
  const isEditable = (row: number, col: number): boolean => {
    return editableBoard.grid[row][col] !== undefined
  }

  return (
    <div className={styles.boardContainer}>
      <div className={styles.board}>
        {board.grid.map((row, rowIdx) => (
          <div key={`row-${rowIdx}`} className={styles.row}>
            {row.map((cell, colIdx) => (
              <SudokuCell
                key={`cell-${rowIdx}-${colIdx}`}
                value={cell}
                isEditable={isEditable(rowIdx, colIdx)}
                isSelected={selectedCell?.row === rowIdx && selectedCell?.col === colIdx}
                onClick={() => onCellSelect?.(rowIdx, colIdx)}
                onChange={(value: Cell) => onCellChange?.(rowIdx, colIdx, value)}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
