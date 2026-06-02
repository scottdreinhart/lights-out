# Blackjack

The classic casino card game where you try to get a hand value as close to 21 as possible without going over. Hit (draw) or Stand (keep what you have), and beat the dealer's hand to win.

## 🎮 Quick Start

1. **Place a Bet**: Ante up (coins or chips)
2. **Deal**: You and dealer each get 2 cards
3. **Your Turn**:
   - **Hit**: Draw another card (add to your hand)
   - **Stand**: Stop drawing, lock in your total
   - **Double Down**: Double your bet and get exactly 1 more card
   - **Split**: If you have two cards of same rank, split into 2 hands (with matching bets)
4. **Goal**: Get as close to 21 without going over
5. **Dealer's Turn**: Dealer reveals second card, hits on 16 or less, stands on 17+
6. **Win Condition**: Your total > Dealer's total (without exceeding 21)

## 📖 Game Rules

**Objective**: Get a hand value closer to 21 than the dealer, without exceeding 21.

**Card Values**:

- Number cards (2-10): Face value
- Jack, Queen, King: 10 points each
- Ace: 1 or 11 points (flexible, chose highest valid value)

**Soft vs Hard Hand**:

- **Soft 17**: Two cards including an Ace counted as 11 (e.g., Ace-6)
- **Hard 17**: Hands where Ace must be 1 (e.g., Ace-9-7)

**Player Actions**:

- **Hit**: Draw another card
- **Stand**: Finish your turn, keep current total
- **Double Down**: Double your bet and receive exactly 1 more card (then auto-stand)
- **Split**: If first 2 cards are same rank, split into 2 separate hands with same bet
- **Surrender**: Give up half your bet and end hand (optional rule)

**Dealer Rules** (automatic, no choices):

- Always hits on 16 or less
- Always stands on 17 or more (including soft 17 in basic rules)
- Reveals both cards only after player finishes

**Winning/Losing**:

- **Blackjack** (21 on 2 cards): Pays 3:2 (1.5× your bet)
- **Regular 21**: Beats dealer unless dealer also has 21
- **Push**: Your total ties dealer total (get bet back)
- **Bust**: You exceed 21 (automatic loss)
- **Dealer Bust**: You win if you didn't bust (regardless of your total)

**Hand Resolution** (after all actions):

1. Player busts → dealer wins immediately
2. Dealer busts → player wins (if under 21)
3. Neither busts → compare totals (higher wins)

## 🎯 How to Play

### Controls

**Desktop (Keyboard + Mouse)**

- **Click "Hit"**: Draw another card
- **Click "Stand"**: Finish your turn
- **H Key**: Hit
- **S Key**: Stand
- **D Key**: Double Down
- **P Key**: Split (if available)
- **Number Keys**: Select bet amount

**Mobile (Touch)**

- **Tap Hit Button**: Draw card
- **Tap Stand Button**: Finish turn
- **Swipe left**: Hit
- **Swipe right**: Stand
- **Tap bet area**: Change bet

**TV/Gamepad (D-Pad)**

- **Left/Right**: Select action
- **Up/Down**: Adjust bet
- **OK Button**: Confirm action
- **Back Button**: Menu

### Game Flow

1. **Betting Phase**: Choose your bet amount
2. **Deal**: Both you and dealer get 2 cards (you see both, dealer shows 1)
3. **Your Turn**:
   - Decide: Hit, Stand, Double, or Split
   - Draw cards until you stand or bust
4. **Dealer's Turn**: Dealer reveals second card, hits/stands automatically
5. **Resolution**: Compare totals, determine winner
6. **Payouts**: Win = bet + winnings, Loss = lose bet, Push = get bet back

### Scoring

Tracks bankroll and statistics:

- **Starting Bankroll**: Starting chip count
- **Current Bankroll**: Chips remaining
- **Hands Won**: Total winning hands
- **Hands Lost**: Total losing hands
- **Pushes**: Tied hands

## 🏗️ Architecture

This is a **DEVELOPING** implementation (70%+ complete) with card game mechanics.

### Domain Layer (`src/domain/`)

**Core Concepts**:

- `Card` = { rank: 2-10|J|Q|K|A, suit: ♠♥♦♣ }
- `Hand` = Card[] (player's cards)
- `GameState` = { playerHand, dealerHand, bet, phase, result }

**Key Files**:

- `types.ts` — Card, Hand, GameState definitions
- `rules.ts` — Hand evaluation, win detection, action validation
- `deck.ts` — Card deck creation, shuffling, dealing
- `strategy.ts` — Basic strategy hints (optional)

**Core Logic**:

```typescript
// Calculate hand value (handles Ace flexibility)
function calculateHandValue(hand: Hand): number

// Check if hand is busted
function isBusted(hand: Hand): boolean

// Check if blackjack (21 on 2 cards)
function isBlackjack(hand: Hand): boolean

// Determine who wins
function determineWinner(playerTotal: number, dealerTotal: number): 'player' | 'dealer' | 'push'
```

### App Layer (`src/app/`)

**Custom Hooks**:

- `useBlackjackGame()` — Game state (hand, bet, bankroll)
- `useDealer()` — Dealer AI (hit/stand rules)
- `useKeyboardControls()` — Input handling

**Services**:

- `storageService.ts` — Bankroll persistence

### UI Layer (`src/ui/`)

**Organisms**:

- `BlackjackGame` — Main game view
- `BettingScreen` — Bet selection
- `GameTable` — Cards display, action buttons

**Molecules**:

- `CardHand` — Display of player/dealer cards
- `ActionPanel` — Hit/Stand/Double/Split buttons
- `BankrollDisplay` — Chips tracker

**Atoms**:

- `Card` — Individual card visual
- `Button` — Action button

## ✅ Development Status

**Completion**: 70% ✅ (Developing)  
**Core Rules**: Fully implemented  
**AI Dealer**: Basic hit/stand logic complete

**What's Done**:

- ✅ Card deck and shuffling
- ✅ Hand evaluation (with Ace flexibility)
- ✅ Hit, Stand, Double Down
- ✅ Split (basic, no re-split)
- ✅ Blackjack detection (3:2 payout)
- ✅ Bankroll tracking
- ✅ Win/loss detection
- ✅ Mobile-responsive UI

**In Progress**:

- ⏳ Better card animations
- ⏳ Basic strategy hints/training mode
- ⏳ Multiple hands active simultaneously
- ⏳ Insurance option

**TODO**:

- ❌ Surrender option
- ❌ Shoe penetration (multi-deck tracking)
- ❌ Statistics and analytics

## 🚀 Getting Started

```bash
pnpm install
pnpm --filter @games/blackjack dev
pnpm --filter @games/blackjack test
```

---

**Last Updated**: April 6, 2026  
**Maturity**: Developing (70% complete)  
**Platforms**: Web, Electron, iOS, Android
