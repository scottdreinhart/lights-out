import { EMPTY_INPUT, applyLadderSystem, createInitialGameState, type GameState } from '@/domain'
import { describe, expect, it } from 'vitest'

describe('ladder system', () => {
  it('enters ladder mode when touching ladder and climb pressed', () => {
    const state = createInitialGameState(0)
    const ladder = state.ladders[0]
    const aligned = {
      ...state,
      screen: 'playing' as const,
      player: {
        ...state.player,
        position: { x: ladder.position.x, y: ladder.position.y + ladder.bounds.height / 2 },
      },
    }

    const result = applyLadderSystem(aligned, { ...EMPTY_INPUT, climbUp: true })
    expect(result.player.onLadder).toBe(true)
  })

  it('allows climbing through the platform lip on first ladder', () => {
    const state = createInitialGameState(0)
    const ladder = state.ladders[0]
    const firstPlatform = state.platforms.find((platform) => platform.id === 'p-1')
    if (!firstPlatform) {
      throw new Error('Expected p-1 platform in level geometry')
    }

    let next: GameState = {
      ...state,
      screen: 'playing' as const,
      player: {
        ...state.player,
        position: { x: ladder.position.x, y: ladder.position.y + ladder.bounds.height - 12 },
      },
    }

    for (let i = 0; i < 80; i += 1) {
      next = applyLadderSystem(next, { ...EMPTY_INPUT, climbUp: true })
    }

    expect(next.player.position.y).toBeLessThan(firstPlatform.position.y)
  })

  it('does not latch onto ladder without climb intent', () => {
    const state = createInitialGameState(0)
    const ladder = state.ladders[0]
    const aligned: GameState = {
      ...state,
      screen: 'playing',
      player: {
        ...state.player,
        position: { x: ladder.position.x, y: ladder.position.y + ladder.bounds.height / 2 },
      },
    }

    const result = applyLadderSystem(aligned, EMPTY_INPUT)
    expect(result.player.onLadder).toBe(false)
  })

  it('dismounts ladder when moving horizontally', () => {
    const state = createInitialGameState(0)
    const ladder = state.ladders[0]
    const onLadder: GameState = {
      ...state,
      screen: 'playing',
      player: {
        ...state.player,
        onLadder: true,
        position: { x: ladder.position.x, y: ladder.position.y + 8 },
      },
    }

    const result = applyLadderSystem(onLadder, { ...EMPTY_INPUT, left: true })
    expect(result.player.onLadder).toBe(false)
  })

  it('can grab ladder with slight horizontal offset while climbing', () => {
    const state = createInitialGameState(0)
    const ladder = state.ladders[0]
    const near: GameState = {
      ...state,
      screen: 'playing',
      player: {
        ...state.player,
        position: {
          x: ladder.position.x + ladder.bounds.width + 6,
          y: ladder.position.y + ladder.bounds.height / 2,
        },
      },
    }

    const result = applyLadderSystem(near, { ...EMPTY_INPUT, climbUp: true })
    expect(result.player.onLadder).toBe(true)
  })
})
