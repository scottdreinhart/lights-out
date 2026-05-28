# Reversi Backlog

## Applicability

- Arcade stack fit: very high.
- WASM fit: high, especially for move evaluation and AI search.
- Current posture: already has an `ai-wasm` surface.

## Phase 1: Domain Contracts

**Goal**: Keep flip rules, legal move generation, and board ownership in domain code.

**Domain**

- Keep move generation, flipping, pass-turn logic, and end-state detection in `src/domain`.
- Define explicit board and move helper types.
- Preserve deterministic rule execution for the same inputs.

**App**

- Do not duplicate flip logic or turn legality in React.
- Keep persistence and session orchestration outside the rules.

**UI**

- Render board state and move hints from snapshots only.
- Keep highlights and previews presentational.

**WASM**

- Keep the accelerator separate from the rule contract.
- Preserve the JS baseline for move resolution.

**Checkpoints**

- Move generation is pure.
- Flip resolution is deterministic.
- Board ownership and end-state logic do not depend on UI state.

**Exit Criteria**

- The rules layer can fully describe the game without UI assumptions.

## Phase 2: Core Simulation

**Goal**: Make pass-turn, capture-flip, and termination behavior fully testable.

**Domain**

- Keep legal move search, flipping, and winner detection deterministic.
- Add focused tests for corner cases and pass-turn sequences.
- Preserve existing gameplay outcomes while tightening the rules surface.

**App**

- Keep board setup, resets, and turn orchestration in app services or hooks.
- Surface a read-only state snapshot to the shell.

**UI**

- Render from the snapshot; avoid rule branching in components.
- Keep move previews and turn indicators separate from rule logic.

**WASM**

- Do not accelerate until the deterministic path is stable.
- Keep parity measurable for any search or evaluation changes.

**Checkpoints**

- Legal move search remains deterministic.
- Flips resolve identically across repeated inputs.
- Game-over detection is isolated from rendering.

**Exit Criteria**

- The core rule engine is ready for shared shell and optional AI acceleration.

## Phase 3: App Orchestration

**Goal**: Surface board state, legal moves, and turn status through a single hook or orchestration surface.

**Domain**

- Keep rule resolution inside domain helpers only.
- Export a clean snapshot shape for the app layer.

**App**

- Expose board snapshots, legal move hints, and turn metadata through the app hook.
- Keep any persistence or timer orchestration in app code.
- Maintain a barrel-only public API.

**UI**

- Read state through the orchestration hook instead of domain internals.
- Keep interaction and rendering concerns separated.

**WASM**

- Make the app indifferent to whether evaluation is JS or WASM backed.

**Checkpoints**

- UI sees a clean state snapshot.
- App layer does not duplicate flip logic.

**Exit Criteria**

- The UI can render from a single orchestration hook.

## Phase 4: UI Shell

**Goal**: Align the screen with the shared arcade shell and focus model.

**Domain**

- Keep the flip engine isolated from view code.

**App**

- Provide shell-ready status and session data.
- Keep focus and reset orchestration out of the component tree.

**UI**

- Place board, status, and actions into shared shell regions.
- Preserve keyboard navigation, focus visibility, and responsive layout.
- Keep move previews and highlights presentational.

**WASM**

- Do not branch UI behavior on accelerator implementation.

**Checkpoints**

- Status, board, and actions sit in shared shell regions.
- Move previews and highlights remain presentational.

**Exit Criteria**

- The app reads as part of the shared arcade family without losing reversi behavior.

## Phase 5: WASM Integration

**Goal**: Preserve and harden the existing acceleration path for evaluation and search.

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

- JS fallback remains behaviorally equivalent.
- WASM stays optional and deterministic.

**Exit Criteria**

- Search can accelerate without changing rule ownership.
