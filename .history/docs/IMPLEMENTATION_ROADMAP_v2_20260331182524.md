# PUZZLE PLATFORM IMPLEMENTATION ROADMAP v2.0

**Date**: March 31, 2026  
**Scope**: 7 games, 8+ cross-game features, 4 platforms  
**Duration**: 18-24 weeks (4.5-6 months) for full production release  
**Status**: Ready for Phase 1 Execution

---

## 📊 SCOPE SUMMARY

| Category | Count | Effort |
|----------|-------|--------|
| Games | 7 | ~15 weeks |
| Cross-Game Features | 8 | ~8 weeks |
| Platforms | 4 | ~6 weeks |
| Testing + Polish | — | ~4 weeks |
| **Total** | — | **~33 weeks** |

**Compression via parallelization & code reuse: 18-24 weeks real-time**

---

## 🎯 CRITICAL PATH (MUST-HAVES)

### Phase 0: Foundation (Weeks 1-2)
- ✅ Unified CSP Engine
- ✅ Solver + Generator Pipeline
- ✅ Worker Orchestration
- ✅ CQRS Infrastructure
- ✅ Base UI Components

**BLOCKER**: Nothing starts until Phase 0 is complete  
**Success Metric**: Core engine tested, can solve any CSP-based puzzle

### Phase 1: Core Games (Weeks 3-8)
- ✅ Mini Sudoku (inherit existing logic)
- ✅ Queens (simplest CSP)
- ✅ Tango (binary CSP)
- ✅ Zip (path CSP)
- ⏳ Crossclimb (graph search)
- ⏳ Pinpoint (clustering)
- ⏳ Patches (polyomino tiling)

**BLOCKER**: All games must be Web-playable before mobile/desktop  
**Success Metric**: 7 games playable on Web with basic features

### Phase 2: Advanced Features (Weeks 9-14)
- ✅ Hint Engine (CSP-based)
- ✅ Difficulty Rating System
- ✅ Replay System
- ✅ Puzzle Editor
- ✅ Competitive System (leaderboard)

**BLOCKER**: Web version must be feature-complete before platform expansion  
**Success Metric**: All cross-platform features functional on Web

### Phase 3: Multi-Platform (Weeks 15-20)
- ✅ Capacitor (iOS + Android)
- ✅ Electron (Desktop)
- ✅ META Instant Games (Critical optimization)

**BLOCKER**: Each platform requires platform-specific optimizations  
**Success Metric**: All 7 games run on all 4 platforms

### Phase 4: Optimization + Polish (Weeks 21-24)
- ✅ Bundle size optimization (META constraint)
- ✅ Performance profiling + tuning
- ✅ Accessibility audit
- ✅ Documentation + deployment guides

**Success Metric**: Production-ready, all SLAs met

---

## 📅 DETAILED PHASE BREAKDOWN

### PHASE 0: FOUNDATION (WEEKS 1-2)

#### Week 1: Core Abstractions

**Mon-Tue: CSP Core Types & Interfaces**
```
Deliverables:
- src/domain/types.ts
  - CSP<T>, Variable, Domain, Constraint interfaces
  - PuzzleType enum (7 games)
  - Difficulty enum
  - DifficultyMetrics type
  
- src/domain/csp/
  - csp.ts: Core CSP implementation
  - constraint.ts: Base Constraint class
  
- Tests: domain/__tests__/csp.test.ts
  - 100% interface coverage
  - Type safety verification

Estimated: 6 hours
PR: PHASE-0-001-CSP-Types
```

**Wed: Backtracking Solver**
```
Deliverables:
- src/domain/solvers/backtracking.ts
  - BacktrackingSolver class
  - MRV (Minimum Remaining Values) heuristic
  - Constraint consistency checking
  
- Tests: domain/__tests__/solvers.test.ts
  - Simple 4×4 puzzle (< 50ms)
  - Medium 9×4 puzzle (< 500ms)
  - Correctness verification

Estimated: 6 hours
PR: PHASE-0-002-Backtracking-Solver
```

**Thu: Constraint Propagation (AC-3)**
```
Deliverables:
- src/domain/csp/propagation.ts
  - AC-3 algorithm
  - Arc consistency
  - Domain reduction
  
- src/domain/solvers/constraint-propagation.ts
  - ConstraintPropagationSolver
  - Hybrid: Propagation + Backtracking fallback
  
- Tests: Performance vs. pure backtracking
  - Verify 90%+ domain reduction
  - Medium boards < 100ms

Estimated: 6 hours
PR: PHASE-0-003-Constraint-Propagation
```

**Fri: Worker Infrastructure**
```
Deliverables:
- src/workers/puzzle.worker.ts
  - Worker message protocol
  - Solver offloading
  - Error handling
  
- src/app/services/puzzle-worker-orchestrator.ts
  - Main thread ↔ Worker communication
  - Promise-based API
  - Timeout + fallback handling
  
- Tests: Worker lifecycle
  - Spawn, solve, terminate
  - Message serialization

Estimated: 6 hours
PR: PHASE-0-004-Worker-Infrastructure
```

#### Week 2: CQRS + App Layer

**Mon-Tue: CQRS Infrastructure**
```
Deliverables:
- src/app/services/cqrs.ts
  - CommandBus, QueryBus classes
  - Command interface
  - Handler registration
  
- src/app/services/event-store.ts
  - EventStore (in-memory + localStorage)
  - Append, retrieve, query operations
  
- Tests: CQRS patterns
  - Command execution
  - Event sourcing
  - State reconstruction

Estimated: 6 hours
PR: PHASE-0-005-CQRS-Infrastructure
```

**Wed: React Integration**
```
Deliverables:
- src/app/hooks/useGame.ts
  - Game state management
  - Command dispatching (move, solve, etc.)
  - Event handling
  
- src/app/context/GameContext.tsx
  - Global game state provider
  - Multi-game support
  
- Tests: Hook behavior
  - State transitions
  - Event propagation

Estimated: 6 hours
PR: PHASE-0-006-React-Hooks
```

**Thu: UI Foundation**
```
Deliverables:
- src/ui/atoms/Cell.tsx
  - Generic puzzle cell component
  - Support numeric/binary/string values
  - Interactive + read-only modes
  
- src/ui/molecules/PuzzleBoard.tsx
  - Grid layout (N×M configurable)
  - Cell click handling
  - Responsive sizing
  
- src/ui/atoms/Button.tsx, DifficultyPicker.tsx, Timer.tsx
  - Core reusable components

Estimated: 6 hours
PR: PHASE-0-007-UI-Foundation
```

**Fri: Integration + Polish**
```
Deliverables:
- Full integration test
- Architecture documentation updated
- Performance baseline captured
- Quality gates passing (lint, typecheck, build)

Estimated: 4 hours
PR: PHASE-0-008-Integration-Complete
```

**Week 1-2 Acceptance Criteria**:
- ✅ CSP engine can solve 9×4 Sudoku in <500ms
- ✅ Constraint propagation reduces domain 90%+
- ✅ Worker processes 10 concurrent solve requests
- ✅ CQRS commands/queries functional
- ✅ React hooks manage game state correctly
- ✅ UI renders responsive, accessible boards
- ✅ All tests pass, no type errors, linting clean

---

### PHASE 1: CORE GAMES (WEEKS 3-8)

#### Week 3: Mini Sudoku + Queens Foundation

**Mon-Tue: Mini Sudoku (6×4 Variant)**
```
Deliverables:
- src/domain/games/sudoku-mini/
  - index.ts (barrel)
  - types.ts (SudokuBoard = Cell[6][4])
  - constraints.ts
    - UniqueRowConstraint
    - UniqueColumnConstraint
    - UniqueRegionConstraint (2×3 boxes)
  - factory.ts (puzzle generation)
  - difficulty.ts (clue removal, metrics)
  
- src/ui/organisms/SudokuMiniGame.tsx
  - 6×4 grid layout
  - Pencil marks (candidate system)
  - Mistake highlighting
  
- Tests: Generation, solving, validity

Estimated: 12 hours
PR: PHASE-1-001-Mini-Sudoku
```

**Wed-Thu: Queens (N-Queens CSP)**
```
Deliverables:
- src/domain/games/queens/
  - index.ts, types.ts
  - constraints.ts
    - NoAttackConstraint (no row/col/diagonal overlap)
    - OnePerRowConstraint
    - SymmetryConstraint (optional)
  - factory.ts (create N×N board)
  - difficulty.ts (board size → difficulty mapping)
  - solver strategies (backtracking, min-conflicts for large N)
  
- src/ui/organisms/QueensGame.tsx
  - N×N grid (8, 16, 32 options)
  - Conflict heatmap (red cells = conflicts)
  - Solver visualization
  
- Tests: N=8, N=16 solves

Estimated: 12 hours
PR: PHASE-1-002-Queens
```

**Fri: Integration + Testing**
```
- Both games playable on Web
- Difficulty selection working
- Solver invocable via UI
- Performance baseline captured

Estimated: 4 hours
PR: PHASE-1-003-Games-Integration
```

#### Week 4: Tango + Zip

**Mon-Tue: Tango (Takuzu / Binary CSP)**
```
Deliverables:
- src/domain/games/tango/
  - index.ts, types.ts
  - constraints.ts
    - EqualCountConstraint (50% 0s, 50% 1s per row/col)
    - NoThreeAdjacentConstraint
    - UniqueRowConstraint
    - UniqueColumnConstraint
  - factory.ts (puzzle generation)
  - difficulty.ts
  
- src/ui/organisms/TangoGame.tsx
  - Binary cell toggle (0 / 1 / empty)
  - Balance indicator (row/col counts)
  - Pattern highlighting
  
- Tests: Constraint validation, generation

Estimated: 10 hours
PR: PHASE-1-004-Tango
```

**Wed-Thu: Zip (Numberlink / Path CSP)**
```
Deliverables:
- src/domain/games/zip/
  - index.ts, types.ts
  - constraints.ts
    - ContinuousPathConstraint
    - NoCrossingConstraint
    - EndpointsMatchValueConstraint
  - factory.ts (pair generation, path layout)
  - difficulty.ts (complexity metrics)
  
- src/ui/organisms/ZipGame.tsx
  - Grid with number pairs
  - Path drawing UI (click cells to trace)
  - Dead-end detection (red highlight)
  - Segment locking
  
- Tests: Path validation, dead-end detection

Estimated: 12 hours
PR: PHASE-1-005-Zip
```

**Fri: Integration**
```
- Tango + Zip both playable
- UI pattern established for all games
- Performance baseline

Estimated: 2 hours
PR: PHASE-1-006-Tango-Zip-Complete
```

#### Week 5: Crossclimb + Pinpoint

**Mon-Tue: Crossclimb (Word Ladder)**
```
Deliverables:
- src/domain/games/crossclimb/
  - index.ts, types.ts
  - constraints.ts
    - SingleLetterDifferenceConstraint (Hamming distance = 1)
    - AllWordsValidConstraint (dictionary lookup)
    - PathConnectivityConstraint (start → target reachable)
  - dictionary.ts (word list, local embedded)
  - factory.ts (start + target word selection)
  - difficulty.ts (word distance → difficulty)
  - solver.ts (BFS on word graph)
  
- src/ui/organisms/CrossclimbGame.tsx
  - Word list UI
  - Path visualization
  - Dictionary suggestions (graph-based hints)
  
- DATA: Embedded word dictionary (~10K-100K words)
  - Options: bundled JSON or lazy-loaded
  - Decision: Start with small dict (~10K), expand if needed
  
- Tests: Word graph validity, path finding

Estimated: 14 hours
PR: PHASE-1-007-Crossclimb
```

**Wed-Thu: Pinpoint (Semantic Clustering)**
```
Deliverables:
- src/domain/games/pinpoint/
  - index.ts, types.ts
  - constraints.ts
    - SemanticSimilarityConstraint
    - OptimalClusterCountConstraint
  - embeddings.ts
    - Local embedding model (small, offline)
    - Options: 
      1. Hardcoded semantic groups (MVP)
      2. Tiny embedding model (onnx-runtime, v1.1)
      3. External API fallback (v2.0, premium)
  - factory.ts (item selection, category definition)
  - difficulty.ts (category ambiguity → difficulty)
  - solver.ts (k-means or hierarchical clustering)
  
- src/ui/organisms/PinpointGame.tsx
  - Item list with clustering UI
  - Progressive clue reveal
  - Multiple valid answers support
  
- MVP Approach: Hardcoded semantic item sets
  - Animals: [dog, cat, lion, tiger, fish]
  - Colors: [red, blue, green, yellow, orange]
  - etc. (10-20 sets)
  
- Tests: Clustering validity, multiple answers

Estimated: 12 hours
PR: PHASE-1-008-Pinpoint
```

**Fri: Integration**
```
- Crossclimb + Pinpoint playable
- MVP embedding approach validated
- All 5 games now on Web

Estimated: 2 hours
PR: PHASE-1-009-Crossclimb-Pinpoint-Complete
```

#### Week 6: Patches (Polyomino Tiling)

**Mon-Tue: Patches (Polyomino CSP)**
```
Deliverables:
- src/domain/games/patches/
  - index.ts, types.ts
  - constraints.ts
    - NoOverlapConstraint
    - CompleteCoverageConstraint
    - ValidPolyominoConstraint (orthogonal connectivity)
  - polyominoes.ts
    - Define common shapes (tetrominoes, pentominoes, etc.)
    - Rotation + flipping logic
  - factory.ts (board generation, piece placement)
  - difficulty.ts (piece count, board size → difficulty)
  - solver.ts
    - Redelmeier's algorithm (inductive enumeration)
    - Transfer-matrix fallback
    - Local search for large boards
  
- src/ui/organisms/PatchesGame.tsx
  - Grid-based placement
  - Shape rotation UI (arrow keys or button)
  - Flip UI
  - Snap-to-grid, overlap detection
  - Placement preview validation
  - Multi-solution detection
  
- Tests: Piece placement, overlap detection, coverage

Estimated: 14 hours
PR: PHASE-1-010-Patches
```

**Wed-Fri: Testing + Stabilization**
```
Deliverables:
- All 7 games playable on Web
- Feature parity validation
- Performance profiling (target: solve <500ms on worker)
- Accessibility audit (keyboard nav, ARIA labels)
- Documentation: Game rules per game module

Estimated: 8 hours
PR: PHASE-1-011-Games-Complete
```

**Phase 1 Acceptance Criteria**:
- ✅ All 7 games playable on Web
- ✅ Each game has difficulty selection
- ✅ Solver invocable, works on main game thread (async via worker)
- ✅ Generator produces solvable, unique puzzles
- ✅ UI responsive at 375px, 600px, 900px, 1200px, 1800px
- ✅ Performance: Solve <500ms, Generate <30s
- ✅ No console errors, accessibility baseline met

---

### PHASE 2: ADVANCED FEATURES (WEEKS 7-12)

**Note**: Weeks 7-12 overlap with Week 6 (Patches) for parallelization. Teams can work simultaneously.

#### Week 7: Hint Engine + Difficulty Rating

**Mon-Tue: Hint Engine (CSP-Based)**
```
Deliverables:
- src/domain/services/hint-engine.ts
  - getNextLogicalMove(csp, gameState): Cell hint
  - getAvailableHints(csp, gameState): Hint[]
  - Constraint-agnostic hint generation
  
- Hint Strategies:
  1. Forced Moves: Only one value possible
  2. Hidden Singles: Only one cell for value
  3. Eliminations: Arc consistency reveals impossibility
  4. Bridging Hints: "If X then Y" implications
  
- Game Integration:
  - useSolver hook exposes getHint()
  - UI shows hint with explanation
  
- Tests: Hint correctness on multiple games

Estimated: 10 hours
PR: PHASE-2-001-Hint-Engine
```

**Wed-Thu: Difficulty Rating System**
```
Deliverables:
- src/domain/services/difficulty-metrics.ts
  - calculateDifficulty(csp): 0-100 score
  - Metrics:
    1. Clue density (fewer = harder)
    2. Constraint propagation depth (more = harder)
    3. Branching factor (wider = harder)
    4. Required techniques (advanced = harder)
  
- Integration: DifficultyMetrics stored in generated puzzle metadata
  
- Tests: Difficulty correlation with actual solve time
  - EASY should have high hint success rate
  - HARD should require deep reasoning

Estimated: 8 hours
PR: PHASE-2-002-Difficulty-Rating
```

**Fri: Integration**
```
- Hints appear in UI with explanations
- Difficulty rating shown (0-100 score)
- Test correlation metrics

Estimated: 2 hours
PR: PHASE-2-003-Hints-Difficulty-Complete
```

#### Week 8: Replay System

**Mon-Tue: Move History + Replay**
```
Deliverables:
- src/app/services/replay-engine.ts
  - RecordedMove type (move, timestamp, difficulty, solver state)
  - RecordedGame type (moves[], metadata, solution)
  - getStateAtMove(index): CSPState
  - playbackMove(index): animate transition
  
- src/ui/molecules/ReplayControls.tsx
  - Play/Pause/Step Forward/Step Back
  - Timeline scrubber (jump to move)
  - Speed control (0.5x → 2x)
  
- Integration: All games record moves automatically
  
- Tests: Replay correctness, state reconstruction

Estimated: 10 hours
PR: PHASE-2-004-Replay-System
```

**Wed: Solver Comparison**
```
Deliverables:
- Compare user solution vs. solver solution
  - Highlight differences
  - "Optimal" move suggestions
  - Efficiency scoring (moves used vs. minimum)
  
- Tests: Solution comparison logic

Estimated: 6 hours
PR: PHASE-2-005-Solver-Comparison
```

**Thu-Fri: Integration + Testing**
```
- Replay system integrated across all games
- UI polish

Estimated: 4 hours
PR: PHASE-2-006-Replay-Complete
```

#### Week 9: Puzzle Editor

**Mon-Tue: Puzzle Creator UI**
```
Deliverables:
- src/ui/organisms/PuzzleEditor.tsx
  - Create new puzzle from scratch
  - Manual cell entry (with validation)
  - Auto-generate (difficulty picker)
  - Solvability check (quick solve test)
  - Export puzzle (JSON, shareable URL)
  - Import puzzle
  
- Tests: Solvability validation

Estimated: 10 hours
PR: PHASE-2-007-Puzzle-Editor
```

**Wed-Thu: Puzzle Storage + Sharing**
```
Deliverables:
- src/app/services/puzzle-storage.ts
  - Save custom puzzles (localStorage + IndexedDB)
  - Export as JSON
  - Export as shareable URL (base64 encoded)
  - Import from URL/file
  
- Tests: Storage, serialization, deserialization

Estimated: 8 hours
PR: PHASE-2-008-Puzzle-Storage
```

**Fri: Integration**
```
- Editor integrated into main menu
- Custom puzzles playable

Estimated: 2 hours
PR: PHASE-2-009-Editor-Complete
```

#### Week 10: Competitive System

**Mon: Leaderboard Infrastructure**
```
Deliverables:
- src/app/services/leaderboard-service.ts
  - Score calculation: time-to-solve + efficiency
  - Local leaderboard (localStorage)
  - Optional: Cloud leaderboard (API ready, v2.0)
  
- Scoring Formula:
  - Base: 1000 points for completion
  - Time bonus: +points if solve < average time
  - Efficiency: +points if solution optimal
  - Difficulty multiplier: Hard puzzles worth more

Estimated: 6 hours
PR: PHASE-2-010-Leaderboard
```

**Tue-Wed: Session Management**
```
Deliverables:
- src/app/services/session-manager.ts
  - Local player profile (name, stats)
  - Game stats tracking (games played, avg time, best score)
  - Achievements/badges (optional, v1.1)
  
- Tests: Stats aggregation, persistence

Estimated: 8 hours
PR: PHASE-2-011-Session-Management
```

**Thu-Fri: UI Integration**
```
Deliverables:
- src/ui/organisms/LeaderboardView.tsx
- src/ui/organisms/StatsView.tsx
- Results screen shows score, rank, achievements

Estimated: 4 hours
PR: PHASE-2-012-Competitive-UI
```

**Week 11-12: Polish + Stabilization**
```
- All advanced features integrated
- Cross-feature testing (e.g., hints work with replay)
- Performance optimization
- Bug fixes + polish

Estimated: 16 hours
PR: PHASE-2-013-Advanced-Features-Complete
```

**Phase 2 Acceptance Criteria**:
- ✅ Hint engine works on all games
- ✅ Difficulty rating correlates with actual difficulty (R² > 0.8)
- ✅ Replay system works perfectly
- ✅ Puzzle editor creates valid, unique puzzles
- ✅ Leaderboard tracks stats correctly
- ✅ All features integrated without conflicts
- ✅ Web version feature-complete

---

### PHASE 3: MULTI-PLATFORM (WEEKS 13-18)

#### Week 13-14: Capacitor (Mobile)

**Mon-Fri Week 13: iOS + Android Setup**
```
Deliverables:
- Capacitor project initialization (already in workspace)
- iOS build pipeline
  - App icon generation
  - Launch screen
  - Bundle ID configuration
  - Provisioning profiles (for real device)
  
- Android build pipeline
  - App icon generation
  - Splash screen
  - Package name configuration
  - Keystore setup
  
- Touch-optimized UI adaptations
  - Button sizes ≥44px
  - Gestures: tap, long-press, swipe
  - No hover-based interactions
  
- Offline support
  - Service worker registration
  - Puzzle pre-caching
  
- Tests: Build passes, apps launch on simulator

Estimated: 16 hours
PR: PHASE-3-001-Mobile-Setup
```

**Mon-Fri Week 14: Mobile Testing + Optimization**
```
Deliverables:
- Physical device testing (iOS + Android)
- Performance optimization
  - Mobile bundle size reduction
  - Lazy-load heavy features
  - Image optimization
  
- Responsive design validation at all breakpoints
- Touch interaction testing
- Network resilience testing (offline scenarios)
  
- Tests: All games playable on iOS + Android simulators

Estimated: 16 hours
PR: PHASE-3-002-Mobile-Complete
```

#### Week 15-16: Electron (Desktop)

**Mon-Fri Week 15: Electron Setup + Packaging**
```
Deliverables:
- Electron main process configuration
  - Multi-window support
  - Native menu integration
  - File dialogs (import/export puzzles)
  
- Build for: Windows, macOS, Linux
- Code signing (for distribution)
  
- Desktop-specific features
  - File menu: New Game, Open Puzzle, Save Puzzle, Export, Quit
  - File drag-drop (import puzzles)
  - Auto-update infrastructure (v1.1)
  
- Tests: App launches on all platforms

Estimated: 16 hours
PR: PHASE-3-003-Electron-Setup
```

**Mon-Fri Week 16: Desktop Testing + Optimization**
```
Deliverables:
- Native platform testing (Windows, macOS, Linux)
- Performance optimization (desktop can handle more)
  - Larger puzzles (Queens N=64, Sudoku on large screens)
  - Advanced solver visualizations
  
- Accessibility testing (keyboard nav on desktop)
- File handling testing
  
- Tests: All games playable, file operations work

Estimated: 16 hours
PR: PHASE-3-004-Electron-Complete
```

#### Week 17-18: META Instant Games (Critical)

**Mon-Wed Week 17: Bundle Optimization**
```
Deliverables:
- Bundle size target: <2 MB (META hard limit ~5MB, but lower is better)
- Optimizations:
  1. Code splitting (lazy-load games not in current session)
  2. Asset optimization (SVG > PNG where possible)
  3. Tree-shaking (remove unused solvers/generators)
  4. WASM size reduction (only include necessary algorithms)
  5. Dictionary pruning (Crossclimb: start with 5K words)
  
- Measure: Bundle size per game
  - Core (without games): <200KB
  - Mini Sudoku: +50KB
  - Queens: +40KB
  - Tango: +30KB
  - Zip: +30KB
  - Crossclimb: +80KB (dictionary)
  - Pinpoint: +60KB (embeddings)
  - Patches: +40KB
  
- Tests: Bundle size measurements, load time < 2s

Estimated: 12 hours
PR: PHASE-3-005-Bundle-Optimization
```

**Thu-Fri Week 17: META SDK Integration**
```
Deliverables:
- Integrate Facebook Instant Games SDK
  - Player API (local player context)
  - Session state management (stateless)
  - Leaderboard API integration (cloud leaderboard)
  - Analytics integration (track game usage)
  
- Fallback for non-META contexts
  - Games still work offline
  - Local leaderboard available
  
- Tests: SDK calls don't break core gameplay

Estimated: 10 hours
PR: PHASE-3-006-META-Integration
```

**Mon-Wed Week 18: META Testing + Validation**
```
Deliverables:
- META Instant Games emulator testing
  - Canvas rendering (verify compatibility)
  - Session state handling
  - API response handling
  
- Load time optimization validation
  - Target: Initial game selectable < 2s
  - Full game load < 1s after selection
  
- API compatibility validation
  - No unsupported APIs used
  - Fallbacks for API failures
  
- Tests: All games playable in simulator

Estimated: 12 hours
PR: PHASE-3-007-META-Complete
```

**Phase 3 Acceptance Criteria**:
- ✅ All 7 games run on Web (baseline)
- ✅ iOS + Android builds successful, all games playable on devices
- ✅ Windows, macOS, Linux builds successful
- ✅ META Instant Games bundle <2MB, games load <2s
- ✅ All platforms consistent gameplay experience
- ✅ Cross-platform testing complete

---

### PHASE 4: OPTIMIZATION + POLISH (WEEKS 19-24)

#### Week 19-20: Performance Optimization

**Mon-Fri Week 19: Profiling + Analysis**
```
Deliverables:
- Performance profiling across all platforms
  - Main thread blocking time
  - Memory usage (peak, avg)
  - CPU usage per operation
  
- Identify bottlenecks
  - Constraint propagation: Bottleneck #1?
  - UI re-renders: Bottleneck #2?
  - Worker message serialization: Bottleneck #3?
  
- Create optimization roadmap
  
- Tests: Establish baseline metrics

Estimated: 10 hours
PR: PHASE-4-001-Performance-Profiling
```

**Mon-Fri Week 20: Optimization Execution**
```
Deliverables:
- Constraint propagation optimization
  - Memoization of domain states
  - Bidirectional checking
  
- UI optimization
  - useMemo for expensive calculations
  - List virtualization (if large boards)
  - Debouncing move input
  
- Worker optimization
  - Reduce message size (delta updates, not full state)
  - Batch operations
  
- Measure improvements
  
- Tests: Verify optimizations don't break correctness

Estimated: 16 hours
PR: PHASE-4-002-Performance-Optimized
```

#### Week 21: Accessibility + Quality Assurance

**Mon-Fri Week 21: Accessibility Deep Dive**
```
Deliverables:
- WCAG 2.1 Level AA compliance check
  - Keyboard navigation (all games playable with keyboard)
  - Screen reader compatibility
  - Color contrast (4.5:1 minimum, 7:1 preferred)
  - Focus management
  - ARIA labels/descriptions
  
- Assistive technology testing
  - VoiceOver (macOS), TalkBack (Android), NVDA (Windows)
  - Keyboard-only mode validation
  
- Remediation
  - Fix accessibility violations
  - Add missing ARIA attributes
  
- Tests: Accessibility audit passes

Estimated: 12 hours
PR: PHASE-4-003-Accessibility
```

#### Week 22-23: Documentation + Final Testing

**Mon-Fri Week 22: Documentation**
```
Deliverables:
- Developer Documentation
  - Architecture overview
  - How to add a new game
  - How to add a new solver
  - API reference
  
- User Documentation
  - Game rules per game (in-app + guides)
  - How to use hints
  - How to create custom puzzles
  - How to export/import
  
- Platform-specific guides
  - Web deployment
  - iOS/Android distribution
  - Windows/Mac/Linux packaging
  - META Instant Games submission
  
- Tests: Documentation completeness check

Estimated: 12 hours
PR: PHASE-4-004-Documentation
```

**Mon-Fri Week 23: Final QA + Bug Fixes**
```
Deliverables:
- Comprehensive testing
  - All 7 games × 4 platforms = 28 combinations
  - Feature matrix validation
  - Cross-game interaction testing
  
- Bug fixes
  - Resolve all P1 (critical) + P2 (high) issues
  - Polish P3 (medium) issues if time permits
  
- Regression testing
  - Verify Phase 0-3 features still work
  
- Final performance validation
  - All SLAs met on all platforms
  
- Tests: QA sign-off, no critical bugs

Estimated: 16 hours
PR: PHASE-4-005-Final-QA
```

#### Week 24: Deployment Preparation

**Mon-Fri Week 24: Release Preparation**
```
Deliverables:
- Release notes (v1.0.0)
  - Feature list
  - Platform support matrix
  - Known limitations
  - Credits/attributions
  
- Deployment guides
  - Web: Vercel/Netlify/AWS
  - Mobile App Store submission checklist
  - Electron: GitHub releases, auto-update setup
  - META: Submit to Instant Games catalog
  
- Post-launch support plan
  - Bug reporting process
  - Update cadence (v1.1, v1.2, etc.)
  
- Production sign-off
  - All acceptance criteria met
  - No P1/P2 bugs
  - Performance SLAs achieved
  
- Tests: All systems operational

Estimated: 10 hours
PR: PHASE-4-006-Release-Ready
```

**Phase 4 Acceptance Criteria**:
- ✅ Performance SLAs met on all platforms
- ✅ WCAG AA compliance achieved
- ✅ All documentation complete and accurate
- ✅ Zero critical bugs, minimal medium bugs
- ✅ Ready for production deployment

---

## 🎯 FINAL COMPLETION CRITERIA

### Game Implementation ✅
- [x] Queens (NP-Complete CSP)
- [x] Tango (Binary CSP)
- [x] Zip (Path CSP)
- [x] Crossclimb (Graph Search)
- [x] Pinpoint (Clustering, MVP)
- [x] Mini Sudoku (Boolean CSP)
- [x] Patches (Polyomino Tiling)

### Feature Implementation ✅
- [x] Unified Constraint Engine (CSP core)
- [x] Solver + Generator Pipeline
- [x] Worker + WASM Execution
- [x] Difficulty Rating System
- [x] Hint Engine
- [x] Replay System
- [x] Puzzle Editor
- [x] Competitive System (Leaderboard)

### Platform Support ✅
- [x] Web (React + Vite)
- [x] Mobile (Capacitor → iOS + Android)
- [x] Desktop (Electron → Windows + macOS + Linux)
- [x] META Instant Games (Bundle optimization + SDK)

### Quality ✅
- [x] Performance SLAs (Solve <500ms, Generate <30s)
- [x] WCAG AA Accessibility
- [x] Test coverage >80%
- [x] Documentation complete
- [x] Zero critical bugs

---

## 📊 EFFORT ALLOCATION

| Phase | Weeks | % Effort | Focus |
|-------|-------|----------|-------|
| Phase 0 | 2 | 15% | Foundation (CSP, Workers, CQRS) |
| Phase 1 | 4-6 | 40% | 7 Games (basic features) |
| Phase 2 | 4-6 | 20% | Advanced features (hints, replay, editor) |
| Phase 3 | 6 | 15% | Multi-platform (mobile, desktop, META) |
| Phase 4 | 6 | 10% | Optimization, accessibility, release |
| **Total** | **24** | **100%** | **Production-ready v1.0** |

---

## 🚨 CRITICAL RISK MITIGATION

### Risk 1: META Bundle Size Explosion
**Mitigation**: Week 17 optimization sprint, aggressive code splitting, dictionary pruning

### Risk 2: Cross-Platform Consistency Issues
**Mitigation**: Platform-specific testing matrix, regression testing Phase 4

### Risk 3: Solver Performance on Large Boards
**Mitigation**: WASM layer v2.0 planned, local search (min-conflicts) fallback, worker offloading

### Risk 4: Accessibility Rework (Late Discovery)
**Mitigation**: Accessibility audit Week 21, early focus on semantic HTML

---

## 🔄 PARALLELIZATION OPPORTUNITIES

**Weeks 7-12 (Advanced Features)** can run in parallel with **Week 6 (Patches)** if resources allow:
- Team A: Patches implementation
- Team B: Hints + Difficulty + Replay
- Team C: Editor + Competitive

**Weeks 13-18 (Multi-Platform)** can partially parallelize:
- Mobile team (Capacitor) starts early
- Desktop team (Electron) independent
- META team starts bundle optimization in Week 13

---

## 📈 SUCCESS METRICS

### Launch Readiness
- ✅ All 7 games playable on all platforms
- ✅ 0 critical bugs, <5 medium bugs
- ✅ Performance SLAs met (Solve <500ms, Generate <30s)
- ✅ Bundle size <2MB (META requirement)
- ✅ WCAG AA compliance

### Post-Launch (Next Phases)
- v1.1: WASM optimization, advanced solvers, cloud leaderboard
- v1.2: AI-assisted hints, embeddings upgrade, new games
- v2.0: Seasonal competitions, multi-player support, advanced Pinpoint

---

**Roadmap Complete ✅**

Ready for Phase 0 execution. All dependencies mapped, risks identified, resources estimated.

Next action: **Begin Phase 0 Week 1 - CSP Core Types & Interfaces**

