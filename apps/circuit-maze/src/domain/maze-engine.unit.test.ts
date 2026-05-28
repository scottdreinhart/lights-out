import { describe, expect, it } from 'vitest'
import type { LevelDefinition, MazeAlgorithm } from './index'
import {
  countDeadEnds,
  createMazeFromLevel,
  generateMaze,
  mazeToGraph,
  positionToNodeId,
} from './maze-engine'
import { bfs } from './maze-navigation'

const ALGORITHMS: MazeAlgorithm[] = [
  'dfs',
  'recursive-backtracker',
  'prim',
  'kruskal',
  'wilson',
  'eller',
  'sidewinder',
]

describe('maze engine', () => {
  it('generates deterministic mazes for the same seed and algorithm', () => {
    for (const algorithm of ALGORITHMS) {
      const left = generateMaze({
        width: 8,
        height: 8,
        seed: `deterministic-${algorithm}`,
        algorithm,
      })
      const right = generateMaze({
        width: 8,
        height: 8,
        seed: `deterministic-${algorithm}`,
        algorithm,
      })
      expect(left).toEqual(right)
    }
  })

  it('creates connected and solvable mazes for each generation algorithm', () => {
    for (const algorithm of ALGORITHMS) {
      const maze = generateMaze({
        width: 8,
        height: 8,
        seed: `solvable-${algorithm}`,
        algorithm,
      })
      const graph = mazeToGraph(maze)
      const start = positionToNodeId({ x: 0, y: 0 })
      const goal = positionToNodeId({ x: maze.width - 1, y: maze.height - 1 })
      const path = bfs(graph, start, goal)

      expect(path.length).toBeGreaterThan(0)
      expect(new Set(path).size).toBe(path.length)
      expect(path[0]).toBe(start)
      expect(path[path.length - 1]).toBe(goal)
    }
  })

  it('maps level layout into an equivalent maze graph', () => {
    const level: LevelDefinition = {
      id: 'maze-level',
      name: 'Maze Level',
      layout: ['#####', '#S..#', '#.#E#', '#..N#', '#####'],
      pressurePerTick: 0,
      nodePressureGain: 10,
      lockdownTicks: 4,
      sentinels: [],
    }
    const maze = createMazeFromLevel(level)
    const graph = mazeToGraph(maze)
    const start = positionToNodeId({ x: 1, y: 1 })
    const goal = positionToNodeId({ x: 3, y: 3 })
    const path = bfs(graph, start, goal)

    expect(path.length).toBeGreaterThan(0)
    expect(path[0]).toBe(start)
    expect(path[path.length - 1]).toBe(goal)
  })

  it('reduces dead ends when braidFactor is enabled', () => {
    const base = generateMaze({
      width: 20,
      height: 20,
      seed: 'braid-comparison',
      algorithm: 'recursive-backtracker',
    })
    const braided = generateMaze({
      width: 20,
      height: 20,
      seed: 'braid-comparison',
      algorithm: 'recursive-backtracker',
      braidFactor: 0.6,
    })

    expect(countDeadEnds(braided)).toBeLessThan(countDeadEnds(base))
  })
})
