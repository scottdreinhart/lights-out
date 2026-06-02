# Bingo (Pattern-Based)

## Quick Start

Pattern Bingo challenges you to complete custom shapes and designs instead of traditional lines! Each game reveals a unique pattern at the start. Mark your card to match the pattern shape before anyone else!

**Controls**: 
- **Auto Stamping**: Numbers are marked automatically as called
- **Manual Stamping**: Click/tap to mark numbers (risk missing stamps = losing)
- **Pattern Visualization**: Shows required shape on screen
- **Difficulty**: Easy (simple patterns) → Expert (complex shapes)

---

## Game Rules

### Card System

- **Grid Layout**: 5×5 grid (75-ball) or 4×4 grid (80-ball compatible)
- **Number Range**: 1-75 (75-ball) or 1-80 (80-ball)
- **Free Space**: Center square (if 5×5 grid)
- **Card Count**: 1 or 2 cards per game

### Pattern System (Variable)

Unlike traditional bingo, **the winning pattern is announced before the game starts** and changes with each round.

### Available Patterns

- **Single Line**: 5 in a row (horizontal, vertical, or diagonal)
- **X-Shape**: Four corners + center (diamond pattern)
- **T-Shape**: Top row + center column vertical line
- **Four Corners**: Marks only the four corner cells
- **Full Card**: All 25 squares (including free space)
- **Frame**: Outer perimeter (20 cells)
- **Plus Sign**: Center row + center column (creating a +)
- **Triangle**: Pattern forming a triangular shape
- **Custom Patterns**: Game randomly selects from available pattern library

### Gameplay

1. Each player receives a unique 5×5 bingo card with numbers 1-90
2. Numbers are drawn randomly using a ball tumbler or electronic caller
3. Players mark numbers on their cards as they are called
4. First player to complete the selected pattern(s) wins the round
5. Winning card is verified before awarding points

### Scoring

- **Primary Win**: 100 points (first to complete pattern)
- **Secondary Win**: 50 points (second player to complete pattern)
- **Speed Bonus**: +10 points if completed within first 5 calls
- **Multiple Patterns**: Bonus +25 points if the pattern triggers on exactly the called number
- **Perfect Game**: 150 points if won with exact number call (no extra marked cells)

## How to Play

### Desktop Controls

- **Arrow Keys**: Navigate the card grid
- **Space / Click**: Mark a number on the card
- **Right-Click**: Unmark a number
- **P**: Preview current pattern
- **Enter**: Declare Pattern Completion
- **Escape**: Return to menu

### Mobile / Touch Controls

- **Tap**: Mark a cell on your card
- **Long Press**: Unmark a cell
- **Swipe Up**: Preview pattern success
- **Swipe Down**: View pattern legend
- **Home Button**: Menu

### Gamepad Controls

- **D-Pad**: Navigate card cells
- **A Button**: Mark/unmark cell
- **X Button**: Preview pattern
- **Y Button**: Pattern legend
- **Menu Button**: Return to menu

### Game Flow (10-Step Process)

1. **Pattern Selection** — Game announces which pattern is active for this round (e.g., "X-Shape", "T-Shape")
2. **Card Distribution** — Each player receives a unique 5×5 card with 25 numbers
3. **First Call** — Caller announces first number (e.g., "B-7")
4. **Players Mark** — All players mark the called number if on their card
5. **Pattern Checking** — After each call, system checks if any player has completed the pattern
6. **Announcement** — When pattern is completed, player calls "Bingo!" and announces the pattern type
7. **Verification** — Card manually or automatically verified for accuracy
8. **Win Confirmation** — Points awarded based on completion time and accuracy
9. **Display Winner** — Winning card displayed with highlighted pattern
10. **Next Round** — New pattern selected, new cards dealt, game repeats

## Architecture

### Domain Layer (`src/domain/`)

**Types**:

```typescript
type Card = {
  id: string
  numbers: number[][] // 5×5 grid
  marked: boolean[][] // 5×5 marked status
  columnBounds: [1, 16, 31, 46, 61, 91] // BINGO columns
}

type Pattern =
  | 'line'
  | 'x-shape'
  | 't-shape'
  | 'four-corners'
  | 'full-card'
  | 'frame'
  | 'plus'
  | 'triangle'
  | 'custom'

type PatternCoord = [row: number, col: number]

type RoundState = {
  currentPlayer: Player
  cards: Card[]
  calledNumbers: Set<number>
  activePattern: Pattern
  roundNumber: number
  patternMatches: Record<string, PatternCoord[]> // player -> coordinates matching pattern
}

type GameState = {
  players: Player[]
  currentRound: RoundState
  history: RoundResult[]
  leaderboard: LeaderboardEntry[]
}
```

**Constants** (`constants.ts`):

```typescript
export const COLUMN_BOUNDS = { B: [1, 15], I: [16, 30], N: [31, 45], G: [46, 60], O: [61, 90] }
export const PATTERNS: Record<Pattern, PatternCoord[]> = {
  line: [
    [0, 0],
    [0, 1],
    [0, 2],
    [0, 3],
    [0, 4],
  ], // ... more
  'x-shape': [
    [0, 0],
    [0, 4],
    [2, 2],
    [4, 0],
    [4, 4],
  ],
  't-shape': [
    [0, 0],
    [0, 1],
    [0, 2],
    [0, 3],
    [0, 4],
    [1, 2],
    [2, 2],
    [3, 2],
    [4, 2],
  ],
  // ... more patterns
}
export const PATTERN_NAMES = {
  /* display names */
}
```

**Rules** (`rules.ts`):

```typescript
export const generateCard = (): Card => { /* 5×5 grid generation */ }
export const isValidMove = (card: Card, number: number): boolean => { /* validation */ }
export const hasCompletedPattern = (card: Card, pattern: Pattern): boolean
export const getAllMatchingPatterns = (card: Card): Pattern[]
export const calculateScore = (completionTime: number, patternType: Pattern): number
export const aiChoosePattern = (gameState: RoundState): Pattern
```

### App Layer (`src/app/`)

**Hooks**:

```typescript
export const useGame = (): GameContext
export const useCard = (cardId: string): CardContext
export const usePattern = (pattern: Pattern): PatternContext
export const useTheme = (): ThemeContext
export const useResponsiveState = (): ResponsiveState
```

**Services**:

```typescript
export const cardGeneratorService = {
  generateCard: (): Card,
  generateBatch: (count: number): Card[],
}
export const storageService = {
  saveGame: (game: GameState): void,
  loadGame: (id: string): GameState,
  getHistory: (): GameState[],
}
export const patternService = {
  getPatternName: (pattern: Pattern): string,
  visualizePattern: (pattern: Pattern): SVGPath,
  getAllPatterns: (): Pattern[],
}
```

### UI Layer (`src/ui/`)

**Organisms**:

- `GameBoard`: Main 5×5 card display with marking interface
- `PatternPreview`: Shows current pattern shape/animation
- `CallingBoard`: Displays called numbers and history
- `PlayerDashboard`: Shows scores and player info
- `SettingsModal`: Options for difficulty, patterns, themes
- `ResultsScreen`: Displays winners and leaderboard

**Molecules**:

- `Card`: 5×5 grid of cell components
- `PatternIndicator`: Shows which pattern is active
- `ScoreDisplay`: Current round and total scores
- `CallHistory`: Scrollable list of called numbers
- `PatternLegend`: Grid showing all available patterns

**Atoms**:

- `Cell`: Single card grid cell (number + marked state)
- `Button`: Standard button component
- `Badge`: Pattern name / status display
- `Icon`: SVG icons for patterns
- `Spinner`: Loading indicator

## Development Status

**Completion**: 68% Developing

### Done ✅

- Card generation with BINGO column distribution
- 5×5 grid rendering
- Basic marking/unmarking
- Single line pattern detection
- X-shape pattern detection
- T-shape pattern detection
- Four-corners pattern detection
- Full-card pattern detection
- Number calling system
- Score calculation
- Player management

### In Progress 🔄

- Custom pattern library expansion (8+ patterns)
- Pattern visualization and preview UI
- AI pattern selection strategy
- Leaderboard persistence
- Sound effects for pattern completion
- Animation of pattern completion

### To Do ❌

- Multi-round campaign mode
- Difficulty level variants (easy/medium/hard cards)
- Competitive multiplayer (network synchronization)
- Tournament mode with multiple rounds
- Pattern randomization per player
- Advanced AI that learns player strategies
- Mobile app optimization
- Accessible screen reader descriptions for patterns
- Replay system (record and review games)

## Getting Started

### Installation

```bash
cd apps/bingo-pattern
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
# Output: dist/ (optimized and minified)
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
pnpm lint             # ESLint check
pnpm format:check     # Prettier validation
pnpm typecheck        # TypeScript strict check
pnpm validate         # Full gate (lint + format + typecheck + build)
```

### Platform Builds

```bash
# Web
pnpm build

# Desktop (Electron)
pnpm electron:dev      # Development mode
pnpm electron:build:win  # Windows
pnpm electron:build:linux # Linux
pnpm electron:build:mac  # macOS

# Mobile (Capacitor)
pnpm cap:sync          # Sync to native projects
pnpm cap:open:android  # Open Android Studio
pnpm cap:open:ios      # Open Xcode
```

## Design Philosophy

- **Pattern Recognition**: Encourages spatial reasoning beyond simple line completion
- **Variety**: 8+ patterns keep gameplay fresh and challenging
- **Accessibility**: Supports keyboard-only play, screen readers, high-contrast themes
- **Community**: Leaderboards and replay system foster engagement
- **Cross-Platform**: Identical experience on web, desktop, and mobile
- **Responsive**: Works seamlessly from 375px (mobile) to 1800px (ultrawide) screens

## References

- [AGENTS.md](../../AGENTS.md) — Platform architecture and governance
- [CLEAN Architecture](../../docs/CLEAN-ARCHITECTURE.md) — Design patterns used
- [Bingo Variants](../../docs/GAME-FAMILIES.md#lottery) — Related games (Bingo-30, Bingo-80)

## License

Part of the Game Platform. See [LICENSE](../../LICENSE) file.
