/**
 * TODO:
 * - Single responsibility: shared maze engine contracts and deterministic RNG abstraction.
 * - Invariants: RNG output is deterministic for identical seed/input sequence.
 * - Layer ownership: domain.
 * - Expected tests: deterministic RNG sequence parity and strategy contract conformance.
 * - Pattern: CLEAN contracts + strategy interfaces.
 */

import type { Maze, MazeConfig, MazeGraph } from './maze-engine'
import type { Position } from './types'

export interface MazeRng {
  next(): number
  nextInt(minInclusive: number, maxExclusive: number): number
  shuffle<T>(items: readonly T[]): T[]
}

export interface MazeGeneratorStrategy {
  readonly id: string
  generate(config: MazeConfig, rng: MazeRng): Maze
}

export interface MazeSolverResult {
  readonly visited: readonly string[]
  readonly path: readonly string[]
  readonly cost: number
  readonly reachedGoal: boolean
}

export interface MazeSolverStrategy {
  readonly id: string
  solve(graph: MazeGraph, start: string, goal: string): MazeSolverResult
}

export interface MazeHeuristicStrategy {
  readonly id: string
  estimate(from: Position, to: Position): number
}

class SeededRng implements MazeRng {
  private state: number

  constructor(seed: string) {
    let hash = 2166136261
    for (let index = 0; index < seed.length; index += 1) {
      hash ^= seed.charCodeAt(index)
      hash = Math.imul(hash, 16777619)
    }
    this.state = hash >>> 0
  }

  next(): number {
    this.state = (1664525 * this.state + 1013904223) >>> 0
    return this.state / 0x100000000
  }

  nextInt(minInclusive: number, maxExclusive: number): number {
    return Math.floor(this.next() * (maxExclusive - minInclusive)) + minInclusive
  }

  shuffle<T>(items: readonly T[]): T[] {
    const output = [...items]
    for (let index = output.length - 1; index > 0; index -= 1) {
      const swapIndex = this.nextInt(0, index + 1)
      const temp = output[index]
      output[index] = output[swapIndex]
      output[swapIndex] = temp
    }
    return output
  }
}

export const createMazeRng = (seed: string): MazeRng => new SeededRng(seed)
