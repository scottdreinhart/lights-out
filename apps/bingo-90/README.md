# Bingo (90-Ball - European/UK)

## Quick Start

European 90-ball Bingo is the classic experience! 3 rows × 9 columns with 5 numbers per row. Three chances to win in every round: one line, two lines, or full house!

**Controls**: 
- **Auto Stamping**: Numbers are marked automatically as called
- **Manual Stamping**: Click/tap to mark numbers (risk missing stamps = losing)
- **Done Button**: Signal pattern completion to advance
- **Difficulty**: Easy (1 card) → Expert (3+ cards)

---

## Game Rules

### Card System

- **Ticket Layout**: 3 rows × 9 columns (27 spaces)
- **Numbers per Row**: 5 numbers + 4 blanks
- **Number Ranges** (by column):
  - Column 1: 1-9 or 1-10
  - Column 2: 10-19 or 11-20
  - Column 3: 20-29 or 21-30
  - Column 4: 30-39 or 31-40
  - Column 5: 40-49 or 41-50
  - Column 6: 50-59 or 51-60
  - Column 7: 60-69 or 61-70
  - Column 8: 70-79 or 71-80
  - Column 9: 80-90
- **Number Range Total**: 1-90 (European system)
- **Card Count**: 1, 2, or 3 cards per game

### Stamping Modes

#### Auto Stamping
- Numbers automatically marked as they are called
- Focus on round progression
- Best for casual play

#### Manual Stamping
- Manually mark each called number
- **Risk**: Missed stamps = incomplete patterns
- **Strategy**: Manage multiple rounds simultaneously
- **Penalty**: 5 points per missed stamp

### Calling System

- **Number Range**: 1-90 (no repeats)
- **Traditional Calls**: Numbers may have traditional UK bingo names/calls (optional in modern play)
- **Three Separate Rounds**: One ticket can have winning rounds at different stages
- **No Repeats**: Each number called once per game

### Three-Round Win Conditions

#### Round 1: One Line
- **Goal**: Complete any single horizontal line (5 numbers across)
- **Timing**: Usually completed 30-50% through the 90 numbers
- **Prize**: Prize pool percentage goes to winner
- **Points**: 100 + speed bonus

#### Round 2: Two Lines
- **Goal**: Complete any two horizontal lines on same ticket
- **Timing**: Usually completed 50-75% through numbers
- **Prize**: Prize pool percentage
- **Points**: 250 + speed bonus

#### Round 3: Full House
- **Goal**: Mark all 15 numbers on the ticket (ignoring blanks)
- **Timing**: Usually completed 75-95%+ through numbers
- **Prize**: Largest prize (jackpot)
- **Points**: 500 + grand bonus

### Scoring Formula

```
One Line Score = 100 × Speed Multiplier
Two Lines Score = 250 × Speed Multiplier
Full House Score = 500 + Jackpot Bonus + Speed Bonus
Total Session = Σ(All Three-Round Scores)
```

### Speed Rating System

```
Speed Score: 100 = record fast completion, 0 = slow completion
Accuracy Score: 100 = no missed stamps
Combined: (Speed + Accuracy) / 2
```

### Win Conditions & Flow

1. **One Line Wins**: Player shouts "LINE!" when horizontal line complete
2. **Two Lines Wins**: Continue game, player shouts "TWO LINES!" or "FULL HOUSE!"
3. **Full House Wins**: Ultimate win, all 15 numbers marked
4. **Three Separate Opportunities**: Players can win at each stage
5. **Multiple Winners**: If multiple players complete same stage, prize splits

---

## Architecture

### Domain Layer (`src/domain/`)

- **types.ts**: `EuropeanCard` (3×9), `ThreeRoundState`, `LineWin`, `FullHouseWin`
- **constants.ts**: `MAX_NUMBER=90`, column ranges (1-9, 10-19, etc.), 3 win stages, time estimates
- **card.ts**: 3×9 card generation, blank space handling
- **rules.ts**: Line detection (horizontal only), two-line detection, full house logic
- **patterns.ts**: Three-stage pattern validation

### App Layer (`src/app/`)

- **useGame.ts**: Game state with 3-round tracking, multi-card support
- **useThreeRounds.ts**: Manage one line, two lines, full house states independently
- **useStamping.ts**: Manual/auto stamping with blank space sensitivity
- **useTimer.ts**: Estimate time to each win condition
- **useScoring.ts**: Three-stage scoring system

### UI Layer (`src/ui/`)

- **Atoms**: EuropeanCard (3×9), BlankCellDisplay, RoundIndicator
- **Molecules**: ThreeRoundProgressBar, LineTracker, FullHouseCountdown
- **Organisms**: ThreeRoundGameBoard, RoundResultsDisplay, ProgressionModal

---

## Features

✅ **Three Win Conditions**: One Line → Two Lines → Full House  
✅ **Traditional Gameplay**: Classic 3×9 card layout  
✅ **Multiple Cards**: Play 1-3 cards simultaneously  
✅ **Blank Space Handling**: Intelligent pattern recognition ignoring blanks  
✅ **Round-Based Progression**: Three distinct win opportunities per game  
✅ **Responsive Design**: Optimized for mobile, tablet, desktop  
✅ **Accessibility**: WCAG 2.1 AA compliant with colorblind modes  

---

## TODO (Future Features)

- ❌ **Traditional bingo calls** (UK/European lingo support)
- ❌ **Four corners pattern** (alternative win condition)
- ❌ **Linked games** (multi-venue play)
- ❌ **House rules library** (regional variation rules)
- ❌ **Progression tracker** (three-round statistics)
