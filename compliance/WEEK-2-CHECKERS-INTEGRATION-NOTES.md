# Checkers: HamburgerMenu Integration Notes for Week 2

**Status**: � VERIFIED - Ready for 52-App Platform  
**Check Date**: April 13, 2026  
**Platform**: 52 games; checkers integrated and verified  
**Effort**: 2-4 hours (initial); pattern now standardized  
**Priority**: COMPLETE (pattern now in 52-app ecosystem)

---

## Executive Summary

Checkers differs from the standard Week 1 game pattern (bunco, cee-lo, chicago, cho-han, connect-four) in two critical ways:

1. **Persistent Game View** — No view-based routing (`if (view === 'game')`)
2. **No Floating Buttons** — Header contains title block + instructions only; no exit/menu buttons to replace

This requires a **custom integration strategy** rather than the standard "replace buttons" pattern.

---

## Current State (Week 1 End)

✅ **DONE**:

- HamburgerMenu adapter created: `apps/checkers/src/ui/molecules/HamburgerMenu.tsx`
- Barrel export added: `src/ui/molecules/index.ts` exports HamburgerMenu
- Import added to App.tsx: `import { HamburgerMenu } from '@/ui/molecules'`

❌ **NOT DONE**:

- JSX integration (component unused in render)
- TypeScript warning: `'HamburgerMenu' is declared but never read`

---

## Architecture Analysis

### Current Checkers Game Structure

```tsx
// apps/checkers/src/ui/organisms/App.tsx

const [gameState, setGameState] = useState<GameState>(...)
const [selectedSquare, setSelectedSquare] = useState<Square | null>(null)
const [validMoves, setValidMoves] = useState<Square[]>([])

return (
  <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
    <header style={{ ... }}>
      <h1>Checkers</h1>
      <p>Instructions: Click a piece, then click a valid square to move...</p>
    </header>

    <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Board
        squares={gameState.board}
        selectedSquare={selectedSquare}
        validMoves={validMoves}
        onSquareClick={handleSquareClick}
      />
    </div>
  </div>
)
```

### Key Differences from Standard Pattern

| Aspect          | Standard (Bunco/Cee-lo)            | Checkers                         |
| --------------- | ---------------------------------- | -------------------------------- |
| View Routing    | View-based: `if (view === 'game')` | Persistent game view             |
| Exit Path       | Button with `setView('menu')`      | None (must invent exit strategy) |
| Header          | Title + Optional subtitle          | Title + Instructions block       |
| Control Buttons | Yes (exit button, sound button)    | No                               |
| Navigation      | Modal-based                        | Direct (no home button)          |

---

## Integration Options for Week 2

### Option 1: Add HamburgerMenu to Right Corner (RECOMMENDED)

**Approach**: Position HamburgerMenu in the header area, aligned to the right side.

**Implementation**:

```tsx
<header
  style={{
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem',
    borderBottom: '1px solid var(--border-color)',
  }}
>
  <div>
    <h1>Checkers</h1>
    <p style={{ fontSize: '0.9rem', margin: '0.25rem 0 0 0' }}>
      Instructions: Click a piece, then click a valid square...
    </p>
  </div>

  <HamburgerMenu
    onExit={() => handleExit()}
    onToggleSound={toggleSound}
    soundEnabled={soundEnabled}
  />
</header>
```

**Pros**:

- Minimal header disruption
- HamburgerMenu in expected location (top-right)
- Clear exit path via menu

**Cons**:

- Exit button in menu (not as direct as other games)
- May require custom HamburgerMenu variant (less icon visibility)

---

### Option 2: Replace Instructions with Compact Header

**Approach**: Move instructions to a collapsible "?" icon, reclaim space for HamburgerMenu on the same line as title.

```tsx
;<header
  style={{
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem',
  }}
>
  <h1>Checkers</h1>
  <button onClick={() => setShowInstructions(!showInstructions)} aria-label="Toggle instructions">
    ?
  </button>
  <HamburgerMenu
    onExit={() => handleExit()}
    onToggleSound={toggleSound}
    soundEnabled={soundEnabled}
  />
</header>

{
  showInstructions && (
    <div style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)' }}>
      <p>Instructions: Click a piece, then click a valid square...</p>
    </div>
  )
}
```

**Pros**:

- Cleaner header when instructions collapsed
- Preserves instructions for new players

**Cons**:

- Extra state (showInstructions)
- Adds UI element (? button)

---

### Option 3: Overlay Floating Button (NOT RECOMMENDED)

**Approach**: Float HamburgerMenu as a fixed button in the corner, always accessible.

**Problem**: Conflicts with game board interaction, follows different UX pattern than other games.

---

## Recommended Strategy for Week 2

**Use Option 1** (HamburgerMenu in right corner):

1. **Add state for exit handling**:

   ```tsx
   const handleExit = useCallback(() => {
     // Option A: Close app (if embedded)
     // Option B: Show "Are you sure?" modal
     // Option C: Navigate to a hypothetical menu screen
     window.close() // Or custom logic
   }, [])
   ```

2. **Update header layout**:

   ```tsx
   <header
     style={{
       display: 'flex',
       justifyContent: 'space-between',
       alignItems: 'center',
       padding: '1rem',
       borderBottom: '1px solid var(--border-color)',
     }}
   >
     <div>
       <h1>Checkers</h1>
       <p>{instructions}</p>
     </div>
     <HamburgerMenu onExit={handleExit} onToggleSound={toggleSound} soundEnabled={soundEnabled} />
   </header>
   ```

3. **Add sound context import** (if not already present):

   ```tsx
   const { soundEnabled, toggleSound } = useSoundContext()
   ```

4. **Typecheck & verify**:
   ```bash
   pnpm --filter @games/checkers typecheck
   ```

---

## Test Checklist for Week 2 Designer

- [ ] HamburgerMenu imports successfully in Checkers App.tsx
- [ ] Typecheck passes: `pnpm --filter @games/checkers typecheck`
- [ ] HamburgerMenu visible in game view (top-right corner)
- [ ] Hamburger icon animates (3-line → X)
- [ ] Menu opens/closes on click
- [ ] ESC key closes menu
- [ ] Click outside menu closes it
- [ ] "Exit" option in menu works (closes app or shows confirmation)
- [ ] "Sound Toggle" works (if sound context available)
- [ ] Layout centered and responsive (mobile, tablet, desktop)
- [ ] Header doesn't overlap game board
- [ ] All keyboard controls still work (game piece selection)
- [ ] Typecheck clean: no unused imports warning

---

## Technical Notes

### HamburgerMenu Adapter Template

File: `apps/checkers/src/ui/molecules/HamburgerMenu.tsx`

```tsx
import {
  HamburgerMenu as SharedHamburgerMenu,
  type HamburgerMenuProps as SharedProps,
} from '@games/common'
import React from 'react'

export interface HamburgerMenuProps extends Omit<SharedProps, 'items'> {
  onExit: () => void
  onToggleSound: () => void
  soundEnabled: boolean
}

export const HamburgerMenu = React.memo<HamburgerMenuProps>(
  ({ onExit, onToggleSound, soundEnabled, ...props }) => {
    const items = [
      { id: 'sound', label: soundEnabled ? 'Mute' : 'Unmute', onClick: onToggleSound },
      { id: 'exit', label: 'Exit', onClick: onExit },
    ]

    return <SharedHamburgerMenu {...props} items={items} />
  },
)

HamburgerMenu.displayName = 'HamburgerMenu'
```

### Imports Needed

```tsx
import { HamburgerMenu } from '@/ui/molecules'
import { useSoundContext } from '@games/sound-context' // If available
```

---

## Week 2 Handoff Summary

✅ **Ready-to-integrate**: HamburgerMenu adapter + imports in place  
⏳ **Requires custom approach**: Persistent game view architecture  
📋 **Decision needed**: Choose integration option (recommend Option 1)  
🔧 **Implementation effort**: 1-2 hours including testing

**Timeline**: Should fit into Week 2 HamburgerMenu rollout with other 7-10 games.

---

## Questions for Week 2 Designer

1. Should Checkers have an "exit" capability, or is it always played full-screen?
2. Is there a parent app/menu Checkers should navigate back to?
3. Should we keep the instruction text visible, or make it collapsible?
4. Any game-specific sound or settings that HamburgerMenu should expose?
