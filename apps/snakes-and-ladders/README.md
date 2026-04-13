# Snakes and Ladders

A classic race game where you move up a 10×10 board by rolling dice. Land on a ladder and climb up! Land on a snake and slide down. Race against AI opponents to reach square 100 first. Simple rules, exciting gameplay.

## 🎮 Quick Start

1. **Roll Dice**: Roll 1d6, move forward by that many spaces
2. **Land on Board**:
   - **Ladder**: Climb up (shortcut to higher square)
   - **Snake**: Slide down (pushed back)
   - **Empty**: Stay where you landed
3. **Next Turn**: Next player rolls
4. **First to 100**: Reach the top-right corner (square 100) and win!
5. **Difficulty**: Adjust snake/ladder density for harder/easier games

## 📖 Game Rules

**Objective**: Move from square 1 to square 100 before opponents

**Players**: 2-4 (you + AI, each has unique pawn color)  
**Board**: 10×10 grid (100 squares total), numbered 1-100  
**Dice**: 1d6 per turn (roll 1-6 spaces)

**Board Layout**:

- **Row 1**: Squares 1-10 (bottom left to right)
- **Row 2**: Squares 11-20 (up one level, right to left)
- **Row 3**: Squares 21-30 (left to right)
- **Alternating**: Zigzag pattern to top-right (100)

**Turn Sequence**:

1. **Player's Turn**:
   - Current player rolls 1d6
   - Move pawn forward by dice result
   - Land on square (e.g., "You rolled 4, landed on square 17")

2. **Land on Ladder** (indicated on board):
   - Automatically climb to higher square
   - Example: Land on 3, ladder goes to 22 → Pawn moves to 22
   - Exciting! Shortcut in game progression

3. **Land on Snake** (indicated on board):
   - Automatically slide down to lower square
   - Example: Land on 47, snake goes to 26 → Pawn moves to 26
   - Setback in progression

4. **Exact Landing**:
   - Must land exactly on square 100 to win
   - If move would take you past 100, stay at your current position (no move) or bounce back

5. **Next Player**:
   - Turn goes to next player
   - Continue clockwise around board

6. **Winning**:
   - First player to reach square 100 wins!
   - Game ends immediately

**Board Features**:

- **Ladders** (8-12 on board):
  - Take you up (shortcut)
  - Examples: 3→22, 5→14, 20→38, 28→84
- **Snakes** (8-12 on board):
  - Take you down (penalty)
  - Examples: 16→6, 47→26, 56→53, 92→73

**Special Rules**:

- **No rolling again** on ladder/snake (play continues to next player)
- **Overshooting**: If dice take you past 100, options depend on difficulty:
  - Easy: Go to closest valid square
  - Hard: Bounce back (move backward from overshoot)
  - Exact: Must land exactly on 100 (risky)

## 🎯 How to Play

### Controls

**Desktop (Keyboard + Mouse)**

- **Click Roll Button**: Roll the dice
- **Watch Board**: Pawn moves automatically after roll
- **Ladder/Snake Trigger**: Automatic animation
- **Space**: Roll
- **R**: Roll (alternate)
- **Escape**: Menu
- **P**: Pause
- **U**: Undo last move (if enabled)

**Mobile (Touch)**

- **Tap Roll Button**: Large button, center-bottom
- **Watch Animation**: Pawn slides/climbs automatically
- **Tap Board**: View current position details
- **Swipe**: Pan around large board if needed
- **Tap piece**: See player info (position, moves)

**TV/Gamepad (D-Pad)**

- **OK Button**: Roll dice
- **A Button**: Roll (alternate)
- **Back Button**: Menu
- **Visual feedback**: Large display, clear animations

### Game Flow

1. **Game Starts**: "Snakes & Ladders — 2-4 Players"
   - Choose difficulty: Easy / Normal / Hard
   - Choose snake/ladder density
2. **Board Displayed**: 10×10 grid, squares 1-100
   - Pawns at start (square 1)
   - Ladders shown as lines going up
   - Snakes shown as lines going down
3. **Your Turn**: "Player 1 (You): Your turn!"
   - Display: "🎲 Click to Roll"
   - Button: [Roll Dice]
4. **Roll**: You click Roll
   - Dice animation: Shows 1-6
   - Result: "You rolled a 4"
5. **Move**: Your pawn moves forward 4 squares
   - Animation: Slides from square 1 → 5
   - Display: "You landed on square 5"
6. **Landing Result**:
   - If ladder: "Climb! 🪜 You go up to square 14"
   - If snake: "Slide down! 🐍 You go back to square 3"
   - If empty: "Nothing here. Next player!"
7. **Next Player**: "Player 2 (AI-1): Rolling..."
   - AI automatically rolls
   - AI pawn moves
8. **Continue**: Repeat for all players
9. **Progress**:
   - After each round, display: "Round 5/∞"
   - Leaderboard: "1. AI-1: Square 67 | 2. You: Square 52 | 3. AI-2: Square 38"
10. **Winner**:
    - "🎉 Player 1 (You) reached square 100! YOU WIN!"
    - Final leaderboard and stats

### Board Visualization

**Standard 10×10 Board**:

```
91-92-93-...98-99-100  ← Finish
80←...←...←...←89-90
81-82-83-...88
61-62-63-...70
51-52-53-...60
41-42-43-...50
31-32-33-...40
21-22-23-...30
11-12-13-...20
1--2--3--...--10  ← Start
```

**Example Snakes/Ladders**:

- Ladder: 3→22 (visual line going up)
- Snake: 16→6 (visual line going down)
- Ladder: 28→84 (long climb)
- Snake: 99→79 (long slide, regrettable!)

## 🏗️ Architecture

This is a **DEVELOPING** implementation (68% complete) with race mechanics and obstacle systems.

### Domain Layer (`src/domain/`)

**Core Concepts**:

- `Board` = 10×10 grid (100 squares, 1-indexed)
- `Square` = { position: 1-100, ladder: destination|null, snake: destination|null }
- `Piece` = { player: Player, position: 1-100 }
- `Roll` = 1-6 (dice result)
- `Move` = { from: position, to: position, reason: 'roll'|'ladder'|'snake' }
- `Player` = { name, position: 1-100, isWinner: boolean }

**Key Files**:

- `types.ts` — Board, Square, Piece, Move types
- `board.ts` — 10×10 board configuration
- `obstacles.ts` — Ladder/snake positions and destinations
- `dice.ts` — 1d6 rolling
- `movement.ts` — Move pawn, apply ladder/snake
- `winning.ts` — Detect win condition (position === 100)
- `ai.ts` — AI player decisions (none for this game; just roll)

**Core Logic**:

```typescript
// Roll dice
function rollDice(): 1 | 2 | 3 | 4 | 5 | 6

// Move pawn
function movePawn(currentPosition: number, diceResult: number): number

// Check for ladder/snake
function applyObstacle(position: number): number

// Detect winner
function isWinner(position: number): boolean

// Generate board
function generateBoard(difficulty: 'easy' | 'normal' | 'hard'): Board
```

### App Layer (`src/app/`)

**Custom Hooks**:

- `useSnakesLaddersGame()` — Game state, pawn positions, turn management
- `useDiceRoll()` — Roll logic and animations
- `useBoard()` — Board configuration and obstacle lookup

**Services**:

- `playerService.ts` — Player positions and state
- `moveService.ts` — Apply moves and obstacles
- `boardService.ts` — Board configuration, ladder/snake positions
- `turnService.ts` — Turn order, next player
- `storageService.ts` — Game history and leaderboard

### UI Layer (`src/ui/`)

**Organisms**:

- `SnakesLaddersGame` — Main game board and controls
- `GameBoard\*\* — 10×10 grid display with pawns
- `DiceControl\*\* — Roll button and result
- `PlayerPawns\*\* — Visual pieces for each player (color-coded)
- `ObstacleTracker\*\* — Ladder/snake lines on board
- `Leaderboard\*\* — Current player positions

**Molecules**:

- `BoardSquare\*\* — Single square (position, obstacle, pawn)
- `Pawn\*\* — Player piece (color, size per player)
- `Ladder\*\* — Visual line from start to end
- `Snake\*\* — Visual line from start to end
- `DiceRoll\*\* — 1d6 animation and result
- `PlayerBadge\*\* — Name, position, current status

**Atoms**:

- `Square\*\* — Board cell
- `Button` — Roll button
- `Text\*\* — Position, player name
- `Animation\*\* — Pawn sliding, ladder climbing, snake sliding

## ✅ Development Status

**Completion**: 68% ✅ (Developing)  
**Core Rules**: Fully implemented  
**Board**: Complete with ladders/snakes

**What's Done**:

- ✅ 10×10 board (1-100)
- ✅ Dice rolling (1d6)
- ✅ Pawn movement
- ✅ Ladder climbing
- ✅ Snake sliding
- ✅ Multi-player (2-4)
- ✅ Turn management
- ✅ Win detection
- ✅ Board visualization
- ✅ AI players (automatic)

**In Progress**:

- ⏳ Animations (pawn sliding, climbing, sliding)
- ⏳ Difficulty variations (obstacle density)
- ⏳ Sound effects (dice, climb, slide)

**TODO**:

- ❌ Visual board customization (themes)
- ❌ Statistics (average position, speed to win)
- ❌ Leaderboard
- ❌ Pass-and-play local multiplayer
- ❌ Undo/redo

## 🚀 Getting Started

```bash
pnpm install
pnpm --filter @games/snakes-and-ladders dev
pnpm --filter @games/snakes-and-ladders test
```

---

**Last Updated**: April 6, 2026  
**Maturity**: Developing (68% complete)  
**Platforms**: Web, Electron, iOS, Android
