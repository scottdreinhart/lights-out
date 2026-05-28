# Tier 1 Arcade Stack + WASM Upconversion Backlog

This backlog breaks the remaining Tier 1 apps into the same phase-by-phase format used for Tama, but excludes `tictactoe` because it is already on the shared arcade stack.

The goal is not to force every app into the same runtime shape. The goal is to move each app through a shared shell, shared input, and shared presentation model while only adding WASM where the app actually benefits from deterministic acceleration.

## Shared Migration Rules

1. Keep game rules and deterministic state in `domain`.
2. Keep React orchestration, persistence, and runtime setup in `app`.
3. Keep view composition, accessibility, and responsive layout in `ui`.
4. Keep WASM optional unless the app has solver, search, heavy simulation, or dense AI work.
5. Validate each slice with the app’s package gate before widening scope.

## Tier 1 Applicability Map

| App              | Arcade-stack fit | WASM applicability | Current posture                             |
| ---------------- | ---------------- | ------------------ | ------------------------------------------- |
| `checkers`       | Very high        | High               | Already has an `ai-wasm` surface            |
| `reversi`        | Very high        | High               | Already has an `ai-wasm` surface            |
| `connect-four`   | Very high        | High               | Already has an `ai-wasm` surface            |
| `battleship`     | High             | Medium             | Already has an `ai-wasm` surface            |
| `minesweeper`    | High             | High               | Already has specialized WASM plus `ai-wasm` |
| `lights-out`     | High             | Medium             | Already has a WASM loader and `ai-wasm`     |
| `snake`          | Very high        | High               | Already has a WASM loader and `ai-wasm`     |
| `block-fall`     | High             | Low to medium      | No current WASM surface found               |
| `vector-assault` | High             | Low to medium      | No current WASM surface found               |
| `sudoku`         | Very high        | High               | No current WASM surface found               |
| `mini-sudoku`    | Very high        | High               | No current WASM surface found               |

## Recommended Order

1. `checkers`
2. `reversi`
3. `connect-four`
4. `battleship`
5. `minesweeper`
6. `lights-out`
7. `snake`
8. `sudoku`
9. `mini-sudoku`
10. `block-fall`
11. `vector-assault`

The first seven have the clearest shared-shell benefit plus a meaningful acceleration story. Sudoku variants rise in priority because solver and hint work can justify WASM if the implementation grows. Block-fall and vector-assault should still get the arcade shell, but WASM should be profile-driven rather than assumed.

---

## Checkers Backlog

### Applicability

- Arcade stack fit: very high.
- WASM fit: high, especially for move search, evaluation, and deeper AI.
- Current posture: already has an `ai-wasm` file, so the work is mostly standardization and fallback hardening.

### Phase 1: Domain Contracts

**Goal**: Make piece state, capture rules, king promotion, and turn transitions deterministic and framework-agnostic.

**Steps**

1. Keep board state, piece ownership, promotion, and capture rules in `src/domain`.
2. Define explicit move/capture types and terminal-state helpers.
3. Preserve rule purity so the same inputs always produce the same board result.

**Checkpoints**

- Board updates remain pure and testable.
- Capture chains and promotion are expressed in domain rules only.
- No React, storage, or DOM dependencies leak into rules.

**Exit Criteria**

- The domain can fully describe legal move flow without UI assumptions.

### Phase 2: Core Simulation

**Goal**: Stabilize the turn engine, capture resolution, and end-state detection.

**Steps**

1. Keep move legality, forced capture logic, and win detection deterministic.
2. Add focused tests for multi-capture sequences and king movement.
3. Preserve existing gameplay outcomes while cleaning the rule surface.

**Checkpoints**

- Same board state and move input always yield the same result.
- Multi-jump resolution is deterministic.
- End-state logic remains isolated from presentation.

**Exit Criteria**

- The core rule engine is ready for shared shell and optional AI acceleration.

### Phase 3: App Orchestration

**Goal**: Bridge the domain engine to React without turning the app layer into a second rules engine.

**Steps**

1. Expose board state, legal move hints, and turn metadata through the app hook.
2. Keep persistence, timer orchestration, and session setup in app services or hooks.
3. Keep the public app API barrel-only.

**Checkpoints**

- Hook outputs are shaped for UI consumption, not internal rule mutation.
- App code does not duplicate move legality.
- Validation still passes at the package level.

**Exit Criteria**

- The UI can render from a single orchestration hook.

### Phase 4: UI Shell

**Goal**: Move the screen to the shared arcade shell pattern.

**Steps**

1. Use shared action/status UI primitives where possible.
2. Keep board rendering, player indicators, and capture highlights presentational.
3. Preserve keyboard navigation, focus visibility, and responsive layout.

**Checkpoints**

- Board, status, and action areas are all shell-aligned.
- Accessibility labels remain explicit.
- UI logic stays out of the domain layer.

**Exit Criteria**

- The app reads as part of the shared arcade family without losing checkers-specific behavior.

### Phase 5: WASM Integration

**Goal**: Harden the existing acceleration path for evaluation and search.

**Steps**

1. Keep `src/wasm/ai-wasm.ts` as an optional accelerator.
2. Preserve JS fallback behavior for all move computation.
3. Add regression checks for parity between WASM and non-WASM results.

**Checkpoints**

- WASM is an optimization, not a second source of truth.
- Fallback behavior remains intact.
- Search depth changes stay measurable.

**Exit Criteria**

- The app can accelerate search without changing rule ownership.

---

## Reversi Backlog

### Applicability

- Arcade stack fit: very high.
- WASM fit: high, especially for move evaluation and AI search.
- Current posture: already has an `ai-wasm` surface.

### Phase 1: Domain Contracts

**Goal**: Keep flip rules, legal move generation, and board ownership in domain code.

**Checkpoints**

- Move generation is pure.
- Flip resolution is deterministic.
- Board ownership and end-state logic do not depend on UI state.

### Phase 2: Core Simulation

**Goal**: Make pass-turn, capture-flip, and termination behavior fully testable.

**Checkpoints**

- Legal move search remains deterministic.
- Flips resolve identically across repeated inputs.
- Game-over detection is isolated from rendering.

### Phase 3: App Orchestration

**Goal**: Surface board state, legal moves, and turn status through a single hook or orchestration surface.

**Checkpoints**

- UI sees a clean state snapshot.
- App layer does not duplicate flip logic.

### Phase 4: UI Shell

**Goal**: Align the screen with the shared arcade shell and focus model.

**Checkpoints**

- Status, board, and actions sit in shared shell regions.
- Move previews and highlights remain presentational.

### Phase 5: WASM Integration

**Goal**: Preserve and harden the existing acceleration path for evaluation/search.

**Checkpoints**

- JS fallback remains behaviorally equivalent.
- WASM stays optional and deterministic.

---

## Connect-Four Backlog

### Applicability

- Arcade stack fit: very high.
- WASM fit: high for AI search, evaluation, and board scanning.
- Current posture: already has an `ai-wasm` surface.

### Phase 1: Domain Contracts

**Goal**: Keep piece drop, gravity, column capacity, and win detection in domain rules.

**Checkpoints**

- Column placement is deterministic.
- Win lines are computed without UI coupling.
- Draw state is explicit.

### Phase 2: Core Simulation

**Goal**: Keep win-state scanning and input application stable under the same board inputs.

**Checkpoints**

- Same sequence of drops yields the same result.
- Column overflow handling is explicit.
- No presentation concern affects outcomes.

### Phase 3: App Orchestration

**Goal**: Expose board snapshots, turn state, and hints through a minimal app hook.

**Checkpoints**

- UI receives a ready-to-render snapshot.
- App layer remains orchestration only.

### Phase 4: UI Shell

**Goal**: Move the game into the shared arcade presentation model.

**Checkpoints**

- Actions, status, and board all use shared shell patterns.
- Focus and responsive behavior are consistent.

### Phase 5: WASM Integration

**Goal**: Preserve the existing search accelerator and keep JS fallback intact.

**Checkpoints**

- AI parity is tested against JS fallback.
- WASM does not own variant or rule identity.

---

## Battleship Backlog

### Applicability

- Arcade stack fit: high.
- WASM fit: medium, with value in AI targeting, placement heuristics, or probability scanning.
- Current posture: already has an `ai-wasm` surface.

### Phase 1: Domain Contracts

**Goal**: Keep ship layout, attack resolution, hit tracking, and sunk-state detection pure.

**Checkpoints**

- Board state is deterministic.
- Placement and attack rules stay in domain.
- Hidden information rules remain explicit.

### Phase 2: Core Simulation

**Goal**: Stabilize fleet setup, hit evaluation, and victory detection.

**Checkpoints**

- Repeated placements and attacks behave consistently.
- Sunk ship logic is isolated from UI.
- No presentation layer decides gameplay state.

### Phase 3: App Orchestration

**Goal**: Surface player and enemy board state, turn state, and setup flows through app hooks.

**Checkpoints**

- Orchestration stays thin.
- UI receives clean board snapshots.
- Session resets and persistence remain app-owned.

### Phase 4: UI Shell

**Goal**: Bring battleship board, status, and action surfaces onto the shared arcade layout.

**Checkpoints**

- Boards stay visible and uncluttered.
- Accessibility labels and keyboard affordances remain strong.

### Phase 5: WASM Integration

**Goal**: Keep the current acceleration path for targeting and AI decision support.

**Checkpoints**

- WASM stays optional.
- JS fallback remains correct.
- AI logic remains deterministic and reproducible.

---

## Minesweeper Backlog

### Applicability

- Arcade stack fit: high.
- WASM fit: high, especially for solver, generation, and probability/hint work.
- Current posture: already has a specialized WASM file plus `ai-wasm`.

### Phase 1: Domain Contracts

**Goal**: Keep mine placement, reveal propagation, flag state, and loss/win rules pure.

**Checkpoints**

- Board generation is deterministic for a given seed.
- Reveal/chord behavior is domain-owned.
- Hidden mine state remains isolated from UI.

### Phase 2: Core Simulation

**Goal**: Stabilize propagation, chord logic, and end-state evaluation.

**Checkpoints**

- Zero-adjacent propagation is deterministic.
- Failure and completion states are explicit.
- No UI code decides puzzle outcomes.

### Phase 3: App Orchestration

**Goal**: Expose board state, hint state, timers, and game status through a single hook.

**Checkpoints**

- App layer handles setup/reset orchestration only.
- UI gets a read-only snapshot.

### Phase 4: UI Shell

**Goal**: Move the grid, counters, and controls into the shared arcade presentation model.

**Checkpoints**

- Board visibility remains strong.
- Mobile and desktop layouts both preserve grid clarity.

### Phase 5: WASM Integration

**Goal**: Preserve the specialized WASM surface and add solver-style acceleration only where it helps.

**Checkpoints**

- The specialized WASM path remains fallback-safe.
- Any solver or probability helper stays optional.

---

## Lights-Out Backlog

### Applicability

- Arcade stack fit: high.
- WASM fit: medium, mainly for solver generation or hint analysis.
- Current posture: already has a WASM loader and `ai-wasm`.

### Phase 1: Domain Contracts

**Goal**: Keep toggle rules, adjacency effects, and solved-state detection pure.

**Checkpoints**

- Board state transitions are deterministic.
- Adjacency math stays in domain code.
- UI state never drives rule resolution.

### Phase 2: Core Simulation

**Goal**: Keep board transitions, reset, and completion detection stable.

**Checkpoints**

- Toggling the same cell from the same state always produces the same result.
- Completion logic is isolated from rendering.

### Phase 3: App Orchestration

**Goal**: Surface board state, move counts, and session flow through a compact hook.

**Checkpoints**

- App orchestration remains thin.
- No duplicate toggle logic appears in React.

### Phase 4: UI Shell

**Goal**: Use the shared arcade shell to keep the grid readable and the controls accessible.

**Checkpoints**

- Grid presentation remains clean on all device tiers.
- Focus and keyboard control remain explicit.

### Phase 5: WASM Integration

**Goal**: Preserve the existing WASM path and use it only where solving or hinting benefits.

**Checkpoints**

- JS fallback remains correct.
- WASM is an accelerator, not a rule source.

---

## Snake Backlog

### Applicability

- Arcade stack fit: very high.
- WASM fit: high, especially for path evaluation, AI planning, or dense tick simulations.
- Current posture: already has a WASM loader and `ai-wasm`.

### Phase 1: Domain Contracts

**Goal**: Keep movement, growth, collision, and food spawning in pure domain code.

**Checkpoints**

- Tick updates are deterministic.
- Collision and growth state are rule-owned.
- Board/viewport state is not mixed into the rules.

### Phase 2: Core Simulation

**Goal**: Stabilize the game loop and make input handling deterministic.

**Checkpoints**

- Same input sequence produces the same game path.
- Food spawning and wrap/collision behavior are explicit.

### Phase 3: App Orchestration

**Goal**: Expose current direction, score, speed, and pause state through the app layer.

**Checkpoints**

- Orchestration stays separate from collision logic.
- UI gets a minimal, read-only snapshot.

### Phase 4: UI Shell

**Goal**: Move score, pause, and control surfaces into the shared arcade layout.

**Checkpoints**

- The playfield stays visible.
- Keyboard and focus behavior remain consistent.

### Phase 5: WASM Integration

**Goal**: Preserve and harden the existing AI/runtime path.

**Checkpoints**

- WASM stays optional and deterministic.
- JS fallback remains the behavioral baseline.

---

## Sudoku Backlog

### Applicability

- Arcade stack fit: very high.
- WASM fit: high, because solver, generation, pencil-mark validation, and hint logic can become expensive.
- Current posture: no current WASM surface found.

### Phase 1: Domain Contracts

**Goal**: Keep board shape, candidate rules, constraint validation, and puzzle state pure.

**Checkpoints**

- Constraint logic is deterministic and testable.
- Given cells, candidates, and errors are domain-owned.
- No UI code decides legality.

### Phase 2: Core Simulation

**Goal**: Stabilize puzzle loading, validation, completion detection, and hint logic.

**Checkpoints**

- Validation is repeatable for the same grid state.
- Puzzle generation and solving are explicit domain operations.

### Phase 3: App Orchestration

**Goal**: Expose board state, note state, error state, and timer/session state through app hooks.

**Checkpoints**

- Orchestration owns persistence and runtime setup.
- UI receives a clean puzzle snapshot.

### Phase 4: UI Shell

**Goal**: Move the board, notes, and actions onto the shared arcade shell without losing the puzzle layout.

**Checkpoints**

- Large and small boards remain readable.
- Focus, keyboard traversal, and accessibility semantics are preserved.

### Phase 5: WASM Integration

**Goal**: Introduce WASM only if solver, generator, or hint computation needs acceleration.

**Checkpoints**

- WASM is data-oriented and deterministic.
- JS fallback remains the source of behavioral truth.

---

## Mini-Sudoku Backlog

### Applicability

- Arcade stack fit: very high.
- WASM fit: high, same reasons as Sudoku but with a smaller state space.
- Current posture: no current WASM surface found.

### Phase 1: Domain Contracts

**Goal**: Keep the smaller board, constraint rules, and completion state pure.

**Checkpoints**

- The reduced puzzle size does not change the rule model.
- Candidate and validation logic remain deterministic.

### Phase 2: Core Simulation

**Goal**: Keep puzzle creation, validation, and solved-state detection stable.

**Checkpoints**

- All transitions remain rule-driven.
- No rendering concern affects puzzle correctness.

### Phase 3: App Orchestration

**Goal**: Expose the compact puzzle state through a minimal hook and keep persistence in the app layer.

**Checkpoints**

- UI gets a single source of truth.
- App code does not duplicate constraint logic.

### Phase 4: UI Shell

**Goal**: Adapt the shared shell to the smaller Sudoku board without bloating the layout.

**Checkpoints**

- Touch and keyboard flows stay obvious.
- Responsive layout preserves legibility.

### Phase 5: WASM Integration

**Goal**: Add WASM only if solver or generator profiling shows a clear benefit.

**Checkpoints**

- Any acceleration path remains optional.
- JS fallback stays fully correct.

---

## Block-Fall Backlog

### Applicability

- Arcade stack fit: high.
- WASM fit: low to medium, depending on whether AI search, bag analysis, or simulation depth grows.
- Current posture: no current WASM surface found.

### Phase 1: Domain Contracts

**Goal**: Keep piece shapes, rotation, collision, gravity, and clear rules in domain code.

**Checkpoints**

- Piece placement is deterministic.
- Line clear logic remains pure.
- No UI state influences game physics.

### Phase 2: Core Simulation

**Goal**: Stabilize falling cadence, hold/preview, and fail-state detection.

**Checkpoints**

- Tick progression is deterministic.
- Lock, clear, and spawn behavior remain testable.

### Phase 3: App Orchestration

**Goal**: Expose the active board, queue, score, and level state through app hooks.

**Checkpoints**

- Orchestration remains thin.
- UI reads a snapshot, not mutable engine state.

### Phase 4: UI Shell

**Goal**: Move the playfield, HUD, and controls into the shared arcade shell.

**Checkpoints**

- The board stays visible and responsive.
- Control hints and status stay accessible.

### Phase 5: WASM Integration

**Goal**: Add WASM only if evaluation, simulation, or AI search becomes a proven bottleneck.

**Checkpoints**

- No premature accelerator is introduced.
- JS remains the baseline implementation.

---

## Vector-Assault Backlog

### Applicability

- Arcade stack fit: high.
- WASM fit: low to medium unless physics, enemy swarms, or targeting logic become costly.
- Current posture: no current WASM surface found.

### Phase 1: Domain Contracts

**Goal**: Keep movement, firing, collision, scoring, and enemy state in domain rules.

**Checkpoints**

- Combat state is deterministic.
- Movement and hit detection are rule-owned.
- No presentation code owns combat resolution.

### Phase 2: Core Simulation

**Goal**: Stabilize the main loop, spawn cadence, and fail/win state detection.

**Checkpoints**

- Same input/tick sequence yields the same outcome.
- Enemy and projectile interactions are deterministic.

### Phase 3: App Orchestration

**Goal**: Surface score, health, wave, and control state through the app layer.

**Checkpoints**

- The app layer remains orchestration only.
- Persistence and runtime setup stay outside the UI.

### Phase 4: UI Shell

**Goal**: Put the action HUD, status, and control hints onto the shared arcade shell.

**Checkpoints**

- The playfield remains the visual focus.
- Keyboard, gamepad, and focus handling stay explicit.

### Phase 5: WASM Integration

**Goal**: Add WASM only if profiling proves collision, pathing, or simulation cost is material.

**Checkpoints**

- No speculative accelerator is introduced.
- JS fallback remains the default.

---

## Definition of Done for This Backlog

- Every app has a domain/app/ui/WASM path described before implementation starts.
- Existing WASM surfaces stay fallback-safe and deterministic.
- Apps without WASM only get it when profiling proves value.
- Shared arcade UI primitives are used where they reduce duplication without changing game identity.
- Each app can be validated independently with its own package gate.
