# Testing Standards & Framework Instructions

> **Scope**: Test taxonomy, naming conventions, discovery patterns, framework selection, and quality gates.
> Subordinate to `AGENTS.md` and `.github/copilot-instructions.md`.

See [Quick Summary](#quick-summary) for the 8-type taxonomy and naming rules.

Full instructions: Testing framework selection, quality gates, CI/CD integration, enforcement, contributing guidelines.

**Authority**: AGENTS.md § 28 (Testing Governance & Standards) — SUPREME AUTHORITY

**Enforcement**: scripts/validate-test-names.mjs + pnpm validate gate

**Last Updated**: 2026-04-01

---

## Table of Contents

1. [Quick Summary](#quick-summary)
2. [Test Types & Frameworks](#test-types--frameworks)
3. [File Naming Convention](#file-naming-convention)
4. [Folder Organization](#folder-organization)
5. [Running Tests](#running-tests)
6. [Framework Selection](#framework-selection-matrix)
7. [Quality Gates](#quality-gates)
8. [CI/CD Integration](#cicd-integration)
9. [Mobile Testing](#mobile-testing)
10. [Enforcement & Validation](#enforcement--validation)
11. [Contributing Test Files](#contributing-test-files)
12. [Troubleshooting](#troubleshooting)

---

## Quick Summary

### 8 Test Types (Strict Taxonomy)

| Type            | Framework        | File Pattern                 | Location                          | When                                    |
| --------------- | ---------------- | ---------------------------- | --------------------------------- | --------------------------------------- |
| **unit**        | Vitest           | `<name>.unit.test.ts`        | `tests/unit/` or colocated        | Pure functions, zero dependencies       |
| **integration** | Vitest           | `<name>.integration.test.ts` | `tests/integration/` or colocated | Logic + mocked services                 |
| **component**   | Vitest + React   | `<name>.component.test.tsx`  | `tests/component/` or colocated   | React component rendering & interaction |
| **api**         | Vitest           | `<name>.api.test.ts`         | `tests/api/` or colocated         | HTTP endpoints & request/response       |
| **e2e**         | Playwright       | `<name>.e2e.spec.ts`         | `tests/e2e/`                      | Full user workflows in browser          |
| **a11y**        | Playwright + axe | `<name>.a11y.spec.ts`        | `tests/a11y/`                     | Accessibility testing (WCAG AA)         |
| **visual**      | Playwright       | `<name>.visual.spec.ts`      | `tests/visual/`                   | Screenshot regression & visual diffs    |
| **perf**        | Custom / K6      | `<name>.perf.test.ts`        | `tests/perf/`                     | Performance benchmarks & profiling      |

### Naming Rule (STRICT)

**Pattern**: `<feature-name>.<type>.test.ts` or `.spec.ts`

✅ **GOOD**: `auth.unit.test.ts`, `button.component.test.tsx`, `checkout.e2e.spec.ts`  
❌ **BAD**: `test.auth.ts`, `unit.auth.test.ts`, `auth.spec.ts` (missing type)

**Enforcement**: Runs automatically in `pnpm validate` gate via `scripts/validate-test-names.mjs`

---

## Test Types & Frameworks

### Unit Tests (Vitest)

**Purpose**: Test pure functions and business logic in isolation.

**When to Use**: Domain layer functions (rules, validation, calculations), utility functions with no side effects, business logic with zero framework dependencies

**Framework**: Vitest (lightweight, ESM-native, React-friendly)

**Example**:
```typescript
// src/domain/rules.unit.test.ts
import { describe, it, expect } from 'vitest'
import { isValidMove } from './rules'

describe('game rules', () => {
  it('should reject invalid moves', () => {
    expect(isValidMove(board, { row: 99, col: 99 })).toBe(false)
  })
})
```

**Run**: `pnpm test:unit` or `pnpm test`

---

### Integration Tests (Vitest)

**Purpose**: Test components working together with mocked external services.

**When to Use**: State management with mocked storage, hooks calling service layer, multiple units interacting

**Framework**: Vitest with `vi.mock()`

**Example**:
```typescript
// src/app/useTheme.integration.test.ts
import { vi } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useTheme } from './useTheme'

vi.mock('@/app/storageService', () => ({
  storageService: { getTheme: () => 'dark' },
}))

describe('useTheme integration', () => {
  it('loads theme from storage', () => {
    const { result } = renderHook(() => useTheme())
    expect(result.current.theme).toBe('dark')
  })
})
```

**Run**: `pnpm test:integration` or `pnpm test`

---

### Component Tests (Vitest + React Testing Library)

**Purpose**: Test React component rendering, props, and user interactions.

**When to Use**: All React components (atoms, molecules, organisms), component state and props, event handlers and callbacks

**Framework**: Vitest (environment: `jsdom`) + `@testing-library/react`

**Example**:
```typescript
// src/ui/atoms/Button.component.test.tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import { Button } from './Button'

describe('Button', () => {
  it('renders with text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })
})
```

**Run**: `pnpm test:component` or `pnpm test`

---

### API Tests (Vitest)

**Purpose**: Test HTTP endpoints, request/response contracts.

**When to Use**: REST API endpoints, request validation, response formatting, error handling

**Framework**: Vitest + `node-fetch` or `axios`

**Example**:
```typescript
// src/api/auth.api.test.ts
import { describe, it, expect } from 'vitest'
import { authApi } from './auth'

describe('auth API', () => {
  it('should return bearer token on login', async () => {
    const response = await authApi.login('user@example.com', 'password')
    expect(response.token).toBeDefined()
  })
})
```

**Run**: `pnpm test:api` or `pnpm test`

---

### E2E Tests (Playwright)

**Purpose**: Test complete user workflows in a real browser.

**When to Use**: Full user interactions (click, type, navigate), multi-step workflows, integration across all layers

**Framework**: Playwright (headless browser automation)

**Example**:
```typescript
// tests/e2e/game-flow.e2e.spec.ts
import { test, expect } from '@playwright/test'

test('user can play a complete game', async ({ page }) => {
  await page.goto('http://localhost:5173')
  await page.click('text=Start Game')
  expect(page).toHaveURL(/\/game/)
  await page.click('[data-testid="cell-0"]')
  await expect(page.locator('text=You Won!')).toBeVisible()
})
```

**Run**: `pnpm test:e2e` or `pnpm test:ci`

---

### Accessibility Tests (Playwright + Axe)

**Purpose**: Automated accessibility checking (WCAG 2.1 AA compliance).

**When to Use**: Every page and major component, keyboard navigation verification, color contrast validation

**Framework**: Playwright + `@axe-core/playwright`

**Example**:
```typescript
// tests/a11y/navigation.a11y.spec.ts
import { test, expect } from '@playwright/test'
import { injectAxe, checkA11y } from 'axe-playwright'

test('should be keyboard navigable', async ({ page }) => {
  await page.goto('http://localhost:5173')
  await page.keyboard.press('Tab')
  await expect(page.locator('button').first()).toBeFocused()
})
```

**Run**: `pnpm test:a11y` or `pnpm test:ci`

---

### Visual Regression Tests (Playwright)

**Purpose**: Screenshot-based visual diffs to catch unintended UI changes.

**When to Use**: After styling changes, responsive layout verification, theme/design system changes

**Framework**: Playwright snapshot testing

**Example**:
```typescript
// tests/visual/button-variants.visual.spec.ts
import { test, expect } from '@playwright/test'

test('primary button matches snapshot', async ({ page }) => {
  await page.goto('http://localhost:5173/components/button')
  await expect(page.locator('.btn-primary')).toHaveScreenshot('primary-button.png')
})
```

**Run**: `pnpm test:visual` or `pnpm test:ci`

---

### Performance Tests (Custom / K6)

**Purpose**: Benchmark execution time, memory usage, bundle size.

**When to Use**: AI engine decision time (WASM vs JS), render performance profiling, bundle size tracking

**Framework**: Custom Vitest + performance APIs, or K6 for load testing

**Example**:
```typescript
// tests/perf/ai-engine.perf.test.ts
import { describe, it, expect } from 'vitest'
import { computeAiMove } from '@/domain/ai'

describe('AI Engine Performance', () => {
  it('should compute move in < 100ms', () => {
    const start = performance.now()
    const move = computeAiMove(board, 'medium')
    expect(performance.now() - start).toBeLessThan(100)
  })
})
```

**Run**: `pnpm test:perf` (when configured)

---

## File Naming Convention

### Rule (STRICT & ENFORCED)

**Pattern**: `<feature-name>.<type>.test.ts` OR `<feature-name>.<type>.spec.ts`

**Components**:
- `<feature-name>`: Kebab-case, descriptive (e.g., `auth`, `button`, `checkout-flow`)
- `<type>`: One of: `unit`, `integration`, `component`, `api`, `e2e`, `a11y`, `visual`, `perf`
- Extension: `.test.ts` (Vitest) or `.spec.ts` (Playwright)

### Valid Examples

✅ `auth.unit.test.ts`  
✅ `button.component.test.tsx`  
✅ `game-board.integration.test.ts`  
✅ `checkout.e2e.spec.ts`  
✅ `keyboard-nav.a11y.spec.ts`

### Invalid Examples

❌ `test.auth.ts` — Feature NOT first  
❌ `unit.auth.test.ts` — Type NOT second  
❌ `auth.spec.ts` — Missing type  
❌ `test.ts` — No feature name

### Validation

```bash
pnpm test:names              # Strict validation (fails on errors)
pnpm test:names --verbose   # Show detailed error messages
pnpm validate                # Includes test:names (required before merge)
```

---

## Folder Organization

### Pattern A: Colocated Tests

Tests live next to source code.

```
src/
├── domain/
│   ├── rules.ts
│   ├── rules.unit.test.ts         ← test next to source
├── app/
│   ├── useTheme.ts
│   └── useTheme.integration.test.ts
```

**Pros**: Source and tests always visible, easier to maintain  
**Cons**: Can clutter directory structure

---

### Pattern B: Centralized Tests

All tests in dedicated directory hierarchy.

```
tests/
├── unit/
│   └── rules.unit.test.ts
├── integration/
│   └── useTheme.integration.test.ts
├── component/
│   └── Button.component.test.tsx
├── e2e/
│   └── game-flow.e2e.spec.ts
```

**Pros**: Clean source directories, organized by test type  
**Cons**: Navigation more complex

---

### Recommendation

- **Colocated**: Single-game apps, <50 test files, domain-heavy logic
- **Centralized**: Shared packages, complex apps, CI/CD pipelines
- **Monorepo**: Use **Centralized** (consistency across apps)

---

## Running Tests

```bash
# Vitest (unit, integration, component, api)
pnpm test                    # All Vitest tests
pnpm test:watch              # Watch mode
pnpm test:unit               # Unit tests only
pnpm test:component          # Component tests only

# Playwright (e2e, a11y, visual)
pnpm test:e2e                # E2E tests
pnpm test:a11y               # Accessibility tests
pnpm test:visual             # Visual regression tests

# Validation & CI
pnpm test:names              # Validate test file naming
pnpm test:ci                 # All tests (Vitest + Playwright)
pnpm validate                # Full gate (lint + format + typecheck + build)
```

---

## Framework Selection Matrix

### Vitest (Unit, Integration, Component, API)

| Scenario         | Framework               | Why                        |
| ---------------- | ----------------------- | -------------------------- |
| Pure functions   | Vitest                  | No framework dependencies  |
| React components | Vitest + RTL            | JSX-friendly; snapshots    |
| With mocks       | Vitest with `vi.mock()` | Excellent mock support     |
| Fast feedback    | Vitest --watch          | Instant feedback           |

### Playwright (E2E, A11y, Visual)

| Scenario           | Framework          | Why                                   |
| ------------------ | ------------------ | ------------------------------------- |
| Full workflows     | Playwright         | Real browser automation               |
| Cross-browser      | Playwright         | Chrome, Firefox, Safari, Mobile       |
| Accessibility      | Playwright + axe   | Automated + manual checks             |
| Screenshots        | Playwright         | Visual diff + regression              |

### When NOT to Mix Frameworks

❌ Never mix Playwright and Vitest in the same file. Keep separate:

```typescript
// File 1: Vitest
// src/ui/Button.component.test.tsx

// File 2: Playwright
// tests/e2e/button-interaction.e2e.spec.ts
```

---

## Quality Gates

### Validation Gate (Required Before Merge)

```bash
pnpm validate
```

**Does**:
1. `pnpm lint` — ESLint check
2. `pnpm format:check` — Prettier check
3. `pnpm typecheck` — TypeScript validation
4. `pnpm test:names` — ✅ Test name validation
5. `pnpm build` — Vite production build

**Result**: All must pass before merge.

---

## CI/CD Integration

Add to `.github/workflows/quality-gates.yml`:

```yaml
test-naming:
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v4
    - uses: pnpm/action-setup@v2
    - uses: actions/setup-node@v4
      with:
        node-version: 24
        cache: 'pnpm'
    - run: pnpm install
    - run: pnpm test:names # Fail fast
```

---

## Mobile Testing

### E2E Tests

```typescript
// tests/e2e/mobile-tap.e2e.spec.ts
import { test, expect, devices } from '@playwright/test'

test.use({ ...devices['iPhone 12'] })

test('should handle touch correctly', async ({ page }) => {
  await page.goto('http://localhost:5173')
  await page.tap('[data-testid="button"]')
})
```

### A11y Tests on Mobile

```typescript
test('should be accessible on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 })
  await page.goto('http://localhost:5173')
  await page.keyboard.press('Tab')
  const firstButton = page.locator('button').first()
  await expect(firstButton).toBeFocused()
})
```

---

## Enforcement & Validation

### The Validator Script

**Location**: `scripts/validate-test-names.mjs`

**What It Does**:
1. Discovers all `.test.ts(x)` and `.spec.ts(x)` files
2. Validates each filename against patterns
3. Reports errors with suggestions
4. Returns exit code 1 on failure (blocks CI)

**Valid Patterns**:

```
✅ <feature>.unit.test.ts
✅ <feature>.integration.test.ts
✅ <feature>.component.test.tsx
✅ <feature>.api.test.ts
✅ <feature>.e2e.spec.ts
✅ <feature>.a11y.spec.ts
✅ <feature>.visual.spec.ts
✅ <feature>.perf.test.ts
```

---

## Contributing Test Files

### Step-by-Step Guide

#### 1. Choose Test Type

Ask: "What am I testing?"

- Pure function? → **unit**
- Logic + mocks? → **integration**
- React component? → **component**
- HTTP endpoint? → **api**
- Full workflow? → **e2e**
- Accessibility? → **a11y**
- Visual consistency? → **visual**
- Performance? → **perf**

#### 2. Name File

Pattern: `<feature>.<type>.test.ts` (or `.spec.ts` for Playwright)

Examples:
- `auth.unit.test.ts`
- `button.component.test.tsx`
- `game-board.integration.test.ts`

#### 3. Choose Location

- **Colocated**: Next to source (e.g., `src/domain/auth.unit.test.ts`)
- **Centralized**: In tests directory (e.g., `tests/unit/auth.unit.test.ts`)

#### 4. Write Test

**Template (Unit)**:
```typescript
import { describe, it, expect } from 'vitest'
import { featureToTest } from './feature'

describe('feature name', () => {
  it('should do something', () => {
    expect(featureToTest()).toBe(expected)
  })
})
```

**Template (Component)**:
```typescript
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Component } from './Component'

describe('Component', () => {
  it('should render', () => {
    render(<Component />)
    expect(screen.getByText('...')).toBeInTheDocument()
  })
})
```

#### 5. Validate & Run

```bash
pnpm test:names                 # Validate naming
pnpm test                       # Run your test
```

#### 6. Commit

```bash
pnpm validate                   # Full gate
git add . && git commit -m "..."
```

---

## Troubleshooting

### Test File Not Running

**Problem**: Test file named `test.auth.ts` not discovered.

**Cause**: Invalid naming pattern. Must be `auth.unit.test.ts`.

**Solution**: Run `pnpm test:names --verbose`, rename file, verify with `pnpm test:unit`.

---

### Vitest vs Playwright Confusion

**Problem**: `pnpm test` works but `pnpm test:e2e` doesn't find tests.

**Cause**: Wrong file extension. E2E tests must be `.spec.ts` (not `.test.ts`).

**Solution**: Rename `my-test.test.ts` → `my-test.e2e.spec.ts`, run `pnpm test:e2e`.

---

### TypeScript Errors in Test File

**Problem**: Test imports throw "Cannot find module" errors.

**Solution**:
1. Verify import path uses `@/` alias (not relative)
2. Check `vitest.config.ts` resolver config
3. Verify TypeScript include patterns in `tsconfig.json`

---

### Test Validation "Feature Name Too Generic"

**Problem**: Test named `app.unit.test.ts` fails validation.

**Reason**: `app` is too generic.

**Solution**: Rename to `auth.unit.test.ts` or `theme.unit.test.ts`.

---

### Performance Issues

| Metric                   | Target          | Warning |
| ------------------------ | --------------- | ------- |
| Unit test execution      | <50ms per test  | >100ms  |
| Component test execution | <100ms per test | >200ms  |
| E2E test execution       | <5s per test    | >10s    |
| Total test suite         | <1min           | >2min   |

If tests are slow, profile with `--reporter=verbose` or use Playwright Inspector.

---

## Related Documentation

- **AGENTS.md § 28**: Supreme governance authority (testing principles)
- **docs/TEST_NAMING_CONVENTION.md**: Comprehensive naming rules + examples
- **docs/CONTRIBUTING_TESTS.md**: Quick-start guide with code templates
- **copilot-instructions.md**: AI tool behavior constraints

---

**Last Updated**: 2026-04-01  
**Applies to**: All 25 game apps + 11 shared packages  
**Authority**: AGENTS.md § 28 (Testing Governance & Standards)  
**Enforcement**: scripts/validate-test-names.mjs + pnpm validate gate
