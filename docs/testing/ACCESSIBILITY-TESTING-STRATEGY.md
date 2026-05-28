# Accessibility Testing Strategy (WCAG 2.1 AA)

> **Authority**: AGENTS.md § 23 (Accessibility Governance), § 28 (Testing Governance)  
> **Scope**: Keyboard navigation, focus management, ARIA, semantic HTML, contrast, screen reader support

---

## Overview

This repository enforces **WCAG 2.1 AA** accessibility standards across all applications. Accessibility testing is split into **two tiers**:

1. **Local Development (Primary)**: Playwright-based a11y tests (`pnpm test:a11y`)
2. **CI/Optional (Secondary)**: Lighthouse CLI audit (`pnpm test:lighthouse`, CI-only fallback)

---

## Local Testing: Playwright A11y Tests

### Running Tests

```bash
# Run all accessibility tests (Playwright, chromium, firefox, webkit, mobile)
pnpm test:a11y

# Filter by tag
pnpm test:a11y --grep "@a11y"

# Run in debug mode
pnpm test:a11y --debug
```

### Test Location

**File**: [`tests/accessibility.a11y.spec.ts`](../../tests/accessibility.a11y.spec.ts)

**Browsers Tested**:
- Chromium (desktop)
- Firefox (desktop)
- WebKit (desktop)
- Mobile Chrome (mobile emulation)
- Mobile Safari (mobile emulation)

### Coverage

Each test validates one WCAG AA requirement:

| Test | Purpose | Standard |
|------|---------|----------|
| **Accessible Regions** | Main, nav, button elements are discoverable | WCAG 1.3.1 (Semantic HTML) |
| **Tab Order** | All interactive elements keyboard reachable in logical order | WCAG 2.1.1 (Keyboard) |
| **Escape Key** | Modals/menus close on Escape; focus returns | WCAG 2.1.2 (Keyboard Trap) |
| **ARIA Labels** | Icon buttons, complex elements have accessible names | WCAG 1.1.1 (Text Alternatives) |
| **Heading Hierarchy** | H1 exists; no skipped levels | WCAG 1.3.1 (Info & Relationships) |
| **Form Labels** | All inputs have associated labels | WCAG 1.3.1 (Form Labels) |
| **Focus Indicators** | Focus state visually distinct | WCAG 2.4.7 (Focus Visible) |
| **Non-Color-Only Info** | Text/icon + color; color not sole conveyance | WCAG 1.4.1 (Use of Color) |
| **Contrast Ratio** | Computed styles show color values set | WCAG 1.4.3 (Contrast) |

### Adding New A11y Tests

```typescript
test('@a11y feature X accessibility', async ({ page }) => {
  await page.goto('/feature-path')
  
  // Test keyboard nav, ARIA, focus, etc.
  const button = page.getByRole('button', { name: /label/i })
  await button.focus()
  
  // Verify accessibility property
  const focusStyles = await button.evaluate(el => {
    const computed = window.getComputedStyle(el)
    return { outline: computed.outline }
  })
  
  expect(focusStyles.outline).not.toBe('none')
})
```

---

## CI Testing: Lighthouse (Optional)

### Running Tests

```bash
# Local (WSL/headless environment) — NOT RECOMMENDED
pnpm test:lighthouse
# ⚠️ Blocked by NO_FCP gate in WSL; will fail

# CI (system Chrome or headless-shell with Xvfb) — RECOMMENDED
# Configured in CI runner with display backend
CHROME_PATH=/path/to/chrome pnpm test:lighthouse
```

### Test Location

**File**: [`apps/lights-out/scripts/test-lighthouse.js`](../../apps/lights-out/scripts/test-lighthouse.js)

**Output**: `.lighthouse-reports/*.{json,html}`

### Purpose

- Automated accessibility scoring (Lighthouse categories)
- Comprehensive WCAG rule checking (30+ rules)
- Regression detection via score trending

### Limitations

**Why Not for Local Development?**

1. **WSL Headless Chrome** — Paint suppression prevents Lighthouse FCP detection (NO_FCP error)
2. **No Xvfb** — Linux display backend unavailable in typical WSL setup
3. **System Chrome** — Requires installation; Playwright headless-shell insufficient

**When to Use?**

- CI runners with proper environment (Ubuntu, macOS, Windows with system Chrome)
- Full browser stack (Xvfb or native display)
- Trending accessibility scores across releases

---

## ESLint Accessibility Rules

All code is checked for accessibility violations via ESLint:

```bash
pnpm lint
```

### Enforced Rules

- `jsx-a11y/*` — 30+ semantic, ARIA, keyboard, and contrast rules
- `react/no-danger` — Prevents dangerouslySetInnerHTML
- `react/no-unescaped-entities` — Prevents HTML entity issues

### Common Violations

```typescript
// ❌ Icon button without label
<button>☰</button>

// ✅ Icon button with aria-label
<button aria-label="Open menu">☰</button>

// ❌ No associated label
<input type="text" />

// ✅ Label linked to input
<label htmlFor="username">Username</label>
<input id="username" type="text" />

// ❌ Div pretending to be button
<div onClick={...}>Click</div>

// ✅ Actual button element
<button onClick={...}>Click</button>
```

---

## Manual Accessibility Checks (Not Automated)

### Keyboard Navigation

- [ ] Tab through entire page; reaches all interactive elements
- [ ] Shift+Tab goes backward; focus moves in reverse order
- [ ] Enter activates buttons; Space activates checkboxes
- [ ] Arrow keys navigate menus, lists, tabs (if implemented)
- [ ] Escape closes modals, menus, popovers

### Screen Reader Testing

Test with:
- **NVDA** (Windows, free)
- **JAWS** (Windows, commercial)
- **VoiceOver** (macOS, built-in: Cmd+F5)

Requirements:
- [ ] All interactive elements announced with purpose
- [ ] Form inputs announced with label and type
- [ ] Dynamic content updates announced (aria-live)
- [ ] Heading structure logical and complete (h1 → h2 → h3)

### Contrast Validation

Use:
- **WebAIM Contrast Checker** (webaim.org/resources/contrastchecker)
- **aXe DevTools** (axe-devtools browser extension)
- **WAVE** (wave.webaim.org)

Requirements (WCAG AA):
- [ ] Normal text: 4.5:1 contrast ratio
- [ ] Large text (18pt+ or 14pt+ bold): 3:1 contrast ratio
- [ ] UI components (borders, icons): 3:1 contrast ratio

---

## Quality Gate Integration

### `pnpm validate`

Full quality gate includes:

```bash
pnpm validate
```

Runs (in order):
1. `lint` — ESLint a11y rules
2. `format:check` — Prettier (including accessibility-friendly code style)
3. `typecheck` — TypeScript strictness
4. `test:names` — Test naming validation
5. `test:segmented` — Unit/component/integration tests
6. `test:a11y` — Playwright accessibility tests (**PRIMARY**)
7. `build` — Vite/TypeScript build

**Exit Code**: 0 (pass) or 1 (fail)

### CI Pipeline

1. **Lint + Format** → ESLint a11y rules
2. **Unit/Component/Integration Tests** → Vitest
3. **Playwright A11y Tests** → 5 browser contexts (primary gate)
4. **Lighthouse Audit (Optional)** → CI-only, display-backed environment

---

## Troubleshooting

### `pnpm test:a11y` Fails: Focus Indicator Not Detected

**Issue**: Test expects visible focus outline, but component uses custom focus.

**Solution**:
```typescript
// Check all possible focus indicators
const focusStyles = await button.evaluate(el => {
  const computed = window.getComputedStyle(el)
  return {
    outline: computed.outline,
    boxShadow: computed.boxShadow,
    backgroundColor: computed.backgroundColor,
    borderColor: computed.borderColor,
  }
})

// Verify at least one changed on focus
```

### `pnpm test:lighthouse` Fails: NO_FCP (No First Contentful Paint)

**Issue**: Lighthouse blocked by Chrome headless paint suppression (WSL environment).

**Solution**: Skip local Lighthouse; rely on `pnpm test:a11y` and CI-only Lighthouse.

```bash
# Skip Lighthouse locally
pnpm test:a11y  # ✅ Works in WSL

# CI only (with Xvfb or system Chrome)
# Configured in .github/workflows/validate.yml
```

### ESLint Throws jsx-a11y Warning: "No heading"

**Issue**: Page missing h1 or role="heading" aria-level="1".

**Solution**:
```typescript
// ❌ BAD: No h1
<main>
  <p>Welcome</p>
</main>

// ✅ GOOD: Implicit h1 via role
<main>
  <h1>Welcome</h1>
</main>

// ✅ ALSO GOOD: Explicit role (less semantic)
<main>
  <div role="heading" aria-level="1">Welcome</div>
</main>
```

---

## References

- **WCAG 2.1**: https://www.w3.org/WAI/WCAG21/quickref/
- **Playwright A11y**: https://playwright.dev/docs/accessibility-testing
- **aXe Rules**: https://github.com/dequelabs/axe-core/blob/develop/doc/rule-descriptions.md
- **WebAIM**: https://webaim.org/
- **MDN Accessibility**: https://developer.mozilla.org/en-US/docs/Web/Accessibility

---

## Checklist: Adding Accessibility to a New Component

- [ ] ESLint passes (no jsx-a11y warnings)
- [ ] Semantic HTML (h1/h2/h3, button, input+label, etc.)
- [ ] Keyboard navigation (Tab, Escape, Arrow keys where needed)
- [ ] Focus indicators visible and styled
- [ ] ARIA labels/roles on non-semantic elements
- [ ] `pnpm test:a11y` passes (all 5 browser contexts)
- [ ] Manual keyboard nav test completed (Tab through)
- [ ] Manual screen reader test completed (NVDA/VoiceOver)
- [ ] Manual contrast check completed (4.5:1 minimum)
