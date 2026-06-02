# Chō-han (丁半)

A traditional Japanese gambling game of pure chance where players bet on whether two dice will show an even (chō) or odd (han) total. Centuries-old game of fortune, perfect for quick betting rounds with 2-4 players.

## 🎮 Quick Start

1. **Place your bet** on Chō (even total) or Han (odd total)
2. **Wait for dice roll** (dealer or player rolls)
3. **Two dice are shaken** in a cup and revealed
4. **Sum the dice**: Add the two numbers together
5. **Check result**:
   - **Even total (2,4,6,8,10,12)** = Chō wins
   - **Odd total (3,5,7,9,11)** = Han wins
6. **Collect winnings** or lose your bet

## 📖 Game Rules

**Objective**: Predict even or odd and win more money than opponents.

**Equipment**: 2 six-sided dice (traditionally in a lacquered cup)

**Bets**:

- **Bet Amount**: Place chips on Chō or Han
- **Starting Chips**: Each player gets equal starting amount
- **Betting Limits**: Min/max per bet (configurable)

**Game Round**:

1. **Betting Phase**: All players place chips on Chō or Han
   - Chō = Even total (2, 4, 6, 8, 10, 12)
   - Han = Odd total (3, 5, 7, 9, 11)
2. **Dice Roll**: Dice are shaken and rolled
3. **Count Spots**: Add the two dice
4. **Determine Winner**:
   - **Even total**: Chō bettors win, Han bettors lose
   - **Odd total**: Han bettors win, Chō bettors lose
5. **Payout**: Winners double their bets, losers lose theirs
6. **Next Round**: Shuffle chips and repeat

**Probabilities** (Perfect 50-50):

- Even totals: 2 (1+1), 4 (1+3, 2+2, 3+1), 6, 8, 10, 12
- Odd totals: 3 (1+2, 2+1), 5 (1+4, 2+3, 3+2, 4+1), 7, 9, 11
- Exactly 50% chance of each outcome (18 ways even, 18 ways odd)
- Pure game of chance with no skill component

**Historical Context**:

- Game originated in feudal Japan
- Used in kabuki theater as entertainment
- Also called "Ch-han" in other regions
- Popular at festivals and gatherings
- Often had traditional wooden cups and dice

## 🎯 How to Play

### Controls

**Desktop (Keyboard + Mouse)**

- **Click Chips**: Click Chō or Han to place bet
- **Adjust Amount**: Use +/- buttons to change bet
- **Click Roll**: Roll the dice
- **Space**: Quick bet (same as last)
- **Escape**: Menu/settings

**Mobile (Touch)**

- **Tap Chō/Han**: Place bet on that outcome
- **Tap +/- Buttons**: Adjust bet amount
- **Tap Roll**: Roll dice
- **Menu Tap**: Settings

**TV/Gamepad (D-Pad)**

- **D-Pad Left/Right**: Select Chō or Han
- **D-Pad Up/Down**: Adjust bet amount
- **OK Button**: Confirm bet and roll
- **Back Button**: Menu

### Game Flow

1. **Game Starts**: Betting interface appears
2. **Choose Chō or Han**: Click the option
3. **Adjust Bet**: Use +/- to set amount (or default)
4. **Confirm Bet**: Click "Roll Dice" or OK
5. **Dice Animation**: Dice shake in cup, dramatic reveal
6. **Result Display**: Total shows clearly
7. **Winner Check**: Chō wins if even, Han wins if odd
8. **Chip Update**: Winning bets double, losing bets removed
9. **Round Indicator**: Shows round number and history
10. **Next Round**: New betting interface appears
11. **Game End**: When a player reaches goal or rounds expire
12. **Final Stats**: Show who won and by how much

### Betting Strategies

**Simple Strategy**:

- Just guess randomly (50% chance always)
- No right or wrong choice

**Chip Management**:

- Conservative: Always bet same amount
- Aggressive: Increase bets when winning streak
- Martingale: Double bet after loss (risky)

**Luck Observation**:

- Some players track history (even if it doesn't help)
- Superstitious bets based on patterns
- No actual skill affects outcome

## 🏗️ Architecture

This is a **DEVELOPING** implementation (70% complete) focusing on betting mechanics and dice results.

### Domain Layer (`src/domain/`)

**Core Types**:

- `Bet` = { player, amount, choice: 'chō' | 'han' }
- `Dice` = { die1: 1-6, die2: 1-6 }
- `Result` = { sum: 2-12, isEven: boolean, winner: 'chō' | 'han' }
- `Player` = { name, chips, bets: Bet[] }
- `RoundState` = { players, bets, diceRolled, result, roundNumber }

**Key Files**:

- `types.ts` — Bet, Dice, Result, Player, RoundState
- `dice.ts` — Roll two dice, return values
- `rules.ts` — Process bets, determine winner
- `scoring.ts` — Calculate payouts, update chip totals
- `ai.ts` — AI player betting logic (random with chip management)

**Core Logic**:

```typescript
// Roll two dice
function rollDice(): Dice

// Calculate sum and determine winner
function getResult(dice: Dice): Result

// Process all bets against result
function processBets(bets: Bet[], result: Result): PlayerResult[]

// Update player chips after round
function updateChips(player: Player, result: PlayerResult): Player

// AI chooses bet (Chō or Han) with chip strategy
function aiChooseBet(player: Player, gameContext: GameContext): Bet
```

### App Layer (`src/app/`)

**Custom Hooks**:

- `useChoHan()` — Game state, players, rounds
- `useBetting()` — Manage bets, chip amounts
- `useDiceRoll()` — Dice animation, results
- `useGameRounds()` — Track rounds, transitions
- `useScoring()` — Calculate winners, payouts

**Services**:

- `storageService.ts` — Game statistics, high chip earners
- `aiService.ts` — AI betting strategies

### UI Layer (`src/ui/`)

**Organisms**:

- `ChoHanGameScreen` — Main game view
- `BettingPanel` — Where players place bets
- `DiceReveal` — Dramatic dice roll animation
- `ResultScreen` — Show winner and payouts

**Molecules**:

- `BetButton` — Chō or Han bet option
- `ChipsDisplay` — Show player chips
- `DiceImage` — Visual die display
- `BettingAmount` — Adjust bet with +/-

**Atoms**:

- `ChipCountBadge` — Player chip total
- `ResultText` — "Chō Wins" or "Han Wins"
- `RollButton` — Trigger dice roll
- `Menu Button` — Access settings

## ✅ Development Status

- ✅ **Done**: Dice rolling (50-50 split), betting interface, payout calculation, chip tracking
- ⏳ **In Progress**: Animated dice cup, historical tracking of results
- ❌ **TODO**: Leaderboards, "hot/cold" streak indicators, custom betting limits

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
