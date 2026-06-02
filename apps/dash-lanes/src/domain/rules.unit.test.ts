import { describe, expect, it } from 'vitest'
import { INITIAL_STATE } from './constants'
import { reduceGameState } from './rules'
import type { GameState } from './types'

const createState = (overrides: Partial<GameState> = {}): GameState => ({
  ...INITIAL_STATE,
  ...overrides,
})

describe('dash-lanes rules', () => {
  it('clamps lane switching at boundaries', () => {
    const leftEdge = createState({
      runner: { lane: 0 },
    })
    const afterLeft = reduceGameState(leftEdge, 'laneLeft')
    expect(afterLeft.runner.lane).toBe(0)

    const rightEdge = createState({
      runner: { lane: 2 },
    })
    const afterRight = reduceGameState(rightEdge, 'laneRight')
    expect(afterRight.runner.lane).toBe(2)
  })

  it('decrements lives on collision without dash protection', () => {
    const state = createState({
      lives: 3,
      intensity: 10,
      speed: 25,
      runner: { lane: 1 },
      obstacles: [
        {
          id: 1,
          kind: 'blocker',
          lane: 1,
          distance: 1,
          spawnTick: 0,
        },
      ],
      dashTicksRemaining: 0,
      spawnCooldownMs: 10_000,
    })

    const next = reduceGameState(state, 'tick')
    expect(next.lives).toBe(2)
    expect(next.phase).toBe('playing')
  })

  it('transitions to gameOver when lives reach zero', () => {
    const state = createState({
      lives: 1,
      intensity: 10,
      speed: 25,
      runner: { lane: 1 },
      obstacles: [
        {
          id: 1,
          kind: 'blocker',
          lane: 1,
          distance: 1,
          spawnTick: 0,
        },
      ],
      dashTicksRemaining: 0,
      spawnCooldownMs: 10_000,
    })

    const next = reduceGameState(state, 'tick')
    expect(next.phase).toBe('gameOver')
    expect(next.status).toContain('System collapse')
  })

  it('ramps speed and reduces spawn interval over time', () => {
    const state = createState({
      speed: 22,
      spawnIntervalMs: 900,
      spawnCooldownMs: 800,
    })

    const next = reduceGameState(state, 'tick')
    expect(next.speed).toBeGreaterThan(state.speed)
    expect(next.spawnIntervalMs).toBeLessThan(state.spawnIntervalMs)
  })

  it('resets session to initial state', () => {
    const progressed = createState({
      score: 88,
      lives: 1,
      tick: 45,
      runner: { lane: 2 },
      distance: 400,
      status: 'temporary',
    })

    const reset = reduceGameState(progressed, 'reset')
    expect(reset).toEqual(INITIAL_STATE)
  })
})
