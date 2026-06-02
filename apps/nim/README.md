# Nim

An ancient mathematical game of strategy where two players take turns removing objects from piles. The player forced to take the last object loses (in standard "misère" rules). Pure strategy, no luck involved—perfect play is completely determined by game mathematics.

## 🎮 Quick Start

1. Open the game and see piles of objects (sticks, stones, or dots)
2. On your turn: Pick one pile and remove any number of objects from it (at least 1)
3. Computer takes its turn
4. Continue alternating until one object remains
5. **The player forced to take the last object loses** (misère rules)
6. Win by forcing your opponent to take that final object

## 📖 Game Rules

**Objective**: Force your opponent to take the last remaining object.

**Starting Position**: Several piles with objects (classic: 1, 4, 5, 7 objects = 3 piles)  
**Players**: Human vs Computer

**Turn Structure**:

1. On your turn, choose ONE pile
2. Remove ANY number of objects from that pile (minimum 1)
3. You CANNOT take from multiple piles or take from zero objects
4. Leave pile with 0 or more objects

**Win/Loss Condition**:

- If there is only 1 object left on the board, the current player MUST take it
- Taking the last object = **you lose** (misère rules)
- If opponent is forced to take the last object = **you win**

**Game Theory**:

- Nim is a **finite, perfect-information, deterministic game**
- Winning positions can be calculated mathematically (Nim-sum / XOR)
- Computer AI uses optimal strategy and never loses against perfect play

**Difficulty Levels**:

- **Easy**: Computer makes random moves (beatable)
- **Medium**: Computer plays well but makes occasional mistakes
- **Hard**: Computer plays mathematically perfect Nim (unbeatable with optimal strategy)

## 🎯 How to Play

### Controls

**Desktop (Keyboard + Mouse)**

- **Click pile**: Select a pile
- **Click object to remove**: Remove from selected pile
- OR **Type number**: Type how many to remove, press Enter
- **Arrow Keys**: Navigate piles
- **Number Keys**: Remove 1-9 objects
- **U**: Undo last move
- **Escape**: Open menu

**Mobile (Touch)**

- **Tap pile**: Select pile (highlights)
- **Tap minus button**: Remove 1 object
- **Tap object**: Remove that object (and all after it)
- **Slide pile**: Remove multiple objects by dragging

**TV/Gamepad (D-Pad)**

- **Left/Right**: Select different piles
- **Up/Down**: Increase/decrease remove count
- **OK Button**: Execute removal
- **Back Button**: Cancel selection

### Game Flow

1. **Game Start**: Piles are set up (3-4 piles with varying objects)
2. **Your Turn**:
   - Select a pile
   - Choose how many objects to remove (1 or more)
   - Confirm your move
3. **Computer's Turn**: AI calculates position and responds
4. **Continue**: Alternate turns until 1 object remains
5. **Final Move**: Current player (human or computer) forced to take last object = loses
6. **Result**: Victory or defeat displayed

### Scoring

Tracks win/loss ratio and win strategies:

- **Wins**: Games you won (forced opponent to take last object)
- **Losses**: Games you lost (you took last object)
- **Win Rate**: Percentage of games won
- **Difficulty Stat**: Record against each difficulty level

## 🏗️ Architecture

This is a **MATURE** implementation (78%+ complete) with mathematical game theory.

### Domain Layer (`src/domain/`)

**Core Concepts**:

- `Piles` = array of integers (number of objects per pile)
- `Move` = { pileIndex, objectsRemoved }
- `GameState` = { piles, currentPlayer, gameOver, winner }

**Key Files**:

- `types.ts` — Type definitions
- `rules.ts` — Move validation, win detection
- `ai.ts` — Nim-sum calculation, optimal move selection
- `analysis.ts` — Position evaluation (winning vs losing)

**Core Logic**:

```typescript
// Calculate Nim-sum (XOR of all pile sizes)
function calculateNimSum(piles: number[]): number

// Is current position losing for current player?
function isLosingPosition(piles: number[]): boolean

// Find optimal move (if any)
function getOptimalMove(piles: number[]): Move | null

// Apply move to piles
function applyMove(piles: number[], move: Move): number[]

// Check win condition (one object left)
function isGameOver(piles: number[]): boolean
```

### App Layer (`src/app/`)

**Custom Hooks**:

- `useNimGame()` — Game state (piles, turn, score)
- `useAI()` — AI move calculation
- `useKeyboardControls()` — Input

**Services**:

- `storageService.ts` — Score persistence

### UI Layer (`src/ui/`)

**Organisms**:

- `NimGame` — Main game view
- `PilesDisplay` — Visual representation of piles
- `MenuOverlay` — Difficulty selection

**Molecules**:

- `Pile` — One pile of objects (visual sticks/stones/dots)
- `MovePanel` — Remove count selector
- `Scorebar` — Win/loss tracker

**Atoms**:

- `Button` — Interactive button
- `Object` — Individual object representation

## ✅ Development Status

**Completion**: 78% ✅ (Mature)  
**Type System**: Full TypeScript with Nim-sum calculations  
**Testing**: Game logic and AI moves verified

**What's Done**:

- ✅ Full Nim rules (misère variant)
- ✅ Optimal AI using Nim-sum
- ✅ Move validation
- ✅ Win/loss detection
- ✅ Difficulty selection
- ✅ Score tracking
- ✅ Mobile-responsive UI
- ✅ Undo functionality

**In Progress**:

- ⏳ Game analysis display (show winning/losing positions)
- ⏳ Tutorial with strategy hints
- ⏳ Advanced difficulty with hint suppression

## 🚀 Getting Started

```bash
pnpm install
pnpm --filter @games/nim dev
pnpm --filter @games/nim test
```

---

**Last Updated**: April 6, 2026  
**Maturity**: Mature (78% complete)  
**Platforms**: Web, Electron, iOS, Android
