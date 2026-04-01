/**
 * Mini Sudoku App Layer Barrel Export
 */

// Hooks
export { useMiniSudoku } from './hooks/useMiniSudoku'
export type { UseMiniSudokuOptions, UseMiniSudokuReturn } from './hooks/useMiniSudoku'

// Command Handlers
export {
  handleCreatePuzzle,
  handleAssignValue,
  handleClearCell,
  handleToggleCandidate,
  handleUndo,
  handleRedo,
  handlePauseGame,
  handleResumeGame,
  handleRequestHint,
  handleRecordStats,
  handleRestartPuzzle,
} from './commands/miniSudokuCommandHandlers'

// Query Handlers
export {
  handleGetBoardState,
  handleGetCellValue,
  handleGetCellCandidates,
  handleIsCellGiven,
  handleGetCellsInRegion,
  handleIsComplete,
  handleIsSolved,
  handleGetGameStats,
  handleGetNextHint,
  handleEstimateDifficulty,
  handleGetConflictingCells,
  handleGetEmptyCells,
  handleGetFilledCells,
  handleCanAssignValue,
} from './queries/miniSudokuQueryHandlers'
