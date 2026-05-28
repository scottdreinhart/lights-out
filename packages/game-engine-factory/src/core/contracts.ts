export type GameStatus = 'running' | 'win' | 'lose'

export type ArchetypeId =
  | 'grid-core'
  | 'path-core'
  | 'lane-core'
  | 'runner-core'
  | 'impulse-core'
  | 'platformer-core'
  | 'projectile-core'
  | 'wave-core'
  | 'defense-core'
  | 'turn-core'
  | 'rhythm-core'
  | 'dataset-core'

export interface InputCommand {
  id: string
  value?: number
}

export interface TickState {
  tick: number
  dtMs: number
  command: InputCommand | null
  events: string[]
}

export interface EngineVariantConfig {
  id: string
  label: string
  progressPerSecond: number
  threatPerSecond: number
  scorePerProgress: number
  maxHealth: number
  threatFailureThreshold: number
  winProgressTarget: number
  entitySpawnIntervalTicks: number
  entityCap: number
  commandEffects: Record<
    string,
    {
      progressDelta?: number
      threatDelta?: number
      scoreDelta?: number
      healthDelta?: number
    }
  >
}

export interface GameConfig {
  archetypeId: ArchetypeId
  variantId: string
  seed?: number
}

export type EngineConfig = GameConfig

export interface EngineData {
  entityCount: number
  collisions: number
}

export interface GameState {
  archetypeId: ArchetypeId
  variantId: string
  status: GameStatus
  tick: number
  seed: number
  score: number
  progress: number
  threat: number
  health: number
  tickState: TickState
  data: EngineData
}

export interface EngineTemplate {
  archetypeId: ArchetypeId
  variant: EngineVariantConfig
  createInitialState: (config: GameConfig) => GameState
  update: (state: GameState, command: InputCommand | null, dtMs: number) => GameState
  evaluateWin: (state: GameState) => boolean
  evaluateLose: (state: GameState) => boolean
  reset: (config: GameConfig) => GameState
}
