# Monchola Candidate Selection Evidence — 2026-03-16

Source checklist: `docs/monorepo/PEER-CANDIDATE-SELECTION-CHECKLIST.md`

## Required Evidence

- [x] Candidate set documented (at least 3 peer repos compared)
- [x] Comparison criteria recorded:
  - completeness
  - merge safety / blast radius
  - shared-package ROI
  - script/reporting contract fit
- [x] Winner rationale documented with tradeoffs
- [x] Tie-breaker rationale documented (scaffold ranking used)
- [x] Nim handling note documented when Nim is in candidate set

## Candidate Set Compared

- `monchola`
- `reversi`
- `simon-says`
- `nim` (included for required handling note)

## Comparison Criteria and Assessment

### 1) Completeness

- `monchola`: full app shape present (src/app/domain/ui/themes/wasm/workers + electron + capacitor + assembly + scripts).
- `reversi`: similar scaffold completeness from ranking artifact metadata.
- `simon-says`: similar scaffold completeness from ranking artifact metadata.
- `nim`: complete but larger footprint and restructure-heavy profile.

### 2) Merge Safety / Blast Radius

- `monchola` lowest complexity score in ranking (`160`), implying smallest expected blast radius for first peer-intake after policy standardization.
- `reversi` and `simon-says` tied at next score tier (`184`), still low-risk but higher than `monchola`.
- `nim` significantly larger (`475`) and better handled as dedicated ingestion wave.

### 3) Shared-Package ROI

- `monchola` provides immediate value for hardening script/report contract mapping with minimal complexity overhead.
- `reversi` and `simon-says` likely provide similar ROI but are better sequenced after first low-risk contract-hardening pass.
- `nim` has high eventual ROI but lower short-term merge safety for current step.

### 4) Script/Reporting Contract Fit

- `monchola` already has strong base scripts (`dev/build/preview/lint/typecheck/check/validate` + electron/capacitor/wasm).
- Known deltas are tractable and explicit (missing `test`, missing `report:*`, contract naming alignment for mobile build scripts).
- This profile is ideal for proving the intake conversion template.

## Selection Decision Record

- Date: `2026-03-16`
- Evaluated candidates: `monchola`, `reversi`, `simon-says`, `nim`
- Selected candidate: `monchola`
- Why selected now:
  - Lowest measured scaffold complexity,
  - strong baseline script/platform completeness,
  - narrow, well-defined contract deltas,
  - best immediate merge-safety profile for first peer-level intake execution.
- Why not selected peers (short):
  - `reversi`: low-risk but higher complexity than `monchola`; sequenced next.
  - `simon-says`: low-risk but tied behind `reversi`; sequenced after first intake hardening.
  - `nim`: larger footprint and explicit restructure track; not optimal for current low-blast-radius intake step.
- Linked artifacts:
  - `docs/monorepo/MONOREPO-ABSORPTION-QUEUE.md`
  - `docs/monorepo/SIBLING-REPO-SCAFFOLD-RANKING-2026-03-16.md`
  - `docs/monorepo/PR-BLUEPRINT-MONCHOLA.md`
  - `docs/monorepo/PR1-MONCHOLA-RUNBOOK.md`
  - `docs/monorepo/MONCHOLA-EXECUTION-TODOS.md`
  - `docs/monorepo/MONCHOLA-INTAKE-BASELINE-2026-03-16.md`

## Nim Handling Note

Nim remains in the peer candidate set but is intentionally routed to a larger ingestion/restructure wave due to footprint and risk profile; this does not imply lower priority in principle, only sequence optimization for current merge safety.
