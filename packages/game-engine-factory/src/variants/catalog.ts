import type { ArchetypeId, EngineVariantConfig } from '../core/contracts'

const baseVariant = (
  id: string,
  label: string,
  overrides: Partial<EngineVariantConfig>,
): EngineVariantConfig => ({
  id,
  label,
  progressPerSecond: 1,
  threatPerSecond: 0.7,
  scorePerProgress: 10,
  maxHealth: 3,
  threatFailureThreshold: 10,
  winProgressTarget: 100,
  entitySpawnIntervalTicks: 6,
  entityCap: 8,
  commandEffects: {
    primaryAction: { progressDelta: 1.2, scoreDelta: 15 },
    secondaryAction: { threatDelta: -0.8, scoreDelta: 4 },
    tertiaryAction: { progressDelta: 2.5, threatDelta: 1.1, scoreDelta: 24 },
  },
  ...overrides,
})

export const VARIANT_CATALOG: Record<ArchetypeId, Record<string, EngineVariantConfig>> = {
  'grid-core': {
    sudoku: baseVariant('sudoku', 'Sudoku Variant', {
      threatPerSecond: 0.45,
      commandEffects: {
        primaryAction: { progressDelta: 1.1, scoreDelta: 9 },
        secondaryAction: { threatDelta: -1.2, scoreDelta: 2 },
        tertiaryAction: { progressDelta: 2.1, threatDelta: 0.7, scoreDelta: 18 },
      },
    }),
    minesweeper: baseVariant('minesweeper', 'Minesweeper Variant', {
      threatPerSecond: 0.9,
      entitySpawnIntervalTicks: 5,
      commandEffects: {
        primaryAction: { progressDelta: 1, scoreDelta: 10 },
        secondaryAction: { threatDelta: -0.6, scoreDelta: 4 },
        tertiaryAction: { progressDelta: 1.8, threatDelta: 0.9, scoreDelta: 16 },
      },
    }),
    match3: baseVariant('match3', 'Match-3 Variant', {
      progressPerSecond: 1.2,
      scorePerProgress: 14,
    }),
  },
  'path-core': {
    pacman: baseVariant('pacman', 'Pac-Man Style', {
      threatPerSecond: 1.1,
      entityCap: 6,
      commandEffects: {
        primaryAction: { progressDelta: 1.3, scoreDelta: 11 },
        secondaryAction: { threatDelta: -0.9, scoreDelta: 5 },
        tertiaryAction: { progressDelta: 2.2, threatDelta: 1.4, scoreDelta: 20 },
      },
    }),
    'circuit-maze': baseVariant('circuit-maze', 'Circuit Maze', {
      progressPerSecond: 1,
      threatPerSecond: 0.8,
    }),
  },
  'lane-core': {
    'pulse-lanes': baseVariant('pulse-lanes', 'Pulse Lanes', {
      progressPerSecond: 1.3,
      threatPerSecond: 0.95,
      entitySpawnIntervalTicks: 4,
    }),
    'subway-style': baseVariant('subway-style', 'Subway Style', {
      progressPerSecond: 1.5,
      threatPerSecond: 1.2,
      winProgressTarget: 140,
    }),
  },
  'runner-core': {
    horizontal: baseVariant('horizontal', 'Horizontal Runner', {
      progressPerSecond: 1.8,
      threatPerSecond: 1.1,
      entitySpawnIntervalTicks: 3,
      winProgressTarget: 160,
    }),
    'lane-based': baseVariant('lane-based', 'Lane Based Runner', {
      progressPerSecond: 1.6,
      entityCap: 10,
    }),
    'burst-physics': baseVariant('burst-physics', 'Burst Physics Runner', {
      commandEffects: {
        primaryAction: { progressDelta: 1.4, scoreDelta: 12 },
        secondaryAction: { threatDelta: -0.9, scoreDelta: 4 },
        tertiaryAction: { progressDelta: 3.3, threatDelta: 1.9, scoreDelta: 28 },
      },
    }),
  },
  'impulse-core': {
    'flappy-style': baseVariant('flappy-style', 'Flappy Style', {
      maxHealth: 4,
      threatFailureThreshold: 12,
      commandEffects: {
        primaryAction: { progressDelta: 1.4, scoreDelta: 8 },
        secondaryAction: { threatDelta: -0.6, scoreDelta: 3 },
        tertiaryAction: { progressDelta: 2, threatDelta: 1, scoreDelta: 15 },
      },
    }),
  },
  'platformer-core': {
    climb: baseVariant('climb', 'Climb Platformer', {
      progressPerSecond: 1.2,
      threatPerSecond: 0.7,
      maxHealth: 5,
    }),
  },
  'projectile-core': {
    shmup: baseVariant('shmup', 'Shoot-em-up', {
      progressPerSecond: 1.5,
      threatPerSecond: 1.4,
      entitySpawnIntervalTicks: 2,
      entityCap: 14,
    }),
  },
  'wave-core': {
    survival: baseVariant('survival', 'Wave Survival', {
      progressPerSecond: 1.1,
      threatPerSecond: 1.5,
      threatFailureThreshold: 13,
      maxHealth: 6,
    }),
  },
  'defense-core': {
    'tower-defense': baseVariant('tower-defense', 'Tower Defense', {
      progressPerSecond: 1.05,
      threatPerSecond: 1.2,
      scorePerProgress: 12,
      entityCap: 16,
    }),
  },
  'turn-core': {
    strategy: baseVariant('strategy', 'Turn Strategy', {
      progressPerSecond: 0.7,
      threatPerSecond: 0.55,
      entitySpawnIntervalTicks: 8,
      winProgressTarget: 70,
    }),
  },
  'rhythm-core': {
    'beat-grid': baseVariant('beat-grid', 'Beat Grid', {
      progressPerSecond: 1.4,
      threatPerSecond: 1,
      scorePerProgress: 16,
      commandEffects: {
        primaryAction: { progressDelta: 1.6, scoreDelta: 12 },
        secondaryAction: { threatDelta: -0.7, scoreDelta: 2 },
        tertiaryAction: { progressDelta: 2.9, threatDelta: 1.5, scoreDelta: 30 },
      },
    }),
  },
  'dataset-core': {
    'word-ladder': baseVariant('word-ladder', 'Word Ladder', {
      progressPerSecond: 0.9,
      threatPerSecond: 0.5,
      winProgressTarget: 80,
      commandEffects: {
        primaryAction: { progressDelta: 1, scoreDelta: 11 },
        secondaryAction: { threatDelta: -1.1, scoreDelta: 1 },
        tertiaryAction: { progressDelta: 1.9, threatDelta: 0.8, scoreDelta: 20 },
      },
    }),
  },
}
