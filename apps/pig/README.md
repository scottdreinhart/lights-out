# Pig Dice

A push-your-luck dice game where you roll to accumulate points, but roll a 1 and lose everything for that round. Race to 100 points—stay in or cash in? Simple rules, high tension.

## 🎮 Quick Start

1. **Your Turn**: Roll a single die
2. **If 2-6**: You score that many points on this turn (accumulate as you keep rolling)
3. **If 1**: You "pig out"—lose all points THIS ROUND and pass turn
4. **Decision**: Keep rolling (higher risk, higher reward) or **Hold** (bank points, safe)
5. **Held Points**: Added to total score permanently
6. **First to 100**: Wins

## 📖 Game Rules

**Objective**: First to 100 points wins

**Players**: 2-4 players (including you, rest AI)  
**Dice**: 1 die per turn  
**Rounds**: Continuous until someone reaches 100 points

**Turn Sequence**:

1. **Start Turn**: You have 0 points in current round (turn score)
2. **Roll Die**:
   - **Roll 2-6**: Add that amount to your turn score. Decide: roll again or hold?
   - **Roll 1**: Turn ends immediately. Lose all turn points (don't add to total). Pass to next player.
3. **Hold Decision**:
   - **Hold (Stop Rolling)**: Add turn score to your total score permanently. Next player's turn.
   - **Roll Again**: Risk another roll. Keep accumulating if you succeed. But if you roll 1, lose all turn points.
4. **Continue Rounds**: Next player takes a turn
5. **Win**: First to 100 points (or 50/75 in faster variants)

**Turn Point Accumulation**:

- Turn Score = points accumulated before holding
- Total Score = points banked/held from previous turns
- If you roll 1: Turn Score = 0 (lost), Next Player
- If you hold: Turn Score → add to Total Score, Next Player

**Example Turn**:

1. Roll: 4 → Turn Score = 4 (you can roll again or hold)
2. Roll: 3 → Turn Score = 7 (you can roll again or hold)
3. Hold → Total Score += 7, Next Player

**Alternate Turn With Bust**:

1. Roll: 5 → Turn Score = 5
2. Roll: 1 → Turn Score = 0 (you pig out!), Next Player

## 🎯 How to Play

### Controls

**Desktop (Keyboard + Mouse)**

- **Click Roll Button**: Roll the die
- **Click Hold Button**: Bank your turn score
- **Space**: Roll
- **H**: Hold
- **Escape**: Menu

**Mobile (Touch)**

- **Tap Roll**: Roll the die (large button)
- **Tap Hold**: Bank your points
- **Automatic feedback** showing roll result

**TV/Gamepad (D-Pad)**

- **OK/A Button**: Roll
- **B Button**: Hold
- **Back Button**: Menu

### Game Flow

1. **Game Starts**: Shows "Your Turn" with current total score
2. **Roll Die**: Click Roll button
   - Die animates
   - Result displayed (1-6 image or number)
3. **Check Result**:
   - **If you rolled 1**: "PIG OUT! Lose all this round's points. Turn over." → Auto-advance
   - **If you rolled 2-6**: "You rolled X! Turn score: Y. Roll again or Hold?"
4. **Make Decision**:
   - **Roll Again**: Risk piling on more points
   - **Hold**: Bank your turn score, next player
5. **AI Turns**: Other players roll automatically with simple AI (hold at safe threshold)
6. **Score Tracking**: Both "This Turn" and "Total Score" displayed
7. **Win Condition**: When someone hits 100 points
   - Winner name displayed
   - Celebration animation
   - Rematch option

### Scoring

- **This Turn**: Points accumulated (lost if you pig out)
- **Total Score**: Points banked permanently
- **Win Threshold**: 100 points (default)
- **Win Announcement**: "You won with 102 points!"

## 🏗️ Architecture

This is a **DEVELOPING** implementation (65% complete) focusing on turn management and risk/reward mechanics.

### Domain Layer (`src/domain/`)

**Core Concepts**:

- `DieRoll` = 1-6
- `Turn` = { score: number, isBust: boolean }
- `Player` = { name, totalScore: number, strategy: 'safe'|'aggressive' }
- `GameState` = { players[], currentPlayer, currentRound, gameOver }

**Key Files**:

- `types.ts` — DieRoll, Turn, Player, GameState types
- `rules.ts` — Die rolling, bust detection
- `scoring.ts` — Turn score calculation
- `ai.ts` — AI decision logic (hold at threshold)

**Core Logic**:

```typescript
// Roll 1 die (1-6)
function rollDie(): number

// Check for bust (pig out)
function isBust(roll: number): boolean

// Calculate turn score
function calculateTurnScore(rolls: number[]): number

// Determine if turn is over
function shouldEndTurn(turnScore: number, rolls: number[]): boolean

// AI decision: roll again or hold
function decideAIAction(
  totalScore: number,
  turnScore: number,
  strategy: 'safe' | 'aggressive',
): 'roll' | 'hold'
```

### App Layer (`src/app/`)

**Custom Hooks**:

- `usePigGame()` — Game state, player turns
- `useAI()` — 1-3 AI players with decision logic
- `useRiskCalculation()` — Win probability based on current state

**Services**:

- `playerService.ts` — Track players across rounds
- `strategyService.ts` — AI strategy for hold/roll decisions
- `storageService.ts` — Game history and statistics

### UI Layer (`src/ui/`)

**Organisms**:

- `PigGame` — Main game container
- `ScoreBoard` — All players' scores (total and turn)
- `DieDisplay` — Single die result
- `DecisionPanel` — Roll/Hold buttons with recommendation

**Molecules**:

- `Die` — Single die (1-6, shows pip pattern)
- `TurnScore` — Points accumulated this turn
- `RollButton` — Large, clickable roll icon
- `HoldButton` — Banking action button

**Atoms**:

- `Button` — Roll, Hold, Menu buttons
- `ScoreCounter` — Numerical display
- `DieImage` — Pip pattern or number
- `StatusText` — "PIG OUT!" or "Roll again?"

## ✅ Development Status

**Completion**: 65% ✅ (Developing)  
**Core Rules**: Fully implemented  
**AI**: Working with 1-3 AI opponents

**What's Done**:

- ✅ Die rolling (1-6)
- ✅ Bust detection (rolling 1)
- ✅ Turn score accumulation
- ✅ Hold/bank mechanics
- ✅ Player turns (2-4 players)
- ✅ Score tracking (turn + total)
- ✅ Win condition (100 points)
- ✅ AI players (simple threshold-based)
- ✅ Mobile-responsive UI
- ✅ Touch-friendly buttons

**In Progress**:

- ⏳ Difficulty levels (AI aggression)
- ⏳ Sound effects (die roll, pig oink on bust)

**TODO**:

- ❌ Variant rules (50/75 point wins)
- ❌ Tournament mode
- ❌ Pass-and-play multiplayer
- ❌ Leaderboard

## 🚀 Getting Started

```bash
pnpm install
pnpm --filter @games/pig dev
pnpm --filter @games/pig test
```

---

**Last Updated**: April 6, 2026  
**Maturity**: Developing (65% complete)  
**Platforms**: Web, Electron, iOS, Android
