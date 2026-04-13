# Lights Out

A puzzle game where you toggle lights on and off to clear the board. Each light switch you press toggles itself and adjacent lights, creating a chain reaction puzzle to solve.

## 🎮 Quick Start

1. Open the game and look at the board (5×5 grid of lights)
2. Some lights are ON (yellow), some are OFF (dark)
3. Goal: Turn all lights OFF
4. **Catch**: When you press a light, it toggles itself AND all adjacent lights (up, down, left, right)
5. Plan your moves strategically to reach an all-dark board
6. Complete the puzzle in the minimum number of moves

## 📖 Game Rules

**Objective**: Turn all lights off by pressing switches strategically.

**Game Board**: 5×5 grid (25 lights total)  
**Light States**: ON (yellow/bright) or OFF (dark/dim)  
**Starting State**: Random configuration or predefined puzzle variant

**Pressing a Light**:

- That light toggles (ON → OFF or OFF → ON)
- All adjacent lights (up, down, left, right) also toggle
- Diagonals NOT affected
- Corner lights affect 2 neighbors, edge lights affect 3, center lights affect 4

**Example**:

```
Press center light (2,2):
- Toggles: (2,2), (1,2), (3,2), (2,1), (2,3)
- Total: 5 lights affected
```

**Win Condition**: All 25 lights are OFF  
**Constraints**:

- Every light affects neighboring lights deterministically
- Some puzzles require precise move sequencing
- Pressing same light twice = no net effect (reversible)
- Order of moves doesn't matter (commutative)

**Difficulty/Variants**:

- **Easy**: Simpler puzzle configurations with faster solvability
- **Medium**: Standard 5×5 puzzles (classic game)
- **Hard**: Complex patterns requiring 15+ moves
- **Custom**: Player-created puzzles

## 🎯 How to Play

### Controls

**Desktop (Keyboard + Mouse)**

- **Click light**: Toggle that light and adjacent ones
- **Arrow Keys**: Navigate grid (for accessibility)
- **Space/Enter**: Toggle focused light
- **R**: Reset puzzle to start
- **U**: Undo last move
- **H**: Show hint (if enabled)
- **Escape**: Open menu

**Mobile (Touch)**

- **Tap light**: Toggle that light
- **Swipe left/right**: Navigate menu
- **Long-press light**: Show tooltip info

**TV/Gamepad (D-Pad)**

- **D-Pad**: Navigate grid
- **OK Button**: Toggle light
- **Back Button**: Undo or open menu

### Game Flow

1. **Puzzle Loads**: Random or selected configuration is displayed
2. **Your Turn**: Click/tap lights to toggle them and adjacent ones
3. **Strategy**: Plan moves to create cascading toggles
4. **Move Counter**: Track number of presses (fewer = better)
5. **Win Condition**: All lights OFF → level complete!
6. **Next Puzzle**: Load next puzzle or return to menu

### Scoring

Tracks puzzle completion with move optimization:

- **Moves Per Puzzle**: Count of button presses
- **Optimal Moves**: Minimum possible for that puzzle
- **Efficiency Rating**: (Optimal / Actual) × 100%
- **Star Ratings**: 3 stars ⭐⭐⭐ for optimal, fewer stars for more moves

## 🏗️ Architecture

This is a **MATURE** implementation (82%+ complete) with elegant puzzle mechanics.

### Domain Layer (`src/domain/`)

**Core Concepts**:

- `Board` = 5×5 boolean array (ON=true, OFF=false)
- `Position` = { x, y } coordinates
- `Move` = { position pressed, lights affected }

**Key Files**:

- `types.ts` — Type definitions
- `rules.ts` — Toggle logic, win detection, move effects
- `puzzles.ts` — Puzzle generator and library
- `solver.ts` — Algorithm to find optimal solutions
- `board.ts` — Board state management

**Core Logic**:

```typescript
// Toggle light and adjacent ones
function toggleLight(board: Board, x: number, y: number): Board

// Get all affected positions for a press
function getAffectedPositions(x: number, y: number): Position[]

// Check if all lights are off
function isWon(board: Board): boolean

// Generate solvable puzzle
function generatePuzzle(difficulty: 'easy' | 'medium' | 'hard'): Board
```

### App Layer (`src/app/`)

**Custom Hooks**:

- `useLightsOutGame()` — Game state (board, moves, score)
- `usePuzzleGenerator()` — Create new puzzles
- `useHintSystem()` — Provide hints
- `useResponsiveState()` — Device awareness

**Services**:

- `storageService.ts` — Save completed puzzles, best scores
- `puzzleService.ts` — Manage puzzle library

### UI Layer (`src/ui/`)

**Organisms**:

- `LightsOutGame` — Main puzzle view
- `BoardDisplay` — 5×5 grid of light buttons
- `StatsPanel` — Move counter, best score, hint UI

**Molecules**:

- `LightButton` — Individual light (toggles on click)
- `HintBox` — Next suggested move
- `ProgressBar` — Lights-off progress indicator

**Atoms**:

- `Button` — Standard button
- `Icon` — Light on/off icons

## ✅ Development Status

**Completion**: 82% ✅ (Mature)  
**Architecture**: CLEAN + domain-driven puzzle logic  
**Testing**: Puzzle generation and solve algorithms tested

**What's Done**:

- ✅ Full toggle mechanics
- ✅ Puzzle generator
- ✅ Move counter and track
- ✅ Win detection
- ✅ Undo/redo system
- ✅ Hint system
- ✅ Mobile-responsive UI
- ✅ Difficulty selection
- ✅ Score persistence

**In Progress**:

- ⏳ Solver showcase (show optimal solution)
- ⏳ Puzzle difficulty balancing
- ⏳ Statistics and analytics dashboard

## 🚀 Getting Started

```bash
pnpm install
pnpm --filter @games/lights-out dev
pnpm --filter @games/lights-out test
```

---

**Last Updated**: April 6, 2026  
**Maturity**: Mature (82% complete)  
**Platforms**: Web, Electron, iOS, Android
