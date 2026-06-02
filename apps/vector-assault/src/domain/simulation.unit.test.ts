import { createInitialState, stepGameState, type ControlState } from '@/domain'
import { describe, expect, it } from 'vitest'

const EMPTY_CONTROL: ControlState = {
  rotateLeft: false,
  rotateRight: false,
  thrust: false,
  fire: false,
  reposition: false,
  burst: false,
}

describe('vector assault simulation', () => {
  it('is deterministic for equivalent input streams', () => {
    let first = createInitialState(12345)
    let second = createInitialState(12345)

    for (let tick = 0; tick < 240; tick += 1) {
      const input: ControlState = {
        ...EMPTY_CONTROL,
        rotateLeft: tick % 17 === 0,
        rotateRight: tick % 23 === 0,
        thrust: tick % 2 === 0,
        fire: tick % 5 === 0,
        burst: tick === 70,
        reposition: tick === 140,
      }
      first = stepGameState(first, input)
      second = stepGameState(second, input)
    }

    expect(first).toEqual(second)
  })

  it('splits a large hazard into medium hazards on hit', () => {
    const state = createInitialState(42)
    const target = state.hazards.find((hazard) => hazard.size === 'large')
    if (!target) {
      throw new Error('Expected at least one large hazard at wave start')
    }

    const seeded = {
      ...state,
      projectiles: [
        {
          id: 500,
          position: { ...target.position },
          velocity: { x: 0, y: 0 },
          ttl: 10,
          radius: 2.5,
        },
      ],
    }

    const next = stepGameState(seeded, EMPTY_CONTROL)
    const mediums = next.hazards.filter((hazard) => hazard.size === 'medium')

    expect(mediums.length).toBeGreaterThan(0)
    expect(next.score).toBeGreaterThan(seeded.score)
  })
})
