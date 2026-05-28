import { describe, expect, it } from 'vitest'
import { createEngine, listArchetypes, listVariants, validateFactoryCatalog } from './index'
import type { ArchetypeId, InputCommand } from './core/contracts'
import { ARCHETYPE_MATRIX } from './archetypes/matrix'

const STEP_COMMANDS: InputCommand[] = [
  { id: 'primaryAction' },
  { id: 'secondaryAction' },
  { id: 'tertiaryAction' },
]

describe('game-engine-factory', () => {
  it('has a consistent archetype and variant catalog', () => {
    expect(validateFactoryCatalog()).toEqual({ isValid: true, errors: [] })
  })

  it('maps each archetype to at least one citation source', () => {
    const archetypes = listArchetypes()
    for (const archetype of archetypes) {
      const definition = ARCHETYPE_MATRIX[archetype]
      expect(definition.citations.length).toBeGreaterThan(0)
      expect(definition.citations.every((citation) => citation.startsWith('https://'))).toBe(true)
    }
  })

  it('exposes all required archetypes with at least one variant', () => {
    const archetypes = listArchetypes()
    expect(archetypes).toHaveLength(12)
    for (const archetype of archetypes) {
      expect(listVariants(archetype)).not.toHaveLength(0)
    }
  })

  it('produces deterministic updates for every archetype default variant', () => {
    const archetypes = listArchetypes()

    for (const archetype of archetypes) {
      const engineA = createEngine({ archetypeId: archetype, seed: 42 })
      const engineB = createEngine({ archetypeId: archetype, seed: 42 })
      let stateA = engineA.createInitialState({
        archetypeId: archetype,
        variantId: engineA.variant.id,
        seed: 42,
      })
      let stateB = engineB.createInitialState({
        archetypeId: archetype,
        variantId: engineB.variant.id,
        seed: 42,
      })

      for (let i = 0; i < 20; i += 1) {
        const command = STEP_COMMANDS[i % STEP_COMMANDS.length]
        stateA = engineA.update(stateA, command, 16.6667)
        stateB = engineB.update(stateB, command, 16.6667)
      }

      expect(stateA).toEqual(stateB)
      expect(stateA.tick).toBe(20)
      expect(stateA.tickState.events).toContain('step:resolve-input')
      expect(stateA.tickState.events).toContain('step:apply-rules')
    }
  })

  it('supports explicit variant selection for configurable families', () => {
    const archetype: ArchetypeId = 'runner-core'
    const laneEngine = createEngine({ archetypeId: archetype, variantId: 'lane-based', seed: 7 })
    const burstEngine = createEngine({ archetypeId: archetype, variantId: 'burst-physics', seed: 7 })
    let laneState = laneEngine.createInitialState({
      archetypeId: archetype,
      variantId: 'lane-based',
      seed: 7,
    })
    let burstState = burstEngine.createInitialState({
      archetypeId: archetype,
      variantId: 'burst-physics',
      seed: 7,
    })

    for (let i = 0; i < 10; i += 1) {
      laneState = laneEngine.update(laneState, { id: 'tertiaryAction' }, 16.6667)
      burstState = burstEngine.update(burstState, { id: 'tertiaryAction' }, 16.6667)
    }

    expect(burstState.score).toBeGreaterThan(laneState.score)
    expect(burstState.threat).toBeGreaterThan(laneState.threat)
  })

  it('can reset back to deterministic initial state', () => {
    const archetype: ArchetypeId = 'turn-core'
    const engine = createEngine({ archetypeId: archetype, seed: 5 })
    const initial = engine.createInitialState({
      archetypeId: archetype,
      variantId: engine.variant.id,
      seed: 5,
    })
    let state = initial
    for (let i = 0; i < 8; i += 1) {
      state = engine.update(state, { id: 'primaryAction' }, 16.6667)
    }
    expect(state.tick).toBe(8)
    const reset = engine.reset({
      archetypeId: archetype,
      variantId: engine.variant.id,
      seed: 5,
    })
    expect(reset).toEqual(initial)
  })
})
