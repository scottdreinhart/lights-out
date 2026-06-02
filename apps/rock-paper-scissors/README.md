# Rock Paper Scissors

The classic hand game where you throw rock, paper, or scissors against the computer (or other players). Rock crushes scissors, scissors cuts paper, paper covers rock. Best of 3 wins.

## 🎮 Quick Start

1. **Choose**: Rock, Paper, or Scissors
2. **AI Plays**: Computer chooses at the same time
3. **Compare**:
   - **Rock** beats **Scissors**
   - **Scissors** beats **Paper**
   - **Paper** beats **Rock**
   - **Tie**: Same choice
4. **Score**: Win, lose, or tie
5. **Play Again**: Continue for Best of 3, 5, 7, or tournament

## 📖 Game Rules

**Objective**: Win more rounds than opponent (best of 3, 5, 7, or first to N wins).

**Choices**: Rock, Paper, or Scissors (chosen simultaneously)

**Win Conditions**:
- **Rock** beats **Scissors** (rock crushes scissors)
- **Scissors** beats **Paper** (scissors cuts paper)
- **Paper** beats **Rock** (paper covers rock)

**Tie**: Same choice (no points awarded, continue)

**Match Format**:
- **Best of 3**: First to 2 wins
- **Best of 5**: First to 3 wins
- **Best of 7**: First to 4 wins
- **Tournament**: Play multiple matches, track overall record

**Strategy Notes**:
- Completely random in pure form (50/50 win vs loss vs tie)
- AI may use patterns or behavioral adaptation
- Player psychology: Some repeat same choice, some cycle through

## 🎯 How to Play

### Controls

**Desktop (Keyboard + Mouse)**
- **Click button**: Rock (R key), Paper (P key), Scissors (S key)
- **Number keys**: 1=Rock, 2=Paper, 3=Scissors
- **Enter**: Confirm choice
- **Escape**: Back to menu

**Mobile (Touch)**
- **Tap icon**: Rock, Paper, or Scissors
- **Large touch targets** (3 buttons)
- **Immediate feedback** with animations
- **Swipe**: Options menu

**TV/Gamepad (D-Pad)**
- **D-Pad Left/Right**: Cycle through Rock, Paper, Scissors
- **OK Button**: Select and throw
- **Back Button**: Menu

### Game Flow

1. **Round Start**: You see three choices (Rock, Paper, Scissors)
2. **Your Choice**: Click/tap your throw
   - Button highlights to show your selection
3. **AI Chooses**: Computer decides simultaneously
4. **Reveal**: Shows both choices with win/loss result
   - Your throw on left (green if win, red if loss, gray if tie)
   - AI throw on right
   - Result text: "You Win!", "You Lose!", "Tie!"
5. **Score Update**: Your score vs AI score
6. **Continue**: Next round begins
7. **Match End**: When someone reaches target (2/3/4 wins)
   - Final score shown with celebration or encouragement
   - Option to rematch or return to menu

### Scoring

- **Wins**: How many rounds you've won
- **Losses**: How many rounds you've lost
- **Ties**: How many tied rounds
- **Win Rate**: % of rounds won (excluding ties)
- **Current Streak**: Wins/losses in a row
- **Best Streak**: Best win streak ever
- **Match Record**: Best of 3/5/7 results

## 🏗️ Architecture

This is a **DEVELOPING** implementation (72% complete) focused on AI strategy and match states.

### Domain Layer (`src/domain/`)

**Core Concepts**:
- `Choice` = 'rock' | 'paper' | 'scissors'
- `Outcome` = 'win' | 'lose' | 'tie'
- `Match` = { format: 'best3'|'best5'|'best7'|'tournament', rounds: Round[] }
- `Round` = { player: Choice, ai: Choice, outcome: Outcome }

**Key Files**:
- `types.ts` — Choice, Outcome, Match, Round types
- `rules.ts` — Win/loss/tie determination
- `ai.ts` — AI strategy (random, pattern detection, adaptation)
- `constants.ts` — Match formats

**Core Logic**:
```typescript
// Determine round winner
function determineWinner(playerChoice: Choice, aiChoice: Choice): Outcome

// AI decision making
function getAIChoice(difficulty: 'easy'|'medium'|'hard', history: Round[]): Choice

// Check match end condition
function isMatchOver(match: Match): boolean
```

### App Layer (`src/app/`)

**Custom Hooks**:
- `useRockPaperScissors()` — Match state, round management
- `useAI()` — AI opponent with difficulty levels
- `useKeyboardControls()` — Choice input

**Services**:
- `matchService.ts` — Match history, statistics
- `storageService.ts` — Save/load games

### UI Layer (`src/ui/`)

**Organisms**:
- `RPSGame` — Main game display
- `ChoiceButtons` — Rock, Paper, Scissors buttons
- `ResultDisplay` — Both choices revealed with outcome
- `ScoreBoard` — Match score and stats

**Molecules**:
- `ChoiceButton` — Single choice (rock/paper/scissors) with animation
- `RevealAnimation` — Slide-in both choices

**Atoms**:
- `Button` — Interactive button
- `ScoreText` — Score display
- `ResultBadge` — Win/loss/tie indicator

## ✅ Development Status

**Completion**: 72% ✅ (Developing)  
**Core Gameplay**: Fully implemented  
**AI**: Basic to intermediate strategy  

**What's Done**:
- ✅ Win/loss/tie logic
- ✅ Multiple match formats (best of 3/5/7)
- ✅ AI with difficulty selection
- ✅ Score tracking and statistics
- ✅ Smooth animations
- ✅ Keyboard and touch controls
- ✅ Game history

**In Progress**:
- ⏳ Advanced AI adaptation (learns from patterns)
- ⏳ Tournament mode (multiple matches)

**TODO**:
- ❌ Multiplayer (local, pass-and-play)
- ❌ Online multiplayer
- ❌ Difficulty level persistence

## 🚀 Getting Started

```bash
pnpm install
pnpm --filter @games/rock-paper-scissors dev
pnpm --filter @games/rock-paper-scissors test
```

---

**Last Updated**: April 6, 2026  
**Maturity**: Developing (72% complete)  
**Platforms**: Web, Electron, iOS, Android
