# Mexico (Dice Game)

A fast-paced dice elimination game where players roll to try to beat the previous roll without going below 1. Each round someone is eliminated until one player remains victorious. Perfect for 3-8 players in casual party settings.

## 🎮 Quick Start

1. **First player rolls two dice** (and keeps total secret)
2. **Next player tries to beat that roll** with their two dice
3. **If they succeed**: First player is out
4. **If they fail**: Current player is out
5. **Continue** until only one player remains
6. **Last player standing wins**!

## 📖 Game Rules

**Objective**: Avoid being eliminated by rolling higher than (or equal to) the previous roll.

**Equipment**: 2 six-sided dice per player (or shared 2 dice rolled each turn)

**Starting Setup**:

- 3-8 players sit in a circle
- First player is chosen randomly or by position
- Each player has a "life" (not eliminated)

**Turn Sequence**:

1. **Current Player Rolls**: Two dice in cup or hand
2. **Announces Roll**: "I got a [number]" (or keeps it hidden for bluffing variant)
3. **Next Player's Turn**:
   - **Must beat the announced roll** with their two dice
   - **Can see previous roll** or play secretly (depending on variant)
4. **Result**:
   - **Beats Roll**: Previous player is **ELIMINATED** and out of game
   - **Matches Roll**: Tie — current player is **ELIMINATED**
   - **Loses Roll**: Current player is **ELIMINATED** and dice pass

**Lowest Possible Roll**:

- Can only happen if player rolls a 1 on both dice
- Total of 2 (or 1-1 in some variants)
- Called "Mexico" or "Snake Eyes"

**Rolling Again**:

- Only allowed at start of game (sometimes)
- After elimination, game continues with remaining players

**Bluffing Variant** (Advanced):

- Players don't show their roll to others
- Next player can **challenge** the announced number
- If challenged: Both rolls revealed
  - If challenged player lied: They're out
  - If challenger was wrong: Challenger is out

## 🎯 How to Play

### Controls

**Desktop (Keyboard + Mouse)**

- **Click Roll Button**: Roll the two dice
- **View/Hide Roll**: Click to show/hide your number (bluffing)
- **Next Player**: Click to pass dice
- **Challenge**: Click to challenge opponent's claim
- **Escape**: Menu

**Mobile (Touch)**

- **Tap Roll**: Roll dice
- **Swipe**: Hide/show your roll
- **Tap Next Player**: Pass to next player
- **Tap Challenge Button**: Challenge opponent (if enabled)
- **Menu Tap**: Settings

**TV/Gamepad (D-Pad)**

- **OK Button**: Roll dice and reveal/confirm
- **Back Button**: Challenge or menu
- **D-Pad**: Navigate menu options

### Game Flow

1. **Game Setup**: Player count and variant selected
2. **Player 1's Turn**:
   - Rolls dice (shaking animation)
   - Dice show their result (e.g., 3+4 = "7")
   - Can announce number (truthfully or bluffing)
3. **Player 2's Turn**:
   - Sees or doesn't see Player 1's number (variant-dependent)
   - Rolls their dice
   - Result automatically compared
4. **Comparison**:
   - Player 2 beats Player 1? → Player 1 out, Player 2 keeps dice
   - Player 2 ties? → Player 2 out, Player 1 keeps dice
   - Player 2 loses? → Player 2 out, Player 3 rolls next
5. **Elimination Screen**: Eliminated player shown with exit message
6. **Next Round**: Remaining players continue turn rotation
7. **Game Progresses**: Continue elimination until final player
8. **Winner Announcement**: Last player standing shown as winner
9. **Stats**: Number of rounds, eliminations per player

### Bluffing Rules (Optional)

**When Enabled**:

- Player announces a number (players don't see the dice)
- Next player can **Challenge** the claim
- On challenge:
  - TRUE announcement: Challenger is out
  - FALSE announcement: Announcer is out

**Strategy**:

- Bluff with high numbers to scare opponents
- Defensive bluffing with low numbers (claim 5 when rolled 3, hope they don't challenge)
- Watch for opponent patterns

## 🏗️ Architecture

This is a **DEVELOPING** implementation (74% complete) focusing on elimination logic and turn management.

### Domain Layer (`src/domain/`)

**Core Types**:

- `Dice` = { die1: 1-6, die2: 1-6, total: 2-12 }
- `Player` = { id, name, isAlive, roll?, announced? }
- `Round` = { roller, challenger?, roll, announced, result }
- `GameState` = { players, currentPlayer, rolls, eliminations, winner, variant }

**Key Files**:

- `types.ts` — Dice, Player, Round, GameState types
- `dice.ts` — Roll two dice, return values
- `rules.ts` — Determine winner between two rolls
- `elimination.ts` — Track eliminated players, advance turns
- `ai.ts` — AI player bluffing logic, challenge decisions

**Core Logic**:

```typescript
// Roll two dice
function rollDice(): Dice

// Compare two rolls
function compareRolls(roll1: Dice, roll2: Dice): 'win' | 'tie' | 'lose'

// Eliminate player after loss
function eliminatePlayer(players: Player[], eliminatedId: string): Player[]

// Get next active player
function getNextPlayer(players: Player[], currentIndex: number): Player

// AI decides whether to challenge (bluffing variant)
function aiShouldChallenge(aiPlayer: Player, announcedValue: number, gameHistory: Round[]): boolean

// AI announces value (bluffing variant)
function aiAnnounceValue(roll: Dice, gameContext: GameContext): number
```

### App Layer (`src/app/`)

**Custom Hooks**:

- `useMexico()` — Game state, players, turns
- `useDiceRoll()` — Roll animation, results
- `useElimination()` — Track eliminated players
- `useTurns()` — Current player and advance
- `useBluffing()` — Bluffing variant logic (if enabled)

**Services**:

- `storageService.ts` — Game statistics, eliminations per player
- `aiService.ts` — AI strategies for rolling and bluffing

### UI Layer (`src/ui/`)

**Organisms**:

- `MexicoGameScreen` — Main game view
- `DiceReveal` — Show rolled dice
- `PlayerCircle` — Show all players around circle
- `EliminationAlert` — Show who was eliminated

**Molecules**:

- `RollButton` — Roll the dice
- `PlayerStatus` — Player name and alive/eliminated state
- `DiceDisplay` — Show current player's dice
- `ChallengeButton` — Challenge opponent (bluffing mode)

**Atoms**:

- `DieIcon` — One die (pip display)
- `PlayerBadge` — Player name and color
- `TotalDisplay` — Sum of two dice
- `RoundCounter` — Current round number

## ✅ Development Status

- ✅ **Done**: Dice rolling, comparison logic, elimination tracking, turn rotation
- ⏳ **In Progress**: Bluffing variant implementation, animated eliminations
- ❌ **TODO**: Leaderboards, challenge history tracking, tournament mode

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
