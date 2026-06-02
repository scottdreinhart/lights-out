# Checkers

A strategic 8×8 board game where two players move pieces diagonally, capturing opponent pieces by jumping over them. Achieve promotion to "kings" that move multiple spaces, and outmaneuver your opponent to victory.

## 🎮 Quick Start

1. Open the game in your browser
2. Choose your difficulty: **Easy** (random moves), **Medium** (strategic), or **Hard** (advanced AI)
3. Red pieces are yours (top), Black pieces are the computer's (bottom)
4. Click a piece to select it (highlighted), then click an empty diagonal square to move
5. Jump enemy pieces to capture them
6. Reach the opposite end to become a King (can move backwards)
7. Capture all opponent pieces or block all their moves to win

## 📖 Game Rules

**Objective**: Capture all opponent pieces or make it impossible for them to move.

**Game Board**: 8×8 board with 64 squares (only dark squares used)  
**Pieces**: 12 red pieces (human) vs 12 black pieces (computer)  
**Starting Position**: Pieces arranged on rows 1-3 and 6-8 (3 rows each)

**Movement Rules**:

- **Regular Piece**: Moves diagonally one square forward only
- **King**: Moves diagonally any number of squares forward or backward
- **Jumping**: Can jump over opponent pieces to capture them (mandatory if available)
- **Multiple Jumps**: Continue jumping in sequence if additional captures available

**Capturing**:

- Jump opponent piece diagonally → piece is removed from board
- Multiple jumps in one turn are allowed and encouraged
- If possible to jump, you MUST jump (forced capture)

**Promotion**:

- Regular piece reaches opposite end → automatically becomes King
- Kings gain ability to move backward and jump multiple spaces

**Win Condition**: Capture all opponent pieces OR opponent has no legal moves  
**Draw**: If same position repeats 3 times (rare)

**Difficulty Levels**:

- **Easy**: Random valid moves
- **Medium**: Looks ahead 3 moves, values piece safety
- **Hard**: Deep lookahead (5+ moves), advanced positional play

## 🎯 How to Play

### Controls

**Desktop (Keyboard + Mouse)**

- **Click piece**: Select your piece
- **Click square**: Move selected piece (if valid move)
- **Arrow Keys**: Navigate board
- **Space**: Select/deselect square
- **U**: Undo last move (if enabled)
- **Escape**: Open menu

**Mobile (Touch)**

- **Tap piece**: Select your piece (highlights in blue)
- **Tap square**: Move to square (if legal)
- **Swipe**: Navigate menu if open
- **Tap menu icon**: Open game menu

**TV/Gamepad (D-Pad)**

- **D-Pad**: Navigate board squares
- **OK Button**: Select/move pieces
- **Back Button**: Deselect or open menu

### Game Flow

1. **Game Start**: Red (human) always moves first
2. **Your Turn**:
   - Click piece to select
   - Click destination square to move
   - Piece moves or jumps (captures)
3. **Must Jump**: If you can jump, you're forced to (captures opponent pieces)
4. **Multiple Jumps**: If another jump is available after jumping, you must continue
5. **Promotion**: Reaching the opposite end auto-promotes to King
6. **Computer's Turn**: AI evaluates positions and responds
7. **Game End**: Win when opponent has no pieces or no legal moves

### Scoring

The game tracks wins, losses, and average piece differential:

- **Win** (captured all opponent pieces): +1 to your score
- **Loss** (opponent captured yours): +1 to computer score
- **Draw**: Rare bonus (if same position repeats 3 times)

## 🏗️ Architecture

This is a **MATURE** implementation (75%+ complete) demonstrating strategic game design.

### Domain Layer (`src/domain/`)

**Core Concepts**:

- `Board` = 8×8 grid with 32 playable dark squares
- `Piece` = { position, type: 'regular' | 'king', owner: 'red' | 'black' }
- `Move` = { from, to, capturedPiece?: Piece }

**Key Files**:

- `types.ts` — Type definitions (Piece, Board, GameState)
- `rules.ts` — Move validation, jump detection, win conditions
- `board.ts` — Board state management
- `ai.ts` — Minimax AI with positional evaluation

**Core Logic**:

```typescript
// Get valid moves for a piece
function getValidMoves(board: Board, position: number): Move[]

// Check if jump available (forced)
function hasJumpAvailable(board: Board, owner: Piece['owner']): boolean

// Apply move and capture
function applyMove(board: Board, move: Move): Board

// Evaluate board position (for AI)
function evaluatePosition(board: Board): number
```

### App Layer (`src/app/`)

**Custom Hooks**:

- `useGame()` — Game state (board, turn, score, history)
- `useAI()` — AI move computation with difficulty levels
- `useKeyboardControls()` — Input handling (arrow keys, space)
- `useResponsiveState()` — Device-aware UI

**Services**:

- `storageService.ts` — Persistence (score, game history)

### UI Layer (`src/ui/`)

**Organisms**:

- `CheckersGame` — Main game view
- `BoardDisplay` — 8×8 board with squares and pieces
- `MenuOverlay` — Game menu (pause, difficulty, help)

**Molecules**:

- `Piece` — Individual piece component
- `Square` — Board square (dark/light, selectable)
- `ScorePanel` — Win/loss tracker
- `DifficultySelector` — AI level picker

**Atoms**:

- `Button` — Action buttons
- `Icon` — Visual elements
- `Text` — Labels and info

## ✅ Development Status

**Completion**: 75% ✅ (Mature)  
**Architecture**: CLEAN + Atomic Design  
**Testing**: Comprehensive domain tests  
**Performance**: Optimized board rendering

**What's Done**:

- ✅ Full game rules implementation
- ✅ Minimax AI with 3-4 ply lookahead
- ✅ Jump detection and forced capture
- ✅ King promotion
- ✅ Piece animations
- ✅ Score tracking
- ✅ Mobile-responsive UI

**In Progress**:

- ⏳ Opening book optimization (stronger early game)
- ⏳ Endgame tablebase (perfect play in final positions)

## 🚀 Getting Started

### Install & Run

```bash
pnpm install
pnpm --filter @games/checkers dev    # Dev server
pnpm --filter @games/checkers build  # Production build
pnpm --filter @games/checkers test   # Run tests
```

## 📚 Further Reading

- [ARCHITECTURE.md](./ARCHITECTURE.md) — Detailed architecture and design decisions
- [CONTROLS.md](./CONTROLS.md) — Input control reference
- [../../AGENTS.md](../../AGENTS.md) — Platform architecture and governance

---

**Last Updated**: April 6, 2026  
**Maturity**: Mature (75% complete)  
**Platforms**: Web, Electron, iOS, Android
