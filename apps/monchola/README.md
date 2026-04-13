# Monchola

A fast-paced board and dice race game combining strategy and luck. Roll your dice, move your pawns around the board, and be the first to get all four pieces from the start to the finish line. Perfect for 2-4 players in quick tournaments.

## 🎮 Quick Start

1. **Choose your piece color** from available options
2. **Roll the dice** or tap to roll (automatic in AI mode)
3. **Move your pawn** the number of spaces shown on the die
4. **Capture opponent pieces** if you land on their space
5. **Continue rolling** and moving until all 4 of your pieces reach home
6. **Win**: First player to get all pieces home wins!

## 📖 Game Rules

**Objective**: Move all 4 of your pawns around the board and into your home zone before opponents do the same.

**Board Layout**:

- Circular track with 104 spaces total
- 4 starting positions (one for each player)
- Separate home zones (final 4 spaces into home)
- Safe spaces marked with shield symbols
- Capture zones and high-traffic areas

**Game Setup**:

- Each player gets 4 pawns in their starting zone
- All pawns begin off the board
- Players determined randomly or by seat
- First roll determines starting player

**Turn Sequence**:

1. **Roll the dice**: Single die roll (1-6)
2. **Move a pawn** the number of spaces rolled
   - **First roll only**: Must roll a 6 to enter board (move first pawn)
   - **Subsequent rolls**: Move any pawn that's on the board
3. **Landing on opponent**: If you land on opponent's pawn (non-safe):
   - Opponent's pawn returns to start (captured)
   - You get a bonus +20 points
4. **Landing on safe space**: No capture possible
5. **Continue turn**: If you roll a 6, you get another roll (up to 3 times)
6. **End turn**: Pass dice to next player

**Finishing**:

- When pawn is on board, you can move toward home zone
- Enter home zone when pawn reaches 4 spaces from board end
- First all 4 pawns in home wins game

**Scoring**:

- **Pawn home**: +10 points per pawn
- **Capture opponent**: +20 points
- **Roll double**: Bonus roll (another turn)
- **Fast finish**: Time bonus if under 10 minutes

**Pawns**:

- Each player: 4 identical colored pawns
- Colors: Red, Blue, Yellow, Green (+ additional for more players)
- Pawns start in player's designated corner

## 🎯 How to Play

### Controls

**Desktop (Keyboard + Mouse)**

- **Click Dice**: Click dice icon to roll
- **Click Pawn**: Click pawn to select it for movement
- **Arrow Keys**: Navigate board (highlight pawns)
- **Space**: Confirm selection
- **Escape**: Show menu
- **R**: Quick roll (shortcut)

**Mobile (Touch)**

- **Tap Dice**: Tap dice to roll automatically
- **Tap Pawn**: Tap pawn to move it (auto-chosen if only option)
- **Swipe**: Navigate board view
- **Menu Tap**: Access settings

**TV/Gamepad (D-Pad)**

- **D-Pad**: Navigate players/pawns
- **OK Button**: Roll dice and confirm moves
- **Back Button**: Menu

### Game Flow

1. **Game Starts**: Board displayed with all pawns in start zones
2. **First Player Turn**: Dice shows ready to roll
3. **Player Rolls**: Click dice → shows 1-6
4. **First Roll Rules**:
   - **Roll 6**: Move first pawn onto board, continue
   - **Roll 1-5**: Pass dice to next player (no movement)
5. **Subsequent Rolls**: Select any pawn on board, move it
6. **Move Animation**: Pawn slides smoothly to new space
7. **Check for Capture**: If landed on opponent's pawn → opponent returns to start
8. **Roll Again Check**:
   - Rolled 6? Get another roll
   - Otherwise? Pass to next player
9. **Finish Zone**: When approaching board end, move into home straight
10. **Game End**: First player to home with all 4 pawns wins

### Special Rules

**Safe Spaces**:

- Marked with shield icon
- Cannot be captured even if opponent lands there
- Strategic positions for defensive play

**Double Roll Bonus**:

- Rolling a 6 gives you another turn
- You can win with a good 6-roll streak

**Capture Rules**:

- You capture opponent by landing exactly on their pawn
- Only works on non-safe spaces
- Captured pawn goes back to start
- You get +20 points and continue

## 🏗️ Architecture

This is a **DEVELOPING** implementation (72% complete) focusing on board movement and multiplayer turn management.

### Domain Layer (`src/domain/`)

**Core Types**:

- `Pawn` = { id, owner, position, inHome, color }
- `Board` = { spaces: Space[], startZones: StartZone[] }
- `Space` = { id, position, isSafe, isHome, owner? }
- `Player` = { id, name, color, pawns: Pawn[], score }
- `GameState` = { board, players, currentPlayer, diceRoll, gameOver }
- `Move` = { player, pawn, distance, fromPos, toPos, captured? }

**Key Files**:

- `types.ts` — Pawn, Board, Space, Player, GameState
- `board.ts` — Board layout initialization (104 spaces + safe zones)
- `rules.ts` — Move validation, capture detection, turn management
- `movement.ts` — Pawn position calculations
- `scoring.ts` — Points for moves, captures, completions
- `ai.ts` — AI player decision logic (which pawn to move)

**Core Logic**:

```typescript
// Initialize board with 4 player start zones
function createBoard(): Board

// Validate if move is legal
function isLegalMove(pawn: Pawn, diceRoll: number, board: Board): boolean

// Move pawn and check for capture
function movePawn(pawn: Pawn, diceRoll: number, board: Board): Move

// Check if opponent pawn at destination
function checkCapture(position: number, board: Board, owner: Player): Pawn | null

// AI chooses pawn to move (best strategy)
function aiChoosePawn(player: Player, diceRoll: number): Pawn
```

### App Layer (`src/app/`)

**Custom Hooks**:

- `useMonchola()` — Game state, players, current player
- `useDiceRoll()` — Dice animation, roll results
- `usePawnMovement()` — Animate pawns moving
- `useGameTurns()` — Turn management, AI turns
- `useScoring()` — Track points per player

**Services**:

- `storageService.ts` — Game history, statistics
- `aiService.ts` — AI player strategies

### UI Layer (`src/ui/`)

**Organisms**:

- `MonCholaGameScreen` — Main game board view
- `GameBoard` — Circular board with 104 spaces
- `PlayerPanel` — Show all players' states and scores
- `DiceRoller` — Interactive dice with roll animation

**Molecules**:

- `Pawn` — Individual game pawn on board
- `DiceImage` — Dice showing current/last roll
- `PlayerScoreCard` — Player name, color, score
- `TurnIndicator` — Shows whose turn it is

**Atoms**:

- `DiceButton` — Clickable dice to roll
- `BoardSpace` — Single board position
- `ScoreText` — Points display
- `PawnIcon` — Visual pawn piece

## ✅ Development Status

- ✅ **Done**: Board layout, pawn movement, dice rolling, capture logic, basic scoring
- ⏳ **In Progress**: AI strategies (choosing which pawn optimally), turn timing
- ❌ **TODO**: Leaderboards, tournament mode, statistics tracking, multiplayer animations

## 🚀 Getting Started

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Run tests
pnpm test
```

For detailed architecture, see [ARCHITECTURE.md](./ARCHITECTURE.md)  
For development guidelines, see [../../AGENTS.md](../../AGENTS.md)
