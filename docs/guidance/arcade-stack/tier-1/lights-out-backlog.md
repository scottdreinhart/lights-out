# Lights-Out Backlog

## Applicability

- Arcade stack fit: high.
- WASM fit: medium, mainly for solver generation or hint analysis.
- Current posture: already has a WASM loader and `ai-wasm`.

## Phase 1: Domain Contracts

**Goal**: Keep toggle rules, adjacency effects, and solved-state detection pure.

**Domain**

- Keep cell toggles, adjacency math, and solved-state helpers in `src/domain`.
- Define explicit board and toggle types.
- Preserve deterministic updates for the same input.

**App**

- Keep setup flow, reset flow, and session orchestration in app code.
- Expose only a read-only puzzle snapshot to the UI.

**UI**

- Render the grid, status, and controls from snapshots only.
- Keep toggle hints and solved feedback presentational.

**WASM**

- Keep the loader and `ai-wasm` separate from the rule contract.
- Preserve JS fallback for puzzle state updates.

**Checkpoints**

- Board state transitions are deterministic.
- Adjacency math stays in domain code.
- UI state never drives rule resolution.

**Exit Criteria**

- The rules layer can fully describe the puzzle without UI assumptions.

## Phase 2: Core Simulation

**Goal**: Keep board transitions, reset, and completion detection stable.

**Domain**

- Keep toggle propagation and completion detection deterministic.
- Add tests for edge toggles and repeated board states.
- Preserve existing gameplay outcomes while tightening the rule surface.

**App**

- Keep board setup and reset orchestration in app services or hooks.
- Avoid duplicating toggle logic in React.

**UI**

- Render a snapshot only; do not calculate puzzle state in components.
- Keep completion feedback separate from rule logic.

**WASM**

- Do not accelerate before the deterministic path is stable.
- Keep solver or hint changes measurable.

**Checkpoints**

- Toggling the same cell from the same state always produces the same result.
- Completion logic is isolated from rendering.

**Exit Criteria**

- The core rule engine is ready for shared shell and optional solver acceleration.

## Phase 3: App Orchestration

**Goal**: Surface board state, move counts, and session flow through a compact hook.

**Domain**

- Keep puzzle rules in domain helpers only.
- Export a clean snapshot shape for the app layer.

**App**

- Expose board snapshots, move counts, and session metadata through the app hook.
- Keep persistence and runtime setup in app services or hooks.
- Maintain a barrel-only public API.

**UI**

- Read state through the orchestration hook instead of domain internals.
- Keep interaction and rendering concerns separated.

**WASM**

- Make the app indifferent to whether solver work is JS or WASM backed.

**Checkpoints**

- App orchestration remains thin.
- No duplicate toggle logic appears in React.

**Exit Criteria**

- The UI can render from a single orchestration hook.

## Phase 4: UI Shell

**Goal**: Use the shared arcade shell to keep the grid readable and the controls accessible.

**Domain**

- Keep the toggle engine isolated from view code.

**App**

- Provide shell-ready status and session data.
- Preserve focus, pause, and reset orchestration outside the UI.

**UI**

- Keep the grid legible across device tiers.
- Use shared action and status primitives where possible.
- Preserve keyboard navigation, focus visibility, and accessibility labels.

**WASM**

- Do not branch UI behavior on accelerator implementation.

**Checkpoints**

- Grid presentation remains clean on all device tiers.
- Focus and keyboard control remain explicit.

**Exit Criteria**

- The app reads as part of the shared arcade family without losing lights-out behavior.

## Phase 5: WASM Integration

**Goal**: Preserve the existing WASM path and use it only where solving or hinting benefits.

**Domain**

- Keep solver inputs and outputs deterministic.
- Preserve parity between accelerated and non-accelerated results.

**App**

- Keep `src/wasm/wasm-loader.ts` and `src/wasm/ai-wasm.ts` optional and fallback-safe.
- Add regression checks for parity between JS and WASM results.

**UI**

- Keep loading or hint status generic.
- Do not expose accelerator details to the shell.

**WASM**

- Use WASM only as an optimization, not a second source of truth.
- Preserve JS fallback behavior.

**Checkpoints**

- JS fallback remains correct.
- WASM is an accelerator, not a rule source.

**Exit Criteria**

- Solver and hint work can accelerate without changing rule ownership.
