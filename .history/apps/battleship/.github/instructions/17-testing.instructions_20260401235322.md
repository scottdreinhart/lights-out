# Testing Standards & Framework Instructions

> **Scope**: Test taxonomy, naming conventions, discovery patterns, framework selection, and quality gates.
> Subordinate to `AGENTS.md` and `.github/copilot-instructions.md`.

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

**When to Use**:

- Domain layer functions (rules, validation, calculations)
- Utility functions with no side effects
- Business logic with zero framework dependencies

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

**When to Use**:

- State management with mocked storage
- Hooks calling service layer
- Multiple units interacting

**Framework**: Vitest with `vi.mock()`

**Example**:

```typescript
// src/app/useTheme.integration.test.ts
import { vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useTheme } from './useTheme'

// Mock storageService
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

**When to Use**:

- All React components (atoms, molecules, organisms)
- Component state and props
- Event handlers and callbacks

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

  it('calls onClick when clicked', async () => {
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Click</Button>)
    await userEvent.click(screen.getByText('Click'))
    expect(onClick).toHaveBeenCalled()
  })
})
```

**Run**: `pnpm test:component` or `pnpm test`

---

### API Tests (Vitest)

**Purpose**: Test HTTP endpoints, request/response contracts.

**When to Use**:

- REST API endpoints
- Request validation
- Response formatting
- Error handling

**Framework**: Vitest + `node-fetch` or `axios` for HTTP testing

**Example**:

```typescript
// src/api/auth.api.test.ts
import { describe, it, expect, beforeAll } from 'vitest'
import { authApi } from './auth'

describe('auth API', () => {
  it('should return bearer token on login', async () => {
    const response = await authApi.login('user@example.com', 'password')
    expect(response.token).toBeDefined()
    expect(response.token).toMatch(/^Bearer /)
  })
})
```

**Run**: `pnpm test:api` or `pnpm test`

---

### E2E Tests (Playwright)

**Purpose**: Test complete user workflows in a real browser.

**When to Use**:

- Full user interactions (click, type, navigate)
- Multi-step workflows
- Integration across all layers
- Cross-browser testing

**Framework**: Playwright (headless browser automation)

**Example**:

```typescript
// tests/e2e/game-flow.e2e.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Game Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173')
  })

  test('user can play a complete game', async ({ page }) => {
    // Navigate to game
    await page.click('text=Start Game')
    expect(page).toHaveURL(/\/game/)

    // Make moves
    await page.click('[data-testid="cell-0"]')
    await page.click('[data-testid="cell-1"]')

    // Verify win state
    await expect(page.locator('text=You Won!')).toBeVisible()
  })
})
```

**Run**: `pnpm test:e2e` or `pnpm test:ci`

---

### Accessibility Tests (Playwright + Axe)

**Purpose**: Automated accessibility checking (WCAG 2.1 AA compliance).

**When to Use**:

- Every page and major component
- Keyboard navigation verification
- Color contrast validation
- Focus management testing
- Screen reader compatibility

**Framework**: Playwright + `@axe-core/playwright`

**Example**:

```typescript
// tests/a11y/main-menu.a11y.spec.ts
import { test, expect } from '@playwright/test'
import { injectAxe, checkA11y } from 'axe-playwright'

test.describe('Main Menu Accessibility', () => {
  test('should have no axe violations', async ({ page }) => {
    await page.goto('http://localhost:5173')
    await injectAxe(page)
    await checkA11y(page, null, {
      detailedReport: true,
      detailedReportOptions: { html: true },
    })
  })

  test('should be keyboard navigable', async ({ page }) => {
    await page.goto('http://localhost:5173')

    // Tab to first button
    await page.keyboard.press('Tab')
    const firstButton = page.locator('button').first()
    await expect(firstButton).toBeFocused()

    // Navigate with arrow keys
    await page.keyboard.press('ArrowDown')
    const secondButton = page.locator('button').nth(1)
    await expect(secondButton).toBeFocused()
  })
})
```

**Run**: `pnpm test:a11y` or `pnpm test:ci`

---

### Visual Regression Tests (Playwright)

**Purpose**: Screenshot-based visual diffs to catch unintended UI changes.

**When to Use**:

- After styling changes
- Responsive layout verification
- Theme/design system changes
- Cross-browser visual consistency

**Framework**: Playwright snapshot testing

**Example**:

```typescript
// tests/visual/button-variants.visual.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Button Visual Regression', () => {
  test('primary button matches snapshot', async ({ page }) => {
    await page.goto('http://localhost:5173/components/button')
    await expect(page.locator('.btn-primary')).toHaveScreenshot('primary-button.png')
  })

  test('button disabled state matches snapshot', async ({ page }) => {
    await page.goto('http://localhost:5173/components/button')
    await expect(page.locator('.btn:disabled')).toHaveScreenshot('disabled-button.png')
  })
})
```

**Run**: `pnpm test:visual` or `pnpm test:ci`

**Update Snapshots**: `pnpm test:visual -- --update-snapshots`

---

### Performance Tests (Custom / K6)

**Purpose**: Benchmark execution time, memory usage, bundle size.

**When to Use**:

- AI engine decision time (WASM vs JS)
- Render performance profiling
- Bundle size tracking
- Memory leak detection

**Framework**: Custom Vitest + performance APIs, or K6 for load testing

**Example**:

```typescript
// tests/perf/ai-engine.perf.test.ts
import { describe, it, expect } from 'vitest'
import { computeAiMove } from '@/domain/ai'

describe('AI Engine Performance', () => {
  it('should compute move in < 100ms (sync)', () => {
    const board = createTestBoard()

    const start = performance.now()
    const move = computeAiMove(board, 'medium')
    const elapsed = performance.now() - start

    expect(elapsed).toBeLessThan(100)
    expect(move).toBeDefined()
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

✅ `auth.unit.test.ts` — Auth utilities, unit tests  
✅ `button.component.test.tsx` — Button component, component tests  
✅ `checkout.integration.test.ts` — Checkout flow, integration tests  
✅ `checkout.e2e.spec.ts` — Checkout flow, E2E tests  
✅ `keyboard-nav.a11y.spec.ts` — Keyboard navigation, accessibility tests  
✅ `ai-engine.perf.test.ts` — AI performance benchmark

### Invalid Examples (Will Fail Validation)

❌ `test.auth.ts` — Feature NOT first  
❌ `unit.auth.test.ts` — Type NOT second  
❌ `auth.test.unit.ts` — Type NOT second (backwards)  
❌ `auth.spec.ts` — Missing type  
❌ `index.test.ts` — Too generic  
❌ `test.ts` — No feature name  
❌ `mock.auth.test.ts` — Wrong pattern entirely

### Validation

**Automatic Enforcement**:

```bash
pnpm test:names              # Strict validation (fails on errors)
pnpm test:names --verbose   # Show detailed error messages
```

**CI/CD Integration**:

```bash
pnpm validate   # Includes test:names validation (required before merge)
```

**What Happens on Failure**:

- Error message shows invalid files
- Lists valid patterns available
- Suggests correct naming
- Blocks `pnpm validate` (and CI)

---

## Folder Organization

### Pattern A: Colocated Tests (Recommended for Small Projects)

**Strategy**: Tests live next to source code.

```
src/
├── domain/
│   ├── rules.ts
│   ├── rules.unit.test.ts         ← test next to source
│   ├── auth.ts
│   └── auth.unit.test.ts
├── app/
│   ├── useTheme.ts
│   └── useTheme.integration.test.ts
├── ui/
│   └── atoms/
│       ├── Button.tsx
│       └── Button.component.test.tsx
```

**Pros**:

- Source and tests always visible
- Easier to maintain
- Obvious what needs testing
- Natural import paths

**Cons**:

- Can clutter directory structure
- Large directories mix source and tests

---

### Pattern B: Centralized Tests (Recommended for Larger Projects)

**Strategy**: All tests in dedicated directory hierarchy.

```
tests/
├── unit/
│   ├── rules.unit.test.ts
│   └── auth.unit.test.ts
├── integration/
│   └── useTheme.integration.test.ts
├── component/
│   └── Button.component.test.tsx
├── api/
│   └── auth.api.test.ts
├── e2e/
│   └── game-flow.e2e.spec.ts
├── a11y/
│   └── keyboard-nav.a11y.spec.ts
└── visual/
    └── button-variants.visual.spec.ts
```

**Pros**:

- Clean source directories (no test files)
- Organized by test type
- Clear test structure

**Cons**:

- Navigation more complex
- Tests separated from source
- Import paths longer

---

### Recommendation

**Use Colocated for**:

- Single-game apps (consolidated, simple)
- Apps with <50 test files
- Domain-heavy logic

**Use Centralized for**:

- Shared packages (many games reuse)
- Complex apps (>50 test files)
- CI/CD pipelines (easier to discover)

**Monorepo Strategy**:

- Core recommendation: **Centralized** (consistency across 25 apps)
- Exception allowed: Colocated for domain-only tests (pure functions)

---

## Running Tests

### Commands by Type

```bash
# Vitest (unit, integration, component, api)
pnpm test                    # All Vitest tests
pnpm test:watch              # Watch mode (re-run on change)
pnpm test:unit               # Unit tests only
pnpm test:integration        # Integration tests only
pnpm test:component          # Component tests only
pnpm test:api                # API tests only
pnpm test:coverage           # With coverage report

# Playwright (e2e, a11y, visual)
pnpm test:e2e                # All E2E tests
pnpm test:e2e:debug          # With Playwright Inspector
pnpm test:a11y               # Accessibility tests only
pnpm test:a11y:debug         # With debug mode
pnpm test:visual             # Visual regression tests
pnpm test:visual -- --update-snapshots  # Update visual baselines

# Validation & CI
pnpm test:names              # Validate test file naming (strict)
pnpm test:names:verbose      # With detailed errors
pnpm test:ci                 # All tests (Vitest + Playwright)
pnpm test:smoke              # Quick check (unit + component only)
```

---

## Framework Selection Matrix

### Vitest Selection (Unit, Integration, Component, API)

| Scenario         | Framework               | Why                        |
| ---------------- | ----------------------- | -------------------------- |
| Pure functions   | Vitest                  | No framework dependencies  |
| Domain logic     | Vitest                  | Physics-agnostic; reusable |
| React components | Vitest + RTL            | JSX-friendly; snapshots    |
| With mocks       | Vitest with `vi.mock()` | Excellent mock support     |
| Performance      | Vitest                  | Fast, ESM-native           |
| Hot reload       | Vitest --watch          | Instant feedback           |

### Playwright Selection (E2E, A11y, Visual)

| Scenario           | Framework          | Why                                              |
| ------------------ | ------------------ | ------------------------------------------------ |
| Full workflows     | Playwright         | Real browser automation                          |
| Cross-browser      | Playwright         | native support (Chrome, Firefox, Safari, Mobile) |
| Accessibility      | Playwright + axe   | Automated + manual checks                        |
| Screenshots        | Playwright         | Visual diff + regression                         |
| Slowness debugging | Playwright --debug | Inspector mode                                   |

### When NOT to Mix Frameworks

❌ **Never in one file**:

```typescript
// BAD: mixing Playwright and Vitest
import { test } from '@playwright/test'
import { render } from '@testing-library/react'
import { describe, it } from 'vitest'

describe('invalid mix', () => {
  it('should not work', () => {...})
  test('playwright and vitest together', async () => {...})
})
```

✅ **Instead: Keep separate**:

```typescript
// File 1: Component unit test (Vitest)
// src/ui/Button.component.test.tsx
import { render } from '@testing-library/react'
import { describe, it } from 'vitest'

// File 2: E2E test (Playwright)
// tests/e2e/button-interaction.e2e.spec.ts
import { test, expect } from '@playwright/test'
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
4. `pnpm test:names` — ✅ Test name validation (NEW)
5. `pnpm build` — Vite production build

**Result**: All must pass before merge.

---

### Pre-Commit (Optional, Recommended)

```bash
pnpm lint:fix && pnpm test
```

**Recommended workflow**:

1. Code changes
2. Run `pnpm lint:fix` (auto-fix violations)
3. Run `pnpm test` (verify tests still pass)
4. Run `pnpm test:names` (check naming)
5. Commit

---

### CI/CD Pipeline

**GitHub Actions** (`pnpm test:ci`):

```yaml
- name: Run tests
  run: |
    pnpm test:names        # Fail fast on naming
    pnpm test:unit         # Unit tests
    pnpm test:integration  # Integration tests
    pnpm test:component    # Component tests
    pnpm test:e2e          # E2E tests
    pnpm test:a11y         # A11y tests
```

**Coverage Thresholds** (if using):

```javascript
// vitest.config.ts
coverage: {
  provider: 'v8',
  lines: 70,      // Minimum line coverage
  functions: 70,
  branches: 65,
  statements: 70
}
```

---

## CI/CD Integration

### GitHub Actions Snippet

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

test-unit:
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v4
    - uses: pnpm/action-setup@v2
    - uses: actions/setup-node@v4
      with:
        node-version: 24
        cache: 'pnpm'
    - run: pnpm install
    - run: pnpm test:unit

test-e2e:
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v4
    - uses: pnpm/action-setup@v2
    - uses: actions/setup-node@v4
      with:
        node-version: 24
        cache: 'pnpm'
    - run: pnpm install
    - run: pnpm exec playwright install
    - run: pnpm test:e2e
```

---

## Mobile Testing

### Capacitor / Mobile Specific Patterns

**Mobile E2E Tests**:

```typescript
// tests/e2e/mobile-tap.e2e.spec.ts
import { test, expect, devices } from '@playwright/test'

test.describe('Mobile Interaction', () => {
  test.use({ ...devices['iPhone 12'] })

  test('should handle touch correctly', async ({ page }) => {
    await page.goto('http://localhost:5173')

    // Tap (not click)
    await page.tap('[data-testid="button"]')
    await expect(page).toHaveURL(/\/result/)
  })
})
```

**View Hierarchy Testing**:

```typescript
// tests/a11y/mobile-a11y.a11y.spec.ts
test('should be accessible on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 })
  await page.goto('http://localhost:5173')

  // Test focus management on mobile
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

**Valid Patterns Checked**:

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

**Error Output Example**:

```
❌ ERROR: Invalid test filenames found:

  ❌ tests/test.auth.ts
     Pattern: test.FEATURE.ts (backwards)
     Fix: Auth.unit.test.ts OR auth.integration.test.ts

  ❌ tests/Button.spec.ts
     Pattern: COMPONENT.spec.ts (missing type)
     Fix: Button.component.test.tsx

Valid patterns:
  • <feature>.unit.test.ts
  • <feature>.integration.test.ts
  • <feature>.component.test.tsx
  • <feature>.api.test.ts
  • <feature>.e2e.spec.ts
  • <feature>.a11y.spec.ts
  • <feature>.visual.spec.ts
  • <feature>.perf.test.ts

Rename files and try again.
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

**Template (E2E)**:

```typescript
import { test, expect } from '@playwright/test'

test.describe('Feature', () => {
  test('should do something', async ({ page }) => {
    await page.goto('...')
    await page.click('...')
    await expect(page).toHaveURL('...')
  })
})
```

#### 5. Validate & Run

```bash
pnpm test:names                 # Validate naming
pnpm test                       # Run your test (Vitest)
# OR
pnpm test:e2e                   # Run your test (Playwright)
```

#### 6. Commit

```bash
pnpm validate                   # Full gate (naming, lint, typecheck, build)
git add . && git commit -m "..."
```

---

## Troubleshooting

### Test File Not Running

**Problem**: My test file named `test.auth.ts` is not being discovered.

**Cause**: Invalid naming pattern. Must be `auth.unit.test.ts` (feature first, type second).

**Solution**:

1. Run `pnpm test:names --verbose` to see the error
2. Rename file to match pattern: `auth.unit.test.ts`
3. Verify it runs: `pnpm test:unit`

---

### Vitest Tests Running but Playwright Tests Not Running

**Problem**: `pnpm test` works but `pnpm test:e2e` doesn't find tests.

**Cause**: Wrong file extension. E2E tests must be `.spec.ts` (not `.test.ts`).

**Solution**:

1. Rename file from `my-test.test.ts` → `my-test.e2e.spec.ts`
2. Run `pnpm test:e2e`

---

### Typescript Errors in Test File

**Problem**: Test imports throw "Cannot find module" errors.

**Cause**: Test environment not configured for the library used.

**Solution**:

1. Verify import path uses `@/` alias (not relative)
2. Ensure `vitest.config.ts` includes library in resolver config
3. Check TypeScript include patterns in `tsconfig.json`

---

### Test Validation "Feature Name Too Generic"

**Problem**: Test named `app.unit.test.ts` fails validation.

**Reason**: `app` is too generic. Need specific feature name.

**Solution**: Rename to `auth.unit.test.ts` or `theme.unit.test.ts` (specific feature).

---

### How do I know which framework to use?

**Rule of thumb**:

- Testing pure function logic? → **Vitest** (unit/integration/api)
- Testing React component rendering? → **Vitest** (component tests with React Testing Library)
- Testing full user workflows in a browser? → **Playwright** (e2e/a11y/visual)

---

### Can I use both jest and vitest?

**No**. This repository uses **Vitest only**.

**Why**: Vitest is ESM-native, faster, and integrates cleanly with Vite (our bundler).

---

### Performance Threshold Recommendations

| Metric                   | Target          | Warning |
| ------------------------ | --------------- | ------- |
| Unit test execution      | <50ms per test  | >100ms  |
| Component test execution | <100ms per test | >200ms  |
| E2E test execution       | <5s per test    | >10s    |
| Total test suite         | <1min           | >2min   |
| A11y test execution      | <10s per test   | >30s    |

If tests are slow, profile with `--reporter=verbose` or use Playwright Inspector.

---

## Related Documentation

- **AGENTS.md**: Supreme governance authority (includes testing principles)
- **docs/TEST_NAMING_CONVENTION.md**: Comprehensive naming rules + examples
- **docs/CONTRIBUTING_TESTS.md**: Quick-start guide with code examples
- **docs/TEST_TAXONOMY_IMPLEMENTATION_SUMMARY.md**: Implementation record
- **copilot-instructions.md**: AI tool behavior constraints (testing section)

---

**Last Updated**: 2026-04-01  
**Applies to**: All 25 game apps + 11 shared packages  
**Authority**: AGENTS.md § 28 (Testing Governance)  
**Enforcement**: scripts/validate-test-names.mjs + pnpm validate gate
