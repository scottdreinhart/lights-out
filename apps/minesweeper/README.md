# MINEFIELD (Minesweeper-style)

**Canonical Source**: Wikipedia - Minesweeper (video game)  
**Genre**: Logic Puzzle - Information-Hiding  
**Players**: 1 (single-player)  
**Turn-Based**: Yes

## Neutral Identity

- **Product Name**: Minefield, Safe Sweep, or Cell Revealer
- **Symbolism**: Avoid "mines" if culturally sensitive; use "hazards" or "obstacles"
- **Visual Theme**: Grid-based, neutral colors

## Board Specification

- **Dimensions (Configurable)**:
  - Beginner: 8×8 (10 hazards)
  - Intermediate: 16×16 (40 hazards)
  - Expert: 30×16 (99 hazards)
- **Coordinate System**: [row, col]
- **Cell States**: Unopened, Opened (safe), Flagged, Opened (hazard/loss state)
- **Initial**: All unopened, random hazard placement

## Game Objects

1. **Unopened Cell**:
   - Appearance: Raised button or flat tile
   - Interactivity: Clickable, revealable
2. **Opened Safe Cell**:
   - Display: Number (0-8) or blank if 0 adjacent hazards
   - Non-interactive after reveal
3. **Flagged Cell**:
   - Appearance: Flag icon or marker
   - Toggle flag on/off via right-click or long-press
4. **Hazard Cell** (revealed):
   - Appearance: Hazard symbol (bomb, mine, exclamation)
   - Game state: LOSS

## Core Rules

1. **Setup**: Player clicks first cell (guaranteed safe + adjacent cells safe)
2. **Turn Loop**:
   - Player reveals a cell (left-click) or flags/unflags (right-click/long-press)
   - System calculates adjacent hazard count
   - Display count (1-8) or blank if 0
   - Check loss/win conditions
3. **Flood Fill**:
   - If cell has 0 adjacent hazards: Auto-reveal all adjacent cells recursively
4. **Win Condition**:
   - All non-hazard cells revealed without triggering a hazard
5. **Loss Condition**:
   - Reveal a hazard cell (game over immediately)
6. **Chording** (optional advanced):
   - If opened cell with matching flagged count: Auto-reveal adjacent non-flagged cells

## State Machine

```
[All Closed, Random Hazards]
    ↓ First Click (guaranteed safe)
[Flood Fill, Numbers displayed]
    ↓ Player reveals cells
[More Safe Cells Revealed]
    ↓ Continue until...
[All Safe Cells Revealed] → WIN
OR
[Hazard Revealed] → LOSS
```

## Input Model

**Keyboard**:

- Arrow keys / WASD: Navigate cells
- Enter / Space: Reveal cell under cursor
- F: Toggle flag on selected cell
- R: New game

**Mouse**:

- Left-click: Reveal cell
- Right-click: Flag/unflag cell
- Middle-click (on revealed cell with flags): Chording auto-reveal

**Touch**:

- Tap: Reveal
- Long-press: Flag/unflag (2-finger tap alternative)

## UI Layout Contract

**Top HUD**:

- Mine counter ("10 remaining" or similar)
- Timer (elapsed or time limit)
- Difficulty selector (if not settings)

**Central Board**:

- Fully visible grid, no scrolling
- Responsive cell sizing

**Bottom Controls**:

- New Game button
- Difficulty buttons (Beginner/Intermediate/Expert)
- Rules / Help

## Variants

1. **Standard (Default)**: Standard board + rules
2. **Timed Challenge**: 5-10 minute time limit
3. **Hardcore Mode**: One strike (instant loss on any hazard)
4. **Custom Board**: User-defined width, height, hazard count

## Test Requirements

1. **Flood Fill**: Verify 0-count cells + adjacent automatically reveal
2. **Adjacent Count**: Verify each cell shows correct hazard count (0-8)
3. **Random Placement**: Verify first click always safe (+ neighbors if applicable)
4. **Win/Loss Detection**: Verify game ends on all safe revealed OR hazard triggered

## Shared Reuse

- **Grid Engine**: N×M tile system (shared with Four-in-a-Row)
- **Flood Fill Algorithm**: Reusable for Flood Fill game, puzzle logic
- **Number Display**: Shared tile rendering logic

## Legal / Brand Safety

- ✅ **Safe Name**: "Minefield" or "Safe Sweep"
- ✅ **Safe Symbols**: Neutral numbers and icons
- ✅ **No Copyright Risk**: Game mechanics are public domain
- ❌ **Avoid**: Exact replication of Microsoft Minesweeper UI

## Implementation File Structure

```
apps/minefield/
├── src/
│   ├── domain/
│   │   ├── types.ts          # Board, Cell, GameState
│   │   ├── rules.ts          # revealCell, flagCell, checkWin
│   │   ├── hazards.ts        # Hazard placement algorithm
│   │   ├── floodfill.ts      # Flood fill logic
│   │   └── index.ts          # barrel
│   ├── app/
│   │   ├── useMinesweeperGame.ts
│   │   ├── useTimer.ts
│   │   └── index.ts
│   ├── ui/
│   │   ├── atoms/Cell.tsx
│   │   ├── molecules/GameBoard.tsx, HUD.tsx
│   │   ├── organisms/MinesweeperGame.tsx
│   │   └── index.ts
│   └── styles/
│       └── GameBoard.module.css
├── tests/
│   ├── floodfill.unit.test.ts
│   ├── hazards.unit.test.ts
│   └── gameplay.e2e.spec.ts
└── docs/
    ├── RULES.md
    └── strategy.md
```
