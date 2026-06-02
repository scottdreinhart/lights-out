import type { GameMeta, LevelDefinition, SentinelAiTier } from './types'

export const GAME_META: GameMeta = {
  slug: 'circuit-maze',
  title: 'Circuit Maze',
  family: 'Maze Runner',
  summary: 'Collect all nodes in a hostile grid while pressure rises from roaming sentinels.',
}

export const LOCKDOWN_THRESHOLD = 100
export const TICK_MS = 140
export const DASH_COOLDOWN_TICKS = 18
export const DEFAULT_SENTINEL_AI_TIER: SentinelAiTier = 'medium'
export const SENTINEL_AI_TIERS: readonly SentinelAiTier[] = ['easy', 'medium', 'hard', 'elite']

export const LEVEL_ONE: LevelDefinition = {
  id: 'level-1',
  name: 'Intrusion Entry',
  layout: [
    '###############',
    '#S..#....N...E#',
    '#.#.#.###.###.#',
    '#.#...#...#...#',
    '#.###.#.###.#.#',
    '#...#.#.....#.#',
    '###.#.#####.#.#',
    '#N..#...N...#.#',
    '#.#.###.#.###.#',
    '#...N...#....N#',
    '###############',
  ],
  pressurePerTick: 0.34,
  nodePressureGain: 8,
  lockdownTicks: 65,
  sentinels: [
    {
      id: 'sentinel-a',
      start: { x: 9, y: 3 },
      patrolRoute: [
        { x: 9, y: 3 },
        { x: 11, y: 3 },
        { x: 11, y: 7 },
        { x: 7, y: 7 },
        { x: 7, y: 3 },
      ],
      baseMoveInterval: 5,
    },
  ],
}
