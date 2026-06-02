/**
 * TODO:
 * - Single responsibility: mode-based AI routing across omniscient and exploration strategies.
 * - Invariants: same mode + same graph + same seed/tick produce deterministic next-node choice.
 * - Layer ownership: domain.
 * - Expected tests: per-mode next-step decisions and runtime-state effects.
 * - Pattern: strategy router.
 */

import type { MazeGraph } from './maze-engine'
import {
  createFloodFillState,
  createTremauxState,
  floodFillNext,
  tremauxNext,
} from './maze-explorer'
import { aStar, bfs } from './maze-navigation'

export type MazeAiMode = 'omniscient' | 'explorer' | 'speedrunner' | 'randomWalker'

export interface MazeAiRuntime {
  tremaux: ReturnType<typeof createTremauxState>
  floodFill: ReturnType<typeof createFloodFillState>
}

export interface MazeAiDecisionInput {
  graph: MazeGraph
  current: string
  goal: string
  mode: MazeAiMode
  tick: number
  seed: number
  runtime: MazeAiRuntime
}

export const createMazeAiRuntime = (): MazeAiRuntime => ({
  tremaux: createTremauxState(),
  floodFill: createFloodFillState(),
})

const chooseRandomNeighbor = (neighbors: string[], tick: number, seed: number): string => {
  if (neighbors.length === 0) {
    return ''
  }
  const index = Math.abs((seed * 1103515245 + tick * 12345) | 0) % neighbors.length
  return neighbors[index] as string
}

const nextFromPath = (path: string[], current: string): string => path[1] ?? current

export const decideMazeAiNextNode = ({
  graph,
  current,
  goal,
  mode,
  tick,
  seed,
  runtime,
}: MazeAiDecisionInput): string => {
  if (current === goal) {
    return current
  }

  switch (mode) {
    case 'omniscient': {
      const path = aStar(graph, current, goal)
      return nextFromPath(path, current)
    }
    case 'speedrunner': {
      const path = bfs(graph, current, goal)
      return nextFromPath(path, current)
    }
    case 'explorer': {
      const floodNext = floodFillNext(graph, current, goal, runtime.floodFill)
      if (floodNext !== current) {
        return floodNext
      }
      return tremauxNext(graph, current, goal, runtime.tremaux)
    }
    case 'randomWalker': {
      const neighbors = graph.edges.get(current) ?? []
      return chooseRandomNeighbor(neighbors, tick, seed) || current
    }
    default:
      return current
  }
}
