# Vector Assault TODO-Seeded File Headers

Use these headers when creating major prototype systems.

## `src/domain/core/simulation-loop.ts`

```ts
/**
 * TODO: PURPOSE
 * TODO: Fixed-step deterministic simulation loop for Vector Assault.
 *
 * TODO: RESPONSIBILITY
 * TODO: Apply ordered domain systems only; no rendering/UI concerns.
 *
 * TODO: INPUTS
 * TODO: Current GameState + normalized InputState + timestep.
 *
 * TODO: OUTPUTS
 * TODO: Next immutable GameState snapshot.
 */
```

## `src/domain/systems/hazard-fragmentation-system.ts`

```ts
/**
 * TODO: PURPOSE
 * TODO: Resolve hazard destruction and fragmentation chain (large->medium->small).
 *
 * TODO: RESPONSIBILITY
 * TODO: Spawn fragment hazards, inherit velocity patterns, emit score events.
 *
 * TODO: EDGE CASES
 * TODO: Prevent recursive same-tick fragmentation explosions and spawn overlaps.
 */
```

## `src/domain/systems/wave-director-system.ts`

```ts
/**
 * TODO: PURPOSE
 * TODO: Escalate pressure curve across waves for endless score-attack sessions.
 *
 * TODO: RESPONSIBILITY
 * TODO: Compute spawn budgets from wave/tick/intensity and schedule threats.
 *
 * TODO: METRICS
 * TODO: Track measurable pressure factors: count/speed/overlap/special frequency.
 */
```

## `src/domain/systems/fire-cadence-system.ts`

```ts
/**
 * TODO: PURPOSE
 * TODO: Enforce governed firing cadence (projectile cap/cooldown).
 *
 * TODO: RESPONSIBILITY
 * TODO: Validate fire intent, spawn projectiles, and block invalid cadence frames.
 */
```

## `src/domain/systems/overdrive-burst-system.ts`

```ts
/**
 * TODO: PURPOSE
 * TODO: Manage temporary offensive burst window and cooldown/recovery states.
 *
 * TODO: RESPONSIBILITY
 * TODO: Apply burst modifiers and recover cleanly without permanent buffs.
 */
```

## `src/domain/utils/wraparound.ts`

```ts
/**
 * TODO: PURPOSE
 * TODO: Wrap entities/projectiles around screen boundaries.
 *
 * TODO: RESPONSIBILITY
 * TODO: Keep spatial continuity for open-space arena topology.
 */
```

