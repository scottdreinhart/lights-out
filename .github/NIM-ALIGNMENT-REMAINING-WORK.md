# Nim Architecture Alignment — Remaining Work

**Date**: 2026-03-15  
**Project**: game-platform  
**Status**: In Progress

---

## Summary

The game-platform has adopted the Nim-parity layered architecture and barrel pattern system. ESLint linting infrastructure is healthy and well-understood. Remaining work focuses on **UI pattern unification** (specifically hamburger menu/settings modal) and minor architectural refinements.

## Completed ✓

- [x] Layer structure (domain, app, ui, infrastructure, wasm, workers)
- [x] Barrel export pattern (index.ts in every directory)
- [x] Path alias configuration (@/domain, @/app, @/ui)
- [x] ESLint layer boundary enforcement (eslint-plugin-boundaries)
- [x] TypeScript strict mode, WCAG accessibility, responsive design hooks
- [x] Crash logger, analytics, performance metrics infrastructure
- [x] Service loading, online status detection, media query hooks
- [x] Responsive state hook (useResponsiveState) with 5-tier device support
- [x] Sound effects and theme context providers
- [x] Storage service (localStorage abstraction)
- [x] Theme system with CSS module stylesheets
- [x] WASM AI engine with Web Worker fallback
- [x] Electron and Capacitor configs

---

## Remaining Alignment Work

### 1. Hamburger Menu Pattern Refinement (PRIORITY: HIGH)

**Goal**: Align HamburgerMenu with TicTacToe gold-standard implementation (AGENTS.md § 13)

**Current State**:
- Basic portal rendering ✓
- ESC key handling ✓
- Backdrop click dismiss ✓
- **Missing**: Icon animation, useDropdownBehavior hook, focus management, smart positioning

**Changes Required**:

1. **Extract useDropdownBehavior hook** → `src/app/hooks/useDropdownBehavior.ts`
   - Handle ESC key close
   - Handle outside-click detection
   - Tab trap (focus management)
   - Return focus to trigger button on close

2. **Enhance HamburgerMenu.tsx**
   - Use useDropdownBehavior hook
   - Replace ☰ with 3-line icon that animates to X
   - Add smart positioning logic via useLayoutEffect
   - Add aria-haspopup, aria-expanded, aria-controls attributes
   - Z-index: 9999 (confirm in CSS)

3. **Enhance HamburgerMenu.module.css**
   - Icon animation: 3 lines → X shape (spring cubic-bezier(0.34, 1.56, 0.64, 1), 300ms)
   - Transform timings per line:
     - Line 1: `translateY(6.5px) rotate(45deg)`
     - Line 2: fade out (`opacity: 0`)
     - Line 3: `translateY(-6.5px) rotate(-45deg)`
   - Responsive sizing: 240px (mobile) → 320–480px (desktop) → 520px (ultrawide)
   - Content density awareness (padding/gap scale with responsive.contentDensity)
   - Touch fallback: `@media (pointer: coarse) { ... }`

4. **Integrate QuickThemePicker** (already exists)
   - Verify it exports all necessary toggles
   - Add DifficultyToggle if missing
   - Add SoundToggle if missing
   - Add ColorBlindModeToggle if missing

**Reference**:
- AGENTS.md § 13 (Menu & Settings Architecture Governance)
- ANALYSIS-HAMBURGER-SETTINGS-PATTERNS.md (cross-repo pattern analysis)
- TicTacToe's `src/ui/molecules/HamburgerMenu.tsx` and `src/app/useDropdownBehavior.ts`

**Estimated Effort**: 2–3 hours (hook extraction, CSS animation, focus management)

---

### 2. Full-Screen Settings Modal (PRIORITY: HIGH)

**Goal**: Create comprehensive settings modal accessible from main menu

**Current State**:
- QuickThemePicker exists in molecules (quick in-game access)
- No full-screen modal for comprehensive settings

**Changes Required**:

1. **Create `src/ui/organisms/SettingsModal.tsx`**
   - Organize into sections: Game Settings, Display/Theme, Accessibility
   - Use DifficultySelector, ThemeSelector, SoundToggle atoms
   - OK button (confirm changes, close modal)
   - Cancel button (revert changes, close modal)
   - Scrollable if content exceeds viewport

2. **Integrate into App.tsx or MainMenu**
   - Triggered from landing screen (home button menu), not during gameplay
   - Modal rendered at root level (via context or portal)

3. **Settings transactional semantics**
   - All changes batch on OK click
   - Cancel reverts all changes
   - Form validation before OK enable

**Estimated Effort**: 2–3 hours (modal component, form state management, integration)

---

### 3. Input Controls Verification (PRIORITY: MEDIUM)

**Goal**: Align keyboard mappings with § 19 (Input Controls & Action-Based Architecture)

**Current State**:
- useKeyboardControls hook exists
- Input appears functional
- Required Verification**: Semantic action mapping, text-input safety, context-awareness

**Changes Required**:

1. **Review useKeyboardControls.ts**
   - Confirm semantic actions (moveUp, moveDown, confirm, cancel, etc.)
   - Verify text-input safety (don't dispatch game actions while typing)
   - Ensure context awareness (gameplay vs. menu vs. modal)

2. **Test input on all devices**
   - Desktop (keyboard)
   - Mobile/Web (touch + virtual keyboard)
   - TV/gamepad (if applicable)

**Reference**: `.github/instructions/08-input-controls.instructions.md`

**Estimated Effort**: 1–2 hours (review + test)

---

### 4. Accessibility Verification (PRIORITY: MEDIUM)

**Goal**: Ensure WCAG 2.1 AA compliance per § 23

**Checklist**:
- [ ] Keyboard navigation: Tab, Escape, Enter work uniformly
- [ ] ARIA labels on interactive elements
- [ ] Color contrast: WCAG AA minimum (4.5:1 for text)
- [ ] Focus indicators: visible on all interactive elements
- [ ] Form labels: associated with inputs
- [ ] Alt text on images
- [ ] Semantic HTML (button, aside, dialog roles)

**Test Tools**: browser DevTools accessibility inspector, WAVE, Axe

**Estimated Effort**: 1–2 hours (audit + minor fixes if needed)

---

### 5. Performance Optimization (PRIORITY: LOW)

**Goal**: Verify production bundle size and runtime performance per § 25

**Current State**:
- WASM AI engine implemented
- Web Worker fallback configured
- Responsive state hook in place

**Potential Improvements**:
- [ ] Audit bundle size (Vite `pnpm build` analysis)
- [ ] Profile CPU usage during gameplay (DevTools Performance tab)
- [ ] Verify WASM loads without blocking UI
- [ ] Test on low-end devices (mobile dev tools throttling)

**Estimated Effort**: 1–2 hours (profiling + optional optimizations)

---

## Recommended Work Order

1. **Hamburger Menu refinement** (HIGH) → 2–3 hours
2. **Full-screen Settings Modal** (HIGH) → 2–3 hours
3. **Input Controls verification** (MEDIUM) → 1–2 hours
4. **Accessibility audit** (MEDIUM) → 1–2 hours
5. **Performance profiling** (LOW) → 1–2 hours (optional)

**Total Estimated Time**: 7–10 hours for full alignment

---

## Reference Files

- AGENTS.md § 3 (Architecture Preservation)
- AGENTS.md § 13 (Menu & Settings Architecture Governance)
- `.github/instructions/06-responsive.instructions.md` (Responsive design)
- `.github/instructions/08-input-controls.instructions.md` (Input controls)
- `.github/instructions/09-wcag-accessibility.instructions.md` (Accessibility)
- `.github/instructions/11-performance.instructions.md` (Performance)
- `.github/LINT-PERFORMANCE-ANALYSIS.md` (Lint findings)

---

## Next Steps

1. **Confirm priorities** with user (start with hamburger menu or full-screen modal first?)
2. **Fetch TicTacToe reference implementation** (if available in workspace)
3. **Begin hamburger menu refinement** (useDropdownBehavior hook extraction)

Proceed with selected item(s)?
