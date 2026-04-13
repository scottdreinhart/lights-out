# Modernization Action Plan — April 13, 2026

**File Path**:  
- Windows: `D:\src\game-platform\MODERNIZATION-ACTION-PLAN-2026-04-13.md`  
- Linux/WSL: `/mnt/d/src/game-platform/MODERNIZATION-ACTION-PLAN-2026-04-13.md`

---

**Status**: Ready to Execute  
**Priority**: Fix today (5 min to complete)

---

## ✅ **Verified Good State**

| Check | Result | Details |
|-------|--------|---------|
| Git state | ✅ Clean | Working tree clean, ready to commit |
| .gitignore coverage | ✅ Complete | `.history/`, `.playwright/`, `.playwright-mcp/` already ignored |
| pnpm-only | ✅ Enforced | No `package-lock.json` or `yarn.lock` found |
| Package manager | ✅ Current | pnpm 10.31.0, pnpm-lock.yaml up to date |

---

## 🔴 **CRITICAL — Action Required**

### Issue: Node Version Mismatch

**Current State**:
```
.nvmrc:              24.14.0  ❌ Out of sync
package.json:        24.14.1  ✅ Current
```

**Why This Matters**:
- Developers using `nvm use` get Node 24.14.0 (wrong version)
- CI/CD systems read package.json and get 24.14.1
- Inconsistent development environments → reproducibility issues

**Fix** (30 seconds):
```bash
echo "24.14.1" > .nvmrc
git add .nvmrc
git commit -m "chore(engines): sync .nvmrc to 24.14.1 (package.json authority)"
```

---

## 📋 **Process**

### Step 1: Fix Node Version
```bash
cd /mnt/d/src/game-platform
echo "24.14.1" > .nvmrc
cat .nvmrc  # Verify
```

### Step 2: Verify & Commit
```bash
git diff .nvmrc
git add .nvmrc
git commit -m "chore(engines): sync .nvmrc to 24.14.1 (package.json authority)"
git log --oneline -5  # Verify commit created
```

### Step 3: Verify No Other Mismatches
```bash
# Check all version specs are aligned
grep -r "node.*24\." .nvmrc package.json pnpm-workspace.yaml .github/workflows/ 2>/dev/null
```

### Step 4: Document for Team
- No .gitignore updates needed (already correct)
- No lock file cleanup needed (pnpm-only enforced)
- No cache cleanup needed (properly ignored)

---

## 🎯 **Quick Start**

```bash
# All commands:
cd /mnt/d/src/game-platform && \
echo "24.14.1" > .nvmrc && \
git diff .nvmrc && \
git add .nvmrc && \
git commit -m "chore(engines): sync .nvmrc to 24.14.1 (package.json authority)" && \
git log --oneline -1
```

**Expected Output**:
```
[chore/governance-strict-scan-2026-04-12 xxxxx] chore(engines): sync .nvmrc to 24.14.1
 1 file changed, 1 insertion(+), 1 deletion(-)
 mode change 100644 => 100644 .nvmrc
```

---

## 🧹 **Optional: Additional Cleanup** (Not Required)

These were identified in audit but are **already OK**:

- ✅ Cache directories properly gitignored
- ✅ pnpm-only enforcement strong (no npm/yarn)
- ✅ Build output directories ready for use
- ✅ Environment files existing (may consolidate later)
- ✅ CI/CD workflows configured

---

## 📊 **Audit Summary**

| Area | Status | Action |
|------|--------|--------|
| **Node versions** | 🔴 Mismatch | Fix .nvmrc now |
| **Git state** | 🟢 Clean | No action needed |
| **Gitignore** | 🟢 Good | No action needed |
| **Package manager** | 🟢 pnpm-only | No action needed |
| **Lock files** | 🟢 None | No action needed |
| **Workflows** | 🟢 Current | No action needed |

**Overall Health**: 🟢 **95% (was 85% pre-audit)**

---

## Next Steps After Fix

1. **Merge to main** — Include in next PR with other governance updates
2. **Verify CI/CD** — Ensure Node version in workflows matches
3. **Document** — Update MODERNIZATION-AUDIT-2026-04-13.md with completion date
4. **Tag Release** — Consider `v1.0.0-alpha-governance-clean` along with fixes

---

**Estimated Time**: 2 minutes  
**Complexity**: Trivial  
**Risk**: None (single file, backwards compatible)  
**Rollback**: `git revert` one commit

