# CSS Optimization Implementation Guide

**Quick-Start Reference for CSS Improvements**

---

## 🎯 Priority Actions

### Action 1: Extract Theme Variables (Immediate)

**Effort**: 30 minutes | **Savings**: ~300 bytes | **Benefit**: Better maintainability

**Step 1**: Create shared theme file

```bash
touch src/ui/constants/theme.module.css
```

**Step 2**: Add common theme values

```css
/* src/ui/constants/theme.module.css */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes bounceIn {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

/* Export for use in other modules */
:export {
  accentColor: #667eea;
  bgDark: #1a1f3a;
  bgDarkGradient: linear-gradient(135deg, #1a1f3a 0%, #0f1419 100%);
  borderColor: rgba(0, 150, 255, 0.3);
  shadowDark: 0 20px 60px rgba(0, 0, 0, 0.8);
  shadowLight: 0 4px 12px rgba(102, 126, 234, 0.2);
}
```

**Step 3**: Import in CSS files needing these

```css
/* src/ui/molecules/SettingsModal.module.css */
@import '../constants/theme.module.css';

@keyframes modalFadeIn {
  /* Was here, now comes from import above */
}
```

---

### Action 2: Consolidate Modal Base Styles (1 hour)

**Effort**: 1 hour | **Savings**: ~200 bytes | **Benefit**: DRY principle

**Step 1**: Extract common modal styles

```bash
touch src/ui/molecules/Modal.base.module.css
```

**Step 2**: Identify shared CSS between SettingsModal.module.css and AboutModal.module.css

```css
/* src/ui/molecules/Modal.base.module.css */
.modal {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  padding: 0;
  border: none;
  background: rgba(0, 0, 0, 0.6);
  animation: modalFadeIn 0.2s ease-out;
  backdrop-filter: blur(4px);
}

.modal::backdrop {
  background: rgba(0, 0, 0, 0.6);
  animation: modalFadeIn 0.2s ease-out;
}

.content {
  position: relative;
  max-width: 500px;
  margin: auto;
  top: 50%;
  transform: translateY(-50%);
  background: linear-gradient(135deg, #1a1f3a 0%, #0f1419 100%);
  border: 1px solid rgba(0, 150, 255, 0.3);
  border-radius: 12px;
  padding: 2rem;
  box-shadow:
    0 20px 60px rgba(0, 0, 0, 0.8),
    0 0 1px rgba(0, 150, 255, 0.1);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(0, 150, 255, 0.2);
}

.closeBtn {
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  font-size: 1.5rem;
  padding: 0.5rem;
  transition: transform 0.2s;
}

.closeBtn:hover {
  transform: rotate(90deg);
}
```

**Step 3**: Import in both modal files

```css
/* src/ui/molecules/SettingsModal.module.css */
@import './Modal.base.module.css';

/* Only add settings-specific overrides here */
.settingsHeader {
  /* ... */
}
.volumeControl {
  /* ... */
}
```

---

### Action 3: Extract Responsive Utilities (1 hour + ongoing)

**Effort**: 1 hour | **Savings**: ~150 bytes ongoing | **Benefit**: Consistency

**Step 1**: Create responsive helpers

```bash
touch src/ui/constants/responsive.module.css
```

**Step 2**: Add responsive breakpoint variables

```css
/* src/ui/constants/responsive.module.css */
/* Mobile-first approach */
:root {
  --breakpoint-sm: 375px;
  --breakpoint-md: 600px;
  --breakpoint-lg: 900px;
  --breakpoint-xl: 1200px;
  --breakpoint-xxl: 1800px;
}

/* Responsive spacing */
:root {
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
}

/* Mobile spacing (compact) */
@media (max-width: 599px) {
  :root {
    --spacing-md: 0.75rem;
    --spacing-lg: 1rem;
  }
}

/* Tablet/Desktop spacing */
@media (min-width: 600px) {
  :root {
    --spacing-md: 1rem;
    --spacing-lg: 1.5rem;
  }
}
```

---

## 📊 Measuring Impact

### Before & After Tracking

```bash
# Measure current baseline
cd /mnt/c/Users/scott/game-platform/apps/battleship
pnpm build 2>&1 | grep "gzip"

# Expected output for baseline:
# dist/assets/index-XXXX.css    24.16 kB │ gzip:  5.45 kB
```

### After Each Refactoring

Run the same command and compare:

```
BEFORE:     24.16 kB (gzip: 5.45 kB)
AFTER:      24.00 kB (gzip: 5.38 kB)
SAVINGS:    0.16 kB (3% uncompressed, 1% gzipped)
```

---

## 🚀 Automation: Vite Config Optimization

### Already Applied

- ✅ `cssMinify: 'lightningcss'` → Better CSS compression
- ✅ `sourcemap: false` → No source map overhead in production
- ✅ `modulePreload: { polyfill: false }` → Reduced polyfill size

### Optional: Add CSS Analysis Plugin

```bash
npm install --save-dev vite-plugin-analyze
```

Update `vite.config.js`:

```javascript
import { visualizer } from 'rollup-plugin-visualizer'
import { analyzeFont } from 'vite-plugin-analyze'

export default defineConfig({
  plugins: [
    react(),
    visualizer({
      filename: 'dist/bundle-report.html',
      gzipSize: true,
      brotliSize: true,
      open: false,
    }),
    // Optional: analyzeFont() for font optimization
  ],
})
```

---

## 🔍 Monitoring Script

**Save as**: `monitor-css-size.sh`

```bash
#!/bin/bash
BASELINE=5450  # bytes, gzipped baseline at 5.45 KB

build_and_measure() {
  echo "Building..."
  pnpm build > /dev/null 2>&1

  CSS_SIZE=$(zcat dist/assets/*.css.gz 2>/dev/null | wc -c)
  CSS_SIZE=$((CSS_SIZE / 1))

  PERCENT=$((CSS_SIZE * 100 / BASELINE))

  echo "═══════════════════════════════════════"
  echo "CSS Size Report"
  echo "═══════════════════════════════════════"
  echo "Current:  $((CSS_SIZE / 1024)).$((CSS_SIZE % 1024)) KB"
  echo "Baseline: $((BASELINE / 1024)).$((BASELINE % 1024)) KB"
  echo "Change:   $((CSS_SIZE - BASELINE)) bytes ($((PERCENT - 100))%)"

  if [ $CSS_SIZE -gt $BASELINE ]; then
    echo "⚠️  CSS increased! Review changes."
    exit 1
  else
    echo "✅ CSS within baseline"
    exit 0
  fi
}

build_and_measure
```

Run with:

```bash
chmod +x monitor-css-size.sh
./monitor-css-size.sh
```

---

## ✅ Checklist for Optimization

- [ ] **Phase 1**: Extract theme variables (30 min)
  - [ ] Create `src/ui/constants/theme.module.css`
  - [ ] Move keyframes to shared file
  - [ ] Update imports in component CSS
  - [ ] Test build: `pnpm build`
- [ ] **Phase 2**: Consolidate modal styles (1 hour)
  - [ ] Create `src/ui/molecules/Modal.base.module.css`
  - [ ] Extract common modal CSS
  - [ ] Update `SettingsModal.module.css` to import base
  - [ ] Update `AboutModal.module.css` to import base
  - [ ] Test: `pnpm build && pnpm typecheck`

- [ ] **Phase 3**: Responsive utilities (1 hour)
  - [ ] Create `src/ui/constants/responsive.module.css`
  - [ ] Extract breakpoint variables
  - [ ] Use variables in component CSS
  - [ ] Test responsive at all breakpoints

- [ ] **Monitoring**: Set up CI check
  - [ ] Add CSS size check to CI/CD
  - [ ] Monitor bundle report
  - [ ] Track metrics over time

---

## 🎓 Learning Resources

### CSS Modules Best Practices

- [CSS Modules Documentation](https://github.com/css-modules/css-modules)
- [BEM Naming with CSS Modules](https://www.smashingmagazine.com/2020/07/css-modules-components/)

### Performance

- [Critical CSS Concepts](https://web.dev/extract-critical-css/)
- [CSS Performance Checklist](https://calendar.perfplanet.com/2025/)

### Lightning CSS

- [Lightning CSS Features](https://lightningcss.dev/)
- [CSS Minification Benchmarks](https://lightningcss.dev/performance.html)

---

**Last Updated**: April 2, 2026  
**Status**: Ready for Implementation
