import { createInitialGameState } from '@/domain'
import { describe, expect, it } from 'vitest'
import { applyCollectibleSystem } from '../domain/systems/collectible-system'

describe('applyCollectibleSystem', () => {
  it('spawns collectible deterministically', () => {
    const state = {
      ...createInitialGameState(0),
      screen: 'playing' as const,
      collectibles: [],
      collectibleSpawnCooldown: 1,
    }

    const result = applyCollectibleSystem(state)
    expect(result.collectibles.length).toBe(1)
    expect(result.collectibles[0]?.id).toBe('collectible-1')
  })
})
