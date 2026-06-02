# Bingo Survival

## Quick Start

Survival Bingo is an endless endurance variant where you face increasing challenges—more cards, faster calling, higher card densities—without a finish line. Survive as long as you can!

**Controls**: 
- **Auto Stamping**: Numbers are marked automatically as called
- **Manual Stamping**: Click/tap to mark numbers (risk missing stamps = losing)
- **Done Button**: Signal pattern completion to advance to next level faster
- **Difficulty**: Easy → Medium → Hard → Expert (auto-scales with level)

---

## Game Rules

### Card System

- **Starting**: 1 card, 5×5 grid, numbers 1–90 (standard columns B, I, N, G, O)
- **Progression**: +1 card every 3 levels (level 6 = 2 cards, level 9 = 3 cards, etc.)
- **Density**: Numbers per card increase with density scaling (1.0 → 1.25 → 1.5 as levels increase)

### Stamping Modes

#### Auto Stamping
- Numbers are automatically marked as they are called
- Focus on pattern recognition and level progression
- Better for casual, long-play sessions

#### Manual Stamping
- You must manually click/tap each called number on your card
- **Risk**: Miss a stamp and your pattern is broken; lose the round
- **Challenge**: Sustained focus becomes harder as levels increase
- **Penalty**: 5 points per missed stamp, 10 per incorrect stamp (stacks per card)

### Round Timer System

- **Per-Level Limits**: Each level has a time limit for pattern completion
- **Time Limits**:
  - Levels 1–3: 120 seconds
  - Levels 4–6: 90 seconds
  - Levels 7–9: 60 seconds
  - Level 10+: 45 seconds
- **Done Button**: Signal pattern completion to immediately advance
- **Level Advancement**: Complete pattern before time expires to advance level
- **Time Penalty**: Missing time limit ends the game

### Speed Rating System

Each level completion is rated on both speed and accuracy:

```
Speed Score: 100 = instant, 0 = used full level time
Accuracy Score: 100 = no errors, deducted for manual mode misses  
Combined Rating: (Speed Score + Accuracy Score) / 2
```

Higher combined rating = larger bonuses as levels progress

### Calling System

- **Initial Call Interval**: 3 seconds (Easy), 2 seconds (Medium), 1 second (Hard), 0.5 seconds (Expert)
- **Acceleration**: Call interval decreases 0.5s every 2 levels (minimum 0.2s)
- **No Repeats**: Every number called remains in the history; never repeats

### Winning

- **Pattern Win**: Complete any standard pattern (line, corners, frame, full-house)
- **Level Advancement**: Completing a pattern advances you to the next level
- **Survival Score**: `(level × 100) + (time_seconds) + (bonus_multiplier × pattern_bonuses) - accuracy_penalties`

### Bonus System

- **Speed Bonus**: +50 if pattern completed within 5s of last call (tighter as levels increase)
- **Rapid Marking Bonus**: +5 per cell marked within 300ms of call (decreases to 200ms at level 10+) [auto mode only]
- **Accuracy Bonus**: Up to +50 for zero errors in manual stamping mode per level
- **Multi-Card Bonus**: +25 per extra card completed in same round (3 cards all win = +75)
- **Streak Bonus**: +100 for 5 consecutive wins without missing a call

### Failure Conditions

- **Miss Window**: If you don't complete a pattern within the level time limit, the round ends and score is locked
- **Game Over**: No lives system; missing a required pattern ends the game
- **Survivor Status**: Your final level + total score determines rank (Novice, Survivor, Veteran, Legend, Eternal)

---

## Architecture

### Domain Layer (`src/domain/`)

- **types.ts**: Extends `@games/bingo-core` types with `SurvivalGameState` (level, acceleration config, level history, stamping mode, round timer)
- **constants.ts**: Survival-specific configs (level thresholds, card progression table, acceleration curves, timer durations)
- **survival.ts**: Level progression logic, card density scaling, difficulty calculation per level, speed rating logic

### App Layer (`src/app/`)

- **hooks.ts**: `useSurvivalGame()` hook (extends `useBingoGame()` with level progression, score tracking, streak detection, stamping mode, round timer)
- **useLevel.ts**: Track current level, progression conditions, next obstacle
- **useRoundTimer.ts**: Manage per-level time limits, early advancement
- **useStamping.ts**: Handle auto vs manual stamping, validate attempts per card
- **useSpeedRating.ts**: Calculate speed/accuracy per level
- **context.ts**: `SurvivalContext` provider with level state, game history, survivor ranking, stamping configuration

### UI Layer (`src/ui/`)

- **LevelDisplay.tsx**: Current level, card count, call interval, streak counter
- **LevelTimer.tsx**: Time remaining for current level with visual warnings
- **DoneButton.tsx**: Advance to next level early upon pattern completion
- **SpeedRatingDisplay.tsx**: Speed/accuracy for current level
- **StampingModeToggle.tsx**: Select stamping mode before starting
- **SurvivalCard.tsx**: Extends `BingoCard` with density-aware layout and manual stamping support
- **SurvivalBoard.tsx**: Multi-card layout (1-3 cards side-by-side, responsive) with timer and rating
- **SurvivorRanking.tsx**: Rank display based on level + score

---

## Development Status

- ✅ Variant definition complete
- ✅ Architecture planned (updated with stamping/timer)
- 🔄 Domain layer implementation (in progress)
- ⏳ App hooks and context (pending)
- ⏳ UI components (pending)
- ⏳ Testing (pending)

---

## Keyboard & Input

| Key           | Action                        |
| ------------- | ----------------------------- |
| **Click/Tap** | Mark number on card (manual)  |
| **Space**     | Advance level / Done button   |
| **R**         | Reset level (keep score)      |
| **Esc**       | Quit to menu                  |

---

## Difficulty Levels by Level

| Level  | Call Speed | Cards | Density | Time Limit | Base Score | Notes              |
| ------ | ---------- | ----- | ------- | ---------- | ---------- | ------------------ |
| 1–3    | 3.0s       | 1     | 1.0x    | 120s       | 100        | Warm-up phase      |
| 4–6    | 2.0s       | 2     | 1.1x    | 90s        | 200        | Acceleration       |
| 7–9    | 1.0s       | 3     | 1.25x   | 60s        | 400        | Expert challenge   |
| 10+    | 0.5s       | 3     | 1.5x    | 45s        | 1000+      | Extreme survival   |

---

## Future Enhancements

- [ ] Leaderboard with rank tiers (Novice → Eternal)
- [ ] Daily challenge mode with fixed seed
- [ ] Cooperative multiplayer (2-4 survivors racing)
- [ ] Power-ups (slowdown, freeze, extra time)
- [ ] Audio cues for level up, speed threshold changes
- [ ] Accessibility: High contrast mode, screen reader support

---

**Author**: Scott Reinhart  
**Platform**: Web (React), Mobile (Capacitor), Desktop (Electron)  
**Status**: Early development (25-40%)
