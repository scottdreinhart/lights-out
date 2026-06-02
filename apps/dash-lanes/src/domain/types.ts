export type GamePhase = 'playing' | 'gameOver'
export type LaneIndex = 0 | 1 | 2
export type ObstacleKind = 'blocker'
export type InputCommand = 'forwardPush' | 'laneReset' | 'dashSurge' | 'laneLeft' | 'laneRight'

export interface GameMeta {
  slug: string
  title: string
  family: string
  summary: string
  primaryLabel: string
  secondaryLabel: string
  tertiaryLabel: string
}

export interface RunnerFlowProfile {
  scrollDirection: 'forward' | 'horizontal_right' | 'vertical_up'
  cameraMode: 'third_person_behind' | 'first_person' | 'side_view' | 'isometric'
  laneModel: 'lane_based' | 'free_movement' | 'physics_based'
  primaryInput: 'swipe' | 'tap' | 'jump' | 'tilt'
  corePattern: 'obstacle' | 'rhythm' | 'terrain' | 'combat'
}

export interface SimulationConfig {
  fixedStepMs: number
  maxFrameDeltaMs: number
}

export interface StackAdditions {
  rendering: string
  state: string
  audio: string
  simulation: string
  requiredChanges: readonly string[]
}

export interface RunnerState {
  lane: LaneIndex
}

export interface Obstacle {
  id: number
  kind: ObstacleKind
  lane: LaneIndex
  distance: number
  spawnTick: number
}

export interface ObstaclePattern {
  lanes: LaneIndex[]
}

export interface DifficultyCurve {
  baseSpeed: number
  maxSpeed: number
  speedRampPerSecond: number
  baseSpawnIntervalMs: number
  minSpawnIntervalMs: number
  spawnRampPerSecond: number
  intensityRampPerSecond: number
}

export interface GameState {
  phase: GamePhase
  tick: number
  runTimeMs: number
  score: number
  lives: number
  intensity: number
  progress: number
  focus: number
  status: string
  distance: number
  speed: number
  spawnIntervalMs: number
  spawnCooldownMs: number
  nextObstacleId: number
  dashTicksRemaining: number
  runner: RunnerState
  obstacles: Obstacle[]
}
