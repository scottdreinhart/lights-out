import type { ArchetypeId } from '../core/contracts'

export interface ArchetypeDefinition {
  id: ArchetypeId
  title: string
  mechanics: readonly string[]
  defaultVariantId: string
  citations: readonly string[]
}

export const ARCHETYPE_MATRIX: Record<ArchetypeId, ArchetypeDefinition> = {
  'grid-core': {
    id: 'grid-core',
    title: 'Grid Core',
    mechanics: ['2d-grid', 'adjacency', 'rule-validation'],
    defaultVariantId: 'sudoku',
    citations: ['https://www.redblobgames.com/grids/', 'https://en.wikipedia.org/wiki/Cellular_automaton'],
  },
  'path-core': {
    id: 'path-core',
    title: 'Path Core',
    mechanics: ['pathfinding', 'collision', 'navigation'],
    defaultVariantId: 'circuit-maze',
    citations: [
      'https://en.wikipedia.org/wiki/Maze_solving_algorithm',
      'https://www.redblobgames.com/pathfinding/a-star/introduction.html',
    ],
  },
  'lane-core': {
    id: 'lane-core',
    title: 'Lane Core',
    mechanics: ['lane-switching', 'occupancy', 'discrete-movement'],
    defaultVariantId: 'pulse-lanes',
    citations: [
      'https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection',
      'https://en.wikipedia.org/wiki/Endless_runner',
    ],
  },
  'runner-core': {
    id: 'runner-core',
    title: 'Runner Core',
    mechanics: ['forward-progression', 'obstacle-spawn', 'difficulty-scaling'],
    defaultVariantId: 'lane-based',
    citations: [
      'https://en.wikipedia.org/wiki/Endless_runner',
      'https://gameprogrammingpatterns.com/game-loop.html',
    ],
  },
  'impulse-core': {
    id: 'impulse-core',
    title: 'Impulse Core',
    mechanics: ['gravity', 'velocity', 'impulse-input'],
    defaultVariantId: 'flappy-style',
    citations: [
      'https://gafferongames.com/post/integration_basics/',
      'https://en.wikipedia.org/wiki/Physics_engine',
    ],
  },
  'platformer-core': {
    id: 'platformer-core',
    title: 'Platformer Core',
    mechanics: ['gravity', 'jumping', 'ground-detection'],
    defaultVariantId: 'climb',
    citations: ['https://gameprogrammingpatterns.com/physics.html', 'https://en.wikipedia.org/wiki/Platform_game'],
  },
  'projectile-core': {
    id: 'projectile-core',
    title: 'Projectile Core',
    mechanics: ['projectiles', 'hit-detection', 'enemy-spawning'],
    defaultVariantId: 'shmup',
    citations: [
      'https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection',
      "https://en.wikipedia.org/wiki/Shoot_'em_up",
    ],
  },
  'wave-core': {
    id: 'wave-core',
    title: 'Wave Core',
    mechanics: ['waves', 'survival-loop', 'pressure-scaling'],
    defaultVariantId: 'survival',
    citations: ['https://en.wikipedia.org/wiki/Survival_game'],
  },
  'defense-core': {
    id: 'defense-core',
    title: 'Defense Core',
    mechanics: ['pathing', 'tower-placement', 'attack-cycles'],
    defaultVariantId: 'tower-defense',
    citations: ['https://en.wikipedia.org/wiki/Tower_defense'],
  },
  'turn-core': {
    id: 'turn-core',
    title: 'Turn Core',
    mechanics: ['turn-order', 'rule-enforcement', 'state-transition'],
    defaultVariantId: 'strategy',
    citations: ['https://en.wikipedia.org/wiki/Turn-based_strategy'],
  },
  'rhythm-core': {
    id: 'rhythm-core',
    title: 'Rhythm Core',
    mechanics: ['timing-window', 'beat-alignment', 'accuracy-scoring'],
    defaultVariantId: 'beat-grid',
    citations: ['https://en.wikipedia.org/wiki/Rhythm_game'],
  },
  'dataset-core': {
    id: 'dataset-core',
    title: 'Dataset Core',
    mechanics: ['dataset-validation', 'progression-logic'],
    defaultVariantId: 'word-ladder',
    citations: ['https://wordfinder.yourdictionary.com/blog/what-is-a-word-ladder/'],
  },
}
