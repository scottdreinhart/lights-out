# Monorepo Absorption Queue

## Queue Rules

- Absorb one game per PR to reduce blast radius.
- Preserve each game as a separately buildable package under `apps/<game>`.
- Do not merge until script contract and reporting outputs are complete.
- Migrate **all sibling game repositories** in parent workspace scope.
- Treat all game repos as peer-level candidates (no baseline repo).
- Select each next intake by explicit comparison + merge-quality evaluation.
- Use scaffold/minimal-code ranking as a tiebreaker when comparison results are equivalent.

## Prioritization Model (Scaffold-First)

Pick next repos by comparison-first criteria (completeness, quality, merge safety, shared-package ROI), with scaffold complexity as a secondary ordering signal.

Source artifact: `docs/monorepo/SIBLING-REPO-SCAFFOLD-RANKING-2026-03-16.md`.

2026-03-16 measured minimal-first order:

1. `monchola`
2. `reversi`
3. `simon-says`
4. `ship-captain-crew`
5. `2048`
6. `memory-game`
7. `hangman`
8. `pig`
9. `cee-lo`
10. `chicago`
11. `cho-han`
12. `farkle`

## Script Contract Checklist (per game)

- [ ] `dev`
- [ ] `build`
- [ ] `preview`
- [ ] `lint`
- [ ] `typecheck`
- [ ] `test`
- [ ] `check`
- [ ] `validate`
- [ ] `web:build`
- [ ] `electron:build:win`
- [ ] `electron:build:linux`
- [ ] `electron:build:mac`
- [ ] `cap:sync`
- [ ] `cap:build:android`
- [ ] `cap:build:ios`
- [ ] per-app reports in `apps/<game>/reports/*`

## Absorption Backlog

Status legend:

- `Not Started`
- `In Progress`
- `Blocked`
- `Done`

| Tier | Repo | Target Package | Status | Notes |
|---|---|---|---|---|
| Peer | lights-out | apps/lights-out | In Progress | Peer candidate; no baseline designation |
| Peer | tictactoe | apps/tictactoe | In Progress | Peer candidate; PR blueprint drafted |
| Peer | monchola | apps/monchola | In Progress | Starter pack + baseline + selection evidence done; validate/report pass completed; nested workflows removed; root CI matrix + artifact upload wiring added; platform validation evidence captured (remaining blocker: CI pass confirmation) |
| Peer | reversi | apps/reversi | Not Started | Minimal footprint with board/rules reuse opportunity |
| Peer | simon-says | apps/simon-says | Not Started | Minimal footprint; input/timing package reuse |
| Peer | ship-captain-crew | apps/ship-captain-crew | Not Started | Small intake with dice-domain reuse |
| Peer | 2048 | apps/2048 | Not Started | Small intake; board merge logic extraction candidate |
| Peer | memory-game | apps/memory-game | Not Started | Lightweight UI/stats reuse candidate |
| Peer | hangman | apps/hangman | Not Started | Simpler app for contract stabilization |
| Peer | pig | apps/pig | Not Started | Lightweight turn/dice helper extraction |
| Peer | cee-lo | apps/cee-lo | Not Started | Dice package reuse |
| Peer | chicago | apps/chicago | Not Started | Dice/ranking utilities reuse |
| Peer | cho-han | apps/cho-han | Not Started | Probability/scoring utilities |
| Peer | farkle | apps/farkle | Not Started | Shared scoring utilities |
| Peer | bunco | apps/bunco | Not Started | Shared dice round engine |
| Peer | connect-four | apps/connect-four | Not Started | Board-state package reuse |
| Peer | rock-paper-scissors | apps/rock-paper-scissors | Not Started | Lightweight package validation |
| Peer | checkers | apps/checkers | Not Started | Turn engine + movement reuse |
| Peer | shut-the-box | apps/shut-the-box | Not Started | Dice + turn-state package reuse |
| Peer | minesweeper | apps/minesweeper | Not Started | Grid/domain reuse opportunity |
| Peer | snake | apps/snake | Not Started | Strong keyboard/input reuse candidate |
| Peer | battleship | apps/battleship | Not Started | Grid + fog-of-war UI package needs |
| Peer | mancala | apps/mancala | Not Started | Rule engine extraction candidate |
| Peer | liars-dice | apps/liars-dice | Not Started | Shared dice mechanics |
| Peer | mexico | apps/mexico | Not Started | Dice/ranking domain helpers |
| Peer | nim | apps/nim | Not Started | Ingestion/restructuring track with larger footprint |

## Per-Repo Intake Template

Copy this section per game when starting absorption:

### <repo-name>

- Source path: `C:/Users/scott/<repo-name>`
- Destination path: `apps/<repo-name>`
- Owner: _TBD_
- Status: `Not Started`

#### Intake Checks

- [ ] Peer candidate selection evidence completed via `docs/monorepo/PEER-CANDIDATE-SELECTION-CHECKLIST.md`
- [ ] Node/pnpm versions aligned with monorepo policy
- [ ] Existing scripts inventory captured
- [ ] Electron/Capacitor footprint identified
- [ ] Test/coverage tooling mapped
- [ ] Lint/type config mapped

#### Migration Steps

- [ ] Move source into `apps/<repo-name>`
- [ ] Convert imports to shared package boundaries
- [ ] Conform package script contract
- [ ] Hook up report output paths
- [ ] Add CI matrix targets for web/mobile/desktop
- [ ] Validate builds for all required targets

#### Exit Criteria

- [ ] `pnpm --filter @games/<repo-name> validate` passes
- [ ] Platform build scripts execute (or are validated in correct runner)
- [ ] Reports generated in `apps/<repo-name>/reports/*`
- [ ] PR merged with no boundary violations

## Immediate Next 5 Absorptions

1. `monchola`
2. `reversi`
3. `simon-says`
4. `ship-captain-crew`
5. `2048`

This sequence follows scaffold-first ordering after peer-level comparison; it is re-evaluated at each intake PR.

## Active Execution Policy

- No single repo has permanent focus or baseline status.
- Each intake selects the best next candidate from peer repos by explicit comparison.
- Reference artifacts:
	- `docs/monorepo/SIBLING-REPO-SCAFFOLD-RANKING-2026-03-16.md`
	- `docs/monorepo/PEER-CANDIDATE-SELECTION-CHECKLIST.md`
	- `docs/monorepo/PR-BLUEPRINT-MONCHOLA.md`
	- `docs/monorepo/PR1-MONCHOLA-RUNBOOK.md`
	- `docs/monorepo/MONCHOLA-EXECUTION-TODOS.md`
	- `docs/monorepo/MONCHOLA-CANDIDATE-SELECTION-EVIDENCE-2026-03-16.md`
	- candidate-specific PR blueprints/runbooks as created per intake

## TicTacToe Execution Checklist (PR1)

### Phase 0 — Branch + Safety

- [ ] Create migration branch and rollback tag
- [ ] Freeze source repo changes during intake/copy

### Phase 1 — Intake Audit

- [ ] Script/dependency inventory completed
- [ ] Electron/Capacitor routes validated
- [ ] Reporting parity requirements captured

### Phase 2 — Package Isolation

- [ ] Source copied to `apps/tictactoe`
- [ ] Package renamed to `@games/tictactoe`
- [ ] App runs via filtered workspace commands

### Phase 3 — Contract + Reporting

- [ ] Full script contract implemented
- [ ] Platform scripts for web/mobile/desktop implemented
- [ ] Report scripts implemented and writing to `apps/tictactoe/reports/*`

### Phase 4 — Verification + CI

- [ ] `pnpm --filter @games/tictactoe validate` passes
- [ ] CI matrix + report artifact upload configured
- [ ] Merge gate checks all green

### Phase 5 — Shared Code Improvement (Follow-up)

- [ ] Low-risk shared modules extracted to `packages/*`
- [ ] Cross-app refactor and coverage gains measured
