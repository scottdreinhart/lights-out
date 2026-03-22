# PR Blueprint — Absorb `tictactoe` into Monorepo

## PR Title

`feat(monorepo): absorb tictactoe as independently releasable app package`

## Objective

Move `tictactoe` into the monorepo as `apps/tictactoe` while preserving:

- independent app builds and releases,
- complete reporting parity (lint/type/test/a11y/perf/security/build),
- platform targets: web, iOS, Android, Linux, Windows, macOS.

This blueprint is **candidate-specific**, not a permanent priority designation.
All repos are treated as peers; this PR proceeds only when comparison evidence confirms `tictactoe` is the best next merge option.

## Candidate Selection Evidence (Required)

Before executing this PR, capture and link comparison evidence against other peer candidates.

- [ ] Comparison set documented (at least top-ranked peer candidates from queue/ranking artifact).
- [ ] Selection criteria documented: completeness, merge safety, shared-package ROI, risk.
- [ ] Decision rationale recorded for choosing `tictactoe` now.
- [ ] Evidence links added (queue entry, ranking artifact, intake notes).

## Scope

### In Scope

- Add `apps/tictactoe` package.
- Conform `apps/tictactoe/package.json` to script contract.
- Wire app to shared monorepo conventions (workspace, lint/type/test config).
- Add per-platform build scripts for desktop/mobile/web.
- Add per-app report output directories and report scripts.
- Add CI matrix entries for `tictactoe`.

### Out of Scope

- Functional gameplay refactors beyond required package boundary fixes.
- Cross-game shared package extraction (tracked in follow-up PRs).
- Global CI pipeline redesign beyond minimal `tictactoe` integration.

## Source and Destination

- Source repo path: `C:/Users/scott/tictactoe`
- Destination path: `apps/tictactoe`

## Package Identity

- Package name: `@games/tictactoe`
- Private: `true`
- Versioning: start with source repo version and adopt workspace release strategy later.

## Required `package.json` Script Contract

`apps/tictactoe/package.json` must expose:

- `dev`
- `build`
- `preview`
- `lint`
- `typecheck`
- `test`
- `check`
- `validate`
- `web:build`
- `electron:build:win`
- `electron:build:linux`
- `electron:build:mac`
- `cap:sync`
- `cap:build:android`
- `cap:build:ios`
- `report:lint`
- `report:typecheck`
- `report:test`
- `report:coverage`
- `report:a11y`
- `report:lighthouse`
- `report:security`
- `report:build`

## Report Output Contract

All reporting artifacts must be written under:

```text
apps/tictactoe/reports/
  lint/
  typecheck/
  test/
  coverage/
  a11y/
  lighthouse/
  security/
  build/
```

## Workspace and Config Updates

- Update `pnpm-workspace.yaml` to include `apps/*`, `packages/*`, `tooling/*` (if not already done).
- Ensure root lint/type/test tooling can run filtered:
  - `pnpm --filter @games/tictactoe lint`
  - `pnpm --filter @games/tictactoe typecheck`
  - `pnpm --filter @games/tictactoe test`
  - `pnpm --filter @games/tictactoe validate`

## Execution Steps (Checklist)

### 1) Intake

- [ ] Snapshot current `tictactoe` scripts/dependencies/config.
- [ ] Identify Electron and Capacitor build requirements.
- [ ] Map existing report outputs and test assets.
- [ ] Confirm candidate-selection evidence section is complete before file-copy/migration steps.

### 2) Package Migration

- [ ] Copy source into `apps/tictactoe`.
- [ ] Normalize imports/path aliases to monorepo standards.
- [ ] Ensure app-level config files are local to package or shared via tooling.

### 3) Script Standardization

- [ ] Implement required script contract.
- [ ] Verify all script names and behavior match monorepo conventions.
- [ ] Add report generation scripts that write to `apps/tictactoe/reports/*`.

### 4) Platform Builds

- [ ] Web build verified.
- [ ] Electron Linux build verified (Bash).
- [ ] Electron Windows build path validated (PowerShell route).
- [ ] Electron macOS build path documented for macOS runner.
- [ ] Capacitor sync/build Android validated.
- [ ] Capacitor iOS build path documented for macOS runner.

### 5) CI Integration

- [ ] Add `tictactoe` to app matrix.
- [ ] Add per-platform jobs (runner-appropriate).
- [ ] Add artifact upload for all report directories.

### 6) Validation and Exit

- [ ] `pnpm --filter @games/tictactoe validate` passes.
- [ ] Reports generated and archived from `apps/tictactoe/reports/*`.
- [ ] No boundary violations from lint/type checks.

## Acceptance Criteria

- Candidate-selection evidence is complete and auditable.
- `tictactoe` builds independently for web.
- `tictactoe` exposes independent desktop/mobile build scripts.
- Reporting detail matches monorepo peer-app contract depth.
- `tictactoe` CI jobs pass on supported runners.

## Risks and Mitigations

- **Risk**: Platform build drift between app packages.
  - **Mitigation**: enforce script contract and shared tooling wrappers.
- **Risk**: Import boundary violations after move.
  - **Mitigation**: run boundary linting and fix before merge.
- **Risk**: Reporting inconsistency.
  - **Mitigation**: enforce report output contract in CI.

## Rollback Plan

- Keep migration in one isolated PR branch.
- If blocked, revert `apps/tictactoe` addition and CI changes in single rollback commit.
- Preserve source repo unchanged until monorepo PR is merged.

## Follow-up PRs

1. Extract shared input adapter package (`packages/game-input`).
2. Extract shared UI atoms (`packages/game-ui`).
3. Extract shared domain helpers (`packages/game-domain`).
4. Expand affected-only CI optimization.
