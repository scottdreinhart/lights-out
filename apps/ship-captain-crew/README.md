# Ship, Captain, Crew

A classic dice game where you roll three dice up to three times trying to make the sequence 6→5→4 (Ship→Captain→Crew), then maximize the cargo (remaining die) to beat opponents' totals. Quick, strategic, and perfect for 2-4 players.

## 🎮 Quick Start

1. **Roll three dice** up to three times
2. **Lock in 6 (Ship)** on first die
3. **Lock in 5 (Captain)** on second die
4. **Lock in 4 (Crew)** on third die
5. **Maximize remaining dice** as your cargo score
6. **Win**: Highest cargo total wins the round!

## 📖 Game Rules

**Objective**: Roll Ship (6), Captain (5), Crew (4) in that order, then score highest with remaining dice.

**Equipment**: 3 six-sided dice

**Turn Sequence** (per player):

1. **Roll Phase**: Roll all 3 dice
2. **Lock Phase**: Set aside any dice you want to keep (Ship/Captain/Crew progress)
3. **Re-roll**: Roll remaining unlocked dice (up to 2 more times total)
4. **Scoring**: Calculate final score

**Game Progression**:

1. **Find Ship (6)**: Roll until you have 6 on one die, set it aside
2. **Find Captain (5)**: Once Ship is locked, roll for 5, set it aside
3. **Find Crew (4)**: Once Captain is locked, roll for 4, set it aside
4. **Maximize Cargo**: Remaining 2 dice add up to your score
   - If you never get all three (6-5-4): **Score = 0**

**Scoring Rules**:

- **Must have 6-5-4 sequence** to score anything
- **Cargo = sum of two remaining dice**
- Example: You roll 6, 5, 4, then two more rolls give 3 and 2
  - Your cargo = 3 + 2 = **5 points**
- **Highest cargo wins** (except in tournament mode, points accumulate)

**Three Rolls Maximum**:

- You get 3 rolls total per turn
- After 1st roll: Choose which dice to keep
- After 2nd roll: Decide what else to keep
- After 3rd roll: Final score is locked in

**Cargo Values**:

- **Best possible**: 6 + 5 = 11 (if 6-5-4 rolled and other two are 6-5)
- **Worst possible**: 0 (if you don't complete 6-5-4)
- **Average winning cargo**: 7-8 points

## 🎯 How to Play

### Controls

**Desktop (Keyboard + Mouse)**

- **Click Dice**: Click a die to toggle lock/unlock it
- **Click Roll Button**: Roll all unlocked dice
- **Space**: Quick roll (locked dice re-roll)
- **Click Confirm**: Lock in your final score
- **Escape**: Menu

**Mobile (Touch)**

- **Tap Dice**: Tap to lock/unlock that die
- **Tap Roll Button**: Roll remaining dice
- **Tap Confirm**: Accept your score
- **Menu Tap**: Settings/menu

**TV/Gamepad (D-Pad)**

- **D-Pad Left/Right**: Select dice
- **OK Button**: Lock/unlock dice, roll
- **Back Button**: Menu

### Game Flow

1. **Game Start**: All dice ready, "Roll to Start" message
2. **Player 1 Rolls**: Three dice show random values (1-6 each)
3. **Lock Phase**:
   - Identify which dice show 6, 5, 4
   - Click dice showing 6 first (to lock Ship)
   - Click remaining dice to lock what you want to re-roll
4. **First Re-roll**: Click Roll, remaining dice flip
5. **Check Progress**: Do you have 5 yet? Lock it if yes
6. **Second Re-roll**: Click Roll again
7. **Check Progress**: Do you have 4 yet? Lock it if yes
8. **Final Dice**: Remaining two dice show your cargo
9. **Confirm Score**: Click Confirm to lock in score
10. **Next Player**: Turn passes to next player
11. **Round End**: After all players, highest cargo wins round
12. **Repeat**: New rounds automatically, track wins

### Strategy Tips

**Early Rolls**:

- Focus on getting 6 first (Ship)
- It's hardest to find, use your rolls on it

**Mid Game**:

- Once you have 6-5, lock them down
- Concentrate rolls on getting 4 (Crew)

**Late Game**:

- Once you have 6-5-4, maximize remaining dice
- Reroll low values (1-2) if you have rolls left

**Blocking Opponents**:

- No blocking possible in this game
- Pure individual rolls and luck

## 🏗️ Architecture

This is a **DEVELOPING** implementation (76% complete) focusing on dice locking and scoring mechanics.

### Domain Layer (`src/domain/`)

**Core Types**:

- `Dice` = { value: 1-6, locked: boolean }
- `Player` = { name, score, rolled, isAI }
- `Turn` = { player, dice, rollCount, locked, score }
- `RoundState` = { players, currentPlayer, roundScores, winner }

**Key Files**:

- `types.ts` — Dice, Player, Turn, RoundState types
- `dice.ts` — Roll a single die, roll multiple dice
- `scoring.ts` — Calculate cargo value, validate 6-5-4 sequence
- `rules.ts` — Turn sequence, roll validation, locking
- `ai.ts` — AI player choices (which dice to lock)

**Core Logic**:

```typescript
// Roll single die or multiple
function rollDice(count: number): number[]

// Check if player has 6, 5, 4 sequence
function hasShipCaptainCrew(dice: Dice[]): boolean

// Calculate cargo from two remaining dice
function calculateCargo(dice: Dice[]): number

// Validate turn sequence
function isValidTurn(turn: Turn): boolean

// AI chooses which dice to lock
function aiChooseLock(dice: Dice[], rollCount: number): number[]
```

### App Layer (`src/app/`)

**Custom Hooks**:

- `useShipCaptainCrew()` — Game state, players, turns
- `useDiceState()` — Dice rolls, locking state
- `useScoring()` — Calculate scores, track winners
- `useAI()` — AI player turns

**Services**:

- `storageService.ts` — Game history, statistics
- `aiService.ts` — AI strategy for locking dice

### UI Layer (`src/ui/`)

**Organisms**:

- `ShipCaptainCrewGame` — Main game view
- `DiceDisplay` — Show current dice, highlight locked ones
- `ScoreBoard` — Players and their scores
- `ResultsScreen` — Round winner, scoreboard

**Molecules**:

- `DiceButton` — Single clickable die (locked/unlocked state)
- `PlayerTurnPanel` — Current player indicator
- `RollButton` — Roll remaining dice
- `ConfirmButton` — Lock in final score

**Atoms**:

- `DieIcon` — Visual representation of die (1-6 pip display)
- `LockIcon` — Indicator on locked dice
- `ScoreText` — Numeric cargo value
- `RoundIndicator` — Which round number

## ✅ Development Status

- ✅ **Done**: Dice rolling, locking mechanism, 6-5-4 detection, cargo scoring
- ⏳ **In Progress**: AI strategy optimization, animated dice rolling
- ❌ **TODO**: Tournament mode (accumulate rounds), leaderboards, statistics

## 🚀 Getting Started

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Run tests
pnpm test
```

For detailed architecture, see [ARCHITECTURE.md](./ARCHITECTURE.md)  
For development guidelines, see [../../AGENTS.md](../../AGENTS.md)
