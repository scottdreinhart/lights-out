import { useCallback, useEffect } from 'react'

import { useGridNavigationInput } from '@games/app-hook-utils'
import type { Cell } from '@/domain'

interface UseMiniSudokuInputParams {
  selectedCell: { row: number; col: number } | undefined
  editableBoard: { grid: (number | null)[][] }
  onCellSelect: (row: number, col: number) => void
  onCellChange: (row: number, col: number, value: Cell) => void
}

/**
 * Unified input handler for mini-sudoku
 * Handles grid navigation (arrows + WASD) and digit input (1-9)
 */
export const useMiniSudokuInput = ({
  selectedCell,
  editableBoard,
  onCellSelect,
  onCellChange,
}: UseMiniSudokuInputParams): void => {
  const gridSize = 4 // 4x4 sudoku

  // Grid navigation with arrow keys and WASD
  useGridNavigationInput(
    {
      onMove: (direction) => {
        if (!selectedCell) {
          onCellSelect(0, 0)
          return
        }

        let newRow = selectedCell.row
        let newCol = selectedCell.col

        if (direction === 'up') {
          newRow = Math.max(0, selectedCell.row - 1)
        } else if (direction === 'down') {
          newRow = Math.min(gridSize - 1, selectedCell.row + 1)
        } else if (direction === 'left') {
          newCol = Math.max(0, selectedCell.col - 1)
        } else if (direction === 'right') {
          newCol = Math.min(gridSize - 1, selectedCell.col + 1)
        }

        if (newRow !== selectedCell.row || newCol !== selectedCell.col) {
          onCellSelect(newRow, newCol)
        }
      },
      onCancel: () => {
        onCellSelect(-1, -1)
      },
    },
    { enabled: true, includeWasd: true, allowRepeat: false },
  )

  // Digit input (1-9 to fill cell, 0/Backspace to clear)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!selectedCell || selectedCell.row < 0 || selectedCell.col < 0) {
        return
      }

      // Check if cell is editable
      const isEditable =
        selectedCell.row >= 0 &&
        selectedCell.row < gridSize &&
        selectedCell.col >= 0 &&
        selectedCell.col < gridSize &&
        editableBoard.grid?.[selectedCell.row]?.[selectedCell.col] !== 0

      if (!isEditable) {
        return
      }

      const key = event.key.toLowerCase()

      // Handle digit input 1-9
      if (key >= '1' && key <= '9') {
        event.preventDefault()
        onCellChange(selectedCell.row, selectedCell.col, parseInt(key, 10) as Cell)
        return
      }

      // Handle clear (0, Backspace, Delete)
      if (key === '0' || key === 'backspace' || key === 'delete') {
        event.preventDefault()
        onCellChange(selectedCell.row, selectedCell.col, null)
        return
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [selectedCell, editableBoard, onCellChange, onCellSelect])
}
