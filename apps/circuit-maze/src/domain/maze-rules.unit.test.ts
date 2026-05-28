import { describe, expect, it } from 'vitest'
import { createInitialGameState, reduceGameState } from './rules'
import type { LevelDefinition } from './types'

const TEST_LEVEL: LevelDefinition = {
  id: 'test-level',
  name: 'Test',
  layout: ['#####', '#SNE#', '#..N#', '#####'],
  pressurePerTick: 0,
  nodePressureGain: 10,
  lockdownTicks: 4,
  sentinels: [],
}

describe('maze rules', () => {
  it('blocks movement into walls', () => {
    const initial = createInitialGameState(TEST_LEVEL)
    const moved = reduceGameState(initial, { type: 'move', direction: 'left' })
    expect(moved.player.position).toEqual(initial.player.position)
  })

  it('collects nodes and keeps exit locked until all nodes are captured', () => {
    let state = createInitialGameState(TEST_LEVEL)
    state = reduceGameState(state, { type: 'move', direction: 'right' })

    expect(state.nodesRemaining).toHaveLength(1)
    expect(state.exitUnlocked).toBe(false)
    expect(state.pressure).toBe(10)
  })

  it('unlocks exit after all nodes are collected and allows win on exit', () => {
    let state = createInitialGameState(TEST_LEVEL)
    state = reduceGameState(state, { type: 'move', direction: 'right' }) // node 1
    state = reduceGameState(state, { type: 'move', direction: 'down' })
    state = reduceGameState(state, { type: 'move', direction: 'right' }) // node 2
    state = reduceGameState(state, { type: 'move', direction: 'up' }) // exit

    expect(state.exitUnlocked).toBe(true)
    expect(state.status).toBe('won')
  })

  it('fails after lockdown countdown expires', () => {
    const lockdownLevel: LevelDefinition = {
      ...TEST_LEVEL,
      pressurePerTick: 60,
      nodePressureGain: 0,
      lockdownTicks: 2,
    }

    let state = createInitialGameState(lockdownLevel)
    for (let i = 0; i < 8 && state.status === 'playing'; i += 1) {
      state = reduceGameState(state, { type: 'tick' })
    }

    expect(state.status).toBe('lost')
    expect(state.lossReason).toBe('lockdown')
  })

  it('fails on sentinel collision', () => {
    const sentinelLevel: LevelDefinition = {
      ...TEST_LEVEL,
      sentinels: [
        {
          id: 's1',
          start: { x: 1, y: 1 },
          patrolRoute: [{ x: 1, y: 1 }],
          baseMoveInterval: 1,
        },
      ],
    }
    const initial = createInitialGameState(sentinelLevel)
    const next = reduceGameState(initial, { type: 'tick' })

    expect(next.status).toBe('lost')
    expect(next.lossReason).toBe('sentinel')
  })

  it('updates sentinel AI tier via reducer action', () => {
    const initial = createInitialGameState(TEST_LEVEL)
    const next = reduceGameState(initial, { type: 'setSentinelAiTier', tier: 'elite' })

    expect(next.sentinelAiTier).toBe('elite')
  })
})
