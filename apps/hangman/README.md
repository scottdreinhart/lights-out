# Hangman

A word-guessing game where you try to figure out a hidden word by guessing letters. Each wrong guess adds a part to the hangman drawing. Guess the word before the drawing is complete to win.

## 🎮 Quick Start

1. A word or phrase is hidden (shown as blanks: \_ \_ \_ \_ \_)
2. Guess a letter (you have 6 wrong guesses before game over)
3. **Correct Letter**: Reveals all occurrences of that letter in word
4. **Wrong Letter**: Adds part to hangman drawing (lose 1 life)
5. **Win**: Guess all letters before 6 wrong guesses
6. **Lose**: Drawing completed before you guess the word

## 📖 Game Rules

**Objective**: Guess the hidden word before the hangman is complete.

**Game Setup**:

- One word or phrase hidden as blanks
- Hangman starts empty (no body parts drawn)
- 6 wrong guesses allowed (0-6 parts: head, body, left arm, right arm, left leg, right leg)

**Guessing**:

- Guess one letter at a time
- Letter must not have been guessed before
- ALL occurrences of letter revealed when correct
- Spaces and punctuation shown automatically

**Scoring**:

- **Correct Guess**: +10 points (reveals matching letters)
- **Wrong Guess**: -10 points (adds part to hangman)
- **Bonus**: Extra points for guessing word quickly

**Win Condition**: Reveal all letters before 6 wrong guesses  
**Loss Condition**: 6 wrong guesses = hangman complete = game over

**Difficulty**:

- **Easy**: 6-letter words, common words
- **Medium**: 8-letter words, moderate difficulty
- **Hard**: 10+ letter words, technical/obscure terms

## 🎯 How to Play

### Controls

**Desktop (Keyboard + Mouse)**

- **Click letter**: Guess that letter (A-Z buttons)
- **Type letter**: Press key A-Z directly
- **Backspace**: Erase last letter (during word entry, if custom mode)
- **Enter**: Solve the word early (if you think you know it)
- **Escape**: Open menu

**Mobile (Touch)**

- **Tap letter**: Guess letter from on-screen keyboard
- **Default keyboard**: Touch A-Z buttons
- **Long-press letter**: Shows frequency hint (optional)

**TV/Gamepad (D-Pad)**

- **Left/Right**: Navigate letter buttons
- **Up/Down**: Scroll through alphabet
- **OK Button**: Select letter
- **Back Button**: Menu

### Game Flow

1. **Word Hidden**: You see blanks (\_ \_ \_ \_)
2. **You Guess Letter**:
   - Select from A-Z buttons (or type)
   - Letter is marked as guessed
3. **Correct**: Letters revealed, score +10
4. **Wrong**: Hangman body part added, score -10
5. **Continue**: Guess until word revealed or hangman complete
6. **Win**: All letters found = victory screen
7. **Lose**: 6 wrong guesses = hangman complete = loss screen
8. **Next Round**: Play another word

### Scoring

Tracks score and statistics:

- **Current Score**: Points this round (correct -10, wrong -10)
- **Total Score**: Cumulative over session
- **Words Won**: Successful word guesses
- **Words Lost**: Failed word guesses
- **Best Streak**: Longest winning streak
- **Accuracy**: % of correct guesses

## 🏗️ Architecture

This is an **EARLY STAGE** implementation (60%+ complete) with word-guessing mechanics.

### Domain Layer (`src/domain/`)

**Core Concepts**:

- `Word` = string (the hidden word)
- `Guesses` = Set<string> (letters already guessed)
- `CorrectGuesses` = Set<string> (letters that appear in word)
- `GameState` = { word, guesses, correctGuesses, wrongCount, isWon, isLost }

**Key Files**:

- `types.ts` — Type definitions
- `rules.ts` — Win/loss detection, letter validation
- `words.ts` — Word database by difficulty
- `scoring.ts` — Score calculation

**Core Logic**:

```typescript
// Check if letter is in word
function isLetterInWord(word: string, letter: string): boolean

// Reveal all positions of letter in word
function revealLetter(word: string, letter: string): string[]

// Check if word completely revealed
function isWordComplete(word: string, revealed: Set<string>): boolean

// Check if game lost (too many wrong)
function isGameLost(wrongCount: number): boolean
```

### App Layer (`src/app/`)

**Custom Hooks**:

- `useHangmanGame()` — Game state (word, guesses, score)
- `useWordGenerator()` — Difficulty selection, word generation
- `useKeyboardControls()` — Letter input

**Services**:

- `wordService.ts` — Word list management
- `storageService.ts` — Score persistence

### UI Layer (`src/ui/`)

**Organisms**:

- `HangmanGame` — Main game view
- `HangmanDisplay` — Drawing visualization
- `WordDisplay` — Blank word with revealed letters

**Molecules**:

- `LetterButtons` — A-Z keyboard
- `GuessTracker` — Correct/wrong letters in use
- `HangmanDrawing` — Stick figure progression

**Atoms**:

- `Button` — Letter button
- `Text` — Word and score display

## ✅ Development Status

**Completion**: 60% ✅ (Early Stage)  
**Core Game**: Fully playable  
**UI**: Functional, basic design

**What's Done**:

- ✅ Word selection and blanking
- ✅ Letter guessing logic
- ✅ Hangman drawing (6 stages)
- ✅ Win/loss detection
- ✅ Score tracking
- ✅ Difficulty selection
- ✅ Basic UI

**In Progress**:

- ⏳ Improved hangman graphics
- ⏳ Category-specific word lists (animals, movies, etc.)
- ⏳ Hint system
- ⏳ Phrase vs single-word variants

**TODO**:

- ❌ Streak tracking improvements
- ❌ Daily challenge mode
- ❌ Custom word mode (two-player)
- ❌ Better word database with hints

## 🚀 Getting Started

```bash
pnpm install
pnpm --filter @games/hangman dev
pnpm --filter @games/hangman test
```

---

**Last Updated**: April 6, 2026  
**Maturity**: Early Stage (60% complete)  
**Platforms**: Web, Electron, iOS, Android
