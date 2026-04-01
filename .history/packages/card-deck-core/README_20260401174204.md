# Card Deck Core

**Shared card deck system for all card games on the platform**

A comprehensive, type-safe card management library that handles standard playing cards, jokers, card values, shuffling, dealing, and multi-deck shoes.

## Overview

This package provides everything needed to manage playing cards in any card game:

- **Standard 52-card deck** with 4 suits (♦♣♠♥)
- **Card ranks** A, 2-10, J, Q, K (plus Joker support)
- **Joker support** for 53-card or 54-card decks
- **Card value system** with primary and alternate values (e.g., Ace = 1 or 11)
- **Deck operations** shuffle, deal, burn, peek, reset
- **Multi-deck shoes** for casino-style games with penetration tracking
- **Unique card tracking** across entire shoe

## Installation

```bash
pnpm add @games/card-deck-core
```

## Quick Start

### Single Deck

```typescript
import {
  createDeck,
  shuffleDeck,
  dealCards,
  STANDARD_DECK,
  formatCard,
} from '@games/card-deck-core'

// Create and shuffle a deck
const deck = createDeck(STANDARD_DECK)
shuffleDeck(deck)

// Deal 5 cards
const { success, cards } = dealCards(deck, 5)
if (success) {
  cards.forEach((card) => console.log(formatCard(card))) // prints "5♦", "K♣", etc.
}

// Check what's left
const stats = getDeckStatistics(deck)
console.log(`Cards remaining: ${stats.cardsRemaining}`)
```

### Multi-Deck Shoe

```typescript
import { createShoe, dealFromShoe, BLACKJACK_SIX_DECK } from '@games/card-deck-core'

// Create a 6-deck shoe
const shoe = createShoe([BLACKJACK_SIX_DECK])

// Deal from shoe (auto-advances decks)
const { cards } = dealFromShoe(shoe, 2)

// Check penetration
if (getCurrentDeckPenetration(shoe) > 0.75) {
  // Reshuffle when penetration > 75%
  reshuffleCurrentDeck(shoe)
}
```

### Card Values

```typescript
import { getCardValue, isSameRank, compareRanks } from '@games/card-deck-core'

// Get numeric value
const card = { suit: 'hearts', rank: '5', id: 'hearts_5_0_0' }
const value = getCardValue(card)
console.log(value.primaryValue) // 5

// Ace is special
const ace = { suit: 'spades', rank: 'A', id: 'spades_A_0_0' }
const aceValue = getCardValue(ace)
console.log(aceValue.primaryValue, aceValue.alternateValue) // 1, 11

// Compare ranks
compareRanks('A', 'K') // 1 (Ace beats King)
compareRanks('A', 'K', (aceLow = true)) // -1 (Ace is low in this game)
```

## Configuration

### Pre-defined Configurations

This package includes common deck setups:

- `STANDARD_DECK` — 52 cards, no jokers
- `DECK_WITH_2_JOKERS` — 53 cards
- `DECK_WITH_4_JOKERS` — 54 cards
- `BLACKJACK_SINGLE_DECK` — 1 deck, no jokers
- `BLACKJACK_DOUBLE_DECK` — 2 decks, no jokers
- `BLACKJACK_SIX_DECK` — 6 decks, no jokers
- `BLACKJACK_EIGHT_DECK` — 8 decks, no jokers
- `BACCARAT_SHOE` — 8 decks, no jokers
- `RUMMY_DECK` — 1 deck, 2 jokers
- `GIN_RUMMY_DECK` — 52 cards, no jokers
- `SOLITAIRE_DECK` — 52 cards, no jokers
- `WAR_DECK` — 52 cards, no jokers
- `GO_FISH_DECK` — 52 cards, no jokers
- `CRAZY_EIGHTS_DECK` — 52 cards, no jokers

### Custom Configuration

```typescript
import { createDeck } from '@games/card-deck-core'

// 3-deck shoe with 2 jokers per deck
const customConfig = {
  deckCount: 3,
  includeJokers: true,
  jokerCount: 2,
}

const deck = createDeck(customConfig)
```

## API Reference

### Types

- `Card` — Single playing card with suit, rank, and unique ID
- `Suit` — 'diamonds' | 'clubs' | 'spades' | 'hearts'
- `Rank` — 'A' | '2'-'10' | 'J' | 'Q' | 'K' | 'joker'
- `Deck` — Complete deck with remaining/dealt/burned cards
- `CardShoe` — Multi-deck shoe with penetration tracking
- `DeckConfig` — Configuration for creating decks
- `DeckStatistics` — Stats (penetration, card counts by rank/suit)

### Deck Operations

**Create & Initialize**

- `createDeck(config)` — Create a new deck
- `shuffleDeck(deck)` — Shuffle in-place (Fisher-Yates)

**Deal & Draw**

- `dealCards(deck, count)` — Deal cards, track as dealt
- `peekCards(deck, count)` — Look at cards without dealing
- `burnCards(deck, count)` — Burn cards (remove from play)

**Reset & Statistics**

- `resetDeck(deck)` — Return all cards to deck (doesn't shuffle)
- `getDeckStatistics(deck)` — Get penetration, card counts

**Search**

- `cardExists(deck, cardId)` — Check if card remains
- `findCard(deck, cardId)` — Find specific card
- `getCardsByRank(deck, rank)` — Get all cards of rank
- `getCardsBySuit(deck, suit)` — Get all cards of suit

### Shoe Operations

**Create & Manage**

- `createShoe(deckConfigs)` — Create multi-deck shoe
- `getCurrentDeck(shoe)` — Get active deck
- `dealFromShoe(shoe, count)` — Deal with auto-advance

**Penetration & Reset**

- `getCurrentDeckPenetration(shoe)` — Get penetration %
- `checkShocePenetration(shoe, threshold)` — Check if exceeded
- `advanceIfPenetrationExceeded(shoe)` — Auto-advance if needed
- `reshuffleCurrentDeck(shoe)` — Reshuffle active deck
- `resetShoe(shoe)` — Reset all decks

**Statistics**

- `getTotalRemainingCards(shoe)` — Total across all decks
- `getShoeStatistics(shoe)` — Full shoe stats

### Card Values

- `getCardValue(card)` — Get CardValue with primary/alternate
- `getCardNumericValue(rank)` — Get value for a rank
- `isSameRank(card1, card2)` — Rank equality
- `isSameSuit(card1, card2)` — Suit equality
- `compareRanks(rank1, rank2)` — Rank comparison (-1, 0, 1)
- `formatCard(card)` — Human-readable format ("5♦", "K♣")
- `getSuitName(suit)` — Suit display name ("♦ Diamonds")
- `getSuitSymbol(suit)` — Suit symbol ("♦", "♣", "♠", "♥")

## Design Principles

### Unique Card Tracking

Every card has a unique ID (`card.id`) that persists throughout the deck's lifetime. This allows:

- Tracking individual cards across burns/deals
- Detecting card duplicates across multiple shoes
- Validating no card appears twice

### Immutable Configuration

`Deck` and `CardShoe` store their config as readonly. Configuration doesn't change after creation—shuffle and deal modify only the state arrays.

### Penetration Tracking

Penetration automatically updates as cards are dealt/burned. Games can:

- Monitor penetration percentage
- Trigger reshuffle at threshold (typically 75%)
- Detect burn-out on last deck

### Numeric Values

Cards support both **primary** and **alternate** values:

- Ace: primary=1, alternate=11
- Face cards: primary=10 (no alternate)
- Numbers: primary=face value (no alternate)
- Joker: primary=0, alternate=undefined

This allows games to handle Ace-high vs Ace-low semantics.

## Examples

### Blackjack

```typescript
import { createShoe, dealFromShoe, getCardValue, BLACKJACK_SIX_DECK } from '@games/card-deck-core'

const shoe = createShoe([BLACKJACK_SIX_DECK])

// Deal player's first 2 cards
const { cards: playerCards } = dealFromShoe(shoe, 2)

// Calculate hand value (simple example)
let value = 0
let hasAce = false
playerCards.forEach((card) => {
  const cv = getCardValue(card)
  value += cv.primaryValue
  if (card.rank === 'A') hasAce = true
})

// Adjust for Ace
if (hasAce && value + 10 <= 21) {
  value += 10 // Use alternate value
}

console.log(`Hand value: ${value}`)
```

### Go Fish (Simple Matching)

```typescript
import {
  createDeck,
  dealCards,
  getCardsByRank,
  isSameRank,
  STANDARD_DECK,
} from '@games/card-deck-core'

const deck = createDeck(STANDARD_DECK)
shuffleDeck(deck)

// Deal 7 cards to player
const { cards: playerHand } = dealCards(deck, 7)

// Find all cards matching a rank
const matchesAce = playerHand.filter((card) => isSameRank(card, { suit: 'hearts', rank: 'A' }))
console.log(`Player has ${matchesAce.length} Aces`)
```

### Rummy (Variable Deck)

```typescript
import { createDeck, RUMMY_DECK } from '@games/card-deck-core'

// Rummy can use 53-card deck (with joker)
const deck = createDeck(RUMMY_DECK)

// Now deck includes 1 red joker + 1 black joker
// Use jokers as wild cards in your rummy logic
```

## Games Using This Package

These games should integrate with `@games/card-deck-core`:

- **Blackjack** — 6/8-deck shoe with hit/stand
- **Baccarat** — 8-deck shoe, track road patterns
- **Rummy/Gin Rummy** — Deal, meld, draw from stock/discard
- **War** — Simplified deal and compare
- **Go Fish** — Deal and match ranks
- **Crazy Eights** — Deal and match rank/suit
- Any future card game on the platform

## Architecture

This package follows **CLEAN Architecture**:

- **domain/** — All logic (no React, no framework)
- **types.ts** — Pure type definitions
- **card-values.ts** — Value calculations, comparisons
- **deck.ts** — Core deck operations
- **shoe.ts** — Multi-deck shoe management
- **constants.ts** — Pre-defined configurations
- **index.ts** — Barrel export (public API)

All functions are pure, testable, and framework-agnostic. Can be used in:

- React games (via hooks in app layer)
- Domain logic tests
- Web Workers
- Electron/Capacitor apps

## Performance Notes

- **Shuffle:** Fisher-Yates, O(n)
- **Deal:** O(count) — shifts from array
- **Penetration:** O(1) — cached value
- **Search:** O(n) — unindexed (OK for 52-416 cards)

For games with 1000+ cards or high-frequency searches, consider indexing by rank/suit.

## Future Enhancements

- Card image/sprite mapping
- Deck building system (for TCG-like games)
- Card effect system (for special cards)
- Probability utilities (odds calculator)
- History logging (for replay/debugging)

---

**Question?** Check the examples above or create an issue on the project repository.
