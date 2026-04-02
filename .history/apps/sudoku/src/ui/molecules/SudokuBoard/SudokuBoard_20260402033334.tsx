import type { Board, Cell } from '@/domain'
import { SudokuCell } from '@/ui/atoms'
import { BoardGrid } from '@games/ui-board-core'
import { useResponsiveState } from '@games/common'
import React from 'react'
import styles from './SudokuBoard.module.css'

interface SudokuBoardProps {
  board: Board
  editableBoard: Board
  selectedCell?: { row: number; col: number }
  onCellSelect?: (row: number, col: number) => void
  onCellChange?: (row: number, col: number, value: Cell) => void
  highlightedCells?: Set<string>
  invalidCells?: Set<string>
}

export const SudokuBoard: React.FC<SudokuBoardProps> = ({
  board,
  editableBoard,
  selectedCell,
  onCellSelect,
  onCellChange,
  highlightedCells = new Set(),
  invalidCells = new Set(),
}) => {
  const responsive = useResponsiveState()

  const isEditable = (row: number, col: number): boolean => {
    return editableBoard.grid[row][col] !== undefined
  }

  const getCellKey = (row: number, col: number): string => `${row},${col}`

  return (
    <div className={styles.boardContainer}>
      <BoardGrid
        rows={9}
        cols={9}
        className={styles.sudokuBoard}
        responsive={responsive}
        onCellClick={(row, col) => {
          onCellSelect?.(row, col)
        }}
      >
        {board.grid.map((row: Cell[], rowIdx: number) =>
          row.map((_: Cell, colIdx: number) => {
            const cellKey = getCellKey(rowIdx, colIdx)
            const cellValue = board.grid[rowIdx][colIdx]
            const isSelected = selectedCell?.row === rowIdx && selectedCell?.col === colIdx
            const isHighlighted = highlightedCells.has(cellKey)
            const isInvalid = invalidCells.has(cellKey)
            const editable = isEditable(rowIdx, colIdx)

            return (
              <div
                key={cellKey}
                className={[
                  styles.sudokuCell,
                  isSelected && styles.selected,
                  isHighlighted && styles.highlighted,
                  isInvalid && styles.invalid,
                  !editable && styles.given,
                  // 3×3 box styling
                  Math.floor(rowIdx / 3) % 2 === 0 && Math.floor(colIdx / 3) % 2 === 0 && styles.boxA,
                  Math.floor(rowIdx / 3) % 2 === 0 && Math.floor(colIdx / 3) % 2 === 1 && styles.boxB,
                  Math.floor(rowIdx / 3) % 2 === 1 && Math.floor(colIdx / 3) % 2 === 0 && styles.boxC,
                  Math.floor(rowIdx / 3) % 2 === 1 && Math.floor(colIdx / 3) % 2 === 1 && styles.boxD,
                ].filter(Boolean)}
                data-row={rowIdx}
                data-col={colIdx}
              >
                <SudokuCell
                  value={cellValue}
                  isEditable={editable}
                  isSelected={isSelected}
                  isSameNumber={isHighlighted}
                  isInvalid={isInvalid}
                  onClick={() => onCellSelect?.(rowIdx, colIdx)}
                  onChange={(value) => onCellChange?.(rowIdx, colIdx, value)}
                  onSelect={() => onCellSelect?.(rowIdx, colIdx)}
                />
              </div>
            )
          }),
        )}
      </BoardGrid>
    </div>
  )
}
