# Pattern Bingo

Pattern Bingo challenges you to complete multiple different winning configurations on the same card. Each pattern type offers increasing point rewards and strategic depth—mix and match patterns to maximize your score!

## Quick Start

Pattern Bingo mixes strategy with speed. On each card, you can win in multiple ways:

- **Line Bingo**: Five in a row (horizontal, vertical, diagonal)
- **Four Corners**: Mark all four corner squares
- **Frame**: Mark the entire outer border
- **Plus Sign**: Mark the center cross
- **Full House**: Cover entire card for maximum points

**Controls**:

- **Auto Stamping**: Numbers are marked automatically as called
- **Manual Stamping**: Click/tap to mark numbers (risk missing stamps = losing)
- **Done Button**: Signal pattern completion to lock time and advance
- **Difficulty**: Easy (5 min) → Medium (3 min) → Hard (1.5 min) → Expert (45 sec)

---

## Game Rules

### Card System

- **Standard Layout**: 5×5 grid, numbers 1–90 (columns B, I, N, G, O)
- **Free Space**: Center cell pre-marked
- **Card Count**: 1 or 2 cards per game (selectable at start)

### Stamping Modes

#### Auto Stamping

- Numbers are automatically marked as they are called
- Focus entirely on pattern recognition under time pressure
- Best for pure speed-based play

#### Manual Stamping

- You must manually click/tap each called number on your card
- **Risk**: Miss a stamp and your pattern is broken; hand in time limit
- **Challenge**: Precision and speed both matter—more difficult as time pressure increases
- **Penalty**: 5 points per missed stamp, 10 per incorrect stamp (deducted from final score)

### Round Timer System

- **Global Timer**: Single countdown for entire game session
- **Time Limits**:
  - Easy: 5 minutes total
  - Medium: 3 minutes total
  - Hard: 1.5 minutes total
  - Expert: 45 seconds total
- **Done Button**: Signal pattern completion to immediately lock and advance to next pattern
- **Game End**: Timer reaches zero; score is locked

### Winning Patterns

Each pattern has different point value and complexity:

| Pattern        | Description                                       | Base Points | Win Condition                                  |
| -------------- | ------------------------------------------------- | ----------- | ---------------------------------------------- |
| **Line**       | 5 in a row (horiz/vert/diag)                      | 100         | Any complete line                              |
| **Corners**    | All 4 corner squares                              | 150         | Top-left, top-right, bottom-left, bottom-right |
| **Frame**      | Entire outer border                               | 200         | All 16 edge squares                            |
| **Plus**       | Center cross (vertical + horizontal through FREE) | 175         | Center column + center row                     |
| **Full House** | All 25 squares                                    | 500         | Complete card coverage                         |

### Speed Rating System

Each pattern completion is rated on speed and accuracy:

```
Speed Score: 100 = instant, 0 = pattern completed near time expiration
Accuracy Score: 100 = no errors, deducted for manual mode misses
Combined Rating: (Speed Score + Accuracy Score) / 2
```

**Critical**: In manual mode, failing to complete a pattern before time expires = game over (no second chance)

### Calling System

- **Speed**: Calls every 3s (Easy), 2s (Medium), 1s (Hard), 0.5s (Expert)
- **No Repeats**: Numbers never repeat once called

### Scoring

- **Pattern Base**: 100 (Line) to 500 (Full House) per pattern type
- **Pattern Multiplier**: 2nd pattern = 1.5x, 3rd = 2.0x, 4th+ = 2.5x
- **Speed Bonus**: +50 if completed within 10s of pattern-critical call
- **Time Remaining**: +1 point per 0.1 second remaining on clock
- **Accuracy Bonus**: Up to +50 for zero errors in manual stamping mode per pattern
- **Total Score**: ∑(base × multiplier) + time_remaining_bonus - accuracy_penalties

### Failure & Game End

- **Time Expires**: Game ends immediately; score locked and ranked
- **No Lives System**: One clock, no second chances in manual mode
- **Manual Mode Penalty**: Missing a stamp in manual mode costs points and jeopardizes pattern

---

## Architecture

### Domain Layer (`src/domain/`)

- **types.ts**: Extends `@games/bingo-core` with `PatternGameState` (pattern array, current pattern index, completed patterns, timer)
- **constants.ts**: Time limits per difficulty, pattern definitions, scoring tables, accuracy thresholds
- **patterns.ts**: Pattern detection logic, validates completed patterns against card state
- **pattern-engine.ts**: Manages pattern progression, multiplier calculation, pattern history

### App Layer (`src/app/`)

- **hooks.ts**: `usePatternGame()` hook with pattern detection and multiplier tracking
- **useTimer.ts**: Timer countdown with pause/resume, pattern-specific timing
- **useStamping.ts**: Handle auto vs manual stamping, track stamp attempts
- **useSpeedRating.ts**: Calculate speed/accuracy per pattern
- **context.ts**: `PatternContext` provider for shared pattern state, stamping mode, scores

### UI Layer (`src/ui/`)

- **TimerDisplay.tsx**: Large countdown timer with color warning (green → yellow → red)
- **PatternIndicator.tsx**: Shows current pattern objective with visual highlight on card
- **PatternMultiplier.tsx**: Current multiplier based on patterns completed (1.0x → 2.5x)
- **SpeedRatingDisplay.tsx**: Speed/accuracy for current pattern
- **DoneButton.tsx**: Signal pattern completion and move to next objective
- **StampingModeToggle.tsx**: Select auto or manual stamping at start
- **PatternCard.tsx**: Standard bingo card with manual stamping support and pattern highlights
- **PatternBoard.tsx**: Combined card + timer + pattern indicator + multiplier + speed rating
- **VictoryScreen.tsx**: Final score, pattern breakdown, multiplier stats, accuracy summary
- **PatternHistory.tsx**: Log of completed patterns with points earned

---

## Development Status

- ✅ Variant definition complete
- ✅ Architecture planned (with stamping/timer)
- 🔄 Domain layer implementation (in progress)
- ⏳ App hooks and timer integration (pending)
- ⏳ UI components and pattern highlighting (pending)
- ⏳ Testing (pending)

---

## Keyboard & Input

| Key           | Action                       |
| ------------- | ---------------------------- |
| **Click/Tap** | Mark number on card (manual) |
| **Space**     | Signal pattern completion    |
| **P**         | Pause/resume timer           |
| **Esc**       | Quit and lock score          |

---

## Difficulty & Time

| Difficulty | Time Limit | Call Speed         | Manual Mode Challenge |
| ---------- | ---------- | ------------------ | --------------------- |
| **Easy**   | 5 min      | 3s between calls   | Low                   |
| **Medium** | 3 min      | 2s between calls   | Medium                |
| **Hard**   | 1.5 min    | 1s between calls   | High                  |
| **Expert** | 45s        | 0.5s between calls | Very High             |

All difficulties support both auto and manual stamping modes.
