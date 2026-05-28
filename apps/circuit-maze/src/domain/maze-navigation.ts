/**
 * TODO:
 * - Single responsibility: full-map shortest-path navigation algorithms.
 * - Invariants: BFS and A* agree on path cost for unweighted graphs.
 * - Layer ownership: domain.
 * - Expected tests: BFS/A* parity and weighted Dijkstra correctness.
 * - Pattern: pure graph solvers.
 */

import type { MazeGraph } from './maze-engine'
import { nodeIdToPosition } from './maze-engine'

export interface WeightedGraph extends MazeGraph {
  weights?: Map<string, number>
}

const manhattan = (a: string, b: string): number => {
  const left = nodeIdToPosition(a)
  const right = nodeIdToPosition(b)
  return Math.abs(left.x - right.x) + Math.abs(left.y - right.y)
}

const reconstructPath = (cameFrom: Map<string, string>, current: string): string[] => {
  const path = [current]
  let cursor = current
  while (cameFrom.has(cursor)) {
    cursor = cameFrom.get(cursor) as string
    path.unshift(cursor)
  }
  return path
}

export const bfs = (graph: MazeGraph, start: string, goal: string): string[] => {
  if (start === goal) {
    return [start]
  }

  const queue: string[] = [start]
  const visited = new Set<string>([start])
  const cameFrom = new Map<string, string>()

  while (queue.length > 0) {
    const current = queue.shift()
    if (!current) {
      continue
    }
    if (current === goal) {
      return reconstructPath(cameFrom, goal)
    }

    const neighbors = graph.edges.get(current) ?? []
    for (const next of neighbors) {
      if (visited.has(next)) {
        continue
      }
      visited.add(next)
      cameFrom.set(next, current)
      queue.push(next)
    }
  }

  return []
}

export const aStar = (graph: MazeGraph, start: string, goal: string): string[] => {
  if (start === goal) {
    return [start]
  }

  const open = new Set<string>([start])
  const cameFrom = new Map<string, string>()
  const gScore = new Map<string, number>([[start, 0]])
  const fScore = new Map<string, number>([[start, manhattan(start, goal)]])

  while (open.size > 0) {
    let current: string | null = null
    let best = Number.POSITIVE_INFINITY
    for (const candidate of open) {
      const score = fScore.get(candidate) ?? Number.POSITIVE_INFINITY
      if (score < best) {
        best = score
        current = candidate
      }
    }
    if (!current) {
      break
    }

    if (current === goal) {
      return reconstructPath(cameFrom, goal)
    }

    open.delete(current)
    const neighbors = graph.edges.get(current) ?? []
    for (const next of neighbors) {
      const tentative = (gScore.get(current) ?? Number.POSITIVE_INFINITY) + 1
      if (tentative >= (gScore.get(next) ?? Number.POSITIVE_INFINITY)) {
        continue
      }
      cameFrom.set(next, current)
      gScore.set(next, tentative)
      fScore.set(next, tentative + manhattan(next, goal))
      open.add(next)
    }
  }

  return []
}

export const dijkstra = (graph: WeightedGraph, start: string, goal: string): string[] => {
  if (start === goal) {
    return [start]
  }

  const dist = new Map<string, number>([[start, 0]])
  const prev = new Map<string, string>()
  const unvisited = new Set<string>(graph.nodes)

  while (unvisited.size > 0) {
    let current: string | null = null
    let currentDistance = Number.POSITIVE_INFINITY
    for (const node of unvisited) {
      const distance = dist.get(node) ?? Number.POSITIVE_INFINITY
      if (distance < currentDistance) {
        currentDistance = distance
        current = node
      }
    }

    if (!current || currentDistance === Number.POSITIVE_INFINITY) {
      break
    }
    if (current === goal) {
      return reconstructPath(prev, goal)
    }

    unvisited.delete(current)
    const neighbors = graph.edges.get(current) ?? []
    for (const next of neighbors) {
      if (!unvisited.has(next)) {
        continue
      }

      const weight = graph.weights?.get(`${current}->${next}`) ?? 1
      const tentative = currentDistance + weight
      if (tentative < (dist.get(next) ?? Number.POSITIVE_INFINITY)) {
        dist.set(next, tentative)
        prev.set(next, current)
      }
    }
  }

  return []
}
