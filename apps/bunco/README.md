# Bunco

A fast-paced dice party game where you roll dice each round trying to match the round number. Get 4-of-a-kind matches for big points. First to 21,000 points wins—it's chaotic, social, and easy to learn.

## 🎮 Quick Start

1. **Current Round**: You're trying to roll dice matching that number (round 1 = ones, round 2 = twos, etc)
2. **Roll Dice**: 3 dice, try to get dice showing the round number
3. **Matches**: Count only dice showing round number
4. **Scoring**:
   - **1-3 matching dice**: 1, 2, or 3 points (count of matches)
   - **4+ matching dice (Bunco!)**: 50 points!
5. **Keep Rolling**: If you score, roll again. If you don't score, pass to next player.
6. **Win**: First to 21,000 points

## 📖 Game Rules

**Objective**: First to 21,000 points wins.

**Players**: 2-8 players (including you, rest AI)  
**Dice**: 3 dice per player, rolled each turn  
**Rounds**: 6 rounds (each round tries for different number)

- Round 1 = ones (rolling for 1s)
- Round 2 = twos (rolling for 2s)
- Round 3 = threes
- Round 4 = fours
- Round 5 = fives
- Round 6 = sixes

**Turn Sequence**:

1. **Check Round**: What number are we rolling for? (displayed at top)
2. **Roll**: Roll 3 dice
3. **Count Matches**: Only count dice showing the current round number
   - If rolling for 1s, count only 1s. Ignore 2s, 3s, 4s, 5s, 6s.
4. **Score**:
   - **0 matches**: 0 points, turn passes
   - **1 match**: 1 point, roll again
   - **2 matches**: 2 points, roll again
   - **3 matches**: 3 points, roll again
   - **4+ matches (Bunco!)**: 50 points, roll again
5. **Continue Turn**: If you scored, roll again. If 0 points, next player.

**Rounds**:

- After each round ends (all players unable to score in their turns), move to next round
- Continue until someone reaches 21,000

**Bunco!**:

- Getting all 3 dice showing the target number = 50 points
- Exceptional score, grants extra roll
- Major celebration moment!

**Special Bonus**:

- Rolling triples of number ≠ round = sometimes bonus points (variant rule)

## 🎯 How to Play

### Controls

**Desktop (Keyboard + Mouse)**

- **Click Roll Button**: Roll the 3 dice
- **Click Pass Button**: Skip turn (or auto-passes if 0 points)
- **Space**: Roll or continue
- **Escape**: Menu

**Mobile (Touch)**

- **Tap Roll Dice**: Roll button (large, prominent)
- **Automatic pass** if you don't score
- **Tap Continue** to go to next player

**TV/Gamepad (D-Pad)**

- **OK Button**: Roll dice or continue
- **Back Button**: Menu

### Game Flow

1. **Round Start**: Shows current round number and target (e.g., "Round 1 - Roll for ONES")
2. **Your Turn Begins**:
   - 3 dice shown blank/face-down
   - Roll button highlighted
3. **Click Roll**:
   - Dice animate rolling
   - Results show (e.g., 1, 3, 1)
4. **Auto-Calculate**:
   - System counts matches (e.g., two 1s = 2 points)
   - Score appears: "+2"
5. **Result**:
   - **0 points**: "Pass to next player" → automatic transition
   - **1+ points**: "Roll again!" button highlights
6. **Keep Rolling**: If you scored, roll again with same dice
7. **AI Turns**: Other players roll automatically
8. **Round Transitions**: When round ends, moves to next round/number
9. **Game End**: When someone hits 21,000 points
   - Winner announced with celebration
   - Option to rematch

### Scoring

- **Score This Round**: Points accumulated
- **Total Score**: Cumulative across all 6 rounds
- **Turns Taken**: How many rolls you've had
- **Buncos Rolled**: Total 50-point hits
- **Round Efficienc**: Average points per turn

## 🏗️ Architecture

This is a **DEVELOPING** implementation (66% complete) focusing on multi-player turn management and scoring.

### Domain Layer (`src/domain/`)

**Core Concepts**:

- `Dice` = [1-6, 1-6, 1-6]
- `Round` = 1-6 (target number)
- `Player` = { name, score, rolls[] }
- `GameState` = { players[], currentRound, currentPlayer, gameOver }

**Key Files**:

- `types.ts` — Dice, Round, Player, GameState types
- `rules.ts` — Dice rolling, point calculation
- `scoring.ts` — Score evaluation for dice
- `ai.ts` — AI player logic (simple, non-strategic)

**Core Logic**:

```typescript
// Roll 3 dice
function rollDice(): [number, number, number]

// Count matching dice for round
function scoreRoll(dice: [number, number, number], round: number): number

// Check if Bunco (all 3 match)
function isBunco(dice: [number, number, number], round: number): boolean

// Advance to next round
function nextRound(game: GameState): GameState

// Check win condition
function isGameOver(game: GameState): boolean
```

### App Layer (`src/app/`)

**Custom Hooks**:

- `useBuncoGame()` — Game state, player management
- `useAI()` — 1-7 AI players
- `useScoring()` — Point calculation

**Services**:

- `playerService.ts` — Player tracking across rounds
- `storageService.ts` — Game history

### UI Layer (`src/ui/`)

**Organisms**:

- `BuncoGame` — Main game display
- `ScoreBoard` — All player scores
- `DiceDisplay` — 3 dice shown
- `RoundIndicator` — Current round and target

**Molecules**:

- `Die` — Single die (1-6)
- `ScoreDisplay` — Points for this roll
- `PlayerCard` — Player name and current score

**Atoms**:

- `Button` — Roll, Continue, Menu buttons
- `ScoreText` — Point display

## ✅ Development Status

**Completion**: 66% ✅ (Developing)  
**Core Rules**: Fully implemented  
**Multi-Player**: Working with 2-8 players

**What's Done**:

- ✅ Dice rolling (3 dice)
- ✅ Score calculation (matches for round)
- ✅ Bunco detection (50 points)
- ✅ Turn management (2-8 players)
- ✅ Round progression (1-6)
- ✅ Win condition (21,000 points)
- ✅ AI players (basic)
- ✅ Score tracking
- ✅ Mobile-responsive

**In Progress**:

- ⏳ Difficulty levels (AI skill)
- ⏳ Sound effects (dice roll, Bunco fanfare)

**TODO**:

- ❌ Tournament mode (multiple rounds)
- ❌ Pass-and-play for local players
- ❌ Leaderboard

## 🚀 Getting Started

```bash
pnpm install
pnpm --filter @games/bunco dev
pnpm --filter @games/bunco test
```

---

**Last Updated**: April 6, 2026  
**Maturity**: Developing (66% complete)  
**Platforms**: Web, Electron, iOS, Android
