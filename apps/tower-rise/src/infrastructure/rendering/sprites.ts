/**
 * TODO: PURPOSE
 * TODO: Centralize Pixi color tokens for scene primitives.
 *
 * TODO: RESPONSIBILITY
 * TODO: Own rendering constants only.
 *
 * TODO: INPUTS
 * TODO: N/A.
 *
 * TODO: OUTPUTS
 * TODO: Hex color constants used by Pixi scene renderer.
 *
 * TODO: DEPENDENCIES
 * TODO: No imports.
 *
 * TODO: EDGE CASES
 * TODO: Keep contrast adequate for gameplay readability.
 *
 * TODO: PERFORMANCE NOTES
 * TODO: Shared constants avoid repeated color allocation literals.
 */
export interface SpriteManifestEntry {
  id: string
  src: string
}

export interface SpriteAtlasFrame {
  x: number
  y: number
  width: number
  height: number
}

export interface SpriteAtlasAnimation {
  textureId: string
  frames: SpriteAtlasFrame[]
  fps: number
  loop: boolean
}

export const SPRITE_MANIFEST: SpriteManifestEntry[] = [
  { id: 'player', src: '/images/player.png' },
  { id: 'barrel', src: '/images/barrel.png' },
  { id: 'enemy', src: '/images/enemy.png' },
  { id: 'ladder', src: '/images/ladder.png' },
  { id: 'platform', src: '/images/platform.png' },
  { id: 'goal', src: '/images/goal.png' },
  { id: 'collectible', src: '/images/collectible.png' },
]

export const SPRITE_ATLAS = {
  player: {
    idle: {
      textureId: 'player',
      frames: [{ x: 0, y: 0, width: 24, height: 24 }],
      fps: 1,
      loop: true,
    },
    run: {
      textureId: 'player',
      frames: [
        { x: 0, y: 0, width: 24, height: 24 },
        { x: 24, y: 0, width: 24, height: 24 },
      ],
      fps: 8,
      loop: true,
    },
    jump: {
      textureId: 'player',
      frames: [{ x: 48, y: 0, width: 24, height: 24 }],
      fps: 1,
      loop: false,
    },
    climb: {
      textureId: 'player',
      frames: [
        { x: 72, y: 0, width: 24, height: 24 },
        { x: 96, y: 0, width: 24, height: 24 },
      ],
      fps: 6,
      loop: true,
    },
    hurt: {
      textureId: 'player',
      frames: [{ x: 120, y: 0, width: 24, height: 24 }],
      fps: 1,
      loop: false,
    },
    goal: {
      textureId: 'player',
      frames: [{ x: 144, y: 0, width: 24, height: 24 }],
      fps: 1,
      loop: false,
    },
  },
  barrel: {
    barrelRoll: {
      textureId: 'barrel',
      frames: [
        { x: 0, y: 0, width: 20, height: 20 },
        { x: 20, y: 0, width: 20, height: 20 },
      ],
      fps: 10,
      loop: true,
    },
  },
  enemy: {
    enemyPatrol: {
      textureId: 'enemy',
      frames: [
        { x: 0, y: 0, width: 24, height: 24 },
        { x: 24, y: 0, width: 24, height: 24 },
      ],
      fps: 6,
      loop: true,
    },
    enemyClimb: {
      textureId: 'enemy',
      frames: [
        { x: 48, y: 0, width: 24, height: 24 },
        { x: 72, y: 0, width: 24, height: 24 },
      ],
      fps: 5,
      loop: true,
    },
  },
  collectible: {
    idle: {
      textureId: 'collectible',
      frames: [
        { x: 0, y: 0, width: 20, height: 20 },
        { x: 20, y: 0, width: 20, height: 20 },
      ],
      fps: 4,
      loop: true,
    },
  },
} as const

export const SPRITE_COLORS = {
  background: 0x101018,
  platform: 0x884422,
  brokenPlatform: 0x5c3b28,
  ladder: 0xcccc66,
  brokenLadder: 0x8c6b6b,
  player: 0x44aaff,
  barrel: 0xcc6b2a,
  enemy: 0xff4a95,
  goal: 0xffd166,
} as const
