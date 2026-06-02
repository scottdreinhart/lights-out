export type GameStatus = 'playing' | 'lost'
export type LossReason = 'collision' | 'bounds' | null
export type Velocity = number
export type Position = number
export type GravityConstant = number
export type BurstImpulse = number

export interface RunnerState {
  x: number
  y: Position
  velocityY: Velocity
  radius: number
}

export interface PhysicsState {
  gravity: GravityConstant
  burstImpulse: BurstImpulse
  maxRiseVelocity: Velocity
  maxFallVelocity: Velocity
}

export interface Gap {
  centerY: number
  size: number
}

export interface Obstacle {
  id: number
  x: number
  width: number
  gap: Gap
  passed: boolean
}

export interface SpawnRule {
  baseIntervalTicks: number
  minIntervalTicks: number
  baseGapSize: number
  minGapSize: number
  gapShrinkPerIntensity: number
  baseGapOffset: number
  maxGapOffset: number
  obstacleWidth: number
}

export interface IntensityState {
  value: number
}

export interface ScoreState {
  score: number
  distance: number
}

export interface TickState {
  tick: number
}

export interface DifficultyCurve {
  intensityPerTick: number
  baseSpeed: number
  speedPerIntensity: number
  maxSpeed: number
}

export interface LevelDefinition {
  id: string
  name: string
  worldWidth: number
  worldHeight: number
  floorY: number
  ceilingY: number
  playerX: number
  physics: PhysicsState
  spawnRule: SpawnRule
  difficulty: DifficultyCurve
}

export interface SessionState {
  status: GameStatus
  lossReason: LossReason
  tick: TickState
  score: ScoreState
  intensity: IntensityState
}

export interface GameState {
  status: GameStatus
  lossReason: LossReason
  tick: number
  score: number
  distance: number
  intensity: number
  speed: number
  gapSize: number
  runner: RunnerState
  obstacles: Obstacle[]
  nextObstacleId: number
  nextSpawnInTicks: number
  level: LevelDefinition
  statusMessage: string
}

export interface GameMeta {
  slug: string
  title: string
  family: string
  summary: string
}
