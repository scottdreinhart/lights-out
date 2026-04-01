import type { Board, Cell } from '@/domain'
import { SudokuCell } from '@/ui/atoms'
import React from 'react'
import styles from './SudokuBoard.module.css'

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
        {board.grid.map((row: Cell[], rowIdx: number) =>
          row.map((cell: Cell, colIdx: number) => (
            <SudokuCell
              key={`${rowIdx}-${colIdx}`}
              value={cell}
              isEditable={isEditable(rowIdx, colIdx)}
              isSelected={selectedCell?.row === rowIdx && selectedCell?.col === colIdx}
              onSelect={() => onCellSelect?.(rowIdx, colIdx)}
              onChange={(value) => onCellChange?.(rowIdx, colIdx, value)}
            />
          )),
        )}
      </div>
    </div>
  )
}
