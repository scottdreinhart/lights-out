# Battleship

A naval strategy game where two players secretly place ships on a grid and take turns calling out coordinates to find and sink enemy vessels. Combines deduction, strategy, and luck to locate hidden ships.

## 🎮 Quick Start

1. **Place Your Fleet**: Arrange your 5 ships on a hidden 10×10 grid
   - Battleship (4 squares), Cruiser (3), Destroyer (2), Submarine (2), Patrol Boat (1)
   - Ships placed vertically or horizontally, not diagonally
   - You can't see the opponent's ships; they can't see yours
2. **Take Turns**: Call out grid coordinates (e.g., "A1", "B5") to search
3. **Track Shots**:
   - **Hit** (yellow): You hit a ship!
   - **Miss** (blue): Empty water
   - **Sink** (red): Completed ship destroyed
4. **Win**: Sink all 5 enemy ships before they sink yours
5. **Lose**: If all your ships are sunk first

## 📖 Game Rules

**Objective**: Sink all opponent's ships before they sink yours.

**Game Board**: 10×10 grid (100 squares per player)  
**Fleet Composition**:

- 1 Battleship (4 squares)
- 1 Cruiser (3 squares)
- 1 Destroyer (2 squares)
- 1 Submarine (2 squares)
- 1 Patrol Boat (1 square)
- **Total**: 10 ship squares across 5 ships

**Ship Placement**:

- Ships placed horizontally or vertically (not diagonally)
- Ships cannot overlap
- Ships cannot be adjacent (including diagonally)
- Once placed, ships don't move during game

**Turn Sequence**:

1. Player calls out a coordinate (A-J horizontal, 1-10 vertical, e.g., "D5")
2. Opponent announces: **Hit**, **Miss**, or **Sunk** (ship destroyed)
3. Player marks their "Target Board" with result
4. Opponent takes their turn
5. Continue until one player sinks all opponent ships

**Ship Sinking**:

- When all squares of a ship are hit, ship is sunk
- Opponent announces the ship name: "You sank my Cruiser!"
- Tracked on scoreboard

**Win Condition**: Sink all 5 opponent ships (10 total hits needed for all ships)  
**Loss Condition**: All your ships sunk

**Turn Management**:

- Players alternate turns
- Each turn is one coordinate guess
- No simultaneous play (sequential turns)

## 🎯 How to Play

### Phase 1: Ship Placement

1. See your empty 10×10 grid
2. Drag/click to place each ship:
   - Click grid square, drag horizontally or vertically
   - Click again to place (or press Enter)
3. All 5 ships placed = ready to play
4. "Random" button auto-places ships
5. "Clear" button resets placement

### Phase 2: Battle

**Desktop (Keyboard + Mouse)**

- **Click grid square**: Call out coordinate (fire shot)
- **Keyboard**: Type coordinate (e.g., "A1") and press Enter
- **Arrow Keys**: Navigate grid
- **U**: Undo last shot (if enabled)

**Mobile (Touch)**

- **Tap grid square**: Call out coordinate
- **Slide across grid**: Select coordinate range (type multiple in sequence)

**TV/Gamepad (D-Pad)**

- **D-Pad**: Navigate grid
- **OK Button**: Fire at coordinate
- **Back Button**: Open menu

### Game Flow

1. **Setup**: Both players secretly place ships
2. **Battle Starts**: Human player goes first
3. **Each Turn**:
   - Call out coordinate
   - See result: Hit/Miss/Sunk
   - Computer responds with its shot
4. **Continue**: Alternate until game ends
5. **Victory/Defeat**: Shown with ship count summary

### Scoring

Tracks accuracy and ship statistics:

- **Shots Fired**: Total shots taken
- **Hits**: Number of hits
- **Accuracy**: (Hits / Shots) × 100%
- **Ships Sunk**: Count of sunk ships
- **Ships Remaining**: Your ships still floating

## 🏗️ Architecture

This is a **DEVELOPING** implementation (65%+ complete) with hidden state mechanics.

### Domain Layer (`src/domain/`)

**Core Concepts**:

- `Board` = 10×10 grid boolean array (ship or empty)
- `Guess` = { x, y, result: 'hit'|'miss'|'sunk' }
- `Ship` = { id, squares: Position[], health, type }
- `GameState` = { playerBoard, computerBoard, playerGuesses, computerGuesses, turn }

**Key Files**:

- `types.ts` — Type definitions
- `rules.ts` — Ship placement validation, hit detection
- `board.ts` — Board state, ship tracking
- `ai.ts` — Computer move strategy (hunting/targeting)

**Core Logic**:

```typescript
// Check if shot hits or misses
function checkShot(board: Board, x: number, y: number): 'hit' | 'miss' | 'sunk' | 'already'

// Place ship on board
function placeShip(board: Board, ship: Ship): Board

// Remove hit from ship health
function hitShip(ship: Ship): { ship: Ship; isSunk: boolean }

// Get computer's next guess
function getComputerMove(computerBoardState): Coordinate
```

### App Layer (`src/app/`)

**Custom Hooks**:

- `useBattleshipGame()` — Shared game state
- `usePlayerBoard()` — Your ships and placements
- `useComputerBoard()` — Tracking computer's ships (guesses only)
- `useAI()` —Computer move logic

**Services**:

- `storageService.ts` — Save game progress, stats

### UI Layer (`src/ui/`)

**Organisms**:

- `BattleshipGame` — Main game orchestrator
- `ShipPlacementScreen` — Initial ship setup
- `BattleScreen` — Two boards side-by-side
- `ResultsScreen` — Win/loss summary

**Molecules**:

- `GameBoard` — 10×10 grid display
- `ShipPreview` — Pre-placement ship outline
- `CoordinateInput` — Type or click to select coordinate
- `ShotResult` — Hit/miss/sunk display

**Atoms**:

- `GridSquare` — Individual square (empty, ship, hit, miss)
- `Button` — Action buttons
- `Icon` — Ship icons

## ✅ Development Status

**Completion**: 65% ✅ (Developing)  
**Game Logic**: Core shooting/ship mechanics complete  
**AI**: Basic targeting strategy implemented, can be enhanced

**What's Done**:

- ✅ 10×10 board system
- ✅ Ship placement validation
- ✅ Hit/miss/sink detection
- ✅ Turn alternation
- ✅ Score tracking
- ✅ Basic computer AI

**In Progress**:

- ⏳ Enhanced AI (hunt/target pattern recognition)
- ⏳ Better result UI (ship shadow on hit)
- ⏳ Game history replay
- ⏳ Multiplayer support (two-player local)

**TODO**:

- ❌ E2E gameplay testing
- ❌ Mobile touch optimizations
- ❌ Accessibility audit (keyboard nav for ship placement)

## 🚀 Getting Started

```bash
pnpm install
pnpm --filter @games/battleship dev
pnpm --filter @games/battleship test
```

---

**Last Updated**: April 6, 2026  
**Maturity**: Developing (65% complete)  
**Platforms**: Web, Electron, iOS, Android
