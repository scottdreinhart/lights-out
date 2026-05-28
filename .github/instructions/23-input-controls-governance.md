# Input Controls & Keyboard Governance

**Authority**: AGENTS.md § 8 (Input Controls), § 0.A (Self-Correction Loop), § 3 (Architecture)

> **Scope**: All game applications across the repository
> **Canonical source**: `packages/app-hook-utils/src/` (hook implementations)
> **Governance file**: This document

## § 1. Input System Architecture

The game platform uses a **unified, composable input system** that separates concerns:

- **Low-level**: `useKeyboardControls` — Raw key binding and event handling
- **Mid-level**: Stateful hooks (`useInputState`, `useDirectionalInput`, `useModalKeyboard`)
- **High-level**: Game-specific action hooks (`usePuzzleControls`, `useCardGameControls`, `useTurnBasedControls`)

All hooks are exported from `@games/app-hook-utils` via barrel export.

### § 1.1 Design Principles

1. **Composition over Inheritance** — Stack hooks to build complex input handling
2. **Semantic over Raw** — Name callbacks by intent, not physical keys
3. **Prevent by Default** — Avoid form field focus conflicts automatically
4. **Testable by Design** — Callbacks are pure, injectable, and mockable
5. **Accessibility First** — All keyboard controls have mouse/touch alternatives

---

## § 2. Hook Selection Guide

### § 2.1 When to Use Each Hook

| Hook | Use Case | Example Games | Keyboard Binding Style |
|------|----------|----------------|----------------------|
| **useUnifiedInput** | Keyboard + touch + Fire TV d-pad | Multi-platform games, dice games, turn-based | Semantic (UP, DOWN, LEFT, RIGHT, SELECT, BACK, ROLL, HOLD, MENU) |
| **useKeyboardControls** | Raw key binding, custom logic | Custom utilities, adapters | Physical keys (KeyA, ArrowUp) |
| **useInputState** | Maintain discrete boolean states | platformers (jump, left, right) | Physical keys → state properties |
| **useDirectionalInput** | Movement + semantic actions | Puzzles, grid navigation | Semantic (onMove, onHint) |
| **useModalKeyboard** | Dialog/modal Escape handling | Settings, Rules, About modals | Escape key only |
| **usePuzzleControls** | Puzzle game actions | Tile puzzles, sliding puzzles | Semantic (onMove, onConfirm) |
| **useCardGameControls** | Card game actions | Blackjack, Poker | Semantic (onHit, onStand) |
| **useTurnBasedControls** | Turn-based game actions | Chess, Checkers | Semantic (onPlay, onPass) |

### § 2.2 Decision Tree

```
┌─────────────────────────────────────┐
│ What input pattern do I need?       │
└─────────────────────────────────────┘
        │
        ├─→ Need keyboard + touch + Fire TV in one?
        │   └─→ useUnifiedInput
        │
        ├─→ Modal/Dialog only?
        │   └─→ useModalKeyboard
        │
        ├─→ State-based keys (jump/left/right)?
        │   └─→ useInputState
        │
        ├─→ Grid movement + actions?
        │   ├─→ Custom behavior?
        │   │   └─→ useDirectionalInput + custom
        │   └─→ Standard puzzle pattern?
        │       └─→ usePuzzleControls
        │
        ├─→ Card game (hit/stand/double)?
        │   └─→ useCardGameControls
        │
        ├─→ Turn-based (play/pass/draw)?
        │   └─→ useTurnBasedControls
        │
        └─→ Something else entirely?
            └─→ useKeyboardControls (raw binding)
```

---

## § 3. Hook Reference

### § 3.1 useKeyboardControls

**Purpose**: Low-level key binding with automatic form field detection

**Signature**:
```typescript
useKeyboardControls(
  handler: (key: string) => void,
  options?: UseKeyboardControlsOptions
): void
```

**Behavior**:
- Automatically prevents input in text fields, textareas, content-editable elements
- Supports global blocked keys (Escape triggers default close, Tab for focus)
- Form field detection works recursively through document.activeElement

**Example**:
```tsx
function MyComponent() {
  useKeyboardControls((key) => {
    if (key === 'ArrowUp') handleMoveUp()
    if (key === 'KeyA') handleCustomAction()
  })
  return <div>...</div>
}
```

### § 3.2 useInputState

**Purpose**: Maintain a Record of boolean key states

**Signature**:
```typescript
useInputState<T extends Record<string, boolean>>(
  initialState: T,
  keyMap: Record<string, keyof T>,
  options?: UseInputStateOptions
): T
```

**Key Features**:
- Automatically handles key press → state property mapping
- Returns mutable state object that persists across renders
- Form field detection prevents accidental input capture

**Example** (platformer):
```tsx
const INPUT_MAP = {
  ArrowLeft: 'left' as const,
  KeyA: 'left' as const,
  ArrowRight: 'right' as const,
  KeyD: 'right' as const,
  Space: 'jump' as const,
}

function Platformer() {
  const inputState = useInputState(
    { left: false, right: false, jump: false },
    INPUT_MAP
  )

  // inputState.left is true while left arrow is pressed
  // inputState updates automatically on key events
  return <canvas ref={ref} />
}
```

### § 3.3 useDirectionalInput

**Purpose**: Semantic movement actions for grid/direction-based games

**Signature**:
```typescript
useDirectionalInput(
  callbacks: DirectionalInputCallbacks,
  options?: UseDirectionalInputOptions
): void
```

**Callbacks**:
```typescript
interface DirectionalInputCallbacks {
  onMove?: (direction: 'up' | 'down' | 'left' | 'right') => void
  onConfirm?: () => void
  onCancel?: () => void
  onHint?: () => void
  onReset?: () => void
}
```

**Key Bindings**:
- Movement: Arrow keys or WASD
- Confirm: Enter or Space
- Cancel: Escape
- Hint: H key
- Reset: R key

**Example** (puzzle game):
```tsx
const useZipInput = ({ canMove, makePlayerMove, clearHint }) => {
  useDirectionalInput({
    onMove: (dir) => {
      if (canMove(dir)) makePlayerMove(dir)
    },
    onHint: clearHint
  })
  return { /* component logic */ }
}
```

### § 3.4 useModalKeyboard

**Purpose**: Escape key handling for dialogs and modals

**Signature**:
```typescript
useModalKeyboard(
  ref: React.RefObject<HTMLDialogElement>,
  onClose: () => void,
  isOpen: boolean
): void
```

**Behavior**:
- Listens for Escape key when modal is open
- Calls onClose on Escape press
- Automatically focused to the modal element

**Example** (Settings modal):
```tsx
function SettingsModal({ isOpen, onClose }) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  
  useModalKeyboard(dialogRef, onClose, isOpen)

  return (
    <dialog ref={dialogRef}>
      {/* modal content */}
    </dialog>
  )
}
```

### § 3.5 usePuzzleControls

**Purpose**: High-level semantic controls for puzzle games

**Signature**:
```typescript
usePuzzleControls(
  callbacks: PuzzleControlsCallbacks,
  options?: PuzzleControlsOptions
): void
```

**Callbacks**:
```typescript
interface PuzzleControlsCallbacks {
  onMove?: (direction: 'up' | 'down' | 'left' | 'right') => void
  onConfirm?: () => void
  onHint?: () => void
  onReset?: () => void
}
```

**Key Bindings**:
- Movement: Arrow keys or WASD
- Confirm: Enter or Space
- Hint: H
- Reset: R

**Example**:
```tsx
usePuzzleControls({
  onMove: handlePlayerMove,
  onConfirm: handleSelectTile,
  onHint: showHint,
  onReset: resetLevel
})
```

### § 3.6 useCardGameControls

**Purpose**: Card game action shortcuts

**Signature**:
```typescript
useCardGameControls(
  callbacks: CardGameControlsCallbacks,
  options?: CardGameControlsOptions
): void
```

**Callbacks**:
```typescript
interface CardGameControlsCallbacks {
  onHit?: () => void          // H
  onStand?: () => void        // S
  onDouble?: () => void       // D
  onSplit?: () => void        // P
  onSurrender?: () => void    // U
  onInsurance?: () => void    // I
}
```

**Example** (Blackjack):
```tsx
useCardGameControls({
  onHit: () => handleAction('hit'),
  onStand: () => handleAction('stand'),
  onDouble: () => handleAction('double'),
})
```

### § 3.7 useTurnBasedControls

**Purpose**: Turn-based game action shortcuts

**Signature**:
```typescript
useTurnBasedControls(
  callbacks: TurnBasedGameControlsCallbacks,
  options?: TurnBasedGameControlsOptions
): void
```

**Callbacks**:
```typescript
interface TurnBasedGameControlsCallbacks {
  onPlay?: () => void       // Enter
  onPass?: () => void       // Space
  onDraw?: () => void       // D
  onDiscard?: () => void    // X
  onForfeit?: () => void    // Q
  onUndo?: () => void       // Z
}
```

**Example** (Card game):
```tsx
useTurnBasedControls({
  onPlay: executeCurrentAction,
  onPass: skipTurn,
  onDraw: drawFromDeck,
  onUndo: undoLastMove
})
```

### § 3.8 useUnifiedInput

**Purpose**: Single unified controller composing keyboard, touch, and Fire TV d-pad inputs into a single handler

**Authority**: AGENTS.md § 32 (Fire TV), § 8 (Input Controls)

**Signature**:
```typescript
useUnifiedInput(config: UnifiedInputConfig): void
```

**Config**:
```typescript
interface UnifiedInputConfig {
  onAction: (action: InputAction) => void
  includeKeyboard?: boolean    // Enable keyboard (default: true)
  includeTouch?: boolean       // Enable touch swipe (default: true)
  includeFireTV?: boolean      // Enable Fire TV keycodes (default: false)
  touchMinDistance?: number    // Swipe distance threshold in px (default: 20)
}

type InputAction =
  | 'ROLL'      // Space key
  | 'HOLD'      // Enter key
  | 'MENU'      // Escape key
  | 'UP'        // Arrow up or W
  | 'DOWN'      // Arrow down or S
  | 'LEFT'      // Arrow left or A
  | 'RIGHT'     // Arrow right or D
  | 'SELECT'    // Enter or touch/d-pad confirm
  | 'BACK'      // Escape or Fire TV back
  | 'PASS'      // P key
  | 'CONTINUE'  // C key
```

**Inputs Handled**:

| Input Method | Actions | Source |
|--------------|---------|--------|
| **Keyboard** | ROLL (Space), HOLD (Enter), MENU (Escape), UP/DOWN/LEFT/RIGHT (Arrows/WASD), PASS (P), CONTINUE (C) | useKeyboardControls |
| **Touch Swipe** | UP/DOWN/LEFT/RIGHT (4-directional swipe, MIN_SWIPE_DISTANCE=20px) | useSwipe |
| **Fire TV Remote** | UP/DOWN/LEFT/RIGHT (37-40), SELECT (13), BACK (4), PLAY_PAUSE (179), REWIND (227), FAST_FORWARD (228) | Keycodes per AGENTS.md § 32.1 |

**Behavior**:
- Automatically prevents input in text fields, textareas, and content-editable elements
- All input sources route to single `onAction` callback
- Configuration options enable/disable input sources per platform
- Touch swipe detection uses minimum distance threshold to avoid accidental triggers

**Example** (Standard keyboard + touch):
```tsx
function DiceGame() {
  const [result, setResult] = useState<number | null>(null)
  
  useUnifiedInput({
    onAction: (action) => {
      if (action === 'ROLL' || action === 'SELECT') {
        setResult(Math.floor(Math.random() * 6) + 1)
      }
      if (action === 'MENU') handleShowSettings()
    },
    includeKeyboard: true,
    includeTouch: true
  })

  return (
    <div>
      <p>Result: {result}</p>
      <button onClick={() => setResult(Math.floor(Math.random() * 6) + 1)}>
        Roll (Space or tap)
      </button>
    </div>
  )
}
```

**Example** (Fire TV with d-pad + touch):
```tsx
function FireTVGame() {
  useUnifiedInput({
    onAction: (action) => {
      switch (action) {
        case 'UP':
        case 'DOWN':
        case 'LEFT':
        case 'RIGHT':
          handleMove(action)
          break
        case 'SELECT':
          handleConfirm()
          break
        case 'BACK':
          handleExit()
          break
      }
    },
    includeKeyboard: true,
    includeTouch: false,
    includeFireTV: true  // Only enable on Fire TV
  })

  return <GameBoard />
}
```

**When to Use**:
- ✅ Games requiring keyboard + touch support
- ✅ Fire TV compatible games (with appropriate config)
- ✅ Multi-platform games that need seamless input across desktop/mobile/TV
- ❌ Modal/dialog only → Use `useModalKeyboard` instead
- ❌ State-based keys only → Use `useInputState` instead
- ❌ Game-specific semantic actions → Use `usePuzzleControls`, `useCardGameControls`, etc. instead

---

## § 4. Code Patterns

### § 4.1 Pattern: Puzzle Game

```tsx
// Bad: Raw key handling
function PuzzleGame() {
  const [position, setPosition] = useState({ row: 0, col: 0 })

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp') {
        setPosition((p) => ({ ...p, row: p.row - 1 }))
      }
      // ... many more keys
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return <div>...</div>
}

// Good: Semantic puzzle controls
function PuzzleGame() {
  const [position, setPosition] = useState({ row: 0, col: 0 })

  usePuzzleControls({
    onMove: (dir) => {
      const delta = { up: -1, down: 1, left: -1, right: 1 }
      setPosition((p) => ({
        ...p,
        [dir === 'up' || dir === 'down' ? 'row' : 'col']: 
          p[dir === 'up' || dir === 'down' ? 'row' : 'col'] + delta[dir],
      }))
    },
    onHint: showHint,
    onReset: resetLevel,
  })

  return <div>...</div>
}
```

### § 4.2 Pattern: Platformer Game

```tsx
// Bad: Manual state + event listeners
function Platformer() {
  const [keys, setKeys] = useState({ left: false, right: false, jump: false })

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      // Manual key parsing...
      setKeys((k) => ({ ...k, [mapKey(e.key)]: true }))
    }
    // ... manual cleanup
  }, [])

  return <canvas ref={ref} />
}

// Good: Declarative input state
function Platformer() {
  const inputState = useInputState(
    { left: false, right: false, jump: false },
    { ArrowLeft: 'left', KeyA: 'left', ArrowRight: 'right', KeyD: 'right', Space: 'jump' }
  )

  // inputState updates automatically
  return <canvas ref={ref} />
}
```

### § 4.3 Pattern: Modal Keyboard Handling

```tsx
// Before: Duplicate handleKeyDown logic
// (Every modal file had this)
function SettingsModal({ isOpen, onClose }) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDialogElement>) => {
    if (e.key === 'Escape') onClose()
  }

  return <dialog ref={dialogRef} onKeyDown={handleKeyDown}>...</dialog>
}

// After: Centralized hook
function SettingsModal({ isOpen, onClose }) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  useModalKeyboard(dialogRef, onClose, isOpen)

  return <dialog ref={dialogRef}>...</dialog>
}
```

---

## § 5. Best Practices

### § 5.1 DO

✅ **Use semantic action names**
```tsx
// Good
onMove: (dir) => movePlayer(dir)
onHint: () => showHint()
onConfirm: () => selectCard()

// Bad
onKeyDown: (key) => handleKey(key)
onKey: (key) => { /* complex logic */ }
```

✅ **Compose hooks vertically**
```tsx
// Good: Each hook has a clear responsibility
useDirectionalInput({ onMove })
useModalKeyboard(ref, onClose, isOpen)

// Bad: Giant monolithic hook
useCustomInput({ onKeyDown: (k) => { /* everything */ } })
```

✅ **Provide mouse/touch alternatives**
```tsx
// Good: Keyboard + button click
function Game() {
  usePuzzleControls({ onMove })
  return <button onClick={handleMove}>Move Up</button>
}

// Bad: Keyboard only
function Game() {
  usePuzzleControls({ onMove })
  return <div>{/* no alternative input */}</div>
}
```

✅ **Memoize callbacks**
```tsx
// Good
const handleMove = useCallback((dir) => {
  // logic
}, [/* dependencies */])

usePuzzleControls({ onMove: handleMove })

// Acceptable (for simple callbacks)
usePuzzleControls({ onMove: (dir) => movePlayer(dir) })
```

✅ **Use the `enabled` option for conditional input**
```tsx
// Good
usePuzzleControls(
  { onMove, onConfirm, onHint },
  { enabled: !isModalOpen && !isPaused }
)
```

### § 5.2 DON'T

❌ **Don't create raw listeners when a hook exists**
```tsx
// Bad
useEffect(() => {
  window.addEventListener('keydown', handleKeyDown)
  return () => window.removeEventListener('keydown', handleKeyDown)
}, [])

// Good
useKeyboardControls(handleKeyDown)
```

❌ **Don't mix physical key names and semantic names**
```tsx
// Bad (confusing)
interface Callbacks {
  onKeyUp?: () => void      // physical name
  onMove?: () => void       // semantic name
}

// Good (consistent)
interface Callbacks {
  onMove?: (direction) => void    // all semantic
  onConfirm?: () => void
}
```

❌ **Don't duplicate modal keyboard logic**
```tsx
// Bad (30+ files doing this)
const handleKeyDown = (e) => { if (e.key === 'Escape') onClose() }

// Good (use hook once)
useModalKeyboard(dialogRef, onClose, isOpen)
```

❌ **Don't forget form field detection**
```tsx
// Bad (captures input in text fields)
window.addEventListener('keydown', (e) => {
  if (e.key === 'Space') e.preventDefault()
})

// Good (automatic via hook)
useKeyboardControls((key) => {
  if (key === 'Space') handleAction()
})
```

---

## § 6. Integration Checklist

When adding keyboard input to a new game:

- [ ] **Identify input pattern**: Puzzle, Card, Turn-based, Custom?
- [ ] **Select appropriate hook**: Use decision tree (§ 2.2)
- [ ] **Define callbacks**: Name by semantic intent (move, confirm, hint)
- [ ] **Add mouse/touch alternatives**: Buttons or click handlers
- [ ] **Test form fields**: Ensure typing in text inputs still works
- [ ] **Test modals**: Modal escape handling doesn't break game input
- [ ] **Verify accessibility**: Tab navigation, focus management, screen readers
- [ ] **Run `pnpm lint`**: No console warnings
- [ ] **Run `pnpm typecheck`**: All types strict
- [ ] **Test on target platforms**: Desktop, mobile, Fire TV (if applicable)

---

## § 7. Migration Path for Existing Code

### § 7.1 Custom Event Listeners → useKeyboardControls

```typescript
// Before
useEffect(() => {
  const handler = (e: KeyboardEvent) => { /* logic */ }
  window.addEventListener('keydown', handler)
  return () => window.removeEventListener('keydown', handler)
}, [deps])

// After
useKeyboardControls((key) => {
  // same logic, key is 'KeyA', 'ArrowUp', etc.
}, { enabled: /* condition */ })
```

### § 7.2 Scattered handleKeyDown → useModalKeyboard

```typescript
// Before (in 30 modal files)
const handleKeyDown = (e: React.KeyboardEvent<HTMLDialogElement>) => {
  if (e.key === 'Escape') onClose()
}
return <dialog onKeyDown={handleKeyDown}>...</dialog>

// After (one line)
useModalKeyboard(dialogRef, onClose, isOpen)
return <dialog ref={dialogRef}>...</dialog>
```

### § 7.3 Inline Key Mapping → useInputState

```typescript
// Before
const [keys, setKeys] = useState({ left: false, right: false })
useEffect(() => {
  const down = (e: KeyboardEvent) => setKeys(/* ... */)
  // ... manual cleanup
}, [])

// After
const keys = useInputState(
  { left: false, right: false },
  { ArrowLeft: 'left', KeyA: 'left', ArrowRight: 'right', KeyD: 'right' }
)
```

---

## § 8. Validation

All input-related code must pass:

```bash
# Lint check (includes type safety)
pnpm lint

# Type check
pnpm typecheck

# Full validation gate (lint + typecheck + build)
pnpm validate
```

**Forbidden**:
- ❌ ESLint disable comments (`// eslint-disable`)
- ❌ TypeScript ignore comments (`// @ts-ignore`)
- ❌ Commented-out event listeners
- ❌ Raw addEventListener without cleanup

---

## § 9. Common Issues & Solutions

### Issue: Keyboard input captured while typing in form field

**Cause**: Missing form field detection
**Solution**: Use `useKeyboardControls` (auto-detects) or check `document.activeElement`

```tsx
// Wrong
window.addEventListener('keydown', () => {
  if (key === 'Enter') doAction()
})

// Right
useKeyboardControls((key) => {
  if (key === 'Enter') doAction()
})
// Auto-skips input, textarea, contenteditable
```

### Issue: Modal Escape not working

**Cause**: onKeyDown handler not attached to dialog element
**Solution**: Ensure dialogRef is attached to `<dialog>` element, not wrapper

```tsx
// Wrong
return <div ref={dialogRef} role="dialog">...</div>

// Right
return <dialog ref={dialogRef}>...</dialog>
```

### Issue: Callbacks fire multiple times

**Cause**: Callbacks not memoized or dependencies missing
**Solution**: Use useCallback with proper dependency array

```tsx
const handleMove = useCallback((dir) => {
  // logic
}, [/* all external dependencies */])

usePuzzleControls({ onMove: handleMove })
```

---

## § 10. Governance Compliance

This document is subordinate to:
- AGENTS.md § 0 (Non-Negotiable Rules)
- AGENTS.md § 3 (Architecture & Path Discipline)
- AGENTS.md § 8 (Input Controls)

**Enforcement**:
- All new input code MUST use appropriate hook (§ 2)
- All game modals MUST use useModalKeyboard
- All form fields MUST NOT capture game input
- All quality gates MUST pass (lint, typecheck, build)

**Review Checklist** (for PRs adding input code):
- [ ] Hook selected per decision tree (§ 2.2)?
- [ ] Callbacks named semantically (§ 5.1)?
- [ ] Mouse/touch alternatives provided (§ 5.1)?
- [ ] Form field detection working (§ 9)?
- [ ] All validation gates passing (§ 8)?
- [ ] No custom event listeners (§ 5.2)?

---

## § 11. Quick Reference

```
useKeyboardControls       → Raw key binding + form field detection
useInputState             → Maintain boolean state per key
useDirectionalInput       → Movement + confirm/cancel/hint/reset
useModalKeyboard          → Escape key → close dialog
usePuzzleControls         → Movement + confirm + hint + reset (combined)
useCardGameControls       → Hit/Stand/Double/Split shortcuts
useTurnBasedControls      → Play/Pass/Draw/Discard/Forfeit shortcuts
```

**Location**: `packages/app-hook-utils/src/`
**Export**: `@games/app-hook-utils`
**Types**: Fully exported from barrel + JSDoc documented

---

**Last Updated**: 2026-04-13  
**Governance Authority**: AGENTS.md § 8, § 0  
**Next Review**: After significant input system changes
