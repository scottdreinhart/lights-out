import type {
  DifficultyCurve,
  GameMeta,
  GameState,
  ObstaclePattern,
  RunnerFlowProfile,
  SimulationConfig,
  StackAdditions,
} from './types'

export const GAME_META: GameMeta = {
  slug: 'dash-lanes',
  title: 'Dash-Lanes',
  family: 'Forward Endless Runner',
  summary:
    'Maintain lane rhythm, survive rising speed pressure, and keep the run alive as the system collapses.',
  primaryLabel: 'Forward Push',
  secondaryLabel: 'Lane Reset',
  tertiaryLabel: 'Dash Surge',
}

export const RUNNER_FLOW_PROFILE: RunnerFlowProfile = {
  scrollDirection: 'forward',
  cameraMode: 'third_person_behind',
  laneModel: 'lane_based',
  primaryInput: 'swipe',
  corePattern: 'obstacle',
}

export const SIMULATION_CONFIG: SimulationConfig = {
  fixedStepMs: 100,
  maxFrameDeltaMs: 250,
}

export const STACK_ADDITIONS: StackAdditions = {
  rendering: 'pixi.js + @pixi/react',
  state: 'zustand',
  audio: 'howler',
  simulation: 'domain fixed-step runner engine',
  requiredChanges: [
    'keep gameplay simulation in src/domain (pure, deterministic)',
    'run simulation clock and input orchestration in src/app hooks',
    'move rendering concerns to src/ui/infrastructure adapters',
    'keep UI components presentational (HUD/menus/overlays only)',
  ],
}

export const LANE_COUNT = 3
export const CENTER_LANE = 1
export const INITIAL_LIVES = 3
export const PROGRESS_TARGET = 1800
export const TICK_INTERVAL_MS = SIMULATION_CONFIG.fixedStepMs
export const START_OBSTACLE_DISTANCE = 120
export const DESPAWN_OBSTACLE_DISTANCE = -18
export const COLLISION_DISTANCE = 4
export const DASH_DURATION_TICKS = 8

export const DIFFICULTY_CURVE: DifficultyCurve = {
  baseSpeed: 22,
  maxSpeed: 54,
  speedRampPerSecond: 2.2,
  baseSpawnIntervalMs: 920,
  minSpawnIntervalMs: 320,
  spawnRampPerSecond: 42,
  intensityRampPerSecond: 5.5,
}

export const OBSTACLE_PATTERNS: readonly ObstaclePattern[] = [
  { lanes: [1] },
  { lanes: [0] },
  { lanes: [2] },
  { lanes: [0, 2] },
  { lanes: [0, 1] },
  { lanes: [1, 2] },
]

export const LANE_POSITION_MAP = [-34, 0, 34] as const

export const INITIAL_STATE: GameState = {
  phase: 'playing',
  tick: 0,
  runTimeMs: 0,
  score: 0,
  lives: INITIAL_LIVES,
  intensity: 14,
  progress: 0,
  focus: 72,
  status: 'Corridor lock acquired. Keep lane rhythm.',
  distance: 0,
  speed: DIFFICULTY_CURVE.baseSpeed,
  spawnIntervalMs: DIFFICULTY_CURVE.baseSpawnIntervalMs,
  spawnCooldownMs: DIFFICULTY_CURVE.baseSpawnIntervalMs * 0.8,
  nextObstacleId: 1,
  dashTicksRemaining: 0,
  runner: { lane: CENTER_LANE },
  obstacles: [],
}
