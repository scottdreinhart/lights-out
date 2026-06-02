import { applyCollisionSystem, createInitialGameState, TILE_SIZE } from '@/domain'
import { describe, expect, it } from 'vitest'

describe('collision system', () => {
  it('lands on top of a platform when descending', () => {
    const state = createInitialGameState(0)
    const platform = state.platforms[1]
    const before = {
      ...state,
      screen: 'playing' as const,
      player: {
        ...state.player,
        onGround: false,
        position: {
          x: platform.position.x + TILE_SIZE,
          y: platform.position.y - state.player.bounds.height + 2,
        },
        velocity: { x: 0, y: 3 },
      },
    }

    const result = applyCollisionSystem(before)
    expect(result.player.onGround).toBe(true)
    expect(result.player.position.y).toBe(platform.position.y - before.player.bounds.height)
  })
})
