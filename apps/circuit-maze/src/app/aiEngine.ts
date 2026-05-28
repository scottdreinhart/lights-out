import type {
  Direction,
  GameState,
  MazeGraph,
  Position,
  SentinelAiTier,
  SentinelState,
} from '@/domain'
import {
  aStar,
  createMazeFromLevel,
  mazeToGraph,
  nodeIdToPosition,
  positionToNodeId,
  tileAt,
} from '@/domain'
import { AI_WASM_BASE64 } from '@/wasm/ai-wasm'

interface WasmSentinelExports {
  initGrid: (width: number, height: number) => void
  setWall: (index: number, blocked: number) => void
  pickMoveAStar: (
    currentX: number,
    currentY: number,
    targetX: number,
    targetY: number,
    tier: number,
    seed: number,
  ) => number
}

const DIRECTIONS: readonly Direction[] = ['up', 'right', 'down', 'left']
const DIRECTION_DELTAS: Record<Direction, Position> = {
  up: { x: 0, y: -1 },
  right: { x: 1, y: 0 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
}

const CHASE_RADIUS: Record<SentinelAiTier, number> = {
  easy: 3,
  medium: 5,
  hard: 7,
  elite: 9,
}

const TIER_SPEED_BONUS: Record<SentinelAiTier, number> = {
  easy: 0,
  medium: 0,
  hard: 1,
  elite: 2,
}

const TIER_INDEX: Record<SentinelAiTier, number> = {
  easy: 0,
  medium: 1,
  hard: 2,
  elite: 3,
}

let wasmExports: WasmSentinelExports | null = null
let wasmInitPromise: Promise<void> | null = null
let wasmGridSignature: string | null = null
let sentinelAiRuntime: 'wasm' | 'js' = 'js'
let cachedLevelGraphSignature: string | null = null
let cachedLevelGraph: MazeGraph | null = null

const manhattanDistance = (a: Position, b: Position): number =>
  Math.abs(a.x - b.x) + Math.abs(a.y - b.y)

const samePosition = (a: Position, b: Position): boolean => a.x === b.x && a.y === b.y

const isWalkable = (state: GameState, position: Position): boolean =>
  tileAt(state.level, position) !== 'wall'

const moveByDirection = (state: GameState, origin: Position, direction: Direction): Position => {
  const delta = DIRECTION_DELTAS[direction]
  const next = { x: origin.x + delta.x, y: origin.y + delta.y }
  return isWalkable(state, next) ? next : origin
}

const getLevelGraph = (state: GameState): MazeGraph => {
  const height = state.level.layout.length
  const width = state.level.layout[0]?.length ?? 0
  const signature = `${state.level.id}:${width}x${height}`
  if (cachedLevelGraphSignature === signature && cachedLevelGraph) {
    return cachedLevelGraph
  }

  const maze = createMazeFromLevel(state.level, signature)
  cachedLevelGraph = mazeToGraph(maze)
  cachedLevelGraphSignature = signature
  return cachedLevelGraph
}

const findShortestStepByGraph = (
  state: GameState,
  origin: Position,
  goal: Position,
): Position | null => {
  if (samePosition(origin, goal)) {
    return origin
  }

  const graph = getLevelGraph(state)
  const path = aStar(graph, positionToNodeId(origin), positionToNodeId(goal))
  if (path.length < 2) {
    return null
  }
  return nodeIdToPosition(path[1])
}

const hashSeed = (tick: number, sentinelId: string): number => {
  let hash = tick | 0
  for (let index = 0; index < sentinelId.length; index += 1) {
    hash = (hash * 31 + sentinelId.charCodeAt(index)) | 0
  }
  return Math.abs(hash)
}

const predictPlayerPosition = (state: GameState): Position => {
  const firstStep = moveByDirection(state, state.player.position, state.player.direction)
  if (state.sentinelAiTier === 'elite') {
    return moveByDirection(state, firstStep, state.player.direction)
  }
  return firstStep
}

const shouldChase = (state: GameState, sentinel: SentinelState): boolean => {
  const distance = manhattanDistance(state.player.position, sentinel.position)
  return distance <= CHASE_RADIUS[state.sentinelAiTier]
}

const getPatrolTarget = (sentinel: SentinelState): Position =>
  sentinel.patrolRoute[sentinel.patrolIndex] ?? sentinel.position

const configureWasmGrid = (state: GameState): void => {
  if (!wasmExports) {
    return
  }

  const height = state.level.layout.length
  const width = state.level.layout[0]?.length ?? 0
  const signature = `${state.level.id}:${width}x${height}`
  if (wasmGridSignature === signature) {
    return
  }

  wasmExports.initGrid(width, height)
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const blocked = tileAt(state.level, { x, y }) === 'wall' ? 1 : 0
      wasmExports.setWall(y * width + x, blocked)
    }
  }
  wasmGridSignature = signature
}

const chooseDirectionWithWasm = (
  sentinelPosition: Position,
  target: Position,
  tier: SentinelAiTier,
  seed: number,
): Direction | null => {
  if (!wasmExports) {
    return null
  }

  const directionIndex = wasmExports.pickMoveAStar(
    sentinelPosition.x,
    sentinelPosition.y,
    target.x,
    target.y,
    TIER_INDEX[tier],
    seed,
  )

  if (directionIndex < 0 || directionIndex >= DIRECTIONS.length) {
    return null
  }
  return DIRECTIONS[directionIndex]
}

const moveSentinelOnce = (
  state: GameState,
  sentinel: SentinelState,
  nextTick: number,
): { sentinel: SentinelState; usedWasm: boolean } => {
  const pressureBoost = Math.floor(state.pressure / 30)
  const speedBonus = TIER_SPEED_BONUS[state.sentinelAiTier]
  const interval = Math.max(1, sentinel.baseMoveInterval - pressureBoost - speedBonus)
  if (nextTick % interval !== 0) {
    return { sentinel, usedWasm: false }
  }

  const chaseMode = shouldChase(state, sentinel)
  const mode = chaseMode ? 'chase' : 'patrol'

  const target = chaseMode
    ? state.sentinelAiTier === 'easy' || state.sentinelAiTier === 'medium'
      ? state.player.position
      : predictPlayerPosition(state)
    : getPatrolTarget(sentinel)

  const seed = hashSeed(nextTick, sentinel.id)
  const confusion = state.sentinelAiTier === 'easy' ? seed % 100 < 35 : false

  let nextPosition = sentinel.position
  let usedWasm = false
  if (!confusion) {
    const wasmDirection = chooseDirectionWithWasm(
      sentinel.position,
      target,
      state.sentinelAiTier,
      seed,
    )
    if (wasmDirection) {
      nextPosition = moveByDirection(state, sentinel.position, wasmDirection)
      usedWasm = true
    } else {
      const shortestStep = findShortestStepByGraph(state, sentinel.position, target)
      if (shortestStep && !samePosition(shortestStep, sentinel.position)) {
        nextPosition = shortestStep
      }
    }
  }

  let nextPatrolIndex = sentinel.patrolIndex
  if (!chaseMode) {
    const patrolTarget = getPatrolTarget(sentinel)
    if (samePosition(nextPosition, patrolTarget)) {
      nextPatrolIndex = (sentinel.patrolIndex + 1) % sentinel.patrolRoute.length
    }
  }

  let finalPosition = nextPosition
  if (
    state.sentinelAiTier === 'elite' &&
    state.pressure >= 70 &&
    chaseMode &&
    manhattanDistance(nextPosition, state.player.position) <= 3
  ) {
    const dashStep = findShortestStepByGraph(state, nextPosition, predictPlayerPosition(state))
    if (dashStep && !samePosition(dashStep, nextPosition)) {
      finalPosition = dashStep
    }
  }

  return {
    sentinel: {
      ...sentinel,
      position: finalPosition,
      mode,
      patrolIndex: nextPatrolIndex,
    },
    usedWasm,
  }
}

export const computeSentinelStates = (
  state: GameState,
): { sentinels: SentinelState[]; runtime: 'wasm' | 'js' } => {
  configureWasmGrid(state)
  const nextTick = state.tick + 1
  let usedWasm = false
  const sentinels = state.sentinels.map((sentinel) => {
    const result = moveSentinelOnce(state, sentinel, nextTick)
    usedWasm ||= result.usedWasm
    return result.sentinel
  })
  sentinelAiRuntime = wasmExports ? 'wasm' : 'js'
  return { sentinels, runtime: sentinelAiRuntime }
}

const decodeBase64 = (value: string): Uint8Array => {
  const binary = atob(value)
  const bytes = new Uint8Array(binary.length)
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index)
  }
  return bytes
}

export const ensureWasmReady = async (): Promise<void> => {
  if (wasmInitPromise) {
    return wasmInitPromise
  }
  wasmInitPromise = (async () => {
    if (!AI_WASM_BASE64) {
      return
    }
    try {
      const module = await WebAssembly.instantiate(decodeBase64(AI_WASM_BASE64), {
        env: { abort: () => {} },
      })
      const instance = module as unknown as WebAssembly.WebAssemblyInstantiatedSource
      const exports = instance.instance.exports as Partial<WasmSentinelExports>
      if (
        typeof exports.initGrid === 'function' &&
        typeof exports.setWall === 'function' &&
        typeof exports.pickMoveAStar === 'function'
      ) {
        wasmExports = {
          initGrid: exports.initGrid,
          setWall: exports.setWall,
          pickMoveAStar: exports.pickMoveAStar,
        }
        sentinelAiRuntime = 'wasm'
      }
    } catch {
      wasmExports = null
      sentinelAiRuntime = 'js'
    }
  })()
  return wasmInitPromise
}

export const getSentinelAiRuntime = (): 'wasm' | 'js' => sentinelAiRuntime
