import { describe, expect, it } from 'vitest'
import { createMazeAiRuntime, decideMazeAiNextNode } from './maze-ai'
import type { MazeGraph } from './maze-engine'

const GRAPH: MazeGraph = {
  nodes: new Set(['0,0', '1,0', '2,0', '0,1', '1,1', '2,1']),
  edges: new Map([
    ['0,0', ['1,0', '0,1']],
    ['1,0', ['0,0', '2,0', '1,1']],
    ['2,0', ['1,0', '2,1']],
    ['0,1', ['0,0', '1,1']],
    ['1,1', ['0,1', '1,0', '2,1']],
    ['2,1', ['1,1', '2,0']],
  ]),
}

describe('maze ai', () => {
  it('uses pathfinding for omniscient and speedrunner modes', () => {
    const runtime = createMazeAiRuntime()
    const omniscientNext = decideMazeAiNextNode({
      graph: GRAPH,
      current: '0,0',
      goal: '2,1',
      mode: 'omniscient',
      tick: 1,
      seed: 7,
      runtime,
    })
    const speedrunnerNext = decideMazeAiNextNode({
      graph: GRAPH,
      current: '0,0',
      goal: '2,1',
      mode: 'speedrunner',
      tick: 1,
      seed: 7,
      runtime,
    })

    expect(['1,0', '0,1']).toContain(omniscientNext)
    expect(['1,0', '0,1']).toContain(speedrunnerNext)
  })

  it('uses exploration mode with persistent runtime state', () => {
    const runtime = createMazeAiRuntime()
    const first = decideMazeAiNextNode({
      graph: GRAPH,
      current: '0,0',
      goal: '2,1',
      mode: 'explorer',
      tick: 1,
      seed: 11,
      runtime,
    })
    const second = decideMazeAiNextNode({
      graph: GRAPH,
      current: first,
      goal: '2,1',
      mode: 'explorer',
      tick: 2,
      seed: 11,
      runtime,
    })

    expect(first).not.toBe('0,0')
    expect(second).toBeDefined()
  })

  it('uses deterministic random walker decisions from seed and tick', () => {
    const runtime = createMazeAiRuntime()
    const left = decideMazeAiNextNode({
      graph: GRAPH,
      current: '0,0',
      goal: '2,1',
      mode: 'randomWalker',
      tick: 3,
      seed: 13,
      runtime,
    })
    const right = decideMazeAiNextNode({
      graph: GRAPH,
      current: '0,0',
      goal: '2,1',
      mode: 'randomWalker',
      tick: 3,
      seed: 13,
      runtime: createMazeAiRuntime(),
    })

    expect(left).toBe(right)
    expect(['1,0', '0,1']).toContain(left)
  })
})
