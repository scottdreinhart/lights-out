import { describe, expect, it } from 'vitest'
import type { MazeGraph } from './maze-engine'
import type { WeightedGraph } from './maze-navigation'
import { aStar, bfs, dijkstra } from './maze-navigation'

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

describe('maze navigation', () => {
  it('returns shortest unit-weight path using bfs', () => {
    const path = bfs(GRAPH, '0,0', '2,1')
    expect(path).toEqual(['0,0', '1,0', '2,0', '2,1'])
  })

  it('returns shortest path with aStar equivalent to bfs', () => {
    const bfsPath = bfs(GRAPH, '0,0', '2,1')
    const astarPath = aStar(GRAPH, '0,0', '2,1')
    expect(astarPath.length).toBe(bfsPath.length)
    expect(astarPath[0]).toBe('0,0')
    expect(astarPath[astarPath.length - 1]).toBe('2,1')
  })

  it('returns lowest-cost path using dijkstra when weighted', () => {
    const weighted: WeightedGraph = {
      ...GRAPH,
      weights: new Map([
        ['0,0->1,0', 10],
        ['1,0->0,0', 10],
        ['1,0->2,0', 10],
        ['2,0->1,0', 10],
        ['2,0->2,1', 10],
        ['2,1->2,0', 10],
        ['0,0->0,1', 1],
        ['0,1->0,0', 1],
        ['0,1->1,1', 1],
        ['1,1->0,1', 1],
        ['1,1->2,1', 1],
        ['2,1->1,1', 1],
      ]),
    }

    const path = dijkstra(weighted, '0,0', '2,1')
    expect(path).toEqual(['0,0', '0,1', '1,1', '2,1'])
  })
})
