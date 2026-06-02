export type Direction = 'up' | 'down' | 'left' | 'right'
export type GameStatus = 'playing' | 'won' | 'lost'
export type LossReason = 'sentinel' | 'lockdown' | null
export type SentinelMode = 'patrol' | 'chase'
export type SentinelAiTier = 'easy' | 'medium' | 'hard' | 'elite'
export type TileKind = 'wall' | 'floor' | 'exit'

export interface Position {
  x: number
  y: number
}

export interface SentinelDefinition {
  id: string
  start: Position
  patrolRoute: Position[]
  baseMoveInterval: number
}

export interface LevelDefinition {
  id: string
  name: string
  layout: string[]
  pressurePerTick: number
  nodePressureGain: number
  lockdownTicks: number
  sentinels: SentinelDefinition[]
}

export interface SentinelState {
  id: string
  position: Position
  patrolRoute: Position[]
  patrolIndex: number
  mode: SentinelMode
  baseMoveInterval: number
}

export interface PlayerState {
  position: Position
  direction: Direction
}

export interface GameState {
  status: GameStatus
  lossReason: LossReason
  tick: number
  score: number
  pressure: number
  lockdownTicksRemaining: number | null
  player: PlayerState
  sentinels: SentinelState[]
  nodesRemaining: Position[]
  totalNodes: number
  exit: Position
  exitUnlocked: boolean
  dashCooldownTicks: number
  sentinelAiTier: SentinelAiTier
  level: LevelDefinition
  statusMessage: string
}

export interface GameMeta {
  slug: string
  title: string
  family: string
  summary: string
}
