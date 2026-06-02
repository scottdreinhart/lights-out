/**
 * TODO: PURPOSE
 * TODO: Define game-state aggregate and deterministic initial-state factory.
 *
 * TODO: RESPONSIBILITY
 * TODO: Own state shape and initialization only; no simulation transitions.
 *
 * TODO: INPUTS
 * TODO: Level index for initial layout selection.
 *
 * TODO: OUTPUTS
 * TODO: New immutable game-state object for runtime loop consumption.
 *
 * TODO: DEPENDENCIES
 * TODO: Imports constants plus entity contracts/factories only.
 *
 * TODO: EDGE CASES
 * TODO: Initialization must produce valid spawn/goal reachable state.
 *
 * TODO: PERFORMANCE NOTES
 * TODO: Factory remains allocation-predictable for reset/start transitions.
 */
import type { Barrel } from '../entities/barrel'
import type { Collectible } from '../entities/collectible'
import type { Enemy } from '../entities/enemy'
import type { Ladder } from '../entities/ladder'
import { createLevel, FLOOR_Y, type Level } from '../entities/level'
import type { Platform } from '../entities/platform'
import type { Player } from '../entities/player'
import type { EntityAnimation } from './animation'
import {
  BARREL_SPAWN_COOLDOWN_TICKS,
  STARTING_BONUS_TIMER,
  STARTING_LIVES,
  TILE_SIZE,
} from './constants'
import type { SoundEvent } from './sound-events'
import type { Position, ScreenState } from './types'

export interface Goal {
  position: Position
  bounds: { width: number; height: number }
}

export interface GameState {
  screen: ScreenState
  levelIndex: number
  level: Level
  score: number
  lives: number
  bonusTimer: number
  player: Player
  playerAnimation: EntityAnimation
  goal: Goal
  barrelSpawnPoint: Position
  platforms: Platform[]
  ladders: Ladder[]
  barrels: Barrel[]
  enemies: Enemy[]
  collectibles: Collectible[]
  barrelSpawnCooldown: number
  collectibleSpawnCooldown: number
  nextBarrelId: number
  nextEnemyId: number
  nextCollectibleId: number
  nextSoundEventId: number
  soundEvents: SoundEvent[]
  pausePressedLastFrame: boolean
  restartPressedLastFrame: boolean
  tickCount: number
}

const createPlayer = (level: Level): Player => ({
  id: 'player-1',
  position: { ...level.playerSpawn },
  velocity: { x: 0, y: 0 },
  bounds: { width: TILE_SIZE * 0.75, height: TILE_SIZE * 0.9 },
  facing: 'right',
  onGround: level.playerSpawn.y >= FLOOR_Y - TILE_SIZE,
  onLadder: false,
  isAlive: true,
})

const createEnemies = (): Enemy[] => [
  {
    id: 'enemy-1',
    position: { x: TILE_SIZE * 6, y: TILE_SIZE * 14 },
    velocity: { x: 1.2, y: 0 },
    bounds: { width: TILE_SIZE * 0.8, height: TILE_SIZE * 0.8 },
    mode: 'patrol',
    active: true,
  },
]

export const createInitialGameState = (levelIndex = 0): GameState => {
  const level = createLevel(levelIndex)
  return {
    screen: 'start',
    levelIndex,
    level,
    score: 0,
    lives: STARTING_LIVES,
    bonusTimer: STARTING_BONUS_TIMER,
    player: createPlayer(level),
    playerAnimation: {
      state: 'idle',
      frameIndex: 0,
      frameTimer: 0,
    },
    goal: {
      position: { ...level.goal },
      bounds: { width: TILE_SIZE, height: TILE_SIZE },
    },
    barrelSpawnPoint: { ...level.barrelSpawn },
    platforms: level.platforms,
    ladders: level.ladders,
    barrels: [],
    enemies: createEnemies(),
    collectibles: [],
    barrelSpawnCooldown: BARREL_SPAWN_COOLDOWN_TICKS,
    collectibleSpawnCooldown: 360,
    nextBarrelId: 1,
    nextEnemyId: 1,
    nextCollectibleId: 1,
    nextSoundEventId: 1,
    soundEvents: [],
    pausePressedLastFrame: false,
    restartPressedLastFrame: false,
    tickCount: 0,
  }
}
