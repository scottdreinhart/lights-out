# Phase 1: Actual Execution Summary & Targets

**Date**: 2026-04-01  
**Status**: 🎯 Ready to Execute - Real Targets Identified

---

## Audit Results

### Hook Factory Pattern Adoption

**useStats Hook Pattern**:

- ✅ 22 apps: Already use `createUseStatsHook` factory
- ❌ 2 apps: Custom implementations (nim, rock-paper-scissors)
- 🔇 15 stub apps: No stats tracking

**useSoundEffects Hook Pattern** (spot check):

- ✅ Most apps: Use `createUseSoundEffectsHook` or similar
- ❌ bunco: Custom implementation (needs audit)
- ⚠️ Others: Mixed patterns (need full audit)

**Duplication File Counts**:

- useSoundEffects.ts: 25 copies across apps
- useStats.ts: ~25 apps have it (using factory or custom)
- useTheme.ts: Mostly in context files (not direct hook file)

---

## Phase 1 Real Work (Revised from Audit)

### What's NOT a Problem

- ✅ Hook factories already exist and are widely used
- ✅ 22 apps are already following the correct pattern
- ✅ @games/app-hook-utils is complete and functional
- ✅ No need to create new shared packages

### What IS a Problem

- ❌ 2-5 apps have outdated custom implementations
- ❌ Some apps may have old/duplicated hook files not cleaned up
- ❌ Inconsistency: Some follow factory pattern, others don't

### The Real Fix

**Update 2-5 outlier apps to use factory pattern like the other 22 do**

---

## Phase 1 Concrete PoC Plan

### Target 1: nim (useStats)

**Current**: Custom impl (40 lines)  
**Target**: Use factory like tictactoe (10 lines)  
**Effort**: 30 minutes  
**Files affected**: 1 file (useStats.ts)

### Target 2: rock-paper-scissors (useStats)

**Current**: Custom impl  
**Target**: Use factory  
**Effort**: 30 minutes  
**Files affected**: 1 file

### Target 3: bunco (useSoundEffects + audit)

**Current**: Need to audit  
**Target**: Standardize  
**Effort**: 1 hour (includes audit)

---

## Realistic Phase 1 Timeline

**Mon 4/1 (30 min)**: Update nim's useStats  
**Mon 4/1 (30 min)**: Update rock-paper-scissors's useStats  
**Tue 4/2 (1-2 hrs)**: Full bunco audit + any other hooks  
**Wed 4/3 (1 hr)**: Final validation & cleanup

**Total Phase 1 Time: 3-4 hours (not 10-15 hours!)**

---

## What This Accomplishes

✅ **100% of apps** use consistent factory pattern  
✅ **Data consistency**: All apps use same stats tracking  
✅ **Maintainability**: Changes to factories benefit all apps  
✅ **Clean codebase**: No "one-off" custom implementations

---

## What Gets Unified

**After Phase 1**:

- All 39 apps use `createUseStatsHook` for stats
- All 25 apps (with sound) use same sound effect pattern
- All 26+ apps import hooks consistently from @games/app-hook-utils
- Cleaner import patterns across codebase

---

## Not Covered in Phase 1

Phase 1 focuses on **hooks factory standardization**.

**Not Phase 1** (future phases):

- Context provider consolidation (Phase 3)
- Services consolidation (Phase 2)
- Constants consolidation (Phase 4)
- WASM/worker consolidation (Phase 5)
- UI component consolidation (Phase 6)

---

## Next Immediate Action

### Start with nim (PoC #1)

```bash
# 1. Examine nim's current useStats
cat apps/nim/src/app/hooks/useStats.ts

# 2. Compare with tictactoe's pattern
cat apps/tictactoe/src/app/useStats.ts

# 3. Update nim to follow tictactoe pattern
# (Replace 40-line impl with 10-line factory call)

# 4. Test
cd apps/nim
pnpm typecheck
pnpm lint
pnpm dev

# 5. Commit
git commit "refactor(apps/nim): Use createUseStatsHook factory"
```

---

## Confidence Level: 🟢 GREEN

**Why**:

- 22 apps already prove the pattern works
- Only 2-5 apps need updating
- Changes are mechanical (copy-paste tictactoe pattern)
- Full reverting is trivial if issues arise
- No architectural risks

---

**Ready to start nim PoC? Let's execute this step-by-step.**
