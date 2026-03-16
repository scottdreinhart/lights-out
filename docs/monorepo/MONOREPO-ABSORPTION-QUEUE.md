# Monorepo Absorption Queue

## Queue Rules

- Absorb one game per PR to reduce blast radius.
- Preserve each game as a separately buildable package under `apps/<game>`.
- Do not merge until script contract and reporting outputs are complete.

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

| Priority | Repo | Target Package | Status | Notes |
|---|---|---|---|---|
| P0 | lights-out | apps/lights-out | In Progress | Baseline app and standards source |
| P1 | tictactoe | apps/tictactoe | Not Started | Closest gameplay pattern alignment |
| P1 | snake | apps/snake | Not Started | Strong keyboard/input reuse candidate |
| P1 | minesweeper | apps/minesweeper | Not Started | Grid/domain reuse opportunity |
| P2 | connect-four | apps/connect-four | Not Started | Board-state package reuse |
| P2 | reversi | apps/reversi | Not Started | Strategy/rules reuse |
| P2 | checkers | apps/checkers | Not Started | Turn engine + movement reuse |
| P2 | battleship | apps/battleship | Not Started | Grid + fog-of-war UI package needs |
| P2 | memory-game | apps/memory-game | Not Started | UI animation/shared stats reuse |
| P3 | hangman | apps/hangman | Not Started | Simpler app for contract hardening |
| P3 | simon-says | apps/simon-says | Not Started | Input/timing package reuse |
| P3 | mancala | apps/mancala | Not Started | Rule engine extraction candidate |
| P3 | rock-paper-scissors | apps/rock-paper-scissors | Not Started | Lightweight package validation |
| P4 | 2048 | apps/2048 | Not Started | Input + board merge logic package |
| P4 | ship-captain-crew | apps/ship-captain-crew | Not Started | Dice domain package candidate |
| P4 | shut-the-box | apps/shut-the-box | Not Started | Dice + turn-state package reuse |
| P4 | liars-dice | apps/liars-dice | Not Started | Shared dice mechanics |
| P4 | pig | apps/pig | Not Started | Shared turn/dice helpers |
| P4 | farkle | apps/farkle | Not Started | Shared scoring utilities |
| P4 | bunco | apps/bunco | Not Started | Shared dice round engine |
| P4 | cho-han | apps/cho-han | Not Started | Probability/scoring utilities |
| P4 | mexico | apps/mexico | Not Started | Dice/ranking domain helpers |
| P4 | monchola | apps/monchola | Not Started | Validate naming/package metadata first |
| P4 | cee-lo | apps/cee-lo | Not Started | Dice package reuse |

## Per-Repo Intake Template

Copy this section per game when starting absorption:

### <repo-name>

- Source path: `C:/Users/scott/<repo-name>`
- Destination path: `apps/<repo-name>`
- Owner: _TBD_
- Status: `Not Started`

#### Intake Checks

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

1. `tictactoe`
2. `snake`
3. `minesweeper`
4. `connect-four`
5. `reversi`

These provide the best early shared-package ROI for board logic, UI patterns, and input controls.
