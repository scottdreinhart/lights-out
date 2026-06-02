/**
 * TODO:
 * - Single responsibility: unknown-map exploration policies.
 * - Invariants: Trémaux mark counts are monotonic and flood-fill gradients are non-increasing.
 * - Layer ownership: domain.
 * - Expected tests: deterministic next-step behavior and state updates.
 * - Pattern: step-wise explorers.
 */

import type { MazeGraph } from './maze-engine'
import { bfs } from './maze-navigation'

export interface TremauxState {
  visitedEdges: Map<string, number>
}

export interface FloodFillState {
  distances: Map<string, number>
}

const edgeKey = (a: string, b: string): string => (a < b ? `${a}|${b}` : `${b}|${a}`)

const markEdge = (state: TremauxState, a: string, b: string): void => {
  const key = edgeKey(a, b)
  const marks = state.visitedEdges.get(key) ?? 0
  state.visitedEdges.set(key, marks + 1)
}

const edgeMarks = (state: TremauxState, a: string, b: string): number =>
  state.visitedEdges.get(edgeKey(a, b)) ?? 0

export const createTremauxState = (): TremauxState => ({
  visitedEdges: new Map<string, number>(),
})

export const tremauxNext = (
  graph: MazeGraph,
  current: string,
  goal: string,
  state: TremauxState,
): string => {
  if (current === goal) {
    return current
  }

  const neighbors = graph.edges.get(current) ?? []
  if (neighbors.length === 0) {
    return current
  }

  const ordered = [...neighbors].sort(
    (left, right) => edgeMarks(state, current, left) - edgeMarks(state, current, right),
  )
  const next = ordered[0] ?? current
  if (next !== current) {
    markEdge(state, current, next)
  }
  return next
}

export const createFloodFillState = (): FloodFillState => ({
  distances: new Map<string, number>(),
})

export const updateFloodFillDistances = (
  graph: MazeGraph,
  goal: string,
  state: FloodFillState,
): void => {
  state.distances.clear()
  const queue: string[] = [goal]
  state.distances.set(goal, 0)

  while (queue.length > 0) {
    const current = queue.shift()
    if (!current) {
      continue
    }
    const base = state.distances.get(current) ?? 0
    const neighbors = graph.edges.get(current) ?? []
    for (const next of neighbors) {
      if (state.distances.has(next)) {
        continue
      }
      state.distances.set(next, base + 1)
      queue.push(next)
    }
  }
}

export const floodFillNext = (
  graph: MazeGraph,
  current: string,
  goal: string,
  state: FloodFillState,
): string => {
  if (current === goal) {
    return current
  }

  if (state.distances.size === 0) {
    updateFloodFillDistances(graph, goal, state)
  }

  const neighbors = graph.edges.get(current) ?? []
  let best = current
  let bestDistance = Number.POSITIVE_INFINITY
  for (const next of neighbors) {
    const distance = state.distances.get(next) ?? Number.POSITIVE_INFINITY
    if (distance < bestDistance) {
      bestDistance = distance
      best = next
    }
  }

  if (best === current) {
    const backupPath = bfs(graph, current, goal)
    return backupPath[1] ?? current
  }
  return best
}
