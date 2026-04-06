/**
 * Generic cell state FSM for grid-based games
 *
 * Supports common cell state types across different game families:
 * - Battleship: empty, ship, hit, miss
 * - Sudoku: empty, filled, error, candidate, pencil marks
 * - Minesweeper: empty, flagged, revealed, mine
 * - Checkers: empty, piece, king, selected
 * - Custom: any game-specific states
 */

export type CellStateTransition<S> = readonly [S, S]

export interface CellStateFsmConfig<S> {
  /**
   * Allowed transitions: [from, to] pairs
   * If a transition is not listed, it is forbidden
   */
  transitions: CellStateTransition<S>[]

  /**
   * Terminal states (no transitions out)
   * If empty, any state without outgoing transitions is terminal
   */
  terminal?: S[]
}

/**
 * Generic cell state finite state machine
 * Ensures valid state transitions in grid-based games
 */
export class CellStateFsm<S> {
  private transitionMap: Map<S, Set<S>> = new Map()
  private terminalStates: Set<S> = new Set()

  constructor(config: CellStateFsmConfig<S>) {
    // Build transition lookup map
    for (const [from, to] of config.transitions) {
      if (!this.transitionMap.has(from)) {
        this.transitionMap.set(from, new Set())
      }
      this.transitionMap.get(from)!.add(to)
    }

    // Mark terminal states
    if (config.terminal) {
      for (const state of config.terminal) {
        this.terminalStates.add(state)
      }
    } else {
      // Auto-detect: states with no outgoing transitions are terminal
      const allFromStates = new Set(config.transitions.map(([from]) => from))
      for (const state of allFromStates) {
        if (!this.transitionMap.get(state)?.size) {
          this.terminalStates.add(state)
        }
      }
    }
  }

  /**
   * Check if transition is valid
   */
  canTransition(from: S, to: S): boolean {
    if (this.terminalStates.has(from)) {
      return false // Terminal states cannot transition
    }
    return this.transitionMap.get(from)?.has(to) ?? false
  }

  /**
   * Get valid next states for a given state
   */
  validNextStates(from: S): S[] {
    if (this.terminalStates.has(from)) {
      return []
    }
    const next = this.transitionMap.get(from)
    return next ? Array.from(next) : []
  }

  /**
   * Check if state is terminal
   */
  isTerminal(state: S): boolean {
    return this.terminalStates.has(state)
  }

  /**
   * Apply transition with validation
   * Returns new state on success, null if invalid
   */
  transition(from: S, to: S): S | null {
    if (this.canTransition(from, to)) {
      return to
    }
    return null
  }

  /**
   * Transition with error handling
   * Throws if invalid transition
   */
  transitionOrThrow(from: S, to: S): S {
    if (!this.canTransition(from, to)) {
      throw new Error(`Invalid transition: ${String(from)} → ${String(to)}`)
    }
    return to
  }
}

/**
 * Preset FSMs for common game types
 */

/**
 * Battleship cell states: empty → (ship or empty) → (hit or miss)
 */
export const BattleshipCellFsm = new CellStateFsm({
  transitions: [
    ['empty', 'ship'],
    ['ship', 'hit'],
    ['empty', 'hit'],
    ['empty', 'miss'],
  ] as const,
  terminal: ['hit', 'miss'],
})

/**
 * Minesweeper cell states
 */
export const MinesweeperCellFsm = new CellStateFsm({
  transitions: [
    ['hidden', 'revealed'],
    ['hidden', 'flagged'],
    ['flagged', 'hidden'],
  ] as const,
  terminal: ['revealed'],
})

/**
 * Simple game cell states
 */
export const SimpleCellFsm = new CellStateFsm({
  transitions: [
    ['empty', 'filled'],
    ['filled', 'empty'],
  ] as const,
  terminal: [],
})
