/**
 * useCQRS: React hook for CQRS state management
 *
 * Manages:
 * - CommandBus: dispatch commands
 * - QueryBus: execute queries
 * - Event subscriptions: subscribe to domain events
 * - Game state: maintain current puzzle/game state
 * - Undo/Redo: manage move history
 *
 * Pattern:
 * const { dispatch, query, state } = useCQRS()
 * await dispatch(AssignValueCommand)  // change state
 * const isComplete = query(IsCompletedQuery)  // read state
 */

import { useCallback, useEffect, useRef, useState } from 'react'
import {
  CommandBus,
  QueryBus,
  EventStore,
  type Command,
  type Query,
  type QueryResult,
  type CommandResult,
  type DomainEvent,
} from '@/domain/cqrs'

// ============================================================================
// TYPES
// ============================================================================

/**
 * GameState: current puzzle/game data
 */
export interface GameState {
  puzzleId: string
  puzzleType: string
  difficulty: string
  currentAssignments: Record<string, string | number>  // cellId → value
  initialState: Record<string, string | number>
  moveHistory: Array<{
    cellId: string
    value: string | number
    timestamp: number
  }>
  undoStack: typeof moveHistory
  redoStack: typeof moveHistory
  isPaused: boolean
  startTime: number
  pausedTime: number
  hintsUsed: number
  solved: boolean
  solveTime?: number
}

/**
 * CQRSContextValue: state and dispatch methods
 */
export interface CQRSContextValue {
  state: GameState
  dispatch: (command: Command) => Promise<CommandResult>
  query: <R>(query: Query) => QueryResult<R>
  subscribe: (eventType: string, callback: (event: DomainEvent) => void) => () => void
  getEventHistory: () => DomainEvent[]
  clearGame: () => void
}

// ============================================================================
// HOOK: useCQRS
// ============================================================================

/**
 * useCQRS: Central CQRS hook for puzzle game state management
 *
 * Provides:
 * - CommandBus for dispatching state-changing commands
 * - QueryBus for reading state without side effects
 * - EventStore for audit trail
 * - Event subscriptions for reactive updates
 * - Game state management
 *
 * Usage:
 * const { dispatch, query, state } = useCQRS()
 * await dispatch({ type: 'ASSIGN_VALUE', payload: { cellId: 'A1', value: 5 } })
 * const stats = query({ type: 'GET_GAME_STATS' })
 * subscribe('VALUE_ASSIGNED', (event) => { console.log('Cell assigned:', event) })
 */
export const useCQRS = (): CQRSContextValue => {
  // ========================================================================
  // STATE
  // ========================================================================

  const [gameState, setGameState] = useState<GameState>({
    puzzleId: '',
    puzzleType: '',
    difficulty: 'medium',
    currentAssignments: {},
    initialState: {},
    moveHistory: [],
    undoStack: [],
    redoStack: [],
    isPaused: false,
    startTime: Date.now(),
    pausedTime: 0,
    hintsUsed: 0,
    solved: false,
  })

  // ========================================================================
  // REFS: CommandBus, QueryBus, EventStore (initialized once)
  // ========================================================================

  const commandBusRef = useRef<CommandBus<GameState>>(new CommandBus())
  const queryBusRef = useRef<QueryBus<GameState>>(new QueryBus())
  const eventStoreRef = useRef<EventStore>(new EventStore())

  // ========================================================================
  // DISPATCH: Execute command, update state, emit event
  // ========================================================================

  const dispatch = useCallback(
    async (command: Command): Promise<CommandResult> => {
      try {
        const result = commandBusRef.current.execute(gameState, command)

        // Update React state if command succeeded and returned new state
        if (result.success && result.newState) {
          setGameState(result.newState)

          // Store event in event store for audit trail
          // (note: event is created by handler, not here)
        }

        return result
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : String(error),
        }
      }
    },
    [gameState],
  )

  // ========================================================================
  // QUERY: Execute query without side effects
  // ========================================================================

  const query = useCallback(
    <R,>(queryObj: Query): QueryResult<R> => {
      try {
        return queryBusRef.current.execute<R>(gameState, queryObj)
      } catch (error) {
        throw error instanceof Error ? error : new Error(String(error))
      }
    },
    [gameState],
  )

  // ========================================================================
  // EVENT SUBSCRIPTION
  // ========================================================================

  const subscribe = useCallback(
    (eventType: string, callback: (event: DomainEvent) => void): (() => void) => {
      return commandBusRef.current.subscribe(eventType, callback)
    },
    [],
  )

  // ========================================================================
  // EVENT HISTORY
  // ========================================================================

  const getEventHistory = useCallback(() => {
    return eventStoreRef.current.getAll()
  }, [])

  // ========================================================================
  // CLEAR/RESET GAME
  // ========================================================================

  const clearGame = useCallback(() => {
    setGameState({
      puzzleId: '',
      puzzleType: '',
      difficulty: 'medium',
      currentAssignments: {},
      initialState: {},
      moveHistory: [],
      undoStack: [],
      redoStack: [],
      isPaused: false,
      startTime: Date.now(),
      pausedTime: 0,
      hintsUsed: 0,
      solved: false,
    })
    eventStoreRef.current.clear()
  }, [])

  // ========================================================================
  // CLEANUP
  // ========================================================================

  useEffect(() => {
    return () => {
      // Optional: cleanup if needed
    }
  }, [])

  // ========================================================================
  // RETURN CONTEXT
  // ========================================================================

  return {
    state: gameState,
    dispatch,
    query,
    subscribe,
    getEventHistory,
    clearGame,
  }
}

// ============================================================================
// HELPER HOOK: useCommand
// ============================================================================

/**
 * useCommand: Simplified hook for dispatching single command type
 *
 * Usage:
 * const assignValue = useCommand('ASSIGN_VALUE')
 * await assignValue({ cellId: 'A1', value: 5 })
 */
export const useCommand = (cqrs: CQRSContextValue, commandType: string) => {
  return useCallback(
    async (payload: Record<string, any>) => {
      return cqrs.dispatch({
        type: commandType,
        payload,
        timestamp: Date.now(),
      })
    },
    [cqrs, commandType],
  )
}

// ============================================================================
// HELPER HOOK: useQuery
// ============================================================================

/**
 * useQuery: Simplified hook for dispatching single query type
 *
 * Usage:
 * const getMoveCount = useQuery('GET_MOVE_COUNT')
 * const count = getMoveCount()
 */
export const useQuery = <R,>(cqrs: CQRSContextValue, queryType: string) => {
  return useCallback(
    (payload?: Record<string, any>) => {
      return cqrs.query<R>({
        type: queryType,
        payload,
      })
    },
    [cqrs, queryType],
  )
}

// ============================================================================
// HELPER HOOK: useEventSubscription
// ============================================================================

/**
 * useEventSubscription: Auto-cleanup subscription on mount/unmount
 *
 * Usage:
 * useEventSubscription(cqrs, 'VALUE_ASSIGNED', (event) => {
 *   console.log('Cell assigned:', event.data)
 * })
 */
export const useEventSubscription = (
  cqrs: CQRSContextValue,
  eventType: string,
  callback: (event: DomainEvent) => void,
) => {
  useEffect(() => {
    const unsubscribe = cqrs.subscribe(eventType, callback)
    return unsubscribe
  }, [cqrs, eventType, callback])
}

// ============================================================================
// HELPER HOOK: useGameStats
// ============================================================================

/**
 * useGameStats: Compute real-time game statistics
 *
 * Returns stats derived from current game state
 */
export const useGameStats = (cqrs: CQRSContextValue) => {
  const stats = cqrs.query({
    type: 'GET_GAME_STATS',
    payload: { includeProjections: true },
  })

  return stats.data
}
