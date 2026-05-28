/**
 * TODO:
 * - Single responsibility: validate generated mazes, graph conversion, and solver paths.
 * - Invariants: walls are reciprocal, start/goal are reachable, and paths never cross walls.
 * - Layer ownership: domain.
 * - Expected tests: reciprocal-wall checks, connectivity checks, path validity checks.
 * - Pattern: pure validators returning deterministic booleans.
 */

import type { Maze, MazeGraph } from './maze-engine'
import { mazeToGraph, positionToNodeId } from './maze-engine'
import type { Position } from './types'

const DIRECTIONS = [
  { dx: 0, dy: -1, wall: 'top', opposite: 'bottom' },
  { dx: 1, dy: 0, wall: 'right', opposite: 'left' },
  { dx: 0, dy: 1, wall: 'bottom', opposite: 'top' },
  { dx: -1, dy: 0, wall: 'left', opposite: 'right' },
] as const

type Wall = (typeof DIRECTIONS)[number]['wall']

const inBounds = (maze: Maze, x: number, y: number): boolean =>
  x >= 0 && x < maze.width && y >= 0 && y < maze.height

export const hasReciprocalWalls = (maze: Maze): boolean => {
  for (let y = 0; y < maze.height; y += 1) {
    for (let x = 0; x < maze.width; x += 1) {
      const cell = maze.grid[y][x]
      for (const direction of DIRECTIONS) {
        const nx = x + direction.dx
        const ny = y + direction.dy
        if (!inBounds(maze, nx, ny)) {
          continue
        }
        const other = maze.grid[ny][nx]
        if (cell.walls[direction.wall] !== other.walls[direction.opposite as Wall]) {
          return false
        }
      }
    }
  }
  return true
}

export const isGraphConsistentWithMaze = (maze: Maze, graph: MazeGraph): boolean => {
  if (graph.nodes.size !== maze.width * maze.height) {
    return false
  }

  for (let y = 0; y < maze.height; y += 1) {
    for (let x = 0; x < maze.width; x += 1) {
      const node = `${x},${y}`
      if (!graph.nodes.has(node)) {
        return false
      }
      const neighbors = graph.edges.get(node) ?? []
      const expected: string[] = []
      const cell = maze.grid[y][x]

      if (!cell.walls.top && y > 0) {
        expected.push(`${x},${y - 1}`)
      }
      if (!cell.walls.right && x + 1 < maze.width) {
        expected.push(`${x + 1},${y}`)
      }
      if (!cell.walls.bottom && y + 1 < maze.height) {
        expected.push(`${x},${y + 1}`)
      }
      if (!cell.walls.left && x > 0) {
        expected.push(`${x - 1},${y}`)
      }

      expected.sort()
      const actual = [...neighbors].sort()
      if (expected.length !== actual.length) {
        return false
      }
      for (let index = 0; index < expected.length; index += 1) {
        if (expected[index] !== actual[index]) {
          return false
        }
      }
    }
  }

  return true
}

export const isMazeConnected = (
  maze: Maze,
  start: Position = { x: 0, y: 0 },
  goal: Position = { x: maze.width - 1, y: maze.height - 1 },
): boolean => {
  const graph = mazeToGraph(maze)
  const startNode = positionToNodeId(start)
  const goalNode = positionToNodeId(goal)

  if (!graph.nodes.has(startNode) || !graph.nodes.has(goalNode)) {
    return false
  }

  const queue = [startNode]
  const visited = new Set<string>([startNode])

  while (queue.length > 0) {
    const current = queue.shift()
    if (!current) {
      continue
    }
    for (const next of graph.edges.get(current) ?? []) {
      if (visited.has(next)) {
        continue
      }
      visited.add(next)
      queue.push(next)
    }
  }

  return visited.size === graph.nodes.size && visited.has(goalNode)
}

export const isPathValid = (maze: Maze, path: readonly string[]): boolean => {
  if (path.length === 0) {
    return false
  }
  const graph = mazeToGraph(maze)
  for (let index = 0; index < path.length - 1; index += 1) {
    const current = path[index]
    const next = path[index + 1]
    const neighbors = graph.edges.get(current) ?? []
    if (!neighbors.includes(next)) {
      return false
    }
  }
  return true
}
