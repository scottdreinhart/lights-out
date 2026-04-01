# Card-Deck Integration Plan: Option A

**Target Games**: war, blackjack, go-fish  
**Dependency**: @games/card-deck-core (stable with TypeScript 6.0.2)  
**Status**: 🟡 PLANNING PHASE  
**Start Date**: 2026-04-01

---

## Executive Summary

Integrate the production-ready card-deck-core package into war, blackjack, and go-fish games. This eliminates code duplication across card games and establishes a unified card system governance.

**Expected Outcomes**:

- ✅ Shared card system across all three games
- ✅ Reduced code duplication (est. 30-40% less card logic code)
- ✅ Consistent card API across platform
- ✅ Reusable React hooks for card UI
- ✅ Easier to extend to additional card games (poker, rummy, bridge, etc.)

---

## Integration Architecture

### Layer Structure

```
Card Game Apps (war, blackjack, go-fish)
    ↓ uses
@/app/hooks/useCardGame           ← React integration layer (NEW)
@/app/hooks/useCardShoe           ← Shoe management (NEW)
@/app/hooks/useCardHand           ← Hand management (NEW)
    ↓ uses
@games/card-deck-core             ← Pure card logic (EXISTING, stable)
    ↓ uses
Card Deck Domain Types            ← Framework-agnostic (EXISTING)
```

### Files to Create

**Per-game hooks** (custom integration):

- `apps/{war|blackjack|go-fish}/src/app/hooks/useWarGameLogic.ts`
- `apps/{war|blackjack|go-fish}/src/app/hooks/useBlackjackLogic.ts`
- `apps/{war|blackjack|go-fish}/src/app/hooks/useGoFishLogic.ts`

**Shared card hooks** (for multiple games):

- `packages/app-hook-utils/src/useCardGame.ts` — Generic card game state
- `packages/app-hook-utils/src/useCardShoe.ts` — Shoe management
- `packages/app-hook-utils/src/useCardHand.ts` — Hand management

**Shared UI components** (optional):

- `apps/ui/organisms/CardHand/CardHand.tsx` — Display hand of cards
- `apps/ui/organisms/CardShoe/CardShoe.tsx` — Display shoe/deck status
- `apps/ui/atoms/PlayingCard/PlayingCard.tsx` — Single card display

---

## Implementation Phases

### Phase A.1: Shared Hooks Creation (2-3 hours)

**Deliverable**: Core card game hooks in app-hook-utils

```typescript
// packages/app-hook-utils/src/useCardGame.ts
export const useCardGame = (initialDeck?: DeckConfiguration) => {
  const [deck, setDeck] = useState(createDeck(initialDeck))
  const [hand, setHand] = useState<Card[]>([])

  return {
    deck,
    hand,
    dealCards: (count: number) => {
      /* ... */
    },
    discardCards: (cardIds: string[]) => {
      /* ... */
    },
    shuffleDeck: () => {
      /* ... */
    },
    resetGame: () => {
      /* ... */
    },
  }
}

// packages/app-hook-utils/src/useCardShoe.ts
export const useCardShoe = (deckCount: number = 1) => {
  const [shoe, setShoe] = useState(createShoe(Array(deckCount).fill(STANDARD_DECK)))

  return {
    shoe,
    dealFromShoe: (count: number) => {
      /* ... */
    },
    getPenetration: () => {
      /* ... */
    },
    reshuffle: () => {
      /* ... */
    },
  }
}

// packages/app-hook-utils/src/useCardHand.ts
export const useCardHand = () => {
  const [hand, setHand] = useState<Card[]>([])

  return {
    hand,
    addCards: (cards: Card[]) => {
      /* ... */
    },
    removeCards: (cardIds: string[]) => {
      /* ... */
    },
    clearHand: () => {
      /* ... */
    },
  }
}
```

**Tasks**:

- [ ] Create useCardGame hook with core deck logic
- [ ] Create useCardShoe hook for multi-deck support
- [ ] Create useCardHand hook for hand management
- [ ] Write unit tests for all three hooks
- [ ] Document API and usage examples

---

### Phase A.2: War Game Integration (2-3 hours)

**Target**: apps/war → Use card-deck-core + shared hooks

```typescript
// apps/war/src/app/hooks/useWarGameLogic.ts
export const useWarGameLogic = () => {
  const playerHand = useCardHand()
  const computerHand = useCardHand()
  const shoe = useCardShoe()

  const dealInitialCards = () => {
    const { cards } = dealFromShoe(shoe.shoe, 26)
    playerHand.addCards(cards.slice(0, 26))
    computerHand.addCards(cards.slice(26))
  }

  const playRound = () => {
    const playerCard = playerHand.hand[0]
    const computerCard = computerHand.hand[0]

    const result = compareCards(playerCard, computerCard)
    // Return: 'player' | 'computer' | 'war'

    return result
  }

  return {
    playerHand,
    computerHand,
    dealInitialCards,
    playRound,
  }
}
```

**Tasks**:

- [ ] Replace war's existing card logic with card-deck-core
- [ ] Create useWarGameLogic hook
- [ ] Update war's domain layer to use card-deck-core types
- [ ] Update war's UI to consume new hooks
- [ ] Verify game logic still works identically
- [ ] Test: Play 50 games, verify no regressions
- [ ] Commit: "feat(war): Integrate card-deck-core system"

---

### Phase A.3: Blackjack Integration (2-3 hours)

**Target**: apps/blackjack → Use card-deck-core + shared hooks

```typescript
// apps/blackjack/src/app/hooks/useBlackjackLogic.ts
export const useBlackjackLogic = () => {
  const playerHand = useCardHand()
  const dealerHand = useCardHand()
  const shoe = useCardShoe(6) // 6-deck shoe

  const dealInitialCards = () => {
    // Deal 2 cards to player, 1 card to dealer (1 facedown)
    const { cards: playerCards } = dealFromShoe(shoe.shoe, 2)
    const { cards: dealerCards } = dealFromShoe(shoe.shoe, 2)

    playerHand.addCards(playerCards)
    dealerHand.addCards(dealerCards)
  }

  const calculateHand = (hand: Card[]): number => {
    let total = 0
    let aces = 0

    hand.forEach((card) => {
      const { primaryValue, alternateValue } = getCardValue(card)
      if (card.rank === 'A') aces++
      total += primaryValue
    })

    // Adjust for Ace values
    while (total > 21 && aces > 0) {
      total -= 10
      aces--
    }

    return total
  }

  return {
    playerHand,
    dealerHand,
    dealInitialCards,
    calculateHand,
    hitPlayer: () => {
      /* ... */
    },
    standPlayer: () => {
      /* ... */
    },
  }
}
```

**Tasks**:

- [ ] Replace blackjack's existing card logic with card-deck-core
- [ ] Create useBlackjackLogic hook (6-deck shoe support)
- [ ] Update blackjack's domain layer to use card-deck-core types
- [ ] Update blackjack's UI to consume new hooks
- [ ] Verify game logic still works identically
- [ ] Test: Play 100 hands, verify basic strategy works
- [ ] Commit: "feat(blackjack): Integrate card-deck-core system"

---

### Phase A.4: Go-Fish Integration (2-3 hours)

**Target**: apps/go-fish → Use card-deck-core + shared hooks

```typescript
// apps/go-fish/src/app/hooks/useGoFishLogic.ts
export const useGoFishLogic = (playerCount = 2) => {
  const playerHands = Array(playerCount)
    .fill(null)
    .map(() => useCardHand())
  const fishPond = useCardShoe()

  const dealInitialCards = () => {
    const cardsPerPlayer = playerCount > 2 ? 5 : 7

    playerHands.forEach((hand) => {
      const { cards } = dealFromShoe(fishPond.shoe, cardsPerPlayer)
      hand.addCards(cards)
    })
  }

  const askForRank = (fromPlayer: number, toPlayer: number, rank: Rank) => {
    const cards = playerHands[toPlayer].hand.filter((c) => c.rank === rank)

    if (cards.length > 0) {
      playerHands[toPlayer].removeCards(cards.map((c) => c.id))
      playerHands[fromPlayer].addCards(cards)
      return { success: true, cardCount: cards.length }
    } else {
      const { cards: newCards } = dealFromShoe(fishPond.shoe, 1)
      playerHands[fromPlayer].addCards(newCards)
      return { success: false, drewCard: true }
    }
  }

  return {
    playerHands,
    fishPond,
    dealInitialCards,
    askForRank,
  }
}
```

**Tasks**:

- [ ] Replace go-fish's existing card logic with card-deck-core
- [ ] Create useGoFishLogic hook
- [ ] Update go-fish's domain layer to use card-deck-core types
- [ ] Update go-fish's UI to consume new hooks
- [ ] Verify game logic still works identically (2-4 player support)
- [ ] Test: Play 30 games (various player counts)
- [ ] Commit: "feat(go-fish): Integrate card-deck-core system"

---

### Phase A.5: Shared Card UI Components (2-3 hours) [Optional]

**Deliverable**: Reusable card display components

```typescript
// apps/ui/atoms/PlayingCard/PlayingCard.tsx
export const PlayingCard: React.FC<PlayingCardProps> = ({
  card,
  faceUp = true,
  onClick,
  selected = false,
  disabled = false
}) => {
  const formatted = formatCard(card)

  return (
    <button
      className={clsx(styles.card, {
        [styles.selected]: selected,
        [styles.disabled]: disabled,
        [styles.faceDown]: !faceUp
      })}
      onClick={onClick}
      disabled={disabled}
    >
      {faceUp ? formatted : '🂠'} {/* Card back */}
    </button>
  )
}

// apps/ui/organisms/CardHand/CardHand.tsx
export const CardHand: React.FC<CardHandProps> = ({
  cards,
  selectedCardIds = [],
  onSelectCard,
  layout = 'fan' | 'horizontal' | 'grid'
}) => {
  return (
    <div className={clsx(styles.hand, styles[layout])}>
      {cards.map(card => (
        <PlayingCard
          key={card.id}
          card={card}
          selected={selectedCardIds.includes(card.id)}
          onClick={() => onSelectCard(card.id)}
        />
      ))}
    </div>
  )
}
```

**Tasks**:

- [ ] Create PlayingCard atom (single card display)
- [ ] Create CardHand organism (display player's hand)
- [ ] Create CardShoe organism (deck/shoe status display)
- [ ] Style for all 5 device tiers (mobile to ultrawide)
- [ ] Test across all games (war, blackjack, go-fish)

---

## Testing Strategy

### Unit Tests (per game)

**War**:

```bash
pnpm -C apps/war test
# Verify:
# - Cards dealt correctly (26 to each player)
# - Ranking logic works (2 < A)
# - War rounds resolve correctly
```

**Blackjack**:

```bash
pnpm -C apps/blackjack test
# Verify:
# - Shoe penetration works (6 decks, reshuffle at 75%)
# - Hand calculation correct (Ace = 1 or 11)
# - Bust logic works (>21)
```

**Go-Fish**:

```bash
pnpm -C apps/go-fish test
# Verify:
# - Cards dealt correctly (5-7 per player)
# - Ask/fish logic works (cards transferred or draw)
# - Game ends when all cards matched
```

### Integration Tests (cross-game)

```bash
pnpm run test:card-deck-games
# Play each game 100x + verify no errors
```

### Manual Testing (Browser)

For each game:

- [ ] Play 10 games manually
- [ ] Verify UI renders correctly
- [ ] Verify all cards display properly
- [ ] Verify game logic matches previous version
- [ ] Test all 5 device sizes (375px → 1800px+)

---

## Rollback Plan

If integration introduces issues:

```bash
# Per game:
git revert <integration-commit>
pnpm -C apps/{game} install

# If critical issues:
git revert --no-commit <integration-commit>
# Fix locally, then commit
```

---

## Success Criteria

- ✅ All 3 games integrate with card-deck-core without code changes
- ✅ Zero line-of-code increase (actual decrease expected)
- ✅ All games pass full validation: `pnpm validate`
- ✅ All games play identically to before integration
- ✅ card-deck-core becomes shared reusable system
- ✅ Setup for future card games (poker, rummy, etc.)

---

## Timeline Estimate

| Phase                      | Hours     | Estimated Date     |
| -------------------------- | --------- | ------------------ |
| A.1: Shared Hooks          | 2-3       | 2026-04-01 / 04-02 |
| A.2: War Integration       | 2-3       | 2026-04-02 / 04-03 |
| A.3: Blackjack Integration | 2-3       | 2026-04-03 / 04-04 |
| A.4: Go-Fish Integration   | 2-3       | 2026-04-04 / 04-05 |
| A.5: Shared UI Components  | 2-3       | 2026-04-06 / 04-07 |
| **Total**                  | **10-15** | **~1 week**        |

---

## Related Documentation

- [card-deck-core README](packages/card-deck-core/README.md)
- [Phase 2 TypeScript 6.0.2 Report](PHASE_2_COMPLETION_REPORT.md)
- [Game Platform Architecture](docs/PUZZLE_ENGINE_ARCHITECTURE.md)

---

## Next Steps

1. ✅ Create shared hooks in app-hook-utils (Phase A.1)
2. ⏳ Integrate war game (Phase A.2)
3. ⏳ Integrate blackjack (Phase A.3)
4. ⏳ Integrate go-fish (Phase A.4)
5. ⏳ Build shared UI components (Phase A.5)
6. ⏳ Full validation + testing
7. ⏳ Commit all changes
8. ⏳ Begin app decomposition (parallel with above)

**Status**: Ready to begin Phase A.1
