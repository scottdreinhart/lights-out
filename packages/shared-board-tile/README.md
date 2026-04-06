# @games/shared-board-tile

Shared grid cell component for all board-based games on the platform.

## Features

- ✅ **Generic Grid Cell** — Works with any board game (Battleship, Checkers, Bingo, Queens, Sudoku, etc.)
- ✅ **Flexible Content** — Supports numbers, pieces, icons, custom React components
- ✅ **Keyboard Navigation** — `.selected` state with cyan outline/glow
- ✅ **Hint System** — `.hint` state with gold glow for suggestions/conflicts
- ✅ **Touch Optimization** — Auto-sizing for mobile/tablet
- ✅ **Accessibility** — ARIA labels, semantic button, focus management
- ✅ **CSS Variables** — Theme-driven colors, no hardcoded values
- ✅ **Responsive** — Hover effects only on fine-pointer devices, reduced-motion support

## Installation

Already installed via monorepo. Use in any game app:

```bash
pnpm add @games/shared-board-tile
```

## Usage

### Basic Example

```tsx
import { GridCell } from '@games/shared-board-tile'
import styles from './MyBoard.module.css'

export function MyBoard() {
  return (
    <div className={styles.grid}>
      <GridCell row={0} col={0} content={5} onClick={() => selectCell(0, 0)} />
      <GridCell row={0} col={1} content={<ChessPiece type="pawn" />} selected />
      <GridCell row={0} col={2} content="♛" highlighted />
    </div>
  )
}
```

### Battleship

```tsx
<GridCell
  row={row}
  col={col}
  content={getShipIcon(cellState)}
  onClick={() => fire(row, col)}
  disabled={isAlreadyBombed}
  selected={row === selectedRow && col === selectedCol}
  highlighted={isValidTarget}
/>
```

### Bingo

```tsx
<GridCell
  row={row}
  col={col}
  content={bingoNumbers[row][col]}
  onClick={() => markCell(row, col)}
  highlighted={isWinningNumber}
  stateClass={isMarked ? 'marked' : ''}
/>
```

### Queens / Chess

```tsx
<GridCell
  row={row}
  col={col}
  content={hasQueen ? '♛' : null}
  selected={isSelected}
  highlighted={isUnderAttack}
  onClick={() => placeQueen(row, col)}
  disabled={isPlaced}
  stateClass={hasQueen ? 'has-queen' : ''}
/>
```

### Sudoku

```tsx
<GridCell
  row={row}
  col={col}
  content={values[row][col] || ''}
  selected={row === selectedRow && col === selectedCol}
  highlighted={hasConflict}
  onClick={() => selectCell(row, col)}
/>
```

## API

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `row` | `number` | — | Row index (0-based) |
| `col` | `number` | — | Column index (0-based) |
| `content` | `ReactNode` | — | Cell content (number, component, string, etc.) |
| `selected` | `boolean` | `false` | Keyboard navigation state (cyan highlight) |
| `highlighted` | `boolean` | `false` | Hint/suggestion state (gold glow) |
| `disabled` | `boolean` | `false` | Disable cell interaction |
| `stateClass` | `string` | — | Game-specific CSS class (e.g., "marked", "has-queen") |
| `onClick` | `() => void` | — | Click handler |
| `ariaLabel` | `string` | `cell-{row}-{col}` | Screen reader label |
| `ariaPressed` | `boolean` | — | Accessibility pressed state |
| `touchOptimized` | `boolean` | `false` | Increase size for touch devices |
| `className` | `string` | — | Additional CSS classes |

### CSS Variables

Using CSS variables for theming:

```css
:root {
  --cell-bg: #bdbdbd;
  --cell-hover-bg: #c9c9c9;
  --cell-hover-shadow: rgba(0, 0, 0, 0.15);
  --cell-selected-outline: #71ffd6;
  --cell-selected-glow: rgba(113, 255, 214, 0.3);
  --cell-selected-bg: rgba(113, 255, 214, 0.15);
  --hint-color: #ffc857;
  --cell-hint-bg: rgba(255, 204, 0, 0.1);
  --cell-hint-glow: rgba(255, 200, 87, 0.3);
}
```

## Design System

### Sizes

- **Default**: 52×52px
- **Touch Optimized**: 64×64px
- **Customizable**: Use CSS to override min-width/min-height

### Colors

- **Base**: `--cell-bg` (light gray on most themes)
- **Hover**: `--cell-hover-bg` (slightly darker)
- **Selected**: `--cell-selected-outline` (cyan, #71ffd6)
- **Hint**: `--hint-color` (gold, #ffc857)

### States

- **Normal**: Base background
- **Hover** (fine pointer only): Darker background + scale(1.02)
- **Selected**: Cyan outline + glow
- **Highlighted**: Gold box-shadow + glow
- **Disabled**: Reduced opacity (0.6), no interaction

## Migration Guide

### From Game-Specific Components

Before (individual components):

```tsx
import { Cell } from '@/ui/atoms'  // Battleship
import { Square } from '@/ui/atoms'  // Checkers
import { BoardCell } from '@/ui/atoms'  // Bingo
import { BoardSquare } from '@/ui/atoms'  // Queens
```

After (unified component):

```tsx
import { GridCell } from '@games/shared-board-tile'

// All games use the same component
<GridCell row={0} col={0} content={content} selected={selected} />
```

## Benefits

✅ **Consistency** — All games look and behave the same  
✅ **Maintenance** — One component, one place to fix bugs  
✅ **Accessibility** — Improvements benefit all games  
✅ **Performance** — Memoized component, no duplication  
✅ **Extensibility** — Easy to add features that work across all games  
✅ **Testing** — Centralized test coverage for all games  

## Related

- `@games/app-hook-utils` — Responsive state, sound effects
- Platform keyboard navigation system (WIP)
- Game-shell components (home screen, menus, etc.)
