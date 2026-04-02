# @games/ui-board-core

Shared board UI components and utilities for all grid-based games in the platform.

## Overview

This package provides **reusable, game-agnostic components** for grid-based board games. Instead of each game reimplementing tiles, grids, and keyboard navigation, they share these core systems.

**Supports 8 board-based games:**

- Checkers (8×8)
- Tic-Tac-Toe (3×3)
- Connect-Four (7×6)
- Queens (8×8)
- Minesweeper (variable)
- Reversi (8×8)
- Battleship (10×10)
- Pinpoint (variable)

## Components

### Tile

Generic tile/square/cell component for any game content.

**Features:**

- Multiple content types (icon, text, number, custom render)
- Rich state tracking (selected, focused, target, locked, hint, etc.)
- Built-in accessibility (ARIA labels, keyboard navigation hints)
- Responsive styling (touch optimization, hover support)
- Game-specific customization via className and custom rendering

**Usage:**

```tsx
import { Tile } from '@games/ui-board-core'

// Checkers piece
<Tile
  position={{ row: 2, col: 3 }}
  content={{
    type: 'custom',
    customRender: () => <CheckersPiece isKing={true} player="red" />,
  }}
  state={{ selected: true }}
  isDarkSquare={true}
  ariaLabel="Red king on row 3, column 4, selected"
/>

// Sudoku cell with number
<Tile
  position={{ row: 0, col: 0 }}
  content={{ type: 'number', value: 5 }}
  state={{ locked: true }}
  ariaLabel="5, fixed clue"
/>

// Minesweeper with hint
<Tile
  position={{ row: 1, col: 1 }}
  content={{ type: 'number', value: 3 }}
  state={{ hint: true }}
  ariaLabel="3 mines nearby"
/>
```

### BoardGrid

Generic grid component that renders NxM board with tile cells.

**Features:**

- Configurable rectangular grids (3×3, 8×8, 10×10, etc.)
- Keyboard navigation support (synced with keyboardFocus prop)
- Selection support (selectedPosition prop)
- Game-specific cell rendering (renderCell callback)
- Built-in accessibility (aria-grid semantics)
- Responsive grid layout

**Usage:**

```tsx
import { BoardGrid } from '@games/ui-board-core'

// Simple checkers board
<BoardGrid
  rows={8}
  cols={8}
  cells={checkersBoard.map((row, r) =>
    row.map((piece, c) => ({
      position: { row: r, col: c },
      content: piece
        ? {
            type: 'custom',
            customRender: () => <CheckersPiece {...piece} />,
          }
        : undefined,
      isDarkSquare: (r + c) % 2 === 0,
      isPlayable: (r + c) % 2 === 0,
      ariaLabel: `${piece ? 'red checker' : 'empty'} on row ${r + 1}, column ${c + 1}`,
    }))
  ).flat()}
  keyboardFocus={focus}
  selectedPosition={selected}
  onCellClick={(pos) => handleSelectPiece(pos)}
  responsive={{
    touchOptimized: responsiveState.touchOptimized,
    supportsHover: responsiveState.supportsHover,
    compactViewport: responsiveState.compactViewport,
  }}
/>

// Custom cell rendering (e.g., Sudoku)
<BoardGrid
  rows={9}
  cols={9}
  cells={buildSudokuCells()}
  keyboardFocus={focus}
  selectedPosition={selected}
  renderCell={(cell, isSelected, isFocused) => (
    <SudokuCell
      value={cell.content?.value as number}
      selected={isSelected}
      focused={isFocused}
      locked={cell.state?.locked}
      error={cell.state?.error}
    />
  )}
/>
```

## Hooks

### useKeyboardBoardNavigation

Provides keyboard navigation for grid-based boards.

**Features:**

- Arrow keys + WASD for movement
- Space/Enter for actions
- Escape/Q for cancel
- Automatic focus management
- Optional wrapping at edges

**Usage:**

```tsx
import { useKeyboardBoardNavigation } from '@games/ui-board-core'
import { useState } from 'react'

export function CheckersGame() {
  const [focus, setFocus] = useState<Position | null>(null)
  const [selected, setSelected] = useState<Position | null>(null)

  // Enable keyboard navigation
  useKeyboardBoardNavigation({
    rows: 8,
    cols: 8,
    keyboardFocus: focus,
    onFocusChange: setFocus,
    onAction: () => handleSelectPieceAtFocus(focus),
    onCancel: () => setSelected(null),
    enabled: !thinking && !winner,
  })

  return (
    <BoardGrid
      rows={8}
      cols={8}
      cells={cells}
      keyboardFocus={focus}
      selectedPosition={selected}
      onCellClick={handleSquareClick}
    />
  )
}
```

## Accessibility Utilities

Helper functions for standard board position descriptions and ARIA attributes.

### describePosition

Build complete accessibility descriptions for board cells.

```tsx
import { describePosition } from '@games/ui-board-core/accessibility'

const label = describePosition({
  position: { row: 2, col: 3 },
  content: 'red checker, king',
  state: { selected: true, focused: false },
  squareColor: true, // Include "dark" or "light"
  gameContext: 'checkers',
})
// -> "row 3, column 4, dark, (checkers): red checker, king, selected"
```

### positionToAlgebraic

Convert board positions to chess notation.

```tsx
import { positionToAlgebraic } from '@games/ui-board-core/accessibility'

positionToAlgebraic({ row: 0, col: 0 }) // -> "a8"
positionToAlgebraic({ row: 7, col: 7 }) // -> "h1"
```

### getKeyboardHelpText

Standard keyboard help string for users.

```tsx
const help = getKeyboardHelpText('checkers game')
// -> "Keyboard navigation: arrow keys or WASD to move, space or enter to select, escape or Q to cancel. checkers game."
```

### More utilities

- `positionToText()` - Convert to "row X, column Y"
- `describeSquareColor()` - "dark" or "light"
- `announcePositionChange()` - Movement announcements for aria-live
- `buildGridAriaAttributes()` - Standard grid ARIA attributes
- `positionsEqual()` - Position comparison helper

## Styling

Components use CSS classes for styling:

- `.tile` - Base tile class
- `.tile--dark`, `.tile--light` - Square color
- `.tile--selected` - Selected state
- `.tile--focused` - Keyboard focus state
- `.tile--target` - Valid target for move
- `.tile--playable` - Playable square (clickable)
- `.tile--touch-optimized` - Touch device adjustments
- `.board-grid` - Board container
- `.board-grid--8x8` - Size variant (auto-generated)

**Example CSS:**

```css
.tile {
  position: relative;
  aspect-ratio: 1;
  border: none;
  padding: 0;
  transition: box-shadow 120ms ease;
}

.tile--dark {
  background: var(--board-dark);
  cursor: pointer;
}

.tile--selected {
  box-shadow: inset 0 0 0 3px var(--accent);
}

.tile--focused {
  box-shadow: inset 0 0 0 2px var(--focus-color);
}

.tile--target::before {
  content: '';
  width: 26%;
  height: 26%;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 50%;
}
```

## Migration Guide

### From Game-Specific Board Components

**Before (Checkers-only):**

```tsx
// Old approach: game-specific board component
import { BoardView } from './BoardView'

;<BoardView board={board} selected={selected} onSquarePress={handleSquarePress} />
```

**After (Reusable):**

```tsx
import { BoardGrid, describePosition } from '@games/ui-board-core'

const cells = board.map((row, r) =>
  row.map((piece, c) => ({
    position: { row: r, col: c },
    content: piece ? { type: 'custom', customRender: () => <CheckersPiece {...piece}/> } : undefined,
    isDarkSquare: (r + c) % 2 === 0,
    ariaLabel: describePosition({
      position: { row: r, col: c },
      content: piece ? `${piece.player} checker${piece.isKing ? ', king' : ''}` : 'empty',
      gameContext: 'checkers',
    }),
  }))
).flat()

<BoardGrid rows={8} cols={8} cells={cells} keyboardFocus={focus} />
```

## Implementation Roadmap

**Phase 1 (COMPLETE):**

- ✅ Create @games/ui-board-core package
- ✅ Implement Tile component
- ✅ Implement BoardGrid component
- ✅ Implement useKeyboardBoardNavigation hook
- ✅ Add accessibility utilities
- ✅ Document package and examples

**Phase 2 (PENDING):**

- [ ] Apply to Checkers (refactor BoardView to use BoardGrid)
- [ ] Apply to Tic-Tac-Toe
- [ ] Apply to Connect-Four
- [ ] Apply to Queens
- [ ] Add unit tests for components
- [ ] Add integration tests for keyboard navigation

**Phase 3 (PENDING):**

- [ ] Apply to Minesweeper
- [ ] Apply to Reversi
- [ ] Apply to Battleship
- [ ] Apply to Pinpoint
- [ ] Add E2E tests across all games
- [ ] Accessibility audit (WCAG 2.1 AA)

## Contributing

When adding new board-based games or extending this package:

1. **Use Tile for content rendering** — Don't create game-specific piece components unless truly unique
2. **Use BoardGrid for layout** — Standard grid layout without custom grid implementations
3. **Use useKeyboardBoardNavigation** — Consistent keyboard experience across all games
4. **Use accessibility helpers** — `describePosition()`, `getKeyboardHelpText()`, etc.
5. **Add CSS classes** — Game-specific styling via `.tile--game-specific-state` if needed
6. **Test keyboard navigation** — Ensure arrow/WASD/space/escape work as expected

## See Also

- `@games/app-hook-utils` — `useKeyboardControls` hook (this package uses it)
- `@games/theme-contract` — Theme variables (colors, spacing)
- `@games/ui-utils` — Other UI utilities
