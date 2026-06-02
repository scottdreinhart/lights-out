# Vector-Assault Backlog

## Applicability

- Arcade stack fit: high.
- WASM fit: low to medium unless physics, enemy swarms, or targeting logic become costly.
- Current posture: no current WASM surface found.

## Phase 1: Domain Contracts

**Goal**: Keep movement, firing, collision, scoring, and enemy state in domain rules.

**Domain**

- Keep movement, firing, collision, scoring, and enemy behavior in `src/domain`.
- Define explicit ship, projectile, and encounter types.
- Preserve deterministic updates for the same input sequence.

**App**

- Keep timing, pause, and session orchestration in app code.
- Expose only a read-only combat snapshot to the UI.

**UI**

- Render the playfield, score, and controls from snapshots only.
- Keep damage markers and weapon feedback presentational.

**WASM**

- Do not introduce WASM before the rule model is stable.
- Keep AI or combat simulation work outside the contract shape.

**Checkpoints**

- Combat state is deterministic.
- Movement and hit detection are rule-owned.
- No presentation code owns combat resolution.

**Exit Criteria**

- The rules layer can fully describe the game without UI assumptions.

## Phase 2: Core Simulation

**Goal**: Stabilize the main loop, spawn cadence, and fail or win state detection.

**Domain**

- Keep tick progression, enemy spawning, collisions, and score updates deterministic.
- Add tests for hit resolution, spawn timing, and repeated board states.
- Preserve existing gameplay outcomes while tightening the rule surface.

**App**

- Keep input application and reset flow in app services or hooks.
- Avoid duplicating combat logic in React.

**UI**

- Render a snapshot only; do not calculate game state in components.
- Keep pause and fail feedback separate from rule logic.

**WASM**

- Do not accelerate before the deterministic path is stable.
- Keep AI, collision, or simulation changes measurable.

**Checkpoints**

- Same input and tick sequence yields the same outcome.
- Enemy and projectile interactions are deterministic.

**Exit Criteria**

- The core rule engine is ready for shared shell and optional acceleration.

## Phase 3: App Orchestration

**Goal**: Surface score, health, wave, and control state through the app layer.

**Domain**

- Keep combat rules in domain helpers only.
- Export a clean snapshot shape for the app layer.

**App**

- Expose score, health, wave, and control metadata through the app hook.
- Keep persistence and runtime setup in app services or hooks.
- Maintain a barrel-only public API.

**UI**

- Read state through the orchestration hook instead of domain internals.
- Keep interaction and rendering concerns separated.

**WASM**

- Make the app indifferent to whether combat helpers are JS or WASM backed.

**Checkpoints**

- The app layer remains orchestration only.
- Persistence and runtime setup stay outside the UI.

**Exit Criteria**

- The UI can render from a single orchestration hook.

## Phase 4: UI Shell

**Goal**: Put the action HUD, status, and control hints onto the shared arcade shell.

**Domain**

- Keep the combat engine isolated from view code.

**App**

- Provide shell-ready status and session data.
- Preserve focus, pause, and restart orchestration outside the UI.

**UI**

- Keep the playfield the visual focus.
- Use shared action and status primitives where possible.
- Preserve keyboard, gamepad, and focus handling.

**WASM**

- Do not branch UI behavior on accelerator implementation.

**Checkpoints**

- The playfield remains the visual focus.
- Keyboard, gamepad, and focus handling stay explicit.

**Exit Criteria**

- The app reads as part of the shared arcade family without losing vector-assault behavior.

## Phase 5: WASM Integration

**Goal**: Add WASM only if profiling proves collision, pathing, or simulation cost is material.

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

- No speculative accelerator is introduced.
- JS fallback remains the default.

**Exit Criteria**

- Simulation or AI can accelerate without changing rule ownership.
