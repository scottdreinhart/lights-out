# Migration Evidence Ledger — 2026-03-17

## Scope
This ledger captures concrete repository evidence for documentation/license consolidation and cleanup work.  
Source of truth used for this ledger: `git status --short` in workspace root.

## Evidence Summary

- Root consolidation buckets now present and populated:
  - `docs/governance/`
  - `docs/guidance/`
  - `docs/guardrails/`
- App-local governance/docs/license files were removed from multiple `apps/*` folders.
- Root README tree section was regenerated.
- Root `LICENSE` was modified as consolidation target.

## Verified Target Buckets (created/populated)

- `docs/governance/nim/`
- `docs/governance/snake/`
- `docs/governance/tictactoe/`
- `docs/governance/battleship/`
- `docs/guidance/nim/`
- `docs/guidance/connect-four/`
- `docs/guidance/mancala/`
- `docs/guidance/battleship/`
- `docs/guardrails/nim/`

## Sample Source → Action → Destination Map

| Source path | Action | Destination / result |
|---|---|---|
| `apps/nim/.github/CI-CD-SETUP.md` | moved | `docs/governance/nim/CI-CD-SETUP.md` |
| `apps/nim/.github/DEPLOYMENT-RESULTS.md` | moved | `docs/governance/nim/DEPLOYMENT-RESULTS.md` |
| `apps/nim/.github/GOVERNANCE-STATUS.md` | moved | `docs/governance/nim/GOVERNANCE-STATUS.md` |
| `apps/snake/.github/INSTRUCTION-FILE-CONSOLIDATION-SUMMARY.md` | moved | `docs/governance/snake/INSTRUCTION-FILE-CONSOLIDATION-SUMMARY.md` |
| `apps/tictactoe/.github/GOVERNANCE-STATUS.md` | moved | `docs/governance/tictactoe/GOVERNANCE-STATUS.md` |
| `apps/battleship/.github/ui-patterns-governance.md` | moved | `docs/governance/battleship/ui-patterns-governance.md` |
| `apps/battleship/docs/UI_PATTERNS_IMPLEMENTATION_GUIDE.md` | moved | `docs/guidance/battleship/UI_PATTERNS_IMPLEMENTATION_GUIDE.md` |
| `apps/connect-four/docs/build-matrix.md` | moved | `docs/guidance/connect-four/build-matrix.md` |
| `apps/connect-four/docs/development/workflows.md` | moved | `docs/guidance/connect-four/workflows.md` |
| `apps/mancala/GAME_FUNCTIONAL_GUIDE.md` | moved | `docs/guidance/mancala/GAME_FUNCTIONAL_GUIDE.md` |
| `apps/mancala/MANCALA_STRATEGY_GUIDE.md` | moved | `docs/guidance/mancala/MANCALA_STRATEGY_GUIDE.md` |
| `apps/nim/ANDROID-SYSTEM-IMAGES-OFFICIAL.md` | moved | `docs/guardrails/nim/ANDROID-SYSTEM-IMAGES-OFFICIAL.md` |
| `apps/nim/MIGRATION-EXAMPLES.md` | moved | `docs/guardrails/nim/MIGRATION-EXAMPLES.md` |
| `apps/nim/QUICKSTART-NEXT-STEPS.md` | moved | `docs/guardrails/nim/QUICKSTART-NEXT-STEPS.md` |
| `apps/nim/START-HERE.md` | moved | `docs/guardrails/nim/START-HERE.md` |

## Sample Purge/Delete Evidence (from git status)

| Path | Status |
|---|---|
| `apps/bunco/LICENSE` | deleted |
| `apps/cee-lo/LICENSE` | deleted |
| `apps/checkers/LICENSE` | deleted |
| `apps/chicago/LICENSE` | deleted |
| `apps/cho-han/LICENSE` | deleted |
| `apps/connect-four/LICENSE` | deleted |
| `apps/farkle/LICENSE` | deleted |
| `apps/hangman/LICENSE` | deleted |
| `apps/liars-dice/LICENSE` | deleted |
| `apps/memory-game/LICENSE` | deleted |
| `apps/mexico/LICENSE` | deleted |
| `apps/minesweeper/LICENSE` | deleted |
| `apps/monchola/LICENSE` | deleted |
| `apps/pig/LICENSE` | deleted |
| `apps/reversi/LICENSE` | deleted |
| `apps/rock-paper-scissors/LICENSE` | deleted |
| `apps/ship-captain-crew/LICENSE` | deleted |
| `apps/shut-the-box/LICENSE` | deleted |
| `apps/simon-says/LICENSE` | deleted |
| `apps/snake/LICENSE` | deleted |
| `apps/tictactoe/LICENSE` | deleted |

## Root-Level Consolidation Targets Modified

- `LICENSE` (modified)
- `README.md` (modified)

## Notes

- This ledger intentionally records explicit examples and destination verification points rather than every changed file.
- Complete raw evidence remains available via repository status and diff metadata.
