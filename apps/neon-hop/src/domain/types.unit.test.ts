/**
 * neon-hop — domain types unit tests.
 */

import { describe, expect, it } from 'vitest'
import type { GameState } from './types'

describe('neon-hop domain types', () => {
  it('accepts a valid game state shape', () => {
    const state: GameState = {
      phase: 'playing',
      tick: 1,
      score: 0,
      lives: 3,
      intensity: 0,
      progress: 0,
      focus: 0,
      status: 'ready',
    }

    expect(state.phase).toBe('playing')
    expect(state.lives).toBeGreaterThan(0)
  })
})
