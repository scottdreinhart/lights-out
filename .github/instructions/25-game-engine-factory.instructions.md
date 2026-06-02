# 🏭 Game Engine Factory Instructions

> **Scope**: Shared deterministic engine templates, archetype matrix, and variant contracts.
> Subordinate to `AGENTS.md` § 0 (Non-Negotiable Rules), § 3 (Architecture), § 4 (Path Discipline), and § 10 (SOLID/DRY/SoC).
> **BASELINE**: Before extending engine templates, read `AGENTS.md` § 0. Domain purity is mandatory.

---

## 1. Objective

Implement reusable engine templates in `/packages/game-engine-factory` that can be composed into app-level games without duplicating mechanics.

The factory must provide:

- deterministic simulation contract
- archetype matrix for shared mechanic families
- data-driven variant catalog
- testable win/lose/reset orchestration

---

## 2. Required Contract

All engine templates must expose:

- `GameState`
- `GameConfig`
- `GameStatus` (`running | win | lose`)
- `TickState`
- `InputCommand`

All templates must implement:

- `update(state, input, dt)`
- `evaluateWin(state)`
- `evaluateLose(state)`
- `reset(config)`

---

## 3. Architecture Constraints

- **Domain purity only** in the package (no React, no browser API, no renderer imports)
- App layer orchestrates tick loops and input adaptation
- UI layer renders state only
- Infrastructure adapters handle rendering, audio, and persistence

Hard-stop violations:

- no UI imports in domain templates
- no non-deterministic state mutations
- no per-game hardcoding inside shared archetype engines

---

## 4. Archetype Coverage

The factory supports these families:

1. `grid-core`
2. `path-core`
3. `lane-core`
4. `runner-core`
5. `impulse-core`
6. `platformer-core`
7. `projectile-core`
8. `wave-core`
9. `defense-core`
10. `turn-core`
11. `rhythm-core`
12. `dataset-core`

Each family must keep variants in `VARIANT_CATALOG` (data, not branching logic).

---

## 5. Game Loop Standard

Use fixed-step deterministic updates with:

```ts
update(state, input, dt)
```

Canonical step order:

1. resolve input
2. apply mechanics
3. update entities
4. detect collisions
5. apply rules
6. evaluate win/lose
7. emit next state

---

## 6. Validation Gates

Run all package gates before app integration:

```bash
pnpm --filter @games/game-engine-factory run check
pnpm --filter @games/game-engine-factory run test
pnpm --filter @games/game-engine-factory run validate
```

Validation must fail on:

- domain purity violations
- missing catalog consistency
- deterministic mismatch in tests

---

## 7. Generation Prompt Source

Use:

- `.github/prompts/game-engine-factory/super-prompt.txt`

This prompt must remain aligned with package contract and archetype matrix.
