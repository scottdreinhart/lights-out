import { LEVEL_ONE, createInitialGameState } from '@/domain'
import { describe, expect, it } from 'vitest'
import { computeSentinelStates } from './aiEngine'

describe('sentinel ai engine', () => {
  it('moves more aggressively on elite than easy', () => {
    const base = createInitialGameState(LEVEL_ONE)
    const seeded = {
      ...base,
      tick: 4,
      player: { ...base.player, position: { x: 10, y: 7 }, direction: 'left' as const },
    }

    const easyState = { ...seeded, sentinelAiTier: 'easy' as const }
    const eliteState = { ...seeded, sentinelAiTier: 'elite' as const }

    const easySentinel = computeSentinelStates(easyState).sentinels[0]
    const eliteSentinel = computeSentinelStates(eliteState).sentinels[0]
    const easyDistance =
      Math.abs(easySentinel.position.x - seeded.player.position.x) +
      Math.abs(easySentinel.position.y - seeded.player.position.y)
    const eliteDistance =
      Math.abs(eliteSentinel.position.x - seeded.player.position.x) +
      Math.abs(eliteSentinel.position.y - seeded.player.position.y)

    expect(eliteDistance).toBeLessThanOrEqual(easyDistance)
  })
})
