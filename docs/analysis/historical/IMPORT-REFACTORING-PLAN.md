> Historical note: This document is archived and read-only for historical context; do not update it as active implementation guidance.

# Relative Imports Refactoring — Fix Catalog

## Fact Check (2026-03-16)

This document is a historical planning snapshot and not a current-state report.

Verified current state:

- The repository no longer matches the original “91 relative imports” baseline.
- Current `src/**/*.{ts,tsx}` includes a small set of internal `../` imports (5 matches), mostly intra-layer app internals.
- No `from '../../'` style cross-layer relative imports were found in `src/**/*.{ts,tsx}` during this verification pass.
- Path aliases (`@/domain`, `@/app`, `@/ui`) are in active use across the codebase.
- Referenced batch scripts in this plan exist under `scripts/` (`scripts/batch-1-app-to-domain.sh` … `scripts/batch-4-contexts-and-workers.sh`, `scripts/orchestrate-all-batches.sh`).

Use this file for historical rationale, not for current migration counts.

## Overview
Historical snapshot: originally found **91 relative imports** to convert to **path aliases** (@/domain, @/app, @/ui).

## By Category

### 1. Cross-Layer Violations (MOST CRITICAL)
These violate eslint-plugin-boundaries rules:

#### ThemeContext.tsx
```
❌ import { useTheme } from '../hooks/useTheme'
✅ import { useTheme } from '@/app'  (from barrel)
```

#### QuickThemePicker.tsx
```
❌ import { GameBoard } from '../GameBoard'
✅ import { GameBoard } from '@/ui'  (from molecules barrel)

❌ import { useTheme } from '../../app/hooks/useTheme'
✅ import { useTheme } from '@/app'  (from barrel)
```

#### useGame.ts
```
❌ import { movePlayer, ..., getWinner } from '../domain/rules'
✅ import { movePlayer, ..., getWinner } from '@/domain'  (from barrel)

❌ import { BOARD_SIZE, ... } from '../domain/constants'
✅ import { BOARD_SIZE, ... } from '@/domain'  (from barrel)
```

#### ui/molecules/index.ts
```
❌ export { GameBoard } from './GameBoard'
✅ (correct - internal exports are OK)
```

### 2. App Layer → Domain (CRITICAL)
Multiple files importing domain with relative paths:

**Files affected:**
- useSoundEffects.ts
- useStats.ts
- useTheme.ts
- useGame.ts
- useOnlineStatus.ts
- useLongPress.ts
- useSwipeGesture.ts
- useMediaQuery.ts
- storageService.ts

**Pattern:**
```
❌ import { SOUNDS } from '../domain/constants'
✅ import { SOUNDS } from '@/domain'
```

### 3. UI Layer → App (CRITICAL)
Components importing hooks and context with relative paths:

**Files affected:**
- organisms/App.tsx
- organisms/ErrorBoundary.tsx
- molecules/HamburgerMenu.tsx
- molecules/GameBoard.tsx
- atoms/OfflineIndicator.tsx

**Pattern:**
```
❌ import { useTheme } from '../../app/hooks/useTheme'
✅ import { useTheme } from '@/app'

❌ import { ThemeContext } from '../../app/context/ThemeContext'
✅ import { ThemeContext } from '@/app'
```

### 4. Internal Imports (SHOULD NOT HAPPEN)
These bypass barrels and directly import internal files:

**Examples:**
```
❌ import { useTheme } from '../../app/hooks/useTheme'
✅ import { useTheme } from '@/app'  (barrel exports useTheme)

❌ import { GameBoard } from '../GameBoard'
✅ import { GameBoard } from '@/ui'  (barrel exports GameBoard)
```

### 5. UI Layer → UI Layer (SHOULD BE RELATIVE OR VIA BARREL)
Internal UI imports can stay relative IF they're sibling imports, but should use barrels for cross-hierarchy imports:

**OK (siblings):**
```
✅ import { Cell } from './Cell'  (same directory)
✅ import { ... } from '../atoms'  (parent barrel - consider @/ui instead)
```

**Should be via @/ui:**
```
❌ import { GameBoard } from '../GameBoard'
✅ import { GameBoard } from '@/ui'  (barrel)

❌ import { Cell } from '../../atoms/Cell'
✅ import { Cell } from '@/ui'  (barrel)
```

## Fix Strategy

### Batch 1: App Layer → Domain (HIGH PRIORITY)
13 files, ~25 replacements

### Batch 2: UI Layer → App/Domain (HIGH PRIORITY)
8 files, ~20 replacements

### Batch 3: UI Layer → UI (MEDIUM PRIORITY)
15 files, ~30 replacements

### Batch 4: Cross-Layer Context Imports (HIGH PRIORITY)
6 files, ~12 replacements

### Batch 5: Worker Imports (CRITICAL)
2 files (ai.worker.ts, wasm-loader.ts)

## Execution Plan

1. **Verify barrels export correctly** before fixing imports
2. **Run Batch 1** (App → Domain) - use multi_replace_string_in_file
3. **Run Batch 2** (UI → App) - use multi_replace_string_in_file
4. **Run Batch 3** (UI → UI layer) - use multi_replace_string_in_file
5. **Verify with pnpm lint** after each batch
6. **Final validation: pnpm validate** (full gate)

## Expected Outcome

```
After fixes:
✅ All 91 imports use path aliases or appropriate relative paths
✅ No cross-layer relative imports (../../)
✅ All internal imports via barrels only
✅ ESLint: 0 violations
✅ TypeScript: 0 errors
✅ Build: Succeeds (1.4 MB dist/)
✅ No performance regression
```

## Files to NOT Change

```
✅ src/themes/*.css (pure CSS, no imports)
✅ src/workers/*.ts (special: only import @/domain)
✅ src/wasm/*.ts (data-only base64 string)
✅ electron/*.js (desktop context, different rules)
✅ assembly/*.ts (AssemblyScript, different language)
✅ public/* (static assets)
✅ build/* (generated files)
✅ dist/* (build output, gitignored)
```
