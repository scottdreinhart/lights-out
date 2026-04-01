# Tango Slide Puzzle

A complete implementation of the classic slide puzzle game where players arrange numbered tiles by sliding them into position.

## Overview

Tango is a sliding puzzle game where the objective is to arrange numbered tiles in ascending order by sliding them into the empty space. The game features multiple difficulty levels, AI-powered hints and auto-solving, and comprehensive puzzle-solving algorithms.

## Features

- **Multiple Difficulty Levels**: Easy (3×3), Medium (4×4), Hard (5×5), Expert (6×6)
- **AI-Powered Assistance**:
  - Hint system that highlights the next optimal move
  - Auto-move functionality for single optimal moves
  - Complete auto-solve that demonstrates the solution
- **Advanced Algorithms**:
  - Breadth-First Search (BFS) for guaranteed shortest solutions
  - A\* search algorithm for optimal pathfinding
  - Parity checking for puzzle solvability
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Accessibility**: Full keyboard navigation and screen reader support
- **Performance Tracking**: Move counter and timer

## Game Rules

1. Tiles are numbered from 1 to N²-1, with one empty space
2. Click on a tile adjacent to the empty space to slide it
3. Arrange tiles in numerical order (1, 2, 3, ..., N²-1)
4. The empty space should end up in the bottom-right corner
5. The puzzle is solved when all tiles are in correct order

## Technical Implementation

### Architecture

The game follows CLEAN architecture principles:

- **Domain Layer** (`src/domain/`): Pure business logic, puzzle algorithms, AI solvers
- **App Layer** (`src/app/`): React hooks, state management, game orchestration
- **UI Layer** (`src/ui/`): React components, styling, user interactions

### Key Algorithms

#### Puzzle Solvability

- **Parity Check**: Determines if a puzzle configuration is solvable
- **Inversion Counting**: Calculates the number of tile inversions
- **Grid Parity**: Considers the position of the empty space

#### AI Solvers

- **BFS**: Explores all possible moves breadth-first to find shortest solution
- **A\***: Uses Manhattan distance heuristic for optimal pathfinding
- **Move Validation**: Ensures only adjacent tiles can be moved

### Components

- `TangoGame`: Main game interface with controls and status
- `TangoBoard`: Visual puzzle board with tile rendering
- `useTangoGame`: React hook managing game state and logic

## Usage

```tsx
import { TangoGame } from '@games/tango'

// Render the complete game
;<TangoGame />
```

## API Reference

### Domain Functions

```typescript
import {
  createSolvedBoard,
  makeMove,
  isBoardSolved,
  shuffleBoard,
  solvePuzzleBFS,
  solvePuzzleAStar,
  isSolvable,
  getHint,
} from '@games/tango/domain'
```

### React Hook

```typescript
import { useTangoGame } from '@games/tango/app'

const {
  gameState,
  makeTileMove,
  canMove,
  resetGame,
  newPuzzle,
  getHint,
  solvePuzzle,
  solveCompletely,
  gameTime,
  isSolved,
  moveCount,
} = useTangoGame('medium')
```

## Development

### Running Tests

```bash
pnpm test
```

### Building

```bash
pnpm build
```

### Development Server

```bash
pnpm dev
```

## Performance

- **BFS Solver**: Guaranteed optimal solutions for small puzzles (≤4×4)
- **A\* Solver**: Efficient for larger puzzles with Manhattan distance heuristic
- **React Optimization**: Memoized components and efficient re-renders
- **Memory Management**: Controlled state updates and cleanup

## Browser Support

- Modern browsers with ES2020 support
- Mobile browsers (iOS Safari, Chrome Mobile)
- Desktop browsers (Chrome, Firefox, Safari, Edge)

## Accessibility

- **Keyboard Navigation**: Full arrow key and tab navigation
- **Screen Readers**: Proper ARIA labels and semantic HTML
- **High Contrast**: Sufficient color contrast ratios
- **Touch Support**: Optimized for touch devices

## License

This implementation is part of the game-platform project.
