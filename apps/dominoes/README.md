# Dominoes

A tile-laying game where two players alternate placing dominoes (rectangular tiles with dot patterns) to form a continuous line. Match the number of dots on the ends of adjacent tiles, and be the first to play all your dominoes or score the most points.

## 🎮 Quick Start

1. **Deal**: Each player gets 7 dominoes (rectangular tiles with dots)
2. **Start**: First player plays any domino
3. **Take Turns**: Next player matches one end of the line to one of their dominoes
   - The free end of the line must match dots on your domino
4. **Match Dots**: If you have a matching domino, play it
5. **Draw Tiles**: If you can't play, draw from the bone yard until you can (or pass)
6. **Win**: First to play all dominoes OR whoever has lowest total dots when no one can play

## 📖 Game Rules

**Objective**: Play all your dominoes, or have the lowest total when play stops.

**Dominoes**: Double-6 set (28 tiles total)

- Each tile has 2 ends with 0-6 dots
- Doubles (6-6, 5-5, etc.) can be rotated to allow play on perpendiculars
- Blank (0-0) dominoes match any number

**Game Setup**:

- 28 tiles in bone yard (draw zone)
- Each player draws 7 tiles (14 tiles distributed)
- Remaining 14 tiles in bone yard

**Play Sequence**:

1. First player (by random draw or agreement) plays any domino
2. Next player plays a domino with matching dots to one free end
   - Starting domino has 2 free ends; play on either end
3. Once chain forms, can only play where there are free ends
4. Line grows in both directions (forms a chain)

**Special Rules**:

- **Doubles**: Often played perpendicular to create branching lines
- **Block**: If you can't play and bone yard is empty, you "block" (skip)
- **Boneyard**: If hand is empty and can't play, draw 1 tile at a time until playable or bone yard empty

**Scoring**:

- **Win by Playing Out**: Play all 7 dominoes = score opponents' remaining dots
- **Blocked Game**: No one can play
  - Player with lowest dot total scores all other players' dots
  - Bonus: Player with lowest dots = "winner"

**Game End**:

- First to agreed point total (usually 100 points) wins game
- OR play single round and count points

## 🎯 How to Play

### Controls

**Desktop (Keyboard + Mouse)**

- **Click domino**: Select domino from your hand
- **Click play location**: Place on chain (if valid)
- **Arrow Keys**: Navigate hand
- **Space/Enter**: Play selected
- **P**: Pass (if no valid move)
- **D**: Draw from bone yard

**Mobile (Touch)**

- **Tap domino**: Select from hand
- **Tap play area**: Place domino
- **Swipe hand left/right**: See more tiles
- **Long-press**: Information about tile

**TV/Gamepad (D-Pad)**

- **Left/Right**: Navigate hand
- **Up/Down**: Select play location
- **OK Button**: Confirm play
- **Back Button**: Cancel

### Game Flow

1. **Setup**: Dominoes dealt, chain starts with first tile
2. **Your Turn**:
   - See your hand (7 tiles, 14 faces)
   - See chain/line (free ends marked)
   - Click matching domino, click where to play
3. **Computer's Turn**: AI evaluates hand and plays
4. **Continue**: Alternate until someone plays out or game blocks
5. **Scoring**: Points calculated, next round or game over

### Scoring Details

**Per Hand** (single round):

- Winner gets sum of all opponents' remaining dots
- Example: You play out, opponents have 8, 12, 15 dots remaining = you score 35 points

**Best-of Series**:

- Play multiple rounds
- First to 100 points wins entire game
- Resets hands each round

## 🏗️ Architecture

This is a **DEVELOPING** implementation (72%+ complete) with tile placement mechanics.

### Domain Layer (`src/domain/`)

**Core Concepts**:

- `Domino` = { left: 0-6, right: 0-6, played: boolean }
- `Line` = Domino[] (chain being built)
- `Hand` = Domino[] (player's tiles)
- `GameState` = { hands, line, boneyard, turn, scores }

**Key Files**:

- `types.ts` — Domino, Hand, GameState types
- `rules.ts` — Move validation, scoring, win detection
- `deck.ts` — Domino generation, shuffling
- `ai.ts` — Computer move strategy

**Core Logic**:

```typescript
// Check if domino can be played at end of chain
function canPlay(domino: Domino, lineEnd: number): boolean

// Place domino on chain
function playDomino(line: Line, domino: Domino): Line

// Calculate hand score (sum of dots)
function calculateHandScore(hand: Hand): number

// Get valid moves for hand
function getValidMoves(hand: Hand, lineEnds: [number, number]): Domino[]
```

### App Layer (`src/app/`)

**Custom Hooks**:

- `useDominoesGame()` — Game state
- `useAI()` — Computer AI moves
- `useKeyboardControls()` — Input

**Services**:

- `storageService.ts` — Game history, score tracking

### UI Layer (`src/ui/`)

**Organisms**:

- `DominoesGame` — Main game display
- `LineDisplay` — Chain/line visualization
- `HandDisplay` — Your dominoes

**Molecules**:

- `DominoTile` — Individual domino visual
- `PlayArea` — Drop zone for plays
- `ScoreBoard` — Points tracker

**Atoms**:

- `Dot` — Single dot on domino
- `Button` — Action buttons

## ✅ Development Status

**Completion**: 72% ✅ (Developing)  
**Core Rules**: Fully implemented  
**Visual Design**: Clean domino display

**What's Done**:

- ✅ Domino deck (double-6 set)
- ✅ Hand management
- ✅ Chain/line building
- ✅ Move validation
- ✅ Scoring system
- ✅ Computer AI
- ✅ Mobile touch support

**In Progress**:

- ⏳ Double placement (perpendicular visualization)
- ⏳ Animation improvements
- ⏳ Statistics tracking

**TODO**:

- ❌ Three+ player support
- ❌ Multiple rounds (series play)
- ❌ Better AI strategy

## 🚀 Getting Started

```bash
pnpm install
pnpm --filter @games/dominoes dev
pnpm --filter @games/dominoes test
```

---

**Last Updated**: April 6, 2026  
**Maturity**: Developing (72% complete)  
**Platforms**: Web, Electron, iOS, Android
