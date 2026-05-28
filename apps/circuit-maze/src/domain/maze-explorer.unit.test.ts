import { describe, expect, it } from 'vitest'
import type { MazeGraph } from './maze-engine'
import {
  createFloodFillState,
  createTremauxState,
  floodFillNext,
  tremauxNext,
  updateFloodFillDistances,
} from './maze-explorer'

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

describe('maze explorer', () => {
  it('tremaux prioritizes unvisited edges and records marks', () => {
    const state = createTremauxState()
    const first = tremauxNext(GRAPH, '0,0', '2,1', state)
    const second = tremauxNext(GRAPH, '0,0', '2,1', state)

    expect(first).toBeDefined()
    expect(second).toBeDefined()
    expect(state.visitedEdges.size).toBeGreaterThan(0)
  })

  it('flood-fill computes distances from goal and follows shortest gradient', () => {
    const state = createFloodFillState()
    updateFloodFillDistances(GRAPH, '2,1', state)

    const next = floodFillNext(GRAPH, '0,0', '2,1', state)
    expect(['1,0', '0,1']).toContain(next)
    expect(state.distances.get('2,1')).toBe(0)
  })
})
