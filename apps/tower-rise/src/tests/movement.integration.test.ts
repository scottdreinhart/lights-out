import {
  EMPTY_INPUT,
  createInitialGameState,
  tick,
  type GameState,
  type InputState,
} from '@/domain'
import { describe, expect, it } from 'vitest'

const input = (partial: Partial<InputState>): InputState => ({ ...EMPTY_INPUT, ...partial })

const step = (state: GameState, partial: Partial<InputState>, frames = 1): GameState => {
  let next = state
  for (let frame = 0; frame < frames; frame += 1) {
    next = tick(next, input(partial))
    expect(next.screen).toBe('playing')
    expect(next.player.isAlive).toBe(true)
  }
  return next
}

const createPlayingState = (): GameState => {
  const initial = createInitialGameState(0)
  return {
    ...initial,
    screen: 'playing',
  }
}

describe('tower-rise movement integration', () => {
  it('supports smooth mount -> climb -> dismount -> ground movement flow', () => {
    let state = createPlayingState()
    const firstLadder = state.ladders.find((ladder) => ladder.id === 'l-1')
    if (!firstLadder) {
      throw new Error('Expected l-1 ladder in level geometry')
    }

    state = step(state, { right: true }, 10)
    expect(state.player.onLadder).toBe(false)

    state = step(state, { climbUp: true })
    expect(state.player.onLadder).toBe(true)
    const expectedLadderX =
      firstLadder.position.x + (firstLadder.bounds.width - state.player.bounds.width) / 2
    expect(state.player.position.x).toBe(expectedLadderX)

    for (let climbFrame = 0; climbFrame < 20; climbFrame += 1) {
      const previousY = state.player.position.y
      state = step(state, { climbUp: true })
      expect(state.player.onLadder).toBe(true)
      expect(state.player.position.y).toBeLessThan(previousY)
    }

    state = step(state, { right: true })
    expect(state.player.onLadder).toBe(false)
    const dismountX = state.player.position.x

    state = step(state, { right: true }, 5)
    expect(state.player.onLadder).toBe(false)
    expect(state.player.position.x).toBeGreaterThan(dismountX)
  })

  it('supports re-grab after dismount and explicit ladder exits', () => {
    let state = createPlayingState()

    state = step(state, { right: true }, 10)
    state = step(state, { climbUp: true })
    expect(state.player.onLadder).toBe(true)

    state = step(state, { left: true })
    expect(state.player.onLadder).toBe(false)

    state = step(state, { climbUp: true })
    expect(state.player.onLadder).toBe(true)

    state = step(state, { jump: true })
    expect(state.player.onLadder).toBe(false)
  })
})
