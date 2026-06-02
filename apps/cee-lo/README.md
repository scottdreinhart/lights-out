# Cee-Lo Dice

A fast, simple dice game where you roll 3 dice trying to beat the dealer or other players. Specific combinations win instantly (triples, natural wins). Highest roll wins the round. Perfect for quick bets and fast gameplay.

## 🎮 Quick Start

1. **Roll 3 Dice**: Three dice, same as everyone else
2. **Check Your Hand**:
   - **Triple 1s** (1-1-1) = Instant win, highest possible
   - **Triple 6s** (6-6-6) = Instant win, second highest
   - **4-5-6** = Instant win (natural), house favorite
   - **1-1-x** = Instant loss (lowest possible)
3. **Compare Rolls**: Highest non-triple wins the round
4. **Keep Score**: Best of 3, 5, or 7 rounds to win game
5. **Quick**: Each round takes ~30 seconds

## 📖 Game Rules

**Objective**: Win rounds by having highest dice combination or hitting instant-win combos

**Players**: 2-4 (including you, rest AI)  
**Dice**: 3 dice per roll  
**Rounds**: Best of 3/5/7 (configurable)

**Roll Evaluation**:

**Instant Wins** (stand immediately):

- **Trips** (1-1-1, 2-2-2, 3-3-3, 4-4-4, 5-5-5, 6-6-6):
  - Beats everything except lower trip
  - **1-1-1** = Highest triple (only loses to push/tie)
  - **6-6-6** = Second highest
  - **2-2-2** through **5-5-5** = Medium triples
- **Natural** (4-5-6):
  - Auto-win (best non-triple)
  - Called a "natural" or "straight"

**Instant Losses** (stand immediately):

- **Double 1s** (1-1-x) = Worst possible, auto-loss

**Other Hands** (ranked by highest die):

- If no instant win/loss, look at highest die
- **Hand Value** = highest single die + sum of other dice (in some variants, just highest die)
- Compare with opponents; highest wins

**Winning Conditions**:

1. **Instant Win**: Roll trip, natural, or specific combo
2. **Instant Loss**: Roll 1-1-x
3. **Comparison**: Compare hands (highest die or sum)

**Betting** (Optional, gameplay-focused version skips):

- In real cee-lo, money exchanges hands per round
- Game version: Points per round, first to points wins game

## 🎯 How to Play

### Controls

**Desktop (Keyboard + Mouse)**

- **Click Roll Button**: Roll the 3 dice
- **Click Continue**: Go to next round after winner declared
- **Space**: Roll or continue
- **Escape**: Menu

**Mobile (Touch)**

- **Tap Roll Dice**: Large roll button
- **Tap Continue**: Advance to next round
- **Auto-result** display of winner

**TV/Gamepad (D-Pad)**

- **OK Button**: Roll or continue
- **Back Button**: Menu

### Game Flow

1. **Game Starts**: "Cee-Lo — Best of [3/5/7] — Your Turn!"
2. **Roll Button Ready**: Large, prominent
3. **Click Roll**:
   - 3 dice animate/roll
   - Results appear (e.g., 2-4-6)
4. **System Evaluates**:
   - Checks for instant wins/losses
   - Calculates hand value
5. **Display Result**:
   - **"NATURAL! YOU WIN!"** (4-5-6)
   - **"TRIP SIXES! YOU WIN!"** (6-6-6)
   - **"SNAKE EYES... YOU LOSE"** (1-1-x)
   - **"Your hand: 6 (highest die)"** (comparison hand)
6. **Compare** (if not instant):
   - All players shown with their dice
   - Winner highlighted
7. **Score Update**: Points table updated
8. **Next Round**: "Continue?" button
9. **Game End**: "You win 4-1! Rematch?"

### Scoring

- **Per Round Win**: 1 point
- **Best of 3**: First to 2 points
- **Best of 5**: First to 3 points
- **Best of 7**: First to 4 points
- **Game Winner**: Declared when one player hits threshold

## 🏗️ Architecture

This is an **EARLY STAGE** implementation (58% complete) focusing on simple hand evaluation.

### Domain Layer (`src/domain/`)

**Core Concepts**:

- `Dice` = [1-6, 1-6, 1-6]
- `Hand` = { dice: Dice, strength: 'instant-win'|'instant-loss'|'comparison', value: number }
- `Round` = { playerHands: Hand[], winner: Player }
- `Player` = { name, roundWins: number }
- `GameState` = { players[], currentRound: number, gameOver: boolean }

**Key Files**:

- `types.ts` — Dice, Hand, Round, Player types
- `rules.ts` — Hand evaluation logic
- `evaluation.ts` — Determine instant wins/losses and hand strength
- `comparison.ts` — Compare hands (highest die, sum-based)
- `ai.ts` — AI rolls (no decision, die are auto-rolled)

**Core Logic**:

```typescript
// Evaluate a 3-dice hand
function evaluateHand(dice: [number, number, number]): Hand

// Check for triple
function isTriple(dice: [number, number, number]): number | null

// Check for natural (4-5-6)
function isNatural(dice: [number, number, number]): boolean

// Check for snake eyes (1-1-x)
function isSnakeEyes(dice: [number, number, number]): boolean

// Compare hands (return winner)
function compareHands(hand1: Hand, hand2: Hand): Hand

// Determine round winner
function determineRoundWinner(playerHands: Hand[]): Player
```

### App Layer (`src/app/`)

**Custom Hooks**:

- `useCeeLoGame()` — Game state, rounds
- `useAI()` — 1-3 AI players (auto-roll)

**Services**:

- `playerService.ts` — Track scores
- `handEvalService.ts` — Evaluate hands
- `storageService.ts` — Game history

### UI Layer (`src/ui/`)

**Organisms**:

- `CeeLoGame` — Main game container
- `DiceDisplay` — 3 dice shown
- `PlayerHands` — All players' dice and results
- `ScoreBoard` — Win count per player

**Molecules**:

- `Die` — Single die (1-6)
- `ResultBanner\*\* — "YOU WIN!" or "NATURAL!" or "SNAKE EYES"
- `HandEvaluation` — Display hand strength (instant-win, etc.)
- `RoundScore\*\* — Points for this round

**Atoms**:

- `Button` — Roll, continue
- `ScoreText` — Points display
- `WinnerBadge` — Highlight winner

## ✅ Development Status

**Completion**: 58% ⏳ (Early Stage)  
**Core Rules**: Basic hand evaluation implemented  
**AI**: Auto-roll, no AI decision-making

**What's Done**:

- ✅ 3-die rolling
- ✅ Instant win detection (triples, natural)
- ✅ Instant loss detection (snake eyes)
- ✅ Hand evaluation (value calculation)
- ✅ Hand comparison
- ✅ Round winner determination
- ✅ Multi-round tracking
- ✅ AI players (auto-roll)
- ✅ Score tracking (best of 3/5/7)
- ✅ Mobile UI

**In Progress**:

- ⏳ Enhanced hand descriptions
- ⏳ Sound effects (die roll, win fanfare)

**TODO**:

- ❌ Difficulty levels for AI
- ❌ Betting mechanics (real gameplay)
- ❌ Advanced hand rankings (complex variants)
- ❌ Leaderboard
- ❌ Pass-and-play local multiplayer

## 🚀 Getting Started

```bash
pnpm install
pnpm --filter @games/cee-lo dev
pnpm --filter @games/cee-lo test
```

---

**Last Updated**: April 6, 2026  
**Maturity**: Early Stage (58% complete)  
**Platforms**: Web, Electron, iOS, Android
