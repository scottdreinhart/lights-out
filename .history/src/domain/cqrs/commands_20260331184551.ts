/**
 * Domain Commands for Puzzle Games
 *
 * Commands are requests to mutate game state
 * Each command has a handler that validates and executes it
 * Handlers emit domain events for subscribers to react to
 *
 * Usage Pattern:
 * 1. User clicks cell → dispatch AssignValueCommand
 * 2. CommandBus validates and executes handler
 * 3. Handler updates state and emits ValueAssignedEvent
 * 4. React component subscribes to ValueAssignedEvent → UI updates
 */

import type { Command } from './infrastructure'

// ============================================================================
// PUZZLE SETUP COMMANDS
// ============================================================================

/**
 * CreatePuzzleCommand: generate new puzzle
 */
export interface CreatePuzzleCommand extends Command {
  type: 'CREATE_PUZZLE'
  payload: {
    puzzleType: string  // 'sudoku', 'queens', 'tango', etc.
    difficulty: string  // 'easy', 'medium', 'hard'
    templateCSP?: Record<string, any>  // optional: preset puzzle
  }
}

/**
 * LoadPuzzleCommand: load saved or preset puzzle
 */
export interface LoadPuzzleCommand extends Command {
  type: 'LOAD_PUZZLE'
  payload: {
    puzzleType: string
    puzzleId: string
    initialState: Record<string, any>
  }
}

/**
 * RestartPuzzleCommand: reset current puzzle to initial state
 */
export interface RestartPuzzleCommand extends Command {
  type: 'RESTART_PUZZLE'
  payload: {
    puzzleType: string
  }
}

// ============================================================================
// MOVE COMMANDS
// ============================================================================

/**
 * AssignValueCommand: user assigns value to cell/variable
 */
export interface AssignValueCommand extends Command {
  type: 'ASSIGN_VALUE'
  payload: {
    cellId: string
    value: string | number
    isUser: boolean  // true = user manual input, false = system/hint
  }
}

/**
 * ClearCellCommand: user removes value from cell
 */
export interface ClearCellCommand extends Command {
  type: 'CLEAR_CELL'
  payload: {
    cellId: string
  }
}

/**
 * MakeMoveCommand: complex move (may affect multiple cells)
 * Used for moves that require constraint propagation
 */
export interface MakeMoveCommand extends Command {
  type: 'MAKE_MOVE'
  payload: {
    cellUpdates: Record<string, string | number>  // cellId → value
  }
}

// ============================================================================
// UNDO/REDO COMMANDS
// ============================================================================

/**
 * UndoCommand: revert last move
 */
export interface UndoCommand extends Command {
  type: 'UNDO'
  payload: {
    steps: number  // how many moves to undo (default 1)
  }
}

/**
 * RedoCommand: restore undone move
 */
export interface RedoCommand extends Command {
  type: 'REDO'
  payload: {
    steps: number  // how many moves to redo (default 1)
  }
}

// ============================================================================
// HINT COMMANDS
// ============================================================================

/**
 * RequestHintCommand: user asks for assistance
 */
export interface RequestHintCommand extends Command {
  type: 'REQUEST_HINT'
  payload: {
    hintType: 'value' | 'candidates' | 'constraint' | 'technique'
    difficulty?: string  // 'beginner', 'advanced', etc.
  }
}

/**
 * RevealSolutionCommand: show solution (user gives up)
 */
export interface RevealSolutionCommand extends Command {
  type: 'REVEAL_SOLUTION'
  payload: {
    confirmed: boolean  // confirm user really wants to give up
  }
}

// ============================================================================
// GAME STATE COMMANDS
// ============================================================================

/**
 * PauseGameCommand: pause game (timer stops)
 */
export interface PauseGameCommand extends Command {
  type: 'PAUSE_GAME'
  payload: Record<string, any>  // empty
}

/**
 * ResumeGameCommand: resume paused game
 */
export interface ResumeGameCommand extends Command {
  type: 'RESUME_GAME'
  payload: Record<string, any>  // empty
}

/**
 * QuitGameCommand: abandon puzzle
 */
export interface QuitGameCommand extends Command {
  type: 'QUIT_GAME'
  payload: {
    confirmed: boolean  // confirm user wants to quit
  }
}

// ============================================================================
// SETTINGS/PREFERENCES COMMANDS
// ============================================================================

/**
 * ChangeSettingsCommand: update game preferences
 */
export interface ChangeSettingsCommand extends Command {
  type: 'CHANGE_SETTINGS'
  payload: {
    highlightConflicts?: boolean
    showCandidates?: boolean
    showTimer?: boolean
    autoSave?: boolean
    theme?: string
  }
}

/**
 * SelectDifficultyCommand: change difficulty level
 */
export interface SelectDifficultyCommand extends Command {
  type: 'SELECT_DIFFICULTY'
  payload: {
    difficulty: string  // 'easy', 'medium', 'hard'
  }
}

// ============================================================================
// ANALYTICS COMMANDS
// ============================================================================

/**
 * RecordStatsCommand: log game completion stats
 */
export interface RecordStatsCommand extends Command {
  type: 'RECORD_STATS'
  payload: {
    puzzleType: string
    difficulty: string
    solveTime: number
    moveCount: number
    hintsUsed: number
    completed: boolean
  }
}

/**
 * UpdateStreakCommand: update user achievement streak
 */
export interface UpdateStreakCommand extends Command {
  type: 'UPDATE_STREAK'
  payload: {
    streakType: string  // 'daily', 'weekly', 'consecutive'
    increment: number
  }
}

// ============================================================================
// UNION TYPE FOR ALL COMMANDS
// ============================================================================

export type PuzzleCommand =
  | CreatePuzzleCommand
  | LoadPuzzleCommand
  | RestartPuzzleCommand
  | AssignValueCommand
  | ClearCellCommand
  | MakeMoveCommand
  | UndoCommand
  | RedoCommand
  | RequestHintCommand
  | RevealSolutionCommand
  | PauseGameCommand
  | ResumeGameCommand
  | QuitGameCommand
  | ChangeSettingsCommand
  | SelectDifficultyCommand
  | RecordStatsCommand
  | UpdateStreakCommand

// ============================================================================
// COMMAND TYPE GUARDS
// ============================================================================

export const isAssignValueCommand = (command: Command): command is AssignValueCommand =>
  command.type === 'ASSIGN_VALUE'

export const isClearCellCommand = (command: Command): command is ClearCellCommand =>
  command.type === 'CLEAR_CELL'

export const isUndoCommand = (command: Command): command is UndoCommand =>
  command.type === 'UNDO'

export const isRedoCommand = (command: Command): command is RedoCommand =>
  command.type === 'REDO'

export const isCreatePuzzleCommand = (command: Command): command is CreatePuzzleCommand =>
  command.type === 'CREATE_PUZZLE'

export const isPauseGameCommand = (command: Command): command is PauseGameCommand =>
  command.type === 'PAUSE_GAME'

export const isQuitGameCommand = (command: Command): command is QuitGameCommand =>
  command.type === 'QUIT_GAME'
