import { useCallback, useEffect } from 'react'

import { useGridNavigationInput } from '@games/app-hook-utils'

interface UseSudokuInputParams {
  selectedCell: { row: number; col: number } | undefined
  selectedDigit: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
  onCellSelect: (row: number, col: number) => void
  onDigitSelect: (digit: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9) => void
  onApplyDigit: (value: number) => void
}

/**
 * Unified input handler for sudoku (9x9 grid)
 * Handles grid navigation (arrows + WASD) and digit input (1-9)
 * Grid wraps at boundaries (modulo behavior)
 */
export const useSudokuInput = ({
  selectedCell,
  onCellSelect,
  onApplyDigit,
}: UseSudokuInputParams): void => {
  const gridSize = 9 // 9x9 sudoku

  // Grid navigation with arrow keys and WASD (with wrapping)
  useGridNavigationInput(
    {
      onMove: (direction) => {
        const baseRow = selectedCell?.row ?? 0
        const baseCol = selectedCell?.col ?? 0

        let newRow = baseRow
        let newCol = baseCol

        if (direction === 'up') {
          newRow = (baseRow - 1 + gridSize) % gridSize
        } else if (direction === 'down') {
          newRow = (baseRow + 1) % gridSize
        } else if (direction === 'left') {
          newCol = (baseCol - 1 + gridSize) % gridSize
        } else if (direction === 'right') {
          newCol = (baseCol + 1) % gridSize
        }

        onCellSelect(newRow, newCol)
      },
    },
    { enabled: true, includeWasd: true, allowRepeat: true },
  )

  // Digit input (1-9 to apply, 0/Backspace to clear)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase()

      // Handle digit input 1-9
      if (key >= '1' && key <= '9') {
        event.preventDefault()
        onApplyDigit(parseInt(key, 10))
        return
      }

      // Handle clear (0, Backspace, Delete)
      if (key === '0' || key === 'backspace' || key === 'delete') {
        event.preventDefault()
        onApplyDigit(0)
        return
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [onApplyDigit])
}
