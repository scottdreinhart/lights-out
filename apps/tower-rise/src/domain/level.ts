import type { Level, Position } from './types'

const BASE_PLATFORMS = [
  { row: 16, startCol: 0, endCol: 15 },
  { row: 13, startCol: 0, endCol: 11 },
  { row: 10, startCol: 4, endCol: 15 },
  { row: 7, startCol: 0, endCol: 11 },
  { row: 4, startCol: 4, endCol: 15 },
  { row: 1, startCol: 0, endCol: 15 },
] as const

const BASE_LADDERS = [
  { col: 2, fromRow: 16, toRow: 13 },
  { col: 9, fromRow: 16, toRow: 13 },
  { col: 5, fromRow: 13, toRow: 10 },
  { col: 10, fromRow: 13, toRow: 10 },
  { col: 7, fromRow: 10, toRow: 7 },
  { col: 13, fromRow: 10, toRow: 7 },
  { col: 3, fromRow: 7, toRow: 4 },
  { col: 9, fromRow: 7, toRow: 4 },
  { col: 6, fromRow: 4, toRow: 1 },
  { col: 12, fromRow: 4, toRow: 1 },
] as const

const BASE_ENEMY_SPAWNS: readonly Position[] = [
  { x: 8, y: 13 },
  { x: 4, y: 10 },
  { x: 11, y: 7 },
]

export const createLevel = (levelIndex: number): Level => {
  const brokenLadderOffset = levelIndex > 1 ? (levelIndex - 1) % BASE_LADDERS.length : -1
  const ladders = BASE_LADDERS.map((ladder, index) => ({
    ...ladder,
    broken: index === brokenLadderOffset,
  }))

  return {
    id: levelIndex + 1,
    width: 16,
    height: 18,
    platforms: [...BASE_PLATFORMS],
    ladders,
    goal: { row: 1, col: 14 },
    spawn: { x: 1, y: 16 },
    barrelSpawn: { x: 1, y: 1 },
    enemySpawns: BASE_ENEMY_SPAWNS.slice(0, Math.min(1 + levelIndex, BASE_ENEMY_SPAWNS.length)),
    barrelSpawnIntervalTicks: Math.max(24, 58 - levelIndex * 5),
    barrelMoveTicks: Math.max(2, 4 - Math.floor(levelIndex / 3)),
    enemyMoveTicks: Math.max(4, 9 - levelIndex),
    barrelLadderDropChance: Math.min(0.65, 0.24 + levelIndex * 0.06),
  }
}
