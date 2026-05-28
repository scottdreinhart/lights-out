# Sudoku Backlog

## Applicability

- Arcade stack fit: very high.
- WASM fit: high, because solver, generation, pencil-mark validation, and hint logic can become expensive.
- Current posture: no current WASM surface found.

## Phase 1: Domain Contracts

**Goal**: Keep board shape, candidate rules, constraint validation, and puzzle state pure.

**Domain**

- Keep board shape, candidates, constraints, and solved-state helpers in `src/domain`.
- Define explicit cell, board, and constraint types.
- Preserve deterministic validation for the same grid state.

**App**

- Keep puzzle setup, reset flow, and session orchestration in app code.
- Expose only a read-only puzzle snapshot to the UI.

**UI**

- Render the board, notes, and error state from snapshots only.
- Keep highlight and hint visuals presentational.

**WASM**

- Do not introduce WASM before the rule model is stable.
- Keep solver work outside the contract shape.

**Checkpoints**

- Constraint logic is deterministic and testable.
- Given cells, candidates, and errors are domain-owned.
- No UI code decides legality.

**Exit Criteria**

- The rules layer can fully describe the puzzle without UI assumptions.

## Phase 2: Core Simulation

**Goal**: Stabilize puzzle loading, validation, completion detection, and hint logic.

**Domain**

- Keep validation, clue propagation, solved detection, and hint generation deterministic.
- Add tests for candidate elimination, row/column/block conflicts, and puzzle completion.
- Preserve existing gameplay outcomes while tightening the rule surface.

**App**

- Keep board setup and reset orchestration in app services or hooks.
- Avoid duplicating constraint logic in React.

**UI**

- Render a snapshot only; do not calculate puzzle state in components.
- Keep error and completion feedback separate from rule logic.

**WASM**

- Do not accelerate before the deterministic path is stable.
- Keep solver and generator changes measurable.

**Checkpoints**

- Validation is repeatable for the same grid state.
- Puzzle generation and solving are explicit domain operations.

**Exit Criteria**

- The core rule engine is ready for shared shell and optional acceleration.

## Phase 3: App Orchestration

**Goal**: Expose board state, note state, error state, and timer or session state through app hooks.

**Domain**

- Keep puzzle rules in domain helpers only.
- Export a clean snapshot shape for the app layer.

**App**

- Expose board snapshots, note state, error state, and session metadata through the app hook.
- Keep persistence and runtime setup in app services or hooks.
- Maintain a barrel-only public API.

**UI**

- Read state through the orchestration hook instead of domain internals.
- Keep interaction and rendering concerns separated.

**WASM**

- Make the app indifferent to whether solver work is JS or WASM backed.

**Checkpoints**

- App orchestration remains thin.
- UI gets a clean puzzle snapshot.

**Exit Criteria**

- The UI can render from a single orchestration hook.

## Phase 4: UI Shell

**Goal**: Move the board, notes, and actions onto the shared arcade shell without losing the puzzle layout.

**Domain**

- Keep the Sudoku engine isolated from view code.

**App**

- Provide shell-ready status and session data.
- Preserve focus, pause, and reset orchestration outside the UI.

**UI**

- Keep the board legible across device tiers.
- Use shared action and status primitives where possible.
- Preserve keyboard traversal, focus visibility, and accessibility labels.

**WASM**

- Do not branch UI behavior on accelerator implementation.

**Checkpoints**

- Large and small boards remain readable.
- Focus, keyboard traversal, and accessibility semantics are preserved.

**Exit Criteria**

- The app reads as part of the shared arcade family without losing Sudoku behavior.

## Phase 5: WASM Integration

**Goal**: Introduce WASM only if solver, generator, or hint computation needs acceleration.

**Domain**

- Keep solver inputs and outputs deterministic.
- Preserve parity between accelerated and non-accelerated results.

**App**

- Introduce `src/wasm` only when profiling shows a clear benefit.
- Keep any WASM loader optional and fallback-safe.
- Add regression checks for parity between JS and WASM results.

**UI**

- Keep loading or solver status generic.
- Do not expose accelerator details to the shell.

**WASM**

- Use WASM only as an optimization, not a second source of truth.
- Preserve JS fallback behavior.

**Checkpoints**

- Any acceleration path remains optional.
- JS fallback stays fully correct.

**Exit Criteria**

- Solver and generator work can accelerate without changing rule ownership.
