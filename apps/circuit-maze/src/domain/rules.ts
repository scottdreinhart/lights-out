import {
  DASH_COOLDOWN_TICKS,
  DEFAULT_SENTINEL_AI_TIER,
  LEVEL_ONE,
  LOCKDOWN_THRESHOLD,
  SENTINEL_AI_TIERS,
} from './constants'
import type {
  Direction,
  GameState,
  LevelDefinition,
  Position,
  SentinelAiTier,
  SentinelMode,
  SentinelState,
  TileKind,
} from './types'

// TODO(circuit-maze): Replace greedy chase step with reusable grid pathfinding (A*/BFS)
// once additional sentinel classes are introduced. Keep this deterministic.
// TODO(circuit-maze): Promote pressure formula constants into per-level tuning profiles
// after playtest balancing passes.

export type GameAction =
  | { type: 'move'; direction: Direction }
  | { type: 'dash' }
  | { type: 'tick'; sentinels?: SentinelState[] }
  | { type: 'setSentinelAiTier'; tier: SentinelAiTier }
  | { type: 'restart' }

const DIRECTION_DELTAS: Record<Direction, Position> = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
}

const clamp = (value: number, min: number, max: number): number => {
  if (value < min) {
    return min
  }
  if (value > max) {
    return max
  }
  return value
}

const samePosition = (a: Position, b: Position): boolean => a.x === b.x && a.y === b.y

const toKey = ({ x, y }: Position): string => `${x}:${y}`

export const tileAt = (level: LevelDefinition, position: Position): TileKind => {
  const row = level.layout[position.y]
  const cell = row?.[position.x] ?? '#'
  if (cell === '#') {
    return 'wall'
  }
  if (cell === 'E') {
    return 'exit'
  }
  return 'floor'
}

const isWalkable = (level: LevelDefinition, position: Position): boolean =>
  tileAt(level, position) !== 'wall'

const stepToward = (from: Position, to: Position): Position => {
  const dx = to.x - from.x
  const dy = to.y - from.y
  if (Math.abs(dx) >= Math.abs(dy) && dx !== 0) {
    return { x: from.x + Math.sign(dx), y: from.y }
  }
  if (dy !== 0) {
    return { x: from.x, y: from.y + Math.sign(dy) }
  }
  return from
}

const moveByDirection = (
  level: LevelDefinition,
  origin: Position,
  direction: Direction,
): Position => {
  const delta = DIRECTION_DELTAS[direction]
  const next = { x: origin.x + delta.x, y: origin.y + delta.y }
  return isWalkable(level, next) ? next : origin
}

const pressureMoveInterval = (sentinel: SentinelState, pressure: number): number => {
  const pressureBoost = Math.floor(pressure / 30)
  return Math.max(2, sentinel.baseMoveInterval - pressureBoost)
}

const detectMode = (player: Position, sentinel: SentinelState): SentinelMode => {
  const distance =
    Math.abs(player.x - sentinel.position.x) + Math.abs(player.y - sentinel.position.y)
  return distance <= 4 ? 'chase' : 'patrol'
}

const moveSentinel = (
  level: LevelDefinition,
  sentinel: SentinelState,
  player: Position,
): SentinelState => {
  const mode = detectMode(player, sentinel)
  if (mode === 'chase') {
    const candidate = stepToward(sentinel.position, player)
    return {
      ...sentinel,
      mode,
      position: isWalkable(level, candidate) ? candidate : sentinel.position,
    }
  }

  const route = sentinel.patrolRoute
  const target = route[sentinel.patrolIndex] ?? sentinel.position
  const nextPos = stepToward(sentinel.position, target)
  const reachedTarget = samePosition(nextPos, target)
  return {
    ...sentinel,
    mode,
    position: isWalkable(level, nextPos) ? nextPos : sentinel.position,
    patrolIndex: reachedTarget ? (sentinel.patrolIndex + 1) % route.length : sentinel.patrolIndex,
  }
}

const parseLevel = (
  level: LevelDefinition,
): { start: Position; exit: Position; nodes: Position[] } => {
  const nodes: Position[] = []
  let start: Position | null = null
  let exit: Position | null = null

  level.layout.forEach((row, y) => {
    row.split('').forEach((cell, x) => {
      if (cell === 'S') {
        start = { x, y }
      } else if (cell === 'E') {
        exit = { x, y }
      } else if (cell === 'N') {
        nodes.push({ x, y })
      }
    })
  })

  if (!start || !exit) {
    throw new Error(`Invalid level '${level.id}': missing start or exit`)
  }

  return { start, exit, nodes }
}

export const createInitialGameState = (level: LevelDefinition = LEVEL_ONE): GameState => {
  const parsed = parseLevel(level)
  return {
    status: 'playing',
    lossReason: null,
    tick: 0,
    score: 0,
    pressure: 0,
    lockdownTicksRemaining: null,
    player: { position: parsed.start, direction: 'right' },
    sentinels: level.sentinels.map((definition) => ({
      id: definition.id,
      position: definition.start,
      patrolRoute: definition.patrolRoute,
      patrolIndex: 1 % definition.patrolRoute.length,
      mode: 'patrol',
      baseMoveInterval: definition.baseMoveInterval,
    })),
    nodesRemaining: parsed.nodes,
    totalNodes: parsed.nodes.length,
    exit: parsed.exit,
    exitUnlocked: false,
    dashCooldownTicks: 0,
    sentinelAiTier: DEFAULT_SENTINEL_AI_TIER,
    level,
    statusMessage: 'Infiltrate the circuit and collect all nodes.',
  }
}

const withNodeCollection = (state: GameState): GameState => {
  const remaining = state.nodesRemaining.filter(
    (node) => !samePosition(node, state.player.position),
  )
  const collectedCount = state.nodesRemaining.length - remaining.length
  const exitUnlocked = remaining.length === 0

  const nextPressure = clamp(
    state.pressure + collectedCount * state.level.nodePressureGain,
    0,
    LOCKDOWN_THRESHOLD,
  )
  return {
    ...state,
    nodesRemaining: remaining,
    exitUnlocked,
    pressure: nextPressure,
    score: state.score + collectedCount * 120,
    statusMessage: exitUnlocked
      ? 'Exit OPEN. Reach extraction before lockdown.'
      : collectedCount > 0
        ? 'Node captured. Security pressure increased.'
        : state.statusMessage,
  }
}

const withCollisionCheck = (state: GameState): GameState => {
  const touched = state.sentinels.some((sentinel) =>
    samePosition(sentinel.position, state.player.position),
  )
  if (touched) {
    return {
      ...state,
      status: 'lost',
      lossReason: 'sentinel',
      statusMessage: 'Intrusion detected: sentinel contact.',
    }
  }
  return state
}

const withExitResolution = (state: GameState): GameState => {
  if (state.exitUnlocked && samePosition(state.player.position, state.exit)) {
    return {
      ...state,
      status: 'won',
      statusMessage: 'Extraction complete. Circuit breach successful.',
      score: state.score + 500,
    }
  }
  return state
}

const withPlayerMove = (state: GameState, direction: Direction, distance: number): GameState => {
  let position = state.player.position
  for (let step = 0; step < distance; step += 1) {
    position = moveByDirection(state.level, position, direction)
  }

  let next: GameState = {
    ...state,
    player: { position, direction },
  }
  next = withNodeCollection(next)
  next = withExitResolution(next)
  next = withCollisionCheck(next)
  return next
}

const proximityPressureGain = (state: GameState): number => {
  const minDistance = state.sentinels.reduce((min, sentinel) => {
    const distance =
      Math.abs(sentinel.position.x - state.player.position.x) +
      Math.abs(sentinel.position.y - state.player.position.y)
    return Math.min(min, distance)
  }, Number.POSITIVE_INFINITY)

  if (minDistance <= 1) {
    return 0.9
  }
  if (minDistance <= 2) {
    return 0.5
  }
  return 0
}

const withTick = (state: GameState, sentinelDecisions?: SentinelState[]): GameState => {
  const nextTick = state.tick + 1
  const cooldown = Math.max(0, state.dashCooldownTicks - 1)
  const pressureGain = state.level.pressurePerTick + proximityPressureGain(state)
  const nextPressure = clamp(state.pressure + pressureGain, 0, LOCKDOWN_THRESHOLD)

  let lockdownTicksRemaining = state.lockdownTicksRemaining
  let statusMessage = state.statusMessage
  if (nextPressure >= LOCKDOWN_THRESHOLD && lockdownTicksRemaining === null) {
    lockdownTicksRemaining = state.level.lockdownTicks
    statusMessage = 'SYSTEM OVERLOAD: lockdown initiated.'
  } else if (lockdownTicksRemaining !== null) {
    lockdownTicksRemaining -= 1
  }

  let next: GameState = {
    ...state,
    tick: nextTick,
    pressure: nextPressure,
    dashCooldownTicks: cooldown,
    lockdownTicksRemaining,
    statusMessage:
      lockdownTicksRemaining !== null
        ? `${statusMessage} Escape in ${Math.max(0, lockdownTicksRemaining)} ticks.`
        : state.exitUnlocked
          ? 'Exit OPEN. Escape now.'
          : 'Collect all nodes before pressure peaks.',
  }

  next = sentinelDecisions
    ? { ...next, sentinels: sentinelDecisions }
    : {
        ...next,
        sentinels: next.sentinels.map((sentinel) => {
          const interval = pressureMoveInterval(sentinel, next.pressure)
          if (nextTick % interval !== 0) {
            return sentinel
          }
          return moveSentinel(next.level, sentinel, next.player.position)
        }),
      }

  next = withCollisionCheck(next)
  next = withExitResolution(next)

  if (
    next.lockdownTicksRemaining !== null &&
    next.lockdownTicksRemaining <= 0 &&
    next.status === 'playing'
  ) {
    return {
      ...next,
      status: 'lost',
      lossReason: 'lockdown',
      statusMessage: 'Lockdown complete. Extraction failed.',
      lockdownTicksRemaining: 0,
    }
  }

  return next
}

export const reduceGameState = (state: GameState, action: GameAction): GameState => {
  if (action.type === 'restart') {
    return createInitialGameState(state.level)
  }

  if (action.type === 'setSentinelAiTier') {
    if (!SENTINEL_AI_TIERS.includes(action.tier)) {
      return state
    }
    return {
      ...state,
      sentinelAiTier: action.tier,
      statusMessage: `Sentinel AI set to ${action.tier.toUpperCase()}.`,
    }
  }

  if (state.status !== 'playing') {
    return state
  }

  if (action.type === 'move') {
    return withPlayerMove(state, action.direction, 1)
  }

  if (action.type === 'dash') {
    if (state.dashCooldownTicks > 0) {
      return state
    }
    const moved = withPlayerMove(state, state.player.direction, 2)
    return { ...moved, dashCooldownTicks: DASH_COOLDOWN_TICKS }
  }

  return withTick(state, action.type === 'tick' ? action.sentinels : undefined)
}

export const getNodeProgress = (state: GameState): { collected: number; total: number } => ({
  collected: state.totalNodes - state.nodesRemaining.length,
  total: state.totalNodes,
})

export const getSentinelSpeedTier = (pressure: number): 'low' | 'medium' | 'high' => {
  if (pressure >= 75) {
    return 'high'
  }
  if (pressure >= 40) {
    return 'medium'
  }
  return 'low'
}

export const hasNodeAt = (state: GameState, position: Position): boolean => {
  const nodeSet = new Set(state.nodesRemaining.map(toKey))
  return nodeSet.has(toKey(position))
}
