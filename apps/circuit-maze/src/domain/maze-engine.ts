/**
 * TODO:
 * - Single responsibility: deterministic maze generation + grid/graph conversion.
 * - Invariants: reciprocal walls stay consistent and generated mazes remain connected.
 * - Layer ownership: domain.
 * - Expected tests: determinism, solvability, shortest-path parity, braid dead-end reduction.
 * - Pattern: strategy-driven generators with injected RNG.
 */

import { createMazeRng, type MazeRng } from './maze-contracts'
import type { LevelDefinition, Position } from './types'

export type MazeAlgorithm =
  | 'dfs'
  | 'recursive-backtracker'
  | 'prim'
  | 'kruskal'
  | 'wilson'
  | 'eller'
  | 'sidewinder'
export type MazeKind = 'perfect' | 'braided' | 'weighted'
export type GraphNodeId = string

export interface MazeCell {
  x: number
  y: number
  walls: {
    top: boolean
    right: boolean
    bottom: boolean
    left: boolean
  }
  visited?: boolean
  weight?: number
}

export interface Maze {
  width: number
  height: number
  grid: MazeCell[][]
  seed: string
  type: MazeKind
}

export interface MazeGraph {
  nodes: Set<GraphNodeId>
  edges: Map<GraphNodeId, GraphNodeId[]>
}

export interface MazeConfig {
  width: number
  height: number
  seed: string
  algorithm: MazeAlgorithm
  braidFactor?: number
  branchingFactor?: number
  weighted?: boolean
}

interface CellRef {
  x: number
  y: number
}

interface EdgeRef {
  a: CellRef
  b: CellRef
}

const directions = [
  { dx: 0, dy: -1, wall: 'top', opposite: 'bottom' },
  { dx: 1, dy: 0, wall: 'right', opposite: 'left' },
  { dx: 0, dy: 1, wall: 'bottom', opposite: 'top' },
  { dx: -1, dy: 0, wall: 'left', opposite: 'right' },
] as const

type WallName = (typeof directions)[number]['wall']

const toNodeId = (x: number, y: number): GraphNodeId => `${x},${y}`

const parseNodeId = (nodeId: GraphNodeId): CellRef => {
  const [x, y] = nodeId.split(',').map(Number)
  return { x, y }
}

const createGrid = (width: number, height: number): MazeCell[][] =>
  Array.from({ length: height }, (_, y) =>
    Array.from({ length: width }, (_, x) => ({
      x,
      y,
      walls: { top: true, right: true, bottom: true, left: true },
      visited: false,
    })),
  )

const inBounds = (x: number, y: number, width: number, height: number): boolean =>
  x >= 0 && x < width && y >= 0 && y < height

const carvePassage = (grid: MazeCell[][], a: CellRef, b: CellRef): void => {
  const dx = b.x - a.x
  const dy = b.y - a.y

  if (dx === 1) {
    grid[a.y][a.x].walls.right = false
    grid[b.y][b.x].walls.left = false
  } else if (dx === -1) {
    grid[a.y][a.x].walls.left = false
    grid[b.y][b.x].walls.right = false
  } else if (dy === 1) {
    grid[a.y][a.x].walls.bottom = false
    grid[b.y][b.x].walls.top = false
  } else if (dy === -1) {
    grid[a.y][a.x].walls.top = false
    grid[b.y][b.x].walls.bottom = false
  }
}

const getNeighbors = (x: number, y: number, width: number, height: number): CellRef[] => {
  const out: CellRef[] = []
  for (const direction of directions) {
    const nx = x + direction.dx
    const ny = y + direction.dy
    if (inBounds(nx, ny, width, height)) {
      out.push({ x: nx, y: ny })
    }
  }
  return out
}

const shuffle = <T>(items: T[], rng: MazeRng): T[] => rng.shuffle(items)

const generateDfsMaze = (config: MazeConfig, rng: MazeRng): MazeCell[][] => {
  const grid = createGrid(config.width, config.height)
  const stack: CellRef[] = [{ x: 0, y: 0 }]
  grid[0][0].visited = true

  while (stack.length > 0) {
    const current = stack[stack.length - 1]
    const candidates = shuffle(
      getNeighbors(current.x, current.y, config.width, config.height).filter(
        ({ x, y }) => !grid[y][x].visited,
      ),
      rng,
    )

    const next = candidates[0]
    if (!next) {
      stack.pop()
      continue
    }

    carvePassage(grid, current, next)
    grid[next.y][next.x].visited = true
    stack.push(next)
  }

  return grid
}

const generatePrimMaze = (config: MazeConfig, rng: MazeRng): MazeCell[][] => {
  const grid = createGrid(config.width, config.height)
  const frontier: EdgeRef[] = []
  const visited = new Set<string>()
  const pushFrontier = (x: number, y: number): void => {
    for (const next of getNeighbors(x, y, config.width, config.height)) {
      if (!visited.has(toNodeId(next.x, next.y))) {
        frontier.push({ a: { x, y }, b: next })
      }
    }
  }

  visited.add(toNodeId(0, 0))
  pushFrontier(0, 0)

  while (frontier.length > 0) {
    const edgeIndex = rng.nextInt(0, frontier.length)
    const [edge] = frontier.splice(edgeIndex, 1)
    const nodeKey = toNodeId(edge.b.x, edge.b.y)
    if (visited.has(nodeKey)) {
      continue
    }
    carvePassage(grid, edge.a, edge.b)
    visited.add(nodeKey)
    pushFrontier(edge.b.x, edge.b.y)
  }

  return grid
}

class UnionFind {
  private readonly parent: number[]
  private readonly rank: number[]

  constructor(size: number) {
    this.parent = Array.from({ length: size }, (_, index) => index)
    this.rank = Array.from({ length: size }, () => 0)
  }

  find(node: number): number {
    if (this.parent[node] !== node) {
      this.parent[node] = this.find(this.parent[node])
    }
    return this.parent[node]
  }

  union(a: number, b: number): boolean {
    const rootA = this.find(a)
    const rootB = this.find(b)
    if (rootA === rootB) {
      return false
    }

    if (this.rank[rootA] < this.rank[rootB]) {
      this.parent[rootA] = rootB
    } else if (this.rank[rootA] > this.rank[rootB]) {
      this.parent[rootB] = rootA
    } else {
      this.parent[rootB] = rootA
      this.rank[rootA] += 1
    }
    return true
  }
}

const generateKruskalMaze = (config: MazeConfig, rng: MazeRng): MazeCell[][] => {
  const grid = createGrid(config.width, config.height)
  const edges: EdgeRef[] = []
  for (let y = 0; y < config.height; y += 1) {
    for (let x = 0; x < config.width; x += 1) {
      if (x + 1 < config.width) {
        edges.push({ a: { x, y }, b: { x: x + 1, y } })
      }
      if (y + 1 < config.height) {
        edges.push({ a: { x, y }, b: { x, y: y + 1 } })
      }
    }
  }

  const shuffled = shuffle(edges, rng)
  const disjoint = new UnionFind(config.width * config.height)
  const toIndex = (x: number, y: number): number => y * config.width + x

  for (const edge of shuffled) {
    const a = toIndex(edge.a.x, edge.a.y)
    const b = toIndex(edge.b.x, edge.b.y)
    if (disjoint.union(a, b)) {
      carvePassage(grid, edge.a, edge.b)
    }
  }
  return grid
}

const generateWilsonMaze = (config: MazeConfig, rng: MazeRng): MazeCell[][] => {
  const grid = createGrid(config.width, config.height)
  const all: CellRef[] = []
  for (let y = 0; y < config.height; y += 1) {
    for (let x = 0; x < config.width; x += 1) {
      all.push({ x, y })
    }
  }

  const unvisited = new Set(all.map(({ x, y }) => toNodeId(x, y)))
  const root = all[rng.nextInt(0, all.length)]
  unvisited.delete(toNodeId(root.x, root.y))

  while (unvisited.size > 0) {
    const candidates = Array.from(unvisited).map(parseNodeId)
    const start = candidates[rng.nextInt(0, candidates.length)]
    let walk: CellRef[] = [start]
    let walkIndex = new Map<string, number>([[toNodeId(start.x, start.y), 0]])

    while (unvisited.has(toNodeId(walk[walk.length - 1].x, walk[walk.length - 1].y))) {
      const current = walk[walk.length - 1]
      const nexts = getNeighbors(current.x, current.y, config.width, config.height)
      const next = nexts[rng.nextInt(0, nexts.length)]
      const key = toNodeId(next.x, next.y)
      const seenAt = walkIndex.get(key)

      if (seenAt !== undefined) {
        walk = walk.slice(0, seenAt + 1)
        walkIndex = new Map(walk.map((cell, index) => [toNodeId(cell.x, cell.y), index]))
      } else {
        walk.push(next)
        walkIndex.set(key, walk.length - 1)
      }
    }

    for (let index = 0; index < walk.length - 1; index += 1) {
      carvePassage(grid, walk[index], walk[index + 1])
      unvisited.delete(toNodeId(walk[index].x, walk[index].y))
    }
    const tail = walk[walk.length - 1]
    unvisited.delete(toNodeId(tail.x, tail.y))
  }

  return grid
}

const generateEllerMaze = (config: MazeConfig, rng: MazeRng): MazeCell[][] => {
  const grid = createGrid(config.width, config.height)
  let nextSetId = 1
  let sets: number[] = Array.from({ length: config.width }, () => nextSetId++)

  for (let y = 0; y < config.height; y += 1) {
    for (let x = 0; x < config.width - 1; x += 1) {
      const shouldJoin = rng.next() < 0.5 || y === config.height - 1
      if (shouldJoin && sets[x] !== sets[x + 1]) {
        carvePassage(grid, { x, y }, { x: x + 1, y })
        const oldSet = sets[x + 1]
        const newSet = sets[x]
        sets = sets.map((setId) => (setId === oldSet ? newSet : setId))
      }
    }

    if (y === config.height - 1) {
      break
    }

    const openings = new Map<number, number[]>()
    for (let x = 0; x < config.width; x += 1) {
      const setId = sets[x]
      const setOpenings = openings.get(setId) ?? []
      setOpenings.push(x)
      openings.set(setId, setOpenings)
    }

    const nextRowSets = Array.from({ length: config.width }, () => 0)
    for (const [setId, cells] of openings.entries()) {
      const shuffledCells = shuffle(cells, rng)
      const carveCount = Math.max(1, Math.floor(shuffledCells.length * 0.5))
      for (let index = 0; index < shuffledCells.length; index += 1) {
        const x = shuffledCells[index]
        if (index < carveCount || rng.next() < 0.25) {
          carvePassage(grid, { x, y }, { x, y: y + 1 })
          nextRowSets[x] = setId
        }
      }
    }

    for (let x = 0; x < config.width; x += 1) {
      if (nextRowSets[x] === 0) {
        nextRowSets[x] = nextSetId++
      }
    }
    sets = nextRowSets
  }

  return grid
}

const generateSidewinderMaze = (config: MazeConfig, rng: MazeRng): MazeCell[][] => {
  const grid = createGrid(config.width, config.height)

  for (let y = 0; y < config.height; y += 1) {
    let run: CellRef[] = []
    for (let x = 0; x < config.width; x += 1) {
      run.push({ x, y })
      const atEasternBoundary = x === config.width - 1
      const atNorthernBoundary = y === 0
      const carveEast = !atEasternBoundary && (atNorthernBoundary || rng.next() < 0.65)

      if (carveEast) {
        carvePassage(grid, { x, y }, { x: x + 1, y })
      } else {
        if (!atNorthernBoundary) {
          const member = run[rng.nextInt(0, run.length)]
          carvePassage(grid, member, { x: member.x, y: member.y - 1 })
        }
        run = []
      }
    }
  }

  return grid
}

const deadEndCells = (grid: MazeCell[][]): CellRef[] => {
  const ends: CellRef[] = []
  for (const row of grid) {
    for (const cell of row) {
      const exits = [
        !cell.walls.top,
        !cell.walls.right,
        !cell.walls.bottom,
        !cell.walls.left,
      ].filter(Boolean).length
      if (exits === 1) {
        ends.push({ x: cell.x, y: cell.y })
      }
    }
  }
  return ends
}

const braidMaze = (grid: MazeCell[][], braidFactor: number, rng: MazeRng): void => {
  const ends = shuffle(deadEndCells(grid), rng)
  for (const end of ends) {
    if (rng.next() > braidFactor) {
      continue
    }

    const closedNeighbors = shuffle(
      directions
        .map((direction) => ({
          direction,
          nx: end.x + direction.dx,
          ny: end.y + direction.dy,
        }))
        .filter(({ nx, ny, direction }) => {
          if (!inBounds(nx, ny, grid[0].length, grid.length)) {
            return false
          }
          return grid[end.y][end.x].walls[direction.wall]
        }),
      rng,
    )

    const pick = closedNeighbors[0]
    if (!pick) {
      continue
    }

    const opposite = pick.direction.opposite as WallName
    grid[end.y][end.x].walls[pick.direction.wall] = false
    grid[pick.ny][pick.nx].walls[opposite] = false
  }
}

const applyWeights = (grid: MazeCell[][], rng: MazeRng): void => {
  for (const row of grid) {
    for (const cell of row) {
      cell.weight = 1 + Math.floor(rng.next() * 9)
    }
  }
}

export const generateMaze = (config: MazeConfig): Maze => {
  const rng = createMazeRng(config.seed)
  const generatorByAlgorithm: Record<
    MazeAlgorithm,
    (cfg: MazeConfig, random: MazeRng) => MazeCell[][]
  > = {
    dfs: generateDfsMaze,
    'recursive-backtracker': generateDfsMaze,
    prim: generatePrimMaze,
    kruskal: generateKruskalMaze,
    wilson: generateWilsonMaze,
    eller: generateEllerMaze,
    sidewinder: generateSidewinderMaze,
  }

  const grid = generatorByAlgorithm[config.algorithm](config, rng)
  if (config.braidFactor && config.braidFactor > 0) {
    braidMaze(grid, Math.min(1, Math.max(0, config.braidFactor)), rng)
  }
  if (config.weighted) {
    applyWeights(grid, rng)
  }

  return {
    width: config.width,
    height: config.height,
    grid,
    seed: config.seed,
    type: config.weighted ? 'weighted' : config.braidFactor ? 'braided' : 'perfect',
  }
}

export const mazeToGraph = (maze: Maze): MazeGraph => {
  const nodes = new Set<GraphNodeId>()
  const edges = new Map<GraphNodeId, GraphNodeId[]>()

  for (let y = 0; y < maze.height; y += 1) {
    for (let x = 0; x < maze.width; x += 1) {
      const cell = maze.grid[y][x]
      const nodeId = toNodeId(x, y)
      nodes.add(nodeId)
      const neighbors: GraphNodeId[] = []
      if (!cell.walls.top && y > 0) {
        neighbors.push(toNodeId(x, y - 1))
      }
      if (!cell.walls.right && x + 1 < maze.width) {
        neighbors.push(toNodeId(x + 1, y))
      }
      if (!cell.walls.bottom && y + 1 < maze.height) {
        neighbors.push(toNodeId(x, y + 1))
      }
      if (!cell.walls.left && x > 0) {
        neighbors.push(toNodeId(x - 1, y))
      }
      edges.set(nodeId, neighbors)
    }
  }

  return { nodes, edges }
}

export const createMazeFromLevel = (level: LevelDefinition, seed: string = level.id): Maze => {
  const height = level.layout.length
  const width = level.layout[0]?.length ?? 0
  const grid = createGrid(width, height)

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      if (level.layout[y][x] === '#') {
        continue
      }
      for (const direction of directions) {
        const nx = x + direction.dx
        const ny = y + direction.dy
        if (!inBounds(nx, ny, width, height)) {
          continue
        }
        if (level.layout[ny][nx] !== '#') {
          grid[y][x].walls[direction.wall] = false
        }
      }
    }
  }

  return {
    width,
    height,
    grid,
    seed,
    type: 'perfect',
  }
}

export const positionToNodeId = (position: Position): GraphNodeId =>
  toNodeId(position.x, position.y)

export const nodeIdToPosition = (nodeId: GraphNodeId): Position => {
  const parsed = parseNodeId(nodeId)
  return { x: parsed.x, y: parsed.y }
}

export const countDeadEnds = (maze: Maze): number => deadEndCells(maze.grid).length
