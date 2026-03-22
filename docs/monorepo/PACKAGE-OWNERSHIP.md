# Package Ownership

## Purpose

Define what belongs in root `packages/` and prevent app-specific code from drifting into shared libraries.

## Ownership Rule

A module belongs in `packages/<name>` only when:

- at least 2 apps genuinely use it,
- it has a stable reusable API,
- and it does not depend on app implementation details.

If any of the above is false, keep it in `apps/<game>/...`.

## Package Scope Map

| Package | Scope | Allowed Contents | Must Not Include |
|---|---|---|---|
| `packages/common` | Cross-app foundation | shared UI atoms/molecules, shared factories, shared services | game-specific UI copy/layout or one-game-only rules |
| `packages/app-hook-utils` | Hook primitives | reusable hooks used by 2+ apps | app orchestration tied to one game flow |
| `packages/crash-utils` | Crash/error tooling | reusable error boundaries/logging helpers | app-specific error UX text/state |
| `packages/display-contract` | Display types/contracts | stable display interfaces/tokens | per-game visual assets/themes |
| `packages/sprite-contract` | Sprite interfaces/contracts | sprite shape types + shared contracts | game-specific sprite catalogs |
| `packages/stats-utils` | Stats math + shared types | shared stat transitions/types | one-game scoring rules |
| `packages/storage-utils` | Persistence primitives | storage adapters, serializers | game-level key naming policy hardcoded to one app |
| `packages/theme-contract` | Theme contracts | shared theme schemas/tokens | one-game theme palettes/CSS |
| `packages/ui-utils` | UI helpers | cross-app UI utility functions | component behavior tied to one app |

## Root vs App vs Package Test

### Keep in root when

- workspace-wide config/governance/tooling,
- applies to all apps,
- or orchestrates monorepo workflows.

### Keep in app when

- UI/assets/config/wasm/tests are game-specific,
- another game would not consume it as-is,
- or it directly expresses one game’s product behavior.

### Move to package when

- it already has 2+ real app consumers,
- API is generic and stable,
- and migration reduces duplication without leaking app concerns.

## Promotion Workflow (Missing or Duplicate Functionality)

When resolving missing/duplicated files across sibling apps:

1. Search all sibling apps for candidate implementations.
2. Compare candidates by date, size, LOC, completeness, and feature coverage.
3. Select the highest-quality reusable candidate.
4. Refactor to remove app-coupled assumptions.
5. Move/promote into the appropriate `packages/*` library.
6. Update all app imports to the shared package API.
7. Validate all affected apps with typecheck/build.

This keeps shared code high-quality while preserving clean app boundaries.
