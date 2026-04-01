# Option A: Card-Deck Integration Plan

## Objective

Integrate `@games/card-deck-core` into war, blackjack, and go-fish games to consolidate card handling logic across the platform.

## Current Status

✅ `@games/card-deck-core` package exists and is fully functional  
✅ `@games/card-deck-system` package exists  
⏳ war, blackjack, go-fish games discovered but need analysis

## Integration Scope

### Game 1: War (Card Game)

**Simplest integration** — purely sequential card comparison

- Deal 26 cards to each player
- Compare top cards (higher rank wins)
- Handle ties (player draws 3 cards face-down + 1 face-up)
- Repeat until deck exhausted

**Refactoring needed**:

- [ ] Replace custom card type with `Card` from `@games/card-deck-core`
- [ ] Use `createDeck()` for initialization
- [ ] Use `shuffleDeck()` for randomization
- [ ] Use `dealCards()` for distribution
- [ ] Use `getCardValue()` for comparisons
- [ ] Update domain logic to use shared card operations

**Estimated lines changed**: 150-200 lines
**Complexity**: LOW

### Game 2: Go-Fish

**Medium integration** — hand management + set collection

- Deal 7 cards initially
- Players ask for ranks
- Collect books (four of a kind)
- Draw from deck when asking fails

**Refactoring needed**:

- [ ] Use `Card` type from core
- [ ] Use `dealCards()` for dealing
- [ ] Use `removeCards()` for book collection
- [ ] Use `isSameRank()` for rank matching
- [ ] Adapt hand management logic

**Estimated lines changed**: 200-250 lines
**Complexity**: MEDIUM

### Game 3: Blackjack

**Most complex integration** — game rules + special value logic

- Deal 2 cards per player/dealer
- Hit/Stand decisions
- Ace dual-value handling (1 or 11)
- Bust/21/Natural logic

**Refactoring needed**:

- [ ] Use `Card` type from core
- [ ] Implement blackjack-specific value calculation (Ace flexibility)
- [ ] Use `getCardNumericValue()` but extend for Ace logic
- [ ] Use `createDeck()`, `shuffleDeck()`, `dealCards()`
- [ ] Keep domain-specific win conditions

**Estimated lines changed**: 250-350 lines
**Complexity**: HIGH (Ace dual-value is domain-specific)

## Implementation Strategy

### Phase A: Library Integration (1-2 hours)

1. **War** (30 min)
   - Update domain/game logic to use card-deck-core
   - Run typecheck/lint
   - Commit

2. **Go-Fish** (45 min)
   - Adapt hand management to use core utilities
   - Test rank-matching logic
   - Commit

3. **Blackjack** (60 min)
   - Integrate core decks and dealing
   - Extend card value logic for Aces
   - Test all win/lose/push conditions
   - Commit

### Phase B: React Hooks Wrapper (30 min)

- Create `@games/card-game-hooks` package
- `useCardDeck()` - wraps card-deck-core with React state
- `usePlayerHands()` - manages multiple player hands
- `useCardShoe()` - multi-deck casino games

### Phase C: UI Components (Optional, 1-2 hours)

- Create reusable `<Card>` component (displays card with suit/rank)
- Create `<Hand>` component (displays multiple cards)
- Create `<DiscardPile>` component (animation + state)

## Success Criteria

✅ All three games integrate @games/card-deck-core  
✅ No duplication of card logic across games  
✅ TypeCheck + Lint passing for all three  
✅ Game behavior unchanged (refactoring only)  
✅ Clear git history with commits per game

## Timeline Estimate

- Total: 2-3 hours
- War: 30 min
- Go-Fish: 45 min
- Blackjack: 60 min
- React hooks: 30 min (if included)
- UI components: 1-2 hours (if included)

## Next Steps (When Ready)

1. Analyze war domain/rules in detail
2. Identify card-specific logic vs. game-specific logic
3. Plan refactoring sequence (smallest → largest)
4. Execute migrations with commits
5. Verify game behavior unchanged via typecheck + lint

## Notes

- All three games are good candidates (they actually use playing cards)
- card-deck-core is generic and game-agnostic (perfect fit)
- No new domain logic should be added (consolidation only)
- Games retain domain-specific rules (blackjack Ace logic, go-fish ranking, war comparison)
