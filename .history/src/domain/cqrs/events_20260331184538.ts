/**
 * Domain Events for Puzzle Games
 *
 * Events emitted when Commands succeed
 * Used for:
 * - React state synchronization (via subscribers)
 * - Audit trail (event store)
 * - Replay/undo (event history)
 * - Analytics (event logging)
 */

import type { DomainEvent } from './infrastructure'

// ============================================================================
// PUZZLE LIFECYCLE EVENTS
// ============================================================================

/**
 * PuzzleCreatedEvent: new puzzle generated
 */
export interface PuzzleCreatedEvent extends DomainEvent {
  type: 'PUZZLE_CREATED'
  aggregateId: string  // puzzle ID
  data: {
    puzzleType: string  // 'sudoku', 'queens', 'tango', etc.
    difficulty: string  // 'easy', 'medium', 'hard'
    initialState: Record<string, any>  // CSP state
    estimatedTime: number  // milliseconds
  }
}

/**
 * PuzzleLoadedEvent: existing puzzle loaded
 */
export interface PuzzleLoadedEvent extends DomainEvent {
  type: 'PUZZLE_LOADED'
  aggregateId: string
  data: {
    puzzleType: string
    savedAt: number
    moveCount: number
  }
}

/**
 * PuzzleCompletedEvent: puzzle solved (all constraints satisfied)
 */
export interface PuzzleCompletedEvent extends DomainEvent {
  type: 'PUZZLE_COMPLETED'
  aggregateId: string
  data: {
    solveTime: number  // milliseconds
    moveCount: number
    hintsUsed: number
    difficulty: string
  }
}

/**
 * PuzzleAbandonedEvent: user quit without solving
 */
export interface PuzzleAbandonedEvent extends DomainEvent {
  type: 'PUZZLE_ABANDONED'
  aggregateId: string
  data: {
    movesMade: number
    timeSpent: number
  }
}

// ============================================================================
// MOVE/ACTION EVENTS
// ============================================================================

/**
 * ValueAssignedEvent: user assigned value to cell/variable
 */
export interface ValueAssignedEvent extends DomainEvent {
  type: 'VALUE_ASSIGNED'
  aggregateId: string
  data: {
    cellId: string  // unique cell identifier
    value: string | number
    timestamp: number
    isUser: boolean  // true = user action, false = system generated
  }
}

/**
 * ValueUnassignedEvent: user cleared cell/variable
 */
export interface ValueUnassignedEvent extends DomainEvent {
  type: 'VALUE_UNASSIGNED'
  aggregateId: string
  data: {
    cellId: string
    previousValue: string | number
  }
}

/**
 * ConstraintViolationDetectedEvent: user action violates constraint
 */
export interface ConstraintViolationDetectedEvent extends DomainEvent {
  type: 'CONSTRAINT_VIOLATION_DETECTED'
  aggregateId: string
  data: {
    cellId: string
    violatingValue: string | number
    constraintType: string  // 'row', 'column', 'box', 'uniqueness', etc.
    conflictingCells: string[]
  }
}

/**
 * ConstraintResolvedEvent: user fixed constraint violation
 */
export interface ConstraintResolvedEvent extends DomainEvent {
  type: 'CONSTRAINT_RESOLVED'
  aggregateId: string
  data: {
    cellId: string
    correctValue: string | number
  }
}

// ============================================================================
// UNDO/REDO EVENTS
// ============================================================================

/**
 * MoveUndoneEvent: last action reverted
 */
export interface MoveUndoneEvent extends DomainEvent {
  type: 'MOVE_UNDONE'
  aggregateId: string
  data: {
    movedCellIds: string[]
    restoredValues: Record<string, string | number>
  }
}

/**
 * MoveRedoneEvent: undo action reverted
 */
export interface MoveRedoneEvent extends DomainEvent {
  type: 'MOVE_REDONE'
  aggregateId: string
  data: {
    restoredCellIds: string[]
  }
}

// ============================================================================
// HINTS & ASSISTANCE
// ============================================================================

/**
 * HintProvidedEvent: user requested hint
 */
export interface HintProvidedEvent extends DomainEvent {
  type: 'HINT_PROVIDED'
  aggregateId: string
  data: {
    cellId: string
    hintType: 'value' | 'candidates' | 'constraint' | 'technique'  // what kind of hint
    hint: string | number | string[]  // the hint itself
    difficulty: string  // 'beginner', 'advanced', etc.
  }
}

/**
 * SolutionRevealedEvent: user showed solution (give up)
 */
export interface SolutionRevealedEvent extends DomainEvent {
  type: 'SOLUTION_REVEALED'
  aggregateId: string
  data: {
    solvedValues: Record<string, string | number>
    moveCount: number
  }
}

// ============================================================================
// GAME STATE EVENTS
// ============================================================================

/**
 * GamePausedEvent: game paused (timer stopped)
 */
export interface GamePausedEvent extends DomainEvent {
  type: 'GAME_PAUSED'
  aggregateId: string
  data: {
    timeSpent: number
    moveCount: number
  }
}

/**
 * GameResumedEvent: game resumed (timer restarted)
 */
export interface GameResumedEvent extends DomainEvent {
  type: 'GAME_RESUMED'
  aggregateId: string
  data: {
    resumedAt: number
  }
}

/**
 * GameRestartedEvent: user started fresh puzzle
 */
export interface GameRestartedEvent extends DomainEvent {
  type: 'GAME_RESTARTED'
  aggregateId: string
  data: {
    puzzleType: string
    difficulty: string
  }
}

// ============================================================================
// PERFORMANCE & ANALYTICS EVENTS
// ============================================================================

/**
 * StatsRecordedEvent: performance metrics recorded
 */
export interface StatsRecordedEvent extends DomainEvent {
  type: 'STATS_RECORDED'
  aggregateId: string
  data: {
    puzzleType: string
    difficulty: string
    solveTime: number
    moveCount: number
    hintsUsed: number
    completed: boolean
  }
}

/**
 * StreakUpdatedEvent: user achievement milestone
 */
export interface StreakUpdatedEvent extends DomainEvent {
  type: 'STREAK_UPDATED'
  aggregateId: string
  data: {
    streakType: string  // 'daily', 'weekly', 'consecutive'
    streakCount: number
    milestone?: string  // 'first', '10_wins', '100_wins', etc.
  }
}

// ============================================================================
// UNION TYPE FOR ALL EVENTS
// ============================================================================

export type PuzzleEvent =
  | PuzzleCreatedEvent
  | PuzzleLoadedEvent
  | PuzzleCompletedEvent
  | PuzzleAbandonedEvent
  | ValueAssignedEvent
  | ValueUnassignedEvent
  | ConstraintViolationDetectedEvent
  | ConstraintResolvedEvent
  | MoveUndoneEvent
  | MoveRedoneEvent
  | HintProvidedEvent
  | SolutionRevealedEvent
  | GamePausedEvent
  | GameResumedEvent
  | GameRestartedEvent
  | StatsRecordedEvent
  | StreakUpdatedEvent

// ============================================================================
// EVENT TYPE GUARDS
// ============================================================================

export const isPuzzleCreatedEvent = (event: DomainEvent): event is PuzzleCreatedEvent =>
  event.type === 'PUZZLE_CREATED'

export const isValueAssignedEvent = (event: DomainEvent): event is ValueAssignedEvent =>
  event.type === 'VALUE_ASSIGNED'

export const isPuzzleCompletedEvent = (event: DomainEvent): event is PuzzleCompletedEvent =>
  event.type === 'PUZZLE_COMPLETED'

export const isConstraintViolationEvent = (
  event: DomainEvent,
): event is ConstraintViolationDetectedEvent => event.type === 'CONSTRAINT_VIOLATION_DETECTED'

export const isStatsRecordedEvent = (event: DomainEvent): event is StatsRecordedEvent =>
  event.type === 'STATS_RECORDED'
