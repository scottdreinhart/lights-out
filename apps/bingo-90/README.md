# 90-Ball Bingo

Classic UK bingo variant with 90 numbers and multiple winning patterns.

## Rules

- **Numbers**: 1-90
- **Card Size**: 3x9 grid (27 squares, 15 numbers + 12 blanks)
- **Winning Patterns**:
  - **Line**: Complete any horizontal line
  - **Two Lines**: Complete any two horizontal lines
  - **Full House**: Complete the entire card

## How to Play

1. Click "Start Game" to begin
2. Click "Draw Number" to draw random numbers from 1-90
3. Mark numbers on your card as they are drawn
4. Win by completing the required pattern first

## Features

- Interactive bingo card
- Visual number tracking
- Multiple winning patterns
- New card generation
- Responsive design

## Technical Details

This app uses the shared `@games/bingo-core` library for game logic and `@games/ui-board-core` for UI components.

### Architecture

- **Game Logic**: `@games/bingo-core` provides card generation, rules validation, and win detection
- **UI Components**: `@games/ui-board-core` provides reusable `Tile` and `BoardGrid` components
- **App Layer**: React state management and user interaction handling
- **Styling**: CSS modules for component-scoped styles

### Shared Component Benefits

- Consistent UI patterns across all bingo variants
- Reusable game logic reduces code duplication
- Type-safe interfaces ensure reliability
- Modular architecture enables easy variant creation

## Development

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```
