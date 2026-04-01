# Zip Maze Navigation

A challenging maze navigation puzzle game where you must collect all items and reach the goal using optimal pathfinding.

## Overview

Zip is a maze navigation puzzle where players must:
- Navigate through procedurally generated mazes
- Collect all golden items (★) scattered throughout the maze
- Reach the red goal (G) after collecting all items
- Use hints and auto-solve features when stuck

The game features multiple difficulty levels with different maze sizes and item counts, implementing A* pathfinding algorithms for optimal route calculation.

## Game Features

### Difficulty Levels
- **Easy**: 8×6 maze with 3 items
- **Medium**: 12×8 maze with 5 items
- **Hard**: 16×10 maze with 8 items
- **Expert**: 20×12 maze with 12 items

### Controls
- **Arrow Keys** or **WASD**: Move player
- **Hint Button**: Shows next optimal move (highlights for 3 seconds)
- **Solve All**: Automatically completes the maze
- **Reset**: Restart current maze
- **New Maze**: Generate new random maze

### Visual Elements
- 🟦 **Walls**: Impassable barriers
- ⬜ **Empty Space**: Navigable paths
- 🟡 **Player**: Your current position
- ⭐ **Items**: Golden collectibles to gather
- 🔴 **Goal**: Final destination (appears after collecting all items)

## Technical Implementation

### Architecture
- **Domain Layer**: Pure maze generation, pathfinding algorithms, game rules
- **App Layer**: React hooks for state management and game orchestration
- **UI Layer**: Responsive components with accessibility features

### Algorithms
- **Recursive Backtracking**: Maze generation ensuring solvability
- **A* Pathfinding**: Optimal route calculation with Manhattan distance heuristic
- **Item Collection Optimization**: Path sequencing for efficient item gathering

### Key Components
- `ZipBoard`: Visual maze renderer with cell highlighting
- `ZipGame`: Main game interface with controls and status
- `useZipGame`: React hook managing game state and actions

## Development

### Prerequisites
- Node.js 24.14.0
- pnpm 10.31.0

### Installation
```bash
cd apps/zip
pnpm install
```

### Development Server
```bash
pnpm dev
```

### Build
```bash
pnpm build
```

### Testing
```bash
pnpm test
```

### Quality Checks
```bash
pnpm lint      # ESLint
pnpm typecheck # TypeScript
pnpm check     # All quality gates
```

## Game Rules

1. **Movement**: Player can only move to adjacent empty cells (up, down, left, right)
2. **Item Collection**: Walking over items automatically collects them
3. **Goal Visibility**: Goal only appears after all items are collected
4. **Completion**: Game ends when player reaches goal with all items collected
5. **Hints**: Show optimal next move based on A* pathfinding
6. **Auto-Solve**: Uses A* to find complete solution path

## Accessibility

- Full keyboard navigation support
- Screen reader compatible
- High contrast mode support
- Reduced motion preferences respected
- Touch-friendly controls on mobile devices

## Browser Support

- Modern browsers with ES2020 support
- Mobile browsers (iOS Safari, Chrome Mobile)
- Desktop browsers (Chrome, Firefox, Safari, Edge)

## Contributing

When adding new features:
1. Follow CLEAN architecture (domain/app/ui layers)
2. Add comprehensive tests
3. Ensure responsive design
4. Maintain accessibility standards
5. Update this README

## License

Part of the Game Platform project.