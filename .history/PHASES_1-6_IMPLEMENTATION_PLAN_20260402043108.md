# Phases 1-6: Shared Component Systems Implementation Plan

**Scope**: Create 6 shared UI component systems + global game features  
**Timeline**: 12-14 weeks  
**Target**: 29 games consolidated, 7,700+ lines of code eliminated  
**Date**: April 2, 2026

---

## Global Features (Cross-Cutting)

### 1. **Inactivity Timeout System**
**Purpose**: Auto-logout after 5 minutes of inactivity

**Shared Hook**: `@games/app-hook-utils/useInactivityTimeout`

```typescript
interface InactivityConfig {
  timeoutMs: number // default: 300,000 (5 min)
  onTimeout: () => void
  onActivityReset?: () => void
  excludeKeys?: string[] // e.g., ['Escape', 'Tab'] to not reset
}

export function useInactivityTimeout(config: InactivityConfig) {
  // Tracks: mousemove, mousedown, keydown, touchstart, scroll
  // Resets timer on any activity
  // Calls onTimeout when idle
}
```

**Integration Points**:
- Every game App.tsx wraps content with this hook
- Calls `handleQuit()` on timeout
- Shows "Inactive - returning to menu" modal before returning

**Features**:
- ✅ Keyboard events reset timer
- ✅ Mouse events reset timer  
- ✅ Touch events reset timer
- ✅ Grace period (30s warning) before timeout
- ✅ Can be dismissed/dismissed by activity
- ✅ Configurable timeout duration per game

---

### 2. **KotH (King of the Hill) Ranking Screen**
**Purpose**: Leaderboard screen shown on game exit

**Shared Component**: `@games/ui-koth-system/KothRankingScreen`

```typescript
export interface KothEntry {
  rank: number
  username: string
  score: number
  wins: number
  timestamp: number
  difficulty?: string
  gameMode?: string
}

export interface KothRankingScreenProps {
  gameTitle: string
  currentScore: number
  entries: KothEntry[]
  playerRank?: number
  onReturn: () => void
  onPlayAgain?: () => void
  showTop?: number // default: 10
}
```

**Components in System**:
- `KothRankingScreen.tsx` (full screen)
- `KothEntry.tsx` (individual rank row)
- `KothPodium.tsx` (top 3 highlighted)
- `useKothData.ts` (hook to fetch/track rankings)

**Features**:
- ✅ Display top 10 (customizable)  
- ✅ Highlight current player if in top 10
- ✅ Show player's rank even if not in top 10
- ✅ Podium highlighting (1st/2nd/3rd with medals)
- ✅ Difficulty/mode filtering (if applicable)
- ✅ Return to menu button
- ✅ Play again button option
- ✅ Responsive design (mobile to ultrawide)
- ✅ WCAG AA accessibility

**Data Storage**: localStorage for now (future: backend sync)
- Key: `koth-${gameName}-entries`
- Contains: sorted array of KothEntry objects
- Max: 1000 entries per game (auto-trim oldest)

---

### 3. **Global Quit System**
**Purpose**: Consistent exit behavior across all games

**Shared Hook**: `@games/app-hook-utils/useGameExit`

```typescript
interface GameExitConfig {
  gameName: string
  onQuit: () => void // return to menu
  finalScore?: number
  difficulty?: string
  gameMode?: string
}

export function useGameExit(config: GameExitConfig) {
  // Returns: { handleQuit, showKoth }
  // - handleQuit(): void → show KotH, then return
  // - showKoth(score): Promise → show ranking screen
}
```

**Flow**:
```
User clicks Quit
  ↓
Show "Save & Exit?" confirmation
  ↓
Calculate final score
  ↓
Save to localStorage (stats + KotH)
  ↓
Show KotH Ranking Screen
  ↓
User clicks "Return to Menu" or timeout
  ↓
Navigate to game menu
```

---

## Phase 1: ui-card-system (P1)

**Target Games** (10): Blackjack, Go-Fish, War, Bingo, Memory, Dominoes, Snakes & Ladders, +3 future

**Timeline**: Weeks 1-3 (3 weeks)

### Components

```
packages/ui-card-system/
├── src/
│   ├── Card.tsx (individual card, 14 ranks X 4 suits)
│   ├── Card.module.css (card styling, flip animation)
│   ├── Deck.tsx (deck assembly, shuffle handling)
│   ├── Hand.tsx (hand display: fanned/stacked/arranged)
│   ├── CardArea.tsx (polymorphic game area)
│   ├── Discard.tsx (discard pile display)
│   ├── useCardState.ts (game state bridge)
│   ├── cardAdapters.ts (shuffle, deal, reveal helpers)
│   ├── card.animations.css (flip, deal, ace effects)
│   ├── card.a11y.ts (ARIA guidance)
│   ├── types.ts
│   ├── index.ts
│   └── README.md
└── package.json
```

### Implementation Steps

**Week 1**:
1. Create package.json, types.ts, index.ts
2. Implement Card.tsx + Card.module.css (flip animation)
3. Implement cardAdapters.ts (shuffle, deal)
4. Create comprehensive CSS (5 breakpoints, accessibility)

**Week 2**:
1. Implement Deck.tsx (assembly, shuffle)
2. Implement Hand.tsx (layout modes: fan, stack, arranged)
3. Implement CardArea.tsx (polymorphic container)
4. Create reference implementation: Go-Fish
   - Analyze current structure
   - Build domain/types using card abstractions
   - Build useGoFishGame hook
   - Refactor UI to use shared components
   - Test + validate

**Week 3**:
1. Create reference implementation: Blackjack (medium complexity)
   - Deck management
   - Multi-hand support
   - Dealer logic
   - Hit/Stand/Double decisions
2. Consolidate 2-3 additional games
3. Full validation (all 10 games lint + typecheck)

### Validation Criteria
- ✅ All 10 games lint passing
- ✅ All 10 games typecheck passing
- ✅ 60%+ code reduction in card UI
- ✅ 2,000+ lines consolidated
- ✅ Responsive: 5 breakpoints
- ✅ Accessibility: WCAG AA
- ✅ Touch-optimized (>=44px cards)

---

## Phase 2: ui-tile-system (P2)

**Target Games** (4): Memory-Game, Dominoes, Battleship, +1 future

**Timeline**: Weeks 4-5 (2 weeks)

### Components

```
packages/ui-tile-system/
├── src/
│   ├── Tile.tsx (individual tile, face/back states)
│   ├── Tile.module.css (tile styling, reveal animation)
│   ├── TileGrid.tsx (grid of tiles, coordinate tracking)
│   ├── useTileState.ts (reveal/locked state mgmt)
│   ├── useRevealAnimation.ts (stagger + timing)
│   ├── tileAdapters.ts (reveal, lock, reset helpers)
│   ├── tile.animations.css (flip, scale effects)
│   ├── tile.a11y.ts (ARIA guidance)
│   ├── types.ts
│   ├── index.ts
│   └── README.md
└── package.json
```

### Key Patterns
- **Reveal State**: faceDown → faceUp → locked
- **Coordinates**: (row, col) with optional custom ID
- **Animation**: Individual tile flip + optional stagger
- **Accessibility**: Keyboard nav (arrows), announce state changes

### Implementation Steps

**Week 4**:
1. Create package structure
2. Implement Tile.tsx + animations
3. Implement TileGrid.tsx with coordinate tracking
4. Create reference: Memory-Game
   - Flip mechanics
   - Pair matching logic
   - Victory condition

**Week 5**:
1. Create reference: Dominoes (more complex)
   - Tile placement rules
   - End-of-turn validation
2. Consolidate Battleship, other games
3. Full validation

---

## Phase 3: ui-choice-system (P3)

**Target Games** (3): Rock-Paper-Scissors, Simon-Says, Tango

**Timeline**: Week 6 (1 week)

### Components

```
packages/ui-choice-system/
├── src/
│   ├── ChoiceButton.tsx (button with states)
│   ├── ChoiceArea.tsx (container for choices)
│   ├── useChoiceState.ts (selection + feedback)
│   ├── choice.animations.css (pulse, highlight, press)
│   ├── types.ts
│   ├── index.ts
│   └── README.md
└── package.json
```

### Patterns
- Simple 2-4 button selection
- Visual feedback (highlight, pulse)
- Optional haptic feedback
- Keyboard support (1-4 keys)

---

## Phase 4: ui-pile-system (P4)

**Target Games** (5): Nim, Mancala, Shut-the-Box, Pig, Kalaha

**Timeline**: Weeks 7-8 (2 weeks)

### Components

```
packages/ui-pile-system/
├── src/
│   ├── Pile.tsx (visual pile representation)
│   ├── PileArea.tsx (multi-pile container)
│   ├── useCounterState.ts (increment/decrement with validation)
│   ├── Counter.tsx (numeric display, +/- buttons)
│   ├── pile.animations.css (add, remove, distribute)
│   ├── types.ts
│   ├── index.ts
│   └── README.md
└── package.json
```

### Patterns
- Visual piles (dots, tokens, seeds)
- Counter mechanics (increment/decrement)
- Removal validation
- Distribution animation (Mancala)

---

## Phase 5: ui-letter-system (P5)

**Target Games** (3): Hangman, Crossclimb, Wordle

**Timeline**: Week 9 (1.5 weeks)

### Components

```
packages/ui-letter-system/
├── src/
│   ├── Letter.tsx (single letter, revealed/hidden)
│   ├── WordDisplay.tsx (word with revealed letters)
│   ├── GuessArea.tsx (keyboard or button grid)
│   ├── useLetterState.ts (guess tracking)
│   ├── letter.animations.css (reveal, shake)
│   ├── types.ts
│   ├── index.ts
│   └── README.md
└── package.json
```

### Patterns  
- Letter reveal on match
- Guess history tracking
- Word validation
- Keyboard input handling

---

## Phase 6: ui-counter-system (P6)

**Target Games** (4): Scoring, Lives, Rounds, Streaks

**Timeline**: Week 9.5 (1 week)

### Components

```
packages/ui-counter-system/
├── src/
│   ├── Counter.tsx (animated number display)
│   ├── CounterBadge.tsx (small counter badge)
│   ├── ScoreBoard.tsx (multi-counter display)
│   ├── useCounterAnimation.ts (pop, count-up effects)
│   ├── counter.animations.css (pop, flip, spin)
│   ├── types.ts
│   ├── index.ts
│   └── README.md
└── package.json
```

### Patterns
- Animated count-up (0 → final score)
- Pop animation on increment
- Responsive sizing (mobile to ultrawide)
- Multiple counters (score, lives, rounds, streak)

---

## Phase 7: Global Features Integration (P7)

**Duration**: Weeks 10-12 (3 weeks)

### 7A: Create Shared Systems

**1. useInactivityTimeout Hook** (Week 10)
```
packages/app-hook-utils/src/
├── useInactivityTimeout.ts
├── InactivityWarning.tsx (modal component)
├── InactivityWarning.module.css
├── types.ts
└── index.ts
```

**2. KotH Ranking System** (Week 10-11)
```
packages/ui-koth-system/
├── src/
│   ├── KothRankingScreen.tsx
│   ├── KothEntry.tsx
│   ├── KothPodium.tsx
│   ├── useKothData.ts (localStorage + sync)
│   ├── koth.module.css
│   ├── types.ts
│   ├── index.ts
│   └── README.md
└── package.json
```

**3. Game Exit Hook** (Week 11)
```
packages/app-hook-utils/src/
├── useGameExit.ts
├── ExitConfirmation.tsx
├── types.ts
└── index.ts
```

### 7B: Integrate into All Games

**Week 11-12**: Standardize all 38 games to use:
1. useInactivityTimeout (5-min with 30s warning)
2. KotH Ranking Screen on exit
3. useGameExit with quit confirmation
4. Updated App.tsx shell

**Pattern** (each game):
```typescript
// apps/[game]/src/ui/organisms/App.tsx
export function App() {
  const { handleQuit } = useGameExit({
    gameName: '[game-name]',
    onQuit: () => navigate('/'),
    finalScore: gameScore
  })

  const { showInactivityWarning } = useInactivityTimeout({
    timeoutMs: 300000,
    onTimeout: handleQuit,
    excludeKeys: ['Escape']
  })

  return (
    <GameShell
      title="[Game Name]"
      onQuit={handleQuit}
      inactivityWarning={showInactivityWarning}
    >
      <GameBoard />
    </GameShell>
  )
}
```

---

## Implementation Schedule

| Week | Phase | System | Tasks | Output |
|---|---|---|---|---|
| 1 | P1.1 | ui-card | Package structure, Card, animations, adapters | 300 LOC |
| 2 | P1.2 | ui-card | Deck, Hand, CardArea, Go-Fish ref impl | 800 LOC |
| 3 | P1.3 | ui-card | Blackjack ref, consolidate 10 games, validate | 600 LOC |
| 4 | P2.1 | ui-tile | Package structure, Tile, TileGrid, Memory ref | 400 LOC |
| 5 | P2.2 | ui-tile | Dominoes ref, consolidate 4 games, validate | 300 LOC |
| 6 | P3 | ui-choice | Package + RPS ref + consolidation | 250 LOC |
| 7 | P4.1 | ui-pile | Package structure, Pile, Nim ref | 350 LOC |
| 8 | P4.2 | ui-pile | Mancala ref, consolidate 5 games, validate | 400 LOC |
| 9 | P5 | ui-letter | Package + Hangman ref + consolidation | 280 LOC |
| 9.5 | P6 | ui-counter | Package + consolidation | 250 LOC |
| 10 | P7.1 | Global | useInactivityTimeout + KotH package | 600 LOC |
| 11 | P7.2 | Global | useGameExit, KotH integration tests | 400 LOC |
| 12 | P7.3 | Integration | Integrate all 38 games with global features | 1,000 LOC |

**Total New Code**: ~6,600 LOC  
**Total Consolidated**: ~7,700 LOC removed/refactored  
**Net**: ~1,100 LOC reduction (6,600 new systems vs 7,700 eliminated duplication)

---

## Validation & Testing Strategy

### Per-System Validation
Each system passes before moving to next:
- ✅ All components lint passing
- ✅ All TypeScript types correct
- ✅ All reference implementations validate
- ✅ Responsive design tested (5 breakpoints)
- ✅ Accessibility tested (WCAG AA)

### Per-Game Integration
Each game validates after consolidation:
1. `pnpm --filter @games/[game] lint` → ✅
2. `pnpm --filter @games/[game] typecheck` → ✅
3. Manual gameplay test (5 min)
4. Timeout test (verify 5-min inactivity)
5. KotH screen test (verify ranking display)
6. Quit flow test (confirm save + display)

### Global Validation
Final gate (Week 13):
- `pnpm validate` across all 38 games → ✅
- KotH data persistence test (localStorage)
- Timeout timer accuracy test
- Accessibility audit (all games)
- Performance profile (bundle size impact)

---

## Success Metrics

### Code Quality
- ✅ 7,700+ lines of duplication eliminated
- ✅ 100% lint compliance (all 38 games)
- ✅ 100% typecheck compliance (all 38 games)
- ✅ Zero new technical debt introduced
- ✅ Responsive design: all 5 breakpoints working

### Developer Velocity
- ✅ New card game can be built in 2-3 days (current: 5+ days)
- ✅ New tile game can be built in 1-2 days
- ✅ New dice game can be built in 1-2 days (already proven)

### User Experience
- ✅ Consistent UI/UX across all games
- ✅ No inactive players clogging rankings
- ✅ Clear exit flows (save + ranking display)
- ✅ Accessibility on parity with best practices
- ✅ Touch-optimized (all platforms)

### Platform Coverage
- ✅ All 38 games working on: Web, Electron, Capacitor/iOS, Capacitor/Android
- ✅ All games accessible via keyboard
- ✅ All games responsive (mobile to ultrawide)

---

## Risk Mitigation

| Risk | Mitigation |
|---|---|
| **Refactoring breaks existing games** | Branch per game, validate before merge |
| **Timeout too aggressive** | Configurable per game, grace period + warning |
| **KotH localStorage bloats** | Auto-trim to 1000 entries per game |
| **Inactivity detection too sensitive** | Exclude specific keys (Escape, Tab), configurable |
| **Schedule slips** | Prioritize reference implementations first, delay consolidation if needed |

---

## Next Steps

### Immediate (This Week)
1. ✅ Approve this plan
2. Create P1 ui-card-system package structure
3. Analyze Go-Fish & Blackjack current code
4. Begin Week 1 implementation

### Before Week 2
1. Have P1 foundation components working (Card, Deck, Hand)
2. Have reference implementations drafted
3. Begin consolidation prep

### Before Global Features (Week 10)
1. All P1-P6 systems production-ready
2. All target games validated
3. Ready for cross-cutting features

---

## Questions Before Proceeding

1. **KotH Name Clarification**: Is "KotH" shorthand for "King of the Hill" leaderboard, or a specific format?
2. **Timeout Customization**: Should timeout duration be per-game or global 5-min for all?
3. **KotH Data**: Should rankings be per difficulty/mode, or global across all game modes?
4. **Grace Period**: Is 30s warning before timeout appropriate, or different timing?
5. **Priority Order**: Are P1-P6 in correct priority, or should we adjust?

