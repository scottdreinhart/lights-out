/**
 * TODO: PURPOSE
 * TODO: Provide static level layouts (platforms, ladders, spawn, goal).
 *
 * TODO: RESPONSIBILITY
 * TODO: Own level geometry creation; no runtime mutation.
 *
 * TODO: INPUTS
 * TODO: Level index for deterministic layout generation.
 *
 * TODO: OUTPUTS
 * TODO: Level object consumed by game-state initialization.
 *
 * TODO: DEPENDENCIES
 * TODO: Core constants plus entity contracts.
 *
 * TODO: EDGE CASES
 * TODO: Ensure spawn and goal are both reachable through ladder chains.
 *
 * TODO: PERFORMANCE NOTES
 * TODO: Static data is generated once per reset/level transition.
 */
import { GAME_HEIGHT, GAME_WIDTH, TILE_SIZE } from '../core/constants'
import type { Position } from '../core/types'
import type { Ladder } from './ladder'
import type { Platform } from './platform'

export interface Level {
  id: string
  playerSpawn: Position
  barrelSpawn: Position
  goal: Position
  platforms: Platform[]
  ladders: Ladder[]
}

const px = (x: number, y: number): Position => ({ x: x * TILE_SIZE, y: y * TILE_SIZE })
const LADDER_SPAN_TILES = 6

const createPlatforms = (): Platform[] => [
  {
    id: 'p-floor',
    position: px(0, 30),
    bounds: { width: GAME_WIDTH, height: TILE_SIZE },
    kind: 'solid',
  },
  {
    id: 'p-1',
    position: px(1, 25),
    bounds: { width: TILE_SIZE * 18, height: TILE_SIZE },
    kind: 'solid',
  },
  {
    id: 'p-2',
    position: px(5, 20),
    bounds: { width: TILE_SIZE * 18, height: TILE_SIZE },
    kind: 'solid',
  },
  {
    id: 'p-3',
    position: px(1, 15),
    bounds: { width: TILE_SIZE * 18, height: TILE_SIZE },
    kind: 'solid',
  },
  {
    id: 'p-4',
    position: px(5, 10),
    bounds: { width: TILE_SIZE * 18, height: TILE_SIZE },
    kind: 'solid',
  },
  {
    id: 'p-5',
    position: px(1, 5),
    bounds: { width: TILE_SIZE * 18, height: TILE_SIZE },
    kind: 'solid',
  },
]

const createLadders = (levelIndex: number): Ladder[] => {
  const broken = levelIndex % 2 === 1
  return [
    {
      id: 'l-1',
      // Ladders must overlap both adjacent platforms so the player can climb through.
      position: px(3, 24),
      bounds: { width: TILE_SIZE, height: TILE_SIZE * LADDER_SPAN_TILES },
      broken: false,
    },
    {
      id: 'l-2',
      position: px(16, 19),
      bounds: { width: TILE_SIZE, height: TILE_SIZE * LADDER_SPAN_TILES },
      broken: broken,
    },
    {
      id: 'l-3',
      position: px(8, 14),
      bounds: { width: TILE_SIZE, height: TILE_SIZE * LADDER_SPAN_TILES },
      broken: false,
    },
    {
      id: 'l-4',
      position: px(19, 9),
      bounds: { width: TILE_SIZE, height: TILE_SIZE * LADDER_SPAN_TILES },
      broken: false,
    },
    {
      id: 'l-5',
      position: px(4, 4),
      bounds: { width: TILE_SIZE, height: TILE_SIZE * LADDER_SPAN_TILES },
      broken: false,
    },
  ]
}

export const createLevel = (levelIndex: number): Level => ({
  id: `level-${levelIndex + 1}`,
  playerSpawn: px(2, 29),
  // Spawn barrels near the top route, not on the player's spawn platform.
  barrelSpawn: px(19, 4),
  goal: px(20, 4),
  platforms: createPlatforms(),
  ladders: createLadders(levelIndex),
})

export const FLOOR_Y = GAME_HEIGHT - TILE_SIZE
