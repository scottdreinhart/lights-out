# Queens Game

An N-Queens puzzle solver built with React and TypeScript.

## Overview

The N-Queens problem is a classic chess puzzle where you must place N queens on an N×N chessboard such that no queen can attack another. Queens can attack horizontally, vertically, and diagonally.

## Features

- **Multiple Difficulty Levels**: 4×4 (Easy), 6×6 (Medium), 8×8 (Hard), 10×10 (Expert)
- **Interactive Gameplay**: Click to place/remove queens
- **Real-time Conflict Detection**: Visual feedback for attacking queens
- **Hints System**: Get suggestions when stuck
- **Auto-Solver**: See the solution instantly
- **Responsive Design**: Works on desktop and mobile
- **Accessibility**: Keyboard navigation and screen reader support

## Architecture

This game follows CLEAN architecture principles:

- **Domain Layer** (`src/domain/`): Pure business logic, no React dependencies
- **App Layer** (`src/app/`): React hooks and state management
- **UI Layer** (`src/ui/`): React components and styling

## Game Rules

1. Place one queen per row
2. No queen can attack another queen
3. Queens attack horizontally, vertically, and diagonally
4. Find a valid placement for all N queens

## Controls

- **Click a square**: Place a queen in that row/column
- **Click a queen**: Remove the queen
- **Reset**: Clear the board and start over
- **New Puzzle**: Generate a new random puzzle
- **Solve**: Show the complete solution
- **Hint**: Get a suggestion for the next move

## Technical Implementation

- **Algorithm**: Backtracking solver with conflict detection
- **State Management**: React hooks with immutable state updates
- **Styling**: CSS Modules for scoped component styles
- **Testing**: Vitest for unit tests
- **Type Safety**: Full TypeScript coverage

## Running the Game

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Run tests
pnpm test

# Build for production
pnpm build
```

## Algorithm Details

The N-Queens solver uses a backtracking algorithm:

1. Try to place a queen in each row
2. Check if the placement is valid (no conflicts)
3. If valid, recurse to the next row
4. If all rows are filled, we have a solution
5. If no valid placement in current row, backtrack

This approach guarantees finding a solution if one exists, though it may not be the most efficient for very large boards.
