# Wave A: Execution Tracker & Progress Log

**Start Date**: [TBD upon user approval]  
**Target Completion**: [Start Date + 3 days]  
**Status**: ⏳ AWAITING PHASE 1 EXECUTION

---

## Phase 1: Factory Consolidation (Days 1-3)

### Day 1: useStats Factory

**Objective**: Create `createUseStatsHook()` factory, update all 25 apps, delete originals.

#### Morning: Factory Creation & Testing

- [ ] Create file: `packages/app-hook-utils/src/factories/createUseStatsHook.ts`
- [ ] Implement logic (copy from cee-lo/src/app/useStats.ts as base)
- [ ] Add JSDoc with examples
- [ ] Test factory in isolation: `pnpm test createUseStatsHook.test.ts`
- [ ] Update barrel: `packages/app-hook-utils/src/index.ts`
  - [ ] Add: `export { createUseStatsHook } from './factories/createUseStatsHook'`
  - [ ] Add: `export type { GameStats } from './factories/createUseStatsHook'`
- [ ] Verify compile: `pnpm typecheck`

**Time Estimate**: 1-2 hours

#### Afternoon: App Updates (All 25 Apps)

Apps to update (in order):
1. apps/cee-lo ✅ (template example)
2. apps/chicago
3. apps/bunco
4. apps/mancala
5. apps/checkers
6. apps/battleship
7. apps/nim
8. apps/tictactoe
9. apps/lights-out
10. apps/snake
11. apps/connect-four
12. apps/farkle
13. apps/mexico
14. apps/cho-han
15. apps/liars-dice
16. apps/pig
17. apps/ship-captain-crew
18. apps/rock-paper-scissors
19. apps/minesweeper
20. apps/dominoes
21. apps/pickett
22. apps/pontoon
23. apps/twenty-one
24. apps/euchre
25. apps/hearts

**Per App Task**:
```
1. Edit: src/app/useStats.ts
   BEFORE (47 lines):
   [entire implementation with STORAGE_KEY]
   
   AFTER (5 lines):
   import { createUseStatsHook } from '@games/app-hook-utils'
   export const useStats = createUseStatsHook('app-name-here')

2. Verify import: src/app/index.ts still exports useStats
3. Test: pnpm -C apps/[app-name] typecheck
```

**Time Estimate**: 30 min setup + 2 min per app (50 apps x 2 min = ~1.5 hours total)

#### EOD: Validation & Commit

- [ ] Run global: `pnpm typecheck` (should pass)
- [ ] Run per-app sample (5 random apps): `pnpm -C apps/[app] typecheck`
- [ ] Delete all 25 original files: `find apps -name "useStats.ts" -type f -delete`
- [ ] Final verify: `pnpm typecheck` (should still pass)
- [ ] Commit: "feat(app-utils): extract useStats factory, consolidate 25 apps"

**Time Estimate**: 1 hour

**Day 1 Total**: ~3.5 hours

---

### Day 2: useTheme Factory

**Objective**: Create `createUseThemeHook()` factory, update all 22 apps, delete originals.

#### Morning: Factory Creation & Testing

- [ ] Create file: `packages/app-hook-utils/src/factories/createUseThemeHook.ts`
- [ ] Implement logic (copy from cee-lo/src/app/useTheme.ts as base)
  - [ ] Include CSS-variable application logic
  - [ ] Include theme stylesheet loading
  - [ ] Include persistence callbacks
- [ ] Add JSDoc with examples
- [ ] Test factory: `pnpm test createUseThemeHook.test.ts`
- [ ] Update barrel: `packages/app-hook-utils/src/index.ts`
  - [ ] Add: `export { createUseThemeHook } from './factories/createUseThemeHook'`
  - [ ] Add: `export type { UseThemeFactoryConfig, UseThemeReturn } from './factories/createUseThemeHook'`
- [ ] Verify compile: `pnpm typecheck`

**Time Estimate**: 1-2 hours

#### Afternoon: App Updates (All 22 Apps)

Apps with useTheme.ts to update (22 apps, names TBD via audit):

**Per App Task**:
```
1. Edit: src/app/useTheme.ts
   BEFORE (150+ lines):
   [theme loading, CSS variable syncing, persistence logic]
   
   AFTER (8 lines):
   import { createUseThemeHook } from '@games/app-hook-utils'
   import { DEFAULT_SETTINGS } from '@/domain/themes'
   
   export const useTheme = createUseThemeHook({
     appName: 'app-name-here',
     defaultSettings: DEFAULT_SETTINGS,
   })

2. Verify import: src/app/index.ts still exports useTheme
3. Test: pnpm -C apps/[app-name] typecheck
```

**Time Estimate**: 30 min setup + 2-3 min per app (22 x 2.5 min = ~1 hour total)

#### EOD: Validation & Manual Testing

- [ ] Run global: `pnpm typecheck` (should pass)
- [ ] Manual test: Theme switching in 3 sample apps
  - [ ] App 1: Light → Dark → [Custom Theme]
  - [ ] App 2: [Custom Theme] → Light (verify persistence)
  - [ ] App 3: Page reload → Theme persists (localStorage)
- [ ] Delete all 22 original files: `find apps -name "useTheme.ts" -type f -delete`
- [ ] Final verify: `pnpm typecheck` (should still pass)
- [ ] Commit: "feat(app-utils): extract useTheme factory, consolidate 22 apps"

**Time Estimate**: 1.5 hours

**Day 2 Total**: ~4 hours

---

### Day 3: useSoundEffects Cleanup & Phase 1 Validation

**Objective**: Clean up Group A (10 apps), consolidate Group B (4-6 apps), validate all, delete 16 files.

#### Morning: Group A Cleanup (10 Apps)

Apps using factory-based useSoundEffects (already in shared package):
- cee-lo, chicago, cho-han, liars-dice, mexico, pig, farkle, rock-paper-scissors, connect-four, snake

**Per App Task**:
```
1. Verify: src/app/useSoundEffects.ts contains one-liner factory call
2. Confirm: appName parameter matches app name
3. Delete: src/app/useSoundEffects.ts
4. Verify import: src/app/index.ts
   - Option A: Still exports useSoundEffects (if using re-export)
   - Option B: Removed (consumers import directly from @games/app-hook-utils)
   - Action: Audit and document pattern
5. Test: pnpm -C apps/[app-name] typecheck (should still work)
```

**Time Estimate**: 15 min verification + 2 min per app (10 x 2 min = ~40 min total)

#### Midday: Group B Variant Factory Creation

Apps with custom sound effects (e.g., bunco with onDiceRoll, onBunco):
- bunco, [3-5 other game-specific sound apps]

**Task**:
- [ ] Create file: `packages/app-hook-utils/src/factories/createGameSpecificSoundEffectsHook.ts`
- [ ] Implement factory accepting `soundMap` parameter
- [ ] Add JSDoc with bunco example
- [ ] Test factory: `pnpm test createGameSpecificSoundEffectsHook.test.ts`
- [ ] Update barrel: `packages/app-hook-utils/src/index.ts`

**Time Estimate**: 1 hour

#### Afternoon: Group B App Updates (4-6 Apps)

**Per App Task**:
```
1. Edit: src/app/useSoundEffects.ts
   BEFORE (40-50 lines):
   [manual implementation with custom sound callbacks]
   
   AFTER (6 lines):
   import { createGameSpecificSoundEffectsHook } from '@games/app-hook-utils'
   import * as sounds from '../sounds'
   
   export const useSoundEffects = createGameSpecificSoundEffectsHook('app-name', {
     // Sound mapping
   })

2. Test: pnpm -C apps/[app-name] typecheck
```

**Time Estimate**: 30 min setup + 3 min per app (5 x 3 min = ~45 min total)

#### EOD: Global Validation & Commit

- [ ] Run global: `pnpm typecheck` (must pass across ALL 25 apps)
- [ ] Manual testing: Sound effects in 3-4 apps
  - [ ] App 1: Play onSelect, onConfirm, onWin (base sounds)
  - [ ] App 2: Play onSelect, onConfirm, plus custom (variant)
  - [ ] App 3: Verify sound context integration still works
  - [ ] App 4: Cross-browser test (if applicable)
- [ ] Delete all 16 original files
  - [ ] Group A (10 files): `find apps/{cee-lo,chicago,cho-han,...} -name "useSoundEffects.ts" -delete`
  - [ ] Group B (6 files): `find apps/{bunco,...} -name "useSoundEffects.ts" -delete`
- [ ] Final verify: `pnpm typecheck` (should pass)
- [ ] Run tests: `pnpm test` (if full suite exists)
- [ ] Commit: "feat(app-utils): consolidate useSoundEffects (16 apps), add variant factory"

**Time Estimate**: 2 hours

**Day 3 Total**: ~4.5 hours

---

## Phase 1 Summary

### Timeline

| Day | Task | Duration | Status |
|-----|------|----------|--------|
| **1** | useStats factory + 25 apps | 3.5h | ⏳ |
| **2** | useTheme factory + 22 apps | 4h | ⏳ |
| **3** | useSoundEffects cleanup + validation | 4.5h | ⏳ |
| **TOTAL** | 3 factories, 63 files deleted | **12h** | ⏳ |

### Outcomes (Upon Completion)

- ✅ **Files Deleted**: 63 (25 + 22 + 16)
- ✅ **Factories Created**: 4 (useStats, useTheme, useSoundEffects base, useSoundEffects variant)
- ✅ **Code Eliminated**: 600+ lines of duplicate code
- ✅ **Apps Updated**: All 25
- ✅ **Validation**: Global typecheck + manual testing on 5+ apps
- ✅ **Next**: Ready for Phase 2 (gesture consolidation)

---

## Progress Log (To Be Updated During Execution)

### Day 1: useStats Factory

**Start Time**: [TBD]

**Factory Creation**:
- [ ] File created: `packages/app-hook-utils/src/factories/createUseStatsHook.ts`
  - **Status**: [In Progress]
  - **Completed**: [TBD]
  - **Notes**: 

- [ ] Tests passing
  - **Status**: [Pending Test Completion]
  - **Time**: [TBD]

**App Updates**:
- Apps completed: 0 / 25
  - [List apps as completed]

**Validation**:
- [ ] typecheck passing globally
- [ ] All 25 local files deleted
- [ ] Files verified deleted: [count] / 25

**Day 1 Wrap-Up**:
- **Actual Time**: [TBD]
- **Estimated vs Actual**: [TBD]
- **Issues**: [Any blockers, surprises, issues]
- **Next Actions**: [Items to carry forward to Day 2]

---

### Day 2: useTheme Factory

**Start Time**: [TBD]

[Similar structure to Day 1]

---

### Day 3: useSoundEffects + Phase 1 Validation

**Start Time**: [TBD]

[Similar structure to Days 1-2]

**Phase 1 Final Status**:
- **Completion Time**: [TBD]
- **All Validations Passing**: [Yes/No]
- **Issues Resolved**: [List any issues and resolutions]
- **Ready for Phase 2**: [Yes/No]

---

## Rollback Triggers & Procedures

If any of these occurs, STOP and rollback:

1. **`pnpm typecheck` fails** in global context
   - Action: `git revert [last-commit]` → investigate root cause

2. **Manual testing fails** (sounds don't play, theme doesn't switch, stats don't save)
   - Action: `git revert` → re-examine factory logic

3. **Import errors** in 3+ apps
   - Action: `git revert` → check barrel exports

4. **Tests fail** at global level
   - Action: Revert factories, fix root cause, re-implement

**Rollback Command** (if needed):
```bash
git log --oneline | head -5  # Find last good commit
git revert [commit-hash]      # Revert Phase 1 changes
pnpm typecheck               # Verify revert worked
```

---

## Success Criteria

Phase 1 is successful when:

- ✅ `pnpm typecheck` passes globally (no TypeScript errors)
- ✅ All 63 original hook files are deleted
- ✅ All 25 apps use factorized useStats
- ✅ All 22 apps use factorized useTheme
- ✅ All 16 apps use factorized useSoundEffects (variants)
- ✅ Manual testing confirms: themes switch, sounds play, stats persist
- ✅ Code committed and pushed
- ✅ Phase 2 planning can proceed

---

## Notes & Observations

[To be filled during execution]

---

## Phase 1 Completion Certificate

**Date Completed**: [TBD]  
**Actual Duration**: [TBD] (vs 12h estimated)  
**Files Deleted**: [X / 63]  
**Validation Status**: [Passed / Needs Review]  
**Approved by**: [Name]  
**Ready for Phase 2**: [Yes / No]

---

## Post-Phase-1 Metrics

```bash
# File count changes
find apps -path "*/src/app/useStats.ts" | wc -l      # Was 25, now 0
find apps -path "*/src/app/useTheme.ts" | wc -l      # Was 22, now 0
find apps -path "*/src/app/useSoundEffects.ts" | wc -l  # Was 26, now ~4-6

# Code duplication decrease
cloc apps --exclude-dir=node_modules  # Run before & after Phase 1
# Expected: ~600 fewer duplicate lines (useStats + useTheme + sound)

# New shared code
cloc packages/app-hook-utils          # Should increase by ~600 lines (factories)
```

---

## Next Phase Trigger

Upon Phase 1 completion, notify user and prepare:

1. **WAVE-A-PHASE-2-IMPLEMENTATION.md** (gesture consolidation)
   - Target: useSwipeGesture (16), useSwipe (7), useDropdownBehavior (7)
   - Effort: 2 days
   - When: [Start Date + 4 days]

2. **Wave B Planning** (domain layer unification)
   - Target: Shared game rules, duplicate type definitions
   - Effort: TBD
   - When: [Start Date + 7 days]

3. **Wave C Planning** (component structure audit)
   - Target: Atomic design hierarchy consistency
   - Effort: TBD
   - When: [Start Date + 12 days]
