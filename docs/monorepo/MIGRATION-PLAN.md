# Migration Plan

## Objective

Complete monorepo normalization by moving app-specific assets/config/runtime files under each app and keeping only truly shared libraries in root `packages/`.

## Program Context (2026-03-16)

- Active apps in this repository: `apps/tictactoe` and `apps/lights-out`.
- Current program includes migration/ingestion/restructuring of Nim artifacts into app-local and shared-package boundaries.
- Root remains orchestration/governance-first; runtime/build assets should live in app directories unless intentionally shared.

## Target Layout

```text
.
├── apps/
│   ├── tictactoe/
│   └── lights-out/
├── packages/
│   ├── common/
│   ├── app-hook-utils/
│   ├── crash-utils/
│   ├── display-contract/
│   ├── sprite-contract/
│   ├── stats-utils/
│   ├── storage-utils/
│   ├── theme-contract/
│   └── ui-utils/
└── docs/monorepo/
```

## Scope Rules

- Root: workspace-wide config, governance, orchestration.
- App folder: game-specific source/assets/config/wasm/tests/platform shells.
- Package folder: shared library APIs used by at least 2 apps.

## Current Peer Status

- `lights-out` has completed root duplicate purge with app-local runtime/build assets retained.
- Root scripts delegate to `apps/lights-out` for runtime/build/test workflows.
- No permanent baseline repo is designated; next intake is selected by peer comparison and merge quality.

## Phase 1 — Stabilize Current Shared Packages

- Keep/reconcile shared libs under:
  - `packages/common`
  - `packages/app-hook-utils`
  - `packages/crash-utils`
  - `packages/display-contract`
  - `packages/sprite-contract`
  - `packages/stats-utils`
  - `packages/storage-utils`
  - `packages/theme-contract`
  - `packages/ui-utils`
- Verify each package has a clear public API and no app-coupled imports.

## Phase 2 — Normalize App-Specific Layouts (TicTacToe + Nim Ingestion)

- Move source and assets:
  - `/src` → `/apps/tictactoe/src`
  - `/public` → `/apps/tictactoe/public`
  - `/index.html` → `/apps/tictactoe/index.html`
- Move app-local build config:
  - `/vite.config.js` → `/apps/tictactoe/vite.config.ts`
  - `/vitest.config.ts` → `/apps/tictactoe/vitest.config.ts`
- Move app-local runtime/platform files:
  - `/electron` → `/apps/tictactoe/electron`
  - `/capacitor.config.ts` → `/apps/tictactoe/capacitor.config.ts`
  - `/assembly` → `/apps/tictactoe/assembly`
  - `/tests` → `/apps/tictactoe/tests`

Nim ingestion/restructure track (in parallel, non-destructive):

- Classify Nim artifacts as one of:
  - app-specific (`apps/<target-app>/...`),
  - shared package candidate (`packages/*`),
  - orchestration/governance (`root`).
- Apply the same replacement-evidence and validation gates before any purge.

## Phase 3 — Resolve Missing/Duplicate Functionality

For each missing symbol/module or duplicated feature:

1. Search all sibling apps and packages.
2. Compare candidates by date, size, line count, completeness, and feature coverage.
3. Pick best reusable candidate.
4. Refactor to package-safe API.
5. Promote into the right `packages/*` library.
6. Replace sibling-app copies/imports with shared package import.

## Phase 4 — Validation Gates

Per affected app:

- Run typecheck.
- Run build.
- Run app-level quality gates (lint/test as available).

Monorepo gate:

- Validate all affected apps after each promotion.

## Out of Scope (Generated Artifacts)

These are regenerated and should not be treated as architecture moves:

- `/coverage`
- `/dist`
- `/build`
- `/reports`
- `/node_modules`
