# Card Deck System

**Shared card deck implementation for all card games in the platform**

A complete, reusable system for managing standard playing cards, jokers, shuffling, dealing, and tracking card penetration across single decks and multi-deck shoes.

## Features

✅ **Standard 52-Card Deck** — Complete with 4 suits (♣️♦️♠️♥️) and 13 ranks (2-10, J, Q, K, A)  
✅ **Joker Support** — Optionally add jokers (53 or 54-card decks)  
✅ **Multi-Deck Shoes** — Combine multiple decks (e.g., 4, 6, or 8 decks) with penetration tracking  
✅ **Card Value System** — Numeric values for each rank with alternate values (e.g., Ace = 1, 11, or 14)  
✅ **Rich Utilities** — Shuffle, deal, filter, sort, count, and format cards  
✅ **Penetration Tracking** — Know when to reshuffle based on burn card threshold  

## Installation

```bash
pnpm add @games/card-deck-system
```

## Quick Start

### Single Deck Game (Go-Fish, War, Memory)

```typescript
import { Deck } from '@games/card-deck-system'

// Create and shuffle a deck
const deck = new Deck()
deck.shuffle()

// Deal cards
const hand = deck.dealCards(5)

// Check remaining
console.log(deck.getRemaining()) // 47 cards left (52 - 5)
```

### Multi-Deck Game (Blackjack with 6-deck shoe)

```typescript
import { Shoe } from '@games/card-deck-system'

// Create a 6-deck shoe
const shoe = new Shoe({
  deckCount: 6,
  withJokers: false,
  burnCardThreshold: 0.75, // Reshuffle when 75% used
})

// Shuffle and start dealing
shoe.shuffle()

while (!shoe.shouldReshuffle()) {
  const card = shoe.dealCard()
  // Play the card
  const state = shoe.getState()
  console.log(`Penetration: ${(state.penetration * 100).toFixed(1)}%`)
}

// When threshold reached, reshuffle
shoe.reshuffle()
```

### Card Jokers (53 or 54-card deck)

```typescript
// 53-card deck (1 joker)
const deck53 = new Deck({
  withJokers: true,
  singleJoker: true,
})
console.log(deck53.getSize()) // 53

// 54-card deck (2 jokers)
const deck54 = new Deck({
  withJokers: true,
  singleJoker: false, // Default
})
console.log(deck54.getSize()) // 54
```

## Core Classes

### `Deck`

Represents a single deck of cards (standard 52, or 53-54 with jokers).

**Methods:**

- `getSize()` — Total cards in deck
- `getRemaining()` — Cards left to deal
- `getDealt()` — Cards already dealt
- `shuffle()` — Shuffle undealt cards only (Fisher-Yates)
- `dealCard()` — Deal one card
- `dealCards(count)` — Deal multiple cards
- `reset()` — Send all cards back to undealt state
- `peek()` — View remaining cards without dealing

**Example:**

```typescript
const deck = new Deck({ withJokers: true })
deck.shuffle()

while (deck.getRemaining() > 0) {
  const card = deck.dealCard()
  // Play card
}

deck.reset() // Start over
```

### `Shoe`

Represents multiple decks combined (used in Blackjack, some poker variants).

**Configuration:**

```typescript
const shoe = new Shoe({
  deckCount: 6,                  // Number of decks (1, 2, 4, 6, 8, etc.)
  withJokers: false,             // Include jokers (optional)
  burnCardThreshold: 0.75,       // Reshuffle at 75% penetration (optional)
  singleJokerPerDeck: false,     // Use 1 joker instead of 2 (optional)
})
```

**Methods:**

- `getTotalCards()` — All cards in shoe
- `getCardsRemaining()` — Cards left to deal
- `getCardsDealt()` — Cards already dealt
- `getPenetration()` — 0.0-1.0 percentage of shoe used
- `shouldReshuffle()` — Check if penetration threshold exceeded
- `dealCard()` — Deal one card
- `dealCards(count)` — Deal multiple cards
- `burnCard()` — Discard a card (counts toward penetration)
- `reshuffle()` — Reset all decks and shuffle
- `getState()` — Get complete shoe state (for monitoring)

**Example — Blackjack-style shoe management:**

```typescript
const shoe = new Shoe({ deckCount: 6, burnCardThreshold: 0.75 })

while (gameActive) {
  if (shoe.shouldReshuffle()) {
    console.log('Reshuffling...')
    shoe.reshuffle()
  }

  const playerCard = shoe.dealCard()
  const dealerCard = shoe.dealCard()
  // Play hand
}
```

## Utilities

### Card Creation

```typescript
import { createCard, createJoker, CardSuit, CardRank } from '@games/card-deck-system'

// Create standard card
const aceOfSpades = createCard(CardSuit.SPADES, CardRank.ACE, 'card-1')

// Create joker
const joker = createJoker('joker-1')
```

### Card Validation & Comparison

```typescript
import { isValidCard, isSameCard, isSameRank, isSameSuit } from '@games/card-deck-system'

const card1 = { suit: CardSuit.HEARTS, rank: CardRank.KING, isJoker: false, id: '1' }
const card2 = { suit: CardSuit.HEARTS, rank: CardRank.KING, isJoker: false, id: '1' }
const card3 = { suit: CardSuit.HEARTS, rank: CardRank.ACE, isJoker: false, id: '2' }

isValidCard(card1) // true
isSameCard(card1, card2) // true (same suit & rank)
isSameRank(card1, card3) // false
isSameSuit(card1, card3) // true (both hearts)
```

### Card Formatting & Notation

```typescript
import { formatCard, getCardNotation } from '@games/card-deck-system'

const card = { suit: CardSuit.SPADES, rank: CardRank.ACE, isJoker: false, id: '1' }

formatCard(card) // "Ace of Spades"
getCardNotation(card) // "AS"
```

### Hand Analysis

```typescript
import { countByRank, countBySuit, hasJoker, filterBySuit } from '@games/card-deck-system'

const hand = [/* cards */]

const rankCounts = countByRank(hand)
// { 2: 1, 3: 2, 4: 0, ..., A: 1 }

const suitCounts = countBySuit(hand)
// { diamonds: 2, clubs: 1, spades: 0, hearts: 2 }

const hasWildcard = hasJoker(hand) // true/false

const hearts = filterBySuit(hand, CardSuit.HEARTS) // Only hearts
const aces = filterByRank(hand, CardRank.ACE) // Only aces
```

### Card Sorting

```typescript
import { sortByRank, sortBySuitThenRank } from '@games/card-deck-system'

const hand = [/* mixed cards */]

const byRank = sortByRank(hand) // 2, 3, 4, ..., K, A
const bySuitThenRank = sortBySuitThenRank(hand) // Clubs, Diamonds, Hearts, Spades (each sorted by rank)
```

### Card Value

```typescript
import { getCardValue, getCardAlternateValues, compareCardRanks } from '@games/card-deck-system'

getCardValue(CardRank.ACE) // 14 (base value)
getCardAlternateValues(CardRank.ACE) // [14, 1, 11] (for games that allow multiple)

compareCardRanks(CardRank.ACE, CardRank.KING) // 1 (Ace > King)
compareCardRanks(CardRank.TWO, CardRank.TEN) // -1 (2 < 10)
```

## Game Examples

### War (Simple 2-player comparison game)

```typescript
import { Deck, compareCardRanks } from '@games/card-deck-system'

const deck = new Deck()
deck.shuffle()

// Deal entire deck to two players
const playerAHalf = deck.dealCards(26)
const playerBHalf = deck.dealCards(26)

// Play a round: compare top cards
const cardA = playerAHalf[0]
const cardB = playerBHalf[0]
const result = compareCardRanks(cardA.rank!, cardB.rank!)

if (result > 0) {
  console.log('Player A wins')
  // Player A gets both cards
} else if (result < 0) {
  console.log('Player B wins')
  // Player B gets both cards
} else {
  console.log('War!')
  // Both play more cards
}
```

### Go-Fish (Card matching game)

```typescript
import { Deck, filterByRank, isSameRank } from '@games/card-deck-system'

const deck = new Deck()
deck.shuffle()

const hand = deck.dealCards(5)

// Ask for cards of a rank
const askedRank = hand[0].rank
console.log(`Do you have any ${askedRank}s?`)

// Check opponent's hand for that rank
const matchingCards = filterByRank(opponentHand, askedRank)

if (matchingCards.length > 0) {
  console.log(`You got ${matchingCards.length} cards!`)
  hand.push(...matchingCards)
} else {
  console.log('Go fish!')
  hand.push(deck.dealCard())
}
```

### Blackjack (Multi-deck game with penetration tracking)

```typescript
import { Shoe, getCardValue } from '@games/card-deck-system'

const shoe = new Shoe({ deckCount: 6, burnCardThreshold: 0.75 })
shoe.shuffle()

while (gameActive) {
  if (shoe.shouldReshuffle()) {
    console.log('Reshuffling...')
    shoe.reshuffle()
  }

  // Deal to player and dealer
  const playerCards = shoe.dealCards(2)
  const dealerCards = shoe.dealCards(2)

  // Calculate hand value (simplified)
  let playerValue = playerCards.reduce((sum, card) => sum + getCardValue(card.rank!), 0)

  // Play hand...
}
```

## Constants

### `CARD_NUMERIC_VALUES`

Maps each rank to its base numeric value:

```typescript
import { CARD_NUMERIC_VALUES, CardRank } from '@games/card-deck-system'

CARD_NUMERIC_VALUES[CardRank.ACE] // { baseValue: 14, alternateValues: [1, 11] }
CARD_NUMERIC_VALUES[CardRank.KING] // { baseValue: 13 }
CARD_NUMERIC_VALUES[CardRank.TEN] // { baseValue: 10 }
CARD_NUMERIC_VALUES[CardRank.TWO] // { baseValue: 2 }
```

## Architecture Notes

This package provides the **domain layer** for card game logic. Games should:

1. **Domain layer** (`src/domain/`) — Import from `@games/card-deck-system` to create game rules, moves, and validation
2. **App layer** (`src/app/`) — Use domain logic through custom hooks and context providers
3. **UI layer** (`src/ui/`) — Display cards using a shared `Card` component that accepts card data

### Example game structure (Blackjack):

```
apps/blackjack/src/
├── domain/
│   ├── deck-manager.ts      # Uses Shoe from @games/card-deck-system
│   ├── hand.ts              # Card hand logic
│   ├── rules.ts             # Blackjack-specific rules
│   └── types.ts             # Game types
├── app/
│   └── hooks/
│       └── useBlackjack.ts  # Game orchestration
└── ui/
    └── organisms/
        └── GameBoard.tsx    # Renders cards
```

## Testing

All games using this package should test:

- ✅ Deck size and composition (52 + jokers)
- ✅ Card uniqueness (each card appears once per deck)
- ✅ Shuffle randomness (no patterns)
- ✅ Dealing order (cards dealt in sequence)
- ✅ Shoe penetration (accurate % calculation)
- ✅ Reshuffle logic (triggers at correct threshold)
- ✅ Multi-deck handling (cards from deck N-1 before deck N)

## Related Packages

- `@games/domain-shared` — Shared game types and utilities
- `@games/app-hook-utils` — Shared React hooks
- `@games/ui-utils` — Shared UI component utilities

## Future Enhancements

Possible future additions (not in first release):

- Card counting system (for Blackjack trainers)
- Hand strength evaluation (for poker variants)
- Card distribution histograms (for probability analysis)
- Encoding/decoding cards for network play
- Card rendering contracts (SVG, Unicode, text representations)
