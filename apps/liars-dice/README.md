# Liars Dice

A bluffing game where you roll hidden dice and make bids about how many of a certain value exist across all players' hands. Other players challenge your bid if they think you're lying. Last player with dice remaining wins. Test your nerve and probability intuition.

## 🎮 Quick Start

1. **Everyone Rolls**: All players roll 5 dice, keep hidden (only you see yours)
2. **Make a Bid**: Example: "There are four 3s" (claim quantity + value)
3. **Others Challenge**: Next player can:
   - **Believe**: Raise the bid (more 3s, or switch to different value)
   - **Challenge**: "I don't believe you!" Reveal all dice, count
4. **Resolution**:
   - **Bid was true**: Challenger loses a die
   - **Bid was false**: You lose a die
5. **Continue**: Next round with remaining dice
6. **Last Player**: With at least 1 die wins!

## 📖 Game Rules

**Objective**: Be the last player with at least 1 die remaining

**Players**: 2-6 (you + AI opponents)  
**Dice Per Player**: Start with 5, lose dice when wrong bids  
**Rounds**: Continue until 1 player remains

**Game Sequence**:

1. **Dice Roll Phase**:
   - All players roll 5 dice (you see only yours)
   - Dice are hidden (screen or hand if playing locally)
   - Everyone keeps their dice secret

2. **Bidding Phase**:
   - Current player makes a BID: [Quantity] [Die Value]
   - Examples:
     - "Three 4s" (3 dice showing 4)
     - "Two 6s" (2 dice showing 6)
     - "Five 2s" (5 dice showing 2)
   - **Bidding Rules**:
     - First bid can be any valid bid
     - Next bid must be HIGHER (in value or quantity)
     - Special: "1" counts as wild (any value)

3. **Response (Next Player)**:
   - **Believe the bid**:
     - Raise the bid (e.g., "Three 2s" → "Four 2s")
     - Or switch value (e.g., "Three 2s" → "Three 5s")
     - Say "I call" to see if it's true (force reveal)
   - **Challenge the bid**:
     - Say "Liar!" or "I doubt it!"
     - All dice are revealed
     - Count actual matching dice

4. **Resolution Phase**:
   - **Bid was TRUE**:
     - Challenger loses a die
     - The die is set aside (gone for rest of game)
   - **Bid was FALSE**:
     - Bidder loses a die
     - Die is set aside
   - **Exactly right**:
     - No one loses, bid passes to next player

5. **After Challenge**:
   - All remaining dice are re-rolled (keep secret)
   - Next player (usually one after challenger) makes new bid
   - Continue

6. **Winning Condition**:
   - Players eliminated: Score 0 (all dice lost)
   - One player with ≥1 die remaining = WINNER

**Bid Hierarchy** (comparing two bids):

- "Three 2s" < "Three 3s" (higher value with same quantity)
- "Three 2s" < "Four 2s" (higher quantity)
- "Three 1s" > "Four 2s" (wildcards highest, even single die)

**Starting Bid Strategy**:

- Conservative: Bid what you can see in your hand
- Aggressive: Bid something you can't see (hoping others pass)

## 🎯 How to Play

### Controls

**Desktop (Keyboard + Mouse)**

- **See Your Dice**: Displayed at bottom of screen (hidden from others in multiplayer)
- **Click Bid Button**: Opens bid selector
  - Choose value (2-6)
  - Choose quantity (1-30)
  - Confirm bid
- **Click Believe**: Raise the bid (opens selector)
- **Click Challenge**: "I don't believe you!" Force reveal
- **Click Call**: "I call" (verify bid is correct)
- **Tab**: View your own dice
- **Space**: Reveal bids log
- **Escape**: Menu

**Mobile (Touch)**

- **Tap Your Dice**: See your hand (large display, top-aligned)
- **Tap Bid**: Open bid selection interface
  - Swipe/tap to set value (2, 3, 4, 5, 6)
  - Swipe/tap to set quantity (1-5+)
  - Confirm bid
- **Tap Believe**: Raise bid
- **Tap Challenge**: Challenge the bid
- **Swipe down**: See bid history

**TV/Gamepad (D-Pad)**

- **D-Pad Left/Right**: Select die value (2-6)
- **D-Pad Up/Down**: Select quantity (1-5+)
- **OK Button**: Confirm bid
- **A Button**: Believe (raise bid)
- **B Button**: Challenge
- **Y Button**: Show history
- **Back Button**: Menu

### Game Flow

1. **Game Starts**: "Liars Dice — Players: You, AI-1, AI-2"
2. **Dice Roll**: "Everyone rolls 5 dice..."
   - Your dice displayed (only you see): 🎲🎲🎲🎲🎲 (e.g., 2, 4, 4, 5, 6)
   - Others' dice hidden (back of card displayed)
3. **Your Turn to Bid** (or someone else's):
   - "Player 1 (AI): It's your bid"
   - AI makes bid: "Three 4s"
4. **Your Response**:
   - Display: "AI-1 claims: Three 4s"
   - Buttons: [Believe] [Challenge]
5. **Believe Path**:
   - Click [Believe] → Open bid selector
   - Raise bid: "Four 4s" or "Three 5s"
   - Continue around table
6. **Challenge Path**:
   - Click [Challenge] → Reveal all dice
   - Display all hands: "You: [2,4,4,5,6] | AI-1: [1,3,4,4,6] | AI-2: [2,2,5,6,6]"
   - Count die value (4s): 4 in your hand + 2 in AI-1's = 6 total
   - Bid was "Three 4s" → True! "AI-1 bid was correct."
   - Challenger (you) loses 1 die
7. **Dice Loss**:
   - "You lost a die. Remaining: 4 dice"
   - AI-1 still has: 5 dice
   - AI-2 still has: 5 dice
8. **Next Round**:
   - Remaining players re-roll
   - Your new hand (4 dice): [1, 3, 5, 6, 6]
   - Next bids begin
9. **Continue**: Round until 1 player remains
10. **Winner**:
    - "AI-1 wins with 3 dice remaining!"
    - Leaderboard: "1. AI-1 | 2. You | 3. AI-2 (eliminated)"

### Bid Estimation

**Probability** (5 dice, rolling 1-6):

- One 6 appears: ~83%
- Two 6s appear: ~33%
- Three 6s appear: ~10%
- Four 6s appear: ~1%
- Five 6s appear: <0.1%

**With 4 Players** (20 total dice):

- Much higher chance of multiple matches
- Conservative bids are more often true
- Aggressive bids (high quantities) are bluffs

## 🏗️ Architecture

This is an **EARLY STAGE** implementation (55% complete) with hidden information and bluffing mechanics.

### Domain Layer (`src/domain/`)

**Core Concepts**:

- `Dice` = [1-6, 1-6, 1-6, 1-6, 1-6] (private per player)
- `Bid` = { quantity: 1-30, value: 2-6 }
- `Hand` = { diceCount: 1-5, publicOnly: boolean }
- `BidState` = { currentBid: Bid, bidder: Player, challenged: boolean }
- `Player` = { name, diceCount: 1-5, isEliminated: boolean }
- `GameState` = { players[], activeBids: Bid[], currentPlayerIndex: 0 }

**Key Files**:

- `types.ts` — Bid, Hand, GameState types
- `dice.ts` — Dice rolling (private, per player)
- `bid.ts` — Bid validation (must be higher than previous)
- `validation.ts` — Challenge resolution (count matching dice)
- `bluffing.ts` — AI bluff detection and strategy
- `hidden-info.ts` — Manage hidden dice state

**Core Logic**:

```typescript
// Create a bid
function createBid(quantity: number, value: 2 | 3 | 4 | 5 | 6): Bid

// Validate bid (must be higher than previous)
function isBidHigher(newBid: Bid, previousBid: Bid): boolean

// Resolve challenge (count dice)
function countMatchingDice(allHands: Dice[], bidValue: number): number

// Check if bid is true
function isBidTrue(count: number, bid: Bid): boolean

// AI strategy
function decideAIAction(
  myDice: Dice[],
  gameContext: GameState,
  difficulty: 'easy' | 'medium' | 'hard',
): 'bid' | 'believe' | 'challenge'

// Eliminate player
function eliminatePlayer(player: Player): void
```

### App Layer (`src/app/`)

**Custom Hooks**:

- `useLiarsDiceGame()` — Game state, bid tracking, hidden info
- `useAI()` — 1-5 AI opponents with bluffing logic
- `useHiddenInformation()` — Manage what each player sees

**Services**:

- `diceService.ts` — Private dice rolls per player
- `bidService.ts` — Bid validation and history
- `challengeService.ts` — Resolve challenges, count dice
- `playerService.ts` — Track elimination
- `strategyService.ts` — AI decision making (bluff vs honest)
- `storageService.ts` — Game history

### UI Layer (`src/ui/`)

**Organisms**:

- `LiarsDiceGame` — Main game
- `DiceHand\*\* — Your 5 dice (hidden from screenshot)
- `BidDisplay\*\* — Current bid being made
- `PlayerHands\*\* — All players' hands (hidden during play, revealed on challenge)
- `BidHistory\*\* — List of bids made this round
- `ActionPanel\*\* — Buttons (believe, challenge, raise)

**Molecules**:

- `DiceRoll\*\* — 5 dice display (your hand only)
- `HiddenHand\*\* — Opponent hand (back of cards icon, count only)
- `BidOption\*\* — Raised bid selector (value + quantity)
- `ChallengeReveal\*\* — Show all hands verification
- `PlayerStatus\*\* — Name, dice count, eliminated status

**Atoms**:

- `Die` — Single die
- `HiddenCard\*\* — Card back (opponent die)
- `Button\*\* — Action buttons
- `BidText\*\* — "Three 4s"

## ✅ Development Status

**Completion**: 55% ✅ (Early Stage)  
**Core Rules**: Partially implemented  
**AI**: Developing with bluff logic

**What's Done**:

- ✅ Dice rolling (hidden per player)
- ✅ Bid creation and validation
- ✅ Challenge resolution
- ✅ Elimination system
- ✅ Turn management
- ✅ Basic UI for bidding
- ✅ Simple AI players

**In Progress**:

- ⏳ Bluff detection AI
- ⏳ Difficulty levels (AI risk profiles)
- ⏳ Bid history visualization

**TODO**:

- ❌ Advanced AI strategy (probability-based)
- ❌ Sound effects (bid, challenge, eliminate)
- ❌ Statistics and win tracking
- ❌ Tooltips (bid probability info)
- ❌ Tutorial for new players

## 🚀 Getting Started

```bash
pnpm install
pnpm --filter @games/liars-dice dev
pnpm --filter @games/liars-dice test
```

---

**Last Updated**: April 6, 2026  
**Maturity**: Early Stage (55% complete)  
**Platforms**: Web, Electron, iOS, Android
