import { createInitialState, stepGameState, type ControlState } from '@/domain'
import { describe, expect, it } from 'vitest'

const EMPTY_CONTROLS: ControlState = {
  aimUp: false,
  aimDown: false,
  forceUp: false,
  forceDown: false,
  fire: false,
  reaim: false,
  salvo: false,
}

describe('angle war simulation', () => {
  it('stays deterministic for identical control streams', () => {
    let first = createInitialState(1789)
    let second = createInitialState(1789)

    for (let tick = 0; tick < 420; tick += 1) {
      const controls: ControlState = {
        ...EMPTY_CONTROLS,
        aimUp: tick % 11 === 0,
        aimDown: tick % 19 === 0,
        forceUp: tick % 13 === 0,
        fire: tick % 17 === 0,
        salvo: tick === 160 || tick === 330,
        reaim: tick % 71 === 0,
      }
      first = stepGameState(first, controls)
      second = stepGameState(second, controls)
    }

    expect(first).toEqual(second)
  })

  it('fires a full salvo as multiple projectiles', () => {
    const seeded = createInitialState(77_777)
    const next = stepGameState(seeded, {
      ...EMPTY_CONTROLS,
      salvo: true,
    })

    expect(next.projectiles.length).toBeGreaterThanOrEqual(3)
    expect(next.salvoCooldownTicks).toBeGreaterThan(0)
  })
})
