# MEMORY PAIRS (Concentration)

**Canonical Source**: Wikipedia - Concentration (card game)  
**Genre**: Memory / Matching  
**Players**: 1-4  
**Turn-Based**: Yes

## Neutral Identity

- **Product Name**: Memory Pairs, Match Master, Card Conc.
- **Symbolism**: Generic card backs, numbers, or abstract symbols
- **Theme**: Neutral colors, accessible icons

## Board Specification

- **Dimensions (Configurable)**:
  - Easy: 4×4 (16 cards, 8 pairs)
  - Medium: 6×6 (36 cards, 18 pairs)
  - Hard: 8×8 (64 cards, 32 pairs)
- **Content**: 2 identical copies of each symbol (32 total images, 16 unique)
- **Initial State**: All cards face-down

## Game Objects

1. **Card (Face-Down)**:
   - Appearance: Generic back pattern
   - Clickable
2. **Card (Face-Up)**:
   - Appearance: Symbol/number revealed
   - Non-interactive (can't click while face-up until turn ends)
3. **Matched Pair**:
   - Cards removed from play or grayed out

## Core Rules

1. **Setup**: Shuffle, deal all cards face-down
2. **Turn Loop**:
   - Player flips 2 cards
   - If match: Removed from play, player scores and goes again
   - If no match: Both cards flip back, turn passes to next player
3. **Scoring**:
   - +1 per matched pair
   - Track per-player
4. **Win Condition**:
   - All pairs matched, highest score wins
5. **Draw Resolution**:
   - Tie in pairs = tie for 1st place

## State Machine

```
[All Face-Down, Shuffled]
    ↓ Player 1 Flips 2 Cards
[1st Card Face-up, 2nd Card Face-up]
    ↓ Check Match
[Match] → [Remove from Play, +1 Score, Same Player Again]
[No Match] → [Flip Both Back, Next Player's Turn]
    ↓ ... continue ...
[All Pairs Matched] → [Tally Scores, Declare Winner]
```

## Input Model

**Keyboard**:

- Arrow keys: Navigate card grid
- Enter / Space: Flip selected card
- N: New game

**Mouse**:

- Click card: Flip it

**Touch**:

- Tap card: Flip it

## UI Layout Contract

**Top HUD**:

- Current player indicator
- Score board (1P: 5, 2P: 3, etc.)
- Move counter (optional)

**Central Board**:

- Full grid visible, responsive sizing
- Cards align to grid

**Bottom Controls**:

- New Game
- Rules
- Player count (if configurable)

## Variants

1. **Solo Mode**: Beat your own best score (time + efficiency)
2. **Timed**: All pairs must be found within 5 minutes
3. **2-4 Player**: Multiplayer score racing
4. **Custom Pairs**: User-uploaded images as pairs

## Test Requirements

1. **Matching Logic**: Verify correct pair detection (same image)
2. **Card Flip**: Verify cards flip and hide appropriately
3. **Scoring**: Verify points awarded correctly
4. **Turn Management**: Verify turn passes correctly on mismatch

## Shared Reuse

- **Card Flip Animation**: Reusable card component
- **Tile Grid**: Generic grid system
- **Scoring Tracker**: Reusable score/stats component

## Legal / Brand Safety

- ✅ **Safe Name**: "Memory Pairs" or "Match Master"
- ✅ **Safe Symbols**: Generic icons, numbers, or abstract patterns
- ✅ **No Copyright Risk**: Game mechanics are public domain
- ❌ **Avoid**: Branded character images without licensing

## Implementation File Structure

```
apps/memory-game/
├── src/
│   ├── domain/
│   │   ├── types.ts          # Card, GameState, Pair
│   │   ├── rules.ts          # flipCard, checkMatch, nextTurn
│   │   ├── deck.ts           # Card generation, shuffling
│   │   └── index.ts          # barrel
│   ├── app/
│   │   ├── useMemoryGame.ts
│   │   ├── useCardFlip.ts
│   │   ├── useScoring.ts
│   │   └── index.ts
│   ├── ui/
│   │   ├── atoms/Card.tsx
│   │   ├── molecules/GameBoard.tsx, ScoreBoard.tsx
│   │   ├── organisms/MemoryGameScreen.tsx
│   │   └── index.ts
│   └── styles/
│       └── GameBoard.module.css
├── tests/
│   ├── deck.unit.test.ts
│   ├── matching.unit.test.ts
│   └── gameplay.e2e.spec.ts
└── docs/
    ├── RULES.md
    └── images.json
```
