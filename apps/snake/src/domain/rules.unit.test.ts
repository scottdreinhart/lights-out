import { describe, expect, it } from 'vitest'

import { OPPOSITE_DIRECTION } from '@/domain/constants'
import {
  checkSelfCollision,
  checkWallCollision,
  enqueueDirection,
  isValidTurn,
} from '@/domain/rules'
import type { BoardConfig, Direction, ModeConfig, PlayerEntity } from '@/domain/types'

// ─── Helpers ──────────────────────────────────────────────────────────────────

const BOARD: BoardConfig = { width: 20, height: 20, wrapMode: false }
const CONFIG_WALL_FATAL: ModeConfig = {
  mode: 'classic',
  wallIsFatal: true,
  trailIsFatal: false,
  foodEnabled: true,
  growOnEat: true,
  speedIncrease: false,
  powerUpsEnabled: false,
  aiCount: 0,
}

function makePlayer(overrides: Partial<PlayerEntity> = {}): PlayerEntity {
  return {
    id: 'player',
    segments: [
      { x: 5, y: 5 },
      { x: 4, y: 5 },
    ],
    direction: 'right' as Direction,
    directionQueue: [],
    alive: true,
    score: 0,
    shield: 0,
    phase: 0,
    boost: 0,
    color: '#00ff00',
    ...overrides,
  }
}

// ─── isValidTurn ─────────────────────────────────────────────────────────────

describe('isValidTurn', () => {
  it('allows turning up from right (not opposite)', () => {
    expect(isValidTurn('right', 'up')).toBe(true)
  })

  it('prevents reversing direction (left from right)', () => {
    expect(isValidTurn('right', 'left')).toBe(false)
  })

  it('prevents reversing down to up', () => {
    expect(isValidTurn('down', 'up')).toBe(false)
  })

  it('allows all non-opposite directions', () => {
    const directions: Direction[] = ['up', 'down', 'left', 'right']
    for (const current of directions) {
      for (const next of directions) {
        if (OPPOSITE_DIRECTION[current] !== next) {
          expect(isValidTurn(current, next)).toBe(true)
        }
      }
    }
  })
})

// ─── enqueueDirection ────────────────────────────────────────────────────────

describe('enqueueDirection', () => {
  it('adds a valid turn to the direction queue', () => {
    const player = makePlayer()
    const updated = enqueueDirection(player, 'up')
    expect(updated.directionQueue).toContain('up')
  })

  it('does not add an opposite (illegal) direction', () => {
    const player = makePlayer({ direction: 'right' })
    const updated = enqueueDirection(player, 'left')
    expect(updated.directionQueue).not.toContain('left')
  })

  it('does not add the same direction again', () => {
    const player = makePlayer({ direction: 'right' })
    const updated = enqueueDirection(player, 'right')
    expect(updated.directionQueue).toHaveLength(0)
  })

  it('buffers up to 2 turns', () => {
    const player = makePlayer({ direction: 'right' })
    const p1 = enqueueDirection(player, 'up')
    const p2 = enqueueDirection(p1, 'left')
    const p3 = enqueueDirection(p2, 'down') // Should be ignored (queue full)
    expect(p3.directionQueue).toHaveLength(2)
  })
})

// ─── checkWallCollision ───────────────────────────────────────────────────────

describe('checkWallCollision', () => {
  it('returns false for in-bounds position with wall-fatal mode', () => {
    expect(checkWallCollision({ x: 5, y: 5 }, BOARD, CONFIG_WALL_FATAL)).toBe(false)
  })

  it('returns true for out-of-bounds position with wall-fatal mode', () => {
    expect(checkWallCollision({ x: -1, y: 5 }, BOARD, CONFIG_WALL_FATAL)).toBe(true)
    expect(checkWallCollision({ x: 20, y: 5 }, BOARD, CONFIG_WALL_FATAL)).toBe(true)
    expect(checkWallCollision({ x: 5, y: -1 }, BOARD, CONFIG_WALL_FATAL)).toBe(true)
    expect(checkWallCollision({ x: 5, y: 20 }, BOARD, CONFIG_WALL_FATAL)).toBe(true)
  })

  it('returns false in wrap mode regardless of position', () => {
    const wrapBoard = { ...BOARD, wrapMode: true }
    expect(checkWallCollision({ x: -1, y: 5 }, wrapBoard, CONFIG_WALL_FATAL)).toBe(false)
  })

  it('returns false when wall is not fatal', () => {
    const nonFatal = { ...CONFIG_WALL_FATAL, wallIsFatal: false }
    expect(checkWallCollision({ x: -1, y: 5 }, BOARD, nonFatal)).toBe(false)
  })
})

// ─── checkSelfCollision ───────────────────────────────────────────────────────

describe('checkSelfCollision', () => {
  it('returns false when head does not overlap body', () => {
    const segments = [
      { x: 5, y: 5 },
      { x: 4, y: 5 },
      { x: 3, y: 5 },
    ]
    expect(checkSelfCollision({ x: 6, y: 5 }, segments)).toBe(false)
  })

  it('returns true when new head position collides with body', () => {
    const segments = [
      { x: 5, y: 5 },
      { x: 4, y: 5 },
      { x: 3, y: 5 },
    ]
    expect(checkSelfCollision({ x: 4, y: 5 }, segments)).toBe(true)
  })

  it('does not count head position (index 0) as collision', () => {
    const segments = [
      { x: 5, y: 5 },
      { x: 4, y: 5 },
    ]
    expect(checkSelfCollision({ x: 5, y: 5 }, segments)).toBe(false)
  })
})
