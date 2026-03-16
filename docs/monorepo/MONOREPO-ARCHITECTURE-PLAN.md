# Monorepo Architecture Plan

## Goals

- Preserve independent build/release pipelines per game.
- Enable shared code, shared quality gates, and shared refactoring gains.
- Keep package-level reporting detail (lint/type/test/build/a11y/perf/security) per game.
- Support outputs per game: web, iOS, Android, Linux, Windows, macOS.

## Target Workspace Structure

```text
<root>/
  apps/
    lights-out/
    tictactoe/
    snake/
    ...other-games/

  packages/
    game-domain/          # reusable domain primitives/rules/types
    game-ui/              # reusable atoms/molecules/styles/hooks
    game-input/           # semantic action model + keyboard/touch/TV adapters
    game-platform/        # shared capacitor/electron helpers
    game-build/           # shared build scripts/config wrappers
    game-quality/         # shared lint/type/test/reporting config
    game-testing/         # shared test utilities/fixtures/reporting adapters

  tooling/
    eslint/
    typescript/
    vitest/
    playwright/
    scripts/

  docs/
    monorepo/
      MONOREPO-ARCHITECTURE-PLAN.md
      MONOREPO-ABSORPTION-QUEUE.md

  package.json            # workspace-level orchestration
  pnpm-workspace.yaml
  turbo.json              # or nx.json (choose one orchestrator)
```

## Package Boundaries

- `apps/*` are independently shippable games.
- `packages/*` are shared libraries with versioned APIs and tests.
- Apps can depend on shared packages.
- Shared packages must not depend on app implementations.

## Workspace Configuration

`pnpm-workspace.yaml` should include:

```yaml
packages:
  - apps/*
  - packages/*
  - tooling/*
```

## Per-Game package.json Contract (Required)

Every game app package keeps the same script surface so reporting remains consistent.

Required scripts per app:

- `dev`
- `build`
- `preview`
- `lint`
- `typecheck`
- `test`
- `check` (lint + type + format)
- `validate` (check + build)

Required platform scripts per app:

- `web:build`
- `electron:build:win`
- `electron:build:linux`
- `electron:build:mac`
- `cap:sync`
- `cap:build:android`
- `cap:build:ios`

Optional app scripts:

- `test:a11y`
- `test:lighthouse`
- `coverage`
- `security:audit`

## Root Orchestration Scripts

Use filtered workspace execution to preserve per-game independence:

- `pnpm --filter @games/lights-out build`
- `pnpm --filter @games/tictactoe validate`
- `pnpm --filter @games/* lint`
- `pnpm --filter @games/* typecheck`

Recommended root scripts:

- `build:all:web`
- `build:all:desktop`
- `build:all:mobile`
- `report:all`
- `report:game -- <game-name>`
- `affected:validate`

## Reporting Detail Model

For each game, emit reports to per-app folders:

```text
apps/<game>/reports/
  lint/
  typecheck/
  test/
  coverage/
  a11y/
  lighthouse/
  security/
  build/
```

Root summary can aggregate from all app report folders into:

```text
reports/aggregate/
```

## Platform Build Strategy by Target

- Web: Vite build per app.
- Desktop (Windows/Linux/macOS): Electron build per app.
- Mobile (Android/iOS): Capacitor sync/build per app.

Important constraints:

- Windows desktop packaging from PowerShell only.
- Linux/general development from Bash/WSL.
- macOS and iOS packaging require macOS runner.

## CI/CD Model

- Matrix by app and platform.
- Path-filtered jobs to run only affected games/packages.
- Nightly full run for cross-app confidence.
- Release jobs scoped by app tag or app path changes.

## Migration Strategy (Incremental)

1. Bootstrap monorepo shell (`apps/`, `packages/`, workspace config).
2. Move `lights-out` first as baseline app.
3. Extract shared packages from duplicated patterns (input, UI atoms, domain helpers).
4. Absorb one sibling game at a time.
5. Enforce script contract and reporting layout per absorbed app.
6. Switch CI to affected + matrix workflows.

## Definition of Done (per absorbed game)

- App lives under `apps/<game>`.
- Uses shared package contract without broken boundaries.
- Keeps independent build/release for web/mobile/desktop.
- Produces full report set under `apps/<game>/reports`.
- Passes `validate` locally and in CI.
