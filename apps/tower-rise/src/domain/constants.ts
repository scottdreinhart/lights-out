import { createLevel } from './level'
import type { GameState, InputPort } from './types'

export interface GameMeta {
  slug: string
  title: string
  family: string
  summary: string
}

export const GAME_META: GameMeta = {
  slug: 'tower-rise',
  title: 'Tower Rise',
  family: 'Arcade Vertical Climber',
  summary:
    'Ascend platform tiers, align with ladders, dodge barrels and fire enemies, then reach the summit.',
}

export const FIXED_TICK_MS = 1000 / 30
export const JUMP_ARC = [0, 1, 2, 2, 1, 0] as const
export const BONUS_DRAIN_PER_TICK = 2
export const JUMP_SCORE_REWARD = 100
export const LEVEL_CLEAR_REWARD = 1200
export const STARTING_LIVES = 3

export const EMPTY_INPUT: InputPort = {
  left: false,
  right: false,
  jump: false,
  climbUp: false,
  climbDown: false,
}

export const INITIAL_LEVEL_INDEX = 0

export const INITIAL_STATE: GameState = {
  phase: 'playing',
  tick: 0,
  levelIndex: INITIAL_LEVEL_INDEX,
  level: createLevel(INITIAL_LEVEL_INDEX),
  player: {
    row: 16,
    col: 1,
    facing: 'right',
    jumpTick: -1,
    lastJumpScoreTick: -1,
    climbDirection: 0,
    climbProgressTicks: 0,
  },
  barrels: [],
  enemies: [],
  nextBarrelId: 1,
  nextEnemyId: 1,
  barrelSpawnTimer: 0,
  score: 0,
  lives: STARTING_LIVES,
  bonus: 5000,
  status: 'Reach the top by climbing ladders and timing jumps.',
  seed: 1337,
}
