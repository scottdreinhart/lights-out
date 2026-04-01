# Dependency Update Plan - April 1, 2026

**Objective**: Update all 14 packages to highest compatible versions with thorough testing

**Current Environment**:
- Node: 24.14.0
- pnpm: 10.31.0
- TypeScript: 5.9.3 (→ 6.0.2 major)
- ESLint: 10.0.3 (→ 10.1.0)

---

## Update Phases (By Risk Level)

### ✅ Phase 1: Safe Updates (Patches & Minor versions)
**Risk Level**: LOW
**Rollback**: Simple (if one breaks, revert and skip)

- `vite`: 8.0.0 → 8.0.3
- `@capacitor/keyboard`: 8.0.1 → 8.0.2
- `@capacitor/status-bar`: 8.0.1 → 8.0.2
- `@capacitor/app`: 8.0.1 → 8.1.0
- `@capacitor/core`: 8.2.0 → 8.3.0
- `@capacitor/cli`: 8.2.0 → 8.3.0
- `@playwright/test`: 1.58.2 → 1.59.1
- `playwright`: 1.58.2 → 1.59.1
- `electron`: 41.0.2 → 41.1.1
- `eslint`: 10.0.3 → 10.1.0
- `typescript-eslint`: 8.57.0 → 8.58.0
- `assemblyscript`: 0.28.10 → 0.28.12

**Test Command**: `pnpm validate`

---

### ⚠️ Phase 2: Major Version (TypeScript)
**Risk Level**: HIGH
**Rollback**: May require code changes

- `typescript`: 5.9.3 → 6.0.2

**Impact Analysis**:
- Stricter type checking
- Possible compilation errors (fixable)
- May reveal type issues in codebase

**Test Commands**:
1. `pnpm typecheck` (catch type errors)
2. `pnpm build` (Vite build with TS 6)
3. `pnpm validate` (full suite)
4. Manual testing of 2-3 core games

**Rollback Plan**: If TS 6 breaks:
```bash
pnpm update typescript@5.9.3
pnpm install
pnpm validate
```

---

### 🔴 Phase 3: Major Version (ESLint Plugin Boundaries)
**Risk Level**: MEDIUM
**Rollback**: May have breaking changes in rules

- `eslint-plugin-boundaries`: 5.4.0 → 6.0.2

**Impact Analysis**:
- Controls CLEAN Architecture layer enforcement
- May require config updates
- Could flag new violations

**Test Commands**:
1. `pnpm lint` (check for new errors)
2. Review any new linting violations
3. If violations: Update `.eslintrc` or fix violations

**Rollback Plan**: If breaks linting severely:
```bash
pnpm update eslint-plugin-boundaries@5.4.0
pnpm lint
```

---

### 🔴 Phase 4: Major Version (Rollup Visualizer)
**Risk Level**: MEDIUM
**Rollback**: May have API changes

- `rollup-plugin-visualizer`: 5.14.0 → 7.0.1

**Impact Analysis**:
- 2-version jump (unusual)
- Build analytics plugin
- Could break `pnpm build:analyze` if used

**Test Commands**:
1. `pnpm build` (check bundle generation)
2. Check if `dist/` is generated correctly
3. If used: `pnpm build:analyze` (test visualizer)

**Rollback Plan**:
```bash
pnpm update rollup-plugin-visualizer@5.14.0
pnpm build
```

---

## Testing Checklist

### Phase 1 (After safe updates)
- [ ] `pnpm install` completes without errors
- [ ] `pnpm validate` passes (lint + format + typecheck + build)
- [ ] No new console warnings/errors

### Phase 2 (After TypeScript 6.0.2)
- [ ] `pnpm typecheck` passes (0 errors)
- [ ] `pnpm build` succeeds
- [ ] `pnpm validate` passes
- [ ] Test major game: `cd apps/sudoku && pnpm validate`
- [ ] Test card game: `cd apps/blackjack && pnpm validate`
- [ ] Spot-check: Open 1-2 games in browser (npm start)

### Phase 3 (After ESLint Boundaries 6.0.2)
- [ ] `pnpm lint` passes
- [ ] New violations reviewed and addressed
- [ ] `.eslintrc` updated if needed
- [ ] All layer boundaries still enforced

### Phase 4 (After Rollup Visualizer 7.0.1)
- [ ] `pnpm build` succeeds
- [ ] `dist/` directory has expected structure
- [ ] No build warnings
- [ ] If used: `pnpm build:analyze` works

---

## Execution Commands

### Phase 1: Safe Updates
```bash
pnpm update \
  vite@8.0.3 \
  @capacitor/keyboard@8.0.2 \
  @capacitor/status-bar@8.0.2 \
  @capacitor/app@8.1.0 \
  @capacitor/core@8.3.0 \
  @capacitor/cli@8.3.0 \
  @playwright/test@1.59.1 \
  playwright@1.59.1 \
  electron@41.1.1 \
  eslint@10.1.0 \
  typescript-eslint@8.58.0 \
  assemblyscript@0.28.12

pnpm install
pnpm validate
```

### Phase 2: TypeScript 6.0.2
```bash
pnpm update typescript@6.0.2
pnpm install
pnpm typecheck
pnpm build
pnpm validate
cd apps/sudoku && pnpm validate && cd ../..
cd apps/blackjack && pnpm validate && cd ../..
```

### Phase 3: ESLint Plugin Boundaries 6.0.2
```bash
pnpm update eslint-plugin-boundaries@6.0.2
pnpm install
pnpm lint
# Review violations and address if any
```

### Phase 4: Rollup Visualizer 7.0.1
```bash
pnpm update rollup-plugin-visualizer@7.0.1
pnpm install
pnpm build
# Verify dist/ generated correctly
```

---

## Success Criteria

✅ **All phases complete when**:
1. Phase 1: `pnpm validate` passes
2. Phase 2: `pnpm validate` + game spot-checks pass
3. Phase 3: `pnpm lint` passes with no new violations
4. Phase 4: `pnpm build` succeeds
5. Final: `pnpm-lock.yaml` reflects all updates

---

## Estimated Time

- Phase 1: 2-3 minutes (install + test)
- Phase 2: 5-10 minutes (TypeScript more complex)
- Phase 3: 3-5 minutes
- Phase 4: 2-3 minutes
- **Total**: ~15-25 minutes (including testing time)

---

## Safety Notes

✓ All updates are backward compatible or have migration paths
✓ pnpm-lock.yaml automatically updated with new versions
✓ Each phase can be rolled back independently
✓ No breaking API changes expected for apps
✓ CLEAN Architecture enforcement remains intact
