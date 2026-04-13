# Speed Bingo

A fast-paced variation with rapid number calling and speed bonuses for quick marking.

## Quick Start

**Speed Bingo** is a high-energy variation of classic bingo where speed is everything. Numbers are called rapidly (every 1-3 seconds instead of 5-10), and the first player to mark numbers fastest and complete a pattern wins bonus points. Watch, react, mark, and win—all in seconds! Perfect for players who love quick-thinking games, competitive rushes, and reflex-based gameplay.

## Game Rules

### Card System

- **Card Layout**: 5×5 grid with numbers 1-90
- **Unique Cards**: Each player gets a unique randomly-generated card
- **Free Space**: Center square marked automatically
- **Difficulty Levels**: More cards = faster calling = harder to track
  - **Easy**: 1-2 players, 1 card each, 5-second call interval
  - **Medium**: 3-5 players, 1 card each, 3-second call interval
  - **Hard**: 6-10 players, up to 2 cards each, 1-second call interval

### Calling System

- **Rapid Calling**: Numbers called continuously at fixed intervals (configurable)
- **Call Announcement**: Visual + audio (bell sound, number display)
- **Call History**: Last 5 calls shown for reference (older calls fade)
- **No Pause**: Calling doesn't pause for players to mark; continuous flow

### Winning Conditions

- **Standard Win**: First to complete a line (horizontal, vertical, diagonal)
- **Full House**: All 25 squares (with higher bonus)
- **Speed Bonus**: Completing a pattern within 10 seconds of the winning number: +50 points
- **Reaction Bonus**: Marking within 0.5 seconds of number call: +5 points per cell

### Scoring System

- **Base Win**: 100 points (first to complete pattern)
- **Speed Bonus**: +50 points (completed within 10 seconds of winning number)
- **Rapid Marking**: +5 points per cell marked within 0.5 seconds of call
- **Multi-Card Bonus**: +25 points for completing pattern on 2nd+ card in same round
- **Perfect Round**: +100 points if entire card filled before timeout (rare)

### Gameplay Flow

1. **Difficulty Selection** — Player(s) choose Easy/Medium/Hard (affects call speed)
2. **Card Deal** — Each player receives 1-2 unique 5×5 cards
3. **Countdown** — Brief countdown (3... 2... 1...) before rapid calling starts
4. **Rapid Calling** — Numbers called continuously at selected speed (1-5 sec intervals)
5. **Player Reaction** — Players frantically mark numbers on their cards (no breaks)
6. **Pattern Detection** — System detects complete lines/patterns in real-time
7. **First Bingo** — First player to complete pattern wins immediately
8. **Verification** — Winning card verified (instant visual confirmation)
9. **Score Calculation** — Base score + bonuses calculated (speed, rapid marking, etc.)
10. **Winner Display** — Winning card shown with highlighted pattern and score breakdown
11. **Quick Recap** — "Player X: 150 points (100 base + 50 speed bonus)"
12. **Next Round** — Immediate restart with new cards and difficulty option

## How to Play

### Desktop Controls

- **Click / Tap**: Mark number on card as quickly as possible
- **Space**: Mark most recent called number (auto-locate)
- **Right-Click**: Unmark (use carefully; no undo in speed mode)
- **Arrow Keys**: Navigate card (optional; click is faster)
- **R**: Repeat last call verbally (brief pause)
- **Escape**: Exit to menu (ends current game)

### Mobile / Touch Controls

- **Tap**: Mark cell instantly
- **Auto-Tap Called Numbers**: System highlights called numbers; any tap within red zone marks them
- **Double-Tap**: Unmark cell (rare, speed-focused game rarely allows)
- **Swipe Up**: Pause (brief 5-second pause allowed once per game)
- **Swipe Down**: Concede (give up current round)
- **Landscape Mode**: Recommended for larger card visibility

### Gamepad Controls

- **D-Pad**: Navigate card cells quickly
- **A Button**: Mark current cell
- **B Button**: Unmark (use sparingly)
- **X Button**: Auto-mark last called number
- **Y Button**: Pause game (5-second penalty)
- **Menu**: Concede round

### Keyboard Shortcuts (Advanced)

- **1-90**: Direct number entry (if typing in number, card auto-marks if present)
- **+**: Increase call speed (difficulty adjustment)
- **-**: Decrease call speed
- **P**: Pause game (5-second timeout penalty)
- **Q**: Quit game

## Game Flow (12-Step Process)

1. **Main Menu** — Select Easy/Medium/Hard difficulty
2. **Pre-Game** — Difficulty effects explained (call speed, multiplayer options)
3. **Cards Shown** — Each player sees their 5×5 card(s) before calling starts
4. **Countdown** — "Starting in 3... 2... 1..."
5. **First Call** — Number called with visual highlight on card (if present)
6. **Rapid Calling** — Continuous stream of numbers at game speed (1-5 sec apart)
7. **Active Marking** — Players mark numbers as fast as they can; scramble to keep up
8. **Pattern Detection** — After each call, system checks all cards for winning patterns
9. **Bingo Called** — First player to complete pattern automatically wins (no manual declaration needed)
10. **Instant Verification** — Winning card is highlighted, pattern shown in bright color
11. **Score Breakdown** — Points displayed: base (100) + speed (50) + rapid marking (20) = 170
12. **Next Game** — Automatic shuffle to next difficulty or return to menu

## Architecture

### Domain Layer (`src/domain/`)

**Types**:

```typescript
type Card = {
  id: string
  numbers: number[][] // 5×5 grid
  marked: boolean[][] // Marked status
  columnBounds: [1, 16, 31, 46, 61, 91] // BINGO columns
  markTimes: Record<string, number> // timestamp of each mark
}

type Difficulty = 'easy' | 'medium' | 'hard'

type DifficultyConfig = {
  difficulty: Difficulty
  callInterval: number // milliseconds between calls (5000, 3000, 1000)
  playerCount: number // 1-2, 3-5, 6-10 estimates
  cardsPerPlayer: number // 1 or 2
  timeoutSeconds: number // 60, 45, 30 seconds max per round
  speedBonusThreshold: number // 10 seconds to win
}

type CallRecord = {
  number: number
  timestamp: number // Game clock when called
  visual?: string // "B-7" format
}

type GameState = {
  currentCard: Card
  calledNumbers: CallRecord[]
  callInterval: number // Current speed (ms)
  difficulty: Difficulty
  gameStartTime: number // Clock time of game start
  gameEndTime?: number // When game ended
  winner?: Player
  completionTime?: number // When winning pattern was completed
  speedBonus: boolean // Did winner get speed bonus?
  rapidMarkingBonus: number // Count of marks within 0.5ms
}

type Player = {
  id: string
  name: string
  score: number // Current round score
  cumulativeScore: number // Total across rounds
  reactionTime: number // Average mark reaction time
  isActive: boolean // Still playing or eliminated
}
```

**Constants** (`constants.ts`):

```typescript
export const DIFFICULTY_CONFIG: Record<Difficulty, DifficultyConfig> = {
  easy: {
    callInterval: 5000,
    playerCount: 1,
    cardsPerPlayer: 1,
    timeoutSeconds: 60,
    speedBonusThreshold: 10,
  },
  medium: {
    callInterval: 3000,
    playerCount: 3,
    cardsPerPlayer: 1,
    timeoutSeconds: 45,
    speedBonusThreshold: 10,
  },
  hard: {
    callInterval: 1000,
    playerCount: 6,
    cardsPerPlayer: 2,
    timeoutSeconds: 30,
    speedBonusThreshold: 10,
  },
}
export const SCORING = {
  baseWin: 100,
  speedBonus: 50,
  rapidMarkingBonus: 5,
  multiCardBonus: 25,
  perfectRound: 100,
}
export const REACTION_THRESHOLD = 500 // milliseconds for rapid marking bonus
export const SPEED_BONUS_WINDOW = 10000 // milliseconds after winning number called
export const COLUMN_BOUNDS = {
  /* ... */
}
```

**Rules** (`rules.ts`):

```typescript
export const generateCard = (): Card
export const callNumber = (): number  // Random 1-90
export const markCell = (card: Card, number: number, timestamp: number): Card
export const checkWin = (card: Card, timestamp: number): { won: boolean, pattern: string } | null
export const calculateScore = (card: Card, winTimestamp: number, callTimestamp: number): number
export const getSpeedBonus = (winTime: number, callTime: number): number
export const getRapidMarkingBonus = (markTimes: Record<string, number>, calls: CallRecord[]): number
export const chooseDifficulty = (playerCount: number): Difficulty
export const getCallInterval = (difficulty: Difficulty): number
```

### App Layer (`src/app/`)

**Hooks**:

```typescript
export const useSpeedGame = (): SpeedGameContext
export const useCallTimer = (interval: number): CallTimerContext  // Manages rapid calling
export const useReactionTime = (cardId: string): ReactionTimeContext  // Tracks mark speed
export const useScoring = (): ScoringContext  // Calculates score with bonuses
export const useDifficulty = (): DifficultyContext
export const useTheme = (): ThemeContext
export const useResponsiveState = (): ResponsiveState
```

**Services**:

```typescript
export const callService = {
  startCalling: (interval: number): Callback,
  stopCalling: (): void,
  nextNumber: (): number,
  getRecentCalls: (count: number): CallRecord[],
}
export const scoringService = {
  calculateTotal: (baseScore: number, bonuses: Bonus[]): number,
  getSpeedBonus: (completionTime: number, winCallTime: number): number,
  getRapidMarkingBonus: (markTimes: Record<string, number>, calls: CallRecord[]): number,
  formatScoreBreakdown: (scores: { base: number, speed: number, rapid: number }): string,
}
export const reactionService = {
  recordMark: (timestamp: number): void,
  getAverageReactionTime: (): number,
  getBonusMultiplier = (avgReactionTime: number): number,
}
```

### UI Layer (`src/ui/`)

**Organisms**:

- `GameBoard`: Large 5×5 card with real-time highlighting
- `CallDisplay`: Large animated number display (current call)
- `CallHistory`: Recent calls with fading animation
- `ScorePanel`: Running score with bonus breakdown
- `DifficultySelector`: Easy/Medium/Hard buttons with descriptions
- `ResultsScreen`: Final score, breakdown, next round option

**Molecules**:

- `Card`: 5×5 grid with auto-highlight for called numbers
- `CallCounter`: "23 numbers called" / "47 remaining"
- `TimerBar`: Visual countdown to next call
- `ScoreDisplay`: Base + speed + rapid bonuses shown separately
- `DifficultyBadge`: "Hard - 1s calling, 30s timeout"
- `ReactionMeter`: Average mark speed displayed as gauge

**Atoms**:

- `Cell`: Card grid cell with highlight on call
- `CallBadge`: Large animated number badge
- `Timer`: Countdown to next call
- `Button`: Standard button
- `Score`: Point value displayed
- `Icon`: SVG for bonus indicators

## Development Status

**Completion**: 71% Developing

### Done ✅

- Card generation with 5×5 grid
- Random number calling (1-90)
- Rapid firing of numbers at intervals
- Mark detection and validation
- Win detection for lines/patterns
- Base score calculation (100 points)
- Speed bonus calculation (+50 if under 10 sec)
- Difficulty levels (easy/medium/hard)
- Call history display (last 5 calls)
- Visual highlighting of called numbers
- Leaderboard tracking

### In Progress 🔄

- Rapid marking bonus detection (marks within 0.5ms)
- Reaction time averaging and display
- Multi-card support (2 cards per player on hard)
- Score breakdown visualization (base + bonuses separated)
- Call timer UI with countdown animation
- Mobile optimization for rapid tapping
- Auto-pause on long mark delay (UX feature)

### To Do ❌

- Advanced difficulty tuning (customizable call speeds)
- Tournament mode with multiple rounds
- Competitive leaderboards (fastest players ranked)
- Streak tracking (consecutive wins)
- Sound effects (bell on call, chime on mark, victory fanfare)
- Call speech synthesis (optional audio announcements)
- Rewind/replay system (watch previous game at slow-motion)
- AI opponents with variable reaction times
- Power-ups (skip call, double bonus, etc.)
- Mobile gesture optimizations (swipe to mark area)
- Network multiplayer with sync'd calling
- Handicap system (player with slower reaction gets easier cards)

## Getting Started

### Installation

```bash
cd apps/speed-bingo
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

- **Speed Over Strategy**: Focus on reflex and quick reactions, not deep thinking
- **Continuous Action**: No pauses; numbers called continuously to maintain tension
- **Honest Scoring**: All bonuses visible and clearly explained
- **Accessibility**: Works on desktop, mobile, and gamepad despite fast pace
- **Scalable Difficulty**: Easy for casual players, hard for speedrunners
- **Community**: Leaderboards encourage competition and repeated play

## References

- [AGENTS.md](../../AGENTS.md) — Platform architecture and governance
- [Bingo Variants](../../docs/GAME-FAMILIES.md#lottery) — Related games (Bingo-30, Bingo-80, Bingo-Pattern, Bingo-Progressive)
- [Game Families](../../docs/GAME-FAMILIES.md) — Lottery game family documentation
- [Performance Optimization](../../docs/PERFORMANCE.md) — Fast UI rendering for rapid updates

## License

Part of the Game Platform. See [LICENSE](../../LICENSE) file.
