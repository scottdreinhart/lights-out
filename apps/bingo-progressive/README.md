# Bingo (Progressive Jackpot)

## Quick Start

Progressive Jackpot Bingo features an accumulating prize pool that grows with each game until won! Buy tickets to add to the jackpot, compete for the grand prize, and watch your potential winnings skyrocket!

**Controls**: 
- **Auto Stamping**: Numbers are marked automatically as called
- **Manual Stamping**: Click/tap to mark numbers (risk missing stamps = losing)
- **Ticket Purchase**: Buy additional tickets to increase jackpot contribution
- **Difficulty**: Easy (low bets) → Expert (high bets & bigger multipliers)

---

## Game Rules

### Card/Ticket System

- **Standard Layout**: 5×5 grid (75-ball) or customizable
- **Ticket Cost**: Varies by game (typically £0.10 - £1.00 per ticket)
- **Jackpot Contribution**: Percentage of ticket cost added to prize pool (typically 40-60%)
- **Remaining**: Retained by operator as commission
- **Ticket Count**: Buy as many tickets as you want
- **Escalating Stakes**: Larger jackpot = higher minimum ticket cost to enter

### Progressive Jackpot Mechanics

#### Jackpot Accumulation
- **Starting Pool**: Base jackpot (e.g., £500)
- **Ticket Sales**: Each ticket bought adds to pool
- **No Limit**: Jackpot grows indefinitely across games/sessions
- **Win Condition**: **Jackpot is won when a player completes FULL HOUSE within a set number of calls** (varies: typically 48-55 calls out of 75)

### Prize Pool

- **Accumulation**: All entry fees (card costs) feed into the prize pool
- **Rollover**: If no winner in a round, prize pools combine for the next round
- **Multiplier**: Each unclaimed round adds 1.5× bonus multiplier to next pool
- **Final Payout**: Winner takes entire accumulated pool
- **Consolation**: If player can't afford next round, they're eliminated from the game

### Winning Conditions

- **Standard**: First to mark complete line (horizontal, vertical, diagonal)
- **Full House**: All 25 squares marked (often with higher multiplier)
- **Pattern**: Special pattern (configurable per game)
- **Timeout**: If N rounds pass without a winner, highest-ranking incomplete card wins

### Game Flow

1. **Round N Created** — Entry fee increases (e.g., 1 → 2 → 4 chips)
2. **Players Buy Cards** — Each player decides whether to enter (paying escalating costs)
3. **Cards Dealt** — Unique 5×5 cards distributed to all players
4. **Numbers Called** — Random calling proceeds normally
5. **No Winner?** — If timeout expires, prize carries to Round N+1 with higher stakes
6. **Winner Found** — Player calls Bingo, card verified, prize paid
7. **Leaderboard Update** — Running totals and eliminated players tracked
8. **Next Round** — Process repeats with increased costs

### Bankruptcy & Elimination

- **Chip Limit**: Each player starts with configurable chips (e.g., 50, 100, 200)
- **Cannot Afford**: If next round's cost exceeds chips, player is eliminated
- **Spectator Mode**: Eliminated players can watch remaining rounds
- **Comeback**: Optional "insurance" mechanic allows re-entry at higher cost

## How to Play

### Desktop Controls

- **Arrow Keys**: Navigate card / menu options
- **Space**: Mark number on card
- **Right-Click**: Unmark number
- **Y/N Keys**: Accept/decline card purchase
- **Enter**: Confirm entry to next round
- **Escape**: Return to menu

### Mobile / Touch Controls

- **Tap**: Mark cell on card
- **Long Press**: Unmark cell
- **Swipe Left**: Skip round (decline entry)
- **Swipe Right**: Enter round (accept cost)
- **Tap Twice**: Confirm action

### Gamepad Controls

- **D-Pad**: Navigate card and menu
- **A Button**: Mark/unmark cell or confirm
- **B Button**: Decline/cancel
- **X Button**: View leaderboard
- **Y Button**: View chip balance
- **Menu**: Return to main menu

### Game Flow (12-Step Process)

1. **Game Start** — Players choose entry fee system (linear, exponential, Fibonacci) and max cost
2. **Round 1 Setup** — Base cost announced (typically 1 chip). Players see chip balances
3. **Buy-In Decision** — Each player decides: enter this round or skip (observe)
4. **Card Distribution** — Unique 5×5 cards dealt to all players who bought in
5. **Number Calling** — Caller announces numbers randomly (B-1, I-25, etc.)
6. **Marking Phase** — Players mark numbers on their cards in real-time
7. **Win Check** — System monitors all cards for winning patterns after each call
8. **Winner Announcment** — If pattern found, player calls Bingo and wins pool
9. **Card Verification** — Winning card checked for accuracy by system or moderator
10. **Prize Payout** — Winner's chip balance increased by pool amount
11. **Tournament Update** — Leaderboard, chip balances, and eliminated players displayed
12. **Next Round Offer** — If players remain (have chips), offer next round with higher cost

## Architecture

### Domain Layer (`src/domain/`)

**Types**:

```typescript
type Card = {
  id: string
  numbers: number[][] // 5×5 grid
  marked: boolean[][] // Marked status
  columnBounds: [1, 16, 31, 46, 61, 91] // BINGO columns
}

type CostScaling = 'linear' | 'exponential' | 'fibonacci' | 'custom'

type Round = {
  roundNumber: number
  baseCost: number // Cost to enter this round
  totalCost: number // baseCost with multipliers applied
  prizePool: number // Accumulated from all entries
  escalationMultiplier: number // 1.0 baseline, 1.5 if previous unclaimed, etc.
  maxCost: number // Enforced upper limit
  timeout: number // Milliseconds before timeout win
  winner?: string // Player ID if won
  winnningCard?: Card // Winning card for verification
}

type Player = {
  id: string
  name: string
  chipBalance: number // Current chip count
  totalWinnings: number // Lifetime payout
  roundsEntered: number[] // List of rounds entered
  rankings: { rank: number; score: number }
  isEliminated: boolean // true if balance < next round cost
}

type GameState = {
  players: Player[]
  currentRound: Round
  roundHistory: Round[]
  leaderboard: LeaderboardEntry[]
  costScaling: CostScaling
  maxChipsPerPlayer: number // Game starts with this many
}
```

**Constants** (`constants.ts`):

```typescript
export const COST_SCALES: Record<CostScaling, number[]> = {
  linear: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  exponential: [1, 2, 4, 8, 16, 32, 64, 128, 256, 512],
  fibonacci: [1, 1, 2, 3, 5, 8, 13, 21, 34, 55],
  custom: [], // User-defined
}
export const ESCALATION_MULTIPLIER = 1.5 // Per unclaimed round
export const DEFAULT_MAX_CHIPS = 100
export const COLUMN_BOUNDS = { B: [1, 15], I: [16, 30], N: [31, 45], G: [46, 60], O: [61, 90] }
```

**Rules** (`rules.ts`):

```typescript
export const generateCard = (): Card
export const calculateRoundCost = (roundNumber: number, costScaling: CostScaling, maxCost: number): number
export const canPlayerAfford = (player: Player, roundCost: number): boolean
export const deductChips = (player: Player, amount: number): Player
export const awardWinnings = (player: Player, prizePool: number): Player
export const checkWin = (card: Card): boolean
export const escalateRound = (previousRound: Round, hasWinner: boolean): Round
export const eliminatePlayer = (player: Player): Player
export const calculateRanking = (players: Player[]): LeaderboardEntry[]
```

### App Layer (`src/app/`)

**Hooks**:

```typescript
export const useGame = (): GameContext
export const useProgressiveRounds = (): ProgressiveRoundsContext  // Round escalation logic
export const useChipBalance = (playerId: string): ChipBalanceContext
export const useCostScaling = (): CostScalingContext  // Select escalation pattern
export const useLeaderboard = (): LeaderboardContext
export const useTheme = (): ThemeContext
export const useResponsiveState = (): ResponsiveState
```

**Services**:

```typescript
export const gameService = {
  startGame: (players: Player[]): GameState,
  advanceRound: (gameState: GameState): GameState,
  endRound: (gameState: GameState, winner?: Player): GameState,
  getLeaderboard: (gameState: GameState): LeaderboardEntry[],
}
export const chipService = {
  deductChips: (player: Player, amount: number): Player,
  awardChips: (player: Player, amount: number): Player,
  checkBankruptcy: (player: Player, nextCost: number): boolean,
}
export const escalationService = {
  calculateCost: (round: number, scaling: CostScaling, max: number): number,
  calculateMultiplier: (unclaimed: number): number,
  calculatePool: (entries: number[], multiplier: number): number,
}
```

### UI Layer (`src/ui/`)

**Organisms**:

- `GameBoard`: Main 5×5 card display with chip counter
- `RoundSetup`: Shows cost, prize pool, and buy-in decision
- `ChipDisplay`: Large visual of chip balance (increases/decreases on entry)
- `LeaderboardScreen`: Ranked players with winnings and statuses
- `Elimination Modal`: Shows which players can't afford next round
- `WinnerAnnouncement`: Prize amount, round recap, celebration

**Molecules**:

- `Card`: 5×5 grid of cell components
- `CostIndicator`: Shows current round cost and remaining budget
- `PrizePoolMeter`: Animated bar showing accumulated prize
- `PlayerStatus`: Chip balance, rank, status (active/eliminated)
- `RoundCounter`: "Round 3 of N" with escalation message
- `BuyInConfirm`: "Cost 4 chips. Continue? [YES] [NO]"

**Atoms**:

- `Cell`: Single card grid cell
- `ChipBadge`: Shows chip count with animated transitions
- `CostLabel`: "Cost: X chips"
- `Button`: Standard button
- `ProgressBar`: Escalation visualizer
- `Icon`: SVG icons for money, chips, etc.

## Development Status

**Completion**: 64% Developing

### Done ✅

- Card generation with 5×5 grid
- Basic marking and win detection
- Chip balance tracking per player
- Linear cost scaling (1, 2, 3, 4...)
- Prize pool accumulation
- Exponential cost scaling (1, 2, 4, 8...)
- Fibonacci cost scaling
- Leaderboard with rankings
- Elimination when out of chips

### In Progress 🔄

- Escalation multiplier when rounds unclaimed (1.5×)
- Round timeout mechanics (auto-win if no winner after N calls)
- Insurance/re-entry system for eliminated players
- UI for round cost escalation animation
- Chip balance visual feedb during payment
- Save/resume game between rounds

### To Do ❌

- Spectator mode for eliminated players
- Comeback mechanics (special re-entry cards with bonus constraints)
- Multi-game tournaments with seeding
- Prize pool splits (second place gets % of pool)
- Handicap system for balance (worse cards at lower cost)
- Advanced AI that calculates chip EV and entry decisions
- Custom cost scaling per game
- Sound effects and animations for escalation
- Mobile optimization for chip display
- Network multiplayer synchronization

## Getting Started

### Installation

```bash
cd apps/bingo-progressive
pnpm install
```

### Development Server

```bash
pnpm dev
# Opens at http://localhost:5173
```

### Build for Production

```bash
pnpm build
# Output: dist/
```

### Run Tests

```bash
pnpm test              # Unit + integration tests
pnpm test:watch       # Watch mode
pnpm test:e2e         # End-to-end tests
pnpm test:coverage    # Coverage report
```

### Quality Assurance

```bash
pnpm lint             # ESLint
pnpm format:check     # Prettier
pnpm typecheck        # TypeScript
pnpm validate         # Full gate
```

## Design Philosophy

- **Progressive Stakes**: Escalating costs create strategic depth and excitement
- **Risk Management**: Players decide whether to "chase the pot" or retire safely
- **Transparency**: All entry fees feed directly into prize pools (visible accumulation)
- **Fairness**: No house rake; all player money stays in the game
- **Accessibility**: Works on any device with responsive UI
- **Community**: Leaderboards and multi-round tournaments encourage repeated play

## References

- [AGENTS.md](../../AGENTS.md) — Platform architecture
- [Bingo Variants](../../docs/GAME-FAMILIES.md#lottery) — Related games
- [Game Families](../../docs/GAME-FAMILIES.md) — Lottery game design patterns

## License

Part of the Game Platform. See [LICENSE](../../LICENSE) file.
