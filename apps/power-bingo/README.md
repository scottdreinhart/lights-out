# Power Bingo

Power Bingo adds a strategic layer to classic bingo through collectible power-ups that modify your card, accelerate marking, or grant bonus points. Balance timing your power-ups against using them immediately for maximum effect!

## Quick Start

Power Bingo combines luck with strategy. As you play, collect power-ups that enhance your gameplay:

- **Auto-Mark**: Automatically mark multiple called numbers at once
- **Instant Pattern**: Instantly complete one missing square in a pattern
- **Double Points**: Earn 2x points on your next winning pattern
- **Shield**: Recover from a missed stamp without penalty
- **Time Extend**: Add 30 seconds to your remaining clock

**Controls**:

- **Auto Stamping**: Numbers are marked automatically as called
- **Manual Stamping**: Click/tap to mark numbers (risk missing stamps = losing)
- **Done Button**: Signal pattern completion to lock time and advance
- **Power-Up**: Right-click or long-press to activate collected power-up
- **Difficulty**: Easy (5 min) → Medium (3 min) → Hard (1.5 min) → Expert (45 sec)

---

## Game Rules

### Card System

- **Standard Layout**: 5×5 grid, numbers 1–90 (columns B, I, N, G, O)
- **Free Space**: Center cell pre-marked
- **Card Count**: 1 or 2 cards per game (selectable at start)
- **Power-Up Slot**: Visible to show collected and active power-ups

### Stamping Modes

#### Auto Stamping

- Numbers are automatically marked as they are called
- Focus entirely on pattern recognition and power-up strategy
- Best for pure speed-based play

#### Manual Stamping

- You must manually click/tap each called number on your card
- **Risk**: Miss a stamp and your pattern is broken; hand in time limit
- **Challenge**: Precision and speed both matter—more difficult as time pressure increases
- **Penalty**: 5 points per missed stamp, 10 per incorrect stamp (deducted from final score)
- **Shield Power-Up**: Negates next penalty if activated

### Round Timer System

- **Global Timer**: Single countdown for entire game session
- **Time Limits**:
  - Easy: 5 minutes total
  - Medium: 3 minutes total
  - Hard: 1.5 minutes total
  - Expert: 45 seconds total
- **Time Extend Power-Up**: Adds 30 seconds (usable 2x per game)
- **Done Button**: Signal pattern completion to immediately lock and advance
- **Game End**: Timer reaches zero; score is locked

### Power-Up System

Power-ups are earned by completing patterns. Each has strategic timing implications:

| Power-Up            | Effect                                    | Duration    | Strategic Use                          |
| ------------------- | ----------------------------------------- | ----------- | -------------------------------------- |
| **Auto-Mark**       | Next 3 called numbers auto-marked         | Immediate   | Use during fast calling or manual mode |
| **Instant Pattern** | Fill one missing square in active pattern | Immediate   | Use when one square away from win      |
| **Double Points**   | Next pattern win × 2 points               | One pattern | Use on high-scoring patterns           |
| **Shield**          | Negate next penalty (manual mode)         | One use     | Use after risky stamping               |
| **Time Extend**     | Add 30 seconds to clock                   | Immediate   | Use when timer approaching zero        |

**Earning Power-Ups**: Each completed pattern grants 1 power-up from the pool; choose which to collect

### Winning

- **Pattern Win**: Complete any standard pattern (line, corners, frame, full-house with variations)
- **Multiple Wins**: Win multiple patterns in one game for bonus multipliers
- **Power-Up Multiplier**: Double Points power-up activates on next pattern win

### Speed Rating System

Each pattern completion is rated on speed and accuracy:

```
Speed Score: 100 = instant, 0 = pattern completed near time expiration
Accuracy Score: 100 = no errors, deducted for manual mode misses, restored by Shield
Combined Rating: (Speed Score + Accuracy Score) / 2
```

**Critical**: In manual mode without Shield active, penalties persist until game end

### Calling System

- **Speed**: Calls every 3s (Easy), 2s (Medium), 1s (Hard), 0.5s (Expert)
- **No Repeats**: Numbers never repeat once called

### Scoring

- **Base Score**: 100 per pattern
- **Speed Bonus**: +50 if completed within 10s of pattern-critical call
- **Time Remaining**: +1 point per 0.1 second remaining on clock
- **Double Points Bonus**: Applied automatically if power-up active (×2 multiplier)
- **Pattern Multiplier**: 2nd pattern = 1.5x, 3rd = 2.0x, 4th+ = 2.5x
- **Accuracy Bonus**: Up to +50 for zero errors in manual stamping mode per pattern
- **Total Score**: ∑(base × multiplier × speedBonus) + time_remaining_bonus - accuracy_penalties

### Failure & Game End

- **Time Expires**: Game ends immediately; unused power-ups scored as 10 points each
- **No Lives System**: One clock, no second chances in manual mode (unless Shield active)
- **Manual Mode Penalty**: Missing a stamp costs points unless Shield power-up is active

### Penalty & Recovery

- **Manual Miss Penalty**: -5 per missed, -10 per wrong stamp (without Shield)
- **Shield Protection**: Next penalty is negated, then Shield is consumed
- **Accumulated Penalties**: Tracked in score display throughout game

---

## Architecture

### Domain Layer (`src/domain/`)

- **types.ts**: Extends `@games/bingo-core` with `PowerGameState` (collected power-ups, active power-up, power-up history, shield status)
- **constants.ts**: Time limits per difficulty, power-up definitions, scoring tables, earning rates
- **power-ups.ts**: Power-up effect implementations, validation, activation logic
- **power-engine.ts**: Power-up earning rules, collection logic, multiplier integration

### App Layer (`src/app/`)

- **hooks.ts**: `usePowerGame()` hook with power-up tracking and collection
- **useTimer.ts**: Timer countdown with power-up extension handling
- **useStamping.ts**: Handle auto vs manual stamping, integrate Shield power-up
- **useSpeedRating.ts**: Calculate speed/accuracy per pattern
- **usePowerUps.ts**: Manage power-up earning, activation, status tracking
- **context.ts**: `PowerContext` provider for shared power-up state, stamping mode, scores

### UI Layer (`src/ui/`)

- **TimerDisplay.tsx**: Large countdown timer with color warning, Time Extend available indicator
- **PowerUpCollector.tsx**: Earned power-ups to choose from after pattern win
- **PowerUpSlot.tsx**: Shows currently active power-up with visual effect
- **PowerUpButton.tsx**: Interactive button to activate/use current power-up
- **SpeedRatingDisplay.tsx**: Speed/accuracy for current pattern
- **DoneButton.tsx**: Signal pattern completion and move to next objective
- **StampingModeToggle.tsx**: Select auto or manual stamping at start
- **PowerCard.tsx**: Standard bingo card with manual stamping support and power-up indicators
- **PowerBoard.tsx**: Combined card + timer + power-ups + speed rating layout
- **VictoryScreen.tsx**: Final score, power-up usage breakdown, unused power-ups score, accuracy stats
- **ShieldIndicator.tsx**: Visual indicator when Shield is active (manual mode)

---

## Development Status

- ✅ Variant definition complete
- ✅ Architecture planned (with stamping/timer/power-ups)
- 🔄 Domain layer implementation (in progress)
- ⏳ App hooks and power-up system (pending)
- ⏳ UI components and power-up visuals (pending)
- ⏳ Testing (pending)

---

## Keyboard & Input

| Key                              | Action                       |
| -------------------------------- | ---------------------------- |
| **Click/Tap**                    | Mark number on card (manual) |
| **Space**                        | Signal pattern completion    |
| **Right-Click** / **Long-Press** | Activate current power-up    |
| **P**                            | Pause/resume timer           |
| **Esc**                          | Quit and lock score          |

---

## Difficulty & Time

| Difficulty | Time Limit | Call Speed         | Power-Up Availability       | Manual Mode Challenge |
| ---------- | ---------- | ------------------ | --------------------------- | --------------------- |
| **Easy**   | 5 min      | 3s between calls   | High (1 per pattern)        | Low                   |
| **Medium** | 3 min      | 2s between calls   | Medium (1 per 1.5 patterns) | Medium                |
| **Hard**   | 1.5 min    | 1s between calls   | Low (1 per 2 patterns)      | High                  |
| **Expert** | 45s        | 0.5s between calls | Very Low (1 per 3 patterns) | Very High             |

All difficulties support both auto and manual stamping modes. Power-up frequency scales with difficulty.
