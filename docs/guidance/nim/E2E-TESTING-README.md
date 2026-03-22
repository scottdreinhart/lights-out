# Playwright E2E Testing Guide

## Overview

The Nim game includes comprehensive Playwright E2E tests for responsive layout validation across device breakpoints and screen sizes matching Chrome DevTools.

## Device Profiles (2026)

Tests cover the following real-world devices:

### Mobile Devices
- **iPhone 15** (390×844, 2x scale) - Latest compact iPhone
- **iPhone 15 Pro** (430×932, 3x scale) - Latest Pro iPhone
- **Pixel 9 Pro** (412×915, 2.75x scale) - Flagship Android

### Tablet Devices
- **iPad Air** (1024×1366, 2x scale) - iPad tablet
- **Galaxy Tab S4** (2560×1600, 2x scale) - Premium Android tablet

### Desktop & Custom Breakpoints
- **1080p** (1920×1080) - Standard desktop
- **1440p** (2560×1440) - QHD desktop
- **Custom 375px** - Mobile breakpoint
- **Custom 600px** - Tablet breakpoint
- **Custom 900px** - Desktop breakpoint
- **Custom 1200px** - Widescreen breakpoint
- **Custom 1800px** - Ultrawide breakpoint

### Browsers
- Chromium (all device profiles)
- Firefox (desktop)
- WebKit/Safari (desktop)

## Running Tests

### All Tests
```bash
pnpm test:e2e
```

### Responsive-Only Tests (Recommended)
```bash
pnpm test:e2e:responsive
```

Tests the MainMenu and App layout at all 5 custom breakpoints.

### Interactive UI Mode
```bash
pnpm test:e2e:ui
```

Opens interactive test runner showing:
- Test execution timeline
- Screenshots
- Logs per breakpoint
- Failure details with diffs

### Headed Mode (See Browser)
```bash
pnpm test:e2e:headed
```

Runs tests visually in a browser window so you can watch real-time rendering at each breakpoint.

### Debug Mode
```bash
pnpm test:e2e:debug
```

Opens Inspector with step-through debugging, breakpoints, and DOM inspection.

### Filter by Device Project
```bash
# Only Chromium mobile tests
pnpm exec playwright test --project="chromium-mobile*"

# Only iPad tests
pnpm exec playwright test --project="chromium-tablet-ipad"

# Only custom breakpoints
pnpm exec playwright test --project="responsive-*"
```

## Test Suites

### 1. MainMenu Responsive (`mainmenu.spec.ts`)
Tests the MainMenu component at all breakpoints:
- ✓ Container expands without overflow
- ✓ Buttons reflow (stack on mobile, horizontal on tablet+)
- ✓ Typography scales appropriately
- ✓ No horizontal scrollbar
- ✓ Padding increases with viewport size
- ✓ Screenshot visual regression testing

### 2. App Layout Responsive (`app-responsive.spec.ts`)
Tests overall app layout:
- ✓ Header remains sticky and properly sized
- ✓ Content scrollable without horizontal overflow
- ✓ Touch targets ≥44x44px on mobile
- ✓ Color contrast maintained
- ✓ Reduced motion preferences respected
- ✓ Minimal layout shift on scroll

## Reports

### HTML Report
```bash
pnpm test:responsive:report
```

Opens detailed HTML report with:
- Test timelines
- Screenshots at each breakpoint
- Failure details with diffs
- Video recordings (if enabled)

### JSON Report
View `test-results/results.json` for programmatic test data.

## Key Assertions

Each test verifies:

1. **No overflow**: Content width ≤ viewport width
2. **Proper scaling**: Containers expand at each breakpoint
3. **Touch-safe**: Mobile targets ≥ 44×44px
4. **Typography**: Font sizes increase appropriately
5. **Layout stability**: No unexpected reflows
6. **Visual regression**: Screenshots match baseline

## Configuration

Playwright config: `playwright.config.ts`

Default settings:
- **testDir**: `src/__tests__/e2e`
- **baseURL**: `http://localhost:5173`
- **webServer**: Auto-starts `pnpm dev`
- **Timeouts**: 30s per test, 5min per worker
- **Retries**: 0 local, 2 on CI
- **Workers**: All available cores (local), 1 (CI)

## CI/CD Integration

The `validate` script now runs:
```bash
pnpm check && pnpm build && pnpm test:e2e:responsive
```

This ensures responsive tests pass before deployment.

## Troubleshooting

### Tests timeout
- Increase `timeout` in `playwright.config.ts`
- Check if dev server started: `pnpm dev`

### Screenshot mismatches
- Update baselines: `pnpm exec playwright test --update-snapshots`
- Check for platform differences (Mac/Windows font rendering)

### Device profile not found
- Ensure Playwright is installed: `pnpm install`
- List available: `pnpm exec playwright test --list`

## Advanced Usage

### Custom viewport size
```bash
pnpm exec playwright test --viewport-size=800x600
```

### Slow motion (useful for debugging)
```bash
pnpm exec playwright test --headed --slow-mo=1000
```

### Single test file
```bash
pnpm exec playwright test mainmenu.spec.ts
```

### Specific test
```bash
pnpm exec playwright test -g "renders at all breakpoints"
```

## Further Reading

- [Playwright Docs](https://playwright.dev)
- [Device Profiles](https://playwright.dev/docs/emulation)
- [Screenshots & Comparison](https://playwright.dev/docs/test-snapshots)
- [Debugging](https://playwright.dev/docs/debug)
