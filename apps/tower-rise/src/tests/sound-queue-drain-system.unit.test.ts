import { createInitialGameState } from '@/domain'
import { describe, expect, it } from 'vitest'
import { applySoundQueueDrainSystem } from '../domain/systems/sound-queue-drain-system'

describe('applySoundQueueDrainSystem', () => {
  it('clears queued sound events', () => {
    const state = createInitialGameState(0)
    state.screen = 'playing'
    state.soundEvents = [
      { id: 1, type: 'jump' },
      { id: 2, type: 'score' },
    ]

    const result = applySoundQueueDrainSystem(state)
    expect(result.soundEvents).toHaveLength(0)
  })
})
