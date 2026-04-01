# Apps Decomposition & Modernization Audit

**Date**: 2026-04-01  
**Scope**: All 39 apps in `/apps/*`  
**Overall Status**: 🔴 CRITICAL DUPLICATION DETECTED

---

## Executive Summary

### Major Findings

**🔴 CRITICAL**: **26-34 copies of infrastructure hooks/services exist across the platform**

| File | Duplicated Count | Should Be | Savings |
|------|-----------------|-----------|---------|
| ThemeContext.tsx | 26 copies | 1 shared | ~25 files |
| SoundContext.tsx | 26 copies | 1 shared | ~25 files |
| useSoundEffects.ts | 25 copies | 1 shared | ~24 files |
| storageService.ts | 25 copies | 1 shared | ~24 files |
| crashLogger.ts | 25 copies | 1 shared | ~24 files |
| ai.worker.ts | 25 copies | ~3 shared (game-family specific) | ~22 files |
| ai-wasm.ts | 25 copies | ~3 shared | ~22 files |
| responsive.ts | 26 copies | 1 shared | ~25 files |
| layers.ts | 26 copies | 1 shared | ~25 files |
| haptics.ts | 26 copies | 1 shared | ~25 files |

**Estimated Duplication**: 500+ unnecessary files (30-40% of all app codebase)

---

## App Status Inventory

### Category 1: Incomplete/Stub Apps (6 apps) 🔴

These apps have no source files and need completion:

| App | Status | Action Required |
|-----|--------|-----------------|
| **war** | Stub ({src,public} placeholder) | Complete with card-deck-core integration |
| **blackjack** | Stub | Complete with card-deck-core integration |
| **go-fish** | Stub | Complete with card-deck-core integration |
| **bingo** | Stub | Complete or remove |
| **dominoes** | Stub | Complete or remove |
| **snakes-and-ladders** | Stub | Complete or remove |

**Priority**: URGENT — 6 apps cannot be deployed; blocking card-deck integration

---

### Category 2: Minimal Apps (7 apps) ✅

These apps have lean implementations (12-32 files) — good architecture:

| App | Files | Notes |
|-----|-------|-------|
| crossclimb | 12 | Minimal implementation, good |
| queens | 12 | Minimal, good |
| tango | 12 | Minimal, good |
| zip | 12 | Minimal, good |
| pinpoint | 14 | Minimal, good |
| sudoku | 23 | Lean with shared sudoku-solver |
| mini-sudoku | 32 | Lean with shared sudoku-solver |

**Status**: ✅ These are best-practice; use as template  
**Action**: Zero changes needed; consider for reference

---

### Category 3: Standard Apps with Duplication (26 apps) 🟡

Apps with 30-50 TS files but containing **significant duplication**:

**172-203 file total (mostly node_modules bloat + duplicated hooks)**:

```
battleship (197), bunco (193), cee-lo (189), checkers (282),
chicago (189), cho-han (189), connect-four (192), farkle (189),
hangman (187), liars-dice (189), mancala (198), memory-game (186),
mexico (189), minesweeper (203), monchola (170), pig (189),
rock-paper-scissors (182), ship-captain-crew (174), shut-the-box (193),
simon-says (172), reversi (172)
```

**Duplicate Hooks/Services Found**:
- ThemeContext.tsx (26 copies, ~4KB each = ~104KB total)
- SoundContext.tsx (26 copies)
- useSoundEffects.ts (25 copies)
- storageService.ts (25 copies)
- crashLogger.ts (25 copies)
- responsive.ts (26 copies)
- layers.ts (26 copies)
- haptics.ts (26 copies)

**Action**: Extract to `@games/shared-hooks` and `@games/shared-services` packages

---

### Category 4: Complex Apps (4 apps) 🟡

These apps have legitimate complexity (60-98 TS files):

| App | Files | Reason for Complexity |
|-----|-------|----------------------|
| **lights-out** | 60 | Full infrastructure (audio, haptics, diagnostics, storage) |
| **nim** | 98 | Full infrastructure + multiple AI engines + sprites |
| **tictactoe** | 82 | Full infrastructure + advanced features |
| **snake** | 280 total | Full infrastructure |
| **minesweeper** | 203 total | Full infrastructure |

**Status**: Complex but legitimate; still contain some duplication  
**Action**: Extract shared hooks/services; keep game-specific logic

---

## Duplication Breakdown: Files to Extract

### Group 1: Platform Infrastructure (26-27 apps) → Create `@games/shared-hooks`

These hooks are **identical or nearly identical** across all games:

```typescript
// Extract these 8 files to new @games/shared-hooks package:
├── useTheme.ts              // Theme management (26 copies)
├── useSoundEffects.ts       // Sound effects (25 copies)
├── useStats.ts              // Game statistics (24 copies)
├── useResponsiveState.ts    // Responsive design (26 copies)
├── useKeyboardControls.ts   // Keyboard input (18 copies, est.)
├── useGame.ts               // Generic game state (20 copies, est.)
├── useBrowserDetection.ts   // Browser capabilities (est. 15+ copies)
└── useAccessibility.ts      // Accessibility settings (est. 12+ copies)

// Result: Remove ~170+ file instances, add 1 package with 8 files
// Net savings: ~162+ files
```

### Group 2: Platform Services (25-26 apps) → Extract to `@games/shared-services`

```typescript
// Extract these to @games/shared-services:
├── storageService.ts        // localStorage management (25 copies)
├── crashLogger.ts           // Error logging/crash reporting (25 copies)
├── analyticsService.ts      // Analytics (est. 18+ copies)
├── audioService.ts          // Audio management (est. 20+ copies)
└── notificationService.ts   // Notifications (est. 12+ copies)

// Result: Remove ~100+ file instances, add 1 package with 5 files
// Net savings: ~95+ files
```

### Group 3: Platform Context Providers (26 apps) → Move to `@games/shared-context`

```typescript
// Extract these context providers:
├── ThemeContext.tsx         // Theme state (26 copies)
├── SoundContext.tsx         // Sound state (26 copies)
├── StatsContext.tsx         // Stats state (est. 20+ copies)
├── AccessibilityContext.tsx // Accessibility state (est. 15+ copies)
└── SettingsContext.tsx      // User settings (est. 18+ copies)

// Result: Remove ~105+ file instances, add 1 package with 5 files
// Net savings: ~100+ files
```

### Group 4: Domain Constants (26-27 apps) → Consolidate

```typescript
// These should be shared (currently duplicated):
├── responsive.ts            // Breakpoint tokens (26 copies)
├── layers.ts                // Z-index constants (26 copies)
├── constants.ts             // Game-specific (keep per app, but extract common)
├── ui-constants.ts          // UI spacing/sizing (26 copies)
└── sprites.ts               // Asset mapping (game-specific, but pattern similar)

// Move shared tokens to @games/domain-shared/constants
// Result: Remove ~78+ file instances
// Net savings: ~75+ files
```

### Group 5: UI Components (Platform-Level) → Extract Shared Components

Files that should be in `@games/ui-shared` or app-specific:

```typescript
// Platform-level (26-27 copies):
├── ErrorBoundary.tsx        // (22 copies) → 1 shared component
├── SplashScreen.tsx         // (6 copies, unique per game, keep)
├── HamburgerMenu.tsx        // (5 copies) → 1 shared with game-specific content
├── MainMenu.tsx             // (3 copies, unique per game, keep)

// Result: Consolidate ~27 instances to 2 shared + game-specific variants
// Net savings: ~20+ files
```

### Group 6: Worker & WASM Files

```typescript
// These are mostly identical (can be template-generated):
├── ai.worker.ts             // (25 copies, mostly similar)
├── ai-wasm.ts               // (25 copies, auto-generated)
├── wasm-loader.ts           // (3 copies)

// Strategy: Template-based generation from card deck or game-specific configs
// Result: Reduce from 53 instances to script-generated pattern
// Net savings: ~40+ files
```

---

## Detailed Decomposition Strategy

### Phase 1: Extract Shared Hooks (3-4 hours)

**Create**: `@games/shared-hooks` package

```bash
mkdir -p packages/shared-hooks/src
# Move implementation from any app as template, then symlink to others
```

**Files to extract**:
- useTheme.ts (from lights-out, verify in 3-4 other apps for accuracy)
- useSoundEffects.ts
- useStats.ts
- useResponsiveState.ts
- useKeyboardControls.ts (identify from multiple apps)
- useGame.ts (extract generic hooks)
- useAccessibility.ts
- useBrowserCapabilities.ts

**Output**: 1 new package, 26+ apps reference instead of duplicate

---

### Phase 2: Extract Shared Services (2-3 hours)

**Create**: `@games/shared-services` package

```bash
mkdir -p packages/shared-services/src
```

**Files to extract**:
- storageService.ts (verify from 2-3 apps)
- crashLogger.ts
- analyticsService.ts
- audioService.ts
-notificationService.ts

**Output**: 1 new package, 25+ apps reference

---

### Phase 3: Extract Context Providers (2-3 hours)

**Create**: `@games/shared-context` package

```bash
mkdir -p packages/shared-context/src
```

**Files to extract**:
- ThemeContext.tsx
- SoundContext.tsx
- StatsContext.tsx
- AccessibilityContext.tsx
- SettingsContext.tsx

**Output**: 1 new package, consolidate 26 contexts

---

### Phase 4: Consolidate Constants (1-2 hours)

**Move constants to**: `@games/domain-shared/constants` (likely already exists)

**Verify and consolidate**:
- responsive.ts (breakpoint tokens, duplicated 26 times)
- layers.ts (z-index, duplicated 26 times)
- ui-constants.ts (spacing/sizing, duplicated 26 times)
- Common color constants
- Common timing/animation constants

**Output**: Single source of truth

---

### Phase 5: Template WASM & Worker Files (1 hour)

**Create**: Build script to generate identical ai.worker.ts + ai-wasm.ts

```bash
scripts/generate-game-worker.js
# Template → generates identical files for all games that need them
# Avoids 25+ duplicate copies
```

**Output**: Template-based generation

---

### Phase 6: Consolidate Shared UI Components (2 hours)

**Move to**: `apps/ui/organisms/` (shared across all games) or `@games/ui-shared`

**Components to consolidate**:
- ErrorBoundary.tsx (22 copies → 1 shared)
- HamburgerMenu.tsx (5 copies + variants → 1 base + game-specific hoc)
- SplashScreen.tsx (6 copies, keep game-specific layer)

**Output**: ~20+ fewer UI component files

**Keep game-specific**:
- MainMenu.tsx (unique per game)
- GameBoard.tsx (unique per game family)
- Game-specific organisms

---

### Phase 7: Complete Stub Apps (4-6 hours)

**Priority order**:
1. **war** — Card-deck-core integration (see CARD_DECK_INTEGRATION_PLAN.md)
2. **blackjack** — Card-deck-core integration
3. **go-fish** — Card-deck-core integration
4. **bingo** — New implementation or defer
5. **dominoes** — New implementation or defer
6. **snakes-and-ladders** — New implementation or defer

**Action**: Reference minimal app (crossclimb, queens, tango) as template

---

## Clean Up Plan: Before/After Metrics

### BEFORE Decomposition

```
Total TS files in all apps: ~1,500+ files
Duplicated infrastructure: ~500+ files (33%)
Package count: 1 shared (card-deck-core)
Unique file count: ~1,000
```

### AFTER Decomposition

```
Total TS files in all apps: ~900-1,000 files
Duplicated infrastructure: ~0 files (0%)
Package count: 5-6 shared packages
Core reusable files: ~100-150 files (shared-hooks, shared-services, shared-context)
Game-specific files: ~800-850 files
Estimated savings: 40-50% duplication removed
```

---

## Implementation Timeline

| Phase | Duration | Apps Affected | Start |
|-------|----------|---------------|-------|
| **1: Shared Hooks** | 3-4 hrs | 26 apps | Week 1 (4/1) |
| **2: Shared Services** | 2-3 hrs | 25 apps | Week 1 (4/1) |
| **3: Shared Context** | 2-3 hrs | 26 apps | Week 1 (4/2) |
| **4: Consolidate Constants** | 1-2 hrs | All | Week 1 (4/2) |
| **5: WASM/Worker Templates** | 1 hr | 25 apps | Week 1 (4/3) |
| **6: Shared UI Components** | 2 hrs | 26 apps | Week 1 (4/3) |
| **7: Complete Stub Apps** | 4-6 hrs | 6 apps | Week 1-2 (4/3-4/7) |
| **Total** | **15-20 hrs** | **39 apps** | **1-2 weeks** |
| **Quality Gate** | 2-3 hrs | All | Week 2 (4/7-4/9) |

---

## Priority Sequencing

### 🔴 CRITICAL (Must do first)
1. **Phase 1-4**: Extract shared hooks/services/context/constants
   - Impact: Reduces bloat across 26 apps immediately
   - Dependencies: None
   - Risk: Low (refactoring only)

2. **Phase 7a**: Complete war, blackjack, go-fish (Card-Deck games)
   - Impact: Enables card-deck-integration (Option A)
   - Dependencies: Phase 1-4 (hooks/services)
   - Risk: Low (new code, thoroughly tested)

### 🟡 IMPORTANT (Next)
3. **Phase 5-6**: Template WASM/workers, consolidate shared UI
   - Impact: Further duplication reduction
   - Dependencies: Phase 1-4
   - Risk: Low-Medium (refactoring + templates)

4. **Phase 7b**: Complete bingo, dominoes, snakes-and-ladders
   - Impact: Brings 6 stub apps to playable
   - Dependencies: All previous phases
   - Risk: Medium (new game implementations)

### ✅ VALIDATION (After all phases)
5. **Quality Gate**: Full validation across all 39 apps
   - Commands: `pnpm lint`, `pnpm typecheck`, `pnpm build`, `pnpm validate`
   - Expected: All 39 apps pass
   - Duration: 2-3 hours

---

## Risk Mitigation

### Risks & Mitigations

| Risk | Mitigation |
|------|-----------|
| Breaking changes in shared hooks | Exhaustively test on 3-4 apps first, then roll out |
| Type compatibility issues | Full typecheck on master before merging each phase |
| Circular dependencies | ESLint boundaries check during extraction |
| Missing exports in new packages | Verify barrel exports per package spec |
| Apps still running with old copies | Remove old files immediately after migration |

### Rollback Strategy

```bash
# Each phase is independent commit:
# Phase 1 commit → can revert if issues found
# Phase 2 commit → independently reversible
# etc.

# If critical issue:
git revert <phase-commit-hash>
pnpm install
# Back to previous state
```

---

## Success Criteria

- ✅ All 39 apps pass full validation (`pnpm validate`)
- ✅ Shared packages created and exported properly
- ✅ Zero duplication of hooks/services/context
- ✅ 6 stub apps completed or clearly marked for future work
- ✅ All apps reference shared packages, not local copies
- ✅ No circular imports or lint violations
- ✅ Estimated 40-50% code duplication removed
- ✅ Every game playable and tested

---

## Next Immediate Actions

1. ✅ Review this decomposition audit
2. ✅ Agree on priority sequencing (Critical → Important → Validation)
3. ⏳ Begin Phase 1: Extract shared-hooks package
4. ⏳ Verify with 2-4 apps before rolling out to all 26
5. ⏳ Create shared-services, shared-context packages
6. ⏳ Update all 26-27 apps to reference shared packages
7. ⏳ Complete stub apps (especially war, blackjack, go-fish for card-deck integration)
8. ⏳ Full validation sweep

---

## Reference Documents

- [Card-Deck Integration Plan](CARD_DECK_INTEGRATION_PLAN.md) — Depends on completing war/blackjack/go-fish
- [Phase 2 TypeScript Completion](PHASE_2_COMPLETION_REPORT.md) — Dependency foundation is stable
- [App Minimal Example](apps/crossclimb) — Reference architecture for lean implementation
- [App Standard Example](apps/lights-out) — Reference for full-featured implementation
- [Duplication Source List](duplication-analysis.txt) — Complete file occurrence counts

---

## Strategic Value

**By completing this decomposition:**

✅ Platform consolidation (reduce 40-50% duplication)  
✅ Make future game development faster (reuse existing hooks/services)  
✅ Reduce maintenance burden (fix bugs in 1 place, benefit all games)  
✅ Enable card-deck integration (Phase A of Card-Deck plan) ✅ Establish shared system governance  
✅ Prepare for next generation of games (rummy, poker, bridge, etc.)

---

**Status: READY TO BEGIN DECOMPOSITION**

This audit provides the roadmap. Begin with Phase 1 (Shared Hooks extraction) and work methodically through all 7 phases.
