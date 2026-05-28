import { describe, expect, it } from 'vitest'

import { createInitialPetState, dispatchPetAction } from '.'

describe('afterlife flow', () => {
  it('allows resurrection during memorial and preserves the lineage snapshot', () => {
    const state = createInitialPetState('original')
    state.stage = 'teen'
    state.meters.hunger = 1
    state.lifecycle.ageMinutes = 420
    state.afterlife = {
      phase: 'memorial',
      deathMinute: 420,
      memorialUntilMinute: 420 + 24 * 60,
      resurrectionCount: 0,
      preservedState: {
        id: state.id,
        variantId: state.variantId,
        name: state.name,
        lifecycle: { ...state.lifecycle },
        stage: 'teen',
        mood: 'content',
        meters: { ...state.meters },
        care: { ...state.care },
        sicknessCount: state.sicknessCount,
        poopCount: state.poopCount,
        attentionActive: state.attentionActive,
        lightsOn: state.lightsOn,
        calls: state.calls.map((call) => ({ ...call })),
        memory: { ...state.memory! },
        history: state.history.map((event) => ({ ...event })),
      },
    }

    const revived = dispatchPetAction(state, { type: 'resurrect', minute: 421 })

    expect(revived.stage).toBe('teen')
    expect(revived.afterlife?.phase).toBe('alive')
    expect(revived.lifecycle.resurrectionCount).toBe(1)
    expect(revived.history.at(-1)?.type).toBe('resurrect')
  })

  it('locks the lineage into tombstone state after the memorial window closes', () => {
    const state = createInitialPetState('original')
    state.afterlife = {
      phase: 'memorial',
      deathMinute: 10,
      memorialUntilMinute: 11,
      resurrectionCount: 0,
      preservedState: {
        id: state.id,
        variantId: state.variantId,
        name: state.name,
        lifecycle: { ...state.lifecycle },
        stage: 'baby',
        mood: 'content',
        meters: { ...state.meters },
        care: { ...state.care },
        sicknessCount: state.sicknessCount,
        poopCount: state.poopCount,
        attentionActive: state.attentionActive,
        lightsOn: state.lightsOn,
        calls: state.calls.map((call) => ({ ...call })),
        memory: { ...state.memory! },
        history: state.history.map((event) => ({ ...event })),
      },
    }

    const tombstone = dispatchPetAction(state, { type: 'tick', minute: 12, elapsedMinutes: 2 })

    expect(tombstone.afterlife?.phase).toBe('tombstone')
    expect(tombstone.lifecycle.isDeparted).toBe(true)
  })
})
