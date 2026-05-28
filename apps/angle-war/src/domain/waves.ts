import {
  CAMERA_SCROLL_BASE,
  CAMERA_SCROLL_WAVE_STEP,
  SPAWN_INTERVAL_MIN,
  SPAWN_INTERVAL_START,
  SPAWN_INTERVAL_STEP,
  WAVE_TICKS,
  WORLD_WIDTH,
} from './constants'

const clamp = (value: number, min: number, max: number): number => {
  if (value < min) {
    return min
  }
  if (value > max) {
    return max
  }
  return value
}

const wrapX = (x: number): number => {
  if (x < 0) {
    return x + WORLD_WIDTH
  }
  if (x >= WORLD_WIDTH) {
    return x - WORLD_WIDTH
  }
  return x
}

export const computeWave = (tick: number): number => Math.floor(tick / WAVE_TICKS) + 1

export const nextCameraX = (cameraX: number, wave: number): number =>
  wrapX(cameraX + CAMERA_SCROLL_BASE + (wave - 1) * CAMERA_SCROLL_WAVE_STEP)

export const spawnIntervalForWave = (wave: number): number =>
  clamp(
    SPAWN_INTERVAL_START - (wave - 1) * SPAWN_INTERVAL_STEP,
    SPAWN_INTERVAL_MIN,
    SPAWN_INTERVAL_START,
  )

export const shouldSpawnEnemy = (tick: number, wave: number): boolean =>
  tick % spawnIntervalForWave(wave) === 0

export const waveAdvanced = (tick: number, previousWave: number): boolean =>
  computeWave(tick) > previousWave
