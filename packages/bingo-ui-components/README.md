# @games/bingo-ui-components

Shared UI components, hooks, and utilities for all bingo game variants (Classic 75-ball, Mini 30-ball, Swedish 80-ball, UK 90-ball, Pattern, Speed).

## Overview

This package consolidates duplicated UI code across 6 bingo game variants into a single, well-tested, reusable library. It allows bingo apps to:

- ✅ Share components (BingoCard, DrawPanel, modals) without duplication
- ✅ Configure components for variant-specific needs
- ✅ Reuse game logic hooks (useBingoGame, useBingoSettings)
- ✅ Maintain consistent theming and styling across all variants
- ✅ Benefit from centralized bug fixes and improvements

## Architecture

```
@games/bingo-ui-components/
├── organisms/          # Full-featured feature components
│   ├── BingoCard/
│   ├── DrawPanel/
│   ├── SettingsModal/
│   ├── RulesModal/
│   ├── AboutModal/
│   └── HamburgerMenu/
├── molecules/          # Composite UI components
│   └── PatternShowcase/
├── hooks/              # Game state and config hooks
│   ├── useBingoGame
│   ├── useBingoSettings
│   └── useBingoTheme
└── styles/             # Shared CSS variables and animations
    └── bingo-variables.css
```

## Usage Example

### Using Shared Components

```typescript
import { BingoCard, DrawPanel, SettingsModal } from '@games/bingo-ui-components'

export function MyBingoApp() {
  return (
    <>
      <BingoCard cards={cards} onMark={handleMark} />
      <DrawPanel onDraw={handleDraw} />
      <SettingsModal isOpen={settingsOpen} onClose={closeSettings} />
    </>
  )
}
```

### Using Game Hooks

```typescript
import { useBingoGame, useBingoSettings } from '@games/bingo-ui-components'

export function GameScreen() {
  const game = useBingoGame('classic-75')
  const settings = useBingoSettings()
  
  return <div>{/* render game */}</div>
}
```

## Component Details

### Organisms

#### BingoCard
Advanced bingo card display with:
- Multiple size variants (5×5, 4×4, 3×3)
- Keyboard navigation
- Drag-to-mark support
- Pattern highlighting
- Responsive layout

#### DrawPanel
Number drawing display with:
- Configurable column letters (BINGO vs generic)
- Statistics display (drawn/total)
- Draw button and reset
- Variant-specific labels

#### SettingsModal, RulesModal, AboutModal, HamburgerMenu
Standard modals and navigation components with:
- Theme selection
- Accessibility controls
- Game rules and information
- Configurable content

### Hooks

#### useBingoGame(variant)
Manages game state:
- Card generation and marking
- Number drawing and validation
- Win detection
- Pattern matching

#### useBingoSettings()
Manages user settings:
- Theme preference
- Sound volume
- Accessibility toggles
- Difficulty level

#### useBingoTheme()
Theme management:
- Available themes
- Active theme switching
- Color and CSS variable application

## Dependencies

- **React 18+**: UI framework
- **@games/bingo-core**: Game logic and type definitions

## Status

🚀 **In Development** - Components being extracted from individual bingo apps

See [BINGO Decomposition Initiative](../../compliance/BINGO_INITIATIVE_README.md) for detailed implementation plan.
