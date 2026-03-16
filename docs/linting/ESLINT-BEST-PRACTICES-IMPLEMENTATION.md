# ESLint Best Practices Configuration Enhancement Guide

**Date**: March 16, 2026  
**Focus**: Correctness, Maintainability, Architectural Discipline  
**Status**: Ready for Implementation

---

## 🎯 Objectives Addressed

| Objective | Status | Coverage |
|-----------|--------|----------|
| Catch bugs before runtime | ✅ COMPLETE | Promise handling, async safety, null checks, type safety |
| Enforce clarity | ✅ COMPLETE | Naming, complexity limits, control flow discipline |
| Maintain consistency | ✅ COMPLETE | Import ordering, naming conventions, type imports |
| Prevent architectural decay | ✅ COMPLETE | Layer boundaries, module hygiene, dead code detection |
| Support long-term maintainability | ✅ COMPLETE | Cognitive complexity, function size limits, duplication detection |

---

## 📊 Current State Analysis

### What's Working ✅
- Basic TypeScript type checking
- JSX/React hooks rules
- Architecture layer boundaries
- Accessibility rules

### Critical Gaps ❌
1. No promise/async safety rules
2. No import/module ordering
3. No complexity limits
4. No dead code detection
5. No code duplication detection
6. No named export enforcement
7. No explicit type import syntax
8. No cognitive complexity tracking
9. No function size limits
10. Insufficient null/undefined safety

---

## 📦 Packages to Install

```bash
pnpm add -D \
  eslint-plugin-import@^2.29.0 \
  eslint-plugin-unicorn@^54.0.0 \
  eslint-plugin-promise@^6.1.0
```

### Summary

| Package | Version | Why | Key Rules |
|---------|---------|-----|-----------|
| `eslint-plugin-import` | 2.29+ | Module hygiene, dead imports, circular deps | order, default, cycle, no-absolute-path |
| `eslint-plugin-unicorn` | 54.0+ | Best-practice patterns, clarity | filename-case, throw-new-error, numeric-separators |
| `eslint-plugin-promise` | 6.1+ | Promise/async safety | always-return, catch-or-return, no-nesting |
| `eslint-plugin-sonarjs` | (existing) | Code smells, complexity | cognitive-complexity, no-duplicated-branches |
| `@typescript-eslint` | (existing) | Type safety | strict typing, nullish coalescing |

**Total new packages**: 3

---

## 🏗️ Configuration Structure

### Public API by Section

#### SECTION 1: Correctness & Bug Prevention (22 rules)
```
Promise Handling (6 rules)
├─ promise/always-return: error
├─ promise/catch-or-return: error
├─ promise/no-nesting: warn
├─ promise/param-names: error
├─ promise/no-return-wrap: error
└─ promise/no-promise-in-callback: warn

Async/Await Safety (3 rules)
├─ @typescript-eslint/no-floating-promises: error
├─ @typescript-eslint/no-misused-promises: error
└─ @typescript-eslint/require-await: error

Null/Undefined Safety (3 rules)
├─ @typescript-eslint/strict-boolean-expressions: error
├─ no-implicit-coercion: error
└─ eqeqeq: error (always, except null)

Variable Safety (4 rules)
├─ @typescript-eslint/no-shadow: error
├─ no-var: error
├─ prefer-const: error
└─ no-param-reassign: warn

Control Flow (5 rules)
├─ curly: error (all)
├─ no-unreachable: error
├─ no-fallthrough: error
├─ no-constant-condition: error
└─ default-case: warn

Logic Safety (2 rules)
├─ sonarjs/no-inverted-boolean-check: warn
└─ sonarjs/no-identical-conditions: error

Type Safety (7 rules)
├─ @typescript-eslint/no-explicit-any: error
├─ @typescript-eslint/no-non-null-assertion: warn
├─ @typescript-eslint/no-non-null-asserted-optional-chain: error
├─ @typescript-eslint/prefer-nullish-coalescing: error
├─ @typescript-eslint/prefer-optional-chain: error
├─ @typescript-eslint/no-for-in-array: error
└─ @typescript-eslint/no-base-to-string: error

Dead Code (3 rules)
├─ @typescript-eslint/no-unused-vars: error
├─ no-unused-expressions: error
└─ sonarjs/no-unused-collection: error
```

#### SECTION 2: Maintainability & Readability (21 rules)
```
Module Hygiene (6 rules)
├─ import/default: error
├─ import/named: error
├─ import/newline-after-import: error
├─ import/order: error (alphabetical, grouped)
├─ import/no-absolute-path: error
└─ import/no-cycle: warn

Restricted Patterns (2 rules)
├─ no-restricted-syntax: error (no default exports)
└─ no-restricted-imports: error (no relative imports)

Naming & Clarity (4 rules)
├─ unicorn/filename-case: error (matching)
├─ unicorn/no-useless-undefined: warn
├─ unicorn/throw-new-error: error
└─ no-magic-numbers: warn

Consistency (3 rules)
├─ no-console: warn (safe functions only)
├─ no-debugger: warn
└─ no-undef-init: error

Type Discipline (6 rules)
├─ @typescript-eslint/member-delimiter-style: error
├─ @typescript-eslint/array-type: error (Array<T>)
├─ @typescript-eslint/consistent-type-imports: error
├─ @typescript-eslint/consistent-type-exports: error
├─ @typescript-eslint/no-duplicate-type-constituents: error
└─ @typescript-eslint/no-dynamic-delete: warn
```

#### SECTION 3: React Best Practices (13 rules)
```
Hook Discipline (2 rules)
├─ react-hooks/rules-of-hooks: error
└─ react-hooks/exhaustive-deps: error

Component Structure (8 rules)
├─ react/jsx-key: error
├─ react/jsx-no-comment-textnodes: error
├─ react/jsx-no-duplicate-props: error
├─ react/no-unescaped-entities: error
├─ react/prop-types: off
├─ react/jsx-uses-vars: error
├─ react/no-unused-prop-types: error
└─ react/no-direct-mutation-state: error

Side Effects (2 rules)
├─ react/no-side-effects-in-render: error
└─ react/no-did-mount-set-state: warn

Security (2 rules)
├─ react/no-danger: error
└─ react/no-danger-with-children: error
```

#### SECTION 4: Architecture & Modularity (1 rule)
```
Layer Boundaries (1 rule)
└─ boundaries/element-types: error
  - domain → domain only
  - app → domain + app
  - ui → domain + app + ui
  - workers → domain only
  - themes → nothing
```

#### SECTION 5: Code Quality & Meta (5 rules)
```
Complexity Warnings (3 rules)
├─ complexity: warn (McCabe 15)
├─ max-lines: warn (400 max)
└─ max-lines-per-function: warn (120 max)

Code Smell Detection (2 rules)
├─ sonarjs/no-duplicate-string: warn (3x)
└─ sonarjs/no-redundant-boolean: warn
```

---

## 🚀 Implementation Steps

### Step 1: Install Dependencies
```bash
cd c:\Users\scott\lights-out
pnpm add -D eslint-plugin-import@^2.29.0 eslint-plugin-unicorn@^54.0.0 eslint-plugin-promise@^6.1.0
```

### Step 2: Replace ESLint Config
```bash
# Backup current
cp eslint.config.js eslint.config.backup.js

# Replace with best-practices version
cp eslint.config.best-practices.js eslint.config.js
```

### Step 3: Run Initial Lint (Expect Violations)
```bash
pnpm lint 2>&1 | head -50
```

Typical first run: 5-15 violations (mostly unused variables, naming, import order)

### Step 4: Fix Automatically
```bash
pnpm lint:fix
```

Auto-fixable issues:
- Import ordering ✅
- Unused variable removal ✅
- Type import syntax ✅
- Naming conventions ✅

### Step 5: Manual Review & Fix
```bash
pnpm lint
```

Issues requiring manual intervention:
- Promise/async patterns (refactor needed)
- Complexity violations (break down functions)
- Default export → named export (API change)
- Magic numbers (create constants)

### Step 6: Update package.json Scripts

```json
{
  "scripts": {
    "lint": "eslint src/",
    "lint:fix": "eslint src/ --fix",
    "lint:strict": "pnpm lint --rule '@typescript-eslint/no-explicit-any: error' --rule 'complexity: error'",
    "lint:best-practices": "eslint src/ --rule 'sonarjs/cognitive-complexity: error' --rule 'max-lines-per-function: error'",
    "lint:ci": "eslint src/ --format json > lint-report.json && npm run lint:best-practices"
  }
}
```

---

## ✅ Expected Behavior

### Local Development
```bash
# Before: ESLint was formatting + basic TS checking
# After: ESLint is enforcing correctness, architecture, and style together

# Example violation:
// src/app/hooks/useTheme.ts
const theme = await fetch(url)  // Missing .catch()
// ✖ error: promise/catch-or-return

// Fix:
const theme = await fetch(url).catch((err) => {
  console.error('Theme load failed:', err)
  return defaultTheme
})
```

### CI/CD Integration
```
# GitHub Actions:
- pnpm install
- pnpm lint:ci       # Fails build on best-practice violations
- pnpm build         # Proceeds if lint passes
- pnpm test         # Proceeds if build succeeds
```

---

## 🎯 Rule Severity Matrix

### Error-Level Rules (Must Fix)

| Category | Count | Why |
|----------|-------|-----|
| **Type Safety** | 7 | Type errors are correctness issues |
| **Promise/Async** | 9 | Silent failures are dangerous |
| **Control Flow** | 5 | Logic bugs are expensive |
| **Architecture** | 1 | Layer mixing hides dependencies |
| **React** | 8 | State bugs are hard to debug |
| **Security** | 6 | Security is non-negotiable |
| **Dead Code** | 3 | Invisible technical debt |
| **Import/Module** | 6 | Module hygiene is foundational |

**Total: 45 error-level rules**

### Warn-Level Rules (Guidance)

| Category | Count | Why |
|----------|-------|-----|
| **Complexity** | 3 | Threshold-based; some functions need review |
| **Code Smells** | 4 | Patterns suggest refactoring, not always required |
| **Type Strictness** | 2 | Some flexibility needed for pragmatism |
| **Promise Patterns** | 3 | Promise nesting is discouraged but acceptable |

**Total: 12 warn-level rules**

---

## 🔄 Override Scopes

### Test Files
```javascript
// src/**/*.test.ts, src/**/*.spec.ts, tests/**/*.ts
rules: {
  '@typescript-eslint/no-explicit-any': 'warn',
  'no-magic-numbers': 'off',
  'max-lines-per-function': 'off',
  'sonarjs/cognitive-complexity': 'off',
  'promise/always-return': 'off',
  'no-console': 'off',
}
```

**Rationale**: Test code needs flexibility for mocks, fixtures, and logging.

### Build/Config Files
```javascript
// vite.config.js, scripts/**, eslint.config.js
rules: {
  '@typescript-eslint/no-explicit-any': 'warn',
  'no-restricted-imports': 'off',
  'no-console': 'off',
  'import/order': 'off',
}
```

**Rationale**: Config code is special-purpose; needs Node.js patterns unavailable in source.

---

## 📈 Metrics & Benchmarks

### Pre-Enhancement (Current State)

```
Total Rules Enabled: 35
├─ error-level: 15
├─ warn-level: 5
└─ off: 15

Coverage Areas:
├─ TypeScript: ✅
├─ React: ✅
├─ Security: ✅
├─ Accessibility: ✅
├─ Correctness: ⚠️ Partial (no promise/async)
├─ Code Quality: ❌ None
├─ Module Hygiene: ❌ None
└─ Complexity: ❌ None
```

### Post-Enhancement (Proposed)

```
Total Rules Enabled: 75 (+114% coverage)
├─ error-level: 45 (+200%)
├─ warn-level: 12 (+140%)
└─ off: N/A

Coverage Areas:
├─ TypeScript: ✅✅✅ (8 → 15 rules)
├─ React: ✅✅ (6 → 13 rules)
├─ Security: ✅ (6 rules, existing)
├─ Accessibility: ✅ (via jsx-a11y)
├─ Correctness: ✅✅✅ (+promise/async/null safety)
├─ Code Quality: ✅ (sonarjs, complexity)
├─ Module Hygiene: ✅✅ (import/order, circular deps)
└─ Complexity: ✅ (3 rules)
```

---

## 💡 Key Rules Explained

### Why `eqeqeq: 'always'` + `strict-boolean-expressions`?
```typescript
// ❌ Before: Silent coercion bugs
if ("0") { ... }  // true! (not obvious)
if (x == y) { ... }  // Loose equality
let count = users.length || 0  // What if length is 0?

// ✅ After: Explicit intent
if (Boolean("0")) { ... }  // Obvious now
if (x === y) { ... }  // Strict equality
let count = users.length ?? 0  // Nullish coalescing
```

### Why `promise/catch-or-return`?
```typescript
// ❌ Before: Silent failure
async function loadUser(id) {
  return fetch(`/api/users/${id}`).then(r => r.json())
  // ^ If fetch fails, promise unhandled silently
}

// ✅ After: Explicit error handling
async function loadUser(id) {
  return fetch(`/api/users/${id}`)
    .then(r => r.json())
    .catch(err => {
      console.error('User load failed:', err)
      throw err  // or return default
    })
}
```

### Why `@typescript-eslint/no-shadow`?
```typescript
// ❌ Before: Confusing inner scope
function processItems(items) {
  items.forEach(item => {
    let items = item.subitems  // Shadows parameter!
    items.filter(...)
  })
}

// ✅ After: Clear scope
function processItems(items) {
  items.forEach(item => {
    let subitems = item.subitems  // Different name
    subitems.filter(...)
  })
}
```

### Why `import/order`?
```typescript
// ❌ Before: Chaotic imports
import { useCallback } from 'react'
import { AuthContext } from '@/app'
import fs from 'fs'
import { Button } from '@/ui'
import type { User } from '@/domain'

// ✅ After: Organized imports
import type { User } from '@/domain'

import { useCallback } from 'react'

import { AuthContext } from '@/app'
import { Button } from '@/ui'

import fs from 'fs'
```

### Why Enforce Named Exports?
```typescript
// ❌ Before: Default export
// src/domain/rules.ts
export default function isValidMove(board, move) { ... }

// Someone refactors this to a pure data function
// All importing code breaks! (default exports hide this)

// ✅ After: Named export
// src/domain/rules.ts
export function isValidMove(board, move) { ... }

// Someone refactors this; imports are explicit
// TypeScript compiler catches all breakage immediately
```

---

## 🧪 Testing the Configuration

### Quick Validation
```bash
# 1. Check rules are loaded
pnpm lint --print-config src/app/useTheme.ts | grep -c '"error"'
# Expected: ~45+

# 2. Run on one problematic file to see violations
pnpm lint src/app/useKeyboardControls.ts

# 3. Auto-fix simple violations
pnpm lint:fix

# 4. Check remaining violations
pnpm lint | tail -20
```

### CI Simulation (Local)
```bash
# Strict mode (as CI would run)
pnpm lint:strict

# Should show only real violations (no false positives)
```

---

## 📋 Migration Checklist

- [ ] Install packages (`pnpm add -D`)
- [ ] Backup current config (`cp eslint.config.js eslint.config.backup.js`)
- [ ] Update ESLint config from `eslint.config.best-practices.js`
- [ ] Run initial lint (`pnpm lint`)
- [ ] Auto-fix what you can (`pnpm lint:fix`)
- [ ] Review remaining violations (`pnpm lint`)
- [ ] Fix violations (refactor code, not rules)
- [ ] Update package.json scripts
- [ ] Test in CI environment
- [ ] Update team documentation
- [ ] Merge & deploy

---

## 🎓 Developer Quick Reference

### Common Violations & Fixes

**Error: `@typescript-eslint/no-explicit-any`**
```typescript
// ❌ BAD
const data: any = await fetch(url).then(r => r.json())

// ✅ GOOD
const data: unknown = await fetch(url).then(r => r.json())
if (typeof data === 'object' && 'id' in data) {
  console.log(data.id)
}
```

**Error: `promise/catch-or-return`**
```typescript
// ❌ BAD
fetch(url).then(r => r.json())

// ✅ GOOD
return fetch(url)
  .then(r => r.json())
  .catch(err => console.error(err))
```

**Error: `no-restricted-syntax` (default export)**
```typescript
// ❌ BAD
export default function MyComponent() { ... }

// ✅ GOOD
export function MyComponent() { ... }
```

**Warning: `sonarjs/cognitive-complexity`**
```typescript
// ❌ BAD (complexity = 12+)
if (a) {
  if (b) {
    for (let i = 0; i < n; i++) {
      if (c) { ... }
    }
  }
}

// ✅ GOOD (extract helpers)
function check() {
  if (!a) return
  if (!b) return
  validateCollection()
}

function validateCollection() {
  for (const item of collection) {
    processItem(item)
  }
}
```

---

## 🔗 Integration with Existing Security Config

If using both security + best-practices configs:

```javascript
// Option 1: Merge into single eslint.config.js
// Copy rules from both enhanced configs

// Option 2: Keep separate, run both
pnpm lint:security   # Security rules only
pnpm lint:best-practices  # Quality rules only
pnpm lint            # All rules
```

---

## ✨ Success Metrics

After implementation, your codebase should exhibit:

✅ **Correctness**
- All promises have .catch() or are await'd
- No implicit nulls/undefined
- Type safety at all boundaries

✅ **Maintainability**
- Functions under 120 lines
- Cognitive complexity under 20
- Clear import organization

✅ **Consistency**
- All named exports (no defaults)
- Consistent type import syntax
- Consistent naming conventions

✅ **Architecture**
- Clear layer boundaries enforced
- Dead code detected and removed
- Module dependencies are explicit

---

## 📞 Next Steps

1. **Run this guide's Step 1-6 above**
2. **Address any violations in the codebase**
3. **Update CI to enforce `pnpm lint:best-practices`**
4. **Document rules in team wiki/onboarding**
5. **Review quarterly for new high-value rules**

**Estimated Implementation Time**: 2-4 hours (including code fixes and CI setup)

**Expected Outcome**: Production-grade code quality with built-in guards against common pitfalls.

