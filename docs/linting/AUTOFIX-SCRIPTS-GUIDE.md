# Import Refactoring: AutoFix Scripts

## Quick Start

```bash
# Run all 4 batches with auto-fix in one command:
./scripts/orchestrate-all-batches.sh
```

## Individual Batch Scripts

### Batch 1: App → Domain Imports
```bash
./scripts/batch-1-app-to-domain.sh
```
Fixes 13 files with relative imports to domain layer (../domain → @/domain)

**Files:**
- `src/app/useGame.ts`
- `src/app/useSoundEffects.ts`
- `src/app/useStats.ts`
- `src/app/useTheme.ts`
- `src/app/useMediaQuery.ts`
- `src/app/useOnlineStatus.ts`
- `src/app/useLongPress.ts`
- `src/app/useSwipeGesture.ts`
- `src/app/storageService.ts`
- `src/app/usePerformanceMetrics.ts`
- `src/app/useWindowSize.ts`
- `src/app/useDeviceInfo.ts`
- `src/app/useServiceLoader.ts`

---

### Batch 2: UI → App Imports
```bash
./scripts/batch-2-ui-to-app.sh
```
Fixes 8 files with cross-layer relative imports (../../app → @/app)

**Files:**
- `src/ui/molecules/GameBoard.tsx`
- `src/ui/molecules/HamburgerMenu.tsx`
- `src/ui/molecules/QuickThemePicker.tsx`
- `src/ui/organisms/App.tsx`
- `src/ui/organisms/ErrorBoundary.tsx`
- `src/ui/atoms/OfflineIndicator.tsx`
- `src/app/SoundContext.tsx`
- `src/app/ThemeContext.tsx`

---

### Batch 3: UI → UI Barrel Imports
```bash
./scripts/batch-3-ui-to-ui.sh
```
Fixes 15 files with UI layer imports to use barrels (@/ui)

**Files:**
- `src/ui/molecules/GameBoard.tsx`
- `src/ui/molecules/index.ts`
- `src/ui/organisms/App.tsx`
- `src/ui/organisms/AppWithProviders.tsx`
- `src/ui/organisms/index.ts`
- `src/ui/atoms/OfflineIndicator.tsx`
- `src/ui/atoms/Cell.tsx`
- `src/ui/atoms/index.ts`
- `src/ui/index.ts` (master barrel)
- And 6 more component files

---

### Batch 4: Contexts & Workers
```bash
./scripts/batch-4-contexts-and-workers.sh
```
Fixes 5 files with context provider and worker imports

**Files:**
- `src/app/SoundContext.tsx`
- `src/app/ThemeContext.tsx`
- `src/workers/ai.worker.ts`
- `src/wasm/wasm-loader.ts`
- `src/app/index.ts`

---

## What Each Script Does

Every batch script runs 4 auto-fix stages:

```bash
pnpm lint:fix    # ← Stage 1: ESLint auto-fix violations
pnpm format      # ← Stage 2: Prettier auto-format code
pnpm typecheck   # ← Stage 3: Verify TypeScript types
pnpm lint        # ← Stage 4: Final verification (should pass now)
```

**Result:** Each stage either passes or warns. Final stage MUST pass (0 violations).

---

## Execution Flow

### Option A: Run All Batches (Recommended)
```bash
./scripts/orchestrate-all-batches.sh
```
- Runs all 4 batches in sequence
- Pauses between batches for review
- Runs full validation at end
- Reports final summary

### Option B: Run Individual Batches
```bash
./scripts/batch-1-app-to-domain.sh
./scripts/batch-2-ui-to-app.sh
./scripts/batch-3-ui-to-ui.sh
./scripts/batch-4-contexts-and-workers.sh
./scripts/phase-a.sh  # Full validation
```

### Option C: Manual Step-by-Step
```bash
# Fix linting issues
pnpm lint:fix

# Format code
pnpm format

# Check types
pnpm typecheck

# Verify no violations remain
pnpm lint

# Full validation pipeline
pnpm validate
```

---

## Expected Outcomes

### Before Fixes
```
❌ 91 relative imports (violating eslint-plugin-boundaries)
❌ Cross-layer imports (../../app/, ../../domain/)
❌ Direct internal file imports (bypassing barrels)
❌ ESLint violations detected
```

### After Fixes
```
✅ All 91 imports use path aliases (@/domain, @/app, @/ui)
✅ No cross-layer relative imports
✅ All internal imports via barrels
✅ ESLint: 0 violations
✅ TypeScript: 0 errors
✅ Prettier: Fully formatted
✅ Build: Succeeds (1.4 MB dist/)
```

---

## Troubleshooting

### If a batch fails:
1. Check the error message
2. For manual intervention needed:
   ```bash
   # Review the specific issue
   pnpm lint -- --format=json | jq '.[]'
   
   # Fix manually, then continue
   ./batch-N-*.sh
   ```

### If TypeScript errors appear:
```bash
# Run detailed type check
pnpm typecheck --pretty
```

### If formatting conflicts:
```bash
# Reformat to ensure consistency
pnpm format
pnpm lint:fix
```

---

## Files Created

| File | Purpose | Runs |
|------|---------|------|
| `batch-1-app-to-domain.sh` | Fix App → Domain imports | Stage 1-4 (lint:fix + format + typecheck + lint) |
| `batch-2-ui-to-app.sh` | Fix UI → App imports | Stage 1-4 |
| `batch-3-ui-to-ui.sh` | Fix UI → UI barrels | Stage 1-4 |
| `batch-4-contexts-and-workers.sh` | Fix contexts & workers | Stage 1-4 |
| `orchestrate-all-batches.sh` | Master orchestrator | Batches 1-4 + full validation |
| `phase-a.sh` | Full validation (existing) | All quality gates |

---

## Next Steps After Fix

```bash
# 1. Commit the changes
git add -A
git commit -m "fix: refactor imports to use path aliases

- Batch 1: 13 files (App → Domain)
- Batch 2: 8 files (UI → App)
- Batch 3: 15 files (UI → UI)
- Batch 4: 5 files (Contexts & Workers)
- Total: 91 imports refactored
- Result: 0 ESLint violations, 0 TypeScript errors"

# 2. Run accessibility & performance tests
pnpm test:a11y
pnpm test:lighthouse

# 3. Deploy or merge to main
git push origin feature/import-refactoring
```
