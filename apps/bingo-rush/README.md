# Bingo Rush

## Quick Start

Rush Bingo is a time-based race variant where you compete against a countdown timer. Complete patterns before time runs out to advance levels and earn bonus points!

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

- **Global Timer**: Single countdown for entire game (doesn't reset per pattern)
- **Time Limits**:
  - Easy: 5 minutes total
  - Medium: 3 minutes total
  - Hard: 1.5 minutes total
  - Expert: 45 seconds total
- **Done Button**: Signal pattern completion to lock time and immediately advance pattern
- **Time Extension**: Completing a pattern adds 20 seconds (max 3 extensions = +60s) [auto stamping only]
- **Game End**: Timer reaches zero; score is locked

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
- **Acceleration**: Optional acceleration mode (calls 20% faster every 30 seconds)
- **No Repeats**: Numbers never repeat once called

### Winning

- **Pattern Win**: Complete any standard pattern (line, corners, frame, full-house)
- **Multiple Wins**: Win multiple patterns in one game for bonus multipliers
- **Time Bonus**: Completing patterns with time remaining grants time extension (auto mode) or bonus points

### Scoring

- **Base Score**: 100 per pattern
- **Speed Bonus**: +50 if completed within 10s of pattern-critical call
- **Time Remaining**: +1 point per 0.1 second remaining on clock
- **Accuracy Bonus**: Up to +50 for zero errors in manual stamping mode per pattern
- **Multiple Win Bonus**: 2nd pattern = 1.5x, 3rd = 2.0x, 4th+ = 2.5x
- **Total Score**: ∑(base × multiplier) + time_remaining_bonus - accuracy_penalties

### Failure & Game End

- **Time Expires**: Game ends immediately; score locked and ranked
- **Comeback Mechanic**: Completing a pattern adds 20 seconds (max 3 extensions) [auto mode only]
- **No Lives System**: One clock, no second chances in manual mode
- **Manual Mode Penalty**: Missing a stamp in manual mode breaks your pattern and costs time

---

## Architecture

### Domain Layer (`src/domain/`)

- **types.ts**: Extends `@games/bingo-core` with `RushGameState` (countdown timer, elapsed time, win multiplier, stamping mode, pattern count)
- **constants.ts**: Time limits per difficulty, acceleration curves, extension rules, speed rating thresholds
- **rush.ts**: Timer management, multiplier calculation, time extension logic, speed rating logic

### App Layer (`src/app/`)

- **hooks.ts**: `useRushGame()` hook with countdown timer, pattern multiplier tracking, stamping mode support
- **useTimer.ts**: Timer countdown with pause/resume, extension handling, time tracking
- **useStamping.ts**: Handle auto vs manual stamping, track stamp attempts
- **useSpeedRating.ts**: Calculate speed/accuracy per pattern
- **context.ts**: `RushContext` provider for shared timer state, stamping mode, pattern history

### UI Layer (`src/ui/`)

- **TimerDisplay.tsx**: Large countdown timer with color warning (green → yellow → red)
- **PatternMultiplier.tsx**: Current multiplier based on pattern count (1.0x → 2.5x)
- **SpeedRatingDisplay.tsx**: Speed/accuracy for current pattern
- **DoneButton.tsx**: Signal pattern completion regardless of visible time
- **StampingModeToggle.tsx**: Select auto or manual stamping at start
- **RushCard.tsx**: Standard bingo card with manual stamping support
- **RushBoard.tsx**: Combined card + timer + multiplier + speed rating layout
- **VictoryScreen.tsx**: Final score, multiplier breakdown, speed/accuracy stats, rank display
- **TimeExtensionAlert.tsx**: Notify player of time extension (auto mode only)

---

## Development Status

- ✅ Variant definition complete
- ✅ Architecture planned (updated with stamping/timer)
- 🔄 Domain layer implementation (in progress)
- ⏳ App hooks and timer integration (pending)
- ⏳ UI components and timer display (pending)
- ⏳ Testing (pending)

---

## Keyboard & Input

| Key           | Action                        |
| ------------- | ----------------------------- |
| **Click/Tap** | Mark number on card (manual) |
| **Space**     | Signal pattern completion   |
| **P**         | Pause/resume timer          |
| **A**         | Toggle acceleration mode    |
| **Esc**       | Quit and lock score         |

---

## Difficulty & Time


| Difficulty | Total Time | Call Speed | Extensions | Recommended For     |
| ---------- | ---------- | ---------- | ---------- | ------------------- |
| Easy       | 5 min      | 3s         | 3          | Relaxed play        |
| Medium     | 3 min      | 2s         | 2          | Standard rush       |
| Hard       | 1.5 min    | 1s         | 1          | Experienced players |
| Expert     | 45 sec     | 0.5s       | 0          | Champions only      |

---

## Acceleration Mode

When enabled, the call speed increases 20% every 30 seconds:

- Minute 0–0.5: 3s calls → 2.4s calls
- Minute 0.5–1: 2.4s calls → 1.9s calls
- And so on, bottoming out at 0.1s minimum

---

## Future Enhancements

- [ ] Leaderboard with global statistics
- [ ] Daily time-limited challenge
- [ ] Multiplayer race mode (synchronized timers)
- [ ] Custom time limits (user-defined minutes)
- [ ] Streaks and combo mechanics
- [ ] Sound effects for clock warnings
- [ ] Screen reader accessible timer announcements

---

**Author**: Scott Reinhart  
**Platform**: Web (React), Mobile (Capacitor), Desktop (Electron)  
**Status**: Early development (25-40%)
