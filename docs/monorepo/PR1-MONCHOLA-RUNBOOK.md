# PR1 Runbook — `monchola` Absorption

## Purpose

Operational checklist for absorbing `monchola` into `apps/monchola` with full script/report/platform parity.

## Preconditions

- [x] Candidate-selection evidence completed per `docs/monorepo/PEER-CANDIDATE-SELECTION-CHECKLIST.md`.
- [ ] Source repository is clean (no uncommitted changes): `C:/Users/scott/monchola`.
- [ ] Target monorepo branch created for PR1.
- [ ] Platform routing acknowledged:
  - Bash/WSL for general development and Linux builds.
  - PowerShell only for `electron:build:win`.
  - macOS required for `electron:build:mac` and iOS Capacitor builds.

## Step 0 — Baseline Evidence

- [x] Capture source-repo script inventory and dependency snapshot.
- [x] Record existing build/test behavior and known constraints.
- [x] Save initial notes under `docs/monorepo/` (candidate comparison + selection rationale).

Baseline artifact created:

- `docs/monorepo/MONCHOLA-INTAKE-BASELINE-2026-03-16.md`
- `docs/monorepo/MONCHOLA-CANDIDATE-SELECTION-EVIDENCE-2026-03-16.md`

## Step 1 — Import to `apps/monchola`

- [x] Create `apps/monchola` from source repo contents.
- [x] Ensure package identity is `@games/monchola`.
- [x] Remove source-repo CI/workflow files that conflict with monorepo pipeline design.
- [x] Align config placement (keep app-local where required, share tooling where possible).

## Step 2 — Script Contract Normalization

Ensure `apps/monchola/package.json` includes:

- [x] `dev`, `build`, `preview`
- [x] `lint`, `typecheck`, `test`, `check`, `validate`
- [x] `web:build`
- [x] `electron:build:win`, `electron:build:linux`, `electron:build:mac`
- [x] `cap:sync`, `cap:build:android`, `cap:build:ios`
- [x] report scripts (`report:*`) for lint/type/test/coverage/a11y/lighthouse/security/build

## Step 3 — Report Output Contract

- [x] Guarantee writes to:
  - `apps/monchola/reports/lint`
  - `apps/monchola/reports/typecheck`
  - `apps/monchola/reports/test`
  - `apps/monchola/reports/coverage`
  - `apps/monchola/reports/a11y`
  - `apps/monchola/reports/lighthouse`
  - `apps/monchola/reports/security`
  - `apps/monchola/reports/build`

## Step 4 — Workspace and Pathing

- [x] Confirm workspace includes `apps/*` and package resolves with `pnpm --filter`.
- [ ] Normalize path aliases/import boundaries per repository governance.
- [ ] Resolve any cross-layer violations before validation.

## Step 5 — Validation Commands

Run app-scoped checks first:

- [x] `pnpm --filter @games/monchola lint`
- [x] `pnpm --filter @games/monchola typecheck`
- [x] `pnpm --filter @games/monchola test`
- [x] `pnpm --filter @games/monchola validate`

Run report generation:

- [x] `pnpm --filter @games/monchola report:lint`
- [x] `pnpm --filter @games/monchola report:typecheck`
- [x] `pnpm --filter @games/monchola report:test`
- [x] `pnpm --filter @games/monchola report:coverage`
- [x] `pnpm --filter @games/monchola report:a11y`
- [x] `pnpm --filter @games/monchola report:lighthouse`
- [x] `pnpm --filter @games/monchola report:security`
- [x] `pnpm --filter @games/monchola report:build`

## Step 6 — Platform Validation

- [x] Web build validated.
- [x] Linux Electron path validated from Bash.
- [x] Windows Electron path validated/documented from PowerShell.
- [x] macOS Electron path documented for macOS runner.
- [x] Android Capacitor build path validated.
- [x] iOS Capacitor path documented for macOS runner.

Platform evidence artifact:

- `docs/monorepo/MONCHOLA-PLATFORM-VALIDATION-2026-03-16.md`

## Step 7 — CI Wiring

- [x] Add `@games/monchola` to CI app matrix.
- [x] Ensure artifacts upload report directories.
- [x] Ensure failures preserve diagnostics artifacts.

## Exit Criteria

- [x] Candidate-selection evidence is present and linked.
- [x] App validates independently in monorepo.
- [x] Report depth/parity meets peer-app standards.
- [ ] CI passes for `@games/monchola` jobs.
- [x] PR description includes risk + rollback notes.

## Rollback

If critical failures appear:

- [ ] Revert `apps/monchola` package addition and related CI wiring in one rollback commit.
- [ ] Restore previous workspace/package references.
- [ ] Retain selection evidence and failure notes for next candidate decision cycle.
