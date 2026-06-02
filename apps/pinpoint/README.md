# Pinpoint

A dice and target game where you roll dice trying to match specific point targets. Each round has a target score you must hit exactly—score more and you bust. Strategic risk management: get close to the target or play it safe. First to 10 rounds wins.

## 🎮 Quick Start

1. **Target**: Each round has a target score (3, 5, 7, 10, etc.)
2. **Roll Dice**: Roll 1-3 dice (your choice each turn how many)
3. **Match Target**:
   - **Exactly match**: Win the round! ✓
   - **Go over**: Bust! Lose the round ✗
   - **Under**: Can roll again or pass
4. **Each Roll**: Add to your cumulative score this round
5. **Decision**: Keep rolling more dice or stand with what you have?
6. **First to 10 Rounds**: Wins the game

## 📖 Game Rules

**Objective**: Win 10 rounds by hitting targets without going over

**Players**: 2-4 (including you, rest AI)  
**Dice**: 1d6 (1 die per roll, can choose to roll 1, 2, or 3 dice per turn)  
**Rounds**: First to win 10 rounds  
**Targets**: Vary each round (3, 5, 7, 10, 12, 15, 20, etc.)

**Turn Sequence**:

1. **Round Starts**: Shows current target (e.g., "Target: 12")
2. **Rolling Decision**: How many dice to roll?
   - **Roll 1 die**: Safe (low score per roll, but can re-roll)
   - **Roll 2 dice**: Medium risk (higher points per roll)
   - **Roll 3 dice**: High risk (highest points per roll)
3. **Roll Dice**: Roll selected number of dice, sum them
4. **Add to Score**: Current round score += dice sum
5. **Check Result**:
   - **Exactly match target**: WIN ROUND! ✓
   - **Over target**: BUST! Lose round, 0 points. Next player. ✗
   - **Under target**: Continue rolling or Stand
6. **Continue or Stand**:
   - **Roll Again**: Choose 1-3 dice, roll again, add points
   - **Stand**: Concede round, 0 points, next player (you didn't hit target)
7. **Next Player**: Either won round (1 point to win total) or busted

**Example Round**:

- Target: 15
- Roll 1 die → 4 (round score = 4)
- Roll 2 dice → 5+3=8 (round score = 12)
- Roll 1 die → 3 (round score = 15) → **WIN!**

**Example Bust**:

- Target: 15
- Roll 2 dice → 6+5=11 (round score = 11)
- Roll 2 dice → 6+4=10 (round score = 21) → **BUST! Over target.**

## 🎯 How to Play

### Controls

**Desktop (Keyboard + Mouse)**

- **Click 1D, 2D, or 3D Button**: Choose number of dice to roll
- **Click Roll**: Roll the selected dice
- **Click Stand**: Stop rolling, pass turn
- **1/2/3 Keys**: Quick select dice count
- **Space**: Roll
- **S**: Stand
- **Escape**: Menu

**Mobile (Touch)**

- **Tap 1D / 2D / 3D**: Select number of dice (three large buttons)
- **Tap Roll**: Roll button (large, centered)
- **Tap Stand**: Stop rolling button
- **Auto-feedback** showing score and target progress

**TV/Gamepad (D-Pad)**

- **Left/Right D-Pad**: Cycle dice count (1-3)
- **OK Button**: Roll or confirm
- **B Button**: Stand/pass
- **Back Button**: Menu

### Game Flow

1. **Game Starts**: "Pinpoint — First to 10 Rounds — Round 1/10"
2. **Target Shown**: Large display: "🎯 TARGET: 12"
3. **Dice Selection**: Three buttons: [1D] [2D] [3D]
4. **You Select**: Click [2D] (for example)
5. **Roll Dice**: Click Roll button
   - 2 dice animate
   - Result shown: "6 + 4 = 10" → "Round Score: 10"
6. **Check Status**:
   - "You need 2 more to hit 12"
   - Buttons: [Roll Again] [Stand]
7. **Decision**:
   - **Roll Again**: Select 1/2/3 dice, roll again
     - If add to 12 exactly: "YOU WIN! Round 1!"
     - If over 12: "BUST! You went over. Round over."
   - **Stand**: "You gave up on Round 1. Next player."
8. **Next Round**: After winner/bust, proceed to Round 2
   - New target may appear
   - Next player's turn
9. **Game End**: When someone wins 10 rounds
   - "You win the game 10-7!"
   - Rematch option

### Scoring Tracker

- **Rounds Won**: Your wins vs. AI wins (e.g., "You: 4, AI: 3")
- **Current Round Target**: Clear display
- **Round Score**: Your cumulative points in current round
- **Round Status**: "Under target", "On track", "BUST!"

## 🏗️ Architecture

This is a **MATURE** implementation (75% complete) focusing on target-based scoring and risk management.

### Domain Layer (`src/domain/`)

**Core Concepts**:

- `Dice` = [1-6] (1-3 dice per roll)
- `Target` = number (3-25)
- `RoundScore` = { current: number, target: number, diceHistory: [] }
- `Player` = { name, roundsWon: number }
- `GameState` = { players[], currentRound: 1-10, gameOver: boolean }

**Key Files**:

- `types.ts` — Dice, Target, RoundScore, Player types
- `rules.ts` — Dice rolling
- `targets.ts` — Target sequence for rounds
- `scoring.ts` — Score calculation and bust detection
- `ai.ts` — AI decision (how many dice, when to roll/stand)

**Core Logic**:

```typescript
// Roll N dice
function rollDice(count: 1 | 2 | 3): number[]

// Check round result
function checkRoundResult(currentScore: number, target: number): 'win' | 'bust' | 'continue'

// Calculate next scores
function calculateScoreUpdate(currentScore: number, newDice: number[]): number

// Determine round winner
function determineRoundWinner(players: Player[], roundResults: boolean[]): Player

// AI decision logic
function decideAIAction(
  currentScore: number,
  target: number,
  riskTolerance: number,
): 'roll' | 'stand'
```

### App Layer (`src/app/`)

**Custom Hooks**:

- `usePinpointGame()` — Game state, round management
- `useAI()` — 1-3 AI players with difficulty levels
- `useTargetSequence()` — Generate round targets

**Services**:

- `playerService.ts` — Manage rounds won
- `roundService.ts` — Round state
- `scoreService.ts` — Score calculation
- `targetService.ts` — Target generation (easy/medium/hard sequences)
- `strategyService.ts` — AI decision making
- `storageService.ts` — Game history

### UI Layer (`src/ui/`)

**Organisms**:

- `PinpointGame` — Main game container
- `DiceSelector` — 1D/2D/3D buttons
- `TargetDisplay` — Large target score
- `RoundScore\*\* — Running score for current round
- `RoundsLeaderboard` — Rounds won by each player

**Molecules**:

- `DiceButtons\*\* — [1D] [2D] [3D] selector
- `Die` — Individual die display
- `ScoreProgress\*\* — Bar or text showing distance to target
- `RollButton` — Primary action
- `StandButton` — Concede round button

**Atoms**:

- `Button` — Roll, stand, dice selector
- `TargetText` — "Target: 12"
- `ScoreText` — Round score display
- `DiceSum` — "6 + 4 = 10"
- `RoundIndicator` — "Round 5 / 10"

## ✅ Development Status

**Completion**: 75% ✅ (Mature)  
**Core Rules**: Fully implemented  
**AI**: Working with 1-3 AI opponents

**What's Done**:

- ✅ 1-3 die rolling (configurable)
- ✅ Target generation
- ✅ Score accumulation per round
- ✅ Bust detection (over target)
- ✅ Win detection (exact match)
- ✅ Turn management (2-4 players)
- ✅ Round tracking (first to 10)
- ✅ AI players (medium difficulty)
- ✅ Score display and leaderboard
- ✅ Mobile-responsive UI

**In Progress**:

- ⏳ Difficulty levels (AI risk profiles)
- ⏳ Sound effects (dice roll, win fanfare, bust sound)
- ⏳ Target variety (difficulty-based sequences)

**TODO**:

- ❌ Advanced visual feedback (progress bar to target)
- ❌ Statistics and history
- ❌ Leaderboard
- ❌ Pass-and-play local multiplayer

## 🚀 Getting Started

```bash
pnpm install
pnpm --filter @games/pinpoint dev
pnpm --filter @games/pinpoint test
```

---

**Last Updated**: April 6, 2026  
**Maturity**: Mature (75% complete)  
**Platforms**: Web, Electron, iOS, Android
