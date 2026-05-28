import { createInitialGameState } from '@/domain'
import { describe, expect, it } from 'vitest'
import { applyAnimationSystem } from '../domain/systems/animation-system'

describe('applyAnimationSystem', () => {
  it('switches player to run animation when moving on ground', () => {
    const state = createInitialGameState(0)
    state.screen = 'playing'
    state.player.velocity.x = 3
    state.player.onGround = true
    state.player.onLadder = false
    state.player.isAlive = true

    const result = applyAnimationSystem(state)
    expect(result.playerAnimation.state).toBe('run')
  })
})
