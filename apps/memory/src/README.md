# Memory (Concentration)

A classic matching game where you flip cards to find pairs of identical symbols. Test your memory, focus, and pattern recognition as you race to match all pairs before your opponent does. Perfect for solo play or multiplayer competition.

## 🎮 Quick Start

1. **Start the game** and choose your difficulty (board size)
2. **All cards are face-down** showing only card backs
3. **Flip two cards** by clicking them to reveal what's underneath
4. **Check for a match**: Do the symbols match?
   - **Yes**: Cards stay face-up, you score a point and get another turn
   - **No**: Cards flip back face-down, turn passes to next player
5. **Keep playing** until all pairs are matched
6. **Win**: The player with the most matched pairs wins

## 📖 Game Rules

**Objective**: Match all pairs on the board and have the highest score.

**Game Board**: Grid of cards (size depends on difficulty)

- **Easy**: 4×4 board (16 cards = 8 pairs)
- **Medium**: 6×6 board (36 cards = 18 pairs)
- **Hard**: 8×8 board (64 cards = 32 pairs)

**Card Setup**:

- Each pair consists of two identical cards with the same symbol
- All 32 unique symbols represented twice
- Cards shuffled randomly each game
- All cards start face-down

**Turn Sequence**:

1. **Your Turn Starts**: You may flip up to 2 cards
2. **Flip Card 1**: Click the first card to reveal it
3. **Flip Card 2**: Click a second card to reveal it
4. **Check Match**:
   - **Match Found**: Cards stay face-up, removed from play
     - You get +1 point
     - You get another turn
   - **No Match**: Cards flip back face-down after brief delay
     - Turn passes to next player
5. **Continue**: Repeat until all pairs match

**Scoring**:

- **1 point per matched pair**
- Track points for each player
- **Winner**: Player with most points when all pairs matched
- **Tie**: Split credit equally

**Memory Aid**:

- Remember card positions as you flip them
- Use this knowledge strategically on future turns
- Pattern recognition helps find pairs faster

**Difficulty Variants**:

- **Custom Board**: Choose your own board size (3×3 to 10×10)
- **Timed Mode**: Find all pairs within time limit
- **Points Mode**: Different scoring strategies

**Multiplayer**:

- 1-4 Players (rest are AI if more players selected)
- Takes turns in order (turn only advances on mismatch)
- Same board for all (no hidden information)

## 🎯 How to Play

### Controls

**Desktop (Keyboard + Mouse)**

- **Mouse Click**: Click a card to flip it
- **Arrow Keys**: Navigate grid (highlight card)
- **Space**: Flip highlighted card
- **U**: Undo last move (if enabled)
- **N**: New game
- **Escape**: Menu

**Mobile (Touch)**

- **Tap Card**: Flip that card
- **Swipe Left/Right**: Navigate through cards
- **Double Tap**: Quick-flip for experienced players
- **Tap Menu Icon**: Settings

**TV/Gamepad (D-Pad)**

- **D-Pad**: Navigate grid squares
- **OK Button**: Flip selected card
- **Back Button**: Menu or undo

### Game Flow

1. **Game Start**: Board displays with all cards face-down
2. **First Player's Turn**: "Player 1 - Your Turn" appears
3. **Flip 2 Cards**: Click 2 cards to reveal them
4. **Brief Pause**: Cards stay visible for 1-2 seconds
5. **Check Result**:
   - **Match**: "Great Match!" message, cards disappear, score +1
   - **No Match**: "No Match" message, cards flip back face-down
6. **Turn Transition**: If matched, you go again. If not, next player
7. **AI Turns**: Computer players take turns automatically
8. **Game End**: All pairs matched, final scores displayed
9. **Win Screen**: Winner announced with statistics
10. **New Game**: Option to play again or review stats

### Game Statistics

After each game, view:

- **Player Scores**: Who matched the most pairs
- **Total Moves**: How many total flips were made
- **Efficiency**: Pairs per move ratio
- **Memory Accuracy**: Percentage of non-matching flips

## 🏗️ Architecture

This is a **DEVELOPING** implementation (68% complete) focusing on card management and match detection.

### Domain Layer (`src/domain/`)

**Core Concepts**:

- `Card` = { id, symbol, faceUp, matched }
- `Board` = Card[] (shuffled grid)
- `Player` = { name, score, isAI }
- `GameState` = { board, players, currentPlayer, gameOver, moves }

**Key Files**:

- `types.ts` — Card, Board, Player, GameState types
- `deck.ts` — Card generation (32 unique symbols × 2)
- `rules.ts` — Match detection, turn management
- `shuffle.ts` — Randomize card positions
- `ai.ts` — AI player logic (remembers seen cards)

**Core Logic**:

```typescript
// Create shuffled board with pairs
function createBoard(difficulty: 'easy' | 'medium' | 'hard'): Board

// Flip a card face-up
function flipCard(board: Board, index: number): Board

// Check if two cards match
function checkMatch(card1: Card, card2: Card): boolean

// Remove matched pair from play
function removeMatchedPair(board: Board, indices: [number, number]): Board

// Reset two unmatched cards
function resetCards(board: Board, indices: [number, number]): Board

// AI chooses two cards (remembering previous flips)
function aiChooseCards(board: Board, gameHistory: Move[]): [number, number]
```

### App Layer (`src/app/`)

**Custom Hooks**:

- `useMemoryGame()` — Game state, board, players, scoring
- `useCardFlip()` — Animation and flip state
- `useMatch Detection()` — Compare cards, detect pairs
- `useAI()` — AI player turns and memory

**Services**:

- `storageService.ts` — Game history, high scores
- `deckService.ts` — Card/symbol generation

### UI Layer (`src/ui/`)

**Organisms**:

- `MemoryGameScreen` — Main game view
- `GameBoard` — Grid of cards
- `ScoreBoard` — Player scores, turn indicator
- `ResultsScreen` — End-of-game statistics

**Molecules**:

- `Card` — Single flip-able card (face-down or face-up)
- `PlayerScoreRow` — Player name and current score
- `TurnIndicator` — Shows whose turn it is

**Atoms**:

- `Button` — New Game, Undo, Settings buttons
- `ScoreCounter` — Numeric display of points
- `AnimatedCardBack` — Back pattern during flip

## ✅ Development Status

- ✅ **Done**: Card generation, shuffling, flip detection, match logic
- ⏳ **In Progress**: AI memory (remembering card positions), difficulty variations
- ❌ **TODO**: Timed mode, leaderboards, custom themes

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
