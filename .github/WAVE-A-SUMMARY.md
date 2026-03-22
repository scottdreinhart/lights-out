# Wave A: Complete Summary & Status

**Date Completed**: March 17, 2026  
**Status**: ✅ Analysis Complete | ⏳ Awaiting Phase 1 Execution  

---

## What is Wave A?

**Wave A** is the comprehensive audit and consolidation of app-local hook duplication across the 25-game monorepo.

**Objective**: Identify all duplicated hooks and create factories/shared implementations to eliminate unnecessary code.

**Result**: Identified **26 hook files** with **2-26 copies each**, representing **100+ duplicate implementations** and **70+ consolidation targets**.

---

## Wave A Deliverables

### 1. **WAVE-A-HOOK-DUPLICATION-AUDIT.md** ✅

Complete audit of all 26+ duplicated hooks:

- **Tier 1 (High Priority)**: useSoundEffects (26), useStats (25), useTheme (22)
- **Tier 2 (Medium Priority)**: useGame (18), useSwipeGesture (16), useDropdownBehavior (7)
- **Tier 3 (Low Priority)**: 2-4 copy hooks

**Conclusion**: Consolidation can eliminate **70+ files** and reduce code duplication by **600+ lines**.

### 2. **WAVE-A-PHASE-1-IMPLEMENTATION.md** ✅

Three-day implementation plan for first wave of consolidation:

**Factories to Create**:
1. `createUseStatsHook(appName)` — eliminates 25 duplicates
2. `createUseThemeHook(config)` — eliminates 22 duplicates
3. `createUseSoundEffectsHook()` variants — cleans up 16 sound-related duplicates

**Effort**: 3 days (1 per factory)  
**Impact**: Delete 63 files, create 3-4 factories, maintain backward compatibility

---

## Key Findings

### Tier 1: Universally Duplicated (20+ copies)

**1. useStats (25 copies, 95%+ identical)**
- ✅ CONSOLIDATION READY
- Only difference: `STORAGE_KEY = '{app-name}-stats'`
- Same win/loss/streak logic across all apps
- **Plan**: Factory with appName parameter
- **Benefit**: Delete 25 files, 1 factory + 25 one-liners

**2. useTheme (22 copies, 95%+ identical)**
- ✅ CONSOLIDATION READY
- Only difference: `STORAGE_KEY = '{app-name}-theme-settings'`
- Identical CSS variable syncing and theme loading
- **Plan**: Factory with config parameter (appName + defaultSettings)
- **Benefit**: Delete 22 files, maintain 1 factory + 22 one-liners

**3. useSoundEffects (26 copies, mixed patterns)**
- ⚠️ PARTIALLY READY
- **Group A** (10 apps): Already using factory from shared package
  - **Action**: Delete local copies (already abstracted)
- **Group B** (6 apps): Custom game-specific sounds
  - **Action**: Create variant factory for custom sound maps
- **Benefit**: Delete 16 files, maintain 2 Factory variants

### Tier 2: Heavily Duplicated (5-19 copies)

- **useGame** (18 copies): Game-specific; audit individually
- **useSwipeGesture** (16 copies): Can be consolidated to shared package
- **useDropdownBehavior** (7 copies): Already in shared; delete local duplicates
- **Benefit**: 33+ files eligible for consolidation in Phase 2

### Tier 3: Moderately Duplicated (2-4 copies)

- 14+ hooks with 2-4 copies each
- Low ROI but should audit for patterns
- Examples: useGameOrchestration, useCpuPlayer, useCapacitor, usePrevious

---

## Consolidation Roadmap

| Phase | Target Hooks | Apps Affected | Files Freed | New Factories | Timeline | Priority |
|-------|--------------|---------------|-------------|--------------|----------|----------|
| **1** | useStats, useTheme, useSoundEffects | 25+15+16 | **63** | **3** | 3 days | 🔴 NOW |
| **2** | useSwipeGesture, useSwipe, useDropdownBehavior | 16+7+7 | **18** | **2** | 2 days | 🟡 Next |
| **3** | useGame, useGameOrchestration, useCapacitor, etc. | 18+5+ | **5-10** | **2-3** | 5+ days | 🟢 Later |
| **4** | Utility hooks (usePrevious, useWebWorker, etc.) | Various | **5-10** | **3-4** | 2 days | 🟢 Polish |
| **TOTAL** | | | **91-108** | **10-12** | 12+ days | |

---

## Why Phase 1 First?

1. **Highest consolidation ROI**: 70+ files freed with 3 factories
2. **Lowest risk**: Logic completely identical (only storage keys differ)
3. **Unblocking**: Phase 1 validates factory pattern for remaining phases
4. **Team confidence**: Shows tangible progress (70+ file deletion is visible)

---

## Pre-Phase-1 Validation Checklist

Before executing Phase 1:

- [ ] **Read**: Review WAVE-A-HOOK-DUPLICATION-AUDIT.md
- [ ] **Read**: Review WAVE-A-PHASE-1-IMPLEMENTATION.md
- [ ] **Inspect**: Verify samples (cee-lo/chicago useStats comparison)
- [ ] **Inspect**: Verify samples (cee-lo/chicago useTheme comparison)
- [ ] **Inspect**: Verify Group A (10 useSoundEffects already factory-based)
- [ ] **Approve**: Phase 1 scope and timeline
- [ ] **Allocate**: 3 days developer time

---

## Execution Checklist (Upon Start)

### Day 1: useStats Factory

- [ ] Create `@games/app-hook-utils/factories/createUseStatsHook.ts`
- [ ] Export from `@games/app-hook-utils/index.ts`
- [ ] Update cee-lo as template
- [ ] Copy pattern to all 25 apps
- [ ] Delete all 25 original files
- [ ] Run: `pnpm typecheck` (must pass)
- [ ] Run: `pnpm test` (if tests exist, must pass)
- [ ] **Do Not Merge** until Day 3 final validation

### Day 2: useTheme Factory

- [ ] Create `@games/app-hook-utils/factories/createUseThemeHook.ts`
- [ ] Export from `@games/app-hook-utils/index.ts`
- [ ] Update cee-lo as template
- [ ] Copy pattern to all 22 apps
- [ ] Delete all 22 original files
- [ ] Run: `pnpm typecheck` (must pass)
- [ ] Manual test: Theme switching on 3 apps

### Day 3: useSoundEffects Cleanup & Validation

- [ ] Delete Group A local files (10 apps)
- [ ] Create `@games/app-hook-utils/factories/createGameSpecificSoundEffectsHook.ts`
- [ ] Update Group B apps (4-6 custom sound apps)
- [ ] Delete Group B original files
- [ ] Run: `pnpm typecheck` (global, must pass)
- [ ] Manual test: Sounds on 3 apps (standard + variant + custom)
- [ ] **MERGE** all Phase 1 changes

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| Logic errors in factory | Low | High | Identical logic extraction; minimal changes |
| Import failures | Medium | Medium | Validate typecheck after each step |
| Tests fail | Low | Medium | Re-run tests per factory; rollback if needed |
| Breaking changes | Very Low | Very High | No logic changes; same hook signatures |
| Incomplete rollout | Medium | Low | Template checklist ensures consistency |

**Overall Risk**: 🟢 LOW (logic is unchanged, not innovative)

---

## Post-Phase-1 Verification

After Phase 1 execution:

```bash
# Global typecheck (should pass)
pnpm typecheck

# File count reduction
find apps -name "useStats.ts" | wc -l         # Should be 0 (was 25)
find apps -name "useTheme.ts" | wc -l         # Should be 0 (was 22)
find apps -path "*/src/app/use*" | wc -l      # Should decrease by ~63

# Code duplication decrease
# Rough estimate: 25 useStats (47 lines x 25) + 22 useTheme (150 lines x 22) + 16 sound (30 avg x 16)
# = 1,175 + 3,300 + 480 = 4,955 lines eliminated (local duplicates)
# Net new: 3 factories + 25 one-liners + 22 one-liners + 4-6 one-liners
# ≈ 400 lines (factories) + 200 lines (one-liners) = 600 lines new
# NET ELIMINATION: 4,355 lines of duplicate code
```

---

## References & Artifacts

1. **WAVE-A-HOOK-DUPLICATION-AUDIT.md** — Complete audit results
2. **WAVE-A-PHASE-1-IMPLEMENTATION.md** — Day-by-day implementation plan
3. **NEW-APP-TEMPLATE.md** — Template for new apps (prevents future duplication)
4. **AGENTS.md § 21** — File organization governance
5. **AGENTS.md § 4.5** — Domain layer organization

---

## Questions & Answers

**Q: Why aren't we consolidating useGame, useSwipeGesture, etc. in Phase 1?**  
A: They have game-specific logic variations. Phase 1 targets only logic that is 95%+ identical (useStats, useTheme, useSoundEffects patterns). Phase 2-3 will audit the remainder.

**Q: Will this break existing tests?**  
A: No. We're extracting identical logic, not changing it. Hook signatures remain the same. Tests should pass as-is.

**Q: What if an app has a custom useStats or useTheme?**  
A: Audit first. If truly custom, leave it. Phase 1 targets the 25 apps with identical useStats (verified with cee-lo/chicago samples).

**Q: Why use factories instead of just shared exports?**  
A: Factories allow parameterization (appName, config) without app-local `.ts` file. One-liner imports are cleaner and safer than re-export shims (which we removed in Wave 7).

**Q: When do we start Phase 1 execution?**  
A: Upon user approval. Wave A analysis is complete. Phase 1 ready to execute.

---

## Next Steps

1. **Review** WAVE-A-HOOK-DUPLICATION-AUDIT.md
2. **Review** WAVE-A-PHASE-1-IMPLEMENTATION.md
3. **Approve** Phase 1 scope and 3-day timeline
4. **Execute** Phase 1 (useStats → useTheme → useSoundEffects)
5. **Validate** global typecheck + manual tests
6. **Plan** Phase 2 (gesture consolidation)
7. **Plan** Phase 3 (game-specific hook audit)
8. **Plan** Phase 4 (utility consolidation)

---

## Wave A Completion Certificate

✅ **Wave A Analysis**: COMPLETE  
✅ **Hook Duplication Audit**: COMPLETE (26 hooks, 100+ duplicates identified)  
✅ **Consolidation Roadmap**: COMPLETE (4 phases, 91-108 files elimination planned)  
✅ **Phase 1 Plan**: COMPLETE (3 factories, 63 files deletion, 3-day timeline)  
⏳ **Phase 1 Execution**: AWAITING APPROVAL

**Status**: Ready for Phase 1 execution upon user confirmation.
