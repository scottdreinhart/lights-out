# Wave A: App-Local Hook Duplication Audit

**Date**: March 17, 2026  
**Status**: Complete Analysis  
**Next**: Consolidation planning  

---

## Executive Summary

Identified **26 hook files with 2-26 copies each** across 25 apps. Most are truly duplicated with only minor app-specific parameterization (storage keys, sound lists, etc.).

**Consolidation Candidates**: ~80+ files eligible for extraction to `@games/app-hook-utils` or factory functions.

---

## Duplication Analysis

### Tier 1: Universally Duplicated (20+ copies) — **HIGH PRIORITY**

#### 1. `useSoundEffects.ts` — 26 copies

**Status**: PARTIALLY SHARED (via factory)  
**Details**:
- **Shared Apps** (using factory): cee-lo, chicago, cho-han, liars-dice, mexico, pig, cee-lo, farkle, rock-paper-scissors, connect-four
  - Use `createUseSoundEffectsHook()` from `@games/app-hook-utils`
  - Implementation: ~23 lines, identical across all users
  - **Recommendation**: ✅ DELETE local copies; import factory-based version for these apps

- **Custom Apps** (game-specific): bunco, mincesweeper, mancala, etc.
  - Custom sound lists (onDiceRoll, onBunco, etc.)
  - Implementation: ~44 lines (11+ lines extra for app-specific sounds)
  - **Recommendation**: ✅ Extract to named variant like `createGameSpecificSoundEffectsHook(soundMap)`

**Impact if Consolidated**: Delete 16 local files, consolidate 5 variants into 2 factory functions

---

#### 2. `useStats.ts` — 25 copies

**Status**: UNSHARED (100% duplicated logic)  
**Details**:
- Logic: **IDENTICAL** across all apps
  - Only difference: `STORAGE_KEY = '{app-name}-stats'`
  - All use same win/loss/streak tracking pattern
  - All import from `@/domain/constants` and `@/domain/types`
  - Implementation: ~47 lines

**Code Analysis**:
```typescript
// cee-lo version
const STORAGE_KEY = 'cee-lo-stats'
export function useStats() { /* 45 lines */ }

// chicago version
const STORAGE_KEY = 'chicago-stats'
export function useStats() { /* IDENTICAL 45 lines */ }
```

**Recommendation**: ✅ EXTRACT TO SHARED FACTORY
```typescript
// @games/app-hook-utils/useStats.ts
export function createUseStatsHook(appName: string) {
  const STORAGE_KEY = `${appName}-stats`
  return function useStats() { /* shared implementation */ }
}

// Each app: src/app/useStats.ts
export { useStats } from './useStatsFactory'
import { createUseStatsHook } from '@games/app-hook-utils'
export const useStats = createUseStatsHook('cee-lo')
```

**Impact if Consolidated**: Delete 25 local files, maintain 1 shared factory + 25 one-liners

---

#### 3. `useTheme.ts` — 22 copies

**Status**: NEARLY IDENTICAL (parameterized storage key)  
**Details**:
- Logic: ~95% identical
- Differences: 
  - `STORAGE_KEY = '{app-name}-theme-settings'`
  - App-specific imports: `../domain/layers.ts`, `../domain/sprites.ts`, `../domain/themes.ts`
- Implementation: ~150 lines per copy

**Code Pattern**:
```typescript
const STORAGE_KEY = 'cee-lo-theme-settings'  // ← only difference
const themeLoaders = createSharedThemeLoaders()
let activeThemeStyle: HTMLStyleElement | null = null
const preloadedThemes = new Map<string, string>()
// ... 140+ identical lines
```

**Recommendation**: ✅ EXTRACT TO SHARED FACTORY with domain imports parameterized
```typescript
// @games/app-hook-utils/createUseThemeHook.ts
export function createUseThemeHook(config: {
  appName: string
  layers: LayersModule
  sprites: SpritesModule
  themes: ThemesModule
  defaultSettings: ThemeSettings
}) {
  return function useTheme() { /* shared implementation */ }
}

// Each app: src/app/useTheme.ts
import { createUseThemeHook } from '@games/app-hook-utils'
import { getLayerStack, layerStackToCssVars } from '../domain/layers'
import { getBackgroundCssValue, preloadAllSprites } from '../domain/sprites'
import { COLOR_THEMES, DEFAULT_SETTINGS } from '../domain/themes'
import type { ThemeSettings } from '../domain/types'

export const useTheme = createUseThemeHook({
  appName: 'cee-lo',
  layers: { getLayerStack, layerStackToCssVars },
  sprites: { getBackgroundCssValue, preloadAllSprites },
  themes: { COLOR_THEMES, DEFAULT_SETTINGS },
  defaultSettings: DEFAULT_SETTINGS,
})
```

**Impact if Consolidated**: Delete 22 local files, maintain 1 shared factory + 22 one-liners (10 lines each)

---

### Tier 2: Heavily Duplicated (5-19 copies) — **MEDIUM PRIORITY**

#### 4. `useGame.ts` — 18 copies

**Status**: APP-SPECIFIC (game orchestration logic)  
**Details**:
- Logic: VARIES per game (tic-tac-toe != checkers != mancala)
- No obvious shared pattern
- Range: 80-200 lines per implementation

**Recommendation**: ⚠️ AUDIT INDIVIDUALLY — Check if pattern extraction is possible (e.g., generic game state machine)

**Sub-Types to Investigate**:
- Turn-based games (checkers, tictactoe, chess-like): Could share turn orchestration
- Pile games (mancala, nim): Could share pile manipulation
- Dice games (bunco, cee-lo): Could share dice rolling and scoring patterns

---

#### 5. `useSwipeGesture.ts` — 16 copies

**Status**: DUPLICATED (gesture handling)  
**Details**:
- Logic: Similar swipe detection + distance thresholds
- Variations: Some apps have `useSwipe.ts` (7 copies) for simpler gesture handling
- Implementation: 50-100 lines per copy

**Recommendation**: ✅ CONSOLIDATE into `@games/assets-shared`
- Create `useSwipeGesture()` with configurable threshold
- Create `useSwipe()` as lightweight variant
- Delete all 18 local copies

**Impact if Consolidated**: Delete 18 local files, maintain 2 shared hooks

---

#### 6. `useDropdownBehavior.ts` — 7 copies

**Status**: SHARED ALREADY (but re-implemented locally in some)  
**Details**:
- Some apps have local custom versions
- Should be imported from `@games/assets-shared`
- Recommendation: Same as re-export shim cleanup — delete local copies

**Impact if Consolidated**: Delete 7 local files (already in shared package)

---

### Tier 3: Moderately Duplicated (2-4 copies) — **LOW PRIORITY**

| Hook | Copies | Status | Recommendation |
|------|--------|--------|-----------------|
| `useGameOrchestration.ts` | 2 | App-specific | Audit for shared pattern |
| `useGameBoard.tsx` | 2 | App-specific | Likely unelevated to organisms |
| `useGameStats.ts` | 2 | App-specific | Likely same as useStats |
| `useCpuPlayer.tsx` | 2 | App-specific | Game-specific AI orchestration |
| `useCoinFlipAnimation.ts` | 2 | App-specific | Game-specific (bunco, cee-lo) |
| `useAutoReset.tsx` | 2 | App-specific | Game-specific |
| `useGridKeyboard.tsx` | 2 | App-specific | Game-specific input |
| `useNotificationQueue.tsx` | 2 | Shared candidate | Check if identical |
| `usePrevious.ts` | 2 | React utility | Should be shared |
| `useSeries.tsx` | 2 | App-specific | Game-specific |
| `useSmartPosition.tsx` | 2 | App-specific | UI positioning |
| `useCapacitor.tsx` | 2 | Platform integration | Should be shared |
| `useWebWorker.ts` | 2 | Shared candidate | Check if identical |
| `useTicTacToe.tsx` | 2 | Game-specific | Tic-tac-toe only |

---

## Consolidation Plan (Phases)

### Phase 1: Factory Functions (Weeks 1-2)

**Target**: useSoundEffects, useStats, useTheme  
**Effort**: Medium (create 3 factories, 1-2 days each)  
**Impact**: Free up 70+ files  
**Risk**: Low (logic unchanged, just extracted)

### Phase 2: Gesture Handling (Week 3)

**Target**: useSwipeGesture, useSwipe, useDropdownBehavior  
**Effort**: Medium (consolidate 18 duplicates)  
**Impact**: Free up 18 files  
**Risk**: Low (already partially shared)

### Phase 3: Audit Game-Specific Hooks (Week 4)

**Target**: useGame, useGameOrchestration, etc.  
**Effort**: High (analyze 18+ different implementations)  
**Impact**: Medium (possible 5-10 consolidations)  
**Risk**: Medium (high variation per game)

### Phase 4: Utility Extraction (Week 5)

**Target**: usePrevious, useCapacitor, etc.  
**Effort**: Low (mostly copy-paste)  
**Impact**: Low (5-10 files)  
**Risk**: Low

---

## Estimated Impact

| Phase | Files Freed | New Shared Packages | Effort | ROI |
|-------|-------------|-------------------|--------|-----|
| **Phase 1** | 70 | 3 factories | 3 days | HIGH |
| **Phase 2** | 18 | 2 consolidated | 2 days | HIGH |
| **Phase 3** | 5-10 | 2-3 patterns | 5+ days | MEDIUM |
| **Phase 4** | 5-10 | 3-4 utils | 2 days | MEDIUM |
| **TOTAL** | **98-108** | **10-12** | **12+ days** | **HIGH** |

**Result**: Reduce 200+ app-local hook copies down to **~100 shared + 100 parameterized one-liners**.

---

## Detailed Hook Manifest

### All 26+ Hooks With Duplication Counts

```
26 copies  useSound Effects.ts         [TIER 1] Factory partially done; consolidate variants
25 copies  useStats.ts                 [TIER 1] UNSHARED; extract factory
22 copies  useTheme.ts                 [TIER 1] Nearly identical; extract factory
18 copies  useGame.ts                  [TIER 2] Game-specific; audit individually
16 copies  useSwipeGesture.ts          [TIER 2] Duplicated; consolidate to shared
 7 copies  useSwipe.ts                 [TIER 2] Lighter variant of useSwipeGesture
 7 copies  useDropdownBehavior.ts      [TIER 2] Should be imported from shared
 3 copies  useAppScreens.ts            [Already in shared; delete local]
 2 copies  (each of 10+ hooks)         [TIER 3] Audit individually
 1 copy    (windows, responsive, etc)  [Singleton; leave as-is]
```

---

## Next Steps

1. **Approve** Phase 1 consolidation (3 factories)
2. **Implement** Phase 1 (factories for useSoundEffects, useStats, useTheme)
3. **Update** app barrels to use factory-generated versions
4. **Delete** local duplicates from all 25 apps
5. **Validate** typecheck + tests pass
6. **Iterate** on Phases 2-4

---

## References

- Original analysis: 26 hook files with 2-26 copies each
- Sample verification: cee-lo vs chicago vs bunco (useSoundEffects, useStats, useTheme)
- AGENTS.md § 21 (File Organization)
- NEW-APP-TEMPLATE.md (canonical structure)
