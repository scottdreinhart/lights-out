# Hook & Component Consolidation Migration Guide

## Overview

This guide helps you migrate from locally-defined hooks and components to the shared `@games/assets-shared` package.

**Timeline**: 
- Week 1: New shared hooks/components live in `@games/assets-shared`
- Week 2-3: Gradual migration of apps to use shared versions
- Week 4: Cleanup and removal of local duplicates

**Shared Resources Included**:

### Hooks
- `useResponsiveState` — Single entry point for all responsive UI decisions (replaces ad-hoc `matchMedia` or custom responsive hooks)
- `useSwipeGesture` — Cross-device swipe detection (replaces local swipe implementations)
- `useDropdownBehavior` — Dropdown/menu interactions with focus management and Escape handling

### Components
- **Atoms**: `Button`, `Icon`, `Card` — Reusable primitives
- **Molecules**: `FormGroup`, `Separator` — Common component compositions

---

## Migration Decision Tree

```
Is this hook/component used in >1 app?
├─ YES → Migrate to @games/assets-shared
└─ NO → Keep local (app-specific logic, don't over-share)

Is this hook/component generic (no app-specific logic)?
├─ YES → Consider sharing
└─ NO → Keep local or abstract the app-specific parts

Is this hook/component framework-agnostic (React-only, no domain logic)?
├─ YES → Good candidate for sharing
└─ NO → Move domain logic to @/domain, keep React wrapper local
```

---

## Step-by-Step Migration

### Phase 1: Install Dependencies (One-Time)

Your app already has access to `@games/assets-shared` via the monorepo workspace. No `pnpm add` needed—pnpm automatically resolves workspace dependencies.

**Verify access**:
```bash
cd apps/your-game
# pnpm ls @games/assets-shared should show it in the tree
pnpm ls @games/assets-shared
```

### Phase 2: Replace Local Hooks

#### Example: `useResponsiveState`

**Before** (local hook):
```tsx
// apps/your-game/src/app/useResponsiveState.ts
const useResponsiveState = () => {
  const [state, setState] = useState<ResponsiveState>(...)
  useEffect(() => {
    // custom matchMedia listeners
  }, [])
  return state
}

// apps/your-game/src/ui/organisms/GameBoard.tsx
import { useResponsiveState } from '@/app'
const responsive = useResponsiveState()
```

**After** (shared hook):
```tsx
// apps/your-game/src/ui/organisms/GameBoard.tsx
import { useResponsiveState } from '@games/assets-shared'
const responsive = useResponsiveState()
```

**Action**: 
1. Remove `src/app/useResponsiveState.ts`
2. Update import to `import { useResponsiveState } from '@games/assets-shared'`
3. If you exported from `src/app/index.ts`, remove that re-export
4. Verify same behavior in the app

#### Example: `useSwipeGesture`

**Before**:
```tsx
import { useSwipeGesture as useLocalSwipe } from '@/app'

const GameBoard = () => {
  const handlers = useLocalSwipe({ onSwipeLeft: () => {...}, ... })
  return <div {...handlers}>...</div>
}
```

**After**:
```tsx
import { useSwipeGesture } from '@games/assets-shared'

const GameBoard = () => {
  const handlers = useSwipeGesture({ onSwipeLeft: () => {...}, ... })
  return <div {...handlers}>...</div>
}
```

**Action**:
1. Replace local `useSwipeGesture.ts` or remove if app-specific version isn't needed
2. Update import in components using swipe
3. Test swipe behavior on mobile/touch devices

#### Example: `useDropdownBehavior`

**Before**:
```tsx
import { useDropdownBehavior } from '@/app'

const HamburgerMenu = () => {
  const menuRef = useRef(null)
  const btnRef = useRef(null)
  useDropdownBehavior({ open, onClose, triggerRef: btnRef, panelRef: menuRef })
  // ...
}
```

**After**:
```tsx
import { useDropdownBehavior } from '@games/assets-shared'

const HamburgerMenu = () => {
  // (same usage—no change)
}
```

**Action**:
1. Replace local `useDropdownBehavior.ts` with import from shared
2. No code changes needed if interface is compatible

### Phase 3: Replace Local Components

#### Example: Replace `Button` Atom

**Before** (local button):
```tsx
// apps/your-game/src/ui/atoms/Button.tsx
export const Button: React.FC<ButtonProps> = ({ ... }) => {...}

// apps/your-game/src/ui/atoms/index.ts
export { Button } from './Button'
```

**After** (use shared):
```tsx
// Remove apps/your-game/src/ui/atoms/Button.tsx

// apps/your-game/src/ui/atoms/index.ts
export { Button } from '@games/assets-shared/components'
```

**In organisms/molecules using Button**:
```tsx
// Before
import { Button } from '@/ui/atoms'

// After (no change needed—still imports from @/ui/atoms via re-export)
import { Button } from '@/ui/atoms'
```

**Action**:
1. Remove local `Button.tsx` and `Button.module.css`
2. Re-export from shared in your `@/ui/atoms/index.ts`:
   ```tsx
   export { Button } from '@games/assets-shared/components'
   ```
3. Keep local `@/ui/atoms/index.ts` as a re-export barrel for app-local atoms

#### Example: Replace `Card` Atom

Same pattern as Button:
1. Remove local `Card.tsx` and `Card.module.css`
2. Re-export: `export { Card } from '@games/assets-shared/components'`

#### Example: Replace `FormGroup` Molecule

**Before**:
```tsx
// apps/your-game/src/ui/molecules/FormGroup.tsx
export const FormGroup: React.FC<FormGroupProps> = ({ ... }) => {...}
```

**After**:
```tsx
// apps/your-game/src/ui/molecules/index.ts
export { FormGroup } from '@games/assets-shared/components'
```

**Action**:
1. Remove local `FormGroup.tsx` and `FormGroup.module.css`
2. Re-export from shared in `@/ui/molecules/index.ts`

### Phase 4: Update App Barrel Exports

**Before** (if you exported renamed/aliased components):
```tsx
// apps/your-game/src/ui/atoms/index.ts
export { Button as GameButton } from './Button'
```

**After**:
```tsx
// Either:
// Option A: Remove if aliases aren't needed (recommended)
// (No re-export needed, just use Button directly)

// Option B: Keep alias if app code depends on it (re-export from shared)
export { Button as GameButton } from '@games/assets-shared/components'
```

---

## Testing Checklist (Per App)

### Desktop Testing
- [ ] All buttons render and respond to clicks
- [ ] Responsive hook detects breakpoints correctly at 375/600/900/1200/1800px
- [ ] Hovering over buttons shows hover state (desktop only)
- [ ] Touch fallback works (no hover animations on touch)
- [ ] Form groups display labels and error messages

### Mobile Testing
- [ ] Buttons are touch-sized (≥44px)
- [ ] Swipe left/right/up/down triggers expected actions
- [ ] Hamburger menu opens/closes with Escape and outside-click
- [ ] Dropdown menu focus management works (Tab, focus returns after close)
- [ ] No console errors about missing hooks

### Responsive Testing
- [ ] Content density adjusts (compact/comfortable/spacious) per viewport
- [ ] Spacing and padding scale appropriately per breakpoint
- [ ] Cards and sections maintain readability at all tiers

---

## Troubleshooting

### Import Errors
**Error**: `Cannot find module '@games/assets-shared'`
- **Fix**: Check that pnpm workspace is set up (`pnpm-workspace.yaml` includes `packages/*`)
- **Verify**: Run `pnpm install` from repo root to refresh workspace links

### Type Errors
**Error**: `ResponsiveState does not have property X`
- **Fix**: Check TypeScript version matches shared package types
- **Verify**: Shared types are correctly exported from `@games/assets-shared/hooks`

### Styling Mismatch
**Error**: Buttons/cards look different after migration
- **Fix**: Check CSS variables (e.g., `--color-primary`) are defined in your app's theme
- **Verify**: Review `Button.module.css` and ensure theme variables match your app's design tokens

### Responsive Not Updating
**Error**: `useResponsiveState()` doesn't update on window resize
- **Fix**: Verify `useSyncExternalStore` subscription is active (not SSR-only)
- **Verify**: No custom `matchMedia()` calls are conflicting with shared hook

---

## When NOT to Migrate

Keep hooks/components local if:

1. **App-specific logic** — Doesn't make sense elsewhere
   - Example: Game board logic specific to Lights Out (not used by other games)
   - Keep in: `src/domain/` (business logic) or `src/ui/organisms/` (game UI)

2. **Unique styling** — Tightly coupled to app theme/branding
   - Example: Custom button style for a specific game aesthetic
   - Keep in: `src/ui/atoms/` (local version)
   - Share the base behavior if useful, but keep specialized CSS local

3. **Performance-critical overrides** — App needs different defaults
   - Example: Custom responsive breakpoints (game-specific)
   - Keep in: Local `src/app/useResponsiveState.ts` override, but inherit from shared baseline

---

## Full Migration Checklist Per App

### Prep
- [ ] Audit which hooks/components are candidates for sharing
- [ ] Document any app-specific customizations (styling, behavior)
- [ ] Create branch for migration work

### Execute
- [ ] Remove local `useResponsiveState.ts` if using shared
- [ ] Remove local `useSwipeGesture.ts` if using shared
- [ ] Remove local `useDropdownBehavior.ts` if using shared
- [ ] Remove local `Button.tsx`, `Icon.tsx`, `Card.tsx` (atoms)
- [ ] Remove local `FormGroup.tsx`, `Separator.tsx` (molecules)
- [ ] Update barrel imports in `@/ui/atoms/index.ts` and `@/ui/molecules/index.ts`
- [ ] Update `src/app/index.ts` to remove hook re-exports (if shared)
- [ ] Run `pnpm lint`, `pnpm typecheck`, `pnpm build` from app directory

### Test
- [ ] Desktop: Click buttons, hover states, responsive
- [ ] Mobile: Touch buttons, swipe gestures, menu interactions
- [ ] Responsive: Test all 5 breakpoints
- [ ] No type errors or console warnings

### Cleanup
- [ ] Remove unused imports from `package.json` (if any)
- [ ] Update documentation/README if references old patterns
- [ ] Commit with message: "refactor: migrate to shared hooks/components from @games/assets-shared"

---

## Example: Migrating a Game App Step-by-Step

### App: tictactoe

**Initial state**:
- Uses local `useResponsiveState.ts`, `useSwipeGesture.ts`
- Uses local `Button.tsx`, `FormGroup.tsx`

**Migration**:

```bash
cd apps/tictactoe

# 1. Remove local hooks
rm src/app/useResponsiveState.ts src/app/useSwipeGesture.ts

# 2. Remove local components (atoms & molecules)
rm src/ui/atoms/Button.tsx src/ui/atoms/Button.module.css
rm src/ui/molecules/FormGroup.tsx src/ui/molecules/FormGroup.module.css

# 3. Update barrel exports (src/ui/atoms/index.ts)
# Add: export { Button, Icon, Card } from '@games/assets-shared/components'

# 4. Update barrel exports (src/ui/molecules/index.ts)
# Add: export { FormGroup, Separator } from '@games/assets-shared/components'

# 5. Update app/index.ts
# Remove re-exports of removed hooks

# 6. Verify imports in components still work
# (No changes needed—still import from @/ui/atoms, @/ui/molecules)

# 7. Test
pnpm lint
pnpm typecheck
pnpm build

# 8. Run in dev mode
pnpm start
# Test desktop, mobile, responsive
```

**Result**: App now uses shared hooks/components; local files removed; no functional changes to game behavior.

---

## Gradual Rollout Strategy

To avoid breaking changes:

1. **Week 1**: Shared hooks/components go live in `@games/assets-shared`
2. **Week 2**: First app migrates (e.g., TicTacToe) — validates approach
3. **Week 3**: Next 2-3 apps migrate — iterate on any issues
4. **Week 4**: Remaining apps migrate or deprecate local duplicates
5. **Week 5**: Final audit and documentation

**Parallel work**: Keep local versions for 1-2 sprints (no force removal) to allow gradual adoption.

---

## Questions?

Refer to:
- [AGENTS.md § 21: Detailed Project Structure & File Organization](./../../AGENTS.md) — Component organization rules
- [AGENTS.md § 12: Responsive Design Governance](./../../AGENTS.md) — 5-tier device architecture
- [AGENTS.md § 13: Menu & Settings Architecture](./../../AGENTS.md) — Dropdown/hamburger patterns
- Component source: `packages/assets-shared/src/components/` and `packages/assets-shared/src/hooks/`
