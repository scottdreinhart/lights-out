# Block-Fall Backlog

## Applicability

- Arcade stack fit: high.
- WASM fit: low to medium, depending on whether AI search, bag analysis, or simulation depth grows.
- Current posture: no current WASM surface found.

## Phase 1: Domain Contracts

**Goal**: Keep piece shapes, rotation, collision, gravity, and clear rules in domain code.

**Domain**

- Keep shapes, rotations, collision, gravity, and line-clear helpers in `src/domain`.
- Define explicit piece, board, and tick types.
- Preserve deterministic updates for the same input sequence.

**App**

- Keep timing, pause, and session orchestration in app code.
- Expose only a read-only game snapshot to the UI.

**UI**

- Render the playfield, score, and controls from snapshots only.
- Keep previews, hold, and speed indicators presentational.

**WASM**

- Do not introduce WASM before the rule model is stable.
- Keep AI or simulation work outside the contract shape.

**Checkpoints**

- Piece placement is deterministic.
- Line clear logic remains pure.
- No UI state influences game physics.

**Exit Criteria**

- The rules layer can fully describe the game without UI assumptions.

## Phase 2: Core Simulation

**Goal**: Stabilize falling cadence, hold or preview flow, and fail-state detection.

**Domain**

- Keep tick progression, lock, clear, and spawn behavior deterministic.
- Add tests for rotations, line clears, and repeated board states.
- Preserve existing gameplay outcomes while tightening the rule surface.

**App**

- Keep input application and reset flow in app services or hooks.
- Avoid duplicating collision logic in React.

**UI**

- Render a snapshot only; do not calculate game state in components.
- Keep pause and fail feedback separate from rule logic.

**WASM**

- Do not accelerate before the deterministic path is stable.
- Keep AI, simulation, or bag-analysis changes measurable.

**Checkpoints**

- Tick progression is deterministic.
- Lock, clear, and spawn behavior remain testable.

**Exit Criteria**

- The core rule engine is ready for shared shell and optional acceleration.

## Phase 3: App Orchestration

**Goal**: Expose the active board, queue, score, and level state through app hooks.

**Domain**

- Keep the game rules in domain helpers only.
- Export a clean snapshot shape for the app layer.

**App**

- Expose board, queue, score, level, and pause metadata through the app hook.
- Keep persistence and runtime setup in app services or hooks.
- Maintain a barrel-only public API.

**UI**

- Read state through the orchestration hook instead of domain internals.
- Keep interaction and rendering concerns separated.

**WASM**

- Make the app indifferent to whether simulation helpers are JS or WASM backed.

**Checkpoints**

- Orchestration remains thin.
- UI reads a snapshot, not mutable engine state.

**Exit Criteria**

- The UI can render from a single orchestration hook.

## Phase 4: UI Shell

**Goal**: Move the playfield, HUD, and controls into the shared arcade shell.

**Domain**

- Keep the falling-block engine isolated from view code.

**App**

- Provide shell-ready status and session data.
- Preserve focus, pause, and restart orchestration outside the UI.

**UI**

- Keep the board visible and responsive.
- Use shared action and status primitives where possible.
- Preserve keyboard navigation, focus visibility, and responsive layout.

**WASM**

- Do not branch UI behavior on accelerator implementation.

**Checkpoints**

- The board stays visible and responsive.
- Control hints and status stay accessible.

**Exit Criteria**

- The app reads as part of the shared arcade family without losing block-fall behavior.

## Phase 5: WASM Integration

**Goal**: Add WASM only if evaluation, simulation, or AI search becomes a proven bottleneck.

**Domain**

- Keep simulation inputs and outputs deterministic.
- Preserve parity between accelerated and non-accelerated results.

**App**

- Introduce `src/wasm` only when profiling shows a clear benefit.
- Keep any WASM loader optional and fallback-safe.
- Add regression checks for parity between JS and WASM results.

**UI**

- Keep loading or simulation status generic.
- Do not expose accelerator details to the shell.

**WASM**

- Use WASM only as an optimization, not a second source of truth.
- Preserve JS fallback behavior.

**Checkpoints**

- No premature accelerator is introduced.
- JS remains the baseline implementation.

**Exit Criteria**

- Simulation or AI can accelerate without changing rule ownership.
