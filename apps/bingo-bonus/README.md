# Bingo Bonus

## Quick Start

Bonus Bingo is a bonus multiplier variant where each successive pattern completed increases your multiplier, stacking rewards. Build multipliers to maximize your final score!

**Controls**: 
- **Auto Stamping**: Numbers are marked automatically as called
- **Manual Stamping**: Click/tap to mark numbers (risk missing stamps = losing)
- **Done Button**: Signal completion to end round early and advance faster
- **Difficulty**: Easy (2x max) → Expert (10x max)

---

## Game Rules

### Card System

- **Standard Layout**: 5×5 grid, numbers 1–90 (columns B, I, N, G, O)
- **Free Space**: Center cell pre-marked
- **Card Count**: 1 or 2 cards per game (selectable)

### Stamping Modes

#### Auto Stamping
- Numbers are automatically marked as they are called
- No risk of missing stamps
- Focus on pattern recognition only

#### Manual Stamping
- You must manually click/tap each called number on your card
- **Risk**: If you miss marking a number, you lose that stamp and cannot win the pattern
- **Strategy**: Requires speed and accuracy under pressure
- **Penalty**: 5 points deducted per missed stamp, 10 points per incorrect stamp

### Calling System

- **Standard Interval**: 3s (Easy), 2s (Medium), 1s (Hard), 0.5s (Expert)
- **No Repeats**: Numbers don't repeat once called
- **Game End**: 90 numbers maximum available

### Round Timer System

- **Enabled per difficulty**: Each round has a fixed time limit
- **Round Durations**: 
  - Easy: 45 seconds
  - Medium: 30 seconds
  - Hard: 20 seconds
  - Expert: 10 seconds
- **Done Button**: Signal you've finished marking early to advance quicker
- **Early Completion Bonus**: Up to +50 points for finishing within 30% of round time
- **Time Penalty**: Automatic round end if time expires

### Speed Rating System

Completed patterns are rated on both speed and accuracy:

```
Speed Score: 100 = instant, 0 = used full round time
Accuracy Score: 100 = no errors, deducted for missed/incorrect stamps
Combined Rating: (Speed Score + Accuracy Score) / 2
```

**Speed bonuses applied to winning pattern score based on combined rating**

### Multiplier System

- **Starting Multiplier**: 1x (first pattern gives 1x base score)
- **Multiplier Increase**: +0.5x per consecutive pattern completion
  - 1st pattern: 1.0x → 100 points
  - 2nd pattern: 1.5x → 150 points (base 100)
  - 3rd pattern: 2.0x → 200 points
  - 4th+ pattern: 2.5x → 250 points, ...capping at difficulty max
- **Multiplier Cap**: 2x (Easy), 4x (Medium), 7x (Hard), 10x (Expert)
- **Multiplier Reset**: Failing to complete a pattern within 120 seconds resets multiplier to 1x

### Streak Bonuses

- **2-Pattern Streak**: +50 bonus points
- **3-Pattern Streak**: +100 bonus points
- **4+ Pattern Streak**: +250 bonus points (repeats every pattern after 4)

### Scoring Formula

```
Pattern Score = (Base Score × Current Multiplier) + Streak Bonus + Speed Bonus - Accuracy Penalties
Total Score = Σ(Pattern Scores) + Time Bonus + Early Completion Bonuses
```

### Win Conditions

- **Game End**: Game ends when multiplier resets or all 90 numbers are called
- **Best Multiplier**: Track the highest multiplier achieved in a session
- **Final Score**: Best multiplier reached determines your rank
- **Leaderboard**: Speed rating and accuracy combined for ranking

---

## Architecture

### Domain Layer (`src/domain/`)

- **types.ts**: Extends `@games/bingo-core` with `BonusGameState` (current multiplier, streak count, max multiplier, stamping mode, round timer)
- **constants.ts**: Difficulty caps, streak thresholds, reset rules, timer durations
- **bonus.ts**: Multiplier calculation, streak detection, reset logic, speed rating logic

### App Layer (`src/app/`)

- **hooks.ts**: `useBonusGame()` hook with multiplier state tracking, streak management, stamping mode selection
- **useMultiplier.ts**: Compute current multiplier based on consecutive wins
- **useStreak.ts**: Track streak count and apply bonuses
- **useRoundTimer.ts**: Manage round timer state, early completion detection
- **useStamping.ts**: Handle auto vs manual stamping mode, validate stamp attempts
- **useSpeedRating.ts**: Calculate speed and accuracy ratings per round
- **context.ts**: `BonusContext` provider for multiplier state and stamping mode

### UI Layer (`src/ui/`)

- **MultiplierDisplay.tsx**: Large, prominent multiplier counter (e.g., "4.5x") with color intensity
- **StreakCounter.tsx**: Current streak display, bonus trigger notifications
- **StampingModeToggle.tsx**: Select auto or manual stamping before game start
- **RoundTimer.tsx**: Countdown timer display with visual warnings as time expires
- **DoneButton.tsx**: Signal round completion and skip remaining time
- **SpeedRatingDisplay.tsx**: Show speed/accuracy scores and combined rating
- **BonusCard.tsx**: Standard bingo card with stamping interaction (auto or manual)
- **BonusBoard.tsx**: Card + multiplier + streak + timer + speed rating layout
- **VictoryScreen.tsx**: Final score, best multiplier, streak analysis, speed/accuracy stats

---

## Development Status

- ✅ Variant definition complete
- ✅ Architecture planned
- 🔄 Domain layer implementation (in progress)
- ⏳ App hooks and multiplier tracking (pending)
- ⏳ UI components and multiplier display (pending)
- ⏳ Testing (pending)

---

## Keyboard & Input

| Key           | Action                        |
| ------------- | ----------------------------- |
| **Click/Tap** | Mark number on card           |
| **Space**     | Start new game                |
| **M**         | Toggle multiplier detail view |
| **Esc**       | Quit and lock score           |

---

## Difficulty & Multiplier Caps

| Difficulty | Max Multiplier | Call Speed | Recommended For               |
| ---------- | -------------- | ---------- | ----------------------------- |
| Easy       | 2.0x           | 3s         | Learning multiplier mechanics |
| Medium     | 4.0x           | 2s         | Standard bonus play           |
| Hard       | 7.0x           | 1s         | Experienced players           |
| Expert     | 10.0x          | 0.5s       | Multiplier champions          |

---

## Strategy Tips

1. **Consistency Matters**: Each consecutive pattern adds +0.5x; 10 patterns with 2x cap = 1000+ points
2. **Streak Awareness**: Knowing you're close to streak bonuses helps planning
3. **Risk Management**: Going for risky patterns to maintain streak vs. playing it safe
4. **Timing**: With reset on 120-second inactivity, don't hesitate on pattern completion

---

## Future Enhancements

- [ ] Leaderboard with best multiplier per difficulty
- [ ] Daily multiplier challenge
- [ ] Multiplier power-ups (extend cap, extend reset timer)
- [ ] Multiplier frenzy mode (call speed increases with multiplier)
- [ ] Cooperative multiplier share (2+ players build collective multiplier)
- [ ] Accessibility: Audio cues for multiplier milestones

---

**Author**: Scott Reinhart  
**Platform**: Web (React), Mobile (Capacitor), Desktop (Electron)  
**Status**: Early development (25-40%)
