# Mancala

An ancient strategy game where you move stones around a board counting cups, aiming to get more stones in your store than your opponent. Simple rules, deep strategy, and the signature "extra turn when you land in your store" mechanic.

## 🎮 Quick Start

1. **Board Setup**: Two rows of 6 cups, a store for you (right), one for AI (left)
2. **Your Turn**: Pick any cup on your side, drop its stones one per cup going around
3. **Extra Turn**: If last stone lands in YOUR store, go again!
4. **Capture**: If last stone lands in your empty cup, capture opposite cup's stones too
5. **Pass Turn**: Otherwise, opponent gets a turn
6. **Win**: Most stones in your store when board empties

## 📖 Game Rules

**Objective**: Collect more stones in your store than opponent by game end.

**Game Board**:

- 2 rows of 6 cups (pits) + 2 stores (mancalas)
- Your side: bottom row, right store
- AI side: top row, left store
- Usually 4 stones per cup (36 total)

**Turn Sequence**:

1. **Pick A Cup**: Choose any cup on your side with stones
2. **Distribute**: Pick up all stones, drop 1 in each cup going counterclockwise
3. **Skip Opponent's Store**: When counting around, skip opponent's store
4. **Land Outcomes**:
   - **In Your Store**: Extra turn! (go again)
   - **In Your Empty Cup**: Capture! Also take opposite cup's stones into your store
   - **In Any Other Cup**: Normal. Turn passes to opponent.
   - **In Opponent's Cup**: Just add stone. Turn passes.

**Extra Turn**:

- If last stone of your move lands in YOUR store, you get another turn
- Unique mechanic that gives skilled players big advantages

**Capturing**:

- If last stone lands in one of your empty cups (you had zero)
- You also capture all stones in the directly opposite cup (opponent's side)
- All captured stones go to your store

**Endgame**:

- Game ends when one side (either player) has no stones left in any cup
- Remaining stones on the other side are captured by that player
- Stones in stores are counted last
- Most in your store wins

**Strategy Elements**:

- Planning ahead (will my last stone land in my store?)
- Positioning stones for captures
- Blocking opponent's moves
- Using stores strategically

## 🎯 How to Play

### Controls

**Desktop (Keyboard + Mouse)**

- **Click cup**: Select a cup to pick stones from (your side only)
- **Arrow Keys**: Navigate between cups
- **Space/Enter**: Select cup at cursor
- **Escape**: Menu

**Mobile (Touch)**

- **Tap cup**: Pick stones from it
- **Highlight shows valid** moves (cups with stones)
- **Visual feedback** shows distribution

**TV/Gamepad (D-Pad)**

- **D-Pad Left/Right**: Navigate cups
- **OK Button**: Pick stones from highlighted cup
- **Back Button**: Menu

### Game Flow

1. **Game Start**: Board set up with stones in cups
2. **Your Turn**:
   - Click/tap a cup on your side
   - Stones distribute around board
3. **Distribution Shows**:
   - Each cup lights up as you add a stone
   - Counter shows stones remaining
4. **Land Result**:
   - **Your Store**: "Extra Turn!" you go again (no click needed)
   - **Empty Cup with Opposite Stones**: "Captured!" stones move to your store
   - **Other**: "AI's Turn" passes to opponent
5. **AI Takes Turn**: Computer makes its move intelligently
6. **Continue**: Back to your turn or result of AI's move
7. **Game End**: When one side is empty
   - Remaining stones captured automatically
   - Final count shown
   - Winner announced

### Scoring

- **Your Store**: Current stone count
- **AI Store**: Current stone count
- **Captures This Round**: How many times you captured
- **Extra Turns**: How many extra turns you earned
- **Win Rate**: % of games won

## 🏗️ Architecture

This is a **DEVELOPING** implementation (71% complete) focused on turn management and capture detection.

### Domain Layer (`src/domain/`)

**Core Concepts**:

- `Cup` = { stones: number }
- `Board` = { yourCups: Cup[], yourStore: number, aiCups: Cup[], aiStore: number }
- `Move` = { cupIndex, result: 'normal'|'extraTurn'|'capture' }
- `GameState` = { board, currentPlayer, moves[] }

**Key Files**:

- `types.ts` — Cup, Board, Move, GameState types
- `rules.ts` — Move validation, stone distribution
- `capture.ts` — Capture detection and execution
- `ai.ts` — AI move selection

**Core Logic**:

```typescript
// Distribute stones from cup around board
function distributeStones(
  board: Board,
  cupIndex: number,
  isPlayer: boolean,
): { board: Board; result: 'normal' | 'extraTurn' | 'capture' }

// Detect if capture occurs (last landed in empty)
function checkCapture(board: Board, landingCup: number, isPlayer: boolean): boolean

// Get valid moves (cups with stones on player's side)
function getValidMoves(board: Board, isPlayer: boolean): number[]

// Check game end (one side empty)
function isGameOver(board: Board): boolean
```

### App Layer (`src/app/`)

**Custom Hooks**:

- `useMancalaGame()` — Game state, turn management
- `useAI()` — AI opponent strategy
- `useKeyboardControls()` — Cup selection

**Services**:

- `aiService.ts` — Move selection based on game state
- `storageService.ts` — Game history, high scores

### UI Layer (`src/ui/`)

**Organisms**:

- `MancalaGame` — Main game display
- `BoardDisplay` — Two cup rows + stores
- `StoreDisplay` — Score areas

**Molecules**:

- `CupRow` — Row of 6 cups
- `Cup` — Single pit with stones
- `Store` — Mancala storage area

**Atoms**:

- `Stone` — Individual stone (visual)
- `Button` — Action buttons

## ✅ Development Status

**Completion**: 71% ✅ (Developing)  
**Core Rules**: Fully implemented  
**AI**: Good strategic play

**What's Done**:

- ✅ Board setup and stone distribution
- ✅ Move validation
- ✅ Capture detection and execution
- ✅ Extra turn logic
- ✅ Endgame detection
- ✅ AI with strategic evaluation
- ✅ Score tracking
- ✅ Mobile-responsive

**In Progress**:

- ⏳ AI difficulty levels (easy/medium/hard)
- ⏳ Opening book (standard strong first moves)

**TODO**:

- ❌ Multiplayer (local pass-and-play)
- ❌ Undo last move
- ❌ Game statistics/history

## 🚀 Getting Started

```bash
pnpm install
pnpm --filter @games/mancala dev
pnpm --filter @games/mancala test
```

---

**Last Updated**: April 6, 2026  
**Maturity**: Developing (71% complete)  
**Platforms**: Web, Electron, iOS, Android
