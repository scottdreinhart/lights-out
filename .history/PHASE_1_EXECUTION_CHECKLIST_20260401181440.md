# Phase 1 Execution: Extract & Unify Shared Hooks

**Date**: 2026-04-01  
**Status**: 🎯 IN PROGRESS - Starting Consolidation

---

## Current State Assessment

### ✅ Already Exists

- `@games/app-hook-utils` package (complete with 30+ shared hooks)
- Hooks properly exported via barrel (index.ts)
- lights-out app using shared hooks correctly
- Shared package structure ready

### 🔴 Problem Identified

- **25 apps** (tictactoe, nim, etc.) maintain LOCAL copies of hooks
- Apps NOT importing from `@games/app-hook-utils`
- Example: tictactoe has local useSoundEffects.ts instead of using shared
- Duplication: useStats.ts, useSoundEffects.ts, etc. copied 25+ times

### 📋 Phase 1 Real Work

Not "create new package" → but "**migrate apps to USE existing shared package**"

---

## Phase 1 Execution Plan

### Step 1: Identify All Apps with Local Hook Duplication

```bash
# Apps that have local copies instead of using @games/app-hook-utils
# Pattern: Find apps with useStats.ts and compare to lights-out
```

**Target Apps with Local Hooks** (based on earlier audit):

- tictactoe (has 30 local hooks)
- nim (has 17 local hooks)
- snake (needs verification)
- minesweeper (needs verification)
- And ~20+ others

### Step 2: Categorize Hooks by Type

**Category A: Shared Utility Hooks** (move to @games/app-hook-utils if not there)

- useResponsiveState
- useKeyboardControls
- useStats
- useSoundController
- useDropdownBehavior
- And 25+ others already in app-hook-utils

**Category B: Game-Specific Hooks** (keep in app, but import shared pieces)

- useTicTacToe (ti ctactoe-specific)
- useGameBoard (game-specific)
- useCpuPlayer (game-specific)
- useGameOrchestration (game-specific)

**Category C: Platform Hooks** (might move to app-hook-utils)

- useCapacitor
- useElectron
  -usePlatform

### Step 3: Priority Order for Migration

**Priority 1 POC Apps** (Start with 2-3 apps as proof-of-concept):

1.  tictactoe (30 local hooks, well-documented)
2.  nim (17 local hooks)
3.  lights-out (already correct, use as reference)

**Priority 2 Batch** (if POC successful):

- Next 10 apps (battleship, snake, minesweeper, etc.)

**Priority 3 Completion**:

- Remaining 12-15 apps

### Step 4: Migration Template (Using TicTacToe as Example)

**Current State** (tictactoe):

```
apps/tictactoe/src/app/
├── index.ts (exports 30 local hooks)
├── useStats.ts (local copy)
├── useSoundEffects.ts (local copy)
├── useAutoReset.ts (local copy)
└── ... (27 other local hooks)
```

**Target State** (tictactoe after Phase 1):

```
apps/tictactoe/src/app/
├── index.ts (exports: shared hooks + game-specific hooks)
├── hooks/
│   ├── index.ts (barrel for tictactoe-specific hooks)
│   ├── useTicTacToe.ts (keep)
│   ├── useCpuPlayer.ts (keep)
│   ├── useGameBoard.ts (keep)
│   └── ... (other game-specific hooks)
├── context/
│   ├── index.ts
│   └── [game-specific contexts, keep Shared ThemeContext/SoundContext imports]
└── [Delete local copies of shared hooks]

// Top-level index.ts becomes:
export * from '@games/app-hook-utils'  // Get 30+ shared hooks
export * from './context'               // Game-specific context
export * from './hooks'                 // Game-specific hooks
```

### Step 5: Implementation Steps for Each App

For **tictactoe** (example - repeat for each app):

1. **Audit Phase** (30 min):
   - List all hooks in tictactoe/src/app/
   - Categorize which are "local" vs which could be shared
   - Identify which are already in @games/app-hook-utils

2. **Plan Phase** (30 min):
   - Map 1:1: "local hook" → location in @games/app-hook-utils
   - Identify any missing shared hooks
   - List game-specific hooks to keep local

3. **Extract Game-Specific Hooks** (1-2 hrs):
   - Create apps/tictactoe/src/app/hooks/ directory
   - Move game-specific hooks there (useTicTacToe, useCpuPlayer, etc.)
   - Keep only game-specific code

4. **Delete Local Shared Hook Copies** (30 min):
   - Remove useStats.ts (use from @games/app-hook-utils)
   - Remove useSoundEffects.ts (use from @games/app-hook-utils)
   - Remove useResponsiveState.ts (use from @games/app-hook-utils)
   - Delete/consolidate for ALL shared hooks

5. **Update app/index.ts** (30 min):

   ```ts
   // Export shared hooks from package
   export * from '@games/app-hook-utils'

   // Export game-specific
   export * from './context'
   export * from './hooks' // Only game-specific hooks here
   ```

6. **Verify Imports** (1-2 hrs):
   - Update any component that imports from local files
   - Change: `import { useStats } from '../useStats'`
   - To: `import { useStats } from '@games/app-hook-utils'`

7. **Test** (1 hr):
   - `cd apps/tictactoe && pnpm typecheck` ✅
   - `cd apps/tictactoe && pnpm lint` ✅
   - Manual: Start game, verify functionality

8. **Commit** (5 min):
   ```bash
   git commit "refactor(apps/tictactoe): Consolidate hooks, use @games/app-hook-utils"
   ```

### Step 6: Check for Missing Shared Hooks

If any app has a hook NOT in @games/app-hook-utils:

**Option A**: Add it to @games/app-hook-utils (if truly shared)

```ts
// packages/app-hook-utils/src/newHook.ts
export function useNewHook() { ... }

// packages/app-hook-utils/src/index.ts
export { useNewHook } from './useNewHook'
```

**Option B**: Keep it as game-specific (if only one game uses it)

```typescript
// apps/GAME/src/app/hooks/useGameSpecific.ts
export function useGameSpecific() { ... }
```

---

## Execution Timeline - Week 1 (April 1-5)

- **Mon 4/1 (3-4 hrs)**: tictactoe consolidation (POC #1)
- **Tue 4/2 (2-3 hrs)**: nim consolidation (POC #2)
- **Tue 4/2 (1-2 hrs)**: lights-out verification (reference point)
- **Wed 4/3 (3-4 hrs)**: Batch consolidation (next 5-10 apps)
- **Wed 4/3 (1-2 hrs)**: Quality gate validation
- **Thu 4/4**: Continue batch consolidation if needed
- **Fri 4/5**: Final validation across all 26+ apps

---

## Success Criteria - Phase 1 Complete

✅ **tictactoe**: Uses @games/app-hook-utils, local copy only game-specific hooks  
✅ **nim**: Same structure as tictactoe  
✅ **lights-out**: Remains clean reference  
✅ **10+ apps**: Consolidated and using shared hooks  
✅ **All consolidated apps**: Pass typecheck + lint  
✅ **Duplication**: Reduced from 25+ copies to 1 shared source  
✅ **Commit**: Single clean commit per app, traceable history

---

## Potential Blockers & Solutions

| Blocker                              | Solution                                   |
| ------------------------------------ | ------------------------------------------ |
| Hook has different signature per app | Parameterize in shared, pass config        |
| Game-specific custom hook            | Keep in game's app/ as category B          |
| Import cycle errors                  | Verify careful import ordering in index.ts |
| Test failures after consolidation    | Check component imports use new path       |

---

## Notes

- This Phase 1 is about **consolidation** not creating new packages
- @games/app-hook-utils already exists and is complete
- Focus: Move apps from "duplicate" → "reference shared"
- Estimated actual time: 10-15 hours across all 26 apps
- Risk level: LOW (phased, reversible per app)

---

## Commands You'll Use Repeatedly

```bash
# 1. Identify local hooks in an app
cd apps/APPNAME && find src/app -maxdepth 1 -name "use*.ts" -o -name "use*.tsx"

# 2. Check what's in app-hook-utils
grep "export { use" packages/app-hook-utils/src/index.ts

# 3. Verify types after consolidation
cd apps/APPNAME && pnpm typecheck

# 4. Lint the app
cd apps/APPNAME && pnpm lint

# 5. Test the app still works
cd apps/APPNAME && pnpm dev  # Then manually verify gameplay
```

---

**Ready to start with tictactoe? Let me know and I'll walk through the POC consolidation step-by-step.**
