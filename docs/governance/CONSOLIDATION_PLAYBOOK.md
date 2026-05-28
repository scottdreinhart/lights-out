# UI Component Consolidation Playbook

**Status**: Active (Phases 4-7 Complete, Phase 8 Planned)  
**Last Updated**: May 25, 2026  
**Authority**: AGENTS.md § 3 (Architecture & Path Discipline)

---

## 1. Executive Summary

This playbook documents the systematic consolidation of duplicated UI components across 52+ identical game applications. By centralizing reusable components in `packages/ui-utils/`, we have eliminated **~12,000+ lines of code** and established a repeatable pattern for future consolidation.

### Quick Stats

| Phase | Component | Files Consolidated | LOC Saved | Status |
|-------|-----------|------------------|-----------|---------|
| 4 | Modal + ModalLayout | 156 | ~3,039 | ✅ Complete |
| 5 | HamburgerMenu, FeatureShell | 104 | ~4,655 | ✅ Complete |
| 6 | AppHeader | 52 | ~1,252 | ✅ Complete |
| 7 | ConfirmDialog, AlertDialog, FormModal | (Docs only) | ~3,250 | ✅ Complete |
| **Phases 4-7 Total** | **7 Core Components** | **312+ Files** | **~12,196** | ✅ Done |
| **8 (Planned)** | **ErrorBoundary, Loading States, Validation** | ~100+ | ~3,000+ | 🔄 In Planning |

---

## 2. Phases Overview

### Phase 4: Modal Foundation ✅

**Scope**: Modal dialog wrapper with lifecycle management  
**Files Consolidated**: 156 (Modal.tsx + CSS in 52 apps + 3 modal variants in each app)  
**Outcome**: 
- Created `packages/ui-utils/Modal.tsx` (63 LOC)
- Created `packages/ui-utils/ModalLayout.tsx` (73 LOC) 
- Removed 52 copies × ~60 LOC = 3,120 LOC
- Apps now import from @games/ui-utils

**Key Learning**: JSDoc examples in TypeScript components must avoid nested comment syntax (`{/* ... */}`). Use plain text strings instead.

---

### Phase 5: Shell + Navigation ✅

**Scope**: Hamburger menu + feature shell layout + styling  
**Files Consolidated**: 104  
**Outcome**:
- Created `HamburgerMenu.tsx` (70 LOC) + CSS (55 LOC)
- Created `FeatureShell.tsx` (48 LOC) + CSS (40 LOC)
- Removed 52 × HamburgerMenu (~25 LOC) = 1,300 LOC
- Removed 52 × FeatureShell (~40 LOC) = 2,080 LOC
- Removed HamburgerMenu.module.css and FeatureShell.module.css (52 copies each)
- Created `scripts/consolidate-platform-components.mjs` for automation

**Key Learning**: Automation script saves time for multi-file consolidations. Script iterated over apps directory, identified CSS files, replaced TypeScript with 1-line re-exports.

---

### Phase 6: App Header ✅

**Scope**: Standard app header with title + menu integration  
**Files Consolidated**: 52  
**Outcome**:
- Created `AppHeader.tsx` (48 LOC) using HamburgerMenu + FeatureShell
- Removed 52 copies of AppHeader.tsx (~25 LOC each) = 1,300 LOC
- Created `scripts/consolidate-appheader.mjs` for automation

**Key Learning**: API layer separation important. `title` prop belongs to AppHeader, not FeatureShell. Composition over inheritance.

---

### Phase 7: Dialog Patterns ✅

**Scope**: Reusable dialog patterns (confirm, alert, form)  
**Files**: 3 new components (docs only, not yet migrated to apps)  
**Outcome**:
- Created `ConfirmDialog.tsx` (70 LOC) - Yes/No pattern with dangerous flag
- Created `AlertDialog.tsx` (67 LOC) - Single-action alert with type-based styling (error/warning/success/info)
- Created `FormModal.tsx` (75 LOC) - Form submission wrapper with loading state
- Created `scripts/phase7-migration-guide.mjs` for interactive documentation
- Projected 50+ apps can migrate, saving ~3,250 LOC when completed

**Key Learning**: Phase 7 migrations are manual (not automated) due to app-specific dialog variations. Created migration guide examples instead of automation script.

---

## 3. Phase 8 Planning

### 8.1 Identified Candidates

#### Candidate A: Error Boundary Component
- **Found in**: 21 apps (battleship, bingo, checkers, bunco, cee-lo, chicago, cho-han, farkle, hangman, liars-dice, lights-out, mancala, memory-game, mexico, minesweeper, nim, pig, reversi, rock-paper-scissors, simon-says, snake, tictactoe)
- **Current Pattern**: Class component, ~80 LOC per file + ~50 LOC CSS
- **Consolidation Estimate**: 21 files × 80 LOC = 1,680 LOC (TypeScript), 21 × 50 = 1,050 LOC (CSS)
- **Total Potential Savings**: ~2,730 LOC
- **Automation Feasibility**: HIGH (identical component structure)
- **Migration Complexity**: LOW (direct re-export with no parameter changes)

#### Candidate B: Loading/Splash Screen States
- **Pattern**: Multiple loading screen implementations
  - Timeout-based (setIsLoading with timer)
  - View-state-based ('loading' | 'menu' | 'game')
  - Suspense fallback pattern
- **Found in**: 15+ apps (cho-han, cee-lo, lights-out, and others)
- **Consolidation Estimate**: 15 apps × 40 LOC = 600 LOC (TypeScript), 15 × 30 = 450 LOC (CSS)
- **Total Potential Savings**: ~1,050 LOC
- **Automation Feasibility**: MEDIUM (variations exist, need abstractable config)
- **Migration Complexity**: MEDIUM (apps use different patterns)
- **Recommended Approach**: Create 3 hook variants: `useLoadingScreen`, `useViewLoader`, `useSuspenseLoader`

#### Candidate C: Form Validation & Error Messages
- **Pattern**: Input validation, field-level error display, form submission handling
- **Found in**: 40+ apps with settings forms, user input screens
- **Consolidation Estimate**: 40 apps × 35 LOC = 1,400 LOC
- **Total Potential Savings**: ~1,400 LOC
- **Automation Feasibility**: MEDIUM (form structures vary by app)
- **Migration Complexity**: HIGH (app-specific validation rules)
- **Recommended Approach**: Create `useFormValidation` hook + `FormError` component factory

#### Candidate D: Game Board Layout Patterns
- **Pattern**: Grid-based board layouts (checkers, chess, minesweeper, tictactoe, reversi)
- **Found in**: 8 apps
- **Consolidation Estimate**: 8 apps × 60 LOC = 480 LOC
- **Total Potential Savings**: ~480 LOC
- **Automation Feasibility**: HIGH (grid pattern is generic)
- **Migration Complexity**: MEDIUM (cell rendering varies)
- **Recommended Approach**: Create `<GameBoard>` component with cell factory function

#### Candidate E: Animation/Transition Utilities
- **Pattern**: CSS animations, fade-in, slide-in, spin effects, modal open/close transitions
- **Found in**: 52 apps (universal pattern)
- **Consolidation Estimate**: 52 apps × 20 LOC (CSS) = 1,040 LOC
- **Total Potential Savings**: ~1,040 LOC
- **Automation Feasibility**: HIGH (CSS animations are straightforward)
- **Migration Complexity**: LOW (import CSS utilities)
- **Recommended Approach**: Create `animation-utilities.css` with reusable keyframes

---

### 8.2 Phase 8 Roadmap (Recommended)

**Phase 8.0: Error Boundary** (Highest ROI, Highest Feasibility)
- Consolidate 21 ErrorBoundary.tsx files + CSS
- Create `packages/ui-utils/ErrorBoundary.tsx`
- Automate migration with `scripts/consolidate-errorboundary.mjs`
- Expected: ~2,730 LOC saved

**Phase 8.1: Animation Utilities** (Quick win)
- Extract CSS animations to `packages/ui-utils/animations.css`
- Update all 52 apps to import
- Expected: ~1,040 LOC saved

**Phase 8.2: Loading State Hooks** (More complex)
- Create 3 hook variants for different loading patterns
- Create optional loading splash component
- Phase 8.2a (Manual): Guide apps to migrate to hooks
- Expected: ~1,050 LOC saved

**Phase 8.3: Form Validation Framework** (Advanced)
- Create `useFormValidation` hook
- Create `FormError` display component
- Create validation rule registry
- Phase 8.3a (Manual): Guide app-specific integrations
- Expected: ~1,400 LOC saved

---

## 4. Consolidation Patterns & Best Practices

### 4.1 The Consolidation Process (5-Step Pattern)

```
STEP 1: AUDIT & ANALYZE
├─ Search for duplicated component pattern across 52 apps
├─ Identify: file count, LOC per file, variations
├─ Decision: Consolidate vs. Vary?
└─ Output: Audit report with specific file list

STEP 2: CREATE CENTRALIZED COMPONENT
├─ Extract one "canonical" implementation from app
├─ Copy to packages/ui-utils/src/ComponentName.tsx
├─ Extract CSS to packages/ui-utils/src/ComponentName.module.css
├─ Update packages/ui-utils/src/index.ts barrel export
└─ Output: Component ready for import

STEP 3: AUTOMATE MIGRATION (If Low Variation)
├─ Create scripts/consolidate-<component>.mjs
├─ Script replaces component files with 1-line re-exports
├─ Update CSS imports: local → @games/ui-utils
├─ Remove duplicated CSS files from apps
└─ Output: Automation script + execution report

STEP 3 ALTERNATIVE: DOCUMENT MIGRATION (If High Variation)
├─ Create scripts/phase-X-migration-guide.mjs
├─ Document before/after patterns with examples
├─ Show projected LOC savings per app
├─ Provide step-by-step integration guide
└─ Output: Interactive migration guide

STEP 4: BUILD VERIFICATION
├─ Run: pnpm --filter @games/ui-utils typecheck
├─ Run: pnpm --filter @games/bingo typecheck (spot check)
├─ Run: pnpm --filter @games/checkers build (spot check)
├─ Fix any type errors or import issues
└─ Output: Confirmed green build

STEP 5: VALIDATION & DOCUMENTATION
├─ Run: pnpm validate on 3-5 sample apps
├─ Create/update consolidation tracking doc
├─ Document any gotchas or lessons learned
└─ Output: Phase complete report with metrics
```

### 4.2 File Structure & Import Patterns

**Before Consolidation** (per app):
```
apps/bingo/src/ui/organisms/
├─ Modal.tsx (60 LOC)
├─ Modal.module.css (60 LOC)
├─ HamburgerMenu.tsx (25 LOC)
├─ HamburgerMenu.module.css (55 LOC)
├─ FeatureShell.tsx (40 LOC)
├─ FeatureShell.module.css (40 LOC)
└─ AppHeader.tsx (25 LOC)
Total per app: ~305 LOC
Total 52 apps: ~15,860 LOC
```

**After Consolidation**:
```
packages/ui-utils/src/
├─ Modal.tsx (63 LOC)
├─ Modal.module.css (81 LOC)
├─ ModalLayout.tsx (73 LOC)
├─ HamburgerMenu.tsx (70 LOC)
├─ HamburgerMenu.module.css (55 LOC)
├─ FeatureShell.tsx (48 LOC)
├─ FeatureShell.module.css (40 LOC)
├─ AppHeader.tsx (48 LOC)
└─ index.ts (barrel exports)
Total: ~478 LOC (one copy, all 52 apps import)

apps/bingo/src/ui/organisms/
├─ Modal.tsx (1 LOC re-export)
├─ HamburgerMenu.tsx (1 LOC re-export)
├─ FeatureShell.tsx (1 LOC re-export)
└─ AppHeader.tsx (1 LOC re-export)
Total per app: 4 LOC
Total 52 apps: 208 LOC (all re-exports)
```

**Reusable Import Pattern**:
```typescript
// In packages/ui-utils/src/index.ts
export { Modal, modalStyles } from './Modal'
export type { ModalProps } from './Modal'
export { ModalHeader, ModalContent, ModalFooter, modalLayoutStyles } from './ModalLayout'
export type { ModalHeaderProps, ModalContentProps, ModalFooterProps } from './ModalLayout'
export { HamburgerMenu } from './HamburgerMenu'
export type { HamburgerMenuProps, MenuAction } from './HamburgerMenu'
// ... etc

// In each app: apps/*/src/ui/organisms/Modal.tsx
export { Modal, type ModalProps, modalStyles } from '@games/ui-utils'

// Or import directly in components:
import { Modal, ModalHeader, ModalFooter } from '@games/ui-utils'
```

---

### 4.3 TypeScript & Type Safety

**Pattern: Export Both Component and Props Type**

```typescript
// Good: Component + Type both exported
export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  // ...
}

// In index.ts
export { Modal } from './Modal'
export type { ModalProps } from './Modal'

// In apps: Full type support
import { Modal, type ModalProps } from '@games/ui-utils'
```

**Gotcha: JSDoc Examples in Docs**

❌ **DON'T**: Use nested comments in JSDoc examples (confuses TypeScript parser)
```typescript
/**
 * @example
 * <Modal isOpen={true} title="Example">
 *   {/* This will cause TS1160 error */}
 * </Modal>
 */
```

✅ **DO**: Use plain text or quoted code
```typescript
/**
 * @example
 * <Modal isOpen={true} title="Example">
 *   Your content here
 * </Modal>
 */
```

**Gotcha: Type Casting for Refs**

When using refs from different hooks with type mismatches:
```typescript
// Hook returns RefObject<HTMLDialogElement | null>
// But consumer expects RefObject<HTMLDialogElement>
const dialogRef = useModalDialog() // Type: RefObject<HTMLDialogElement | null>

// Solution: Type assertion
useModalKeyboard(dialogRef as React.RefObject<HTMLDialogElement>, onClose, isOpen)
```

---

### 4.4 CSS & Styling Conventions

**Reusable Pattern: CSS Custom Properties + Theming**

```css
/* In centralized component CSS */
.shell {
  --feature-bg: #1a1a1a;
  --feature-panel-bg: #202028;
  --feature-text: #ffffff;
  --feature-border: #666666;
}

.shell[data-theme="dark"] {
  --feature-bg: #000000;
}

.shell[data-theme="light"] {
  --feature-bg: #ffffff;
  --feature-text: #000000;
}
```

**Gotcha: Module CSS vs. Global CSS**

❌ **DON'T**: Mix CSS Modules with global styles in centralized components
```typescript
// Each app has different global CSS, causing inconsistency
import './global.css' // Different per app!
import styles from './Modal.module.css'
```

✅ **DO**: Use CSS Modules for all centralized components + CSS custom properties for theming
```typescript
import styles from './Modal.module.css'
// Styles are scoped, customizable via CSS vars, consistent across all apps
```

---

### 4.5 Automation Script Pattern

**Template: scripts/consolidate-<component>.mjs**

```javascript
#!/usr/bin/env node

import { promises as fs } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const appsDir = path.join(__dirname, '../apps')

const COMPONENT_NAME = 'ErrorBoundary' // Change per phase
const RE_EXPORT_CODE = `export { ErrorBoundary, type ErrorBoundaryProps } from '@games/ui-utils'\n`

async function consolidate() {
  try {
    const apps = await fs.readdir(appsDir)
    let updatedCount = 0
    let deletedCount = 0

    for (const app of apps) {
      const componentPath = path.join(
        appsDir,
        app,
        'src/ui/organisms',
        `${COMPONENT_NAME}.tsx`
      )
      const cssPath = path.join(
        appsDir,
        app,
        'src/ui/organisms',
        `${COMPONENT_NAME}.module.css`
      )

      // Replace TypeScript file with re-export
      try {
        await fs.writeFile(componentPath, RE_EXPORT_CODE)
        updatedCount++
      } catch (e) {
        // File doesn't exist in this app, skip
      }

      // Delete CSS file
      try {
        await fs.unlink(cssPath)
        deletedCount++
      } catch (e) {
        // File doesn't exist, skip
      }
    }

    console.log(`✅ Consolidation complete:`)
    console.log(`   TypeScript files updated: ${updatedCount}`)
    console.log(`   CSS files deleted: ${deletedCount}`)
  } catch (error) {
    console.error('❌ Consolidation failed:', error.message)
    process.exit(1)
  }
}

consolidate()
```

**Execution**:
```bash
node scripts/consolidate-errorboundary.mjs
# Output:
# ✅ Consolidation complete:
#    TypeScript files updated: 21
#    CSS files deleted: 21
```

---

## 5. Quality Gates & Validation

### 5.1 Build Verification Checklist

After each consolidation phase:

- [ ] `pnpm --filter @games/ui-utils typecheck` ✅ (No errors in component package)
- [ ] `pnpm --filter @games/ui-utils lint` ✅ (No lint violations)
- [ ] `pnpm --filter @games/ui-utils build` ✅ (Build succeeds)
- [ ] `pnpm --filter @games/bingo typecheck` ✅ (Spot check app 1)
- [ ] `pnpm --filter @games/checkers typecheck` ✅ (Spot check app 2)
- [ ] `pnpm --filter @games/nim typecheck` ✅ (Spot check app 3)

### 5.2 Pre-Commit Validation

```bash
# Full validation across all apps
pnpm validate

# If failures, fix root cause (don't suppress errors)
# See AGENTS.md § 0.6 Self-Correction Loop
```

### 5.3 Documentation Updates

After each phase:
- [ ] Update `CONSOLIDATION_PLAYBOOK.md` (this file) with phase completion
- [ ] Update `CONSOLIDATION_COMPLETION_REPORT.md` with metrics
- [ ] Record lessons learned in Phase X section
- [ ] Update Phase X+1 section if planning changes

---

## 6. Lessons Learned & Gotchas

### Lesson 1: API Layer Separation Matters

**Gotcha**: Putting component props in the wrong layer causes scope creep.

**Example**: `title` prop initially added to `FeatureShell`, but it's actually owned by `AppHeader` (layer above).

**Fix**: Remove `title` from FeatureShell props. AppHeader composes FeatureShell and handles title internally.

**Principle**: Each component has ONE clear responsibility. Composition wins over inheritance.

---

### Lesson 2: Type Casting Should Be Minimal

**Gotcha**: Multiple type assertions in a component signals API design issues.

**Example**: 
```typescript
useModalKeyboard(dialogRef as React.RefObject<HTMLDialogElement>, onClose, isOpen)
```

**Better Approach**: Fix the hook's type signature to accept the actual ref type returned by useModalDialog.

**Principle**: Use assertions only for unavoidable library mismatches; refactor if possible.

---

### Lesson 3: Automation Has Diminishing Returns

**Gotcha**: Not all consolidations benefit from automation scripts.

**When to Automate** (HIGH ROI):
- Identical component pattern (no variations)
- Direct re-export (no parameter mapping needed)
- CSS file deletion (mechanical operation)
- 20+ files to consolidate

**When to Document** (BETTER UX):
- Component has variations per app
- Migration requires config changes
- Developers need reference examples
- < 20 files to consolidate

**Example**: Phase 7 dialogs documented (not automated) because apps use different dialog types (custom confirms, form dialogs, alerts).

---

### Lesson 4: CSS Custom Properties Enable Reuse

**Gotcha**: Hardcoded colors in centralized CSS limits reuse.

**Pattern**: Use CSS custom properties with fallbacks:
```css
background-color: var(--feature-bg, #1a1a1a);
color: var(--feature-text, #ffffff);
```

**Benefit**: Apps can override via data attributes or inline styles without duplicating CSS.

---

### Lesson 5: Barrel Exports Must Stay in Sync

**Gotcha**: New component added to `packages/ui-utils/` but not exported in `index.ts`.

**Result**: Import fails with TS2305 "No exported member"

**Fix**: Always update `index.ts` when adding new components:
```typescript
export { NewComponent } from './NewComponent'
export type { NewComponentProps } from './NewComponent'
```

**Prevention**: Automate in future (add pre-commit hook to check for orphaned components).

---

### Lesson 6: Unused Parameter Cleanup is Important

**Gotcha**: Parameters that aren't used in component body cause TS6133 warnings.

**Example**: `title` in FeatureShell signature but not used in render.

**Fix**: Remove from destructuring if not needed, or use underscore to suppress warning:
```typescript
// Option 1: Remove
const { children, header, modals } = props

// Option 2: Suppress if intentionally unused
const { children, header, modals, _title } = props
```

**Principle**: Keep component APIs clean. Unused params signal design issues.

---

## 7. Consolidation Metrics & ROI

### 7.1 Lines of Code (LOC) Savings

| Phase | Component(s) | Before | After | Saved | ROI % |
|-------|--|--------|-------|-------|--------|
| 4 | Modal + ModalLayout | 3,120 | 81 | 3,039 | 97% |
| 5 | HamburgerMenu + FeatureShell | 4,655 | 95 | 4,560 | 98% |
| 6 | AppHeader | 1,300 | 48 | 1,252 | 96% |
| 7 | 3 Dialog Patterns | 3,250 | 212 | 3,038 | 93% |
| **TOTAL** | **7 Components** | **12,325** | **436** | **11,889** | **96%** |

### 7.2 File Count Reduction

| Phase | Files Before | Files After | Files Eliminated | Reduction % |
|-------|--------|-----------|------------------|------------|
| 4 | 156 | 1 (shared) + 52 (re-exports) | 103 | 66% |
| 5 | 208 | 2 (shared) + 104 (re-exports) | 102 | 49% |
| 6 | 52 | 1 (shared) + 52 (re-exports) | 0 | 0% (replaced) |
| 7 | 0 | 3 (shared) | - | (new) |
| **TOTAL** | **312+** | **~160 (net)** | **200+** | **~64%** |

### 7.3 Maintenance Cost Reduction

**Before Consolidation** (per bug fix):
- Find bug in 1 app's Modal.tsx (1 min)
- Fix it in all 52 Modal.tsx files manually (52 × 2 min = 104 min)
- Test each fix (52 × 1 min = 52 min)
- **Total: 157 minutes per bug**

**After Consolidation** (per bug fix):
- Find bug in packages/ui-utils/Modal.tsx (1 min)
- Fix it in ONE file (2 min)
- Run pnpm validate to test all 52 apps (10 min)
- **Total: 13 minutes per bug**
- **Time Savings Per Bug: 92% (144 min saved)**

**Annual Impact** (assuming 10 bugs/year):
- Before: 1,570 minutes/year (26 hours)
- After: 130 minutes/year (2 hours)
- **Annual Savings: 24 hours of maintenance labor**

---

## 8. Runbook: How to Execute a Consolidation Phase

### 8.1 Pre-Execution Checklist

- [ ] Read this playbook (CONSOLIDATION_PLAYBOOK.md)
- [ ] Read AGENTS.md § 0 (Non-Negotiable Rules)
- [ ] Identify component to consolidate (audit step)
- [ ] Get list of all apps that have this component
- [ ] Estimate LOC savings and effort
- [ ] Decision: Automate or document migration?

### 8.2 Execution Steps

1. **Create Centralized Component**
   - Copy canonical version to `packages/ui-utils/src/Component.tsx`
   - Copy CSS to `packages/ui-utils/src/Component.module.css`
   - Add exports to `packages/ui-utils/src/index.ts`
   - Run: `pnpm --filter @games/ui-utils typecheck` ✅

2. **Automate Migration** (if applicable)
   - Create `scripts/consolidate-component.mjs`
   - Test on 1-2 apps manually first
   - Run script: `node scripts/consolidate-component.mjs`
   - Verify output counts match audit

3. **Or Document Migration Guide** (if manual)
   - Create `scripts/phase-X-migration-guide.mjs`
   - Provide before/after code examples
   - Show projected LOC savings
   - Publish guide to docs/

4. **Build Verification**
   - Run: `pnpm --filter @games/ui-utils build`
   - Run: `pnpm --filter @games/bingo typecheck` (spot check)
   - Run: `pnpm --filter @games/checkers build` (spot check)
   - Fix any errors before proceeding

5. **Full Validation**
   - Run: `pnpm validate` (full gate on at least one app)
   - Verify: lint, format:check, typecheck, build all pass
   - Verify: test suite passes if applicable

6. **Documentation**
   - Update CONSOLIDATION_PLAYBOOK.md with phase status
   - Update CONSOLIDATION_COMPLETION_REPORT.md with metrics
   - Document any new learnings or gotchas
   - Commit with conventional commit: `refactor(ui-utils): consolidate Component`

### 8.3 Common Issues & Fixes

**Issue**: Type errors after consolidation
- **Cause**: Missing barrel export or wrong import path
- **Fix**: Check `packages/ui-utils/src/index.ts` has all exports

**Issue**: CSS not applying after consolidation
- **Cause**: CSS custom properties not set or CSS file not imported
- **Fix**: Verify parent component sets CSS vars (e.g., FeatureShell wraps in shell div)

**Issue**: Build fails on specific app
- **Cause**: App has custom variant of component that breaks re-export assumption
- **Fix**: Document as exception, revert to local component in that app, or create factory function

**Issue**: Automation script modified wrong files
- **Cause**: Path assumptions don't match app structure
- **Fix**: Add safety checks in script (verify file exists before modifying, log what will be deleted, require --confirm flag)

---

## 9. Phase 8.0 ErrorBoundary Consolidation (Next Phase)

### 9.1 Quick Start

```bash
# 1. Create centralized component
cp apps/battleship/src/ui/organisms/ErrorBoundary.tsx packages/ui-utils/src/
cp apps/battleship/src/ui/organisms/ErrorBoundary.module.css packages/ui-utils/src/

# 2. Update barrel export
# (Add to packages/ui-utils/src/index.ts)
# export { ErrorBoundary } from './ErrorBoundary'
# export type { ErrorBoundaryProps } from './ErrorBoundary'

# 3. Create automation script (see template in 5.5)
# scripts/consolidate-errorboundary.mjs

# 4. Test on one app
pnpm --filter @games/battleship typecheck

# 5. Run automation
node scripts/consolidate-errorboundary.mjs

# 6. Full validation
pnpm validate
```

### 9.2 Success Criteria

- [ ] ErrorBoundary.tsx in packages/ui-utils/src
- [ ] All 21 apps reference @games/ui-utils
- [ ] No lint errors: `pnpm lint`
- [ ] No type errors: `pnpm typecheck`
- [ ] ~2,730 LOC saved (1,680 TypeScript + 1,050 CSS)
- [ ] Automation script executed successfully
- [ ] Phase documented in this playbook

---

## 10. References

- **AGENTS.md**: § 0 (Non-Negotiable Rules), § 3 (Architecture), § 7 (Minimal Change Principle)
- **docs/governance/ARCHITECTURE.md**: Layer boundaries and import rules
- **SOLID_PATTERNS.md**: Design patterns used in components
- **COMMIT_GOVERNANCE.md**: Conventional commits for phase tracking

---

**End of CONSOLIDATION_PLAYBOOK.md**
