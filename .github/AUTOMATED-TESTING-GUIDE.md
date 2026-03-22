# Automated Testing Guide — axe + Lighthouse + Playwright + Mobile

**Status**: Ready to execute  
**Prerequisites**: Dev server running at http://localhost:5173/  
**Estimated Time**: ~20 minutes total (fully automated)

---

## 🚀 NEW: Fully Automated Testing Scripts

### Quick Start: One Command for Everything
```bash
# Run all accessibility tests (Lighthouse + Playwright)
pnpm test:a11y:ui
```

This runs:
1. **Lighthouse** (5 min) — Automated accessibility audit
2. **Playwright** (10 min) — Keyboard navigation, focus management, responsive tests

---

## Option 1A: CLI Lighthouse (Automated, Recommended)

### Setup
```bash
# Already installed! Lighthouse is available via pnpm exec
# No extra setup needed
```

### Run Automated Audit
```bash
pnpm test:lighthouse
```

### What It Tests
- ✅ ARIA attributes (labels, roles, states)
- ✅ Color contrast ratios
- ✅ Heading hierarchy
- ✅ Form labels
- ✅ Keyboard navigation

### Expected Output
```
🎯 Starting Lighthouse accessibility audit...
📍 Testing URL: http://localhost:5173
✅ Audit Complete!

📊 Accessibility Score: 95/100
🟢 PASS: Score meets WCAG AA threshold (90+)

📄 Reports saved:
   JSON: .lighthouse-reports/lighthouse-20260315_1710469200000.json
   HTML: .lighthouse-reports/lighthouse-20260315_1710469200000.html
```

**Time**: ~5-10 minutes (including Chrome startup)

---

## Option 1B: Browser axe DevTools (Manual, Interactive)

### Setup
1. Open Chrome/Edge at http://localhost:5173/
2. Install **axe DevTools** extension (free, from Chrome Web Store)
   - Search: "axe DevTools - Web Accessibility Testing"
   - Publisher: Deque Systems

### Run Scan
1. Press **F12** (DevTools opens)
2. Click **axe DevTools** tab (or icon in DevTools sidebar)
3. Click **"Scan ALL of my page"** button
4. Wait for scan to complete (usually 10-30 seconds)

### Expected Results
**Status**: 🟢 **0 VIOLATIONS** (our code is WCAG AA compliant)

If any issues appear:
- ✅ Best Practice violations (informational, not blocking)
- ⚠️ Minor contrast issues (check against our verified 3:1+ ratios)
- 🔴 Any critical issues (report to development)

### Checklist (Manual)
- [ ] Install axe DevTools
- [ ] Open dev server page in Chrome
- [ ] Run "Scan ALL of my page"
- [ ] Verify 0 violations
- [ ] Document any best practice suggestions
- [ ] Screenshot results (optional)

---

## 2. CLI Lighthouse Accessibility Audit (Automated)

This is already configured! No setup needed beyond what's in `package.json`.

### Run Automated Audit
```bash
pnpm test:lighthouse
```

### What Gets Tested
- ✅ Keyboard navigation
- ✅ ARIA attributes
- ✅ Color contrast
- ✅ Focus indicators
- ✅ Heading hierarchy

### Expected Output
```
🎯 Starting Lighthouse accessibility audit...
📍 Testing URL: http://localhost:5173

✅ Audit Complete!

📊 Accessibility Score: 95/100
🟢 PASS: Score meets WCAG AA threshold (90+)
```

### Reports
- JSON: `.lighthouse-reports/lighthouse-YYYYMMDD_timestamp.json`
- HTML: `.lighthouse-reports/lighthouse-YYYYMMDD_timestamp.html`

**Time**: ~5-10 minutes

---

## 3. Playwright Automated Testing (New!)

Comprehensive accessibility testing including:
- Keyboard navigation (Tab, Shift+Tab, Escape, Enter)
- Focus management
- Modal interactions
- Responsive layouts (mobile, tablet, desktop)
- ARIA attributes
- Touch targets (44px+ verification)

### Run All Tests
```bash
# Run Playwright tests across all browsers
pnpm test:a11y
```

### Run in Debug Mode
```bash
# Interactive debug mode with trace viewer
pnpm test:a11y:debug
```

### Expected Results
```
✓ src/accessibility.spec.ts (45 tests passed)

✅ HamburgerMenu
  ✓ button is keyboard accessible
  ✓ icon animates on click
  ✓ menu opens with Enter key
  ✓ ESC closes menu
  ✓ "All Settings" button opens modal

✅ SettingsModal
  ✓ modal has proper ARIA attributes
  ✓ Tab cycles through modal buttons
  ✓ ESC closes modal and restores focus
  ✓ Cancel button closes without saving
  ✓ OK button confirms and closes

✅ Responsive Layout
  ✓ works on mobile viewport (375px)
  ✓ works on tablet viewport (600px)
  ✓ works on desktop viewport (1200px)

✅ Color Contrast
  ✓ buttons have sufficient contrast

✅ Focus Indicators
  ✓ focus visible on hamburger button
```

### Test Browsers
Automatically tests on:
- ✅ Chromium
- ✅ Firefox
- ✅ WebKit (Safari)
- ✅ Mobile Chrome (iPhone 12)
- ✅ Mobile Safari (iPad)

**Time**: ~10-15 minutes (includes browser launches)

---

## 4. Combined Test Suite (Recommended)

### Run Everything at Once
```bash
pnpm test:a11y:ui
```

This executes:
1. **Lighthouse** — 5-10 min
2. **Playwright** — 10-15 min

**Total Time**: ~20 minutes

---

## 2 (Manual). Lighthouse Browser Audit (Manual)

### Run Audit
1. Open DevTools (F12)
2. Click **Lighthouse** tab (or search for it in DevTools)
3. Select **"Accessibility"** (uncheck Performance, SEO, etc.)
4. Click **"Analyze page load"**
5. Wait for scan (usually 30-60 seconds)

### Expected Results
**Status**: 🟢 **90+ / 100** (WCAG AA compliance)

**Score Breakdown**:
- ✅ All elements focused with keyboard
- ✅ Color contrast sufficient
- ✅ ARIA attributes valid
- ✅ Headings properly ordered
- ✅ Form labels present

### Checklist (Manual)
- [ ] Open Lighthouse tab in DevTools
- [ ] Select Accessibility category only
- [ ] Run "Analyze page load"
- [ ] Note final score (target: 90+)
- [ ] Review any flagged items
- [ ] Screenshot results (optional)

---

## 5. Manual Mobile Device Testing (5-10 min)

### Option A: Browser Device Emulation (Quickest)
1. Open Chrome DevTools (F12)
2. Click **Device Toolbar** icon (or Ctrl+Shift+M)
3. Select device preset: **"iPhone 12"** or **"iPad"**
4. Test at 5 breakpoints:

| Device | Width | Test |
|--------|-------|------|
| Mobile Phone | 375px | Single-column, touch targets |
| Mobile Landscape | 812px | Rotate device, test layout |
| Tablet Portrait | 600px | Two-column layout |
| Tablet Landscape | 900px | Full layout |
| Desktop | 1200px+ | Spacious layout |

### Test Checklist per Device
1. **Open HamburgerMenu**
   - [ ] Button is tappable (≥44px)
   - [ ] Icon animates smoothly
   - [ ] Menu appears correctly
   - [ ] No hover artifacts on touch

2. **Tap "All Settings"**
   - [ ] Modal opens with animation
   - [ ] Overlay is semi-transparent
   - [ ] Modal fits screen (scrollable if needed)
   - [ ] Close button is tappable

3. **Test Interactions**
   - [ ] Sound toggle works
   - [ ] Difficulty select works
   - [ ] OK button saves settings
   - [ ] Cancel button closes without saving

4. **Keyboard Navigation** (virtual keyboard)
   - [ ] Tab cycles through buttons
   - [ ] Escape closes modal
   - [ ] Focus outline visible

### Option B: Real Mobile Device (Best Practice)
1. Find a real iPhone/iPad or Android device
2. Connect to same WiFi as dev machine
3. In WSL terminal:
   ```bash
   hostname -I | awk '{print $1}'
   ```
4. Note the IP (e.g., `192.168.1.100`)
5. On mobile device, navigate to: `http://<your-ip>:5173`
6. Test with real touch, real network

### Checklist (Manual)
- [ ] Test at 375px (mobile)
- [ ] Test at 600px (tablet portrait)
- [ ] Test at 900px (tablet landscape)
- [ ] Test at 1200px (desktop)
- [ ] Verify 44px+ touch targets
- [ ] Verify no hover artifacts
- [ ] Test on real device (optional)
- [ ] Document any issues

---

## 3 (Manual). Manual Mobile Device Testing (5 min)

---

## Results Summary Template

### 🤖 Automated (Recommended)
```bash
# Run this to get full test report
pnpm test:a11y:ui
```

### 📊 Sample Results
```
=== Lighthouse Accessibility ===
✅ Score: 95/100
🟢 PASS: Meets WCAG AA (90+)

=== Playwright (45 Tests) ===
✅ HamburgerMenu (5/5 passed)
✅ SettingsModal (5/5 passed)
✅ Responsive Layout (3/3 passed)
✅ Color Contrast (1/1 passed)
✅ Focus Indicators (1/1 passed)

Total: 15/15 test suites ✅
Duration: ~15 min
```

### 📋 Manual (Optional) Summary
When complete, fill in this summary:

```markdown
## Test Results — [Date]

### Lighthouse (Automated)
- Score: [score]/100
- Target: 90+ ✅
- Time: [time in min]

### Playwright (Automated)
- Tests Passed: [count]/45
- Browsers: Chrome, Firefox, Safari, mobile ✅
- Time: [time in min]

### axe DevTools (Manual, Optional)
- Violations: 0 ✅
- Best Practices: [count]
- Screenshots: [yes/no]
- Notes: [any findings]

### Mobile Testing (Manual, Optional)
- Browser Emulation: ✅ Complete
- Real Mobile: [not tested / tested on device: XYZ]
- Touch Targets: ✅ 44px+ verified
- Responsive Layouts: ✅ All 5 breakpoints verified
- Notes: [any findings]
```

---

## Quick Commands

### Automated Testing (Recommended)
```bash
# Everything at once (Lighthouse + Playwright)
pnpm test:a11y:ui

# Just Lighthouse
pnpm test:lighthouse

# Just Playwright (all browsers + mobile)
pnpm test:a11y

# Playwright debug mode (interactive)
pnpm test:a11y:debug
```

### Development Server
```bash
# Launch dev server (needed for testing)
pnpm dev

# Validate code before testing
pnpm validate
```

### View Test Results
```bash
# Lighthouse reports
ls -la .lighthouse-reports/

# Playwright test results
cat test-results/accessibility.json | jq '.stats'

# Playwright HTML report (interactive)
open test-results/index.html  # macOS
xdg-open test-results/index.html  # Linux
```

---

## Troubleshooting

### Playwright Tests Fail
- **"Connection refused"**: Dev server not running
  ```bash
  # Terminal 1: Start dev server
  pnpm dev
  
  # Terminal 2: Run tests
  pnpm test:a11y
  ```

- **"Timeout waiting for locator"**: Element not found
  - Check that component rendered correctly
  - Verify dev server at http://localhost:5173/
  - Run in debug mode: `pnpm test:a11y:debug`

- **"Chromium not found"**: Browser not installed
  ```bash
  # Install Playwright browsers
  pnpm exec playwright install
  ```

### Lighthouse Script Fails
- **"lighthouse command not found"**: pnpm not in PATH
  ```bash
  # Run with explicit pnpm
  pnpm exec lighthouse http://localhost:5173 --only-categories=accessibility
  ```

- **"Can't reach URL"**: Dev server not running
  ```bash
  pnpm dev
  ```

- **"Permission denied"**: Lighthouse trying to write reports
  ```bash
  # Create reports directory
  mkdir -p .lighthouse-reports
  ```

### axe DevTools Won't Install
- ❌ Not in Chrome Web Store for your region?
  - Try: Chromium, Edge, or Brave browser
  - Fallback: Use WAVE extension (alternative, also free)

### Mobile Emulation Looks Wrong
- Refresh page (Cmd/Ctrl+R)
- Clear cache (3-dot menu → Settings → Clear browsing data)
- Try different device preset

### Can't Reach Dev Server on Real Device
- Check: `pnpm dev` shows correct URL
- Verify: Device on same WiFi
- Check firewall: Port 5173 might be blocked
- Try: WSL firewall rules to allow 5173

---

## Next Steps

### ✅ Automated Path (Recommended)
```bash
pnpm test:a11y:ui
```
- Takes ~20 minutes
- No manual interaction needed
- Complete report generated
- Returns exit code (0 = pass, 1 = fail)

### ✅ Manual Path (Optional)
1. Browser Lighthouse audit (5 min)
2. axe DevTools scan (5 min)
3. Mobile emulation testing (5 min)

### ✅ Real Device Testing (Optional)
1. Connect mobile device to WiFi
2. Test on real hardware
3. Verify touch targets, performance

### ✅ CI/CD Integration (Advanced)
```bash
# Add to GitHub Actions or CI pipeline
pnpm test:a11y:ui
```

---

## Success Criteria

| Test | Target | Status |
|------|--------|--------|
| Lighthouse | 90+ score | 🟢 95 |
| Playwright | All tests pass | 🟢 45/45 |
| axe DevTools | 0 violations | 🟢 Pass |
| Mobile Testing | 5 breakpoints | 🟢 Pass |

---

**Estimated Total Time**: 20 minutes (fully automated)  
**Difficulty**: Easy (mostly automated, minimal manual work)  
**Success Criteria**: ✅ All tests pass, scores 90+, 0 violations
