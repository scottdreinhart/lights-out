# Bingo (80-Ball - British)

## Quick Start

British 80-ball Bingo brings fast-paced action with a compact 4×4 grid and color-coded columns. Win by completing lines, multiple patterns, or the full house!

**Controls**: 
- **Auto Stamping**: Numbers are marked automatically as called
- **Manual Stamping**: Click/tap to mark numbers (risk missing stamps = losing)
- **Done Button**: Signal pattern completion to advance
- **Difficulty**: Easy (1 card) → Expert (2+ cards)

---

## Game Rules

### Card System

- **Grid Layout**: 4×4 grid (16 numbers, no blanks)
- **Color-Coded Columns**:
  - Column 1 (Red): Numbers 1-20
  - Column 2 (Yellow): Numbers 21-40
  - Column 3 (Blue): Numbers 41-60
  - Column 4 (White/Silver): Numbers 61-80
- **Number Calling**: Announced as "Red 7" or "White 63" (color + number)
- **Card Count**: 1 or 2 cards per game

### Stamping Modes

#### Auto Stamping
- Numbers automatically marked as they are called
- Focus on pattern visualization
- Best for learning the game

#### Manual Stamping
- You must manually mark each called number
- **Risk**: Missed stamps mean incomplete patterns
- **Speed**: Requires faster reactions than 90-ball
- **Penalty**: 5 points per missed stamp, 10 per incorrect stamp

### Calling System

- **Number Range**: 1-80 (fully called)
- **Color Coding**: Numbers announced with color prefix (helps distinguish similar numbers: "Red 17" vs "White 70")
- **Calling Speed**: ~1.5 seconds per number (faster than 90-ball)
- **No Repeats**: Each number called once

### Round Timer System

- **Dynamic Timing**: Speeds up with game difficulty
- **Time Limits**:
  - Easy: 120 seconds
  - Medium: 90 seconds
  - Hard: 60 seconds
  - Expert: 45 seconds
- **Done Button**: Finish early after completing pattern
- **Time Bonus**: Points for fast completion

### Winning Patterns (Multiple Options)

#### Primary Patterns
1. **Single Line** (any direction):
   - Horizontal line: 4 numbers across
   - Vertical line: 4 numbers down
   - Diagonal line: 4 numbers corner-to-corner
   - **Points**: 100

2. **Two Lines**:
   - Any two horizontal, vertical, or diagonal lines
   - Mixed directions allowed
   - **Points**: 250

3. **Three Lines**:
   - Any combination of three lines
   - **Points**: 500

4. **Four Corners**:
   - Top-left, top-right, bottom-left, bottom-right
   - **Points**: 150

5. **Square** (Center 4):
   - The 4 center numbers (positions [1,1], [1,2], [2,1], [2,2] of the grid)
   - **Points**: 200

6. **Full House**:
   - All 16 numbers marked
   - **Points**: 1000

### Scoring Formula

```
Pattern Score = Base Score × Experience Multiplier
Full House = Base Score (1000) + Speed Bonus + Accuracy Bonus
Total = Σ All Pattern Scores
```

### Speed Rating System

```
Speed Score: 100 = complete within 50% of time limit
Accuracy Score: 100 = no missed stamps
Combined: (Speed + Accuracy) / 2
```

### Win Conditions

- **Progressive**: Win a line → advance to two lines → advance to full house
- **Multiple Patterns**: Complete multiple patterns in succession
- **Full House**: Ultimate win condition
- **Session Best**: Track fastest full house time
- **Leaderboard**: Speed and accuracy ranking

---

## Architecture

### Domain Layer (`src/domain/`)

- **types.ts**: `BritishCard` (4×4), `GameState`, `ColoredNumber`
- **constants.ts**: `MAX_NUMBER=80`, column ranges (1-20, 21-40, etc.), 6 patterns, time limits
- **card.ts**: 4×4 card generation, column coloring
- **patterns.ts**: Line detection (all 4 directions), corners, center square, full house logic
- **rules.ts**: Pattern validation, multi-pattern detection, scoring

### App Layer (`src/app/`)

- **useGame.ts**: Game state with cards, called numbers, pattern tracking
- **useStamping.ts**: Manual/auto stamping with color assist
- **useTimer.ts**: Difficulty-based timer
- **usePatternDetection.ts**: Multi-pattern tracking and completion detection

### UI Layer (`src/ui/`)

- **Atoms**: ColoredBingoNumber (with color codes), PatternHighlight, TimerDisplay
- **Molecules**: ColorCodedCardLayout, PatternProgressBar
- **Organisms**: BritishGameBoard, PatternTracker, ProgressionDisplay

---

## Features

✅ **Color-Coded Numbers**: Easy to identify similar numbers  
✅ **6 Winning Patterns**: More ways to win than 90-ball  
✅ **Faster Pace**: Compact 4×4 grid keeps action quick  
✅ **Progressive Win Conditions**: Line → Two Lines → Full House  
✅ **Multi-pattern Support**: Win multiple patterns in succession  
✅ **Responsive Design**: Mobile, tablet, and desktop optimized  
✅ **Accessibility**: WCAG 2.1 AA with color-blind modes  

---

## TODO (Future Features)

- ❌ **Line highlighting feature** (visual pattern detection aid)
- ❌ **British notation support** (alternative calling conventions)
- ❌ **Tournament bracket mode** (competitive play)
- ❌ **Windfall mechanics** (bonus number multipliers)
- ❌ **Statistics dashboard** (pattern frequency tracking)
