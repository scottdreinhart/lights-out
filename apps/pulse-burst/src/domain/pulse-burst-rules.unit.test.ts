import { describe, expect, it } from 'vitest'
import { LEVEL_ONE } from './constants'
import { createInitialGameState, reduceGameState } from './rules'
import type { LevelDefinition } from './types'

describe('pulse burst rules', () => {
  it('applies burst impulse and moves runner upward', () => {
    const initial = createInitialGameState(LEVEL_ONE)
    const next = reduceGameState(initial, { type: 'burst' })

    expect(next.runner.velocityY).toBeLessThan(0)
    expect(next.runner.y).toBeLessThan(initial.runner.y)
    expect(next.status).toBe('playing')
  })

  it('applies gravity during tick and increments score and distance', () => {
    const initial = createInitialGameState(LEVEL_ONE)
    const next = reduceGameState(initial, { type: 'tick' })

    expect(next.tick).toBe(1)
    expect(next.runner.velocityY).toBeGreaterThan(0)
    expect(next.runner.y).toBeGreaterThan(initial.runner.y)
    expect(next.score).toBe(4)
    expect(next.distance).toBeGreaterThan(0)
  })

  it('marks obstacle passed and grants pass bonus', () => {
    const initial = createInitialGameState(LEVEL_ONE)
    const stateWithObstacle = {
      ...initial,
      obstacles: [
        {
          id: 1,
          x: 15,
          width: 5,
          gap: {
            centerY: 50,
            size: 60,
          },
          passed: false,
        },
      ],
      nextSpawnInTicks: 999,
      nextObstacleId: 2,
    }

    const next = reduceGameState(stateWithObstacle, { type: 'tick' })

    expect(next.score).toBe(104)
    expect(next.obstacles[0]?.passed).toBe(true)
  })

  it('fails when colliding with an obstacle', () => {
    const initial = createInitialGameState(LEVEL_ONE)
    const collisionState = {
      ...initial,
      obstacles: [
        {
          id: 99,
          x: initial.runner.x,
          width: 10,
          gap: {
            centerY: 20,
            size: 10,
          },
          passed: false,
        },
      ],
      nextSpawnInTicks: 999,
      nextObstacleId: 100,
    }

    const next = reduceGameState(collisionState, { type: 'tick' })

    expect(next.status).toBe('lost')
    expect(next.lossReason).toBe('collision')
  })

  it('fails with boundary breach when runner exits corridor', () => {
    const initial = createInitialGameState(LEVEL_ONE)
    const nearCeiling = {
      ...initial,
      runner: {
        ...initial.runner,
        y: 3,
      },
    }

    const next = reduceGameState(nearCeiling, { type: 'burst' })

    expect(next.status).toBe('lost')
    expect(next.lossReason).toBe('bounds')
  })

  it('resets to initial state on restart action', () => {
    const initial = createInitialGameState(LEVEL_ONE)
    const progressed = reduceGameState(reduceGameState(initial, { type: 'tick' }), {
      type: 'burst',
    })
    const restarted = reduceGameState(progressed, { type: 'restart' })

    expect(restarted).toEqual(createInitialGameState(LEVEL_ONE))
  })

  it('scales intensity, speed, and gap size over time', () => {
    const tuningLevel: LevelDefinition = {
      ...LEVEL_ONE,
      worldWidth: 120,
      worldHeight: 1000,
      ceilingY: -100,
      floorY: 1100,
      playerX: 20,
      physics: {
        ...LEVEL_ONE.physics,
        gravity: 0,
        burstImpulse: 0,
        maxRiseVelocity: 0,
        maxFallVelocity: 0,
      },
      spawnRule: {
        ...LEVEL_ONE.spawnRule,
        baseGapSize: 700,
        minGapSize: 500,
        gapShrinkPerIntensity: 1.2,
        obstacleWidth: 4,
      },
      difficulty: {
        ...LEVEL_ONE.difficulty,
        intensityPerTick: 1,
        speedPerIntensity: 0.05,
      },
    }

    let state = createInitialGameState(tuningLevel)
    for (let i = 0; i < 40; i += 1) {
      state = reduceGameState(state, { type: 'tick' })
      expect(state.status).toBe('playing')
    }

    expect(state.intensity).toBeGreaterThan(0)
    expect(state.speed).toBeGreaterThan(tuningLevel.difficulty.baseSpeed)
    expect(state.gapSize).toBeLessThan(tuningLevel.spawnRule.baseGapSize)
    expect(state.gapSize).toBeGreaterThanOrEqual(tuningLevel.spawnRule.minGapSize)
  })
})
