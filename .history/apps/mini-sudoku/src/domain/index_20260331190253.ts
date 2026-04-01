/**
 * Mini Sudoku Domain Layer Barrel Export
 */

// Types
export type {
  CellValue,
  Cell,
  Board,
  MiniSudokuState,
  Hint,
  DifficultyMetrics,
  Move,
  CellConflict,
} from './types'
export { Difficulty } from './types'

// Constants
export {
  BOARD_SIZE,
  BOX_SIZE,
  CELL_COUNT,
  getCellId,
  parseCellId,
  getBoxIndex,
  getCellsInRow,
  getCellsInCol,
  getCellsInBox,
  DIFFICULTY_CONFIG,
  VALID_VALUES,
  ALL_CELL_IDS,
  DEFAULT_CANDIDATES,
} from './constants'

// Constraints (CSP)
export {
  UniquenessConstraint,
  RowUniquenessConstraint,
  ColUniquenessConstraint,
  BoxUniquenessConstraint,
  ValueRangeConstraint,
  createAllConstraints,
  getConstraintsForCell,
  validateBoard,
} from './constraints'

// Rules (Game Logic)
export {
  isValidMove,
  getConflictingCells,
  isComplete,
  isSolved,
  countEmpty,
  getCellsInRegion,
  updateCellCandidates,
  updateAllCandidates,
  getCellCandidates,
} from './rules'

// Templates (CSP & Puzzle Generation)
export type { MiniSudokuCSP } from './templates'
export {
  createEmptyBoard,
  createSolvedBoard,
  createPuzzleFromSolution,
  createPuzzleAtDifficulty,
  createCSP,
  clonePuzzle,
  countClues,
  countFilled,
} from './templates'

// AI & Hints
export { provideHint, estimateDifficulty, estimateSolveTime, countSolvableByLogic } from './ai'
