/**
 * Mini Sudoku Constraints
 * CSP constraint classes for Mini Sudoku (4×4, 2×2 boxes)
 */

import { BOARD_SIZE, BOX_SIZE, getBoxIndex, parseCellId } from './constants'
import type { Board, CellValue } from './types'

/**
 * Base class for all constraints
 */
abstract class MiniSudokuConstraint {
  abstract name: string
  abstract cellIds: string[]
  abstract isSatisfied(board: Board): boolean
  abstract eliminate(cellId: string, value: CellValue, board: Board): boolean
}

/**
 * Uniqueness Constraint: No two cells in row/col/box have same value
 */
export class UniquenessConstraint extends MiniSudokuConstraint {
  name = 'Uniqueness'
  cellIds: string[]

  constructor(cellIds: string[]) {
    super()
    this.cellIds = cellIds
  }

  isSatisfied(board: Board): boolean {
    const filledValues = new Set<CellValue>()
    for (const cellId of this.cellIds) {
      const cell = board.get(cellId)
      if (cell?.value) {
        if (filledValues.has(cell.value)) {
          return false
        }
        filledValues.add(cell.value)
      }
    }
    return true
  }

  eliminate(cellId: string, value: CellValue, board: Board): boolean {
    if (!value) return false

    for (const otherId of this.cellIds) {
      if (otherId === cellId) continue
      const other = board.get(otherId)
      if (other?.value === value) {
        return true // Conflict detected
      }
    }
    return false
  }
}

/**
 * Row Uniqueness: All values in a row must be unique
 */
export class RowUniquenessConstraint extends UniquenessConstraint {
  constructor(row: number) {
    const cellIds = []
    for (let col = 0; col < BOARD_SIZE; col++) {
      cellIds.push(`r${row}c${col}`)
    }
    super(cellIds)
  }
}

/**
 * Column Uniqueness: All values in a column must be unique
 */
export class ColUniquenessConstraint extends UniquenessConstraint {
  constructor(col: number) {
    const cellIds = []
    for (let row = 0; row < BOARD_SIZE; row++) {
      cellIds.push(`r${row}c${col}`)
    }
    super(cellIds)
  }
}

/**
 * Box Uniqueness: All values in a 2×2 box must be unique
 */
export class BoxUniquenessConstraint extends UniquenessConstraint {
  constructor(boxIndex: number) {
    const cellIds = []
    const startRow = Math.floor(boxIndex / BOX_SIZE) * BOX_SIZE
    const startCol = (boxIndex % BOX_SIZE) * BOX_SIZE

    for (let r = startRow; r < startRow + BOX_SIZE; r++) {
      for (let c = startCol; c < startCol + BOX_SIZE; c++) {
        cellIds.push(`r${r}c${c}`)
      }
    }
    super(cellIds)
  }
}

/**
 * Value Range Constraint: All cells have values 1-4
 */
export class ValueRangeConstraint extends MiniSudokuConstraint {
  name = 'ValueRange'
  cellIds: string[]

  constructor(cellId: string) {
    super()
    this.cellIds = [cellId]
  }

  isSatisfied(board: Board): boolean {
    const cell = board.get(this.cellIds[0])
    if (!cell || !cell.value) return true
    return ['1', '2', '3', '4'].includes(cell.value)
  }

  eliminate(cellId: string, value: CellValue): boolean {
    // This constraint allows only 1-4, so any other value is invalid
    return !['1', '2', '3', '4'].includes(value)
  }
}

/**
 * Factory: Create all CSP constraints for Mini Sudoku
 */
export function createAllConstraints(): MiniSudokuConstraint[] {
  const constraints: MiniSudokuConstraint[] = []

  // Row uniqueness
  for (let row = 0; row < BOARD_SIZE; row++) {
    constraints.push(new RowUniquenessConstraint(row))
  }

  // Column uniqueness
  for (let col = 0; col < BOARD_SIZE; col++) {
    constraints.push(new ColUniquenessConstraint(col))
  }

  // Box uniqueness (4 boxes in 4×4)
  for (let box = 0; box < BOARD_SIZE; box++) {
    constraints.push(new BoxUniquenessConstraint(box))
  }

  // Value range per cell
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      constraints.push(new ValueRangeConstraint(`r${row}c${col}`))
    }
  }

  return constraints
}

/**
 * Get all constraints affecting a specific cell
 */
export function getConstraintsForCell(cellId: string): MiniSudokuConstraint[] {
  const constraints: MiniSudokuConstraint[] = []
  const { row, col } = parseCellId(cellId)
  const boxIndex = getBoxIndex(row, col)

  constraints.push(new RowUniquenessConstraint(row))
  constraints.push(new ColUniquenessConstraint(col))
  constraints.push(new BoxUniquenessConstraint(boxIndex))
  constraints.push(new ValueRangeConstraint(cellId))

  return constraints
}

/**
 * Validate that a board satisfies all constraints
 */
export function validateBoard(board: Board): boolean {
  const constraints = createAllConstraints()
  return constraints.every((c) => c.isSatisfied(board))
}
