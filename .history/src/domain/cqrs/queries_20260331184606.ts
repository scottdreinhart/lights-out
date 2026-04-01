/**
 * Domain Queries for Puzzle Games
 *
 * Queries read game state without side effects
 * Used for: UI rendering, validation, analytics retrieval
 *
 * Pattern:
 * 1. React component needs to display score → dispatch GetGameStatsQuery
 * 2. QueryBus executes query handler
 * 3. Handler reads state and returns result
 * 4. Component receives result → render
 *
 * No state changes, no events emitted, fully cacheable
 */

import type { Query } from './infrastructure'

// ============================================================================
// PUZZLE STATE QUERIES
// ============================================================================

/**
 * GetPuzzleStateQuery: read current puzzle configuration
 */
export interface GetPuzzleStateQuery extends Query {
  type: 'GET_PUZZLE_STATE'
  payload?: {
    includeMetadata?: boolean
  }
}

/**
 * GetPuzzleTypeQuery: identify puzzle type
 */
export interface GetPuzzleTypeQuery extends Query {
  type: 'GET_PUZZLE_TYPE'
}

/**
 * GetDifficultyQuery: read current difficulty
 */
export interface GetDifficultyQuery extends Query {
  type: 'GET_DIFFICULTY'
}

/**
 * GetInitialStateQuery: read original puzzle (before moves)
 */
export interface GetInitialStateQuery extends Query {
  type: 'GET_INITIAL_STATE'
}

// ============================================================================
// MOVE/PROGRESS QUERIES
// ============================================================================

/**
 * GetMoveCountQuery: how many moves made
 */
export interface GetMoveCountQuery extends Query {
  type: 'GET_MOVE_COUNT'
}

/**
 * GetMoveHistoryQuery: list all moves made
 */
export interface GetMoveHistoryQuery extends Query {
  type: 'GET_MOVE_HISTORY'
  payload?: {
    limit?: number  // recent moves only
  }
}

/**
 * GetUndoStackQuery: moves available to undo
 */
export interface GetUndoStackQuery extends Query {
  type: 'GET_UNDO_STACK'
}

/**
 * GetRedoStackQuery: moves available to redo
 */
export interface GetRedoStackQuery extends Query {
  type: 'GET_REDO_STACK'
}

/**
 * CanUndoQuery: check if undo available
 */
export interface CanUndoQuery extends Query {
  type: 'CAN_UNDO'
}

/**
 * CanRedoQuery: check if redo available
 */
export interface CanRedoQuery extends Query {
  type: 'CAN_REDO'
}

// ============================================================================
// CELL STATE QUERIES
// ============================================================================

/**
 * GetCellValueQuery: read current cell value
 */
export interface GetCellValueQuery extends Query {
  type: 'GET_CELL_VALUE'
  payload: {
    cellId: string
  }
}

/**
 * GetCellCandidatesQuery: possible values for cell
 */
export interface GetCellCandidatesQuery extends Query {
  type: 'GET_CELL_CANDIDATES'
  payload: {
    cellId: string
  }
}

/**
 * GetConflictingCellsQuery: cells violating constraints with target cell
 */
export interface GetConflictingCellsQuery extends Query {
  type: 'GET_CONFLICTING_CELLS'
  payload: {
    cellId: string
  }
}

/**
 * HasConstraintViolationQuery: check if cell violates any constraint
 */
export interface HasConstraintViolationQuery extends Query {
  type: 'HAS_CONSTRAINT_VIOLATION'
  payload: {
    cellId: string
  }
}

// ============================================================================
// COMPLETION & VALIDATION QUERIES
// ============================================================================

/**
 * IsCompletedQuery: is puzzle solved?
 */
export interface IsCompletedQuery extends Query {
  type: 'IS_COMPLETED'
}

/**
 * IsValidQuery: does current state satisfy all constraints?
 */
export interface IsValidQuery extends Query {
  type: 'IS_VALID'
}

/**
 * IsSolvableQuery: can puzzle still be solved from current state?
 */
export interface IsSolvableQuery extends Query {
  type: 'IS_SOLVABLE'
}

/**
 * GetSolutionQuery: get solution to current puzzle
 */
export interface GetSolutionQuery extends Query {
  type: 'GET_SOLUTION'
}

// ============================================================================
// TIME/STATS QUERIES
// ============================================================================

/**
 * GetElapsedTimeQuery: how long game has been active
 */
export interface GetElapsedTimeQuery extends Query {
  type: 'GET_ELAPSED_TIME'
}

/**
 * GetGameStatsQuery: performance metrics for current game
 */
export interface GetGameStatsQuery extends Query {
  type: 'GET_GAME_STATS'
  payload?: {
    includeProjections?: boolean  // estimate final stats if incomplete
  }
}

/**
 * GetHintCountQuery: how many hints used
 */
export interface GetHintCountQuery extends Query {
  type: 'GET_HINT_COUNT'
}

/**
 * GetGameStateQuery: full game state (paused, playing, completed)
 */
export interface GetGameStateQuery extends Query {
  type: 'GET_GAME_STATE'
}

// ============================================================================
// DIFFICULTY ANALYSIS QUERIES
// ============================================================================

/**
 * GetDifficultyScoreQuery: estimate difficulty level
 */
export interface GetDifficultyScoreQuery extends Query {
  type: 'GET_DIFFICULTY_SCORE'
}

/**
 * GetRemainingConstraintsQuery: how many unsatisfied constraints?
 */
export interface GetRemainingConstraintsQuery extends Query {
  type: 'GET_REMAINING_CONSTRAINTS'
}

/**
 * GetResolvedConstraintsQuery: how many constraints satisfied?
 */
export interface GetResolvedConstraintsQuery extends Query {
  type: 'GET_RESOLVED_CONSTRAINTS'
}

/**
 * EstimateSolveTimeQuery: projected time to solve from current state
 */
export interface EstimateSolveTimeQuery extends Query {
  type: 'ESTIMATE_SOLVE_TIME'
}

// ============================================================================
// HINT/ASSIST QUERIES
// ============================================================================

/**
 * GetNextHintQuery: determine best hint to provide
 */
export interface GetNextHintQuery extends Query {
  type: 'GET_NEXT_HINT'
  payload?: {
    hintType?: 'value' | 'candidates' | 'constraint' | 'technique'
    difficulty?: string
  }
}

/**
 * GetCandidatesForCellQuery: possible values + reasoning
 */
export interface GetCandidatesForCellQuery extends Query {
  type: 'GET_CANDIDATES_FOR_CELL'
  payload: {
    cellId: string
  }
}

/**
 * GetConstraintTechniqueQuery: hint about solving technique
 */
export interface GetConstraintTechniqueQuery extends Query {
  type: 'GET_CONSTRAINT_TECHNIQUE'
  payload?: {
    difficulty?: string
  }
}

// ============================================================================
// PREFERENCES QUERIES
// ============================================================================

/**
 * GetSettingsQuery: read game preferences
 */
export interface GetSettingsQuery extends Query {
  type: 'GET_SETTINGS'
}

/**
 * GetThemeQuery: current color scheme
 */
export interface GetThemeQuery extends Query {
  type: 'GET_THEME'
}

// ============================================================================
// UNION TYPE FOR ALL QUERIES
// ============================================================================

export type PuzzleQuery =
  | GetPuzzleStateQuery
  | GetPuzzleTypeQuery
  | GetDifficultyQuery
  | GetInitialStateQuery
  | GetMoveCountQuery
  | GetMoveHistoryQuery
  | GetUndoStackQuery
  | GetRedoStackQuery
  | CanUndoQuery
  | CanRedoQuery
  | GetCellValueQuery
  | GetCellCandidatesQuery
  | GetConflictingCellsQuery
  | HasConstraintViolationQuery
  | IsCompletedQuery
  | IsValidQuery
  | IsSolvableQuery
  | GetSolutionQuery
  | GetElapsedTimeQuery
  | GetGameStatsQuery
  | GetHintCountQuery
  | GetGameStateQuery
  | GetDifficultyScoreQuery
  | GetRemainingConstraintsQuery
  | GetResolvedConstraintsQuery
  | EstimateSolveTimeQuery
  | GetNextHintQuery
  | GetCandidatesForCellQuery
  | GetConstraintTechniqueQuery
  | GetSettingsQuery
  | GetThemeQuery

// ============================================================================
// QUERY TYPE GUARDS
// ============================================================================

export const isGetPuzzleStateQuery = (query: Query): query is GetPuzzleStateQuery =>
  query.type === 'GET_PUZZLE_STATE'

export const isGetCellValueQuery = (query: Query): query is GetCellValueQuery =>
  query.type === 'GET_CELL_VALUE'

export const isIsCompletedQuery = (query: Query): query is IsCompletedQuery =>
  query.type === 'IS_COMPLETED'

export const isGetGameStatsQuery = (query: Query): query is GetGameStatsQuery =>
  query.type === 'GET_GAME_STATS'

export const isGetMoveHistoryQuery = (query: Query): query is GetMoveHistoryQuery =>
  query.type === 'GET_MOVE_HISTORY'

export const isGetNextHintQuery = (query: Query): query is GetNextHintQuery =>
  query.type === 'GET_NEXT_HINT'

export const isCanUndoQuery = (query: Query): query is CanUndoQuery =>
  query.type === 'CAN_UNDO'

export const isCanRedoQuery = (query: Query): query is CanRedoQuery =>
  query.type === 'CAN_REDO'
