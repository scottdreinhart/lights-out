# Chicago

A dice game where you progress through target scores each round: in round 1, hit a target of 2; in round 2, hit 3; continuing through 12. Each target is the sum of two dice. Miss the target and you score 0 for the round. Hit it and you score the value. First to complete all 11 rounds (and have highest total score) wins.

## 🎮 Quick Start

1. **Current Target**: Start with target 2 (round 1), progress to 12 (round 11)
2. **Roll Two Dice**: Roll and sum the values
3. **Hit Target?**:
   - **Exactly match**: Score the target value!
   - **Miss**: Score 0 this round
4. **Each Round**: Roll as many times as you want (trying to hit target)
5. **Once You Hit**: Round ends, move to next target
6. **All Rounds**: Complete all 11 targets (2 through 12)
7. **Winner**: Highest total score after round 12

## 📖 Game Rules

**Objective**: Complete all 11 rounds (targets 2-12) with highest score

**Players**: 2-4 (including you, rest AI)  
**Dice**: 2d6 per roll  
**Rounds**: 11 (one per target: 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12)  
**Scoring**: Hit target = score target value; miss = score 0

**Turn Sequence**:

1. **Round Starts**: Display current target (e.g., "Target: 7")
2. **Roll Dice**: Roll 2d6, sum them
3. **Check Result**:
   - **Match target**: SCORE! Round ends. Score += target value.
   - **Doesn't match**: Keep rolling or pass
4. **Pass Option**:
   - If you don't want to keep rolling → Pass
   - Round ends, score 0 for this round
5. **Next Player's Turn**: New player attempts same target
6. **Moving On**: After all players attempt target, advance to next round
7. **Continue**: Repeat for all 11 targets (2 through 12)
8. **Game End**: After round 12 (target=12), whoever has highest score wins

**Scoring by Round**:

- Round 1 (target 2, min sum): Hit 2 = +2 points
- Round 2 (target 3): Hit 3 = +3 points
- Round 7 (target 8): Hit 8 = +8 points
- Round 11 (target 12, max sum): Hit 12 = +12 points

**Strategic Decisions**:

- **Keep rolling**: Try to hit target (or risk busting at 13+)
- **Pass**: Concede this round, score 0, move on
- **Early targets** (2-7): Easier to roll, often hit
- **Late targets** (10-12): Harder to roll, fewer combinations

**Table of Combinations** (2d6):

- 2: 1 way (1+1)
- 3: 2 ways (1+2, 2+1)
- 4: 3 ways (1+3, 2+2, 3+1)
- 5: 4 ways
- 6: 5 ways
- 7: 6 ways (most common)
- 8: 5 ways
- 9: 4 ways
- 10: 3 ways
- 11: 2 ways (5+6, 6+5)
- 12: 1 way (6+6)

## 🎯 How to Play

### Controls

**Desktop (Keyboard + Mouse)**

- **Click Roll**: Roll two dice
- **Click Pass**: Admit defeat this round, score 0, next player
- **Click Continue**: Keep rolling (attempt next roll)
- **Space**: Roll
- **P**: Pass
- **C**: Continue
- **Escape**: Menu

**Mobile (Touch)**

- **Tap Roll**: Large roll button (two dice animate)
- **Tap Pass**: Pass button (smaller, secondary)
- **Tap Continue**: Continue rolling button
- **Visual feedback** showing two dice result and cumulative rolls

**TV/Gamepad (D-Pad)**

- **OK Button**: Roll == Continue
- **A Button**: Pass
- **Back Button**: Menu

### Game Flow

1. **Game Starts**: "Chicago — Round 1/11 — Target: 2"
2. **Players**: "You, AI-1, AI-2"
3. **Your Turn**:
   - Display: "Target: 2 | Your Rolls So Far: (none)"
   - Buttons: [Roll] [Pass]
4. **Roll #1**: Click [Roll]
   - Dice animate: "🎲 6 + 4 = 10"
   - Display: "This roll: 10 | Need: 2"
   - Buttons: [Roll Again] [Pass]
5. **Miss**: You got 10, target was 2
   - "Doesn't match! Keep rolling or pass?"
6. **Roll #2**: Click [Roll Again]
   - Dice: "🎲 1 + 1 = 2"
   - Display: "This roll: 2"
   - "✓ HIT! Score: +2"
7. **Round End**: You scored 2 points
   - "AI-1's turn for target: 2"
8. **Continue**: All players attempt target 2
   - After all 4 players done → Advance to Round 2 (target 3)
9. **Progress**: Display after each round: "Round 5/11 — You: 18, AI-1: 22, AI-2: 15"
10. **Final Round**: Round 11 (target 12)
    - Final Scores: "You: 58 | AI-1: 64 | AI-2: 51"
    - "AI-1 wins with 64 points!"
11. **Game End Options**:
    - Play again
    - Different difficulty (AI skill)
    - Return to menu

### Scoring Tracker

After each round:

- "Round 5/11 Complete"
- Scoreboard: "1. AI-1: 28 | 2. You: 25 | 3. AI-2: 18"
- Next target shown: "Next: Target 8"

## 🏗️ Architecture

This is a **DEVELOPING** implementation (68% complete) with progressive target-based dice rolling.

### Domain Layer (`src/domain/`)

**Core Concepts**:

- `Dice` = [1-6, 1-6] (two d6)
- `Target` = number (2-12, progression)
- `RollResult` = { dice: [1-6, 1-6], sum: 2-12, matchesTarget: boolean }
- `Round` = { targetValue: 2-12, rolls: RollResult[], playerScores: {} }
- `Player` = { name, totalScore: number, currentRoundScore: 0 }
- `GameState` = { players[], currentRound: 1-11, currentPlayerIndex: 0 }

**Key Files**:

- `types.ts` — Dice, Target, Round, Player, RollResult types
- `dice.ts` — Roll logic, two d6
- `targets.ts` — Target sequence (2-12)
- `scoring.ts` — Calculate score for round (hit = target value; miss = 0)
- `state.ts` — Game state management (round progression)
- `ai.ts` — AI decision (roll/pass based on difficulty)

**Core Logic**:

```typescript
// Roll 2d6
function rollDice(): [number, number]

// Check if sum matches target
function matchesTarget(sum: number, target: number): boolean

// Calculate round score
function calculateRoundScore(matched: boolean, target: number): number

// AI decision
function decideAIAction(
  currentTarget: number,
  difficulty: 'easy' | 'medium' | 'hard',
): 'roll' | 'pass'

// Advance to next round
function nextRound(gameState: GameState): GameState
```

### App Layer (`src/app/`)

**Custom Hooks**:

- `useChicagoGame()` — Game state, current target, rolls
- `useAI()` — 1-3 AI opponents with difficulty levels
- `useScrollerTarget()` — Target progression (2-12)

**Services**:

- `playerService.ts` — Player scores and state
- `roundService.ts` — Round management
- `scoreService.ts` — Score calculation
- `diceService.ts` — Dice rolling
- `strategyService.ts` — AI decision making
- `storageService.ts` — Game history

### UI Layer (`src/ui/`)

**Organisms**:

- `ChicagoGame` — Main game container
- `TargetDisplay` — Current target (2-12)
- `DiceDisplay` — Two dice with animation
- `RollHistoryPanel\*\* — Rolls in this round
- `ScoreboardPanel\*\* — All players and their scores
- `ControlPanel\*\* — Roll, Pass, Continue buttons

**Molecules**:

- `DiceRoll\*\* — Two animated dice
- `RollResult\*\* — Shows "6 + 4 = 10"
- `TargetIndicator\*\* — "Target: 7"
- `PlayerScore\*\* — Name and total score
- `RoundProgress\*\* — "Round 5/11"
- `ControlButton\*\* — Reusable action buttons

**Atoms**:

- `Die` — Single die (value 1-6)
- `Button` — Roll, pass, continue
- `ScoreText` — Score display
- `Text\*\* — Labels and instructions

## ✅ Development Status

**Completion**: 68% ✅ (Developing)  
**Core Rules**: Fully implemented  
**AI**: Working with 1-3 difficulty levels

**What's Done**:

- ✅ 2d6 dice rolling
- ✅ Target progression (2-12, 11 rounds)
- ✅ Hit detection and scoring
- ✅ Turn management (2-4 players)
- ✅ Round completion and advancement
- ✅ Score calculation and tracking
- ✅ AI players with rolls/pass decisions
- ✅ Game end detection
- ✅ Scoreboard and progress display

**In Progress**:

- ⏳ Difficulty levels (AI risk profiles)
- ⏳ Sound effects (dice roll, match, win)
- ⏳ Visual animations (dice rolling)

**TODO**:

- ❌ Strategy tips (probability display)
- ❌ Statistics and history
- ❌ Pass-and-play local multiplayer
- ❌ Tutorial for new players

## 🚀 Getting Started

```bash
pnpm install
pnpm --filter @games/chicago dev
pnpm --filter @games/chicago test
```

---

**Last Updated**: April 6, 2026  
**Maturity**: Developing (68% complete)  
**Platforms**: Web, Electron, iOS, Android
