/**
 * CQRS Infrastructure Tests
 *
 * Tests:
 * - CommandBus: command registration, execution, event emission
 * - QueryBus: query registration, execution
 * - EventStore: event appending, retrieval, filtering
 * - Type guards: command/query/event discrimination
 * - Error handling: unknown commands, query failures
 */

import { describe, it, expect, beforeEach } from 'vitest'
import {
  CommandBus,
  QueryBus,
  EventStore,
  type Command,
  type CommandResult,
  type DomainEvent,
  type Query,
} from '@/domain/cqrs'

// ============================================================================
// TEST STATE
// ============================================================================

interface TestState {
  value: number
  name: string
}

// ============================================================================
// TESTS: CommandBus
// ============================================================================

describe('CommandBus', () => {
  let bus: CommandBus<TestState>
  let eventsSent: DomainEvent[] = []

  beforeEach(() => {
    bus = new CommandBus()
    eventsSent = []
  })

  it('should execute command with registered handler', () => {
    const handler = (state: TestState, command: Command) => ({
      success: true,
      newState: { ...state, value: state.value + 1 },
    })

    bus.register('INCREMENT', handler)

    const state: TestState = { value: 0, name: 'test' }
    const result = bus.execute(state, { type: 'INCREMENT', payload: null, timestamp: Date.now() })

    expect(result.success).toBe(true)
    expect(result.newState?.value).toBe(1)
  })

  it('should emit event when handler returns event', () => {
    const handler = (state: TestState, command: Command) => ({
      success: true,
      newState: { ...state, value: state.value + 1 },
      event: {
        type: 'VALUE_INCREMENTED',
        aggregateId: 'test-id',
        timestamp: Date.now(),
        data: { newValue: state.value + 1 },
      } as DomainEvent,
    })

    bus.register('INCREMENT', handler)
    bus.subscribe('VALUE_INCREMENTED', (event) => {
      eventsSent.push(event)
    })

    const state: TestState = { value: 0, name: 'test' }
    bus.execute(state, { type: 'INCREMENT', payload: null, timestamp: Date.now() })

    expect(eventsSent).toHaveLength(1)
    expect(eventsSent[0].type).toBe('VALUE_INCREMENTED')
  })

  it('should return error for unknown command', () => {
    const state: TestState = { value: 0, name: 'test' }
    const result = bus.execute(state, { type: 'UNKNOWN', payload: null, timestamp: Date.now() })

    expect(result.success).toBe(false)
    expect(result.error).toBeDefined()
  })

  it('should allow multiple subscribers to same event', () => {
    const handler = (state: TestState, command: Command) => ({
      success: true,
      newState: { ...state, value: state.value + 1 },
      event: {
        type: 'VALUE_UPDATED',
        aggregateId: 'id',
        timestamp: Date.now(),
        data: {},
      } as DomainEvent,
    })

    bus.register('UPDATE', handler)

    const subscriber1: DomainEvent[] = []
    const subscriber2: DomainEvent[] = []

    bus.subscribe('VALUE_UPDATED', (event) => {
      subscriber1.push(event)
    })
    bus.subscribe('VALUE_UPDATED', (event) => {
      subscriber2.push(event)
    })

    const state: TestState = { value: 0, name: 'test' }
    bus.execute(state, { type: 'UPDATE', payload: null, timestamp: Date.now() })

    expect(subscriber1).toHaveLength(1)
    expect(subscriber2).toHaveLength(1)
  })

  it('should allow unsubscribe from event', () => {
    const handler = (state: TestState, command: Command) => ({
      success: true,
      newState: state,
      event: {
        type: 'EVENT',
        aggregateId: 'id',
        timestamp: Date.now(),
        data: {},
      } as DomainEvent,
    })

    bus.register('TRIGGER', handler)

    const events: DomainEvent[] = []
    const unsubscribe = bus.subscribe('EVENT', (event) => {
      events.push(event)
    })

    // First execution: subscriber active
    const state: TestState = { value: 0, name: 'test' }
    bus.execute(state, { type: 'TRIGGER', payload: null, timestamp: Date.now() })
    expect(events).toHaveLength(1)

    // Unsubscribe
    unsubscribe()

    // Second execution: subscriber inactive
    bus.execute(state, { type: 'TRIGGER', payload: null, timestamp: Date.now() })
    expect(events).toHaveLength(1)  // still 1, not incremented
  })

  it('should provide event history', () => {
    const handler = (state: TestState, command: Command) => ({
      success: true,
      newState: state,
      event: {
        type: 'TESTED',
        aggregateId: 'id',
        timestamp: Date.now(),
        data: {},
      } as DomainEvent,
    })

    bus.register('ACTION', handler)

    const state: TestState = { value: 0, name: 'test' }
    bus.execute(state, { type: 'ACTION', payload: null, timestamp: Date.now() })
    bus.execute(state, { type: 'ACTION', payload: null, timestamp: Date.now() })

    const history = bus.getHistory()
    expect(history).toHaveLength(2)
    expect(history[0].type).toBe('TESTED')
  })
})

// ============================================================================
// TESTS: QueryBus
// ============================================================================

describe('QueryBus', () => {
  let bus: QueryBus<TestState>

  beforeEach(() => {
    bus = new QueryBus()
  })

  it('should execute query with registered handler', () => {
    const handler = (state: TestState) => state.value * 2

    bus.register('DOUBLE_VALUE', handler)

    const state: TestState = { value: 5, name: 'test' }
    const result = bus.execute(state, { type: 'DOUBLE_VALUE' })

    expect(result.data).toBe(10)
    expect(result.timestamp).toBeDefined()
  })

  it('should throw error for unknown query', () => {
    const state: TestState = { value: 0, name: 'test' }

    expect(() => {
      bus.execute(state, { type: 'UNKNOWN' })
    }).toThrow('Unknown query type')
  })

  it('should pass query payload to handler', () => {
    const handler = (_state: TestState, query: Query) => {
      return query.payload?.multiplier || 1
    }

    bus.register('MULTIPLY', handler)

    const state: TestState = { value: 5, name: 'test' }
    const result = bus.execute(state, { type: 'MULTIPLY', payload: { multiplier: 3 } })

    expect(result.data).toBe(3)
  })

  it('should not have side effects', () => {
    const handler = (state: TestState) => {
      // This handler intentionally doesn't change state
      return state.value
    }

    bus.register('READ_VALUE', handler)

    const state: TestState = { value: 42, name: 'test' }
    const result = bus.execute(state, { type: 'READ_VALUE' })

    expect(result.data).toBe(42)
    expect(state.value).toBe(42)  // unchanged
  })
})

// ============================================================================
// TESTS: EventStore
// ============================================================================

describe('EventStore', () => {
  let store: EventStore

  beforeEach(() => {
    store = new EventStore()
  })

  it('should append and retrieve events', () => {
    const event: DomainEvent = {
      type: 'TEST_EVENT',
      aggregateId: 'agg-1',
      timestamp: Date.now(),
      data: { message: 'test' },
    }

    store.append(event)

    const all = store.getAll()
    expect(all).toHaveLength(1)
    expect(all[0].type).toBe('TEST_EVENT')
  })

  it('should filter events by aggregateId', () => {
    const event1: DomainEvent = {
      type: 'EVENT',
      aggregateId: 'agg-1',
      timestamp: Date.now(),
      data: {},
    }

    const event2: DomainEvent = {
      type: 'EVENT',
      aggregateId: 'agg-2',
      timestamp: Date.now(),
      data: {},
    }

    store.append(event1)
    store.append(event2)

    const forAgg1 = store.getForAggregate('agg-1')
    expect(forAgg1).toHaveLength(1)
    expect(forAgg1[0].aggregateId).toBe('agg-1')
  })

  it('should filter events by timestamp', () => {
    const now = Date.now()

    store.append({
      type: 'OLD',
      aggregateId: 'id',
      timestamp: now - 1000,
      data: {},
    })

    store.append({
      type: 'NEW',
      aggregateId: 'id',
      timestamp: now,
      data: {},
    })

    const recent = store.getSince(now - 500)
    expect(recent).toHaveLength(1)
    expect(recent[0].type).toBe('NEW')
  })

  it('should clear events', () => {
    store.append({
      type: 'EVENT',
      aggregateId: 'id',
      timestamp: Date.now(),
      data: {},
    })

    expect(store.getAll()).toHaveLength(1)

    store.clear()
    expect(store.getAll()).toHaveLength(0)
  })
})

// ============================================================================
// INTEGRATION TESTS
// ============================================================================

describe('CQRS Integration', () => {
  interface GameState {
    score: number
    moves: string[]
  }

  let commandBus: CommandBus<GameState>
  let queryBus: QueryBus<GameState>
  let state: GameState

  beforeEach(() => {
    commandBus = new CommandBus()
    queryBus = new QueryBus()
    state = { score: 0, moves: [] }

    // Register handlers
    commandBus.register('INCREMENT_SCORE', (s, cmd) => ({
      success: true,
      newState: { ...s, score: s.score + (cmd.payload?.amount || 1) },
      event: {
        type: 'SCORE_INCREASED',
        aggregateId: 'game-1',
        timestamp: Date.now(),
        data: { newScore: s.score + (cmd.payload?.amount || 1) },
      } as DomainEvent,
    }))

    queryBus.register('GET_SCORE', (s) => s.score)
    queryBus.register('GET_MOVE_COUNT', (s) => s.moves.length)
  })

  it('should coordinate commands and queries', () => {
    // Execute command
    const result = commandBus.execute(state, {
      type: 'INCREMENT_SCORE',
      payload: { amount: 10 },
      timestamp: Date.now(),
    })

    // Update state
    if (result.success && result.newState) {
      state = result.newState
    }

    // Query result
    const scoreResult = queryBus.execute(state, { type: 'GET_SCORE' })
    expect(scoreResult.data).toBe(10)
  })

  it('should maintain audit trail through commands and events', () => {
    const events: DomainEvent[] = []
    commandBus.subscribe('SCORE_INCREASED', (event) => {
      events.push(event)
    })

    // Execute multiple commands
    for (let i = 0; i < 3; i++) {
      const result = commandBus.execute(state, {
        type: 'INCREMENT_SCORE',
        payload: { amount: 5 },
        timestamp: Date.now(),
      })
      if (result.success && result.newState) {
        state = result.newState
      }
    }

    expect(events).toHaveLength(3)
    expect(state.score).toBe(15)
    expect(commandBus.getHistory()).toHaveLength(3)
  })
})
