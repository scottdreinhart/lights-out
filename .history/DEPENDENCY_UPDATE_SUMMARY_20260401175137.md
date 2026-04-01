# Dependency Update Strategy - Revised
**Date**: April 1, 2026  
**Status**: ⏳ Phase 1 Ready, Phases 2-4 Deferred (Ecosystem blocker)

---

## Discovery: ESLint 10.x Peer Dependency Conflict

During testing of dependency updates, discovered **incompatibility**:
- ESLint 10.1.0 available, but ecosystem plugins not ready
- `eslint-plugin-react` 7.37.5 supports **only ESLint ≤ 9.7**
- `eslint-plugin-jsx-a11y` 6.10.2 supports **only ESLint ≤ 9**
- `eslint-plugin-react-hooks` 7.0.1 supports **only ESLint ≤ 9**

Result: Updating ESLint to 10.1.0 breaks all three plugins.

---

## Recommended Action Plan

### ✅ Phase 1: Execute NOW (11 safe patches/minors)

**Proceed with these updates immediately:**

```bash
pnpm add -w -D \
  vite@8.0.3 \
  @capacitor/keyboard@8.0.2 \
  @capacitor/status-bar@8.0.2 \
  @capacitor/app@8.1.0 \
  @capacitor/core@8.3.0 \
  @capacitor/cli@8.3.0 \
  @playwright/test@1.59.1 \
  playwright@1.59.1 \
  electron@41.1.1 \
  typescript-eslint@8.58.0 \
  assemblyscript@0.28.12

pnpm install
pnpm validate
```

**Estimated time**: 3-5 minutes  
**Risk**: LOW (all patches/minors, no breaking changes)  

---

### 🟡 Phase 2: Ready any time (TypeScript 6.0.2)

**Can test independently after Phase 1:**

```bash
pnpm add -w -D typescript@6.0.2
pnpm install
pnpm typecheck
pnpm validate
```

**Estimated time**: 5-10 minutes  
**Risk**: MEDIUM (major version, but backwards compatible)  
**Note**: TypeScript 6.0.2 is production-ready and has no ecosystem dependencies

---

### ⏳ Phase 3-4: DEFERRED (Waiting for ecosystem)

**Cannot proceed until React plugin ecosystem updates:**

| Package | Current | Target | Status |
|---------|---------|--------|--------|
| eslint-plugin-react | 7.37.5 | 8.x (needed) | ❌ Waiting |
| eslint-plugin-jsx-a11y | 6.10.2 | 7.x (needed) | ❌ Waiting |
| eslint-plugin-react-hooks | 7.0.1 | 5.x (needed) | ❌ Waiting |
| eslint | 10.0.3 | 10.1.0 | ⏳ Blocked |
| eslint-plugin-boundaries | 5.4.0 | 6.0.2 | ⏳ Blocked |
| rollup-plugin-visualizer | 5.14.0 | 7.0.1 | ⏳ (low priority) |

**Action**: Check npm registry in **1 week** for plugin updates.

---

## Recommended Next Steps

**NOW** (5 minutes):
1. ✅ Run Phase 1 updates (11 packages)
2. ✅ Verify `pnpm validate` passes
3. ✅ Commit updated `package.json` + `pnpm-lock.yaml`

**LATER** (when ready):
4. Test Phase 2 (TypeScript 6.0.2) in separate PR
5. Monitor npm for plugin updates (phase 3-4)

---

## Why This Approach?

**Benefits:**
- ✅ Get immediate security/patch updates (11 packages)
- ✅ Avoid breaking changes from ecosystem incompleteness
- ✅ Can test TypeScript 6 independently on schedule
- ✅ Professional approach: deferred major versions until ecosystem ready
- ✅ Reduces risk of unplanned rollbacks

**Risk Mitigation:**
- Phase 1 updates are safe (patches/minors only)
- Each phase can be isolated to separate PR/commit
- TypeScript 6 has no external dependencies (can test anytime)
- ESLint ecosystem will stabilize within 1-2 weeks

---

## Fallback Plan

If Phase 1 causes unexpected issues:
```bash
git checkout pnpm-lock.yaml
pnpm install
# Back to stable state
```

---

## Questions for You

1. **Ready to run Phase 1?** (11 safe packages, ~5 min)
2. **When to test Phase 2?** (TypeScript 6.0.2, independent, ~10 min)
3. **Check ecosystem again on**: April 8-10 (1 week)?

Let me know and I can execute Phase 1 immediately!
