import { EMPTY_INPUT, applyJumpSystem, createInitialGameState } from '@/domain'
import { describe, expect, it } from 'vitest'

describe('jump system', () => {
  it('starts jump when grounded and jump pressed', () => {
    const state = createInitialGameState(0)
    const result = applyJumpSystem(
      { ...state, screen: 'playing', player: { ...state.player, onGround: true } },
      { ...EMPTY_INPUT, jump: true },
    )

    expect(result.player.onGround).toBe(false)
    expect(result.player.velocity.y).toBeLessThan(0)
  })
})
