# Shut the Box

A classic push-your-luck dice game where you roll two dice and must close numbered boxes (1-9) that match or sum to your roll. Close all boxes before the game stops you—or be blocked and lose. Simple rules, strategic decisions.

## 🎮 Quick Start

1. **Game Board**: 9 numbered boxes (1-9), all open
2. **Roll Dice**: Roll 2 dice
3. **Match or Sum**: Must close box(es) totaling the dice sum
   - Rolled 7? Close box 7 OR boxes 3+4 OR boxes 2+5, etc.
   - Rolled 5? Close box 5 OR boxes 2+3, etc.
4. **Close Boxes**: Remove those boxes from play
5. **Roll Again**: Continue rolling until...
   - **You close all boxes**: WIN! Score = 0 (best)
   - **You can't match roll**: STOP. Score = sum of open boxes (worst)
6. **Lowest total score after all rounds wins**

## 📖 Game Rules

**Objective**: Close all 9 boxes. If you can't, minimize your score.

**Players**: 2-4 (including you, rest AI)  
**Boxes**: 1-9 (all start open)  
**Rounds**: Everyone gets one turn

**Turn Sequence**:

1. **Roll Two Dice**: 2d6 dice, get sum (2-12)
2. **Must Eliminate Boxes**: Find combination of open boxes equaling the dice sum
   - Examples:
     - Roll 7 → close [7] OR [3,4] OR [2,5] OR [1,6]
     - Roll 6 → close [6] OR [1,5] OR [2,4]
     - Roll 2 → close [2] OR [1,1] (if both 1s available)
3. **Cannot Match?**: STOP. You're blocked.
   - Boxes can't combine to equal rolled sum
   - Turn over, score = sum of remaining open boxes
4. **Close Boxes**: Remove selected boxes
5. **Roll Again**: If you successfully closed boxes, roll again
6. **Repeat Until**:
   - All 9 boxes closed → WIN (great round!)
   - Can't match roll → STOP (score your remaining)

**Scoring**:

- **All 9 closed**: Score = 0 (best possible)
- **Some open**: Score = sum of remaining boxes
- **Lower score is better** (opposite of many games)

**Example Game**:

1. Roll: 8 → Close [8] → Boxes open: [1,2,3,4,5,6,7,9]
2. Roll: 6 → Close [6] → Boxes open: [1,2,3,4,5,7,9]
3. Roll: 11 → Can't match (max combo = 5+9=14, but must use [7,9,4,2,1] combos... actually CAN make 11 from [7,4] or [2+9]) → If can't match, STOP
4. Final score = sum of [1,2,3,5,9] = 20

## 🎯 How to Play

### Controls

**Desktop (Keyboard + Mouse)**

- **Click Roll Button**: Roll the 2 dice
- **Click Boxes**: Select boxes to close (multi-select)
- **Click Confirm**: Lock your selection
- **Click Stop**: End turn (if you want to quit early, rare)
- **Space**: Roll
- **Click**: Select boxes
- **Enter**: Confirm
- **Escape**: Menu

**Mobile (Touch)**

- **Tap Roll**: Roll button (large, centered)
- **Tap Boxes**: Select which to close (highlight shows selection)
- **Tap Confirm**: Lock in selection and continue
- **Tap Stop**: End turn (optional early exit)

**TV/Gamepad (D-Pad)**

- **OK Button**: Roll, confirm selection, or continue
- **Left/Right D-Pad**: Cycle through boxes
- **A Button**: Select/deselect box
- **B Button**: Stop turn, back/menu
- **Y Button**: Confirm

### Game Flow

1. **Game Starts**: Board shows 9 boxes [1][2][3][4][5][6][7][8][9] — all open
2. **Roll Dice**: Click roll button
   - 2 dice shown, sum calculated (e.g., "Total: 8")
3. **System Shows Options**: Highlights all possible box combinations:
   - "You can close: [8] OR [3,5] OR [2,6]"
4. **You Select**: Click which boxes to close (e.g., click [8])
   - Boxes lock as "closed" (grayed, struck-through, or removed)
5. **Confirmed**: "Turn Score: 0" (running total)
6. **Decision**:
   - **Roll Again**: Risk another roll or stop?
   - **Stop**: End turn, lock in score (if you want to save and not risk)
   - **Automatic Stop**: If you can't match the roll
7. **Next Roll** (if continuing):
   - Same process with remaining open boxes
8. **Turn Ends**:
   - All boxes closed → "Perfect! Score: 0" → Next player
   - Can't match → "You're blocked! Score: 23" → Next player
9. **Game End**: After all players, scores compared
   - Lowest score wins (most boxes closed)
   - "Player A wins with 5 points!"
   - Rematch option

### Scoring Display

- **Your Score This Round**: Sum of boxes still open
- **All Players' Scores**: Compared at end
- **Winning**: Lowest score

## 🏗️ Architecture

This is a **MATURE** implementation (76% complete) focusing on box combination matching and strategic stopping.

### Domain Layer (`src/domain/`)

**Core Concepts**:

- `Dice` = [1-6, 1-6]
- `Box` = { number: 1-9, open: boolean }
- `BoardState` = { boxes: Box[] }
- `Turn` = { diceSum: number, closedBoxes: Box[], score: number }
- `Player` = { name, finalScore: number }
- `GameState` = { players[], activePlayer, gameOver }

**Key Files**:

- `types.ts` — Dice, Box, BoardState, Turn, Player types
- `rules.ts` — Dice rolling
- `combinatorics.ts` — Find all box combinations matching dice sum
- `evaluation.ts` — Check if turn is possible
- `scoring.ts` — Calculate turn score (sum of remaining boxes)
- `ai.ts` — AI decision (stop/continue)

**Core Logic**:

```typescript
// Find all valid box combinations for a dice sum
function findValidCombinations(sum: number, openBoxes: Box[]): Box[][]

// Check if any combination exists
function canMatch(sum: number, openBoxes: Box[]): boolean

// Calculate score (sum of open boxes)
function calculateScore(openBoxes: Box[]): number

// AI decision: stop or continue rolling
function decideStopOrContinue(currentScore: number, openBoxCount: number): 'stop' | 'continue'

// Evaluate board state
function isBoardClear(boxes: Box[]): boolean
```

### App Layer (`src/app/`)

**Custom Hooks**:

- `useShutTheBoxGame()` — Game state, board management
- `useAI()` — 1-3 AI players
- `useCombinationFinder()` — Real-time combo detection

**Services**:

- `boardService.ts` — Manage open/closed boxes
- `combinationService.ts` — Find valid combinations
- `strategyService.ts` — AI stop/continue decisions
- `scoringService.ts` — Calculate scores
- `storageService.ts` — Game history

### UI Layer (`src/ui/`)

**Organisms**:

- `ShutTheBoxGame` — Main game container
- `GameBoard` — 9 boxes, visual state (open/closed)
- `DiceDisplay` — 2 dice and sum
- `ScoreBoard` — All players' final scores
- `CombinationOptions` — List of valid box combos

**Molecules**:

- `Box` — Single numbered box (clickable, state-aware)
- `Die` — Single die
- `CombinationLine` — Show one combo option with checkboxes
- `ScoreDisplay` — Current running score
- `RollButton` — Primary action button

**Atoms**:

- `Button` — Roll, confirm, stop
- `Checkbox` — Select boxes
- `NumberDisplay` — Box value or dice sum
- `OpenBox` / `ClosedBox` — Visual states
- `ScoreText` — Points display

## ✅ Development Status

**Completion**: 76% ✅ (Mature)  
**Core Rules**: Fully implemented  
**AI**: Working with 1-3 AI opponents

**What's Done**:

- ✅ 2-die rolling
- ✅ Box representation (1-9)
- ✅ Open/closed state management
- ✅ Combination finding (all possible box sets for dice sum)
- ✅ Turn validation (can match or blocked)
- ✅ Score calculation
- ✅ Turn management (2-4 players)
- ✅ Round completion and scoring
- ✅ Win condition (all boxes or lowest remaining)
- ✅ AI players (medium difficulty)
- ✅ Mobile-responsive board

**In Progress**:

- ⏳ Difficulty levels (AI aggression in stop/continue)
- ⏳ Sound effects (die roll, box close, win fanfare)

**TODO**:

- ❌ Advanced visuals (smooth box removal animations)
- ❌ Leaderboard and statistics
- ❌ Tournament mode
- ❌ Pass-and-play local multiplayer

## 🚀 Getting Started

```bash
pnpm install
pnpm --filter @games/shut-the-box dev
pnpm --filter @games/shut-the-box test
```

---

**Last Updated**: April 6, 2026  
**Maturity**: Mature (76% complete)  
**Platforms**: Web, Electron, iOS, Android
