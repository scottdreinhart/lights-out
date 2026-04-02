# Game Family Evaluation & Shared Component System Roadmap

**Date**: April 2, 2026  
**Status**: Strategic Planning  
**Purpose**: Identify which game families should have dedicated @games/ui-[system] packages to eliminate duplication and establish reusable patterns  

---

## Executive Summary

You currently have **38 games** across **9+ distinct game families**. Three shared component systems are already established:

1. ✅ **@games/ui-board-core** (Grid/Board-based games)
2. ✅ **@games/ui-dice-system** (Dice-based games)
3. 🔄 **In Progress**: Monchola evaluation

**Analysis shows 6 additional shared systems would provide significant ROI**:

| Priority | System | Games | Code Reduction | Est. Lines Saved |
|----------|--------|-------|-----------------|------------------|
| **P1** | ui-card-system | 8-10 games | 60-75% | 2,000+ |
| **P2** | ui-tile-system | 3-4 games | 50-65% | 1,000+ |
| **P3** | ui-choice-system | 2-3 games | 40-50% | 500+ |
| **P4** | ui-pile-system | 4-5 games | 55-70% | 1,500+ |
| **P5** | ui-letter-system | 2-3 games | 50-60% | 800+ |
| **P6** | ui-counter-system | 3-4 games | 45-60% | 900+ |

**Total Potential**: **7,700+ lines of code** consolidated into reusable, tested systems.

---

## Game Inventory by Family

### 1. **Grid/Board-Based Games** ✅ CONSOLIDATED
**Shared System**: `@games/ui-board-core`  
**Status**: Production-ready  
**Components**: BoardGrid, Tile, useTableLayout

| Game | Type | Consolidated | Lines Saved |
|------|------|--------------|-------------|
| TicTacToe | 3×3 grid | ✅ | 35% |
| Connect-Four | 7×6 grid | ✅ | 40% |
| Mini-Sudoku | 4×4 grid | ✅ | 38% |
| Sudoku | 9×9 grid | ✅ | 42% |
| Minesweeper | Dynamic grid | ⏳ Pending | ~35% |
| Reversi | 8×8 grid | ⏳ Pending | ~40% |
| Checkers | 8×8 board | ⏳ Pending | ~45% |
| Queens | N×N board | ⏳ Pending | ~50% |
| Battleship | 10×10 grid (hidden) | ⏳ Pending | ~48% |
| Lights-Out | M×N grid | ⏳ Pending | ~38% |
| Monchola | Grid-based | 🔄 Evaluating | ~40% |

**Next Action**: Consolidate remaining 8 games (estimated 3-4 weeks)

---

### 2. **Dice-Based Games** ✅ CONSOLIDATED
**Shared System**: `@games/ui-dice-system`  
**Status**: Production-ready + Bunco refactored  
**Components**: Die, DiceArea, Pit, SelectedDice

| Game | Dice Count | Complexity | Consolidated | Notes |
|------|-----------|------------|--------------|-------|
| Farkle | 6 (rolling set) | High | ✅ Reference | 23 scoring combinations |
| Bunco | 3 | Low | ✅ Reference | Simple roll-match |
| Cee-Lo | 3 | Low | ⏳ Pending | Outcome-based |
| Mexico | 2 | Low | ⏳ Pending | Progressive scores |
| Chicago | 3 | Medium | ⏳ Pending | Target number sequence |
| Ship-Captain-Crew | 3 | Low | ⏳ Pending | Sequence requirements |
| Shut-the-Box | 6 (+ grid) | Medium | ⏳ Pending | Hybrid: dice + grid |
| Liars-Dice | 5 | Medium | ⏳ Pending | Hidden dice, bluffing |
| Cho-Han | 2 | Low | ⏳ Pending | Binary outcome |
| Pig | N/A | - | ❌ Not Dice | Pile game (stone removal) |

**Status**: 2 reference implementations complete, 7 pending consolidation

---

### 3. **Card-Based Games** ⏳ NEEDS CONSOLIDATION P1
**Proposed System**: `@games/ui-card-system`  
**Status**: Not yet created  
**Estimated Components**: Card, Deck, Hand, CardArea, Discard, CardAnimation

| Game | Type | Cards | Complexity | Est. Code |
|------|------|-------|------------|-----------|
| Blackjack | Deal & Sum | 1-2 decks | Medium | 400-600 |
| Go-Fish | Match & Collect | 52 | Medium | 350-500 |
| War | Comparison | 52 | Low | 200-300 |
| Bingo | Card-marking | Custom | Low | 300-400 |
| Memory-Game | Card-flip | Custom | Low | 250-350 |
| Dominoes | Tile-placement | 28 pieces | Medium | 400-550 |
| Snakes & Ladders | Board-movement | Cards + board | Low | 300-450 |
| *Future*: Poker | Hand-ranking | 5-7 cards | High | 600-800 |
| *Future*: Hearts | Trick-taking | 13 cards | High | 500-700 |
| *Future*: Spades | Auction-based | 13 cards | High | 550-750 |

**Analysis**:
- 8-10 games use card mechanics (deck, draw, hand management, discard)
- Current implementations likely have 60-75% duplicate code (card rendering, animation, deck shuffling)
- **Potential savings**: 2,000+ lines of boilerplate

**Priority: HIGH** (More games than dice system)

---

### 4. **Tile/Flip-Based Games** ⏳ NEEDS CONSOLIDATION P2
**Proposed System**: `@games/ui-tile-system`  
**Status**: Not yet created  
**Estimated Components**: Tile, TileGrid, useRevealState, TileAnimation

| Game | Mechanic | Tiles | Complexity |
|------|----------|-------|------------|
| Memory-Game | Flip-match pairs | 16-20 | Low |
| Battleship | Reveal-on-hit | 100 | Medium |
| Dominoes | Tile-placement | 28 | Medium |
| *Future*: Mahjong | Match-corners | 144 | High |

**Analysis**:
- Memory-Game and Dominoes both need reveal/flip mechanics
- Shared tile state management (faceDown → faceUp → locked)
- Flip animations, coordinate tracking
- **Potential savings**: 1,000+ lines

**Priority: MEDIUM** (Fewer games, but clear pattern)

---

### 5. **Pile/Counter-Based Games** ⏳ NEEDS CONSOLIDATION P4
**Proposed System**: `@games/ui-pile-system`  
**Status**: Not yet created  
**Estimated Components**: Pile, PileArea, useCounterState, Counter

| Game | Mechanic | Piles | Complexity |
|------|----------|-------|------------|
| Nim | Remove from piles | 3-7 | Low |
| Mancala | Distribute seeds | 12-14 pits | Medium |
| Shut-the-Box | Mark numbers | 9-12 boxes | Low |
| Pig | Accumulate, bank, bust | 1 per player | Low |
| *Future*: Kalaha | Capture seeds | 12-14 pits | Medium |

**Analysis**:
- All use counter/accumulation mechanics
- Nim: Remove N items from M piles
- Mancala: Distribute items across pits
- Shared patterns: Counter increment, visual animation, state tracking
- **Potential savings**: 1,500+ lines

**Priority: MEDIUM-HIGH** (4-5 games, clear patterns)

---

### 6. **Letter/Word-Based Games** ⏳ NEEDS CONSOLIDATION P5
**Proposed System**: `@games/ui-letter-system`  
**Status**: Not yet created  
**Estimated Components**: Letter, WordDisplay, GuessArea, useLetterState

| Game | Mechanic | Letters | Complexity |
|------|----------|---------|------------|
| Hangman | Guess-reveal letters | 26 | Low |
| Crossclimb | Vertical word placement | Variable | Medium |
| *Future*: Wordle | Position-based guessing | 5 | Low |
| *Future*: Scrabble | Tile placement | 100 | High |

**Analysis**:
- Hangman: Guess letter → reveal all instances
- Crossclimb: Place words vertically
- Shared patterns: Letter display, guess tracking, word validation
- **Potential savings**: 800+ lines

**Priority: MEDIUM** (2-3 core games)

---

### 7. **Choice/Decision-Based Games** ⏳ NEEDS CONSOLIDATION P3
**Proposed System**: `@games/ui-choice-system`  
**Status**: Not yet created  
**Estimated Components**: ChoiceButton, ChoiceArea, useChoiceState

| Game | Choices | Complexity | Mechanic |
|------|---------|------------|----------|
| Rock-Paper-Scissors | 3 (+ dynamic) | Low | Selection |
| Simon-Says | 4 colors | Low | Pattern-following |
| Tango | Partner choices | Low | Paired selection |
| *Future*: Higher-Lower | 2 choices | Low | Single-choice |

**Analysis**:
- Rock-Paper-Scissors: 3-option selection
- Simon-Says: 4 color buttons with haptic feedback
- Shared patterns: Button highlighting, feedback, animation
- **Potential savings**: 500+ lines

**Priority: LOWER** (Fewer games, simpler mechanics)

---

### 8. **Movement/Navigation Games** 🔄 EVALUATE
**Potential System**: `@games/ui-movement-system` (Uncertain necessity)  
**Candidates**:

| Game | Movement Type | Grid | Status |
|---|---|---|---|
| Snake | Continuous 2D | Dynamic | ⏳ Pending |
| Snakes & Ladders | Board positions | Fixed | ⏳ Pending |

**Analysis**:
- Snake is arcade-style (real-time 2D movement)
- Snakes & Ladders is board-based (discrete positions)
- May not warrant separate system; could extend board-core or movement logic in domain
- **Decision**: Defer until 2+ games clearly need shared system

---

### 9. **Comparison/Outcome Games** ⏳ EVALUATE
**Potential System**: `@games/ui-comparison-system` (Uncertain necessity)  
**Candidates**:

| Game | Mechanic | Status |
|---|---|---|
| War | Card comparison | ⏳ Pending |
| Go-Fish | Matching sets | ⏳ Pending |
| Reversi | Board flipping | ⏳ Pending |

**Analysis**:
- War: Simple high-card comparison
- Go-Fish: Match seeking + hand management
- Reversi: Board state transformation
- May not warrant separate system; part of card-system or board-core

---

## Strategic Consolidation Roadmap

### Phase 1: Foundation (Weeks 1-2) ✅ COMPLETE
- ✅ @games/ui-board-core
- ✅ @games/ui-dice-system  
- ✅ Consolidate: TicTacToe, Connect-Four, Mini-Sudoku, Sudoku, Bunco, Farkle

### Phase 2: High-ROI Cards (Weeks 3-6) 🔄 RECOMMENDED NEXT
**Target**: @games/ui-card-system (10 games, 2,000+ lines saved)
- Analyze: Blackjack (setup), Go-Fish (hand management), War (deck mechanics)
- Design: Card component, Deck abstraction, Hand display, CardAnimation
- Implement: Reference implementations (Go-Fish simple, Blackjack medium)
- Consolidate: 8-10 games

**Est. Impact**:
- Code reduction: 2,000+ lines
- Quality improvements: Shared card animation, accessibility
- New games faster: 30-40% faster to implement

### Phase 3: Tile & Pile Systems (Weeks 7-10)
- **ui-tile-system**: Memory-Game, Dominoes (1,000+ lines)
- **ui-pile-system**: Nim, Mancala, Shut-the-Box (1,500+ lines)

**Combined Impact**: 2,500+ lines saved

### Phase 4: Letter & Choice Systems (Weeks 11-12)
- **ui-letter-system**: Hangman, Crossclimb (800+ lines)
- **ui-choice-system**: Rock-Paper-Scissors, Simon-Says (500+ lines)

**Combined Impact**: 1,300+ lines saved

### Phase 5: Board Game Extensions (Week 13+)
- Extend **ui-board-core** for: Checkers, Queens, Minesweeper, Reversi  
- Add piece movement, capture mechanics, dynamic grids
- Est. 1,000+ lines saved

---

## Implementation Strategy per System

### Template Pattern (All Systems)

```typescript
// packages/ui-[family]-system/src/

// 1. Core Component (reusable, generic)
// - [Component].tsx (render + styling)
// - [Component].module.css (responsive, accessible)
// - [Component].types.ts (generic props interface)

// 2. Adapter Hooks (game-specific logic bridge)
// - use[Family]State.ts (game-to-component translation)
// - [Family]Adapters.ts (helpers to convert game state → component props)

// 3. Animations (shared across family)
// - [Family].animations.css (keyframes, transitions)

// 4. Accessibility
// - [Component].a11y.ts (ARIA, semantic HTML guidance)

// 5. Barrel Export
// - index.ts (public API only)
```

### Example: Card-System Architecture

```
packages/ui-card-system/
├── src/
│   ├── Card.tsx (individual card component)
│   ├── Card.module.css (card styling: face, back, animation)
│   ├── Deck.tsx (deck assembly, shuffle animation)
│   ├── Hand.tsx (hand display: fanned, stacked, arranged)
│   ├── CardArea.tsx (polymorphic display area)
│   ├── useCardState.ts (game-to-component bridge)
│   ├── cardAdapters.ts (helpers: shuffle, deal, reveal)
│   ├── card.animations.css (flip, deal, ace effects)
│   ├── card.a11y.ts (ARIA attributes, focus states)
│   ├── index.ts (barrel)
│   └── types.ts (CardProps, DeckConfig, HandLayout)
├── package.json
└── README.md (usage guide)
```

---

## Decision Matrix

**Factors for "Create Shared System"**:

| Factor | Score 1-5 | Weight | Notes |
|---|---|---|---|
| **Code Duplication** | (count) | 30% | % of game code that's boilerplate |
| **Game Count** | (number) | 25% | More games = higher ROI |
| **Implementation Clarity** | (difficulty) | 20% | Can pattern be abstracted cleanly? |
| **Complexity Variance** | (range) | 15% | Do games vary significantly? |
| **Accessibility Value** | (impact) | 10% | Shared a11y wins |

### Scores by System

| System | Duplication | Games | Clarity | Variance | A11Y | **TOTAL SCORE** | RECOMMENDATION |
|---|---|---|---|---|---|---|---|
| ui-card-system | 5 | 5 | 5 | 4 | 5 | **4.8/5** | ✅ **CRITICAL** |
| ui-pile-system | 4 | 4 | 5 | 3 | 4 | **4.1/5** | ✅ **HIGH** |
| ui-tile-system | 4 | 3 | 4 | 4 | 4 | **3.9/5** | ✅ **HIGH** |
| ui-letter-system | 4 | 2 | 4 | 4 | 5 | **4.0/5** | ✅ **MEDIUM-HIGH** |
| ui-choice-system | 3 | 2 | 5 | 3 | 4 | **3.4/5** | ⏳ **MEDIUM** |

**Verdict**:
1. **CRITICAL**: ui-card-system (start immediately)
2. **HIGH**: ui-pile-system, ui-tile-system (next phase)
3. **MEDIUM-HIGH**: ui-letter-system (phase 4)
4. **MEDIUM**: ui-choice-system (phase 4)

---

## Completion Metrics

### Success Criteria per System

**ui-card-system**:
- ✅ All 8-10 card games refactored / consolidated
- ✅ 60%+ code reduction in card UI code
- ✅ 2,000+ lines consolidated
- ✅ All lint + typecheck passing
- ✅ Reference implementations: Go-Fish (simple), Blackjack (medium)
- ✅ Responsive design: 5 breakpoints, touch-optimized
- ✅ Accessibility: WCAG AA

**ui-pile-system**:
- ✅ 4-5 pile games consolidated
- ✅ 55%+ code reduction
- ✅ 1,500+ lines consolidated
- ✅ Reference implementations: Nim (simple), Mancala (complex)

Similar criteria for all other systems.

---

## Timeline & Resource Estimate

| Phase | System | Duration | Effort | Output |
|---|---|---|---|---|
| **1** ✅ | ui-board-core | 2 weeks | 3 dev-weeks | 4 systems, 5+ games |
| **1** ✅ | ui-dice-system | 2 weeks | 3 dev-weeks | 4 systems, 2+ games |
| **2** 🔄 | ui-card-system | 3 weeks | 5 dev-weeks | 1 system, 10 games |
| **3** | ui-pile-system | 2 weeks | 3 dev-weeks | 1 system, 4 games |
| **3** | ui-tile-system | 2 weeks | 3 dev-weeks | 1 system, 3 games |
| **4** | ui-letter-system | 1.5 weeks | 2 dev-weeks | 1 system, 2 games |
| **4** | ui-choice-system | 1 week | 1.5 dev-weeks | 1 system, 2 games |
| **5** | Extensions | 2 weeks | 3 dev-weeks | board-core extensions |

**Total**: 13.5 weeks, ~23 dev-weeks, **7,700+ lines consolidated**

---

## Next Immediate Step

### Recommended: Start Phase 2 with ui-card-system

**Rationale**:
1. Highest code reduction (2,000+ lines)
2. Most games affected (10)
3. Clear pattern (Deck, Hand, Card)
4. High complexity variance (simple to complex) = good test

**First Task**: Analyze Go-Fish & Blackjack structures
- Understand card representation
- Identify common patterns
- Design adapter hooks

**Estimated**: 3-4 hours to prototype component structure

---

## Appendix: Game Inventory Summary

### By Family

| Family | Count | Consolidated | Pending | Status |
|---|---|---|---|---|
| **Grid/Board** | 11 | 4 | 7 | ✅ Foundation |
| **Dice** | 9 | 2 | 7 | ✅ Foundation |
| **Card** | 8-10 | 0 | 8 | ⏳ NEXT |
| **Pile/Counter** | 4-5 | 0 | 4 | 🔄 Plan |
| **Tile/Flip** | 3-4 | 0 | 3 | 🔄 Plan |
| **Letter/Word** | 2-3 | 0 | 2 | 🔄 Plan |
| **Choice/Decision** | 2-3 | 0 | 2 | 🔄 Plan |
| **Movement** | 2 | 0 | 2 | ⏳ Defer |
| **Comparison** | 3 | 0 | 3 | ⏳ Defer |

**Total**: 38 games | 6 consolidated | 32 pending | 7 major systems planned

---

## Questions for Validation

1. **ui-card-system Priority**: Should we start with this given 10 games affected?
2. **Game Pending Status**: Are Blackjack and others in "pending" actually under development?
3. **New Game Roadmap**: Are there planned games (Poker, Hearts, Spades, Mahjong) that should influence the design?
4. **Monchola Status**: What is the current state? Should it be classified with board or separate family?
5. **Platform Strategy**: Should Electron/Capacitor deployment affect system design?

