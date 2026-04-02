# Contributing Tests — Quick Start

**TL;DR**: Name your test file `<feature>.<type>.test.ts` (or `.spec.ts` for Playwright), add it to the right folder, and run `pnpm test`.

---

## 📋 Test Types & Frameworks

| Type            | Framework        | Extension              | When                          | Location                          |
| --------------- | ---------------- | ---------------------- | ----------------------------- | --------------------------------- |
| **unit**        | Vitest           | `.unit.test.ts`        | Pure functions, logic no deps | `tests/unit/` or colocated        |
| **integration** | Vitest           | `.integration.test.ts` | Logic + mocked services       | `tests/integration/` or colocated |
| **component**   | Vitest + React   | `.component.test.tsx`  | React components              | `tests/component/` or colocated   |
| **api**         | Vitest           | `.api.test.ts`         | HTTP endpoints                | `tests/api/` or colocated         |
| **e2e**         | Playwright       | `.e2e.spec.ts`         | Full workflows (browser)      | `tests/e2e/`                      |
| **a11y**        | Playwright + axe | `.a11y.spec.ts`        | Accessibility                 | `tests/a11y/`                     |
| **visual**      | Playwright       | `.visual.spec.ts`      | Screenshot regression         | `tests/visual/`                   |

---

## ✍️ Example: Create a Unit Test

### File: `src/domain/auth.unit.test.ts`

```typescript
import { describe, it, expect } from 'vitest'
import { validateEmail } from './auth'

describe('auth', () => {
  describe('validateEmail', () => {
    it('should accept valid emails', () => {
      expect(validateEmail('user@example.com')).toBe(true)
    })

    it('should reject invalid emails', () => {
      expect(validateEmail('not-an-email')).toBe(false)
    })
  })
})
```

### Run:

```bash
pnpm test                    # Auto-discovers and runs
pnpm test:watch              # Continuous mode
pnpm test:unit               # Unit tests only
```

---

## ✍️ Example: Create a Component Test

### File: `src/ui/atoms/Button.component.test.tsx`

```typescript
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Button } from './Button'

describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('calls onClick when clicked', () => {
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Click</Button>)
    screen.getByText('Click').click()
    expect(onClick).toHaveBeenCalled()
  })
})
```

### Run:

```bash
pnpm test:component         # Component tests only
pnpm test                   # All tests
```

---

## ✍️ Example: Create an E2E Test

### File: `tests/e2e/checkout.e2e.spec.ts`

```typescript
import { test, expect } from '@playwright/test'

test.describe('Checkout Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173')
  })

  test('user can checkout', async ({ page }) => {
    // Navigate to cart
    await page.click('text=Cart')
    await expect(page).toHaveURL('/cart')

    // Click checkout
    await page.click('button:has-text("Checkout")')
    await expect(page).toHaveURL('/checkout')

    // Fill form and submit
    await page.fill('input[name="email"]', 'user@example.com')
    await page.click('button:has-text("Place Order")')

    // Verify success
    await expect(page.locator('text=Order Confirmed')).toBeVisible()
  })
})
```

### Run:

```bash
pnpm test:e2e               # All E2E tests
pnpm test:e2e:debug         # With Playwright Inspector
pnpm test:ci                # All tests (Vitest + E2E)
```

---

## ✍️ Example: Create an Accessibility Test

### File: `tests/a11y/keyboard-nav.a11y.spec.ts`

```typescript
import { test, expect } from '@playwright/test'

test.describe('Keyboard Navigation', () => {
  test('can navigate menu with arrow keys', async ({ page }) => {
    await page.goto('http://localhost:5173')

    // Tab to menu button
    await page.keyboard.press('Tab')
    await expect(page.locator('button[aria-haspopup="true"]')).toBeFocused()

    // Open menu
    await page.keyboard.press('Enter')
    const menu = page.locator('[role="menu"]')
    await expect(menu).toBeVisible()

    // Navigate with arrows
    await page.keyboard.press('ArrowDown')
    const firstItem = menu.locator('[role="menuitem"]').first()
    await expect(firstItem).toBeFocused()
  })
})
```

### Run:

```bash
pnpm test:a11y              # A11y tests only
```

---

## 🎯 Naming Rules (STRICT)

**Feature name first, type second.**

✅ **GOOD**

```
auth.unit.test.ts
button.component.test.tsx
checkout.e2e.spec.ts
keyboard-nav.a11y.spec.ts
board-solver.integration.test.ts
```

❌ **BAD**

```
test.auth.ts                    ← Feature NOT first
unit.auth.test.ts              ← Type NOT second
auth.test.unit.ts              ← Type NOT second, backwards
auth.spec.ts                   ← Missing type
index.test.ts                  ← Too generic
app.test.ts                    ← Too generic
```

**Validate:**

```bash
pnpm test:names              # Strict validation
pnpm test:names:verbose      # Show details
```

---

## 📂 Folder Placement

**Pick ONE pattern for your project:**

### Option A: Colocated (small projects)

```
src/
├── domain/
│   ├── auth.ts
│   └── auth.unit.test.ts       ← next to source
├── ui/
│   ├── Button.tsx
│   └── Button.component.test.tsx
```

### Option B: Centralized (larger projects)

```
tests/
├── unit/
│   └── auth.unit.test.ts
├── component/
│   └── Button.component.test.tsx
├── e2e/
│   └── checkout.e2e.spec.ts
└── a11y/
    └── keyboard-nav.a11y.spec.ts
```

---

## 🔄 Running Tests

### All Tests

```bash
pnpm test                  # Vitest (unit, integration, component, api)
pnpm test:watch            # Watch mode (auto-rerun on change)
pnpm test:coverage         # With coverage report
```

### By Type

```bash
pnpm test:unit             # Unit only
pnpm test:integration      # Integration only
pnpm test:component        # Components only
pnpm test:api              # API only
pnpm test:e2e              # E2E only
pnpm test:a11y             # Accessibility only
pnpm test:visual           # Visual regression only
```

### Complete Validation

```bash
pnpm test:ci               # All tests (Vitest + Playwright)
pnpm test:smoke            # Quick check (unit + component)
pnpm validate              # lint + typecheck + test:names + test:ci
```

---

## ✋ Pre-Commit Checks

Before pushing, run:

```bash
pnpm test:names            # Validate naming
pnpm test                  # Run all unit/integration/component/api tests
pnpm test:e2e              # Run E2E tests (if you modified flows)
```

---

## 📚 Test Tools Available

**Vitest (unit/integration/component/api):**

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest'

describe('my feature', () => {
  it('does something', () => {
    expect(true).toBe(true)
  })
})
```

**React Testing Library (components):**

```typescript
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
```

**Playwright (e2e/a11y/visual):**

```typescript
import { test, expect } from '@playwright/test'

test('user workflow', async ({ page }) => {
  await page.goto('http://localhost:5173')
  // ...
})
```

---

## 🆘 Help

**Test file not running?**  
→ Check filename matches pattern: `<feature>.<type>.test.ts` or `.spec.ts`  
→ Run `pnpm test:names` to validate

**Can't find test documentation?**  
→ Read `docs/TEST_NAMING_CONVENTION.md` (comprehensive guide)  
→ Run `pnpm test --help` for CLI options

**CI is failing on test names?**  
→ Run `pnpm test:names --verbose` locally  
→ Rename files to match patterns in `docs/TEST_NAMING_CONVENTION.md`

---

**Happy testing! 🧪**
