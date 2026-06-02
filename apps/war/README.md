# War (Card Game)

The simplest card game where you and opponent each play one card face-up. Highest card wins both cards. When you run out of cards, you lose. Quick, engaging, no decisions—pure luck.

## 🎮 Quick Start

1. **Deck**: Each player gets 26 cards from shuffled deck
2. **Each Round**: Both players reveal top card simultaneously
3. **Compare**: Highest card wins both cards (Ace = highest, 2 = lowest)
4. **Add to Bottom**: Winner puts both cards under their deck
5. **Continue**: Keep playing until someone runs out
6. **Tie**: War! Each player puts 3 cards face-down, then 1 face-up. Highest wins all 10 cards
7. **Win**: When opponent has no cards left

## 📖 Game Rules

**Objective**: Win all 52 cards (opponent should have zero).

**Deck**: Standard 52-card deck, shuffled  
**Deal**: 26 cards to each player (no drawing, fixed hand size)

**Card Rankings** (highest to lowest):
- Ace (14), King (13), Queen (12), Jack (11), 10-2 (by number)

**Round Sequence**:
1. **Reveal**: Both players reveal top card simultaneously
2. **Compare Ranks**:
   - **Your card higher**: You win both cards, put them at bottom of your deck
   - **AI card higher**: AI wins both cards, put them at bottom of AI deck
   - **Tie**: Both cards same rank → **War!**
3. **Shuffle Bottom**: Won cards go to bottom of deck (randomize order optional)

**War** (when tie):
1. **Place 3 Face-Down**: Each player puts 3 cards face-down (unseen)
2. **Reveal 1**: Each player reveals 1 card on top of the 3
3. **Compare**: Highest card wins all 10 cards (the 2 original + 6 face-down + 2 war cards)
4. **Another Tie**: Repeat war (3 more face-down, 1 face-up)

**Ending**:
- Game ends when one player has all 52 cards
- Or after maximum rounds (War can be infinite; set limit like 1,000 rounds)

**Perfect Information**:
- This game has no hidden information once cards are revealed
- No strategy involved (purely chance)
- Outcome often determined by initial shuffle

## 🎯 How to Play

### Controls

**Desktop (Keyboard + Mouse)**
- **Click or Press Space**: Play next card
- **Escape**: Open menu (pause)

**Mobile (Touch)**
- **Tap screen**: Play next card
- **Large touch zone** makes it easy
- **Animation** shows card play automatically

**TV/Gamepad (D-Pad)**
- **OK Button**: Play card
- **Back Button**: Menu

### Game Flow

1. **Round Begin**: Cards face-down in both decks
2. **Play**: Click/tap to reveal cards (or auto-play)
   - Your card appears on left (blue)
   - AI card appears on right (red)
   - Both revealed for comparison
3. **Result**:
   - **You Win**: "You win! +" shows 2 cards added to your deck
   - **AI Wins**: "AI wins!" shows 2 cards added to AI deck
   - **Tie**: "War!" both put down 3 face-down + 1 face-up
4. **War Resolution**: Same comparison process, 10 cards total at stake
5. **Deck Update**: Winner's deck size shown
   - You: 26 → increasing if winning
   - AI: 26 → decreasing if losing
6. **Continue**: Until someone reaches 52 or hits round limit
7. **Game End**: "You Win! All 52 cards!" or "AI Wins. You're out of cards" with final stats

### Scoring

- **Your Cards**: Current deck size
- **AI Cards**: Current deck size  
- **Rounds Played**: How many cards were played
- **Wars**: How many tie wars happened
- **Win Rate**: Your wins / Total rounds

## 🏗️ Architecture

This is a **DEVELOPING** implementation (70% complete) focused on deck management and animation.

### Domain Layer (`src/domain/`)

**Core Concepts**:
- `Card` = { rank: 'A'|'K'|'Q'|'J'|'10'-'2', suit: '♠♥♦♣' }
- `Deck` = Card[]
- `Round` = { yourCard, aiCard, winner: 'you'|'ai'|'tie' }
- `Game` = { yourDeck: Deck, aiDeck: Deck, rounds: Round[] }

**Key Files**:
- `types.ts` — Card, Deck, Round, Game types
- `deck.ts` — Deck creation, shuffling
- `comparison.ts` — Card ranking comparison
- `rules.ts` — Win/loss/war determination

**Core Logic**:
```typescript
// Create standard 52-card deck
function createDeck(): Card[]

// Get card rank value (for comparison)
function getCardValue(card: Card): number

// Play one round
function playRound(yourCard: Card, aiCard: Card): 'you'|'ai'|'tie'

// Resolve war (multiple cards at stake)
function resolveWar(yourCards: Card[], aiCards: Card[]): 'you'|'ai'|'tie'
```

### App Layer (`src/app/`)

**Custom Hooks**:
- `useWarGame()` — Deck state, round management
- `useAnimation()` — Card reveal and play animations

**Services**:
- `deckService.ts` — Shuffle, deal, deck management
- `storageService.ts` — Game history

### UI Layer (`src/ui/`)

**Organisms**:
- `WarGame` — Main game display with both player areas
- `DeckDisplay` — Your deck on left, AI deck on right
- `CardPlayArea` — Where cards appear during round

**Molecules**:
- `CardDisplay` — Single card (rank and suit)
- `DeckCount` — Deck size indicator
- `RoundResult` — Win/loss/war text

**Atoms**:
- `PlayButton` — "Play Card" or "Next Round" button
- `Badge` — Round counter, war counter

## ✅ Development Status

**Completion**: 70% ✅ (Developing)  
**Core Rules**: Fully implemented  
**Animations**: Smooth card reveal effects  

**What's Done**:
- ✅ Deck creation and shuffling
- ✅ Card comparison and ranking
- ✅ Normal round logic
- ✅ War resolution
- ✅ Deck management
- ✅ Score tracking
- ✅ Card animations
- ✅ Game history

**In Progress**:
- ⏳ Round limit to prevent infinite War scenarios
- ⏳ Auto-play option (continuous without clicking)

**TODO**:
- ❌ Undo last round
- ❌ Multiplayer (local)
- ❌ Statistics/history persistence

## 🚀 Getting Started

```bash
pnpm install
pnpm --filter @games/war dev
pnpm --filter @games/war test
```

---

**Last Updated**: April 6, 2026  
**Maturity**: Developing (70% complete)  
**Platforms**: Web, Electron, iOS, Android
