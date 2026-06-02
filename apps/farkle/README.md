# Farkle

A high-stakes dice game where you roll 6 dice each turn, set aside scoring combinations, and decide whether to keep rolling for more points or bank what you have. Roll nothing but non-scoring dice? You farkle (lose all points this turn). First to 10,000 points wins.

## 🎮 Quick Start

1. **Roll 6 Dice**: All 6 at once
2. **Spot Combinations**: Some dice form scoring patterns:
   - **1s** = 100 points each (or 300 for triple 1s)
   - **5s** = 50 points each (or 500 for triple 5s)
   - **Three-of-a-kind** = 100 × face value (except 1s/5s handled above)
   - **Straights & Full House**: 1,500 points
3. **Set Aside Scoring Dice**: Remove them from your roll
4. **Roll Remaining Dice**: Keep rolling the non-scoring dice
5. **Decision Each Turn**: Bank points (safe) or keep rolling (risk farkle)
6. **Farkle**: If no dice score, lose all points THIS ROUND
7. **First to 10,000**: Wins

## 📖 Game Rules

**Objective**: First to 10,000 points wins

**Players**: 2-6 (including you, rest AI)  
**Dice**: 6 dice per turn  
**Rounds**: Continuous until someone hits 10,000

**Turn Sequence**:

1. **Roll**: Roll all 6 dice (or remaining after setting aside scoring ones)
2. **Identify Scoring Combinations**:
   - **Singles**:
     - **1** = 100 points (per die)
     - **5** = 50 points (per die)
     - **2, 3, 4, 6** = 0 points (not scoring)
   - **Three-of-a-Kind** (3+ of same number):
     - **1s × 3** = 1,000 points (not 300, special case)
     - **2s × 3** = 200 points
     - **3s × 3** = 300 points
     - **4s × 3** = 400 points
     - **5s × 3** = 500 points
     - **6s × 3** = 600 points
     - **4+ of a kind**: Double the 3-of-a-kind value (e.g., 4 ones = 2,000)
   - **Special Combinations**:
     - **Straight** (1-2-3-4-5-6): 1,500 points
     - **Full House** (3 of one, 2 of another): 1,500 points
     - **Three Pairs**: 1,500 points
3. **Set Aside One Combination**: You must select at least one scoring combination
4. **Calculate Points**: Add selected combination's value to your turn score
5. **Decision**:
   - **Bank (Hold)**: Add turn score to total, next player
   - **Roll Again**: Risk rolling remaining dice. If new roll scores, add to turn. If not, farkle (lose all).
6. **Continue**: Until you farkle or hold
7. **Farkle**: Rolling non-scoring dice means turn score = 0, next player
8. **Win**: First to 10,000 points

**No Combinations to Set Aside?**:

- If you must set aside at least 1 combination, but you rolled all non-scoring dice
- This is a **farkle** → turn score = 0, next player

## 🎯 How to Play

### Controls

**Desktop (Keyboard + Mouse)**

- **Click Roll Button**: Roll (6 or remaining dice)
- **Click Dice**: Select scoring dice to set aside (multi-select)
- **Click Confirmed Selection**: Locks in your chosen combinations
- **Click Hold**: Bank your points
- **Click Roll Again**: Continue rolling
- **Space**: Roll
- **Enter**: Confirm selection
- **Escape**: Menu

**Mobile (Touch)**

- **Tap Roll**: Roll button (large, centered)
- **Tap Dice**: Select which to set aside (highlight shows selection)
- **Tap Confirm**: Lock in selection
- **Tap Hold/Bank**: Safe exit, add points to total
- **Tap Continue**: Roll remaining dice

**TV/Gamepad (D-Pad)**

- **OK Button**: Roll, confirm, or hold (context-dependent)
- **Left/Right D-Pad**: Cycle through available combinations
- **A Button**: Select/deselect combination
- **B Button**: Back/menu
- **Y Button**: Banking/hold

### Game Flow

1. **Game Starts**: "Your Turn — Roll 6 Dice"
2. **Roll**: Click Roll button
   - 6 dice animate and land
   - Individual dice show (1-6)
3. **System Scans**: Highlights and lists all possible scoring combinations:
   - "1 × 2 = 200 points"
   - "5 × 1 = 50 points"
   - "Straight = 1,500 points" (if applicable)
4. **You Select**: Click which combination to set aside
   - Selected dice are marked/removed from rolling pool
   - Selected dice show as "locked"
5. **Calculate**: "Turn Score: 250 points"
6. **Decision**:
   - **Hold**: "Add to total? YES/NO"
     - If YES: Points bank permanently, next player
   - **Roll Again**: Roll remaining dice
7. **Next Roll**:
   - Only non-set-aside dice roll
   - Same process: identify combos, select, decide
8. **Farkle Scenario**:
   - Roll all remaining dice and **no scores** appear
   - System: "FARKLE! You lose all points this round."
   - Turn score = 0, next player
9. **Win**: When your total hits 10,000
   - "You Win with 10,150 points!"
   - Celebration, rematch option

### Scoring Reference Card

| Combination    | Points |
| -------------- | ------ |
| 1 (single)     | 100    |
| 5 (single)     | 50     |
| 1 × 3          | 1,000  |
| 2 × 3          | 200    |
| 3 × 3          | 300    |
| 4 × 3          | 400    |
| 5 × 3          | 500    |
| 6 × 3          | 600    |
| Straight (1-6) | 1,500  |
| Full House     | 1,500  |
| Three Pairs    | 1,500  |

## 🏗️ Architecture

This is a **DEVELOPING** implementation (67% complete) focusing on combination detection and risk management.

### Domain Layer (`src/domain/`)

**Core Concepts**:

- `Dice` = [1-6, 1-6, 1-6, 1-6, 1-6, 1-6]
- `Combination` = { type: 'single'|'threeOfAKind'|'straight'|'fullHouse', value: number, dice: number[] }
- `Turn` = { score: number, dice: number[], selectedCombinations: Combination[] }
- `Player` = { name, totalScore: number }
- `GameState` = { players[], currentPlayer, gameOver }

**Key Files**:

- `types.ts` — Dice, Combination, Turn, Player types
- `rules.ts` — Dice rolling
- `combinations.ts` — Detect all valid scoring combinations
- `scoring.ts` — Calculate points for combination
- `ai.ts` — AI decision (fold/roll again)

**Core Logic**:

```typescript
// Detect all scoring combinations from dice
function findCombinations(dice: number[]): Combination[]

// Calculate points for a combination
function scoreCombo(combo: Combination): number

// Validate turn (must select at least 1 combo)
function validateTurn(selectedCombos: Combination[]): boolean

// Check for farkle
function isFarkle(dice: number[], selectedCombos: Combination[]): boolean

// AI decision logic
function decideAIAction(
  totalScore: number,
  turnScore: number,
  availableCombos: Combination[],
): 'hold' | 'roll'
```

### App Layer (`src/app/`)

**Custom Hooks**:

- `useFarkleGame()` — Game state, turn tracking
- `useAI()` — 1-5 AI players
- `useCombinationDetection()` — Real-time combo scanning

**Services**:

- `playerService.ts` — Player tracking
- `combinationService.ts` — Combo detection and scoring logic
- `strategyService.ts` — AI fold/roll decisions
- `storageService.ts` — Game history

### UI Layer (`src/ui/`)

**Organisms**:

- `FarkleGame` — Main game container
- `DiceDisplay` — 6 dice (selectable, with lock state)
- `CombinationsList` — All available combos with point values
- `ScoreBoard` — All players' scores
- `TurnPanel` — Current turn score, roll/hold buttons

**Molecules**:

- `Die` — Single die with selection state
- `CombinationOption` — Combo + points + checkbox
- `RollButton` — Primary action
- `HoldButton` — Banking action
- `FarkleAlert` — Big alert when farkle occurs

**Atoms**:

- `Button` — Roll, hold, confirm
- `Checkbox` — Select combinations
- `ScoreText` — Point display
- `DiceImage` — Visual die representation
- `Alert` — Farkle notification

## ✅ Development Status

**Completion**: 67% ✅ (Developing)  
**Core Rules**: Fully implemented  
**AI**: Working with 1-5 AI opponents

**What's Done**:

- ✅ 6-die rolling
- ✅ Combination detection (singles, three-of-a-kind, straights, full house, three pairs)
- ✅ Scoring calculation
- ✅ Turn score accumulation
- ✅ Multi-select dice (set aside)
- ✅ Farkle detection
- ✅ Player turns (2-6 players)
- ✅ Win condition (10,000 points)
- ✅ AI players (simple threshold-based)
- ✅ Mobile-responsive UI

**In Progress**:

- ⏳ Difficulty levels (AI aggression)
- ⏳ Sound effects (dice roll, farkle buzzer, celebration)
- ⏳ Combination highlighting (visual feedback)

**TODO**:

- ❌ Advanced AI (probability-based decisions)
- ❌ Tournament/ladder mode
- ❌ Pass-and-play for local multiplayer
- ❌ Leaderboard and statistics

## 🚀 Getting Started

```bash
pnpm install
pnpm --filter @games/farkle dev
pnpm --filter @games/farkle test
```

---

**Last Updated**: April 6, 2026  
**Maturity**: Developing (67% complete)  
**Platforms**: Web, Electron, iOS, Android
