import { EMPTY_INPUT, createInitialGameState, tick } from '@/domain'
import { describe, expect, it } from 'vitest'

describe('tower-rise game loop', () => {
  it('is deterministic for equivalent input streams', () => {
    let first = createInitialGameState(0)
    let second = createInitialGameState(0)

    for (let index = 0; index < 240; index += 1) {
      const input = {
        ...EMPTY_INPUT,
        right: index % 3 === 0,
        jump: index % 17 === 0,
        climbUp: index % 29 === 0,
      }
      first = tick(first, input)
      second = tick(second, input)
    }

    expect(first).toEqual(second)
  })
})
