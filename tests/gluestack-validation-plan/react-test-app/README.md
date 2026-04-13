# Gluestack UI Validation Test App

Minimal React + Vite application for validating Gluestack UI suitability for 52-game platform (2 shells: web + RN).

## Quick Start

```bash
cd tests/gluestack-validation-plan/react-test-app

# Install dependencies
pnpm install

# Start dev server (opens http://localhost:5173)
pnpm dev

# Build for production
pnpm build

# Run tests
pnpm test

# Run tests in watch mode
pnpm test:watch
```

## Test Structure

### 3 Main Tests (Phase 1: React Web Validation)

| Test | File | Purpose | Duration |
|------|------|---------|----------|
| **Q1: TV/D-Pad Focus** | `src/tests/Q1-TVFocus.tsx` | Verify D-Pad focus navigation, visibility, customization | 5 min interactive |
| **Q2: Theming** | `src/tests/Q2-Theming.tsx` | Runtime theme switching, WCAG contrast, visual consistency | 5 min interactive |
| **Q3: Responsive** | `src/tests/Q3-Responsive.tsx` | 5-tier breakpoint behavior, touch targets, readability | 10 min (resize browser) |

**Total automated check time**: ~20 minutes

---

## Validation Plan (VALIDATION-PLAN.md)

Full 6-question framework:

1. ✅ **Q1: TV/D-Pad Focus** — Focus handling, D-Pad navigation, customization
2. ✅ **Q2: Theming** — Runtime theme switching, contrast, consistency
3. 📊 **Q3: Bundle Size** — React Native bundle impact (requires RN build)
4. 📋 **Q4: WCAG AA** — Keyboard nav, semantics, axe audit (requires axe)
5. 📐 **Q5: Responsive** — 5-tier breakpoints, responsive utilities
6. ⚡ **Q6: Performance** — Startup time, render speed, FPS (requires profiling)

**This test app covers Q1-Q3 + parts of Q5.**

---

## Test Results Reporting

After running tests, document findings:

### For Each Test:

1. **Screenshots or Video**
   - Save to `tests/gluestack-validation-plan/results/screenshots/`
   - Name: `Q1-focus-grid.png`, `Q2-theme-switch.png`, etc.

2. **Metrics Captured**
   - Focus visibility: ✅/❌
   - Navigation intuitiveness: rating (1-5)
   - Theme switching speed: <100ms? ✅/❌
   - Responsive grid adaptability: working at [breakpoints]

3. **Issues Found**
   - Document in `tests/gluestack-validation-plan/ISSUES.md`
   - Include: description, reproduction steps, severity (critical/warning/note)

### Final Report Template

```markdown
# Gluestack Validation Results

## Q1: TV/D-Pad Focus
- **Date**: YYYY-MM-DD
- **Status**: PASS/FAIL
- **Findings**: ...
- **Evidence**: [link to screenshot]

## Q2: Theming
- **Date**: YYYY-MM-DD
- **Status**: PASS/FAIL
- **Findings**: ...
- **Evidence**: [link to screenshot]

## Q3: Responsive
- **Date**: YYYY-MM-DD
- **Status**: PASS/FAIL
- **Findings**: ...
- **Evidence**: [link to screenshot]

## Summary
- **Tests Passed**: 3/3
- **Issues Found**: 0 critical, 0 warnings
- **Recommendation**: PROCEED / NEEDS WORK / REJECT
```

---

## Browser Testing at Different Sizes

To test all 5 breakpoints:

1. Open DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Select device or manually set viewport:

| Breakpoint | Size | Device |
|-----------|------|--------|
| xs | 375px | iPhone SE |
| sm | 400px | Pixel 4 |
| md | 768px | iPad |
| lg | 1024px | iPad Pro / Desktop |
| xl | 1440px | Desktop |
| xxl | 1920px | Desktop (4K/TV) |

---

## Keyboard Navigation Testing (Q1 Focus)

Test D-Pad behavior (arrow keys):

```
Up/↑        Move focus up
Down/↓      Move focus down
Left/←      Move focus left
Right/→     Move focus right
Click       Set focus to specific cell
```

**Verify**:
- ✅ Focus always visible
- ✅ Focus follows arrow keys intuitively
- ✅ Can navigate entire grid
- ✅ Can confirm/click with Enter/Space
- ✅ No keyboard traps

---

## WCAG AA Accessibility Check (Manual)

Run axe DevTools in browser:

1. Install [axe DevTools extension](https://www.deque.com/axe/devtools/)
2. Open DevTools → Axe DevTools tab
3. Click "Scan ALL of my page"
4. Review results:
   - ❌ Critical/Serious = FAIL
   - ⚠️ Minor/Moderate = WARNING
   - ✅ Passes = PASS

**Document findings** in `tests/gluestack-validation-plan/WCAG-AA-AUDIT.md`

---

## Performance Profiling (Optional)

Use React DevTools Profiler:

1. Install [React DevTools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi)
2. Open Profiler tab
3. Record interactions:
   - Theme switch (measure re-render time)
   - Focus navigation (measure event handling)
   - Resize window (measure responsive layout calculation)
4. Check for unnecessary re-renders

**Profile results** in `tests/gluestack-validation-plan/PERFORMANCE-PROFILE.md`

---

## File Structure

```
tests/gluestack-validation-plan/
├── VALIDATION-PLAN.md          ← Main plan (6 questions)
├── ISSUES.md                   ← Issues found during testing
├── WCAG-AA-AUDIT.md            ← WCAG audit results
├── PERFORMANCE-PROFILE.md      ← Performance metrics
│
├── react-test-app/             ← This app
│   ├── package.json
│   ├── vite.config.ts
│   ├── index.html
│   │
│   └── src/
│       ├── index.tsx
│       ├── App.tsx
│       ├── index.css
│       │
│       └── tests/
│           ├── Q1-TVFocus.tsx
│           ├── Q2-Theming.tsx
│           └── Q3-Responsive.tsx
│
└── results/                    ← Test outputs
    ├── screenshots/
    ├── videos/
    └── metrics.json
```

---

## Next Steps After React Validation

After Q1-Q3 pass in React:

1. **Q4: WCAG AA**
   - Run axe audit
   - Test keyboard navigation
   - Verify screen reader compatibility

2. **Q5: Responsive & Breakpoints**
   - Expand responsive test
   - Test all 5 breakpoints exhaustively
   - Verify touch targets ≥44px

3. **Q3b: React Native Bundle**
   - Set up Expo/RN test app
   - Add Gluestack to RN app
   - Measure bundle impact

4. **Q6: Performance**
   - Profile startup time
   - Profile render performance
   - Measure FPS under load

---

## Troubleshooting

### Port 5173 already in use
```bash
# Kill process on port 5173
lsof -i :5173 | grep LISTEN | awk '{print $2}' | xargs kill -9
# Or use different port
pnpm dev -- --port 5174
```

### Dependencies missing
```bash
# Reinstall
pnpm install

# Or hard reset
pnpm clean
pnpm install
```

### Build fails
```bash
# Check TypeScript errors
pnpm exec tsc --noEmit

# Clear node_modules and reinstall
pnpm clean:node
pnpm install
```

---

## References

- **Validation Plan**: [VALIDATION-PLAN.md](./VALIDATION-PLAN.md)
- **Platform Architecture**: [../../AGENTS.md#12-responsive-design](../../AGENTS.md#12-responsive-design)
- **Gluestack Docs**: https://gluestack.io/
- **WCAG 2.1 AA**: https://www.w3.org/WAI/WCAG21/quickref/
- **Web Vitals**: https://web.dev/vitals/

---

**Status**: ⏳ In Progress (React Web Phase 1)

**Last Updated**: 2026-01-21

**Owner**: Platform Architecture Team
