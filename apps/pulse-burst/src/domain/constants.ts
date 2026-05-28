import type { GameMeta, LevelDefinition } from './types'

export const GAME_META: GameMeta = {
  slug: 'pulse-burst',
  title: 'Pulse Burst',
  family: 'Impulse-Gap Runner',
  summary: 'Maintain altitude with timed burst impulses while navigating tightening obstacle gaps.',
}

export const TICK_MS = 50
export const MAX_INTENSITY = 100

export const LEVEL_ONE: LevelDefinition = {
  id: 'level-1',
  name: 'Calibration Sector',
  worldWidth: 140,
  worldHeight: 100,
  floorY: 98,
  ceilingY: 2,
  playerX: 24,
  physics: {
    gravity: 0.78,
    burstImpulse: -7.9,
    maxRiseVelocity: -9.5,
    maxFallVelocity: 8.8,
  },
  spawnRule: {
    baseIntervalTicks: 30,
    minIntervalTicks: 16,
    baseGapSize: 34,
    minGapSize: 19,
    gapShrinkPerIntensity: 0.15,
    baseGapOffset: 9,
    maxGapOffset: 28,
    obstacleWidth: 10,
  },
  difficulty: {
    intensityPerTick: 0.24,
    baseSpeed: 1.2,
    speedPerIntensity: 0.02,
    maxSpeed: 4.2,
  },
}
