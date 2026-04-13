# Go Fish

A classic card game where you ask opponents for cards to make sets of four. Build the most "books" (sets of 4 matching rank cards) to win.

## 🎮 Quick Start

1. **Setup**: Deal 7 cards to each player (2-6 players, you vs 1-5 AI)
2. **Your Hand**: You see your cards; AI doesn't see yours (hidden information)
3. **Your Turn**: Ask any player "Do you have any [rank]?" (e.g., "Do you have any 7s?")
4. **If They Have It**: They give you ALL cards of that rank
5. **If They Don't**: "Go fish!" — draw from deck
6. **Book**: When you get 4 cards of same rank, place the book down
7. **Win**: Most books when deck is empty and hand discarded

## 📖 Game Rules

**Objective**: Collect the most "books" (sets of 4 cards of the same rank).

**Players**: 2-6 (you + 1-5 AI opponents)  
**Deck**: Standard 52-card deck  
**Hand Size**: 7 cards per player (dealt at start)

**Starting Position**:

- Each player dealt 7 cards face-down from shuffled deck
- You see your hand; others' hands hidden
- Remaining cards form the "pool" (draw source)
- First player (usually you) starts

**Turn Sequence**:

1. **Ask**: Choose any player and ask for a rank (e.g., "Alice, do you have any Kings?")
   - You must have at least one card of that rank in your hand
   - You can ask any player (including those with empty hands)
2. **Response**:
   - **Yes**: Player gives you ALL their cards of that rank. Add to your hand. Go again.
   - **No**: "Go fish!" You draw top card from pool. If it matches the rank you asked, you go again. Otherwise, play passes.
3. **Book**: When you have 4 cards of the same rank, place them face-up (counted later)
4. **Draw**: If hand drops below 4 cards and deck has cards, draw up to 4 (or deck size if < 4 left)

**Ending**:

- Game ends when deck is empty AND no player has cards in hand
- Count books: Most books wins
- Tiebreaker: Most cards (books are face-down, count by book count first, then remaining cards)

**Strategy Elements**:

- **Information Gathering**: Notice who gives you cards (they have that rank)
- **Deduction**: Track what cards players have based on requests
- **Asking Smart**: If you get cards, ask again (multiple turns in a row possible)

## 🎯 How to Play

### Controls

**Desktop (Keyboard + Mouse)**

- **Click card**: Select from hand (highlighted when selected)
- **Click opponent**: Choose who to ask
- **Type rank**: Enter rank letter (A, 2-9, T, J, Q, K)
- **Enter**: Confirm ask, draw, or continue
- **Escape**: Cancel selection

**Mobile (Touch)**

- **Tap card**: Select from hand
- **Tap opponent**: Choose who to ask
- **Popup**: Select rank from list
- **Confirm**: Button to do ask
- **Animation**: Cards flip when received/given

**TV/Gamepad (D-Pad)**

- **D-Pad Left/Right**: Select card in hand
- **D-Pad Up/Down**: Select player to ask
- **OK Button**: Confirm action
- **Back Button**: Cancel

### Game Flow

1. **Your Turn**: You see your hand, opponent hands hidden
   - Select a card rank (must have it)
   - Choose opponent to ask
   - AI responds (based on what's logical)
2. **Get Cards**: If opponent has that rank, you get cards + go again
3. **Go Fish**: If not, you draw. If it matches rank asked, go again. Otherwise, next player.
4. **AI Takes Turns**: Computer players play logically
   - They track what you're asking for
   - They deduce what you have
   - They play optimally
5. **Books Completed**: When you get 4 of a rank, place down (shown in "books" area)
6. **Game End**: When deck empty and no hands left
   - Books counted (most wins)

### Scoring

- **Your Books**: Count displayed
- **AI Books**: Count per opponent visible
- **Game Score**: Number of rounds won
- **Win Rate**: % of games you've won

## 🏗️ Architecture

This is a **DEVELOPING** implementation (68% complete) focusing on hidden information and AI deduction logic.

### Domain Layer (`src/domain/`)

**Core Concepts**:

- `Card` = { rank, suit }
- `Hand` = Card[]
- `Book` = Set of 4 cards with same rank
- `GameState` = { hands[], books[], pool[], turns[] }

**Key Files**:

- `types.ts` — Card, Hand, Book, Player types
- `rules.ts` — Move validation, book detection
- `deck.ts` — Deck creation and shuffling
- `ai.ts` — AI opponent logic (deduction, asking)

**Core Logic**:

```typescript
// Check if can ask for rank (must have one)
function canAskFor(hand: Hand, rank: string): boolean

// Get cards from opponent
function giveCards(hand: Hand, rank: string): Card[]

// Check for books in hand
function getBooks(hand: Hand): Book[]

// AI deduction (what does this player have?)
function deduceHand(observations: Observation[]): Map<player, Set<rank>>
```

### App Layer (`src/app/`)

**Custom Hooks**:

- `useGoFishGame()` — Game state, turn management
- `useAI()` — 2-5 AI players
- `useKeyboardControls()` — Card selection and asking

**Services**:

- `aiService.ts` — AI decision making, deduction logic
- `storageService.ts` — Game history

### UI Layer (`src/ui/`)

**Organisms**:

- `GoFishGame` — Main game display
- `HandArea` — Your cards
- `OpponentArea` — Other players (cards hidden, books shown)
- `PoolDisplay` — Remaining deck

**Molecules**:

- `Card` — Individual card display
- `PlayerHand` — 7-card row with selection
- `BooksDisplay` — Completed books stacked

**Atoms**:

- `CardFace` — Card rank/suit display
- `PlayerName` — Opponent label

## ✅ Development Status

**Completion**: 68% ✅ (Developing)  
**Core Rules**: Fully implemented  
**AI**: Basic deduction working, advanced strategy developing

**What's Done**:

- ✅ 2-6 player support
- ✅ Card dealing and shuffling
- ✅ Move validation
- ✅ Book detection and scoring
- ✅ Basic AI (random + tracking)
- ✅ Turn management
- ✅ Hidden hand management (opponent cards unknown to player)

**In Progress**:

- ⏳ Advanced AI deduction (tracking what cards players likely have)
- ⏳ AI strategic asking (asking best questions)

**TODO**:

- ❌ Probability-based AI (more human-like guesses)
- ❌ Learning AI (improves over games)
- ❌ Difficulty levels (easy/medium/hard AI)

## 🚀 Getting Started

```bash
pnpm install
pnpm --filter @games/go-fish dev
pnpm --filter @games/go-fish test
```

---

**Last Updated**: April 6, 2026  
**Maturity**: Developing (68% complete)  
**Platforms**: Web, Electron, iOS, Android
