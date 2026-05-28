/**
 * TODO: PURPOSE
 * TODO: Spawn and advance barrel/enemy hazards and detect direct hits.
 *
 * TODO: RESPONSIBILITY
 * TODO: Own hazard movement and collision tagging only.
 *
 * TODO: INPUTS
 * TODO: Current game state snapshot.
 *
 * TODO: OUTPUTS
 * TODO: Next state with updated hazards and potential player death flag.
 *
 * TODO: DEPENDENCIES
 * TODO: Hazard speed/spawn constants, collision helper, and clamp.
 *
 * TODO: EDGE CASES
 * TODO: Prune out-of-bounds hazards deterministically to avoid unbounded arrays.
 *
 * TODO: PERFORMANCE NOTES
 * TODO: Single pass updates each hazard list; no random branches for determinism.
 */
import {
  BARREL_SPAWN_COOLDOWN_TICKS,
  BARREL_SPEED,
  ENEMY_SPEED,
  GAME_HEIGHT,
  GAME_WIDTH,
  TILE_SIZE,
} from '../core/constants'
import type { GameState } from '../core/game-state'
import { isIntersecting } from '../utils/collision'
import { clamp } from '../utils/math'

const createBarrel = (id: string, x: number, y: number) => ({
  id,
  position: { x, y },
  velocity: { x: BARREL_SPEED, y: 0 },
  bounds: { width: TILE_SIZE * 0.75, height: TILE_SIZE * 0.75 },
  direction: 'right' as const,
  active: true,
})

export const applyHazardSystem = (state: GameState): GameState => {
  if (state.screen !== 'playing' || !state.player.isAlive) {
    return state
  }

  const nextCooldown = Math.max(0, state.barrelSpawnCooldown - 1)
  const shouldSpawn = nextCooldown === 0
  const spawnedBarrels = shouldSpawn
    ? [
        ...state.barrels,
        createBarrel(
          `barrel-${state.nextBarrelId}`,
          state.barrelSpawnPoint.x,
          state.barrelSpawnPoint.y,
        ),
      ]
    : state.barrels

  const barrels = spawnedBarrels
    .map((barrel) => {
      const nextX =
        barrel.position.x + (barrel.direction === 'right' ? BARREL_SPEED : -BARREL_SPEED)
      const hitWall = nextX <= 0 || nextX >= GAME_WIDTH - barrel.bounds.width
      const direction = hitWall
        ? barrel.direction === 'right'
          ? 'left'
          : 'right'
        : barrel.direction
      const x = clamp(nextX, 0, GAME_WIDTH - barrel.bounds.width)
      return {
        ...barrel,
        direction,
        position: { ...barrel.position, x, y: barrel.position.y + BARREL_SPEED * 0.8 },
        active: barrel.active && barrel.position.y <= GAME_HEIGHT + TILE_SIZE,
      }
    })
    .filter((barrel) => barrel.active)

  const enemies = state.enemies.map((enemy, index) => {
    const velocityX = index % 2 === 0 ? ENEMY_SPEED : -ENEMY_SPEED
    const nextX = enemy.position.x + velocityX
    const clampedX = clamp(nextX, TILE_SIZE, GAME_WIDTH - TILE_SIZE * 2)
    const nextY = enemy.position.y + Math.sin((state.tickCount + index * 17) / 20) * 0.4
    return {
      ...enemy,
      velocity: { ...enemy.velocity, x: velocityX },
      position: { x: clampedX, y: nextY },
      active: true,
    }
  })

  const playerBox = { position: state.player.position, bounds: state.player.bounds }
  const gotHitByBarrel = barrels.some((barrel) =>
    isIntersecting(playerBox, { position: barrel.position, bounds: barrel.bounds }),
  )
  const gotHitByEnemy = enemies.some((enemy) =>
    isIntersecting(playerBox, { position: enemy.position, bounds: enemy.bounds }),
  )

  const isAlive = !(gotHitByBarrel || gotHitByEnemy)

  return {
    ...state,
    barrels,
    enemies,
    barrelSpawnCooldown: shouldSpawn ? BARREL_SPAWN_COOLDOWN_TICKS : nextCooldown,
    nextBarrelId: shouldSpawn ? state.nextBarrelId + 1 : state.nextBarrelId,
    player: { ...state.player, isAlive },
    screen: isAlive ? state.screen : 'dead',
  }
}
