# Mini-Sudoku Backlog

## Applicability

- Arcade stack fit: very high.
- WASM fit: high, same reasons as Sudoku but with a smaller state space.
- Current posture: no current WASM surface found.

## Phase 1: Domain Contracts

**Goal**: Keep the smaller board, constraint rules, and completion state pure.

**Domain**

- Keep board shape, constraints, notes, and solved-state helpers in `src/domain`.
- Define explicit cell, board, and constraint types.
- Preserve deterministic validation for the same grid state.

**App**

- Keep puzzle setup, reset flow, and session orchestration in app code.
- Expose only a read-only puzzle snapshot to the UI.

**UI**

- Render the compact board, notes, and status from snapshots only.
- Keep highlight and hint visuals presentational.

**WASM**

- Do not introduce WASM before the rule model is stable.
- Keep solver work outside the contract shape.

**Checkpoints**

- The reduced puzzle size does not change the rule model.
- Candidate and validation logic remain deterministic.
- No UI code decides legality.

**Exit Criteria**

- The rules layer can fully describe the puzzle without UI assumptions.

## Phase 2: Core Simulation

**Goal**: Stabilize puzzle creation, validation, and solved-state detection.

**Domain**

- Keep validation, clue propagation, solved detection, and hint generation deterministic.
- Add tests for candidate elimination, conflict detection, and completion.
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

- All transitions remain rule-driven.
- No rendering concern affects puzzle correctness.

**Exit Criteria**

- The core rule engine is ready for shared shell and optional acceleration.

## Phase 3: App Orchestration

**Goal**: Expose the compact puzzle state through a minimal hook and keep persistence in the app layer.

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

- UI gets a single source of truth.
- App code does not duplicate constraint logic.

**Exit Criteria**

- The UI can render from a single orchestration hook.

## Phase 4: UI Shell

**Goal**: Adapt the shared shell to the smaller Sudoku board without bloating the layout.

**Domain**

- Keep the puzzle engine isolated from view code.

**App**

- Provide shell-ready status and session data.
- Preserve focus, pause, and reset orchestration outside the UI.

**UI**

- Keep the compact board legible across device tiers.
- Use shared action and status primitives where possible.
- Preserve keyboard traversal, focus visibility, and accessibility labels.

**WASM**

- Do not branch UI behavior on accelerator implementation.

**Checkpoints**

- Touch and keyboard flows stay obvious.
- Responsive layout preserves legibility.

**Exit Criteria**

- The app reads as part of the shared arcade family without losing mini-Sudoku behavior.

## Phase 5: WASM Integration

**Goal**: Add WASM only if solver or generator profiling shows a clear benefit.

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
