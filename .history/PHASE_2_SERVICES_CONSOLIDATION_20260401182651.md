# Phase 2: Services Consolidation & Extraction

**Date**: 2026-04-01  
**Status**: 🎯 Ready to Execute  
**Timeline**: 2-3 hours (4 concrete targets)  
**Estimated Duplication Savings**: ~96KB (25 copies × ~4KB per file)

---

## Problem Statement

**25 copies of critical services exist across apps**, creating maintenance burden and inconsistency:

| Service               | Copies | Priority  | Location                   | Action                              |
| --------------------- | ------ | --------- | -------------------------- | ----------------------------------- |
| **storageService.ts** | 25     | 🔴 HIGH   | `apps/*/src/app/services/` | Extract to `@games/shared-services` |
| **crashLogger.ts**    | 25     | 🟡 MEDIUM | `apps/*/src/app/services/` | Extract to `@games/shared-services` |
| **SoundContext.tsx**  | 26     | 🟡 MEDIUM | `apps/*/src/app/context/`  | Extract to `@games/shared-context`  |
| **ThemeContext.tsx**  | 26     | 🟡 MEDIUM | `apps/*/src/app/context/`  | Extract to `@games/shared-context`  |

---

## Phase 2 Goals

✅ Extract 4 critical files into 2 shared packages  
✅ Update 26+ apps to import from shared packages  
✅ Standardize service implementations across platform  
✅ Reduce duplication by ~96KB+ (4KB × 25 copies)

---

## Execution Plan (4 Parts)

### PART 1: Audit Current Implementations (20 min)

**Goal**: Understand variance in implementations before consolidating

**Step 1.1**: Check storageService.ts across 3 representative apps

```bash
# Check structure and method signatures
for app in apps/tictactoe apps/nim apps/battleship; do
  echo "=== $app ==="
  head -20 "$app/src/app/services/storageService.ts"
done
```

Expected: All should have similar interface (loadGameStats, saveGameStats, loadSettings, saveSettings, etc.)

**Step 1.2**: Check crashLogger.ts across 3 apps

```bash
for app in apps/tictactoe apps/nim apps/battleship; do
  echo "=== $app ==="
  head -20 "$app/src/app/services/crashLogger.ts"
done
```

Expected: All should wrap `console.error` and optionally send to analytics

**Step 1.3**: Check context files

```bash
for app in apps/tictactoe apps/nim apps/battleship; do
  echo "=== SoundContext in $app ==="
  head -30 "$app/src/app/context/SoundContext.tsx" | head -5
  echo ""
done
```

Expected: All should have similar provider pattern with toggleSound(), playSound() methods

---

### PART 2: Create @games/shared-services Package (20 min)

**Goal**: Create shared package for common services

**2.1 Create package structure**:

```bash
mkdir -p packages/shared-services/src
touch packages/shared-services/src/index.ts
touch packages/shared-services/package.json
```

**2.2 Create package.json**:

```json
{
  "name": "@games/shared-services",
  "version": "1.0.0",
  "type": "module",
  "main": "./src/index.ts",
  "exports": {
    ".": "./src/index.ts"
  },
  "dependencies": {},
  "peerDependencies": {}
}
```

**2.3 Extract storageService.ts**:

- Copy representative implementation from tictactoe (cleanest)
- Place in `packages/shared-services/src/storageService.ts`
- Update imports in storageService.ts to use type definitions from `@/domain`
- Export from `packages/shared-services/src/index.ts`

**2.4 Extract crashLogger.ts**:

- Copy from nim (has good logging structure)
- Place in `packages/shared-services/src/crashLogger.ts`
- Export from index.ts
- Add JSDoc with usage examples

**2.5 Update package.json exports**:

```typescript
// packages/shared-services/src/index.ts
export { storageService } from './storageService'
export { crashLogger } from './crashLogger'
```

---

### PART 3: Create @games/shared-context Package (20 min)

**Goal**: Create shared package for common context providers

**3.1 Create package structure**:

```bash
mkdir -p packages/shared-context/src/{context,hooks}
touch packages/shared-context/src/index.ts
touch packages/shared-context/package.json
```

**3.2 Create package.json**:

```json
{
  "name": "@games/shared-context",
  "version": "1.0.0",
  "type": "module",
  "main": "./src/index.ts",
  "dependencies": {
    "react": "^19.2.4"
  },
  "peerDependencies": {
    "react": "^19.2.4"
  }
}
```

**3.3 Extract SoundContext.tsx**:

- Copy from tictactoe
- Place in `packages/shared-context/src/context/SoundContext.tsx`
- Create corresponding hook: `packages/shared-context/src/hooks/useSoundContext.ts`
- Export both from index.ts

**3.4 Extract ThemeContext.tsx**:

- Copy from tictactoe
- Place in `packages/shared-context/src/context/ThemeContext.tsx`
- Create hook: `packages/shared-context/src/hooks/useThemeContext.ts`
- Export both from index.ts

**3.5 Update monorepo pnpm-workspace.yaml** (if needed):

```yaml
packages:
  - 'packages/*'
```

---

### PART 4: Update 26+ Apps to Import from Shared (60 min)

**Goal**: Replace local implementations with imports from shared packages

**4.1 Update storageService imports** (Template pattern):

For each app in `apps/*/`:

**Before**:

```typescript
// apps/tictactoe/src/app/services/storageService.ts
export const storageService = { ... }
```

**After** (delete the file and add import):

```typescript
// apps/tictactoe/src/app/services/index.ts
export { storageService } from '@games/shared-services'
```

**Batch script to execute**:

```bash
for app in apps/*/src/app/services; do
  if [ -f "$app/storageService.ts" ]; then
    rm "$app/storageService.ts"
    # Update any imports in the app
    sed -i "s|from '../services/storageService'|from '@games/shared-services'|g" "$app/../**/*.ts"
  fi
done
```

**4.2 Update crashLogger imports** (same pattern):

```bash
for app in apps/*/src/app/services; do
  if [ -f "$app/crashLogger.ts" ]; then
    rm "$app/crashLogger.ts"
    sed -i "s|from '../services/crashLogger'|from '@games/shared-services'|g" "$app/../**/*.ts"
  fi
done
```

**4.3 Update context imports**:

```bash
for app in apps/*/src/app/context; do
  if [ -f "$app/SoundContext.tsx" ]; then
    rm "$app/SoundContext.tsx"
  fi
  if [ -f "$app/ThemeContext.tsx" ]; then
    rm "$app/ThemeContext.tsx"
  fi
done

# Update imports in all app files
find apps -name "*.tsx" -o -name "*.ts" | xargs sed -i \
  "s|from '[^']*SoundContext'|from '@games/shared-context'|g; \
   s|from '[^']*ThemeContext'|from '@games/shared-context'|g"
```

**4.4 Verify all imports work**:

```bash
pnpm --filter @games/tictactoe typecheck
pnpm --filter @games/nim typecheck
pnpm --filter @games/battleship typecheck
# ... spot check 3-5 apps
```

---

## Verification Checklist

### After Each Service is Extracted

- [ ] Package exports correctly in `packages/shared-services/src/index.ts`
- [ ] TypeScript compiles: `pnpm typecheck`
- [ ] ESLint passes: `pnpm lint`
- [ ] All 26+ apps can import from `@games/shared-services`
- [ ] All 26+ apps can import from `@games/shared-context`

### Before Commit

- [ ] Original files deleted from all apps (verify `rm` succeeded)
- [ ] No dangling imports (all redirected to shared packages)
- [ ] Global typecheck passes: `pnpm typecheck`
- [ ] Global lint passes: `pnpm lint`

### After Phase 2 Complete

- [ ] All storageService.ts files removed (only 1 in `packages/shared-services/`)
- [ ] All crashLogger.ts files removed (only 1 in `packages/shared-services/`)
- [ ] All local SoundContext.tsx removed (only 1 in `packages/shared-context/`)
- [ ] All local ThemeContext.tsx removed (only 1 in `packages/shared-context/`)
- [ ] New packages exported in monorepo index or workspace config
- [ ] Commit message: `refactor: Extract shared services and contexts into dedicated packages`

---

## Expected Outcomes

✅ **Duplication Eliminated**: 25 copies × 4KB = ~100KB removed  
✅ **Maintenance Improved**: Single source of truth for each service/context  
✅ **Consistency Enforced**: All apps use identical implementations  
✅ **Foundation for Phase 3**: Shared packages ready for further composition

---

## Timeline Breakdown

| Task                                  | Duration      | Notes                               |
| ------------------------------------- | ------------- | ----------------------------------- |
| Part 1: Audit current implementations | 20 min        | Verify variance, plan consolidation |
| Part 2: Create shared packages        | 20 min        | Structure + exports setup           |
| Part 3: Create shared context package | 20 min        | Parallel to Part 2                  |
| Part 4: Update 26+ apps               | 60 min        | Batch script automation             |
| Verification & testing                | 20 min        | Global typecheck + lint             |
| **TOTAL**                             | **2-3 hours** |                                     |

---

## ⚠️ Important Notes

1. **Backup first**: These changes touch 26+ apps. Consider:

   ```bash
   git stash  # Save any local changes
   ```

2. **Test incrementally**: After extracting each service:
   - Update 3 representative apps first (tictactoe, nim, battleship)
   - Test: `pnpm typecheck && pnpm lint`
   - Then scale to all remaining apps

3. **Rollback ready**: Each part can be rolled back independently:

   ```bash
   git reset HEAD~1
   git checkout packages/shared-services/
   git checkout packages/shared-context/
   ```

4. **Atomic commits**: Consider one commit per service:
   - Commit 1: `refactor(packages): Extract storageService to shared-services`
   - Commit 2: `refactor(packages): Extract crashLogger to shared-services`
   - Commit 3: `refactor(packages): Extract contexts to shared-context`
   - Commit 4: `refactor(apps): Update imports to use shared packages`

---

## Next Phase (Phase 3)

After Phase 2 completes:

- **Phase 3**: Extract shared context providers (if not done in Phase 2)
- **Phase 4**: Extract shared constants and domain helpers
- **Then**: Execute Option A (Card-Deck Integration) with new shared packages ready

---

**Status**: 🟢 Ready to execute. Proceed when ready!
