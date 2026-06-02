# Bingo Blackout

## Quick Start

Blackout Bingo is a full-card completion variant where the objective is to mark every single cell on your card. First to blackout wins!

**Controls**: 
- **Auto Stamping**: Numbers are marked automatically as called
- **Manual Stamping**: Click/tap to mark numbers (risk missing stamps = losing)
- **Done Button**: Signal completion to end round early and advance faster
- **Difficulty**: Easy (1 card, 5 min) → Hard (2 cards, 1 min)

---

## Game Rules

### Card System

- **Standard Layout**: 5×5 grid, numbers 1–90 (columns B, I, N, G, O)
- **Free Space**: Center cell pre-marked (counts as 1/25)
- **Cards**: 1 card (Easy/Medium) or 2 cards (Hard/Expert) for full blackout challenge

### Stamping Modes

#### Auto Stamping
- Numbers are automatically marked as they are called
- Focus on card completion tracking only
- Best for speed-focused play

#### Manual Stamping
- You must manually click/tap each called number on your card
- **Risk**: If you miss marking a number, you lose that stamp and cannot achieve blackout
- **Strategy**: Requires sustained focus and speed throughout entire game
- **Penalty**: 5 points deducted per missed stamp, 10 points per incorrect stamp

### Round Timer System

- **Completion-Based**: Game proceeds until blackout is achieved or time expires
- **Time Limits by Difficulty**:
  - Easy: 5 minutes
  - Medium: 3 minutes
  - Hard: 2 minutes
  - Expert: 1.5 minutes
- **Done Button**: Signal you've achieved blackout early to lock in your time
- **Time Penalty**: Automatic end if time expires before blackout

### Speed Rating System

Blackout completion is rated on both speed and accuracy:

```
Speed Score: 100 = instant completion, 0 = used full time limit
Accuracy Score: 100 = no missed stamps, deducted for manual mode errors
Combined Rating: (Speed Score + Accuracy Score) / 2
```

### Win Condition

- **Blackout**: Mark all 24 non-free cells (25 total with free space) on a single card
- **Multiple Cards**: If playing 2+ cards, both must be blackout simultaneously for multi-card bonus
- **Full Card Completion**: Only the first player to achieve blackout wins (single-player game)
- **Time-Based Ranking**: Fastest blackout time + accuracy determines rank

### Calling System

- **Standard Interval**: 3s (Easy), 2s (Medium), 1s (Hard), 0.5s (Expert)
- **Calling Duration**: Games typically last 2–10 minutes depending on difficulty
- **No Repeats**: Every number called is retired and never called again

### Scoring

- **Base Win Score**: 500 (single card) or 1000 (dual cards)
- **Speed Bonus**: +100 per 10 seconds remaining on theoretical max time (e.g., max 3 min game, 1 min remaining = +300)
- **Accuracy Bonus**: Up to +50 points for manual mode with zero errors
- **Multi-Card Bonus**: +500 if both cards blackout simultaneously (only in dual-card mode)
- **Efficiency Score**: (Time Remaining / Max Time) × 100 + Base Score - Accuracy Penalties

### Game Features

- **Progressive Difficulty**: Each win can unlock harder difficulty tiers
- **Challenge Tiers**: Practice → Standard → Expert → Extreme (increasing card density)
- **Session Tracking**: Track best time per difficulty, win streaks, speed ratings
- **Completion Tracking**: Visual progress bar showing completion percentage

---

## Architecture

### Domain Layer (`src/domain/`)

- **types.ts**: Extends `@games/bingo-core` with `BlackoutGameState` (cards in play, completion %, best time tracking, stamping mode, round timer)
- **constants.ts**: Difficulty definitions, score thresholds, time limits per difficulty, speed rating thresholds
- **blackout.ts**: Completion detection logic, multi-card synchronization, scoring calculations, speed rating logic

### App Layer (`src/app/`)

- **hooks.ts**: `useBlackoutGame()` hook with completion tracking, multi-card state management, stamping mode selection
- **useCompletion.ts**: Monitor completion percentage, detect blackout condition
- **useRoundTimer.ts**: Manage blackout timer state, completion time tracking
- **useStamping.ts**: Handle auto vs manual stamping mode, validate stamp attempts
- **useSpeedRating.ts**: Calculate speed and accuracy ratings
- **context.ts**: `BlackoutContext` for session state, difficulty tracking, stamping mode

### UI Layer (`src/ui/`)

- **CompletionBar.tsx**: Visual progress bar showing cell completion %
- **StampingModeToggle.tsx**: Select auto or manual stamping before game start
- **RoundTimer.tsx**: Countdown timer display with visual warnings
- **DoneButton.tsx**: Signal blackout completion and lock in time
- **SpeedRatingDisplay.tsx**: Show speed/accuracy scores and combined rating
- **BlackoutCard.tsx**: Card display with visual feedback on completion, stamping interaction
- **BlackoutBoard.tsx**: Multi-card board layout (1 or 2 cards) with timer and speed rating
- **TimerDisplay.tsx**: Time elapsed, best time comparison
- **VictoryScreen.tsx**: Win stats, time taken, speed/accuracy ratings, score breakdown

---

## Development Status

- ✅ Variant definition complete
- ✅ Architecture planned (updated with stamping/timer)
- 🔄 Domain layer implementation (in progress)
- ⏳ App hooks and completion tracking (pending)
- ⏳ UI components (pending)
- ⏳ Testing (pending)

---

## Keyboard & Input

| Key           | Action                        |
| ------------- | ----------------------------- |
| **Click/Tap** | Mark number on card (manual)  |
| **Space**     | Start new game / Done button  |
| **D**         | Change difficulty            |
| **Esc**       | Return to menu                |

---

## Difficulty Levels

| Level  | Cards | Call Speed | Est. Time | Stamping | Score Base |
| ------ | ----- | ---------- | --------- | -------- | ---------- |
| Easy   | 1     | 3s         | 4–5 min   | Any      | 500        |
| Medium | 1     | 2s         | 2–3 min   | Any      | 750        |
| Hard   | 2     | 1s         | 3–5 min   | Any      | 1000       |
| Expert | 2     | 0.5s       | 2–4 min   | Manual   | 1500       |

---

## Strategy Tips

1. **Early Focus**: In dual-card mode, mentally divide and prioritize—focus on columns B and I for both cards simultaneously
2. **Pattern Recognition**: Know which numbers you need; develop pattern awareness
3. **Speed Runs**: Expert difficulty is about speed; accuracy is secondary
4. **Session Planning**: Warm up with Easy before attempting Expert

---

## Future Enhancements

- [ ] Leaderboard with times per difficulty
- [ ] Daily blackout challenge (fixed seed)
- [ ] Multiplayer racing mode (first to blackout wins)
- [ ] Blind blackout variant (numbers called only by sound cue)
- [ ] Card preview before game starts
- [ ] Accessibility: High contrast cards, audio cues

---

**Author**: Scott Reinhart  
**Platform**: Web (React), Mobile (Capacitor), Desktop (Electron)  
**Status**: Early development (25-40%)
