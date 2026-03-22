# `@games/assets-shared`

Centralized shared resources for all games in the monorepo.

## Contents

### Hooks

#### `useResponsiveState()`

**Universal responsive hook** — the single entry point for all responsive/adaptive UI decisions.

Uses `useSyncExternalStore` for zero-render-waste performance. Coordinates all media-query listeners into one optimized store.

```tsx
import { useResponsiveState } from '@games/assets-shared'

const MyComponent = () => {
  const responsive = useResponsiveState()
  
  return (
    <div style={{ 
      flexDirection: responsive.isMobile ? 'column' : 'row',
      padding: responsive.contentDensity === 'compact' ? '0.75rem' : '1rem'
    }}>
      {responsive.isMobile && <p>Mobile view</p>}
    </div>
  )
}
```

**Available properties**:
- Breakpoint flags: `isXs`, `isSm`, `isMd`, `isLg`, `isXl`, `isXxl`
- Device categories: `isMobile`, `isTablet`, `isDesktop`
- Composite flags: `compactViewport`, `wideViewport`, `touchOptimized`, etc.
- Layout modes: `navMode`, `contentDensity`, `dialogMode`, `interactionMode`, `gridColumns`
- Raw capabilities: `width`, `height`, `supportsHover`, `prefersReducedMotion`, etc.

See [ResponsiveState](./src/hooks/useResponsiveState.ts) type for complete list.

#### `useSwipeGesture()`

**Touch swipe detection** with velocity-based filtering.

```tsx
import { useSwipeGesture } from '@games/assets-shared'

const GameBoard = () => {
  const swipeHandlers = useSwipeGesture({
    threshold: 50,           // Min pixels to register
    velocityThreshold: 0.3,  // Min pixels/ms
    onSwipeLeft: () => moveLeft(),
    onSwipeRight: () => moveRight(),
    onSwipeUp: () => moveUp(),
    onSwipeDown: () => moveDown(),
  })
  
  return <div {...swipeHandlers}>Game Board</div>
}
```

**Features**:
- Velocity filtering (avoids slow drags being detected as swipes)
- Primary-direction detection (avoids diagonal ambiguity)
- Long-press protection (doesn't trigger on >1000ms hold)
- Touch/mouse agnostic

#### `useDropdownBehavior()`

**Dropdown menu interactions** — handles outside-click detection, Escape key, and focus management.

```tsx
import { useDropdownBehavior } from '@games/assets-shared'
import { useRef, useState } from 'react'

const HamburgerMenu = () => {
  const [open, setOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  
  useDropdownBehavior({
    open,
    onClose: () => setOpen(false),
    triggerRef,
    panelRef,
  })
  
  return (
    <>
      <button ref={triggerRef} onClick={() => setOpen(!open)}>
        Menu
      </button>
      {open && <div ref={panelRef}>Menu content...</div>}
    </>
  )
}
```

**Behaviors**:
- Closes on Escape key
- Closes on outside click (except trigger button)
- Focus returns to trigger button after close
- Attaches listeners to document (cleaned up on unmount)

---

### Components

#### Atoms

##### `Button`

Reusable button with variants and sizes.

```tsx
import { Button } from '@games/assets-shared'

<Button variant="primary" size="md">
  Click me
</Button>
```

**Props**:
- `variant`: `'primary' | 'secondary' | 'danger'` (default: `'primary'`)
- `size`: `'sm' | 'md' | 'lg'` (default: `'md'`)
- `isLoading`: boolean (shows spinner)
- Standard HTML button attributes

##### `Icon`

SVG icon wrapper with accessibility.

```tsx
import { Icon } from '@games/assets-shared'

<Icon size="md" name="menu" ariaLabel="Open menu">
  <path d="..." />
</Icon>
```

**Props**:
- `size`: `'sm' | 'md' | 'lg'` (default: `'md'`)
- `name`: identifier for the icon
- `ariaLabel`: accessibility label
- Children: SVG path elements

##### `Card`

Container with padding, shadows, and spacing.

```tsx
import { Card } from '@games/assets-shared'

<Card elevated>
  <h2>Title</h2>
  <p>Content</p>
</Card>
```

**Props**:
- `elevated`: boolean (adds shadow)
- Standard HTML div attributes

#### Molecules

##### `FormGroup`

Label + input wrapper with error handling.

```tsx
import { FormGroup } from '@games/assets-shared'
import { useState } from 'react'

const [email, setEmail] = useState('')
const [error, setError] = useState('')

<FormGroup
  label="Email"
  required
  error={error}
  labelHtmlFor="email-input"
>
  <input
    id="email-input"
    type="email"
    value={email}
    onChange={e => setEmail(e.target.value)}
  />
</FormGroup>
```

**Props**:
- `label`: string
- `required`: boolean (shows `*`)
- `error`: string (displays error message)
- `labelHtmlFor`: id of input element
- Children: input or other form control

##### `Separator`

Divider line with consistent spacing.

```tsx
import { Separator } from '@games/assets-shared'

<div>
  <p>Section 1</p>
  <Separator />
  <p>Section 2</p>
</div>
```

**Props**:
- `variant`: `'line' | 'space'` (default: `'line'`)

---

### Sprites & Themes

#### Sprite Management

```tsx
import { getThemeSprites, preloadAllSprites } from '@games/assets-shared'

const sprites = getThemeSprites('gridline')
const backgroundUrl = sprites.background

// Preload all for a theme (for performance optimization)
await preloadAllSprites('neon-arcade')
```

#### Theme CSS

```tsx
import { createSharedThemeLoaders } from '@games/assets-shared'

const themeLoaders = createSharedThemeLoaders()
// Load theme: themeLoaders.gridline()
// Returns: CSS module object with theme classes
```

Available themes: `gridline`, `chiba-city`, `neon-arcade`, `synthwave`, `vaporwave`, `night-district`, `high-contrast`.

---

## Installation & Setup

### In a Game App

1. **Install** (workspace link—automatic):
   ```bash
   cd apps/your-game
   pnpm install
   ```

2. **Import**:
   ```tsx
   // Hooks
   import { useResponsiveState, useSwipeGesture, useDropdownBehavior } from '@games/assets-shared'
   
   // Components
   import { Button, Icon, Card, FormGroup, Separator } from '@games/assets-shared'
   
   // Or scoped imports:
   import { Button } from '@games/assets-shared/components'
   import { useResponsiveState } from '@games/assets-shared/hooks'
   ```

3. **Use in components** (no setup required, just import and use)

---

## Contributing

To add new shared resources:

1. **Validate it's truly shared** — used in >1 app, no app-specific logic
2. **Add to appropriate directory**:
   - Hooks: `src/hooks/`
   - Atoms: `src/components/atoms/`
   - Molecules: `src/components/molecules/`
3. **Export from barrel** (`index.ts` in that directory)
4. **Export from main** (`src/index.ts`)
5. **Update package.json** `exports` if adding a new export path
6. **Test** in consuming app via workspace link

---

## Performance Notes

- **`useResponsiveState`** uses `useSyncExternalStore` for zero-render-waste subscriptions
- **`useSwipeGesture`** uses `useCallback` to prevent handler re-creation
- **Components** are memoized with `forwardRef` for fine-grained control
- **CSS Modules** scoped to prevent class name collisions

---

## Theming

All components support CSS variables for theming:

```css
--color-primary: #0087be
--color-secondary: #f5f5f5
--color-danger: #d32f2f
--color-text: #333
--color-border: #e0e0e0
--color-surface: white
```

Define these in your app's theme CSS to customize component appearance.

---

## Accessibility

All components include:
- Proper semantic HTML (buttons, labels, form elements)
- ARIA attributes where needed (aria-label, aria-expanded, aria-haspopup)
- Keyboard navigation support (Tab, Escape, Enter)
- Focus management (focus traps, focus restoration)
- Touch-friendly sizes (≥44px targets on mobile)
- High contrast support (`prefers-color-scheme`)

Tested to **WCAG 2.1 AA** standard.

---

## Responsive Design

All components support the 5-tier semantic device architecture:

| Tier | Range | Strategy |
|------|-------|----------|
| Mobile | <600px | Touch-optimized, single-column |
| Tablet | 600–899px | Multi-column, balanced spacing |
| Desktop | 900–1199px | Full-featured, spacious |
| Widescreen | 1200–1799px | Extra spacing, premium details |
| Ultrawide | 1800px+ | Maximum refinement |

Components automatically adapt via `useResponsiveState()` and CSS media queries.

---

## See Also

- [MIGRATION.md](./MIGRATION.md) — Step-by-step guide to migrate apps to shared resources
- [AGENTS.md § 21](./../../AGENTS.md#%c2%a7-21-detailed-project-structure--file-organization-governance) — Component organization rules
- [AGENTS.md § 12](./../../AGENTS.md#%c2%a7-12-responsive-design--device-aware-ui-governance) — Responsive design governance
