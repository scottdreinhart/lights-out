# Remaining Tasks Snapshot

Date: 2026-03-16

This snapshot consolidates active remaining work from monorepo/process markdown files.
It excludes broad governance checklists that are reference-only.

## Strategic Context (Monorepo Direction)

- Repo hosts two active apps: `apps/tictactoe` and `apps/lights-out`.
- Current modernization scope includes migration/ingestion/restructuring of Nim artifacts into monorepo-safe app-local structure.
- Root should remain orchestration-first; app runtime/build assets should live under app directories unless intentionally shared.

## 1) Purge Workflow (Current Blocking Track)

Source: `docs/monorepo/PURGE-CANDIDATES-2026-03-16.md`

### Remaining

1. Monitor delegated workflows for any missed root-path assumptions.
2. Continue with next migration phases (TicTacToe app-layer reorganization).

### Current state

- Safe to purge now: **completed** for approved root duplicate set.
- Root web/quality scripts are now delegated to `apps/lights-out`.
- Root WASM/input/a11y scripts are now delegated to app-local script/config paths.
- Root Electron/Capacitor scripts are now delegated to `apps/lights-out`.
- Root `package.json` `main` now points to `apps/lights-out/electron/main.js`.
- Fresh guard evidence has been regenerated in `PURGE-GUARD-2026-03-16.csv`.
- Root duplicate runtime/web files have been removed in a separate purge pass.
- High-impact governance/docs references were updated to app-local paths (`README`, `AGENTS`, `.github/instructions`, deployment docs).

## 2) TicTacToe Monorepo Migration Phases

Source: `MIGRATION-PLAN-NEXT-PHASES.md`

### Remaining

- **Phase 2 (NEXT):** Reorganize `apps/tictactoe/src/app` into `context/`, `hooks/`, `services/`, update barrels/imports, revalidate.
- **Phase 3 (PLANNED):** Extract only truly generic UI atoms to shared packages.
- **Phase 4 (PLANNED):** Input/keyboard pattern standardization audit and alignment.
- **Phase 5 (PLANNED):** App shell entrypoint review (mostly confirm separate shells remain separate).

## 3) Monorepo Absorption Queue

Source: `docs/monorepo/MONOREPO-ABSORPTION-QUEUE.md`

### Remaining

- Treat all sibling game repos as peer-level candidates (no single focus repo).
- Execute queued phases 0–5 checklist items where still unchecked in queue docs.
- Apply comparison-first selection with scaffold ranking as tie-breaker for intake ordering.
- Follow-up extraction: low-risk shared modules to `packages/*` and measure impact.

## 4) Nim Alignment Follow-up

Source: `.github/NIM-ALIGNMENT-REMAINING-WORK.md`

### Remaining

- Hamburger menu refinement to gold-standard behavior.
- Full-screen settings modal workflow completion.
- Input controls verification pass.
- Accessibility checklist completion.
- Performance profiling checklist completion.

## 5) Documentation Sync Debt

Sources: `docs/monorepo/PR1-TICTACTOE-RUNBOOK.md`, `docs/monorepo/PR-BLUEPRINT-TICTACTOE.md`, `docs/monorepo/TICTACTOE-EXECUTION-TODOS.md`

### Remaining

- Some runbook/blueprint checklists are stale relative to current execution progress.
- Normalize status across these docs so completed work is checked off consistently.
- Legacy references in app-specific archived docs (especially under `apps/tictactoe`) may still point to old paths by design.

## Recommended Immediate Order

1. Run next intake selection from peer candidates using comparison + ranking artifacts.
2. Sync additional process docs that still describe pre-purge state.
3. Run periodic delegated validation to catch regressions early.
