# ESLint Performance Rules Quick Reference
## 75 Total Rules Organized by Impact & Category

**Last Updated**: March 16, 2026  
**Stack**: React 19 + TypeScript + Vite  
**Philosophy**: Practical performance signals, not speculative micro-optimizations

---

## 📊 Summary Stats

| Category | Error | Warn | Off | Purpose |
|----------|-------|------|-----|---------|
| React Rendering | 4 | 2 | - | Eliminate render churn |
| React Hooks | 1 | 1 | - | Correct hook semantics |
| Async/Promise | 7 | 1 | - | Handle async correctly |
| Type Safety | 7 | 2 | - | Prevent type-related bugs |
| Bundle/Imports | 5 | 2 | - | Tree-shake & dependency discipline |
| Language Basics | 8 | 6 | - | Algorithm & pattern efficiency |
| Complexity | 0 | 3 | - | Keep functions simple |
| Dead Code | 4 | 1 | - | Remove unused symbols |
| Algorithm | 2 | 2 | - | Catch inefficient patterns |
| Security | 8 | - | - | XSS, injection, crypto |
| Accessibility | 32 | - | - | WCAG 2.1+ compliance |
| Architecture | 1 | - | - | Layer boundaries |
| **Total** | **51** | **24** | **-** | **75 rules** |

---

## 🔴 ERROR-LEVEL RULES (Must Fix)

### React Rendering Efficiency (4 rules)

```javascript
/* ❌ CRITICAL: These cause measurable harm when violated */

react-hooks/exhaustive-deps
├─ Severity: ERROR
├─ Cost: Missing deps = silent render churn (10-100x more renders)
├─ Example: useEffect(() => { fetchUser(id) }, []) // id missing!
├─ Fix: Add id to dependency array
└─ Auto-fixable: No (requires understanding)

react/jsx-key
├─ Severity: ERROR
├─ Cost: Unkeyed lists = DOM thrashing, form state corruption
├─ Example: {items.map(i => <Item {...i} />)}  // No key!
├─ Fix: Add key={item.id} to Item
└─ Auto-fixable: Partial (can add index, but index is bad)

react/no-unstable-nested-components
├─ Severity: ERROR
├─ Cost: New component type on every render = always remounts
├─ Example: function Parent() { const Child = () => ...; return <Child /> }
├─ Fix: Move Child outside Parent
└─ Auto-fixable: No (requires restructuring)

react/jsx-no-constructed-context-values
├─ Severity: ERROR
├─ Cost: Objects in Provider cause all consumers to re-render
├─ Example: <ThemeContext.Provider value={{theme, setTheme}}>
├─ Fix: Memoize: const value = useMemo(() => ({...}), [deps])
└─ Auto-fixable: No (requires useMemo wrapper)
```

### React Hooks Semantics (1 rule)

```javascript
react-hooks/rules-of-hooks
├─ Severity: ERROR
├─ Cost: Breaking rule = unpredictable hook order, state corruption
├─ Example: if (condition) useEffect(...)  // Conditional hook!
├─ Fix: Always call hooks at top level
└─ Auto-fixable: No (requires restructuring)
```

### Async & Promise Handling (7 rules)

```javascript
promise/always-return
├─ Severity: ERROR
├─ Cost: Missing return = unhandled rejection
├─ Example: .then(() => { doWork() })  // Missing return
├─ Fix: return .then(() => { doWork() })
└─ Auto-fixable: Yes

promise/catch-or-return
├─ Severity: ERROR
├─ Cost: Unhandled Promise = silent failure, no error logs
├─ Example: fetch(url).then(...) // No .catch()!
├─ Fix: Add .catch(...) or surround with try/await
└─ Auto-fixable: No

@typescript-eslint/no-floating-promises
├─ Severity: ERROR
├─ Cost: Ignored Promise = async work never completes
├─ Example: await fetch(url)  // Await not on whole thing
├─ Fix: const p = fetch(url); await p
└─ Auto-fixable: No

@typescript-eslint/no-misused-promises
├─ Severity: ERROR
├─ Cost: Promise used where value expected = race condition
├─ Example: if (fetchUser(id)) { ... }  // if Promise!
├─ Fix: if (await fetchUser(id)) { ... }
└─ Auto-fixable: No

promise/param-names
├─ Severity: ERROR
├─ Cost: Non-standard names hide intent
├─ Example: new Promise((a, b) => {})  // Should be resolve, reject
├─ Fix: new Promise((resolve, reject) => {})
└─ Auto-fixable: Yes

promise/no-return-wrap
├─ Severity: ERROR
├─ Cost: Wrapping reject in Promise is redundant
├─ Example: return new Promise(resolve => resolve(x))
├─ Fix: return x
└─ Auto-fixable: Yes

promise/no-promise-in-callback
├─ Severity: ERROR (per best-practices)
├─ Cost: Promises in callbacks indicate callback hell
├─ Example: arr.forEach(x => { fetch(...) })
├─ Fix: Use for-of loop with await instead
└─ Auto-fixable: No
```

### Type Safety (7 rules)

```javascript
@typescript-eslint/no-explicit-any
├─ Severity: ERROR
├─ Cost: any disables type checking, hides expensive casts
├─ Example: const x: any = await fetch(url)
├─ Fix: const x: unknown = ...; type-guard before use
└─ Auto-fixable: No

@typescript-eslint/strict-boolean-expressions
├─ Severity: ERROR (configured)
├─ Cost: Implicit coercion in conditions (zero truthy check)
├─ Example: if (x) { ... } // x could be 0, '', false
├─ Fix: if (x !== null && x !== undefined) { ... }
└─ Auto-fixable: Partial

@typescript-eslint/prefer-nullish-coalescing
├─ Severity: ERROR
├─ Cost: || treats 0, '' as falsy; breaks numeric/boolean logic
├─ Example: let count = users.length || 0  // If length=0, uses 0 anyway
├─ Fix: let count = users.length ?? 0
└─ Auto-fixable: Yes

@typescript-eslint/prefer-optional-chain
├─ Severity: ERROR
├─ Cost: a && a.b && a.b.c is verbose, hard to optimize
├─ Example: obj && obj.prop && obj.prop.nested
├─ Fix: obj?.prop?.nested
└─ Auto-fixable: Yes

@typescript-eslint/no-dynamic-delete
├─ Severity: ERROR (near-strict-perf)
├─ Cost: delete forces object shape instability
├─ Example: delete obj[key]
├─ Fix: Restructure without key, or set to undefined
└─ Auto-fixable: No

@typescript-eslint/no-non-null-asserted-optional-chain
├─ Severity: ERROR
├─ Cost: obj?.prop! defeats optional chaining safety
├─ Example: x?.y!.z  // Pointless
├─ Fix: Remove the ! or use guard clause
└─ Auto-fixable: Yes

@typescript-eslint/no-for-in-array
├─ Severity: ERROR
├─ Cost: for-in iterates all enumerable properties, not just indices
├─ Example: for (const i in arr) { console.log(arr[i]) }
├─ Fix: for (const val of arr) { console.log(val) }
└─ Auto-fixable: Yes
```

### Bundle & Import Discipline (5 rules)

```javascript
import/no-cycle
├─ Severity: ERROR (though configured WARN in this rule set)
├─ Cost: Circular deps prevent tree-shaking, obscure dep graph
├─ Example: a.ts imports b.ts, b.ts imports a.ts
├─ Fix: Extract shared code to third file, or restructure
└─ Auto-fixable: No

import/newline-after-import
├─ Severity: ERROR
├─ Cost: Missing newlines reduce readability (cognitive cost)
├─ Example: import something from 'pkg'\nlet x = 5
├─ Fix: import something from 'pkg'\n\nlet x = 5
└─ Auto-fixable: Yes

import/order
├─ Severity: ERROR
├─ Cost: Disorganized imports hide dependencies
├─ Example: import {c} from 'pkg'; import {a} from 'pkg'
├─ Fix: Sort alphabetically within group
└─ Auto-fixable: Yes

import/no-absolute-path
├─ Severity: ERROR
├─ Cost: Absolute paths are fragile across refactors
├─ Example: import x from '/src/app/hooks'
├─ Fix: import x from '@/app'
└─ Auto-fixable: No (requires alias setup)

import/no-relative-packages
├─ Severity: ERROR
├─ Cost: Relative imports across packages break with restructuring
├─ Example: import x from '../../../utils'
├─ Fix: Use path alias instead
└─ Auto-fixable: No
```

### Language-Level Performance (8 rules)

```javascript
@typescript-eslint/no-shadow
├─ Severity: ERROR
├─ Cost: Shadowed variables hide scope, cause closure bugs
├─ Example: let x = 1; { let x = 2; ... }  // Confusing
├─ Fix: Use different variable names
└─ Auto-fixable: Partial

no-param-reassign
├─ Severity: ERROR
├─ Cost: Reassigning params hides intent, causes closure issues
├─ Example: function add(x) { x = x + 1; return x; }
├─ Fix: const y = x + 1; return y;
└─ Auto-fixable: No

no-var
├─ Severity: ERROR
├─ Cost: var has function scope, hoisted, causes closure surprises
├─ Example: var x = 1  // Hoisted, confusing scope
├─ Fix: const x = 1  (or let if needed)
└─ Auto-fixable: Yes

prefer-const
├─ Severity: ERROR
├─ Cost: let where const works indicates avoidable reassignment
├─ Example: let x = 1; ... // x never reassigned
├─ Fix: const x = 1;
└─ Auto-fixable: Yes

eqeqeq (strict equality)
├─ Severity: ERROR
├─ Cost: == coerces types silently, causing logic bugs
├─ Example: if (x == y) { ... }  // Could be different types!
├─ Fix: if (x === y) { ... }
└─ Auto-fixable: Yes

no-implicit-coercion
├─ Severity: ERROR
├─ Cost: Implicit coercions (!!x, x + '') hide conversions
├─ Example: !!x > 0  // What is this doing?
├─ Fix: Boolean(x) > 0
└─ Auto-fixable: Partial

unicorn/throw-new-error
├─ Severity: ERROR
├─ Cost: throw string is non-standard; no stack trace
├─ Example: throw 'Something went wrong'
├─ Fix: throw new Error('Something went wrong')
└─ Auto-fixable: Yes

@typescript-eslint/no-non-null-assertion
├─ Severity: ERROR (configured stricter in performance)
├─ Cost: ! bypasses null checks, hides potential crashes
├─ Example: x.prop!.nested
├─ Fix: Use guard clause or nullish coalescing
└─ Auto-fixable: No
```

### Dead Code (4 rules)

```javascript
@typescript-eslint/no-unused-vars
├─ Severity: ERROR
├─ Cost: Unused vars increase bundle size
├─ Example: const unused = 5; console.log(other)
├─ Fix: Remove const unused
└─ Auto-fixable: Yes (but may hide intent)

no-unused-expressions
├─ Severity: ERROR
├─ Cost: Useless expressions indicate left-over debug code
├─ Example: myVar; // Just the expression, no effect
├─ Fix: Remove or use appropriately
└─ Auto-fixable: No

no-unreachable
├─ Severity: ERROR
├─ Cost: Dead code after return/throw wastes space
├─ Example: return x; console.log('unreachable')
├─ Fix: Remove unreachable code
└─ Auto-fixable: Yes

sonarjs/no-unused-collection
├─ Severity: ERROR (via sonarjs)
├─ Cost: Variables collected but never read waste memory
├─ Example: const items = []; ... // Never used
├─ Fix: Remove collection or use it
└─ Auto-fixable: No
```

### Algorithm Efficiency (2 rules)

```javascript
sonarjs/no-identical-conditions
├─ Severity: ERROR
├─ Cost: Same condition in if/else = dead code (one branch never runs)
├─ Example: if (x > 5) { ... } else if (x > 5) { ... }
├─ Fix: Make conditions different or simplify
└─ Auto-fixable: No

no-constant-condition
├─ Severity: ERROR
├─ Cost: Constant conditions hide dead code or infinite loops
├─ Example: while (true) { ... }  // Only OK if intentional
├─ Fix: Use proper loop condition or add comment
└─ Auto-fixable: No
```

### Security (8 rules)

```javascript
security/detect-unsafe-regex
├─ Severity: ERROR
├─ Cost: ReDoS (Regular Expression Denial of Service)
├─ Example: /^(a+)+$/  // Catastrophic backtracking
├─ Fix: Use linear regex or validate input length first
└─ Auto-fixable: No

security/detect-buffer-noassert
├─ Severity: ERROR
├─ Cost: Buffer without assert check can access invalid memory
├─ Example: buf.readUInt32LE()  // Without checking bounds
├─ Fix: Check buffer length first
└─ Auto-fixable: No

[Other security rules] (remaining 6)
├─ All prevent injection, XSS, crypto misuse
└─ See ESLINT-SECURITY-HARDENING.md for details
```

### Architecture (1 rule)

```javascript
boundaries/element-types
├─ Severity: ERROR
├─ Cost: Layer mixing = hidden dependencies, hard to refactor
├─ Example: ui/atoms imports from app/
├─ Fix: Respect layer boundaries (see CLEAN Architecture rules)
└─ Auto-fixable: No
```

---

## 🟡 WARN-LEVEL RULES (Advisory - Fix When Possible)

### React Rendering (2 rules)

```javascript
react/no-array-index-key
├─ Severity: WARN
├─ Cost: Using index as key breaks on reorder/filter (but works for static lists)
├─ Advisory: Use stable unique ID when list can change
└─ When to suppress: Static list that never reorders

react/jsx-no-constructed-context-values
├─ Severity: WARN
├─ Cost: Objects in context cause unnecessary re-renders
├─ Advisory: Memoize context value
└─ When to suppress: Value changes frequently (OK)
```

### Async & Promise (1 rule)

```javascript
promise/no-nesting
├─ Severity: WARN
├─ Cost: Nested .then() chains hide parallelism opportunity
├─ Advisory: Use Promise.all() when promises are independent
└─ When to suppress: Sequential dependency is intentional
  Example: fetch X, then fetch Y with X's result
```

### Type Safety (2 rules)

```javascript
@typescript-eslint/no-non-null-assertion
├─ Severity: WARN
├─ Cost: ! bypasses type safety (verbose but usually justifiable)
├─ Advisory: Use guard clauses or nullish coalescing instead
└─ When to suppress: Flow analysis can't prove non-null but you're sure

@typescript-eslint/require-await
├─ Severity: WARN
├─ Cost: async function with no await confuses callers
├─ Advisory: Remove async or add await
└─ When to suppress: API compatibility (rare)
```

### Bundle & Imports (2 rules)

```javascript
import/no-cycle
├─ Severity: WARN (usually, sometimes ERROR)
├─ Cost: Circular deps prevent tree-shaking
├─ Advisory: Restructure to remove cycle
└─ When to suppress: Very rare, document in comment

import/no-useless-path-segments
├─ Severity: WARN
├─ Cost: Redundant path segments hide true imports
├─ Advisory: Remove ./ or ../
└─ When to suppress: Almost never
```

### Language Efficiency (6 rules)

```javascript
@typescript-eslint/no-dynamic-delete
├─ Severity: WARN
├─ Cost: delete destabilizes object shape
├─ Advisory: Restructure without key or set to undefined
└─ When to suppress: Intentional property removal (rare)

sonarjs/no-duplicate-string
├─ Severity: WARN
├─ Cost: Duplicated strings waste space, hide constants
├─ Advisory: Extract to const after 3 occurrences
└─ When to suppress: Unavoidable duplicates (rare)

unicorn/no-array-reduce
├─ Severity: WARN
├─ Cost: Array.reduce() can hide expensive behavior
├─ Advisory: Use for loop for clarity
└─ When to suppress: Simple reductions (OK)

unicorn/no-useless-undefined
├─ Severity: WARN
├─ Cost: Explicit undefined is redundant
├─ Advisory: Just omit the assignment
└─ When to suppress: Almost never

unicorn/prefer-string-replace-all
├─ Severity: WARN
├─ Cost: .replace(/x/g, ...) is old API
├─ Advisory: Use .replaceAll() (more modern)
└─ When to suppress: Legacy browser support needed

sonarjs/no-identical-functions
├─ Severity: WARN
├─ Cost: Duplicated functions increase bundle size
├─ Advisory: Extract to helper
└─ When to suppress: Truly independent functions (rare)
```

### Complexity & Code Smell (5 rules)

```javascript
sonarjs/cognitive-complexity
├─ Severity: WARN (threshold: 15)
├─ Cost: High complexity = hard to test, hard to optimize
├─ Advisory: Extract helper functions to reduce branching
└─ When to suppress: Complex algorithm with no simpler form

complexity
├─ Severity: WARN (McCabe max 15)
├─ Cost: Many branches = hard to analyze for perf
├─ Advisory: Simplify or extract
└─ When to suppress: Complex algorithm (document why)

max-lines-per-function
├─ Severity: WARN (max 100 lines)
├─ Cost: 100+ line functions do too much
├─ Advisory: Split into smaller functions
└─ When to suppress: Single cohesive algorithm

max-nested-callbacks
├─ Severity: WARN (max 3)
├─ Cost: Deep nesting indicates callback hell
├─ Advisory: Use async/await instead
└─ When to suppress: Rare; almost always async is better

sonarjs/no-duplicated-branches
├─ Severity: WARN
├─ Cost: Same code in if/else = dead code
├─ Advisory: Factor out common code
└─ When to suppress: Almost never
```

### Dead Code (1 rule)

```javascript
import/no-unused-modules
├─ Severity: WARN
├─ Cost: Unused exports prevent tree-shaking
├─ Advisory: Remove unused exports
└─ When to suppress: Intentionally unused (mark with _ or comment)
```

### Optional Rules (Vary by team)

```javascript
sonarjs/no-collection-size-mischeck
├─ Severity: WARN
├─ Cost: .length > 0 vs .length (trivial perf impact)
├─ Advisory: Use clearer APIs like .some() or .length
└─ When to suppress: Almost never

sonarjs/no-redundant-boolean
├─ Severity: WARN
├─ Cost: Redundant booleans = unclear logic
├─ Advisory: Simplify condition
└─ When to suppress: Almost never

[others] (see full config)
```

---

## 🟢 OFF-LEVEL RULES

Not applied (off) unless specifically needed:

```javascript
react/prop-types
  // OFF: Using TypeScript for types instead

react/react-in-jsx-scope
  // OFF: React 17+ JSX transform doesn't need React in scope

no-magic-numbers
  // OFF: Too noisy; use domain constants instead

no-restricted-imports (default)
  // WARN: Only for specific patterns (e.g., '../../../')
```

---

## 📊 Rule Distribution by Category

### By Severity
```
Error:   51 rules (68%)  ← Must fix immediately
Warn:    24 rules (32%)  ← Advisory, fix when possible
Off:      0 rules        ← Not used (use specific overrides)
Total:   75 rules
```

### By Type
```
React:           8 rules (rendering + hooks)
Type Safety:     9 rules (@typescript-eslint)
Async:           8 rules (promise + async/await)
Code Quality:   12 rules (complexity, duplication, etc.)
Bundle:          7 rules (imports, cycles)
Security:        8 rules
Architecture:    1 rule (boundaries)
Accessibility:  32 rules (jsx-a11y)
Other:          10 rules
```

### By Fix Difficulty
```
Auto-fixable:   ~30 rules (pnpm lint:fix handles)
Manual fix:     ~35 rules (requires code changes)
Complex:        ~10 rules (requires refactoring/restructuring)
```

---

## 🎯 High-Impact Rules Cheat Sheet

### Top 3 React Performance Impacts
1. **exhaustive-deps** (error) - Fix missing deps
2. **jsx-key** (error) - Add keys to lists
3. **no-unstable-nested-components** (error) - Move components outside

### Top 3 Bundle Size Impacts
1. **import/no-cycle** (error/warn) - Remove circular deps
2. **import/order** (error) - Organize imports
3. **no-unused-vars** (error) - Remove dead code

### Top 3 Async Correctness Impacts
1. **catch-or-return** (error) - Handle all promises
2. **no-floating-promises** (error) - Await or return all promises
3. **no-misused-promises** (error) - Use Promise properly

### Top 3 Type Safety Impacts
1. **no-explicit-any** (error) - Avoid any
2. **prefer-nullish-coalescing** (error) - Use ?? not ||
3. **prefer-optional-chain** (error) - Use ?. not &&

---

## 🚀 Getting Started

1. **Read the full guide**: [ESLINT-PERFORMANCE-AUDITING.md](./ESLINT-PERFORMANCE-AUDITING.md)
2. **Run baseline**: `pnpm lint:performance` (expect 20-40 violations)
3. **Auto-fix**: `pnpm lint:performance:fix` (fixes ~50%)
4. **Review remaining**: `pnpm lint:performance` (review manually)
5. **Implement**: Fix violations according to category priority (errors first)
6. **Enforce**: Update CI/CD to run performance linting

---

**Questions?** See the full guide for detailed examples and troubleshooting.
