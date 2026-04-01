/**
 * Mini Sudoku Domain Layer Barrel Export
 */

// Types
export { Difficulty } from './types'
export type {
  Board,
  Cell,
  CellConflict,
  CellValue,
  DifficultyMetrics,
  Hint,
  MiniSudokuState,
  Move,
} from './types'

// Constants
export {
  ALL_CELL_IDS,
  BOARD_SIZE,
  BOX_SIZE,
  CELL_COUNT,
  DEFAULT_CANDIDATES,
  DIFFICULTY_CONFIG,
  VALID_VALUES,
  getBoxIndex,
  getCellId,
  getCellsInBox,
  getCellsInCol,
  getCellsInRow,
  parseCellId,
} from './constants'

// Constraints (CSP)
export {
  BoxUniquenessConstraint,
  ColUniquenessConstraint,
  RowUniquenessConstraint,
  UniquenessConstraint,
  ValueRangeConstraint,
  createAllConstraints,
  getConstraintsForCell,
  validateBoard,
} from './constraints'

// Rules (Game Logic)
export {
  countEmpty,
  getCellCandidates,
  getCellsInRegion,
  getConflictingCells,
  isComplete,
  isSolved,
  isValidMove,
  updateAllCandidates,
  updateCellCandidates,
} from './rules'

// Templates (CSP & Puzzle Generation)
export {
  clonePuzzle,
  countClues,
  countFilled,
  createCSP,
  createEmptyBoard,
  createPuzzleAtDifficulty,
  createPuzzleFromSolution,
  createSolvedBoard,
} from './templates'
export type { MiniSudokuCSP } from './templates'

// AI & Hints
export { countSolvableByLogic, estimateDifficulty, estimateSolveTime, provideHint } from './ai'
