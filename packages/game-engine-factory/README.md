# @games/game-engine-factory

Reusable deterministic game engine templates and variant-driven archetypes for the monorepo game platform.

## Purpose

This package implements a minimal **Game Engine Factory** contract:

- deterministic, serializable domain state
- archetype + variant matrix (data-driven)
- fixed-step update entry (`update(state, input, dt)`)
- explicit win/lose evaluation and reset behavior

## Core Contract

- `GameState`
- `GameConfig`
- `GameStatus` (`running | win | lose`)
- `TickState`
- `InputCommand`

`EngineTemplate` provides:

- `createInitialState(config)`
- `update(state, command, dtMs)`
- `evaluateWin(state)`
- `evaluateLose(state)`
- `reset(config)`

## Archetypes

- `grid-core`
- `path-core`
- `lane-core`
- `runner-core`
- `impulse-core`
- `platformer-core`
- `projectile-core`
- `wave-core`
- `defense-core`
- `turn-core`
- `rhythm-core`
- `dataset-core`

Each archetype is variant-driven through `VARIANT_CATALOG` and does not hardcode per-game implementations.

## Usage

```ts
import { createEngine } from '@games/game-engine-factory'

const engine = createEngine({ archetypeId: 'runner-core', variantId: 'lane-based', seed: 42 })
let state = engine.createInitialState({ archetypeId: 'runner-core', variantId: 'lane-based', seed: 42 })
state = engine.update(state, { id: 'primaryAction' }, 16.6667)
```

## Quality Gates

```bash
pnpm --filter @games/game-engine-factory run check
pnpm --filter @games/game-engine-factory run test
pnpm --filter @games/game-engine-factory run validate
```
