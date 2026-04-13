# Bingo (30-Ball - Italian Tombola)

## Quick Start

Fast-paced 30-ball Bingo uses a compact 3×3 grid with numbers 1-30. Perfect for quick-play rounds! Mark your card to complete a line or fill the entire card for a full house.

**Controls**: 
- **Auto Stamping**: Numbers are marked automatically as called
- **Manual Stamping**: Click/tap to mark numbers (risk missing stamps = losing)
- **Done Button**: Signal pattern completion to end round early
- **Difficulty**: Easy (1 card) → Expert (2+ cards)

---

## Game Rules

### Card System

- **Grid Layout**: 3×3 grid (9 squares total)
- **Number Range**: 1-30 (Italian Tombola system)
- **No Blanks**: All 9 squares contain numbers
- **Card Count**: 1 or 2 cards per game (selectable)

### Stamping Modes

#### Auto Stamping
- Numbers are automatically marked as they are called
- Focus on pattern tracking only
- Best for fast-paced gameplay

#### Manual Stamping
- You must manually click/tap each called number on your card
- **Risk**: Miss a stamp and you lose that number permanently
- **Strategy**: Requires sustained focus as game accelerates
- **Penalty**: 5 points deducted per missed stamp

### Calling System

- **Number Range**: 1-30 (randomly called, no repeats)
- **Calling Frequency**: Every 2-3 seconds (varies by difficulty)
- **Game Pace**: Fast and dynamic
- **No Repeats**: Once called, a number is never called again

### Round Timer System

- **Completion Time**: Games typically last 2-5 minutes
- **Time Per Difficulty**:
  - Easy: Flexible timing
  - Medium: 150 seconds
  - Hard: 90 seconds
  - Expert: 60 seconds
- **Done Button**: Finish early after completing a line or full house
- **Immediate Advance**: Speeds progression through rounds

### Winning Patterns

1. **Single Line** (horizontal, vertical, or diagonal):
   - 3 numbers in any row, column, or diagonal = WIN
   - Horizontal top, middle, bottom = 3 patterns
   - Vertical left, center, right = 3 patterns
   - Diagonal corners = 2 patterns
   - **Total**: 8 possible line patterns

2. **Two Lines**: Two complete lines on same card = Major win

3. **Full House**: All 9 squares marked = Grand prize

### Scoring Formula

```
Line Score = Base Score (100 points) × Speed Multiplier
Two Lines = 250 points + Speed Bonus
Full House = 500 points + Speed Bonus + Time Bonus
```

### Speed Rating System

```
Speed Score: 100 = under 2 minutes, 0 = 5+ minutes
Accuracy Score: 100 = no missed stamps, deducted for errors
Combined Rating: (Speed + Accuracy) / 2
```

### Win Conditions

- **Game End**: When player completes line, two lines, or full house
- **Multi-round**: Continue playing successive games
- **Session Best**: Track fastest full house completion
- **Leaderboard**: Speed and accuracy weighted together

---

## Architecture

### Domain Layer (`src/domain/`)

- **types.ts**: `MiniCard`, `GameState`, `LineWin`, `FullHouse`
- **constants.ts**: `MAX_NUMBER=30`, grid size (3×3), time limits
- **card.ts**: 3×3 card generation, line detection
- **rules.ts**: Line validation, two-line detection, full house logic
- **ai.ts**: AI difficulty scaling for 2+ card play

### App Layer (`src/app/`)

- **useGame.ts**: Game state (cards, called numbers, winners)
- **useStamping.ts**: Manual/auto stamping toggle and validation
- **useTimer.ts**: Fast-paced timer management
- **useScoring.ts**: Quick scoring with speed bonuses

### UI Layer (`src/ui/`)

- **Atoms**: MiniCard (3×3), SmallNumber, TimerDisplay, QuickScore
- **Molecules**: CompactCardLayout, FastNumberCalling
- **Organisms**: FastGameBoard, QuickResultsModal, SpeedLeaderboard

---

## Features

✅ **Ultra-Fast Rounds**: 2-5 minute games  
✅ **Auto & Manual Stamping**: Pick your style  
✅ **3 Win Conditions**: Line → Two Lines → Full House  
✅ **Speed-based Ranking**: Race to the fastest time  
✅ **Multi-device Support**: Responsive design  
✅ **Accessibility**: WCAG 2.1 AA compliant  

---

## TODO (Future Features)

- ❌ **Auto-marking visual feedback** (flash effect on marked numbers)
- ❌ **Multi-round tournaments** (bracket-style competitions)
- ❌ **House rules library** (custom variations)
- ❌ **Custom card styling** (themed aesthetics)
- ❌ **Speed records tracking** (personal best history)
