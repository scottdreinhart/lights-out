# Reversi (Othello)

A strategic board game where you flip your opponent's pieces to your color by surrounding them. Control the board with your black or white pieces, and have the majority color when no more moves are possible to win.

## 🎮 Quick Start

1. **Board Setup**: 8×8 board with 2 black and 2 white pieces in the center
2. **Your Color**: Black pieces (top), Computer: White pieces (bottom)
3. **Your Move**: Place a piece where it will sandwich opponent pieces
   - Your piece must form a line (row, column, or diagonal) sandwiching one or more opponent pieces
   - All sandwiched pieces flip to your color
4. **Must Jump**: You can only play where you flip pieces (can't pass if valid move exists)
5. **Game End**: When neither player can move
6. **Win**: Whoever has more pieces on board wins

## 📖 Game Rules

**Objective**: Have the majority of pieces (your color) when game ends.

**Game Board**: 8×8 board (64 squares)  
**Pieces**: Black and White discs (double-sided tokens)

**Starting Position**:

- 4 pieces in center (2×2 square)
- Black plays first (strategy advantage)
- D4=B, E5=B, D5=W, E4=W (or rotated variant)

**Move Rules**:

- Place piece on empty square
- Must form straight line (row, column, or diagonal) with at least 1 opponent piece between your new piece and another of your pieces
- ALL opponent pieces between the endpoints flip to your color

**Example**:

```
Before:  B W W . . . .
After:   B B B . . . .
         (place black on right, now all whites flip)
```

**Passing**:

- If you cannot make a legal move, you must pass
- If opponent also cannot move, game ends
- If opponent can move, play returns to them

**Endgame**:

- Game ends when neither player can make a legal move
- Count pieces: majority color wins
- Ties are possible (32-32)

**Difficulty Levels**:

- **Easy**: Random valid moves
- **Medium**: Looks ahead 2-3 moves
- **Hard**: Minimax with positional evaluation (strong play)

## 🎯 How to Play

### Controls

**Desktop (Keyboard + Mouse)**

- **Click square**: Place piece (if valid)
- **Arrow Keys**: Navigate board
- **Space/Enter**: Place on focused square
- **P**: Pass (if forced)
- **U**: Undo last move
- **Escape**: Open menu

**Mobile (Touch)**

- **Tap square**: Place piece
- **Highlight shows valid** moves (green/blue)
- **Swipe menu**: Navigate options

**TV/Gamepad (D-Pad)**

- **D-Pad**: Navigate board
- **OK Button**: Place piece
- **Back Button**: Undo or menu

### Game Flow

1. **Black's Turn** (you, always first)
   - See board with your playable squares highlighted
   - Click/tap to place piece
   - Selected pieces and affected pieces flip
2. **Computer's Turn**: AI evaluates and responds
3. **Continue**: Alternate until neither can play
4. **Game End**: Pieces counted
   - Your pieces > Computer: You win! 🎉
   - Computer pieces > Yours: You lose
   - Equal: Draw (rare)

### Scoring

Tracks wins, losses, and piece ratios:

- **Your Pieces**: Count at game end
- **Computer Pieces**: Count at game end
- **Difference**: Who won and by how much
- **Win Rate**: % of games won
- **Piece Ratio**: Average ending positions

## 🏗️ Architecture

This is an **EARLY STAGE** implementation (62%+ complete) requiring strategic refinement.

### Domain Layer (`src/domain/`)

**Core Concepts**:

- `Board` = 8×8 array of pieces ('black'|'white'|empty)
- `Position` = { x, y }
- `Move` = { position, flipped: Position[] }

**Key Files**:

- `types.ts` — Type definitions
- `rules.ts` — Move validation, flip detection, win detection
- `board.ts` — Board state management
- `ai.ts` — Minimax with positional evaluation

**Core Logic**:

```typescript
// Get all valid moves
function getValidMoves(board: Board, color: 'black' | 'white'): Move[]

// Find pieces that flip when placing at position
function getFlippedPieces(board: Board, position: Position, color): Position[]

// Apply move and flip pieces
function applyMove(board: Board, move: Move): Board

// Count pieces by color
function countPieces(board: Board): { black: number; white: number }
```

### App Layer (`src/app/`)

**Custom Hooks**:

- `useReversiGame()` — Game state (board, turn, score)
- `useAI()` — Computer AI with difficulty
- `useKeyboardControls()` — Input

**Services**:

- `storageService.ts` — Game history

### UI Layer (`src/ui/`)

**Organisms**:

- `ReversiGame` — Main game display
- `BoardDisplay` — 8×8 board with pieces
- `MenuOverlay` — Game options

**Molecules**:

- `Square` — Board square (empty, black, white)
- `ScoreDisplay` — Piece counts
- `DifficultySelector` — AI level

**Atoms**:

- `Piece` — Black/white disc
- `Button` — Action button

## ✅ Development Status

**Completion**: 62% ✅ (Early Stage)  
**Core Rules**: Fully implemented  
**AI**: Basic minimax, good but not perfect

**What's Done**:

- ✅ Board and piece management
- ✅ Move validation and flipping
- ✅ AI with minimax
- ✅ Win detection
- ✅ Score tracking
- ✅ Difficulty selection
- ✅ Mobile-responsive UI

**In Progress**:

- ⏳ AI optimization (faster evaluation)
- ⏳ Opening book (strong early-game positions)
- ⏳ Endgame analysis

**TODO**:

- ❌ Openings library (improve consistency)
- ❌ Advanced heuristics (mobility, potential, stability)
- ❌ Book optimization

## 🚀 Getting Started

```bash
pnpm install
pnpm --filter @games/reversi dev
pnpm --filter @games/reversi test
```

---

**Last Updated**: April 6, 2026  
**Maturity**: Early Stage (62% complete)  
**Platforms**: Web, Electron, iOS, Android
