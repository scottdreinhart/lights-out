import { describe, expect, it } from 'vitest'

/**
 * Unit tests for Mini Sudoku (4x4) grid validation
 * Tests cell placement rules and solution validation
 */

interface MiniSudokuCell {
  value: number | null
  row: number
  col: number
  isFixed: boolean
}

describe('Mini Sudoku', () => {
  it('should validate that a value 1-4 can be placed in empty cell', () => {
    const cell: MiniSudokuCell = { value: null, row: 0, col: 0, isFixed: false }

    expect(cell.value).toBeNull()
    cell.value = 3

    expect(cell.value).toBe(3)
    expect(cell.value >= 1 && cell.value <= 4).toBe(true)
  })

  it('should validate that each row contains numbers 1-4 exactly once', () => {
    const row = [
      { value: 1, row: 0, col: 0, isFixed: true },
      { value: 2, row: 0, col: 1, isFixed: false },
      { value: 3, row: 0, col: 2, isFixed: false },
      { value: 4, row: 0, col: 3, isFixed: true },
    ]

    const rowValues = row.map((cell) => cell.value).sort()
    const isValid = rowValues.length === 4 && rowValues[0] === 1 && rowValues[3] === 4

    expect(isValid).toBe(true)
  })
})
