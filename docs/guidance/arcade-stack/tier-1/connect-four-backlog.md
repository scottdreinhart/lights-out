# Connect-Four Backlog

## Applicability

- Arcade stack fit: very high.
- WASM fit: high for AI search, evaluation, and board scanning.
- Current posture: already has an `ai-wasm` surface.

## Phase 1: Domain Contracts

**Goal**: Keep piece drop, gravity, column capacity, and win detection in domain rules.

**Domain**

- Keep drop resolution, win-line detection, and draw detection in `src/domain`.
- Define explicit move and board helpers.
- Preserve deterministic board updates for the same inputs.

**App**

- Keep turn orchestration, persistence, and session setup outside the rules engine.
- Expose only a read-only snapshot to the UI.

**UI**

- Render the board and status from the snapshot.
- Keep previews and highlights presentational.

**WASM**

- Keep the accelerator separate from the rule contract.
- Preserve the JS baseline for move evaluation.

**Checkpoints**

- Column placement is deterministic.
- Win lines are computed without UI coupling.
- Draw state is explicit.

**Exit Criteria**

- The rules layer can fully describe the game without UI assumptions.

## Phase 2: Core Simulation

**Goal**: Keep win-state scanning and input application stable under the same board inputs.

**Domain**

- Keep move legality, gravity, and win detection deterministic.
- Add tests for column overflow, diagonal wins, and repeated board states.
- Preserve the current gameplay outcomes while tightening the rule surface.

**App**

- Keep input application and reset flow in app services or hooks.
- Avoid duplicating win detection in React.

**UI**

- Render a snapshot only; do not calculate game state in components.
- Keep player-turn feedback separate from rule logic.

**WASM**

- Do not accelerate before the deterministic path is stable.
- Keep search depth and evaluation changes measurable.

**Checkpoints**

- Same sequence of drops yields the same result.
- Column overflow handling is explicit.
- No presentation concern affects outcomes.

**Exit Criteria**

- The core rule engine is ready for shared shell and optional AI acceleration.

## Phase 3: App Orchestration

**Goal**: Expose board snapshots, turn state, and hints through a minimal app hook.

**Domain**

- Keep the game rules in domain helpers only.
- Export a clean snapshot shape for the app layer.

**App**

- Expose board snapshots, turn state, and hints through the app hook.
- Keep persistence and runtime setup in app services or hooks.
- Maintain a barrel-only public API.

**UI**

- Read state through the orchestration hook instead of domain internals.
- Keep interaction and rendering concerns separated.

**WASM**

- Keep the app indifferent to whether evaluation is JS or WASM backed.

**Checkpoints**

- UI receives a ready-to-render snapshot.
- App layer remains orchestration only.

**Exit Criteria**

- The UI can render from a single orchestration hook.

## Phase 4: UI Shell

**Goal**: Move the game into the shared arcade presentation model.

**Domain**

- Keep the win engine isolated from view code.

**App**

- Provide shell-ready status and session data.
- Preserve focus, pause, and reset orchestration outside the UI.

**UI**

- Use shared action, status, and board patterns where possible.
- Preserve keyboard navigation, focus visibility, and responsive layout.
- Keep hints and win-line highlights presentational.

**WASM**

- Do not branch UI behavior on accelerator implementation.

**Checkpoints**

- Actions, status, and board all use shared shell patterns.
- Focus and responsive behavior are consistent.

**Exit Criteria**

- The app reads as part of the shared arcade family without losing connect-four behavior.

## Phase 5: WASM Integration

**Goal**: Preserve the existing search accelerator and keep JS fallback intact.

**Domain**

- Keep search inputs and outputs deterministic.
- Preserve parity between accelerated and non-accelerated results.

**App**

- Keep `src/wasm/ai-wasm.ts` optional and fallback-safe.
- Add regression checks for parity between JS and WASM search results.

**UI**

- Keep loading or search status generic.
- Do not expose accelerator details to the shell.

**WASM**

- Use WASM only as an optimization, not a second source of truth.
- Preserve JS fallback behavior.

**Checkpoints**

- AI parity is tested against JS fallback.
- WASM does not own variant or rule identity.

**Exit Criteria**

- Search can accelerate without changing rule ownership.
