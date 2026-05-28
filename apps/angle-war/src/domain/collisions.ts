import type { Enemy, Objective, Projectile, Vector2 } from './types'

const distanceSquared = (a: Vector2, b: Vector2): number => {
  const dx = a.x - b.x
  const dy = a.y - b.y
  return dx * dx + dy * dy
}

export const projectileHitsEnemy = (projectile: Projectile, enemy: Enemy): boolean => {
  const radius = projectile.radius + enemy.radius
  return distanceSquared(projectile.position, enemy.position) <= radius * radius
}

export const enemyHitsPlayer = (
  enemy: Enemy,
  playerPosition: Vector2,
  playerRadius: number,
): boolean => {
  const radius = enemy.radius + playerRadius
  return distanceSquared(enemy.position, playerPosition) <= radius * radius
}

export const enemyEscapedWithObjective = (enemy: Enemy): boolean =>
  enemy.carryingObjectiveId !== null && enemy.position.y < -40

export const releaseObjectiveAtGround = (objective: Objective): Objective => ({
  ...objective,
  status: 'safe',
  carrierEnemyId: null,
})
