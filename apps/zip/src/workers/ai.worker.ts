import type {
  CellType,
  Difficulty,
  Maze,
  Move,
  PathNode,
  Position,
  Solution,
  ZipState,
} from '@/domain'
import {
  findOptimalPath,
  generateSolvableMaze,
  getHintMove,
  getValidMoves,
  MOVEMENT_COSTS,
} from '@/domain'
import { AI_WASM_BASE64 } from '../wasm/ai-wasm'

type EngineKind = 'wasm' | 'js'

type ZipWorkerRequestMap = {
  hint: { state: ZipState }
  solve: { state: ZipState }
  generate: { difficulty: Difficulty }
}

type ZipWorkerResponseMap = {
  hint: Position | null
  solve: Solution | null
  generate: ZipState
}

type WorkerRequest<K extends keyof ZipWorkerRequestMap> = {
  id: number
  command: K
  payload: ZipWorkerRequestMap[K]
}

type WorkerResponse<K extends keyof ZipWorkerResponseMap> = {
  id: number
  ok: boolean
  engine: EngineKind
  data?: ZipWorkerResponseMap[K]
  error?: string
}

type WasmDistanceFn = (fromRow: number, fromCol: number, toRow: number, toCol: number) => number

declare const self: Worker

let wasmDistanceFn: WasmDistanceFn | null = null
let engine: EngineKind = 'js'

const MOVEMENT_COST_BY_CELL: Record<CellType, number> = {
  empty: MOVEMENT_COSTS.empty,
  wall: Number.MAX_SAFE_INTEGER,
  start: MOVEMENT_COSTS.empty,
  goal: MOVEMENT_COSTS.goal,
  item: MOVEMENT_COSTS.item,
  player: MOVEMENT_COSTS.empty,
}

const positionKey = (position: Position): string => `${position.row},${position.col}`

const positionsEqual = (a: Position, b: Position): boolean => a.row === b.row && a.col === b.col

const movementCost = (to: Position, maze: Maze): number => {
  const cell = maze[to.row][to.col]
  return MOVEMENT_COST_BY_CELL[cell.type]
}

const heuristicDistance = (from: Position, to: Position): number => {
  if (wasmDistanceFn) {
    return wasmDistanceFn(from.row, from.col, to.row, to.col)
  }

  return Math.abs(from.row - to.row) + Math.abs(from.col - to.col)
}

const reconstructPath = (node: PathNode): Position[] => {
  const path: Position[] = []
  let current: PathNode | undefined = node

  while (current) {
    path.unshift(current.position)
    current = current.parent
  }

  return path
}

const pathCost = (path: Position[], maze: Maze): number => {
  let cost = 0
  for (let i = 0; i < path.length - 1; i++) {
    cost += movementCost(path[i + 1], maze)
  }
  return cost
}

const directionFromStep = (from: Position, to: Position): Move['direction'] => {
  const deltaRow = to.row - from.row
  const deltaCol = to.col - from.col

  if (deltaRow === -1) {
    return 'up'
  }
  if (deltaRow === 1) {
    return 'down'
  }
  if (deltaCol === -1) {
    return 'left'
  }
  return 'right'
}

const pathToMoves = (path: Position[]): Move[] => {
  const moves: Move[] = []
  for (let i = 0; i < path.length - 1; i++) {
    const from = path[i]
    const to = path[i + 1]
    moves.push({ from, to, direction: directionFromStep(from, to) })
  }
  return moves
}

const findPathAStarWithWasm = (start: Position, goal: Position, maze: Maze): Position[] => {
  const openSet: PathNode[] = []
  const closedSet = new Set<string>()

  const startNode: PathNode = {
    position: start,
    g: 0,
    h: heuristicDistance(start, goal),
    f: heuristicDistance(start, goal),
  }
  openSet.push(startNode)

  while (openSet.length > 0) {
    openSet.sort((a, b) => a.f - b.f)
    const current = openSet.shift()
    if (!current) {
      break
    }

    const key = positionKey(current.position)
    if (closedSet.has(key)) {
      continue
    }
    closedSet.add(key)

    if (positionsEqual(current.position, goal)) {
      return reconstructPath(current)
    }

    const validMoves = getValidMoves(current.position, maze)
    for (const move of validMoves) {
      const neighbor = move.to
      const neighborKey = positionKey(neighbor)
      if (closedSet.has(neighborKey)) {
        continue
      }

      const g = current.g + movementCost(neighbor, maze)
      const h = heuristicDistance(neighbor, goal)
      const f = g + h

      const existing = openSet.find(
        (node) => node.position.row === neighbor.row && node.position.col === neighbor.col,
      )

      if (!existing || g < existing.g) {
        const next: PathNode = {
          position: neighbor,
          g,
          h,
          f,
          parent: current,
        }

        if (existing) {
          Object.assign(existing, next)
        } else {
          openSet.push(next)
        }
      }
    }
  }

  return []
}

const findOptimalPathWithWasm = (state: ZipState): Solution | null => {
  const start = state.playerPosition
  const goal = state.goalPosition
  const remainingItems = state.items.filter(
    (item) => !state.collectedItems.some((collected) => positionsEqual(item, collected)),
  )

  if (remainingItems.length === 0) {
    const directPath = findPathAStarWithWasm(start, goal, state.maze)
    if (directPath.length === 0) {
      return null
    }

    return {
      path: directPath,
      moves: pathToMoves(directPath),
      collectedItems: [],
      totalCost: pathCost(directPath, state.maze),
    }
  }

  let currentPos = start
  const totalPath: Position[] = [start]
  const collectedSequence: Position[] = []
  const itemsQueue = [...remainingItems]

  while (itemsQueue.length > 0) {
    let bestItem: Position | null = null
    let bestItemPath: Position[] = []
    let bestCost = Number.POSITIVE_INFINITY

    for (const item of itemsQueue) {
      const candidate = findPathAStarWithWasm(currentPos, item, state.maze)
      if (candidate.length === 0) {
        continue
      }

      const candidateCost = pathCost(candidate, state.maze)
      if (candidateCost < bestCost) {
        bestCost = candidateCost
        bestItem = item
        bestItemPath = candidate
      }
    }

    if (!bestItem || bestItemPath.length === 0) {
      break
    }

    totalPath.push(...bestItemPath.slice(1))
    collectedSequence.push(bestItem)
    currentPos = bestItem

    const index = itemsQueue.findIndex((item) => positionsEqual(item, bestItem as Position))
    if (index >= 0) {
      itemsQueue.splice(index, 1)
    }
  }

  const goalPath = findPathAStarWithWasm(currentPos, goal, state.maze)
  if (goalPath.length > 0) {
    totalPath.push(...goalPath.slice(1))
  }

  if (totalPath.length <= 1) {
    return null
  }

  return {
    path: totalPath,
    moves: pathToMoves(totalPath),
    collectedItems: collectedSequence,
    totalCost: pathCost(totalPath, state.maze),
  }
}

const getHintMoveWithWasm = (state: ZipState): Position | null => {
  const solution = findOptimalPathWithWasm(state)
  if (!solution || solution.path.length < 2) {
    return null
  }

  return solution.path[1]
}

const initWasm = async (): Promise<void> => {
  try {
    if (!AI_WASM_BASE64) {
      return
    }

    const binary = atob(AI_WASM_BASE64)
    const bytes = new Uint8Array(binary.length)
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i)
    }

    const imports = { env: { abort: () => {} } }
    const { instance } = await WebAssembly.instantiate(bytes, imports)
    wasmDistanceFn = instance.exports.zipHeuristicDistance as WasmDistanceFn

    if (typeof wasmDistanceFn === 'function') {
      engine = 'wasm'
    }
  } catch {
    wasmDistanceFn = null
    engine = 'js'
  }
}

const wasmReady = initWasm()

self.onmessage = async (event: MessageEvent<WorkerRequest<keyof ZipWorkerRequestMap>>) => {
  await wasmReady

  const { id, command, payload } = event.data

  try {
    if (command === 'hint' && 'state' in payload) {
      const data = wasmDistanceFn ? getHintMoveWithWasm(payload.state) : getHintMove(payload.state)
      const response: WorkerResponse<'hint'> = { id, ok: true, engine, data }
      self.postMessage(response)
      return
    }

    if (command === 'solve' && 'state' in payload) {
      const data = wasmDistanceFn
        ? findOptimalPathWithWasm(payload.state)
        : findOptimalPath(payload.state)
      const response: WorkerResponse<'solve'> = { id, ok: true, engine, data }
      self.postMessage(response)
      return
    }

    if (command === 'generate' && 'difficulty' in payload) {
      const data = generateSolvableMaze(payload.difficulty)
      const response: WorkerResponse<'generate'> = { id, ok: true, engine, data }
      self.postMessage(response)
      return
    }

    throw new Error('Unsupported worker command payload')
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown worker error'
    const response: WorkerResponse<keyof ZipWorkerResponseMap> = {
      id,
      ok: false,
      engine,
      error: message,
    }
    self.postMessage(response)
  }
}
