/**
 * Generic cell FSM (Finite State Machine) for grid-based games
 * Configurable state transitions for any game type (Battleship, Minesweeper, Sudoku, etc.)
 *
 * Usage:
 * const battleshipFSM = useGenericCellFSM({
 *   states: ['empty', 'ship', 'hit', 'miss'],
 *   transitions: {
 *     empty: ['ship', 'hit', 'miss'],
 *     ship: ['hit'],
 *     hit: [],
 *     miss: [],
 *   }
 * })
 */

export interface CellFSMConfig<T extends string = string> {
  states: readonly T[]
  transitions: Record<T, readonly T[]>
  initialState: T
}

export interface CellFSMResult<T extends string = string> {
  isValidTransition: (from: T, to: T) => boolean
  getValidNextStates: (current: T) => readonly T[]
  isTerminalState: (state: T) => boolean
  canTransitionFrom: (state: T) => boolean
}

/**
 * Create a cell FSM for any game type
 * Validates state transitions according to game rules
 */
export function createCellFSM<T extends string = string>(
  config: CellFSMConfig<T>,
): CellFSMResult<T> {
  const { states, transitions, initialState } = config

  // Validate configuration
  const allStates = new Set(states)
  if (!allStates.has(initialState)) {
    throw new Error(`Initial state '${initialState}' not in states list`)
  }

  for (const [state, nextStates] of Object.entries(transitions)) {
    if (!allStates.has(state as T)) {
      throw new Error(`Unknown state '${state}' in transitions`)
    }
    for (const next of nextStates as readonly string[]) {
      if (!allStates.has(next as T)) {
        throw new Error(`Unknown next state '${next}' for state '${state}'`)
      }
    }
  }

  return {
    /**
     * Check if a transition from 'from' to 'to' is valid
     */
    isValidTransition(from: T, to: T): boolean {
      const validNextStates = transitions[from] ?? []
      return validNextStates.includes(to)
    },

    /**
     * Get all valid next states for a given state
     */
    getValidNextStates(current: T): readonly T[] {
      return transitions[current] ?? []
    },

    /**
     * Check if a state is terminal (no outgoing transitions)
     */
    isTerminalState(state: T): boolean {
      const nextStates = transitions[state] ?? []
      return nextStates.length === 0
    },

    /**
     * Check if we can transition from a state (i.e., it's not terminal)
     */
    canTransitionFrom(state: T): boolean {
      return !this.isTerminalState(state)
    },
  }
}

/**
 * Pre-built FSM configurations for common game types
 */
export const CellFSMConfigs = {
  /**
   * Battleship: Empty → Ship, Hit, Miss | Ship → Hit | Hit, Miss terminal
   */
  battleship: {
    states: ['empty', 'ship', 'hit', 'miss'] as const,
    transitions: {
      empty: ['ship', 'hit', 'miss'],
      ship: ['hit'],
      hit: [],
      miss: [],
    } as const,
    initialState: 'empty' as const,
  },

  /**
   * Minesweeper: Hidden → Revealed, Flagged | Revealed, Flagged → Flagged
   */
  minesweeper: {
    states: ['hidden', 'revealed', 'flagged', 'question'] as const,
    transitions: {
      hidden: ['revealed', 'flagged', 'question'],
      revealed: ['flagged'],
      flagged: ['question', 'hidden'],
      question: ['hidden', 'flagged'],
    } as const,
    initialState: 'hidden' as const,
  },

  /**
   * Sudoku: Empty → Value, Candidates | Value, Candidates ↔ each other
   */
  sudoku: {
    states: ['empty', 'value', 'candidates', 'invalid', 'locked'] as const,
    transitions: {
      empty: ['value', 'candidates'],
      value: ['candidates', 'empty', 'locked'],
      candidates: ['value', 'empty'],
      invalid: ['value', 'candidates', 'empty'],
      locked: [], // Terminal
    } as const,
    initialState: 'empty' as const,
  },

  /**
   * Grid-based Puzzle: standard reveal pattern
   */
  puzzle: {
    states: ['hidden', 'revealed', 'flagged'] as const,
    transitions: {
      hidden: ['revealed', 'flagged'],
      revealed: ['flagged', 'hidden'],
      flagged: ['hidden', 'revealed'],
    } as const,
    initialState: 'hidden' as const,
  },
}

/**
 * Hook version for React components
 */
export function useGenericCellFSM<T extends string = string>(
  config: CellFSMConfig<T>,
): CellFSMResult<T> {
  // Create FSM on first call, reuse on subsequent renders
  const fsmRef = React.useRef<CellFSMResult<T> | null>(null)

  if (!fsmRef.current) {
    fsmRef.current = createCellFSM(config)
  }

  return fsmRef.current
}

// For convenience when using pre-built configs
export function usePrebuiltCellFSM<K extends keyof typeof CellFSMConfigs>(
  configKey: K,
): CellFSMResult<(typeof CellFSMConfigs)[K]['states'][number]> {
  const config = CellFSMConfigs[configKey]
  return useGenericCellFSM(config as CellFSMConfig)
}

import React from 'react'
