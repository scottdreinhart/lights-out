# ESLint Performance Auditing Guide
## Real-World Performance Detection for React + TypeScript

**Version**: 1.0  
**Date**: March 16, 2026  
**Focus**: Production-grade performance guardrails for your lights-out (Vite + React + TypeScript) stack

---

## 📊 Executive Summary

This guide enhances ESLint to detect **real performance problems** that commonly degrade runtime efficiency and bundle size. Unlike speculative micro-optimization rules, these guidelines catch patterns you'll actually regret in production:

- **React rendering churn** (unnecessary re-renders, unstable component types)
- **Async inefficiencies** (sequential awaits when parallelization is safe)
- **Bundle bloat** (circular deps, unused exports, heavy utilities)
- **Algorithm inefficiencies** (expensive operations in hot paths)
- **Memory leaks** (closures, shadowed variables, unhandled subscriptions)

---

## 🎯 Design Philosophy

### What Gets Error-Level Rules?
- Patterns that **always** cause measurable harm
- Breaking core React/Promise semantics
- Silent failures that are hard to debug

**Examples:**
- `react-hooks/exhaustive-deps`: Missing deps = silent render churn
- `promise/catch-or-return`: Unhandled Promise = silent failure
- `react/jsx-key`: Unkeyed lists = identity bugs and thrashing

### What Gets Warn-Level Rules?
- Patterns that **often** cause harm depending on context
- Advisory patterns that need developer judgment
- Code smells that suggest refactoring

**Examples:**
- `promise/no-nesting`: Nested `.then()` hides parallelism (but works)
- `@typescript-eslint/require-await`: Async with no await (confusing but sometimes intentional)
- `max-lines-per-function`: 100+ line functions (hard to optimize but sometimes necessary)

### What Gets Excluded?
- Speculative micro-optimizations (e.g., reordering object keys)
- Style preferences without perf impact (e.g., spacing)
- Overly strict rules that create churn

---

## 📦 New Packages to Install

```bash
cd c:\Users\scott\lights-out

# Core plugins (if not already installed)
pnpm add -D \
  eslint-plugin-import@^2.29.0 \
  eslint-plugin-unicorn@^54.0.0 \
  eslint-plugin-promise@^6.1.0 \
  eslint-plugin-sonarjs@^1.0.0

# Total new packages: 4
# If you already have them from best-practices config: 0 new
```

### Package Table

| Package | Version | Since | Purpose | Key Rules for Performance |
|---------|---------|-------|---------|--------------------------|
| `eslint-plugin-import` | ^2.29.0 | ES modules | Bundle discipline | `no-cycle`, `order`, `no-absolute-path` |
| `eslint-plugin-unicorn` | ^54.0.0 | 2020 | Best practices | `prefer-string-replace-all`, `no-array-reduce`, `no-useless-undefined` |
| `eslint-plugin-promise` | ^6.1.0 | 2016 | Promise patterns | `always-return`, `catch-or-return`, `no-nesting` |
| `eslint-plugin-sonarjs` | ^1.0.0 | 2021 | Code smells | `cognitive-complexity`, `no-identical-functions`, `no-duplicate-string` |

---

## 🏗️ Configuration Structure

The performance config is organized into **8 sections**:

### Section 1: Critical Performance Footguns (React Rendering)
**Rules**: 7 error-level | **Typical Violations**: 1-3 on first run

These are **always wrong**. Fix immediately on every run.

**Key Rules:**
```
✗ react-hooks/exhaustive-deps (ERROR)
  Missing deps in useEffect/useCallback/useMemo = silent render churn
  
✗ react/jsx-key (ERROR)
  Unkeyed lists = DOM thrashing on reorder
  
✗ react/no-unstable-nested-components (ERROR)
  Declaring components in render = remounts on every render
```

**Cost of Violations** (if ignored):
- 10-100x unnecessary renders in lists
- Component state lost on re-render
- Memory leaks from closures retaining old state

### Section 2: Async & Promise Efficiency
**Rules**: 7 error/warn | **Typical Violations**: 0-5 on first run

These catch Promise anti-patterns that cause silent failures or sequential work when parallelization is safe.

**Key Rules:**
```
✗ promise/catch-or-return (ERROR)
  Unhandled Promise rejection = silent failure
  
✗ promise/no-nesting (WARN)
  Nested .then() chains hide parallelism
  → Use Promise.all() or async/await
  
✗ @typescript-eslint/no-floating-promises (ERROR)
  Ignored Promise (no await) = async work never completes
```

**Cost of Violations:**
- Silent failures (no error logs)
- Race conditions
- Sequential execution where parallel execution is safe

### Section 3: Bundle & Import Discipline
**Rules**: 7 error/warn | **Typical Violations**: 2-10 on first run

Import hygiene directly impacts bundle size and build time.

**Key Rules:**
```
✗ import/no-cycle (WARN)
  Circular dependencies prevent tree-shaking
  
✗ import/order (ERROR)
  Disorganized imports hide dependencies
  → Use alphabetical order by group
  
✗ import/no-unused-modules (WARN)
  Unused exports can't be tree-shaken
```

**Cost of Violations:**
- 2-20% larger bundles (depending on unused code)
- Slower builds
- Surprising module initialization order

### Section 4: Language-Level Performance Hygiene
**Rules**: 14 error/warn | **Typical Violations**: 3-8 on first run

These catch JavaScript patterns that are inefficient or hide expensive operations.

**Key Rules:**
```
✗ @typescript-eslint/no-dynamic-delete (WARN)
  delete obj[key] = property shape instability
  → Use undefined or restructure
  
✗ @typescript-eslint/no-explicit-any (ERROR)
  any = no type checking, hides expensive casts
  
✗ sonarjs/no-identical-functions (WARN)
  Duplicated functions = bundle bloat
```

**Cost of Violations:**
- Optimizers can't inline functions
- Type checking disabled
- Unexpected coercions in operations

### Section 5: Complexity & Cognitive Load
**Rules**: 3 warn | **Typical Violations**: 0-2 on first run

High complexity correlates strongly with bugs and hard-to-optimize code.

**Key Rules:**
```
⚠ sonarjs/cognitive-complexity (WARN, threshold: 15)
  High cognitive complexity = hard to reason about, hard to cache/parallelize
  
⚠ max-lines-per-function (WARN, max: 100 lines)
  Functions >100 lines do too much; hard to profile and optimize
```

**Cost of Violations:**
- Hard to profile (what's slow?)
- Hard to cache (too much state)
- Hard to test (too many paths)

### Section 6: Dead Code & Unused Imports
**Rules**: 4 error/warn | **Typical Violations**: 0-2 on first run

Dead code increases bundle size and hides intent.

**Key Rules:**
```
✗ @typescript-eslint/no-unused-vars (ERROR)
  Unused variables = bundle bloat
  
✗ import/no-unused-modules (WARN)
  Unused exports can't be tree-shaken
```

**Cost of Violations:**
- 1-5% bundle bloat per unused variable
- Hidden side effects from unused imports

### Section 7: Algorithm Efficiency Hints
**Rules**: 4 error/warn | **Typical Violations**: 0-1 on first run

These catch inefficient patterns like checking `.length > 0` instead of `.length`.

**Key Rules:**
```
⚠ sonarjs/no-collection-size-mischeck (WARN)
  .length > 0 vs .length (trivial cost, clarity gain)
  
✗ sonarjs/no-identical-conditions (ERROR)
  Same condition in if/else = dead code
```

**Cost of Violations:**
- Trivial perf impact (mostly clarity)
- Dead code paths

### Section 8: Existing Rules (Carried Forward)
React, accessibility, security, and architecture rules from your base config.

---

## 🚀 Implementation Roadmap

### Step 1: Install Packages (5 min)

```bash
# Check if already installed
pnpm list eslint-plugin-import eslint-plugin-unicorn eslint-plugin-promise eslint-plugin-sonarjs

# If missing, install
pnpm add -D \
  eslint-plugin-import@^2.29.0 \
  eslint-plugin-unicorn@^54.0.0 \
  eslint-plugin-promise@^6.1.0 \
  eslint-plugin-sonarjs@^1.0.0
```

### Step 2: Choose Configuration Strategy (2 min)

**Option A: Standalone Performance Config**
- Use `eslint.config.performance.js` alongside your `eslint.config.js`
- Run `pnpm lint --config eslint.config.performance.js src/`
- Useful for: Gradual migration, testing new rules

**Option B: Integrate into Main Config**
- Merge rules from `eslint.config.performance.js` into your `eslint.config.js`
- Single ESLint run, all rules apply
- Useful for: Long-term, unified enforcement

**Recommendation**: Start with Option A, migrate to Option B after initial cleanup.

### Step 3: Establish Baseline (10 min)

```bash
# Run linter to see current violations
pnpm lint src/ 2>&1 | tee lint-results.txt

# Count violations by severity
grep "error" lint-results.txt | wc -l   # Errors (must fix)
grep "warn" lint-results.txt | wc -l    # Warnings (advisory)

# Typical baseline:
# - Errors: 5-15 (fixable with lint:fix)
# - Warnings: 10-30 (some fixable, some require review)
```

### Step 4: Auto-Fix What You Can (5 min)

```bash
# ESLint auto-fixes safe violations:
# - Import ordering
# - Unused vars/imports
# - Type import syntax
# - Naming conventions
pnpm lint:fix src/

# Re-run to see remaining violations
pnpm lint src/ | head -50
```

### Step 5: Review & Fix Remaining Violations (30-60 min)

Most remaining violations require code changes:

```bash
# Example violation: Missing dependency in useEffect
# ✗ error: React Hook useEffect has a missing dependency: 'userId'
#
# Fix: Add userId to dependency array
useEffect(() => {
  fetchUser(userId)
}, [userId])  // ← Add here
```

**Common patterns requiring fixes:**

| Pattern | Fix | Time |
|---------|-----|------|
| Missing deps in useEffect | Add to array | 1 min per instance |
| Unhandled Promises | Add .catch() or await | 2-3 min per instance |
| Nested .then() chains | Convert to async/await | 5-10 min per instance |
| Circular imports | Restructure modules | 10-20 min per cycle |
| Unused exports | Remove or prefix with _ | 1 min per export |
| High complexity | Extract helper functions | 10-20 min per function |

### Step 6: Integrate with CI/CD (5 min)

```bash
# Add to your GitHub Actions, GitLab CI, or equivalent
# .github/workflows/lint.yml or similar

- name: ESLint Performance Check
  run: |
    pnpm lint:performance
    pnpm lint:fix --check src/
```

### Step 7: Establish Team Guidelines (10 min)

Document for your team:

```markdown
## Performance Linting Standards

### Error-Level Rules (Must Fix)
- Fix before committing
- If blocking, discuss in PR (rare)

### Warn-Level Rules (Advisory)
- Fix in same sprint if possible
- Acceptable to defer if high effort
- Document reason for deferral in code comment

### Exempting Rules
- Prefix variable with `_` to ignore unused
- Use `// eslint-disable-next-line rule-name` sparingly
- Always explain in comment why exemption is needed
```

---

## 📝 Package.json Scripts

Replace your current lint scripts with these:

```json
{
  "scripts": {
    "lint": "eslint src/",
    "lint:fix": "eslint src/ --fix",
    "lint:performance": "eslint src/ --config eslint.config.performance.js",
    "lint:performance:fix": "eslint src/ --config eslint.config.performance.js --fix",
    "lint:report": "eslint src/ --format json > lint-report.json && cat lint-report.json",
    "lint:strict": "eslint src/ --rule '@typescript-eslint/no-explicit-any: error' --rule 'complexity: error'",
    "lint:check": "eslint src/ --format json | jq '.[] | select(.messages | length > 0)' | wc -l"
  }
}
```

### Script Reference

| Script | Purpose | Usage |
|--------|---------|-------|
| `pnpm lint` | Check all src/ | Before commit |
| `pnpm lint:fix` | Auto-fix all | Post-commit cleanup |
| `pnpm lint:performance` | Performance rules only | Focused review |
| `pnpm lint:performance:fix` | Auto-fix perf rules | Quick cleanup |
| `pnpm lint:report` | JSON report | CI/automation |
| `pnpm lint:strict` | Strict mode (no warnings) | CI gates |
| `pnpm lint:check` | Count violations | Dashboard/metrics |

---

## 🔍 Rule Categories Quick Reference

### Critical React Performance (Error)
```javascript
react-hooks/exhaustive-deps          // Missing deps = render churn
react/jsx-key                        // Unkeyed lists = DOM thrashing
react/no-unstable-nested-components  // Nested declarations = remounts
react/jsx-no-constructed-context-values // Objects in context = re-renders
```

### Critical Promise/Async (Error)
```javascript
promise/always-return                 // Missing return in .then()
promise/catch-or-return               // Unhandled Promise
@typescript-eslint/no-floating-promises // Ignored Promise
@typescript-eslint/no-misused-promises   // Promise misuse
```

### Critical Type Safety (Error)
```javascript
@typescript-eslint/no-explicit-any    // any disables checks
@typescript-eslint/prefer-nullish-coalescing  // || vs ??
@typescript-eslint/prefer-optional-chain      // a?.b vs a && a.b
```

### Bundle & Imports (Error/Warn)
```javascript
import/no-cycle                       // Circular deps (prevent tree-shake)
import/order                          // Organize imports
import/no-unused-modules              // Tree-shake opportunities
import/no-relative-packages           // Fragile imports
```

### Code Smells (Warn)
```javascript
promise/no-nesting                    // Hidden parallelism
sonarjs/cognitive-complexity          // Hard to optimize
sonarjs/no-identical-functions        // Bundle bloat
sonarjs/no-duplicate-string           // Extract constants
max-lines-per-function                // Functions too complex
```

---

## 🎓 Common Violations & Fixes

### Violation 1: Missing useEffect Dependency

**ESLint Output:**
```
✗ error: React Hook useEffect has missing dependency: 'userId'
  at src/app/useUser.ts:15:3
```

**Before:**
```typescript
useEffect(() => {
  fetchUser(userId)  // Using userId
}, [])  // But not in deps!
```

**After:**
```typescript
useEffect(() => {
  fetchUser(userId)
}, [userId])  // ← Add dependency
```

**Why It Matters:**
- Old `userId` might be stale
- Effect might run with wrong `userId`
- Can cause silent data inconsistencies

---

### Violation 2: Unhandled Promise

**ESLint Output:**
```
✗ error: promise/catch-or-return: Missing catch or return
  at src/app/storageService.ts:42:5
```

**Before:**
```typescript
function save(data) {
  fetch('/api/save', { method: 'POST', body: JSON.stringify(data) })
    .then(r => r.json())
  // Missing .catch()!
}
```

**After:**
```typescript
function save(data) {
  return fetch('/api/save', { method: 'POST', body: JSON.stringify(data) })
    .then(r => r.json())
    .catch(err => {
      console.error('Save failed:', err)
      throw err  // Or return default
    })
}
```

**Why It Matters:**
- Promise rejection goes unhandled
- Error doesn't appear in logs
- Hard to debug if save fails silently

---

### Violation 3: Nested Promise Chain

**ESLint Output:**
```
⚠ warn: promise/no-nesting: Promise nesting detected
  at src/app/useGame.ts:28:7
```

**Before:**
```typescript
fetch('/api/game')
  .then(r => r.json())
  .then(game => {
    fetch(`/api/players/${game.id}`)  // Nested fetch!
      .then(pr => pr.json())
      .then(players => {
        setState({ game, players })
      })
  })
```

**After (Parallel):**
```typescript
async function loadGame(gameId) {
  const gameRes = await fetch('/api/game')
  const playersRes = await fetch(`/api/players/${gameId}`)
  
  // Parallel fetch (much faster)
  const [game, players] = await Promise.all([
    gameRes.json(),
    playersRes.json(),
  ])
  return { game, players }
}
```

**Why It Matters:**
- Nested fetches wait sequentially (slow)
- Parallel fetch is much faster
- `async/await` is clearer than nested `.then()`

---

### Violation 4: Circular Dependency

**ESLint Output:**
```
⚠ warn: import/no-cycle: Cyclic dependency detected
  src/app/useGame.ts -> src/domain/rules.ts -> src/app/useGame.ts
```

**Before:**
```typescript
// src/app/useGame.ts
import { isValidMove } from '@/domain'

// src/domain/rules.ts
import { useStats } from '@/app'  // ← Circular!
```

**After:**
```typescript
// src/domain/rules.ts (no app imports)
export function isValidMove(board, move) {
  // Pure logic, no app dependencies
}

// src/app/useStats.ts
import { isValidMove } from '@/domain'
```

**Why It Matters:**
- Bundler can't tree-shake circular imports
- Module initialization order becomes ambiguous
- Can cause subtle bugs if module state is referenced

---

### Violation 5: High Cognitive Complexity

**ESLint Output:**
```
⚠ warn: sonarjs/cognitive-complexity: Complexity is 18 (max 15)
  at src/domain/ai.ts:45:10
```

**Before (Cognitive Complexity = 18):**
```typescript
function minimax(board, depth, isMax) {
  if (isGameOver(board)) {  // +1
    if (isMax) {  // +2
      if (getWinner(board) === X) {  // +3
        return 10 - depth
      }
    } else {  // +2
      if (getWinner(board) === O) {  // +3
        return depth - 10
      }
    }
  }
  if (depth === 0) {  // +1
    return evaluate(board)
  }
  // ... more branches
}
```

**After (Extract helper, Complexity = 10):**
```typescript
function minimax(board, depth, isMax) {
  if (isGameOver(board)) {
    return evaluateTerminal(board, depth, isMax)
  }
  if (depth === 0) {
    return evaluate(board)
  }
  // Continue simplified...
}

function evaluateTerminal(board, depth, isMax) {
  const winner = getWinner(board)
  if (!winner) return 0
  const score = 10 - depth
  return isMax ? score : -score
}
```

**Why It Matters:**
- Hard to reason about (bug-prone)
- Hard to test (many paths)
- Hard to optimize (too many branches)

---

### Violation 6: Unkeyed List

**ESLint Output:**
```
✗ error: Missing "key" prop for element in list
  at src/ui/molecules/ResultsTable.tsx:52:5
```

**Before:**
```tsx
{results.map(r => (  // No key!
  <ResultRow result={r} />
))}
```

**After:**
```tsx
{results.map(r => (
  <ResultRow key={r.id} result={r} />  // ← Add key
))}
```

**Why It Matters:**
- No key = React uses implicit index as key
- Reorder or filter results → wrong element identity
- Component state gets mixed up (form values wrong)
- DOM elements thrash (repaint, reflow)

---

## 📊 Expected Results

### First Run Baseline

Typical codebase on first run:

```
Total Violations: ~20-40
├─ Errors: 5-15 (must fix)
└─ Warnings: 15-25 (advisory)

Time to Fix (estimated):
├─ Auto-fixable: 2-5 min
├─ Manual fixes: 30-60 min
└─ Complex refactors: 1-2 hours
```

### After Implementation (Mature Codebase)

```
Total Violations: 0-3
├─ Errors: 0 (strict enforcement)
└─ Warnings: 0-3 (edge cases)

Typical Warning Sources:
• eslint-disable comments (intentional exemptions)
• Test files (flexibility needed)
• High-complexity algorithms (documented)
```

---

## 🔧 Troubleshooting

### Issue: Too Many Warnings on First Run

**Symptom**: `pnpm lint` shows 50+ warnings

**Cause**: Existing code wasn't written with these rules

**Solution**:
1. Run `pnpm lint:fix` to auto-fix what's safe
2. Review remaining violations
3. Create GitHub issue for each major refactor
4. Plan fixes across sprints instead of all-at-once

---

### Issue: Rule Seems Wrong (False Positive)

**Symptom**: ESLint flag something that isn't a real problem

**Example**:
```
⚠ warn: max-lines-per-function: Function exceeds 100 lines (actually 108)
```

**Solution**:
1. Evaluate: Is the rule actually detecting a real issue?
2. If yes: Refactor function (extract helpers)
3. If no: Disable for that file with comment:

```typescript
// eslint-disable-next-line max-lines-per-function
export function complexAlgorithm() {
  // 108 lines of legitimate complex logic
  // This is hard to break smaller without losing clarity
}
```

**Always explain in comment why you're disabling**

---

### Issue: Rule Doesn't Apply to My Use Case

**Symptom**: Rule fires but doesn't match your architecture

**Example**:
```
⚠ warn: import/no-relative-packages: Do not import from relative path
at src/ui/atoms/Button.tsx:2:1
import '../../../config'
```

**Solution**:

If legitimate for your project:
1. Configure rule with exceptions in `.eslintrc`
2. Override in specific directory via `.eslintrc` in that folder

```javascript
// For atoms that genuinely need config:
'import/no-relative-packages': [
  'warn',
  {
    ignore: ['src/ui/atoms/**'],
  },
]
```

---

## 🎯 Performance Profiling Integration

These rules find problems **before** they hit profilers. Use together:

### 1. ESLint (Lint-Time Detection)
```bash
pnpm lint:performance  # Catch patterns now
```
Finds: Missing deps, unhandled promises, circular deps, unused code

### 2. Chrome DevTools (Runtime Profiling)
After fixing lint issues, profile:
```
Chrome DevTools → Performance → Record
```
Measures: Render time, paint time, memory, etc.

**Expected**: If lint rules pass, profiler should show fewer re-renders.

### 3. Dependency Auditing (Bundle Analysis)
```bash
# After linting and building:
npm install -g vite-plugin-visualizer
npx vite-plugin-visualizer dist/stats.html
```

Measures: Bundle size, tree-shake effectiveness

**Expected**: Fixed unused imports → smaller bundles.

---

## 🚀 Advanced: Complementary Tooling

### 3.1 Bundle Analysis Tools

**Why**: Verify that import discipline actually shrinks bundle

```bash
# Install globally or as devDep
pnpm add -D vite-plugin-visualizer
```

**Usage:**
```typescript
// vite.config.js
import { visualizer } from 'vite-plugin-visualizer'

export default {
  plugins: [visualizer()],
}
```

Then: `pnpm build` generates `stats.html` showing bundle composition

**Expected After ESLint Fixes**:
- 5-15% smaller bundle (if fixing unused imports)
- Fewer circular deps (clearer dependency tree)

---

### 3.2 React DevTools Profiler

**Why**: Measure whether exhaustive-deps and key fixes eliminated churn

```bash
# Chrome Extension: React DevTools
# Or: npm install --save-dev react-devtools
```

**Usage:**
```
Chrome DevTools → Profiler tab → Record
↓
Flamechart shows component render timing
```

**Expected After ESLint Fixes**:
- Fewer renders per interaction
- Render time lower for same amount of DOM work
- Memoization becomes more effective (because deps are correct)

---

### 3.3 Lighthouse CI

**Why**: Measure whether bundle, render time, and memory improved

```bash
# Install
npm install -g @lhci/cli@^0.9.0

# Create lighthouserc.json
{
  "ci": {
    "collect": { "url": ["https://yoursite.com"] },
    "upload": { "target": "temporary-public-storage" },
    "assert": {
      "preset": "lighthouse:recommended",
      "assertions": {
        "categories:performance": ["error", {"minScore": 0.9}],
      },
    },
  },
}

# Run
lhci autorun
```

**Expected After ESLint Fixes**:
- FCP (First Contentful Paint) ↓ 5-20%
- LCP (Largest Contentful Paint) ↓ 10-30%
- CLS (Cumulative Layout Shift) ↓ (if key fixes work)

---

### 3.4 Import Cost VS Code Extension

**Why**: See bundle impact of individual imports in editor

```bash
# VS Code Extension
ext install wix.vscode-import-cost
```

**Usage**: Hover over import, see bundle size impact

```typescript
import { Button } from 'react'  // 5 KB gzipped
import { chain } from 'lodash'  // 25 KB (whole library!) ← This is a problem
```

**Expected After ESLint + this tool**:
- Heavy imports become visible
- No surprise "why is bundle 100KB?" moments

---

### 3.5 BundlePhobia

**Why**: Check NPM package dependencies before installing

```
https://bundlephobia.com/search?q=package-name
```

**Usage**:
- Paste package name
- See gzipped size + dependencies
- Decide if worth it

**Example**:
```
lodash: 70 KB gzipped  (too heavy for math utilities)
lodash-es: 70 KB gzipped  (same!)
native Array methods: 0 KB  (use these)
```

---

### 3.6 Node.js Profiling (for API/backend code)

**Why**: Measure CPU/memory for non-React code

```bash
# Profile app.js
node --prof src/index.js
# Generates isolate-*.log

# Analyze
node --prof-process isolate-*.log > log.txt
```

**Typical Issues**:
- Synchronous operations blocking event loop
- Unnecessary cloning/spreading in hot paths
- Uncontrolled async parallelism (DOS-ing itself)

---

## 📋 Implementation Checklist

- [ ] **Install packages** (`pnpm add -D eslint-plugin-*`)
- [ ] **Choose config strategy** (standalone or integrated)
- [ ] **Establish baseline** (`pnpm lint:performance`)
- [ ] **Auto-fix violations** (`pnpm lint:performance:fix`)
- [ ] **Review remaining violations** (prioritize errors)
- [ ] **Integrate with CI/CD** (add lint step to workflow)
- [ ] **Document for team** (create team guide)
- [ ] **Measure improvement** (bundle size, render time)
- [ ] **Set up profiling** (Chrome DevTools, Lighthouse)
- [ ] **Monitor over time** (track metrics)

---

## 🎓 Developer Quick Start

### For Individual Contributors

**Before committing code:**
```bash
pnpm lint:performance:fix  # Auto-fix safe violations
pnpm lint                  # Check for remaining issues
git add .                  # Commit
```

**If you hit a warning:**
1. Read the rule description (in this guide or eslint.config.performance.js)
2. Understand why the pattern is problematic
3. Refactor to fix it
4. If truly unavoidable, disable with comment explaining why:

```typescript
// eslint-disable-next-line rule-name
// Excuse: Why this rule doesn't apply here
```

### For Code Reviewers

**Check for:**
- [ ] No new ESLint violations (run `pnpm lint`)
- [ ] Every disable comment has explanation
- [ ] Refactored code is actually clearer after fix
- [ ] No adding dependencies to fix style issues

---

## 📞 Next Steps

1. **Read** the performance config file (`eslint.config.performance.js`)
   - Notice the detailed comments explaining each rule
   - Understand which are critical (errors) vs advisory (warns)

2. **Install packages** and run baseline lint
   ```bash
   pnpm add -D eslint-plugin-import@^2.29.0 eslint-plugin-unicorn@^54.0.0 eslint-plugin-promise@^6.1.0 eslint-plugin-sonarjs@^1.0.0
   pnpm lint:performance | head -50
   ```

3. **Start with auto-fixes**
   ```bash
   pnpm lint:performance:fix
   ```

4. **Review + fix remaining issues** (30-90 min depending on codebase size)

5. **Integrate into CI/CD** (add check to your GitHub Actions, GitLab CI, etc.)

6. **Set up profiling tooling** (bundle analysis, Lighthouse, DevTools)

7. **Monitor metrics over time** (track bundle size, render time)

---

## 📚 Additional Resources

- **ESLint Plugin Docs:**
  - [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react)
  - [eslint-plugin-react-hooks](https://github.com/facebook/react/blob/main/packages/eslint-plugin-react-hooks)
  - [eslint-plugin-import](https://github.com/import-js/eslint-plugin-import)
  - [eslint-plugin-sonarjs](https://github.com/SonarSource/eslint-plugin-sonarjs)

- **Performance References:**
  - [React DevTools Profiler](https://react.dev/learn/render-and-commit)
  - [Web Vitals](https://web.dev/vitals/)
  - [Chrome DevTools Performance](https://developer.chrome.com/docs/devtools/performance/)
  - [Vite Bundle Analysis](https://docs.vite.dev/)

---

## 🎯 Success Criteria

After implementation, your codebase should exhibit:

✅ **Detectability**
- ESLint catches rendering anti-patterns before production
- Developers know which imports are heavy (bundle analysis)
- Performance regressions fail CI/CD

✅ **Efficiency**
- No unnecessary re-renders (exhaustive-deps enforced)
- Async patterns parallelized where safe
- Dead code eliminated
- Circular dependencies prevented

✅ **Maintainability**
- Code is easier to profile (lower cognitive complexity)
- Dependencies are explicit (organized imports)
- Promise chains don't hide work

✅ **Team Confidence**
- Developers trust performance checks (low false positives)
- PRs include performance improvements
- Performance is part of definition-of-done

---

**Version**: 1.0 | **Status**: Ready for Production | **Last Updated**: March 16, 2026
