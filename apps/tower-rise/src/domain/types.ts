export type GamePhase = 'playing' | 'gameOver'

export type Facing = 'left' | 'right'

export interface Position {
  x: number
  y: number
}

export interface Velocity {
  x: number
  y: number
}

export interface Bounds {
  width: number
  height: number
}

export interface Platform {
  row: number
  startCol: number
  endCol: number
}

export interface Ladder {
  col: number
  fromRow: number
  toRow: number
  broken?: boolean
}

export interface Goal {
  row: number
  col: number
}

export interface Level {
  id: number
  width: number
  height: number
  platforms: Platform[]
  ladders: Ladder[]
  goal: Goal
  spawn: Position
  barrelSpawn: Position
  enemySpawns: Position[]
  barrelSpawnIntervalTicks: number
  barrelMoveTicks: number
  enemyMoveTicks: number
  barrelLadderDropChance: number
}

export interface InputPort {
  left: boolean
  right: boolean
  jump: boolean
  climbUp: boolean
  climbDown: boolean
}

export interface Player {
  row: number
  col: number
  facing: Facing
  jumpTick: number
  lastJumpScoreTick: number
  climbDirection: -1 | 0 | 1
  climbProgressTicks: number
}

export interface Barrel {
  id: number
  row: number
  col: number
  direction: -1 | 1
  moveProgressTicks: number
}

export interface Enemy {
  id: number
  row: number
  col: number
  direction: -1 | 1
  moveProgressTicks: number
}

export interface GameState {
  phase: GamePhase
  tick: number
  levelIndex: number
  level: Level
  player: Player
  barrels: Barrel[]
  enemies: Enemy[]
  nextBarrelId: number
  nextEnemyId: number
  barrelSpawnTimer: number
  score: number
  lives: number
  bonus: number
  status: string
  seed: number
}
