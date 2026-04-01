/**
 * CQRS Infrastructure (Command Query Responsibility Segregation)
 *
 * Separates read operations (queries) from write operations (commands)
 * Commands change state, queries retrieve state
 * All state changes flow through CommandBus for auditability
 *
 * Pattern:
 * 1. User action (e.g., click cell) → dispatch Command
 * 2. CommandBus executes command → state mutation + event emission
 * 3. Subscribers receive event → update React state
 * 4. Query operations read current state (no side effects)
 *
 * Benefits:
 * - Single source of truth for state mutations
 * - Audit trail of all actions (replay, debugging)
 * - Decoupled: UI doesn't need to know implementation
 * - Testable: commands/queries are pure functions
 */

// ============================================================================
// COMMAND & EVENT TYPES
// ============================================================================

/**
 * Command: request to mutate state
 * Returns promise that resolves when mutation completes
 *
 * Types: ASSIGN_VALUE, UNDO_MOVE, HINT, PAUSE_GAME, etc.
 */
export interface Command<T = any> {
  type: string
  payload: T
  timestamp: number
  userId?: string
}

/**
 * CommandResult: response from executing command
 */
export interface CommandResult<T = any> {
  success: boolean
  newState?: T
  error?: string
  metadata?: Record<string, any>
}

/**
 * Event: result of command execution
 * Emitted to subscribers for state synchronization
 *
 * Types: VALUE_ASSIGNED, MOVE_UNDONE, HINT_PROVIDED, GAME_PAUSED, etc.
 */
export interface DomainEvent<T = any> {
  type: string
  aggregateId: string  // Game ID or puzzle ID
  timestamp: number
  data: T
  commandId?: string   // Link to originating command
}

/**
 * Query: request to read state (no side effects)
 */
export interface Query<T = any> {
  type: string
  payload?: T
}

/**
 * QueryResult: response from executing query
 */
export interface QueryResult<T = any> {
  data: T
  timestamp: number
}

// ============================================================================
// COMMAND HANDLER
// ============================================================================

/**
 * CommandHandler: executes command and returns result
 * All state mutations go through handlers (single point of control)
 *
 * Signature: (state, command) => { newState, event }
 */
export type CommandHandler<S, C extends Command, E extends DomainEvent> = (
  state: S,
  command: C,
) => CommandResult & { event?: E }

/**
 * CommandBus: central dispatcher for commands
 * Routes command to handler, emits event, notifies subscribers
 */
export class CommandBus<S> {
  private handlers = new Map<string, CommandHandler<S, any, any>>()
  private subscribers = new Map<string, Set<(event: DomainEvent) => void>>()
  private eventHistory: DomainEvent[] = []

  /**
   * Register command handler
   * Example: bus.register('ASSIGN_VALUE', assignValueHandler)
   */
  register<C extends Command, E extends DomainEvent>(
    commandType: string,
    handler: CommandHandler<S, C, E>,
  ): void {
    this.handlers.set(commandType, handler)
  }

  /**
   * Execute command: validate → handler → emit event → return result
   */
  execute(state: S, command: Command): CommandResult {
    const handler = this.handlers.get(command.type)

    if (!handler) {
      return {
        success: false,
        error: `Unknown command type: ${command.type}`,
      }
    }

    try {
      const result = handler(state, command)

      // Emit event to subscribers
      if (result.event) {
        this.emit(result.event)
      }

      return {
        success: result.success,
        newState: result.newState,
        metadata: result.metadata,
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      }
    }
  }

  /**
   * Subscribe to events of specific type
   * Example: bus.subscribe('VALUE_ASSIGNED', (event) => { ... })
   */
  subscribe(eventType: string, callback: (event: DomainEvent) => void): () => void {
    if (!this.subscribers.has(eventType)) {
      this.subscribers.set(eventType, new Set())
    }

    this.subscribers.get(eventType)!.add(callback)

    // Return unsubscribe function
    return () => {
      this.subscribers.get(eventType)?.delete(callback)
    }
  }

  /**
   * Emit event: notify all subscribers
   */
  private emit(event: DomainEvent): void {
    this.eventHistory.push(event)

    const subscribers = this.subscribers.get(event.type)
    if (subscribers) {
      subscribers.forEach((callback) => {
        try {
          callback(event)
        } catch (error) {
          console.error(`[CommandBus] Subscriber error for ${event.type}:`, error)
        }
      })
    }
  }

  /**
   * Get event history (replay capability)
   */
  getHistory(): DomainEvent[] {
    return [...this.eventHistory]
  }

  /**
   * Clear history (for testing or between games)
   */
  clearHistory(): void {
    this.eventHistory = []
  }
}

// ============================================================================
// QUERY HANDLER
// ============================================================================

/**
 * QueryHandler: executes query and returns result (no side effects)
 */
export type QueryHandler<S, Q extends Query, R> = (state: S, query: Q) => R

/**
 * QueryBus: central dispatcher for queries
 * Routes query to handler, returns result
 */
export class QueryBus<S> {
  private handlers = new Map<string, QueryHandler<S, any, any>>()

  /**
   * Register query handler
   */
  register<Q extends Query, R>(
    queryType: string,
    handler: QueryHandler<S, Q, R>,
  ): void {
    this.handlers.set(queryType, handler)
  }

  /**
   * Execute query: validate → handler → return result
   */
  execute<R>(state: S, query: Query): QueryResult<R> {
    const handler = this.handlers.get(query.type)

    if (!handler) {
      throw new Error(`Unknown query type: ${query.type}`)
    }

    try {
      const data = handler(state, query)
      return {
        data,
        timestamp: Date.now(),
      }
    } catch (error) {
      throw error instanceof Error
        ? error
        : new Error(`Query error: ${String(error)}`)
    }
  }
}

// ============================================================================
// EVENT STORE (SIMPLE IMPLEMENTATION)
// ============================================================================

/**
 * EventStore: append-only log of domain events
 * Supports event sourcing (rebuild state from event history)
 * Used for audit trail, replay, persistence
 */
export class EventStore {
  private events: DomainEvent[] = []

  /**
   * Append event to store
   */
  append(event: DomainEvent): void {
    this.events.push(event)
  }

  /**
   * Get all events
   */
  getAll(): DomainEvent[] {
    return [...this.events]
  }

  /**
   * Get events for specific aggregate (game/puzzle)
   */
  getForAggregate(aggregateId: string): DomainEvent[] {
    return this.events.filter((e) => e.aggregateId === aggregateId)
  }

  /**
   * Get events since timestamp
   */
  getSince(timestamp: number): DomainEvent[] {
    return this.events.filter((e) => e.timestamp >= timestamp)
  }

  /**
   * Clear store (for testing)
   */
  clear(): void {
    this.events = []
  }
}

/**
 * Snapshot: compressed state at point in time
 * Used to avoid replaying all events (performance optimization)
 */
export interface Snapshot<S> {
  aggregateId: string
  state: S
  version: number  // event count when snapshot created
  timestamp: number
}

/**
 * SnapshotStore: manages snapshots for event sourcing
 */
export class SnapshotStore<S> {
  private snapshots = new Map<string, Snapshot<S>>()

  /**
   * Save snapshot
   */
  save(snapshot: Snapshot<S>): void {
    this.snapshots.set(snapshot.aggregateId, snapshot)
  }

  /**
   * Get latest snapshot for aggregate
   */
  get(aggregateId: string): Snapshot<S> | undefined {
    return this.snapshots.get(aggregateId)
  }

  /**
   * Delete snapshot
   */
  delete(aggregateId: string): void {
    this.snapshots.delete(aggregateId)
  }
}

export type { CommandHandler, QueryHandler }
