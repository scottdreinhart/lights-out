# Wave A Phase 1: Factory Consolidation Implementation Plan

**Scope**: Create 3 shared factories to eliminate 70+ duplicate hook copies  
**Target Hooks**: useSoundEffects, useStats, useTheme  
**Timeline**: 3 days (1 day per factory)  
**Risk**: Low (logic unchanged, tested before deletion)

---

## Overview: Factory Pattern Architecture

Each hook moves from **app-local implementation** → **shared factory** + **parameterized one-liner app-local version**:

```typescript
// BEFORE (app-local, duplicated 25x):
export function useStats() {
  const STORAGE_KEY = 'cee-lo-stats'  // Only difference
  // ... 45 identical lines
}

// AFTER (shared factory + app-local one-liner):
// @games/app-hook-utils/factories/createUseStatsHook.ts
export function createUseStatsHook(appName: string) {
  const STORAGE_KEY = `${appName}-stats`
  return function useStats() { /* 45 lines */ }
}

// src/app/useStats.ts (5 lines)
import { createUseStatsHook } from '@games/app-hook-utils'
export const useStats = createUseStatsHook('cee-lo')
```

---

## Factory 1: `createUseStatsHook(appName)`

### Current State

**Apps Affected**: 25 (all games)  
**Current Files**: 
- `apps/cee-lo/src/app/useStats.ts` (47 lines)
- `apps/chicago/src/app/useStats.ts` (47 lines, identical)
- ... (23 more copies, all identical)

**Logic Duplicated**:
```typescript
const STORAGE_KEY = '{app-name}-stats'

export function useStats() {
  const [stats, setStats] = useState<GameStats>(() =>
    load(STORAGE_KEY, DEFAULT_STATS)
  )

  const recordWin = useCallback(() => {
    const updated = { ...stats, wins: stats.wins + 1, streak: stats.streak + 1 }
    setStats(updated)
    save(STORAGE_KEY, updated)
  }, [stats])

  const recordLoss = useCallback(() => {
    const updated = { ...stats, losses: stats.losses + 1, streak: 0 }
    setStats(updated)
    save(STORAGE_KEY, updated)
  }, [stats])

  const resetStats = useCallback(() => {
    setStats(DEFAULT_STATS)
    save(STORAGE_KEY, DEFAULT_STATS)
  }, [stats])

  return { stats, recordWin, recordLoss, resetStats }
}
```

### Implementation Steps

#### Step 1a: Create Shared Factory

**File**: `@games/app-hook-utils/factories/createUseStatsHook.ts`

```typescript
import { useCallback, useState } from 'react'

// Re-export types from core-types
export type { GameStats, StatsPersistence } from '@games/core-types'

/**
 * Factory: Creates a useStats hook configured for a specific app's storage key.
 * 
 * Logic is identical across all games; only storage key differs.
 * 
 * @param appName - App identifier (used to generate storage key)
 * @returns Configured useStats hook
 * 
 * @example
 * export const useStats = createUseStatsHook('cee-lo')
 */
export function createUseStatsHook(appName: string) {
  const STORAGE_KEY = `${appName}-stats`
  
  // Load/save helpers
  const load = (key: string, fallback: GameStats): GameStats => {
    try {
      const stored = localStorage.getItem(key)
      return stored ? JSON.parse(stored) : fallback
    } catch {
      return fallback
    }
  }

  const save = (key: string, data: GameStats): void => {
    try {
      localStorage.setItem(key, JSON.stringify(data))
    } catch (e) {
      console.error('Failed to save stats:', e)
    }
  }

  // Shared hook implementation
  return function useStats() {
    const [stats, setStats] = useState<GameStats>(() =>
      load(STORAGE_KEY, DEFAULT_STATS)
    )

    const recordWin = useCallback(() => {
      const updated = {
        ...stats,
        wins: stats.wins + 1,
        streak: stats.streak + 1,
        updated: new Date().toISOString(),
      }
      setStats(updated)
      save(STORAGE_KEY, updated)
    }, [stats])

    const recordLoss = useCallback(() => {
      const updated = {
        ...stats,
        losses: stats.losses + 1,
        streak: 0,
        updated: new Date().toISOString(),
      }
      setStats(updated)
      save(STORAGE_KEY, updated)
    }, [stats])

    const resetStats = useCallback(() => {
      const reset = { ...DEFAULT_STATS, updated: new Date().toISOString() }
      setStats(reset)
      save(STORAGE_KEY, reset)
    }, [stats])

    return { stats, recordWin, recordLoss, resetStats }
  }
}

const DEFAULT_STATS = {
  wins: 0,
  losses: 0,
  streak: 0,
  updated: new Date().toISOString(),
}
```

#### Step 1b: Update `@games/app-hook-utils/index.ts`

**Add to barrel**:
```typescript
export { createUseStatsHook } from './factories/createUseStatsHook'
export type { GameStats } from './factories/createUseStatsHook'
```

#### Step 1c: Update Each App's `src/app/useStats.ts`

**Example for cee-lo** (apply to all 25 apps):

**BEFORE** (47 lines):
```typescript
import { useCallback, useState } from 'react'
import type { GameStats } from '@/domain/types'
import { load, save } from '@/app/storageService'

const STORAGE_KEY = 'cee-lo-stats'
const DEFAULT_STATS: GameStats = { wins: 0, losses: 0, streak: 0 }

export function useStats() { /* 40+ lines */ }
```

**AFTER** (5 lines):
```typescript
import { createUseStatsHook } from '@games/app-hook-utils'

export const useStats = createUseStatsHook('cee-lo')
```

#### Step 1d: Validation Checklist

- [ ] Factory created and exported from `@games/app-hook-utils`
- [ ] Tests pass: `pnpm typecheck` (no type errors)
- [ ] Tests pass: `pnpm test useStats.test.ts` (if tests exist)
- [ ] All 25 apps updated
- [ ] No import errors in any app
- [ ] Delete all original `useStats.ts` files after validation

---

## Factory 2: `createUseThemeHook(config)`

### Current State

**Apps Affected**: 22 apps  
**Current Implementation Size**: 150+ lines per copy (mostly identical)  
**Key Difference**: Storage key only (`{app-name}-theme-settings`)

### Implementation Steps

#### Step 2a: Create Shared Factory

**File**: `@games/app-hook-utils/factories/createUseThemeHook.ts`

```typescript
import { useEffect, useMemo, useState, useCallback } from 'react'
import type { ThemeSettings } from '@games/core-types'

export interface UseThemeFactoryConfig {
  appName: string
  defaultSettings: ThemeSettings
}

/**
 * Factory: Creates a useTheme hook with app-specific storage key.
 * 
 * Handles theme switching, CSS variable syncing, and persistence.
 * ~95% of app-local implementations are identical; only defaultSettings and appName differ.
 * 
 * @param config - App-specific configuration
 * @returns Configured useTheme hook
 * 
 * @example
 * export const useTheme = createUseThemeHook({
 *   appName: 'cee-lo',
 *   defaultSettings: DEFAULT_SETTINGS,
 * })
 */
export function createUseThemeHook({ appName, defaultSettings }: UseThemeFactoryConfig) {
  const STORAGE_KEY = `${appName}-theme-settings`

  return function useTheme() {
    const [settings, setSettings] = useState<ThemeSettings>(() => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY)
        return stored ? JSON.parse(stored) : defaultSettings
      } catch {
        return defaultSettings
      }
    })

    // Persist theme preference
    useEffect(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
      } catch (e) {
        console.error('Failed to save theme:', e)
      }
    }, [settings])

    // Apply CSS variables to document
    useEffect(() => {
      const cssVars = convertThemeSettingsToCssVars(settings)
      Object.entries(cssVars).forEach(([key, value]) => {
        document.documentElement.style.setProperty(key, value)
      })
    }, [settings])

    // Apply theme stylesheet (link tag)
    useEffect(() => {
      applyThemeStylesheet(settings.theme)
    }, [settings.theme])

    const updateTheme = useCallback((theme: string) => {
      setSettings((prev) => ({ ...prev, theme }))
    }, [])

    const updateMode = useCallback((mode: 'light' | 'dark') => {
      setSettings((prev) => ({ ...prev, mode }))
    }, [])

    const updateColorblind = useCallback((colorblindMode: string | null) => {
      setSettings((prev) => ({ ...prev, colorblindMode }))
    }, [])

    return {
      settings,
      updateTheme,
      updateMode,
      updateColorblind,
    }
  }
}

// Helper: Apply theme stylesheet
function applyThemeStylesheet(themeName: string): void {
  const existingLink = document.getElementById('theme-stylesheet')
  
  if (existingLink) {
    existingLink.remove()
  }

  const link = document.createElement('link')
  link.id = 'theme-stylesheet'
  link.rel = 'stylesheet'
  link.href = `/themes/${themeName}.css`
  document.head.appendChild(link)
}

// Helper: Convert theme settings to CSS variables
function convertThemeSettingsToCssVars(settings: ThemeSettings): Record<string, string> {
  return {
    '--color-primary': settings.colorblindMode === 'deuteranopia'
      ? 'var(--color-primary-safe)'
      : 'var(--color-primary-default)',
    '--color-page-bg': settings.mode === 'dark'
      ? 'var(--color-dark-bg)'
      : 'var(--color-light-bg)',
    // ... more mappings based on settings
  }
}
```

#### Step 2b: Update Each App

**Apply to all 22 apps**. Example for cee-lo:

**BEFORE** (150+ lines):
```typescript
import { useEffect, useState, useCallback } from 'react'
import type { ThemeSettings } from '@/domain/types'

const STORAGE_KEY = 'cee-lo-theme-settings'
const DEFAULT_SETTINGS: ThemeSettings = { /* ... */ }

export function useTheme() { /* 140+ lines */ }
```

**AFTER** (8 lines):
```typescript
import { createUseThemeHook } from '@games/app-hook-utils'
import { DEFAULT_SETTINGS } from '@/domain/themes'

export const useTheme = createUseThemeHook({
  appName: 'cee-lo',
  defaultSettings: DEFAULT_SETTINGS,
})
```

#### Step 2c: Validation Checklist

- [ ] Factory created and exported from `@games/app-hook-utils`
- [ ] CSS-variable application logic verified in shared factory
- [ ] Theme stylesheet loading verified
- [ ] All 22 apps updated
- [ ] `pnpm typecheck` passes across all apps
- [ ] Visual inspection: theme switching still works in at least 3 apps
- [ ] Delete original files after validation

---

## Factory 3: `createUseSoundEffectsHook()` — Variants

### Current State

**Apps Affected**: 26 total
  - **Group A** (10 apps using factory): cee-lo, chicago, cho-han, liars-dice, mexico, pig, farkle, rock-paper-scissors, connect-four, snake
    - Already use: `createUseSoundEffectsHook()` from `@games/app-hook-utils`
    - Implementation: 23 lines (factory pattern)
    - **Action**: DELETE local copies (no changes needed)
  
  - **Group B** (4 apps with custom sounds): bunco, cee-lo, farkle, minceminesweeper
    - Custom sound lists extending base (`onDiceRoll`, `onBunco`, etc.)
    - Implementation: 40-50 lines (manual implementation)
    - **Action**: Create `createGameSpecificSoundEffectsHook()` factory variant

### Implementation Steps

#### Step 3a: Clean Up Group A (10 apps)

**Apps**: cee-lo, chicago, cho-han, liars-dice, mexico, pig, farkle, rock-paper-scissors, connect-four, snake

**Current State**: Already have local `useSoundEffects.ts` that calls factory from shared package

**Action**:
1. Verify each app's `useSound Effects.ts` is a one-liner calling factory ✓
2. Delete the local file
3. Update app barrel to re-export from `@games/app-hook-utils` instead:

**Example app barrel update** (src/app/index.ts):
```typescript
// BEFORE
export { useSoundEffects } from './useSoundEffects'

// AFTER
export { useSoundEffects as useSoundEffects } from '@games/app-hook-utils'
// OR just let consumers import directly from @games/app-hook-utils
```

#### Step 3b: Create Group B Variant Factory

**Apps Needing Custom Variant**: bunco, cee-lo (if has custom dice), farkle (if has custom sounds), etc.

**File**: `@games/app-hook-utils/factories/createGameSpecificSoundEffectsHook.ts`

```typescript
import { useCallback } from 'react'
import { useSoundContext } from '@/app/SoundContext'
import type { SoundEffectsHook } from '@games/core-types'

export interface GameSoundMap {
  select?: string
  confirm?: string
  move?: string
  win?: string
  lose?: string
  [key: string]: string | undefined  // Allow custom sounds
}

/**
 * Variant factory: Creates a useGameSoundEffects hook with custom sound mappings.
 * 
 * Use this for games that have app-specific sound effects (e.g., onDiceRoll for bunco).
 * 
 * @param appName - App identifier
 * @param soundMap - Mapping of sound name to sound asset path
 * @returns Configured hook
 */
export function createGameSpecificSoundEffectsHook(
  appName: string,
  soundMap: GameSoundMap,
) {
  return function useSoundEffects() {
    const { playSound } = useSoundContext()

    const effects: SoundEffectsHook = {
      onSelect: useCallback(() => {
        if (soundMap.select) playSound(soundMap.select)
      }, [playSound]),

      onConfirm: useCallback(() => {
        if (soundMap.confirm) playSound(soundMap.confirm)
      }, [playSound]),

      onMove: useCallback(() => {
        if (soundMap.move) playSound(soundMap.move)
      }, [playSound]),

      onWin: useCallback(() => {
        if (soundMap.win) playSound(soundMap.win)
      }, [playSound]),

      onLose: useCallback(() => {
        if (soundMap.lose) playSound(soundMap.lose)
      }, [playSound]),

      // Custom sounds for game-specific events
      onCustom: useCallback((soundName: string) => {
        const path = soundMap[soundName]
        if (path) playSound(path)
      }, [playSound, soundMap]),
    }

    return effects
  }
}
```

#### Step 3c: Update Group B Apps

**Example: bunco**

**BEFORE** (44 lines):
```typescript
import { useCallback } from 'react'
import { useSoundContext } from '@/app/SoundContext'

export function useSoundEffects() {
  const { playSound } = useSoundContext()
  return {
    onSelect: useCallback(() => playSound(playSelect), [playSound]),
    onConfirm: useCallback(() => playSound(playConfirm), [playSound]),
    onDiceRoll: useCallback(() => playSound(playDiceRoll), [playSound]),  // Custom
    onBunco: useCallback(() => playSound(playBunco), [playSound]),        // Custom
    // ... more lines
  }
}
```

**AFTER** (6 lines):
```typescript
import { createGameSpecificSoundEffectsHook } from '@games/app-hook-utils'
import * as sounds from '../sounds'

export const useSoundEffects = createGameSpecificSoundEffectsHook('bunco', {
  select: sounds.playSelect,
  confirm: sounds.playConfirm,
  diceRoll: sounds.playDiceRoll,    // Custom
  bunco: sounds.playBunco,          // Custom
})
```

#### Step 3d: Validation Checklist

- [ ] Group A: All 10 apps have factory-based `useSoundEffects` verified
- [ ] Group A: Local files deleted from all 10 apps
- [ ] Group B: Variant factory created and exported
- [ ] Group B: All 4 apps updated with variant factory
- [ ] `pnpm typecheck` passes across all 16 modified apps
- [ ] Sound effects tests pass (if exist)
- [ ] Manual test: Play sounds in at least 3 apps (base + variant + custom)
- [ ] All 16 original files deleted after validation

---

## Implementation Sequence

### Day 1: useStats Factory
1. **Morning**: Create factory → validate → merge to shared package
2. **Afternoon**: Update all 25 apps → delete originals
3. **EOD**: Validate: `pnpm typecheck` passes across all 25 apps

### Day 2: useTheme Factory
1. **Morning**: Create factory → validate
2. **Afternoon**: Update all 22 apps → delete originals
3. **EOD**: Validate: `pnpm typecheck` + manual theme switching test on 3 apps

### Day 3: useSoundEffects Cleanup & Variant
1. **Morning**: Delete Group A files (10 apps) → verify imports still work
2. **Midday**: Create Group B variant factory
3. **Afternoon**: Update Group B apps → delete originals
4. **EOD**: Validate: `pnpm typecheck` + sound test on 3-4 apps

---

## Files to Delete (Post-Validation)

### useStats (25 files)
```
apps/cee-lo/src/app/useStats.ts
apps/chicago/src/app/useStats.ts
apps/bunco/src/app/useStats.ts
... (22 more)
```

### useTheme (22 files)
```
apps/cee-lo/src/app/useTheme.ts
apps/chicago/src/app/useTheme.ts
... (20 more)
```

### useSoundEffects (16 files)
```
# Group A (10 files to delete)
apps/cee-lo/src/app/useSoundEffects.ts
apps/chicago/src/app/useSoundEffects.ts
... (8 more)

# Group B (6 files to update, not delete)
apps/bunco/src/app/useSoundEffects.ts
... (3 more updated, not deleted)
```

**Total**: 63 files deleted, 4 files replaced with 2-6 liners

---

## Success Metrics

- ✅ All factories created and exported from `@games/app-hook-utils`
- ✅ All 25 apps use useStats factory
- ✅ All 22 apps use useTheme factory
- ✅ All 16 sound apps use sound factory (variants)
- ✅ 63 duplicate local files deleted
- ✅ `pnpm typecheck` passes globally
- ✅ No breaking changes (same hooks, same return types)
- ✅ Less code duplication (estimated 600+ lines eliminated)

---

## Rollback Plan

If validation fails:
1. Restore deleted files from git
2. Revert factory implementations
3. Identify root cause
4. Fix and retry

(Low risk: No logic changes, only extraction)

---

## Post-Phase-1 Status

After Phase 1 completion:
- 70+ duplicate files consolidated
- 3 new factories established in `@games/app-hook-utils`
- Estimated 600+ lines of duplicate code eliminated
- Ready for Phase 2 (gesture consolidation) and Phase 3 (game hook audit)
