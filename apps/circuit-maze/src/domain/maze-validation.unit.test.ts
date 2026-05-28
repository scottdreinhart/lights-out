import { describe, expect, it } from 'vitest'
import { generateMaze, mazeToGraph, positionToNodeId } from './maze-engine'
import { aStar, bfs } from './maze-navigation'
import {
  hasReciprocalWalls,
  isGraphConsistentWithMaze,
  isMazeConnected,
  isPathValid,
} from './maze-validation'

describe('maze validation', () => {
  it('validates reciprocal walls, graph consistency, and connectivity', () => {
    const maze = generateMaze({
      width: 10,
      height: 10,
      seed: 'validation-maze',
      algorithm: 'wilson',
    })
    const graph = mazeToGraph(maze)

    expect(hasReciprocalWalls(maze)).toBe(true)
    expect(isGraphConsistentWithMaze(maze, graph)).toBe(true)
    expect(isMazeConnected(maze)).toBe(true)
  })

  it('validates solver path legality and shortest-path parity (A* vs BFS)', () => {
    const maze = generateMaze({
      width: 12,
      height: 12,
      seed: 'solver-parity',
      algorithm: 'prim',
    })
    const graph = mazeToGraph(maze)
    const start = positionToNodeId({ x: 0, y: 0 })
    const goal = positionToNodeId({ x: maze.width - 1, y: maze.height - 1 })

    const bfsPath = bfs(graph, start, goal)
    const aStarPath = aStar(graph, start, goal)

    expect(isPathValid(maze, bfsPath)).toBe(true)
    expect(isPathValid(maze, aStarPath)).toBe(true)
    expect(aStarPath.length).toBe(bfsPath.length)
  })
})
