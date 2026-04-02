# Master Execution Roadmap: Options A, B, and Decomposition

**Date**: 2026-04-01  
**Overall Status**: 🎯 READY FOR EXECUTION  
**Timeline**: 3-4 weeks (Option A + Decomposition parallel execution)

---

## What You Now Have

### ✅ Option A: Card-Deck Integration

- **Document**: [CARD_DECK_INTEGRATION_PLAN.md](CARD_DECK_INTEGRATION_PLAN.md)
- **Goal**: Integrate card-deck-core into war, blackjack, go-fish
- **Timeline**: ~1 week (7 phases)
- **Blockers**: None (dependencies are stable with TypeScript 6.0.2)
- **Value**: Establish shared card system, eliminate card game code duplication

### ✅ Option B: Phase 3-4 Monitoring

- **Document**: [PHASE_3-4_BLOCKER_MONITOR.md](PHASE_3-4_BLOCKER_MONITOR.md)
- **Goal**: Monitor npm for React plugin ecosystem updates
- **Timeline**: 1 week (check 2026-04-03 to 2026-04-08)
- **Action**: When plugins release → execute Phase 3-4 ESLint upgrades
- **Value**: Keep dependencies current once blocker resolves

### ✅ Decomposition Strategy: Apps Modernization

- **Document**: [APPS_DECOMPOSITION_AUDIT.md](APPS_DECOMPOSITION_AUDIT.md)
- **Goal**: Extract 500+ duplicated files into shared packages
- **Timeline**: 2-3 weeks (7 phases)
- **Critical Finding**: 26 files duplicated 25+ times each (104KB+ wasted space per file)
- **Value**: 40-50% code duplication removal, faster future development

---

## Execution Sequence

### Week 1 (April 1-7, 2026): CRITICAL WINDOW

**Parallel Tracks**:

#### Track A: App Decomposition (Phases 1-4) — 8-12 hours

Complete the massive duplication cleanup **first**, because:

1. It unblocks Card-Deck Integration (new shared packages needed)
2. Reduces bloat by 30-40%
3. Creates foundation for reuse

**Priority Order**:

```
Mon 4/1 (3-4 hrs)  → Phase 1: Extract shared-hooks
Mon 4/1 (2-3 hrs)  → Phase 2: Extract shared-services
Tue 4/2 (2-3 hrs)  → Phase 3: Extract shared-context
Tue 4/2 (1-2 hrs)  → Phase 4: Consolidate constants
Wed 4/3 (1 hr)     → Phase 5: Template WASM/workers
Wed 4/3 (2 hrs)    → Phase 6: Consolidate shared UI
```

**At end of Phase 6**: 26-27 apps refactored + duplication removed

#### Track B: Phase 3-4 Blocker Monitoring — 10 minutes/day

**Daily** (Mon-Fri):

- Check npm for React plugin updates: `npm info eslint-plugin-react`
- If ANY plugin available: Mark as READY FOR PHASE 3 ✅

**Check URLs**:

- https://www.npmjs.com/package/eslint-plugin-react (watch for v8.0.0+)
- https://www.npmjs.com/package/eslint-plugin-jsx-a11y (watch for v7.0.0+)
- https://www.npmjs.com/package/eslint-plugin-react-hooks (watch for v5.0.0+)

**Action when ready**: Commit Phase 3-4 blocker report, then execute Phase 3-4

#### Track C: Prepare Card-Deck Integration — 2-3 hours (non-blocking)

In parallel, prepare but don't execute:

- Review [CARD_DECK_INTEGRATION_PLAN.md](CARD_DECK_INTEGRATION_PLAN.md)
- Set up shared hooks structure in app-hook-utils (created in Phase 1)
- Pre-test card-deck-core with TypeScript 6.0.2 ✅ (already done)

**Don't execute** until:

- ✅ Phase 1-4 (Decomposition) complete
- ✅ war, blackjack, go-fish apps exist (currently stubs)

---

### Week 2 (April 7-14, 2026): INTEGRATION & COMPLETION

#### Track A: App Decomposition (Phases 7-8) — 6-10 hours

**Phase 7**: Complete stub apps (war, blackjack, go-fish)

- Use card-deck-core with new shared hooks (from Phase 1-4)
- Reference [CARD_DECK_INTEGRATION_PLAN.md](CARD_DECK_INTEGRATION_PLAN.md)
- Verify each game plays correctly

**Phase 8**: Full Quality Gate

- `pnpm validate` on all 39 apps
- Fix any lint, type, or import errors
- Ensure zero duplication

#### Track B: Card-Deck Integration (Option A) — 7-10 hours

Once war, blackjack, go-fish apps exist + decomposition done:

```
Mon 4/7   → Phase A.1: Create shared card hooks (useCardGame, useCardShoe, useCardHand)
Tue 4/8   → Phase A.2: Integrate war game with card-deck-core
Wed 4/9   → Phase A.3: Integrate blackjack game
Thu 4/10  → Phase A.4: Integrate go-fish game
Fri 4/11  → Phase A.5: Create shared card UI components
```

#### Track C: Phase 3-4 Execution (if ready)

If React plugins released:

- Execute Phase 3: Update ESLint ecosystem
- Execute Phase 4: Update React plugin ecosystem
- Full validation across all 39 apps

---

### Week 3+ (April 14+, 2026): POLISH & EXTEND

#### If everything on schedule:

- New game development using shared systems
- Performance optimization
- Deploy to app stores
- Begin next generation (Poker variants, Rummy family, Bridge)

#### If card-deck integration delayed:

- Complete remaining stub apps (bingo, dominoes, snakes-and-ladders)
- Extend decomposition to other game families (sudoku, dice, etc.)
- Build additional shared packages

---

## Parallel Execution Matrix

```
     Week 1           Week 2            Week 3
     Mon-Fri          Mon-Fri           Mon-Fri
────────────────────────────────────────────────────
Track A:
Decomposition  [▓▓▓▓▓▓▓▓]  [▓▓▓▓]  [░░░░]
              (Phases 1-6)  (Phase 7-8)

Track B:
Card-Deck      [░░░░░░░░]  [▓▓▓▓▓▓▓▓]  [░░░░]
              (Prepare)     (A.1-A.5)

Track C:
Phase 3-4       [▒▒▒▒▒]  [░]  [░░░░]
Monitor      (daily check) (execute if ready)

Legend:
▓ = Active work
▒ = Light monitoring
░ = Blocked/not started
```

---

## Critical Path Dependencies

```
Decomposition (Phases 1-4)
    ↓ required by
Stub App Completion (Phase 7) + Card-Deck Integration Setup
    ↓ unblocks
Card-Deck Integration (Option A, Phases A.1-A.5)
    ↓ enables
Future Card Game Development (Poker, Rummy, Bridge variants)

Parallel (independent):
Phase 3-4 Monitor ← Daily check, execute when ecosystem ready
```

---

## Execution Checklist

### Before Starting (April 1, Mon)

- [ ] Read all 3 master documents (this file + 2 plans)
- [ ] Verify TypeScript 6.0.2 still stable: `pnpm typecheck`
- [ ] Create git branch or ensure clean main: `git status`
- [ ] Set up monitoring tracker for Phase 3-4 blockers

### Week 1: Decomposition (Mon 4/1 - Fri 4/5)

- [ ] **Phase 1 (Mon)**: Extract shared-hooks
  - [ ] Create packages/shared-hooks
  - [ ] Move useTheme, useSoundEffects, useSoundContext, etc.
  - [ ] Update all 26 apps to import from @games/shared-hooks
  - [ ] Validate: 26 apps pass lint + typecheck

- [ ] **Phase 2 (Mon-Tue)**: Extract shared-services
  - [ ] Create packages/shared-services
  - [ ] Move storageService, crashLogger, analyticsService, etc.
  - [ ] Update all 25 apps
  - [ ] Validate: 25 apps pass

- [ ] **Phase 3 (Tue)**: Extract shared-context
  - [ ] Create packages/shared-context
  - [ ] Move ThemeContext, SoundContext, StatsContext, etc.
  - [ ] Update all 26 apps
  - [ ] Validate: 26 apps pass

- [ ] **Phase 4 (Tue-Wed)**: Consolidate constants
  - [ ] Move responsive.ts, layers.ts, ui-constants.ts to @games/domain-shared
  - [ ] Update all references
  - [ ] Validate imports

- [ ] **Phase 5 (Wed)**: Template WASM/workers
  - [ ] Create script: scripts/generate-game-worker.js
  - [ ] Template: ai.worker.ts
  - [ ] Template: ai-wasm.ts auto-loader
  - [ ] Validate: Worker files consistent

- [ ] **Phase 6 (Wed)**: Consolidate shared UI
  - [ ] Move ErrorBoundary.tsx to shared
  - [ ] Create HamburgerMenu base + game-specific HOC
  - [ ] Update imports
  - [ ] Validate: 26 apps pass

- [ ] **Monitor Phase 3-4 (Daily)**: Check npm for plugin updates
  - [ ] Mon: Check npm info eslint-plugin-react
  - [ ] Tue: Check npm info eslint-plugin-jsx-a11y
  - [ ] Wed: Check npm info eslint-plugin-react-hooks
  - [ ] Thu: Check all three again
  - [ ] Fri: Final check + document status

### Week 2: Stub App Completion + Card-Deck Integration

- [ ] **Phase 7 (Mon-Thu)**: Complete war, blackjack, go-fish
  - [ ] Fill in war with card-deck-core integration
  - [ ] Fill in blackjack with card-deck-core integration
  - [ ] Fill in go-fish with card-deck-core integration
  - [ ] Validate: Each game plays, shows no errors

- [ ] **Phase 8 (Fri)**: Full quality gate
  - [ ] `pnpm validate` on all 39 apps
  - [ ] Fix any errors
  - [ ] Document completion

- [ ] **Card-Deck Integration (A.1-A.5)** (Mon-Fri, once stubs ready)
  - [ ] Phase A.1: Create shared card hooks
  - [ ] Phase A.2: Integrate war
  - [ ] Phase A.3: Integrate blackjack
  - [ ] Phase A.4: Integrate go-fish
  - [ ] Phase A.5: Create shared card UI components

### Week 3+: Polish & Extend

- [ ] All 39 apps pass validation
- [ ] Card-deck-core fully integrated (3 games)
- [ ] Prepare for Phase 3-4 ESLint execution (if plugins available)
- [ ] Plan next generation of games

---

## Success Metrics

### Decomposition Success

- ✅ 26-27 apps reference shared-hooks (zero duplicates)
- ✅ 25+ apps reference shared-services (zero duplicates)
- ✅ 26+ apps use shared-context (zero duplicates)
- ✅ All constant files point to @games/domain-shared
- ✅ Estimated duplication reduced 40-50%
- ✅ All 39 apps pass full validation

### Card-Deck Success

- ✅ war, blackjack, go-fish apps playable
- ✅ Games use card-deck-core system
- ✅ 100+ games played with zero errors
- ✅ Setup for future card games (Poker, Rummy, Bridge)

### Phase 3-4 Success (when ready)

- ✅ React plugins available in compatible versions
- ✅ ESLint 10.1.0 upgraded without issues
- ✅ All 39 apps pass with new ESLint config

---

## Communication & Tracking

### Daily Standup (Async)

Record in session memory:

- What completed today
- Blockers encountered
- Next day priorities
- Confidence level (green/yellow/red)

### Commit Strategy

**Each phase = 1 commit** (traceable + reversible)

```bash
# Week 1
git commit "chore(decompose): Phase 1 - Extract shared-hooks"
git commit "chore(decompose): Phase 2 - Extract shared-services"
git commit "chore(decompose): Phase 3 - Extract shared-context"
git commit "chore(decompose): Phase 4 - Consolidate constants"
git commit "chore(decompose): Phase 5 - Template WASM/workers"
git commit "chore(decompose): Phase 6 - Consolidate UI components"

# Week 2
git commit "chore(decompose): Phase 7 - Complete stub apps"
git commit "chore(decompose): Phase 8 - Full quality validation"
git commit "feat(card-deck): Integrate war|blackjack|go-fish"
git commit "feat(card-deck): Add shared card UI components"

# If Phase 3-4 ready
git commit "chore(deps): Phase 3 - Update ESLint + plugin-boundaries"
git commit "chore(deps): Phase 4 - Update React plugin ecosystem"
```

---

## Reference Documents

All documentation created in this session:

1. **[PHASE_3-4_BLOCKER_MONITOR.md](PHASE_3-4_BLOCKER_MONITOR.md)**
   - Phase 3-4 ecosystem tracking
   - Daily monitoring checklist
   - Plugin release URLs to watch

2. **[CARD_DECK_INTEGRATION_PLAN.md](CARD_DECK_INTEGRATION_PLAN.md)**
   - Option A: Card-deck-core integration
   - 5 phases (hooks, war, blackjack, go-fish, UI)
   - Testing strategy + timeline

3. **[APPS_DECOMPOSITION_AUDIT.md](APPS_DECOMPOSITION_AUDIT.md)**
   - Comprehensive app inventory
   - 500+ duplication analysis
   - 7-phase modernization strategy
   - Before/after metrics

4. **[PHASE_2_COMPLETION_REPORT.md](PHASE_2_COMPLETION_REPORT.md)**
   - TypeScript 6.0.2 stable foundation
   - All games verified compatible
   - Reference for dependency stability

---

## Ready to Begin?

✅ All planning documents complete  
✅ All 39 apps audited and categorized  
✅ No blockers identified  
✅ Dependencies stable (TypeScript 6.0.2)  
✅ card-deck-core ready for integration

**Next action**: Start **Week 1 Decomposition tracking**

Execute in this order:

1. **Phase 1 (Mon)**: Extract shared-hooks (most impactful)
2. **Phase 2 (Mon-Tue)**: Extract shared-services
3. **Phase 3 (Tue)**: Extract shared-context
4. **Phases 4-6 (Tue-Wed)**: Consolidate + template
5. **Phase 7 (Mon-Thu following week)**: Complete stub apps
6. **Phase A (same week)**: Card-deck integration

---

**Timeline: 3-4 weeks to complete all work**

**Estimated savings**: 500+ files removed from duplication

**End goal**: Lean, reusable platform ready for next generation of games
