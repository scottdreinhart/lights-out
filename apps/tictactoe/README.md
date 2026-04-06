# TIC-TAC-TOE (Three in a Row)

**Canonical Source**: Wikipedia - Tic-tac-toe  
**Genre**: Abstract Strategy - Grid-Based  
**Players**: 2 alternating  
**Turn-Based**: Yes

## Neutral Identity

- **Product Name**: Three in a Row (avoiding trademark "Tic-Tac-Toe")
- **Branding**: Neutral symbols (X/O or 1/2, circle/square)
- **Visual Theme**: Minimalist, no copyright imagery

## Board Specification

- **Dimensions**: 3×3 grid (9 cells total)
- **Coordinate System**: [row, col] where 0≤row,col≤2
- **Initial State**: All 9 cells empty
- **No vertical scrolling**: Content fits on all devices

## Game Objects

1. **Player Mark** (X or O)
   - States: Empty, Player-1, Player-2
   - Rendering: Simple geometric shapes
   - Initial count: 0 each

2. **Win Line** (conceptual)
   - Length: Exactly 3 consecutive marks
   - Directions: Horizontal, Vertical, Diagonal (8 winning lines total)

## Core Rules

1. **Setup**: Assign marks to players (X starts first by convention)
2. **Turn Loop**:
   - Active player selects empty cell
   - Place mark in selected cell
   - Check win/draw conditions
   - Pass turn to opponent
3. **Legal Actions**:
   - Select any empty cell (cells with marks cannot be reselected)
4. **Illegal Actions**:
   - Select occupied cell
   - Play after game ends
5. **Scoring**:
   - Win: 1 point
   - Draw: 0.5 point each
   - Loss: 0 points
6. **Win Condition**:
   - First player to mark 3 in a row (horizontal, vertical, diagonal)
   - Automatically detected after each move
7. **Draw Condition**:
   - All 9 cells filled, no winner
   - Forced draw with optimal play
8. **Game End**:
   - Immediate on win or draw

## State Machine

```
[Empty Board]
    ↓ Player-1 Move
[1 X placed] → [Check: Win? No | Draw? No]
    ↓ Player-2 Move
[1 X, 1 O] → [Check: Win? No | Draw? No]
    ↓ ... continue ...
[Board Full OR 3-in-a-row Found]
    ↓
[GAME OVER - Win or Draw]
```

## Input Model

**Keyboard** (Desktop):

- Select cell: Number keys (1-9 grid layout) or Arrow keys + Enter
- Settings: ESC for menu
- New Game: N key

**Mouse** (Desktop):

- Click cell to place mark

**Touch** (Mobile):

- Tap cell to place mark

**Controller** (TV/Xbox):

- D-Pad to navigate cells
- A/OK to select

**Accessibility**:

- Screen reader support for cell descriptions ("row 1, column 2")
- High contrast cells
- Keyboard-only fully playable

## UI Layout Contract

**Top HUD** (required):

- Active Player indicator ("Player X's Turn" or "Player 1")
- Score display (if multiplayer/tournament mode)
- Timer (optional, for speed challenges)

**Central Board** (required):

- 3×3 grid centered on viewport
- No vertical scrolling under any circumstance
- Touch target minimums: 44px × 44px mobile, 60px × 60px TV
- Responsive sizing: Scale board to fit all device tiers

**Bottom Controls** (required):

- New Game button
- Rules / Help button (icon or text)
- Settings button (difficulty if AI, display options)

**Rules Modal** (required):

- Simple explanation of 3-in-a-row concept
- Neutral language, no copyright references
- Examples of winning lines (visual diagrams)

## Rule Variants (Documented)

1. **Standard (Default)**
   - 3×3 board, first to 3 in a row wins
2. **4×4 Board**
   - 4×4 grid, first to 4 in a row wins
   - Board size selectable in settings

3. **Misère Variant**
   - First player to force opponent to create 3 in a row wins
   - Toggle in settings

4. **Timeout Mode**
   - Each player has max 5 seconds per turn
   - Timer display in HUD

## AI Strategy (if applicable)

**Baseline AI (Default)**:

- Difficulty 1: Random legal moves
- Difficulty 2: Block opponent winning move, take winning move
- Difficulty 3: Minimax algorithm (perfect play)

**Extension Points**:

- Easy to add stronger heuristics if needed
- Minimax baseline is already optimal

## Test Requirements

1. **Rule Validation Tests**:
   - Win detection: All 8 winning lines verified
   - Draw detection: Board full (9 moves) with no winner
   - Illegal action blocking: Can't place on occupied cell
2. **State Transition Tests**:
   - Player switch works correctly
   - Game resets properly for new game
   - Win/draw immediately stops turn loop
3. **Edge Cases**:
   - Winning move on move 5 (earliest possible)
   - Draw on move 9
   - Opponent blocks winning move

## Shared Platform Reuse

- **Grid Engine**: Simple 3×3 tile system
- **Turn Engine**: Abstract two-player alternation
- **Win Detection**: Line-scan algorithm (reusable for Connect Four, etc.)
- **Shared Hooks**: useResponsiveState, useGame (custom), rules modal
- **Shared Components**: Button, Modal, HUD Status Bar

## Legal / Brand Safety

- ✅ **Safe Name**: "Three in a Row"
- ✅ **Safe Symbols**: X/O or 1/2 (not trademarked)
- ✅ **No Copyright Risk**: 5000+ years old, public domain rules
- ❌ **Avoid**: "Tic-Tac-Toe" (while not trademarked, avoid association)

## Implementation File Structure

```
apps/three-in-a-row/
├── src/
│   ├── domain/
│   │   ├── types.ts          # Board, Move, GameState
│   │   ├── rules.ts          # isLegalMove, checkWin, nextState
│   │   ├── ai.ts             # minimax algorithm
│   │   └── index.ts          # barrel
│   ├── app/
│   │   ├── useGame.ts        # Game orchestration hook
│   │   ├── useResponsiveState.ts
│   │   └── index.ts
│   ├── ui/
│   │   ├── atoms/Cell.tsx
│   │   ├── molecules/GameBoard.tsx, RulesModal.tsx
│   │   ├── organisms/GameScreen.tsx
│   │   └── index.ts
│   └── styles/
│       └── GameBoard.module.css
├── tests/
│   ├── rules.unit.test.ts
│   ├── ai.unit.test.ts
│   └── gameplay.e2e.spec.ts
└── docs/
    ├── RULES.md
    └── variants.json
```
