# Checkers Backlog

## Applicability

- Arcade stack fit: very high.
- WASM fit: high, especially for move search, evaluation, and deeper AI.
- Current posture: already has an `ai-wasm` surface, so the main work is standardization and fallback hardening.

## Phase 1: Domain Contracts

**Goal**: Keep piece state, capture rules, king promotion, and turn transitions deterministic and framework-agnostic.

**Domain**

- Keep board state, piece ownership, promotion, and capture rules in `src/domain`.
- Define explicit move, capture, and terminal-state helpers.
- Preserve rule purity so the same input always produces the same board result.

**App**

- Do not duplicate move legality in React.
- Keep any persistence or session setup outside the rules engine.

**UI**

- Prepare the board for the shared arcade shell without moving logic into components.
- Keep move hints and highlights presentational only.

**WASM**

- Keep acceleration out of the domain contract itself.
- Preserve the JS path as the baseline rule implementation.

**Checkpoints**

- Board updates remain pure and testable.
- Capture chains and promotion are expressed only in domain rules.
- No React, storage, or DOM dependencies leak into rules.

**Exit Criteria**

- The domain can fully describe legal move flow without UI assumptions.

## Phase 2: Core Simulation

**Goal**: Stabilize the turn engine, capture resolution, and end-state detection.

**Domain**

- Keep move legality, forced capture logic, and win detection deterministic.
- Add focused tests for multi-capture sequences and king movement.
- Preserve existing gameplay outcomes while cleaning the rule surface.

**App**

- Keep turn orchestration and session reset behavior in app code.
- Surface only the state the UI needs.

**UI**

- Render turn, board, and capture state from a read-only snapshot.
- Avoid branching on rule state in the component tree.

**WASM**

- Do not accelerate before the deterministic path is stable.
- Treat search depth changes as measurable and testable.

**Checkpoints**

- Same board state and move input always yield the same result.
- Multi-jump resolution is deterministic.
- End-state logic remains isolated from presentation.

**Exit Criteria**

- The core rule engine is ready for shared shell and optional AI acceleration.

## Phase 3: App Orchestration

**Goal**: Bridge the domain engine to React without turning the app layer into a second rules engine.

**Domain**

- Keep all legal move resolution in the domain layer.
- Export only the state snapshot and helpers the app needs.

**App**

- Expose board state, legal move hints, and turn metadata through the app hook.
- Keep persistence, timer orchestration, and session setup in app services or hooks.
- Keep the public app API barrel-only.

**UI**

- Consume the orchestration hook rather than reading internal state directly.
- Keep the screen focused on rendering and interaction.

**WASM**

- Keep the orchestration path agnostic to the implementation detail of JS versus WASM.

**Checkpoints**

- Hook outputs are shaped for UI consumption, not internal rule mutation.
- App code does not duplicate move legality.
- Validation still passes at the package level.

**Exit Criteria**

- The UI can render from a single orchestration hook.

## Phase 4: UI Shell

**Goal**: Move the screen to the shared arcade shell pattern.

**Domain**

- Keep the rules engine hidden behind the snapshot API.

**App**

- Provide shell-ready status and session data.
- Preserve focus, pause, and reset orchestration outside the UI components.

**UI**

- Use shared action and status primitives where possible.
- Keep board rendering, player indicators, and capture highlights presentational.
- Preserve keyboard navigation, focus visibility, and responsive layout.

**WASM**

- Do not let the UI know whether search is JS- or WASM-backed.

**Checkpoints**

- Board, status, and action areas are all shell-aligned.
- Accessibility labels remain explicit.
- UI logic stays out of the domain layer.

**Exit Criteria**

- The app reads as part of the shared arcade family without losing checkers-specific behavior.

## Phase 5: WASM Integration

**Goal**: Harden the existing acceleration path for evaluation and search.

**Domain**

- Keep search inputs and evaluation outputs deterministic.
- Preserve parity between accelerated and non-accelerated results.

**App**

- Keep `src/wasm/ai-wasm.ts` optional and fallback-safe.
- Add regression checks for parity between WASM and non-WASM results.

**UI**

- Do not branch rendering on the accelerator implementation.
- Keep search status and loading feedback generic.

**WASM**

- Use WASM only as an optimization, not a second source of truth.
- Preserve JS fallback behavior for all move computation.

**Checkpoints**

- WASM is an optimization, not a second source of truth.
- Fallback behavior remains intact.
- Search depth changes stay measurable.

**Exit Criteria**

- The app can accelerate search without changing rule ownership.
