# Test File Naming Convention & Organization

**Status**: ✅ Enforced via `pnpm test:names`  
**Updated**: April 1, 2026  
**Framework**: Vitest (unit/integration/component/api) + Playwright (e2e/a11y/visual) + k6 (perf)

---

## 🎯 The Rule

**Feature name comes FIRST. Test type comes AFTER.**

```
✅ GOOD              ❌ BAD
─────────────────────────────────────
auth.unit.test.ts  →  test.auth.ts
login.e2e.spec.ts  →  e2e.login.spec.ts
button.component   →  component.button
  .test.tsx          .test.tsx
```

---

## ✅ Valid File Naming Patterns

### Vitest Tests (Use `.test.*`)

Test type determines which framework runs the test. File contains no JSX rendering.

| Type | Pattern | Purpose | Location |
|------|---------|---------|----------|
| **unit** | `<feature>.unit.test.ts` | Pure logic, no deps | colocated or `tests/unit/` |
| **integration** | `<feature>.integration.test.ts` | Logic + mocked services | colocated or `tests/integration/` |
| **component** | `<feature>.component.test.tsx` | React component behavior | colocated or `tests/unit/` |
| **api** | `<feature>.api.test.ts` | HTTP endpoints, mocked APIs | colocated or `tests/api/` |

**Examples:**
```
src/domain/auth.unit.test.ts
src/app/useTheme.integration.test.ts
src/ui/atoms/Button.component.test.tsx
src/services/api.api.test.ts
```

**Run:**
```bash
pnpm test              # Run all
pnpm test:unit         # Unit only
pnpm test:integration  # Integration only
pnpm test:component    # Component only
pnpm test:api          # API only
pnpm test:coverage     # With coverage report
pnpm test:watch        # Watch mode (TDD)
```

### Playwright Tests (Use `.spec.*`)

Test type indicates Playwright test runner. These run in a real browser.

| Type | Pattern | Purpose | Location |
|------|---------|---------|----------|
| **e2e** | `<feature>.e2e.spec.ts(x)` | Full user workflows | `tests/e2e/` |
| **a11y** | `<feature>.a11y.spec.ts(x)` | Accessibility (axe-core) | `tests/a11y/` |
| **visual** | `<feature>.visual.spec.ts(x)` | Screenshot regression | `tests/visual/` |

**Examples:**
```
tests/e2e/checkout.e2e.spec.ts
tests/a11y/keyboard-nav.a11y.spec.ts
tests/visual/dashboard.visual.spec.ts
```

**Run:**
```bash
pnpm test:e2e          # All E2E tests
pnpm test:e2e:debug    # E2E with Playwright inspector
pnpm test:a11y         # All a11y tests
pnpm test:visual       # All visual regression tests
pnpm test:ci           # All Vitest + all E2E
```

### Performance Tests (Use `.js`)

Performance, load, stress, soak, spike tests use k6 or similar tools.

| Type | Pattern | Purpose | Location |
|------|---------|---------|----------|
| **perf** | `<feature>.perf.js` | Performance profiling | `tests/performance/` |
| **load** | `<feature>.load.js` | Load testing (VU/RPS curves) | `tests/performance/` |
| **stress** | `<feature>.stress.js` | Stress testing (find breaking point) | `tests/performance/` |
| **soak** | `<feature>.soak.js` | Long-running stability | `tests/performance/` |
| **spike** | `<feature>.spike.js` | Sudden traffic spikes | `tests/performance/` |

**Examples:**
```
tests/performance/board-rendering.perf.js
tests/performance/api-gateway.load.js
tests/performance/checkout-flow.stress.js
```

---

## ❌ Invalid Patterns (Always Rejected)

These will **fail** `pnpm test:names`:

```
❌ test.auth.ts              # Feature name NOT first
❌ auth.test.unit.ts         # Type NOT in position 2 (reversed)
❌ unit.auth.test.ts         # Generic name first
❌ test.ts                   # No feature name
❌ index.test.ts             # Too generic (unless genuinely tests index.ts)
❌ app.test.ts               # Too generic
❌ main.spec.ts              # Too generic
❌ component.tsx             # No test classification
❌ auth.spec.ts              # Missing test type (unit/e2e/etc.)
❌ component.test.ts         # Should be name.component.test.ts
```

---

## 📍 Folder Organization

Choose one pattern and stick to it:

### Pattern A: Colocated Tests (Recommended for small projects)

```
src/
├── domain/
│   ├── board.unit.test.ts      ← test file next to source
│   ├── board.ts                ← source file
│   └── rules.integration.test.ts
├── app/
│   ├── useTheme.tsx
│   └── useTheme.component.test.tsx
└── ui/
    ├── Button.tsx
    └── Button.component.test.tsx
```

**Pros:** Easy to find tests  
**Cons:** Larger source directories

### Pattern B: Centralized Tests (Recommended for larger projects)

```
tests/
├── unit/
│   ├── board.unit.test.ts
│   ├── rules.unit.test.ts
│   └── useTheme.unit.test.ts
├── integration/
│   ├── api-gateway.integration.test.ts
│   └── state-management.integration.test.ts
├── component/
│   ├── Button.component.test.tsx
│   └── Menu.component.test.tsx
├── e2e/
│   ├── checkout.e2e.spec.ts
│   ├── login.e2e.spec.ts
│   └── payment.e2e.spec.ts
├── a11y/
│   ├── keyboard-nav.a11y.spec.ts
│   └── screen-reader.a11y.spec.ts
└── performance/
    ├── board-rendering.perf.js
    └── api-throughput.load.js
```

**Pros:** Clean separation, scalable  
**Cons:** Separate from source files

---

## 🔍 Feature Name Guidelines

Feature names should be:

✅ **Specific**: `auth-handler.unit.test.ts`, not `test.unit.test.ts`  
✅ **Kebab-case**: `user-profile.unit.test.ts`, not `UserProfile.unit.test.ts`  
✅ **Descriptive**: `checkbox-toggle.component.test.tsx`, not `comp.component.test.tsx`  
✅ **Include domain prefix if helpful**: `sudoku-solver.unit.test.ts`, `chess-minimax.perf.js`

❌ **Avoid**: Generic names like `app`, `main`, `index`, `test`, `component`, `spec`

---

## 🚀 Running Tests by Category

```bash
# Vitest (Unit/Integration/Component/API)
pnpm test              # All Vitest tests
pnpm test:unit         # Unit only
pnpm test:integration  # Integration only
pnpm test:component    # Components only
pnpm test:api          # API only
pnpm test:watch        # Watch mode
pnpm test:coverage     # With coverage

# Playwright (E2E/A11y/Visual)
pnpm test:e2e          # E2E tests
pnpm test:a11y         # Accessibility tests
pnpm test:visual       # Visual regression

# Full validation
pnpm test:ci           # All tests (CI-safe)
pnpm test:smoke        # Quick smoke test (unit + component)
pnpm test:names        # Naming validation only

# Development
pnpm test:watch        # Watch mode (Vitest auto-rerun)
pnpm test:e2e:debug    # E2E with Playwright inspector

# Naming validation
pnpm test:names        # Strict validation
pnpm test:names:verbose # With details
```

---

## ✋ Enforcement

Naming is automatically enforced at multiple stages:

### 1. Pre-commit Hook (if enabled)
```bash
git commit  # Runs lint:fix and test:names validation
```

### 2. CI Pipeline
```yaml
- name: Test Naming
  run: pnpm test:names
```

### 3. Local Validation
```bash
pnpm test:names        # Fails if any file has invalid name
pnpm test:names:verbose # Shows detailed problems + suggestions
```

**Failure Output Example:**
```
❌ INVALID TEST NAME: tests/auth.spec.ts
   Reason: Missing test type (must include: unit, integration, component, api, e2e, a11y, visual,perf, etc.)
   Examples of valid names:
     ✅ auth.unit.test.ts
     ✅ auth.e2e.spec.ts
     ✅ auth.component.test.tsx

   See: docs/TEST_NAMING_CONVENTION.md for complete rules
```

---

## 🔧 Creating New Tests

### Step 1: Choose Test Type

```
What are you testing?
├── Pure function/logic              → .unit.test.ts
├── Logic + mocked dependencies      → .integration.test.ts
├── React component rendering        → .component.test.tsx
├── HTTP endpoint/API contract       → .api.test.ts
├── Full user workflow (browser)     → .e2e.spec.ts
├── Keyboard/screen reader/ARIA      → .a11y.spec.ts
├── Visual appearance regression     → .visual.spec.ts
├── Performance/profiling            → .perf.js
├── Load testing                     → .load.js
└── Stress/soak/spike testing        → .stress.js / .soak.js / .spike.js
```

### Step 2: Name File

```
<feature-name>.<test-type>.test.ts
    ↑                      ↑
  [feature]           [type]

Examples:
✅ auth-handler.unit.test.ts
✅ login-flow.e2e.spec.ts
✅ button-render.component.test.tsx
```

### Step 3: Place File

**Collocated:**
```
src/domain/auth-handler.ts
src/domain/auth-handler.unit.test.ts     ← Next to source
```

**Centralized:**
```
tests/unit/auth-handler.unit.test.ts
```

### Step 4: Run Your Test

```bash
pnpm test              # Auto-discovers your file
pnpm test:unit         # Runs unit tests
pnpm test:watch        # Continuous mode
```

---

## 📋 Checklist for Contributors

Before committing test code:

- [ ] Test filename follows pattern: `<feature>.<type>.test.ts` or `.spec.ts`
- [ ] Test type is in approved list (unit, integration, component, api, e2e, a11y, visual, perf, etc.)
- [ ] Feature name is descriptive (not generic like `test`, `main`, `index`)`
- [ ] File uses `.tsx` only if it renders JSX (components)
- [ ] File uses `.ts` for all other tests
- [ ] Vitest tests use `.test.ts(x)` extension ✅
- [ ] Playwright tests use `.spec.ts(x)` extension ✅
- [ ] Performance tests use `.perf.js`, `.load.js`, etc. ✅
- [ ] Run `pnpm test:names` and confirm it passes
- [ ] Run `pnpm test` locally and all tests pass
- [ ] Commit message references Naming Convention if file was renamed

---

## 🆘 Troubleshooting

### Error: "INVALID TEST NAME"

**Problem:** `pnpm test:names` fails  
**Solution:** Check filename against valid patterns above  
**Example Fix:**

```
❌ Before:  test-auth.ts
✅ After:   auth.unit.test.ts
```

### Tests Not Running

**Problem:** `pnpm test` doesn't find your test  
**Solution:**

1. Check filename matches pattern: `*.(unit|integration|component|api).test.ts(x)`
2. Ensure file is in project with `vitest.config.ts`
3. Confirm glob patterns in `vitest.config.ts` match your file location

### Playwright Tests Not Found

**Problem:** `pnpm test:e2e` doesn't find your test  
**Solution:**

1. Check filename: `*.(e2e|a11y|visual).spec.ts(x)`
2. File must be in `tests/` directory (or update `playwright.config.ts`)
3. Confirm `playwright.config.ts` has correct `testDir` and `testMatch`

---

## 📚 References

- **Vitest Docs**: https://vitest.dev
- **Playwright Docs**: https://playwright.dev/docs/intro
- **k6 Performance Testing**: https://k6.io (if using k6)
- **Repository Test Scripts**: `pnpm test --help`
- **Validation Script**: `scripts/validate-test-names.mjs`
- **Root Config**: `vitest.config.ts`, `playwright.config.ts`
- **CI Enforcement**: `.github/workflows/quality-gates.yml`

---

## ❓ FAQ

**Q: Can I use different naming for different apps?**  
A: No. This platform enforces a single naming standard across all 25+ apps. Consistency ensures tooling works everywhere.

**Q: What if my feature name has multiple words?**  
A: Use kebab-case: `user-authentication.unit.test.ts`, `checkout-flow.e2e.spec.ts`.

**Q: Should I use PascalCase (React components)?**  
A: No. Test files always use kebab-case for consistency: `button-component.test.tsx`, not`ButtonComponent.test.tsx`.

**Q: Can tests go in the source folder?**  
A: Yes, collocated tests are fine: `src/domain/auth.unit.test.ts`. Or centralize in `tests/`. Pick one strategy and stick with it.

**Q: What about snapshot tests?**  
A: Still use the same naming: `button-snap.component.test.tsx`. The "type" (`component`) identifies the test framework. Snapshots are a Vitest/Jest feature within component tests.

**Q: Do Jest snapshot files follow this rule?**  
A: Jest snapshots are artifacts, not test files. They auto-generate in `__snapshots__/` and don't need explicit naming.

---

**Last Updated:** April 1, 2026  
**Validator**: `pnpm test:names`  
**CI Enforcement**: ✅ Enabled  
**Maintainer**: @scott-reinhart
