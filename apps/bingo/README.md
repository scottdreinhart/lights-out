# Bingo (Standard 75-Ball)

## Quick Start

Classic Bingo is the timeless lottery game where players mark numbers to complete winning patterns. Get five-in-a-row (horizontal, vertical, or diagonal) or compete for full-card blackout bonuses!

**Controls**:

- **Auto Stamping**: Numbers are marked automatically as called
- **Manual Stamping**: Click/tap to mark numbers (risk missing stamps = losing)
- **Done Button**: Signal pattern completion to end round early and advance faster
- **Difficulty**: Easy (1 card) → Expert (4+ cards)

---

## Game Rules

### Card System

- **Standard Layout**: 5×5 grid (25 squares including FREE center)
- **Columns**: B (1-15), I (16-30), N (31-45), G (46-60), O (61-75)
- **Free Space**: Center cell (N-45) pre-marked at game start
- **Card Count**: 1 to 4 cards per game (selectable)

### Stamping Modes

#### Auto Stamping

- Numbers are automatically marked as they are called
- Focus on pattern recognition only
- Best for casual, long-play sessions

#### Manual Stamping

- You must manually click/tap each called number on your card
- **Risk**: If you miss marking a number, you lose that stamp and cannot win the pattern
- **Challenge**: Requires speed and accuracy under time pressure
- **Penalty**: 5 points deducted per missed stamp, 10 points per incorrect stamp

### Calling System

- **Number Range**: 1-75 (all numbers randomly called)
- **Calling Format**: B-1 through B-15, I-16 through I-30, etc.
- **No Repeats**: Numbers don't repeat once called
- **Game End**: Maximum 75 numbers available (game ends when all called or winning condition met)

### Round Timer System

- **Enabled per difficulty**: Each round has a time limit for pattern completion
- **Time Limits**:
  - Easy: 60 seconds
  - Medium: 45 seconds
  - Hard: 30 seconds
  - Expert: 20 seconds
- **Done Button**: Signal you've finished marking early to immediately advance
- **Early Completion Bonus**: Up to +50 points for finishing within 30% of round time
- **Time Penalty**: Automatic round end if time expires

### Speed Rating System

Completed patterns are rated on both speed and accuracy:

```
Speed Score: 100 = instant, 0 = used full round time
Accuracy Score: 100 = no errors, deducted for manual mode misses
Combined Rating: (Speed Score + Accuracy Score) / 2
```

**Speed bonuses applied to winning pattern score based on combined rating**

### Winning Patterns

- **Five-in-a-Row** (horizontal, vertical, or diagonal with FREE center): 100 points
- **Two Patterns**: Bonus (150 points total)
- **Three Patterns**: Major bonus (300 points total)
- **Full Blackout**: All 25 squares marked (500 points + bonuses)

### Scoring Formula

```
Pattern Score = (Base Score × Speed Bonus) - Accuracy Penalties
Total Score = Σ(Pattern Scores) + Time Bonus
```

### Win Conditions

- **Pattern Complete**: First to complete any valid pattern (line, diagonal, etc.)
- **Blackout**: Mark all 24 non-free cells (25 total with FREE space)
- **Game End**: All patterns completed OR all 75 numbers called
- **Leaderboard**: Speed rating and accuracy combined for ranking

---

## Architecture

### Domain Layer (`src/domain/`)

- **types.ts**: `BingoCard`, `GameState`, `DrawResult`, `WinPattern`
- **constants.ts**: Ball ranges (1-75), standard patterns, card grid (5×5), time limits
- **card.ts**: Card generation, pattern matching, winning detection
- **rules.ts**: Scoring calculations, win validation, pattern detection
- **ai.ts**: AI opponent logic for difficulty variations

### App Layer (`src/app/`)

- **useGame.ts**: Main game state management (card, drawn numbers, winners)
- **useStamping.ts**: Auto/manual stamping mode toggle and stamp validation
- **useTimer.ts**: Round timer management with difficulty scaling
- **useScoring.ts**: Score calculation and ranking logic

### UI Layer (`src/ui/`)

- **Atoms**: BingoCard, BingoNumber, StampingToggle, TimerDisplay, ScoreBoard
- **Molecules**: MultiCardLayout, NumberCalling, PatternIndicator
- **Organisms**: GameBoard, SettingsModal, ResultsTable, MainMenu

---

## Features

✅ **Auto & Manual Stamping**: Choose your playstyle  
✅ **4 Difficulty Tiers**: Easy to Expert  
✅ **Speed-based Scoring**: Rewards fast, accurate play  
✅ **Multi-card Support**: Play 1-4 cards simultaneously  
✅ **Leaderboard**: Track your best games  
✅ **Responsive**: Works on mobile, tablet, and desktop  
✅ **Accessibility**: WCAG 2.1 AA compliant

---

## TODO (Future Features)

- ❌ **Multi-player competitive mode** (online opponents)
- ❌ **Tournament mode** (bracket-based competitions)
- ❌ **Sound effects and animations** (celebration on win)
- ❌ **Custom card generation** (themed cards)
- ❌ **Progressive jackpot** (accumulating prize pool)
  hen naming the app
