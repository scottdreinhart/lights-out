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
    if (row < 0 || row >= 4 || col < 0 || col >= 4) {
      return false
    }
    // eslint-disable-next-line no-object-injection
    return editableBoard.grid?.[row]?.[col] !== undefined
  }

  return (
    <div className={styles.boardContainer}>
      <div className={styles.board}>
        {Array.from({ length: 4 }, (_, rowIdx) => (
          <div key={`row-r${rowIdx}`} className={styles.row}>
            {Array.from({ length: 4 }, (_, colIdx) => {
              if (rowIdx < 0 || rowIdx >= 4 || colIdx < 0 || colIdx >= 4) {
                return null
              }
              // eslint-disable-next-line no-object-injection
              const cell = board.grid?.[rowIdx]?.[colIdx] ?? 0
              return (
                <SudokuCell
                  key={`cell-r${rowIdx}c${colIdx}`}
                  value={cell}
                  isEditable={isEditable(rowIdx, colIdx)}
                  isSelected={selectedCell?.row === rowIdx && selectedCell?.col === colIdx}
                  onClick={() => onCellSelect?.(rowIdx, colIdx)}
                  onChange={(value: Cell) => onCellChange?.(rowIdx, colIdx, value)}
                />
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}
