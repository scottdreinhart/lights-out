# Checkers Development Debugging Guide

This guide explains how to enable and use the development debugging utilities for the Checkers game.

## Quick Start

The debug utilities are **development-only** and do nothing in production builds. All logging respects the `NODE_ENV === 'development'` check.

### Option 1: Enable via Browser Console

Open DevTools (F12) and run:

```javascript
window.__checksVerboseLogging = true
```

Then play the game. You'll see console logs for each game event.

### Option 2: Enable in Code (App.tsx)

Uncomment this line in `src/ui/organisms/App.tsx`:

```typescript
// window.__checksVerboseLogging = true
```

Becomes:

```typescript
window.__checksVerboseLogging = true
```

## Available Debug Functions

### `useGameDebug(info: GameDebugInfo)`

Called automatically in App.tsx to log game state changes.

Logs to console when:
- Player changes
- Legal moves change
- Selection changes
- AI is thinking

**Example output:**
```
[Checkers Game State] {
  timestamp: "2026-04-02T10:15:32.456Z",
  player: "red",
  thinking: false,
  legalMoves: 7,
  selected: "none"
}
```

### `logGameEvent(event: string, data?: Record<string, unknown>)`

Log individual game events (only when verbose logging enabled).

**In App.tsx, you could add:**

```typescript
const commitMove = useCallback(
  (move: Move, player: Player) => {
    logGameEvent('move_committed', { 
      from: `[${move.from.row}, ${move.from.col}]`,
      to: `[${move.to.row}, ${move.to.col}]`,
      captures: move.captures.length,
      player,
    })
    // ... rest of move logic
  },
  []
)
```

### `debugBoardString(board: Board)`

Get a text representation of the board (useful for copying state).

**Example:**
```
. r . r . r . r
r . r . r . r .
. r . r . r . r
. . . . . . . .
. . . . . . . .
b . b . b . b .
. b . b . b . b
b . b . b . b .
```

Legend:
- `.` = empty square
- `r` = red piece
- `R` = red king
- `b` = black piece
- `B` = black king

**Usage in console:**
```javascript
// First, you need access to the board state
// This would require exporting it or logging it in the component
debugBoardString(board)
```

### `enableGameVerboseLogging()`

Helper function to enable logging from code.

**Usage:**
```typescript
import { enableGameVerboseLogging } from '@/app'

// In App.tsx or index:
enableGameVerboseLogging()
```

## Common Debugging Workflows

### 1. Check why a move is invalid

```javascript
// In console, with verbose logging on:
window.__checksVerboseLogging = true

// Now click squares — you'll see which moves are legal
// Check the console: "legal moves: 5" etc.
```

### 2. Inspect the board state

```javascript
// In console, inject into window:
// (requires modifying App.tsx momentarily to expose it)
console.debug(window.__checksBoard)
```

### 3. Watch AI decision making

```javascript
window.__checksVerboseLogging = true

// Now let the CPU play — you'll see:
// [Checkers Event: cpu_start_thinking]
// [Checkers Event: cpu_move_selected] { move: "..." }
// [Checkers Event: move_committed] { player: "black", ... }
```

## Disabling Debug Output

```javascript
// In console:
window.__checksVerboseLogging = false
```

Or comment out the line in `App.tsx`.

## Performance Considerations

- Debug logging has **zero overhead** in production builds (`NODE_ENV !== 'development'`)
- In development, logging only occurs when `window.__checksVerboseLogging = true`
- State change detection prevents spam (logs once per unique state)

## Adding New Debug Points

To add debug logging to a new feature:

```typescript
import { logGameEvent } from '@/app'

// In your handler:
logGameEvent('my_event', { 
  detail1: value1,
  detail2: value2,
})
```

The log will only appear if:
1. `NODE_ENV === 'development'` (local dev, not production build)
2. `window.__checksVerboseLogging === true` (user has enabled it)

---

**Happy debugging!** 🐛
