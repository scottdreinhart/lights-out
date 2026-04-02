# Phase 4-7 Implementation Plan: Remaining Decomposition

**Date**: April 1, 2026  
**Status**: Planning Complete, Ready for Execution  
**Total Estimated Effort**: 6-10 hours across 4 phases

---

## Executive Summary

After Phases 1-3 completed consolidation of custom hooks and shared contexts, remaining work focuses on:

| Phase | Focus                   | Apps Affected | Est. Time | Priority |
| ----- | ----------------------- | ------------- | --------- | -------- |
| **4** | Service consolidation   | 3 apps        | 1-2 hrs   | LOW      |
| **5** | UI component extraction | 39 apps       | 3-4 hrs   | MEDIUM   |
| **6** | Custom hook alignment   | 2 apps        | 1-2 hrs   | MEDIUM   |
| **7** | Game-engine packages    | 32 apps       | 2-3 hrs   | HIGH     |

---

## Phase 4: Service Consolidation (1-2 hours)

### Current State

Only 3 apps have custom services:

- **lights-out**: crashLogger, haptics, sounds, storageService
- **nim**: storageService (already using @games/storage-utils internally)
- **tictactoe**: aiEngine

### Analysis

**lights-out services**:

- `crashLogger.ts` — error tracking (platform-specific)
- `haptics.ts` — device vibration API (Capacitor feature)
- `sounds.ts` — sound effect library (game-specific audio)
- `storageService.ts` — already migrated to use @games/storage-utils

**nim services**:

- `storageService.ts` — already refactored to use @games/storage-utils (Phase 2 P3)

**tictactoe services**:

- `aiEngine.test.ts` — test fixture (remove)
- `aiEngine.ts` — minimax implementation (game-specific algorithm)

### Opportunities

**Shared Packages to Create**:

1. `@games/crash-logger` — Centralized error tracking (once, reuse in all)
2. `@games/haptics` — Capacitor vibration API wrapper (once, reuse mobiles)
3. `@games/audio-effects` — Sound effect coordination (generic sound scheduler)

**Decision**:

- Create `@games/crash-logger` + `@games/haptics` (reusable frameworks)
- Game-specific audio remains in `sounds.ts` per app (too varied)
- AI engines remain game-specific (domain core logic)

### Execution Plan

1. **Create @games/crash-logger** (1 app → shared)
   - Extract lights-out's crashLogger.ts to package
   - Add to all apps' tsconfig.json paths
   - Migrate lights-out to re-export

2. **Create @games/haptics** (1 app → shared)
   - Extract lights-out's haptics.ts to package
   - Add to Capacitor-enabled apps (mobile targets)

3. **Audit ai engines** (tictactoe, 32 others)
   - These are game-specific, domain-dependent
   - DO NOT consolidate unless game type is identical

---

## Phase 5: UI Component Extraction (3-4 hours)

### Current State

**397 total component files**:

- 81 atoms (small building blocks)
- 97 molecules (composite atoms)
- 93 organisms (page-level features)

### Analysis

**Common Atom Opportunities**:

- Buttons (40+ variations across apps)
- Input fields (20+ variations)
- Cards (15+ variations)
- Icons (reusable icon sets)
- Badges/Labels (10+ variations)

**Common Molecule Opportunities**:

- Form groups (Label + Input pairs)
- Menu items (standardized menu entry patterns)
- Dialog footers (OK/Cancel button patterns)
- List items (standardized list entry patterns)
- Tab bars (tab navigation)

**Common Organism Opportunities**:

- Game boards (grid-based layouts—extract primitives)
- Settings screens (standardized modal layouts)
- Menu screens (hamburger menu + option list)
- Results tables (standardized data display)

### Opportunities

**Tier 1 (High Reuse, Low Complexity)**:

1. `@games/ui-button` — Extract Button atom used in 30+ apps
2. `@games/ui-input` — Extract Input atom used in 20+ apps
3. `@games/ui-card` — Extract Card atom used in 15+ apps
4. `@games/ui-menu` — Menu molecule used in hamburger patterns

**Tier 2 (Medium Reuse, Medium Complexity)**: 5. `@games/ui-form-group` — Label + Input composite 6. `@games/ui-modal` — Modal dialog frame 7. `@games/ui-tabs` — Tab navigation bar

**Tier 3 (Specialized, Domain-Specific)**:

- Game boards → Too varied (chess board ≠ tic-tac-toe board)
- Settings screens → Too customized per game
- Results screens → Vary by game type

### Execution Plan

1. **Audit all 397 component files** (1 hour)
   - Categorize by similarity
   - Flag duplicated implementations
   - Document reuse opportunities

2. **Create Tier 1 shared components** (1.5 hours)
   - `@games/ui-button` from most common pattern
   - `@games/ui-input` from most common pattern
   - `@games/ui-card` from most common pattern
   - `@games/ui-menu` from hamburger menu pattern

3. **Migrate 39 apps to use shared Button** (0.5-1 hour)
   - Update imports
   - Delete local Button implementations
   - Keep app-specific variants if needed

4. **Repeat for Input, Card, Menu** (1-1.5 hours)

5. **Create Tier 2 molecules** (0.5 hours, optional)

### Risk Mitigation

- Preserve app-specific variants via props (don't force identical UI)
- Use CSS module overrides for app branding
- Keep theme customization per app

---

## Phase 6: Custom Hook Alignment (1-2 hours)

### Current State

Only 2 apps have significant custom hooks:

- **lights-out**: 6 hooks (useCapacitor, useElectron, useGame, useSoundEffects, useStats, useTheme)
- **nim**: 15 hooks (complex hooks including useAppLifecycle, useWasmParticles, etc.)

### Analysis

**lights-out hooks**:

- `useCapacitor()` — Platform detection (reusable)
- `useElectron()` — Electron API integration (reusable)
- `useGame()` — Game state orchestration (game-specific)
- `useSoundEffects()` — Audio playback (app-specific variant)
- `useStats()` — Stats management (using shared @games/stats-utils likely)
- `useTheme()` — Theme management (already shared via @games/theme-context in Phase 3)

**nim hooks**:

- `useAppLifecycle()` — App lifecycle events (reusable across platforms)
- `useGame()` — Complex game orchestration (nim-specific)
- `usePlatform()` / `useCapacitor()` / `useIonicPlatform()` — Platform detection (consolidate!)
- `useWasmParticles()` — WASM particle effects (specialized, nim-specific)
- Others: Complex game-specific logic

### Opportunities

**Shared Hooks to Extract**:

1. `@games/use-platform` — Unified platform detection
   - Consolidate useCapacitor, useElectron, useIonicPlatform, usePlatform
   - Provide enum: 'web' | 'electron-posix' | 'electron-win32' | 'capacitor-ios' | 'capacitor-android'

2. `@games/use-app-lifecycle` — App lifecycle hooks
   - Already exists? (check if duplicate with existing)

### Execution Plan

1. **Audit custom hooks in lights-out and nim** (30 min)
   - Identify commonality
   - Flag reusable patterns

2. **Create @games/use-platform** (30 min)
   - Consolidate platform detection logic
   - Migrate lights-out and nim to use it

3. **Document game-specific hooks** (30 min)
   - useGame, useWasmParticles, etc. stay per-app
   - Mark as intentionally game-specific

---

## Phase 7: Game-Engine Packages (2-3 hours)

### Current State

**32 apps have game-engine domain files**:

- Almost 100% have `ai.ts` (AI/computer player decision logic)
- Almost 100% have `rules.ts` (game rule enforcement)
- Some have `constraints.ts` (puzzle constraints)

### Analysis

**Game Family Patterns**:

| Family                  | Apps                                                        | Common Logic                                 | Candidates                      |
| ----------------------- | ----------------------------------------------------------- | -------------------------------------------- | ------------------------------- |
| **Turn-based 2-player** | tic-tac-toe, checkers, reversi, connect-four, mancala, etc. | Move validation, turn cycling, win detection | `@games/turn-based-game-engine` |
| **Card games**          | war, go-fish, blackjack (if implemented)                    | Card deck, shuffle, deal, card values        | `@games/card-game-engine`       |
| **Number puzzles**      | sudoku variants, mini-sudoku                                | Constraint solving, validation, generation   | `@games/puzzle-engine`          |
| **AI decision-making**  | ALL 32                                                      | Minimax, heuristics, difficulty levels       | `@games/ai-framework`           |

### Opportunities

**Tier 1 (Highest Reuse)**:

1. `@games/ai-framework` — Generic AI scaffolding
   - Minimax template
   - Alpha-beta pruning utilities
   - Difficulty scaling (easy/medium/hard)
   - Heuristic scoring interface
   - **Impact**: Reduce 32 apps' `ai.ts` implementations by 30-50%

2. `@games/turn-based-engine` — Turn-based game mechanics
   - Move validation cycle
   - Turn state management
   - Win/draw/loss detection
   - **Impact**: Reduce 15+ apps' `rules.ts` by 40%

**Tier 2 (Medium Reuse)**: 3. `@games/puzzle-constraints` — Sudoku-variant constraint system

- Constraint definitions
- Validation framework
- **Impact**: Reduce sudoku/mini-sudoku domain by 25%

4. `@games/card-deck-engine` — Card game mechanics (future, when card games implemented)
   - Existing: `@games/card-deck-core` + `@games/card-deck-system`
   - Extend with: hand management, deal logic
   - **Impact**: 3+ apps (war, go-fish, blackjack)

### Execution Plan

1. **Analyze ai.ts patterns across 32 apps** (1 hour)
   - Extract common minimax structure
   - Identify heuristic scoring patterns
   - Document difficulty scaling approaches

2. **Create @games/ai-framework** (0.5-1 hour)
   - Template for minimax with alpha-beta pruning
   - Generic difficulty scaling
   - Heuristic scoring interface

3. **Migrate 5-10 high-priority apps to use framework** (0.5-1 hour)
   - tic-tac-toe, checkers, reversi, connect-four
   - Verify win rates unchanged

4. **Analyze rules.ts patterns** (0.5 hour)
   - Extract turn-based mechanics
   - Extract move validation patterns

5. **Create @games/turn-based-engine** (0.5 hour)
   - Turn state machine
   - Move validation scaffold
   - Win/draw/loss detection APIs

6. **Migrate 3-5 turn-based games** (0.5-1 hour)

---

## Execution Sequencing

### Week 1 (2-3 hours)

- Phase 4: Service consolidation (@crash-logger, @haptics)
- Phase 6: Platform hook consolidation (@use-platform)

### Week 2 (3-4 hours)

- Phase 7a: AI framework creation + test migration (3-5 apps)

### Week 3 (2-3 hours)

- Phase 7b: Turn-based engine creation + migration (3-5 apps)

### Week 4+ (Additional UI/Component extraction)

- Phase 5: Shared UI components (Button, Input, Card, Menu)

---

## Risk Mitigation

1. **Test each refactor**: Ensure game rules/AI behavior unchanged
2. **Incremental migration**: Migrate 1-3 apps per package, validate before wider rollout
3. **Preserve variants**: Allow app-specific overrides when needed
4. **Documentation**: Each shared package includes clear usage examples
5. **Backward compatibility**: Old code continues working during transition

---

## Success Criteria

| Phase | Success Metric                                                     |
| ----- | ------------------------------------------------------------------ |
| **4** | 3 apps migrated to shared services; 0 regressions                  |
| **5** | 10+ apps migrated to shared UI components; identical visual output |
| **6** | 2 apps using unified platform detection; reduced hook count        |
| **7** | 10+ apps using @games/ai-framework; AI behavior unchanged          |

---

## Grand Totals (All Phases 1-7)

| Metric                     | Current  | Post-Phase-7 | Savings                 |
| -------------------------- | -------- | ------------ | ----------------------- |
| Lines of boilerplate       | ~50,000+ | ~40,000+     | ~20-30% reduction       |
| Shared packages            | 3        | 8-12         | 3-4x increase in reuse  |
| Apps with shared utilities | 51       | 39+          | Platform-wide adoption  |
| Custom implementations     | 150+     | 80-100       | Consolidation by 40-50% |

---

## Next Steps

1. ✅ Complete Phase 4-7 analysis (DONE)
2. ⏳ Review Phase 4-7 plan with stakeholders
3. ⏳ Execute Phase 4 (services) — 1-2 hours
4. ⏳ Execute Phase 7a (AI framework) — 2-3 hours (high value)
5. ⏳ Execute Phase 7b (turn-based engine) — 1-2 hours
6. ⏳ Execute Phase 5 (UI components) — 3-4 hours (parallelizable)

---

**Status**: Ready to execute. Recommend starting with Phase 4 (quick wins) + Phase 7a (high impact).
