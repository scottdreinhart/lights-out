# Mini Sudoku

A faster, more accessible version of classic Sudoku on a 4×4 grid instead of 9×9. Solve using the same logic: each row, column, and 2×2 box must contain digits 1-4 exactly once. Perfect for quick puzzle sessions. Available in easy, medium, and hard difficulties.

## 🎮 Quick Start

1. **Grid**: 4×4 board with some numbers already filled
2. **Fill Cells**: Click a cell, enter 1-4 (or delete)
3. **Rules**: Each row, column, and 2×2 box needs 1, 2, 3, 4 exactly once
4. **Conflict Detection**: Red highlights show invalid placements
5. **Solve**: Fill all 16 cells without conflicts
6. **Check Solution**: Button validates your solution
7. **Difficulty**: Easy (10 clues), Medium (7 clues), Hard (4 clues)

## 📖 Game Rules

**Objective**: Fill the 4×4 grid so each value (1-4) appears exactly once in:

- Each row
- Each column
- Each 2×2 box

**Starting State**: Some cells are pre-filled (clues)

**Valid Moves**:

- Click empty cell → type 1/2/3/4 → cell filled
- Click filled cell → type 1/2/3/4 → replace value
- Click cell → press Delete/Backspace → clear cell
- Right-click cell → open candidate pencil marks

**Invalid Moves**:

- Entering value that violates row/column/box constraint
- Overwriting pre-filled clue cells (locked)

**Conflict Detection**:

- **Red highlighting**: Shows conflicting cells (same value in row/column/box)
- **Real-time feedback**: Conflicts disappear as you correct them

**Winning**: All 16 cells correctly filled, no conflicts

**Hints**:

- **Hint Button**: Fills ONE empty cell with correct value
- **Unlimited hints** (learning mode)

**Undo/Redo**:

- **Ctrl+Z / Cmd+Z**: Undo last move
- **Ctrl+Shift+Z / Cmd+Shift+Z**: Redo

## 🎯 How to Play

### Controls

**Desktop (Keyboard + Mouse)**

- **Click Cell**: Select cell (highlights in blue)
- **Type 1-4**: Enter value
- **Delete**: Clear cell
- **Arrow Keys**: Navigate grid
- **Number Keys 1-4**: Fill selected cell
- **Ctrl+Z**: Undo
- **R**: Request hint
- **C**: Check solution
- **N**: New game
- **Escape**: Menu

**Mobile (Touch)**

- **Tap Cell**: Select (blue highlight)
- **Tap keypad below**: Choose 1-4 (large buttons)
- **Tap trash icon**: Clear cell
- **Swipe**: Navigate (or tap arrow buttons)
- **Tap Hint**: Fill one cell
- **Tap Check**: Validate solution
- **Tap New**: Start new puzzle

**TV/Gamepad (D-Pad)**

- **D-Pad**: Navigate 4×4 grid
- **OK Button**: Select cell
- **A/B/X/Y Buttons**: Enter 1/2/3/4
- **Back Button**: Clear cell
- **LB/RB**: Hint / Check solution

### Game Flow

1. **Game Starts**: "Mini Sudoku — Difficulty: Easy"
2. **Grid Displayed**: 4×4 grid with ~10 clue numbers (easy)
3. **Select Cell**: Click/tap a cell (blue outline)
4. **Enter Value**: Type 1-4 (or tap number button)
   - Cell updates immediately
   - Conflicts (if any) highlighted red
5. **Conflict Feedback**:
   - Same row: "4 is already in row 2"
   - Same column: "2 is already in column 3"
   - Same box: "3 is already in this 2×2 box"
6. **Continue Filling**: Select next cell, enter value
7. **Stuck?**: Tap "Hint" button
   - One cell fills automatically (correct value)
   - "Hint used (2 remaining)" (if limited)
8. **Solution Complete**: All cells filled, no conflicts
   - "You solved it! Time: 4:32"
   - "Difficulty: Easy"
   - Score/leaderboard update
9. **Actions**:
   - **New Game**: Load same difficulty
   - **Another Difficulty**: Easy → Medium → Hard
   - **Leaderboard**: View times for each difficulty

### Conflict Highlighting

**System detects and shows**:

- **Duplicate in row**: Both conflicting cells turn red
- **Duplicate in column**: Both cells turn red
- **Duplicate in 2×2 box**: Both cells turn red
- **Multiple conflicts**: Cell may conflict with 1-2+ cells (all highlighted)

**Resolution**: When you fix the conflicting cell (change/delete), highlighting disappears

### Solution Validation

**Check Button**:

- Verifies all cells filled
- Verifies no conflicts
- Shows result: "✓ Solution correct!" or "✗ Errors found (marked red)"

## 🏗️ Architecture

This is a **DEVELOPING** implementation (70% complete) providing a gentler introduction to Sudoku mechanics.

### Domain Layer (`src/domain/`)

**Core Concepts**:

- `Grid` = 4×4 array of cells [0-15]
- `Cell` = { value: 0|1|2|3|4, isClue: boolean, row: 0-3, col: 0-3 }
- `Box` = 2×2 subgrid (4 cells)
- `Constraint` = rule (each row/col/box unique)
- `Move` = { cellIndex: 0-15, value: 0|1|2|3|4 }

**Key Files**:

- `types.ts` — Cell, Grid, Move types
- `validation.ts` — Constraint checking (row / column / box)
- `generation.ts` — Puzzle generation (add clues randomly, ensure unique solution)
- `solver.ts` — Solve puzzle algorithmically (for hints)
- `constraints.ts` — Conflict detection and reporting

**Core Logic**:

```typescript
// Check if value is valid at position
function isValidMove(grid: Grid, cellIndex: number, value: 1 | 2 | 3 | 4): boolean

// Get all conflicts for a cell
function getConflicts(grid: Grid, cellIndex: number): ConflictInfo[]

// Generate puzzle
function generatePuzzle(difficulty: 'easy' | 'medium' | 'hard'): Grid

// Solve puzzle
function solvePuzzle(grid: Grid): Grid

// Get next hint
function generateHint(grid: Grid): { cellIndex: number; value: 1 | 2 | 3 | 4 }
```

### App Layer (`src/app/`)

**Custom Hooks**:

- `useMinSudokuGame()` — Game state, current grid, moves
- `useSolver()` — Hint generation, validation
- `useTimer()` — Track solve time
- `useLeaderboard()` — Store and retrieve best times

**Services**:

- `gridService.ts` — Load/save grid state
- `moveService.ts` — Apply moves, undo/redo stack
- `difficultyService.ts` — Puzzle generation per difficulty
- `storageService.ts` — Local storage (game progress, leaderboard)
- `solverService.ts` — Hint and validation logic

### UI Layer (`src/ui/`)

**Organisms**:

- `MiniSudokuGame` — Main game container
- `SudokuGrid` — 4×4 grid display with cells
- `InputKeypad` — Number buttons 1-4
- `ControlPanel` — Hint, Check, New, Difficulty buttons
- `ConflictHighlight` — Dynamic red highlighting
- `Leaderboard` — Best times per difficulty

**Molecules**:

- `SudokuCell` — Single cell (value display, click to select)
- `SudokuBox\*\* (2×2) — Four cells grouped
- `CellInput\*\* — Input field / keypad combo
- `ControlButton\*\* — Reusable button (hint, check, undo)
- `DifficultySelector\*\* — Radio buttons (Easy / Medium / Hard)

**Atoms**:

- `Cell` — Single cell box (value or empty)
- `Button` — All control buttons
- `Number\*\* — Displayed number (1-4)
- `Highlight\*\* — Red conflict visual
- `Timer\*\* — Elapsed time display

## ✅ Development Status

**Completion**: 70% ✅ (Developing)  
**Core Solving**: Fully implemented  
**UI**: Responsive and working

**What's Done**:

- ✅ 4×4 grid (vs 9×9 in full Sudoku)
- ✅ Easy/medium/hard puzzle generation
- ✅ Cell selection and value input
- ✅ Constraint validation (rows, columns, boxes)
- ✅ Real-time conflict detection
- ✅ Red highlighting for conflicts
- ✅ Hint system (fills 1 cell)
- ✅ Solution checking
- ✅ Undo/redo stack
- ✅ Timer and leaderboard per difficulty
- ✅ Mobile-responsive design

**In Progress**:

- ⏳ Pencil marks (candidate notation)
- ⏳ Statistics (solves per difficulty, average time)
- ⏳ Difficulty progression (unlock harder levels)

**TODO**:

- ❌ Solver techniques visualization
- ❌ Tutorial/help screens
- ❌ Sound effects (correct/error/victory)
- ❌ Share puzzles / social leaderboard

## 🚀 Getting Started

```bash
pnpm install
pnpm --filter @games/mini-sudoku dev
pnpm --filter @games/mini-sudoku test
```

---

**Last Updated**: April 6, 2026  
**Maturity**: Developing (70% complete)  
**Platforms**: Web, Electron, iOS, Android
