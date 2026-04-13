# Remaining Tasks Snapshot

> **ARCHIVED SNAPSHOT** (2026-03-16 → Updated 2026-04-13). Historical reference documenting March progress.
> This file is reference-only and non-authoritative for current work.
> Canonical governance authority: `AGENTS.md` and `docs/DOCUMENTATION_GOVERNANCE.md`.

Date: 2026-03-16 (Archived; Context Updated 2026-04-13)

This snapshot originates from March 16 and consolidates work completed by April 13. See **Status Updates** below for current reality.

## Current Platform State (April 13, 2026)

**Active Applications**: 52 game apps (battleship, bingo, bingo-*×8 variants, blackjack, bunco, cee-lo, checkers, chicago, cho-han, connect-four, crossclimb, dominoes, farkle, go-fish, hangman, liars-dice, lights-out, mancala, memory, memory-game, mexico, minesweeper, mini-sudoku, monchola, nim, pattern-bingo, pig, pinpoint, power-bingo, queens, reversi, rock-paper-scissors, ship-captain-crew, shut-the-box, simon, simon-says, snake, snakes-and-ladders, speed-bingo, sudoku, tango, tictactoe, war, zip)

**Shared Packages**: 37 reusable packages (ai-framework, app-hook-utils, bingo-*×4, button-system, card-deck-*, common, crash-*, display-contract, domain-shared, haptics, shared-*, simon-engine, sound-context, sprite-contract, stats-utils, storage-utils, theme-*, ui-*, etc.)

**Architecture**: CLEAN layers (domain/app/ui) + atomic design (atoms/molecules/organisms) enforced globally.
Root remains orchestration-first; app runtime/build assets live under app directories or shared packages.

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
