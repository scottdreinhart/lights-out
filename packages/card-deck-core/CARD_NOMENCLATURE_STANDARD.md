# Card Nomenclature Standard — Platform-Wide Convention

**Established**: April 5, 2026  
**Scope**: All card deck–based games on the platform  
**Authority**: Card Deck Core Package (`@games/card-deck-core`)  
**Status**: Standard Convention for All Games

---

## Overview

This document defines standardized nomenclature for playing card assets, card backs, and special cards (jokers) across all game applications in the platform.

The standard enables:

- **Consistent asset naming** across 20+ card-based games
- **Predictable file organization** for game assets
- **Reusable card back and joker variants** across different game families
- **Clear reference** in code (game logic, rendering, animation)
- **Multi-variant support** for different visual presentations

---

## Card Asset Naming Convention

### Standard Playing Cards (52-Card Deck)

**Pattern**: `{RANK_CODE}{SUIT_CODE}`

| Component     | Format                                           | Examples            |
| ------------- | ------------------------------------------------ | ------------------- |
| **Rank Code** | Single character or number (2-9, 10, A, J, Q, K) | `2`, `10`, `A`, `K` |
| **Suit Code** | Single character (♥→H, ♦→D, ♣→C, ♠→S)            | `H`, `D`, `C`, `S`  |

**Examples**:

- `2H` = Two of Hearts
- `10D` = Ten of Diamonds
- `AC` = Ace of Clubs
- `KS` = King of Spades
- `QH` = Queen of Hearts

### Card Back Nomenclature

Card backs are NOT indexed to suits or ranks; they represent the back design of the deck when cards are face-down. Two variants are supported:

| Nomenclature | Meaning                        | Typical Use                             |
| ------------ | ------------------------------ | --------------------------------------- |
| **1B**       | Card Back — Black-backed cards | Standard Bicycle/poker-style black back |
| **2B**       | Card Back — Red-backed cards   | Alternative red-backed variant          |

**Purpose**:

- Some card sets have black-backed cards (like standard Bicycle brand)
- Red-backed variants exist for certain publishers
- Games may use different back designs for cosmetic/theming purposes

**In Code**:

```typescript
type CardBackType = '1B' | '2B'

// Usage in game state:
interface GameRenderConfig {
  cardBack: CardBackType  // Which back design to show
}

// Showing card faces when face-down:
const showCardBack = (cardBack: CardBackType) => {
  // Render the card back using the specified design
  return <img src={`/cards/${cardBack}.svg`} alt="Card Back" />
}
```

---

## Joker Nomenclature

Jokers are special cards outside the standard 52-card deck. They are indexed by joker variant (not joker color, which is in the Card type itself).

| Nomenclature | Meaning          | Typical Use                           |
| ------------ | ---------------- | ------------------------------------- |
| **1J**       | Joker variant #1 | First joker design/asset              |
| **2J**       | Joker variant #2 | Second joker design/asset (if needed) |

### Joker Representation in Code

The `Card` type already supports jokers with color variants:

```typescript
interface Card {
  rank: 'joker'
  color?: 'red' | 'black' // Joker color/variant
  suit: null // Jokers have no suit
}

// Example: Red joker, using 1J asset
const redJoker: Card = {
  rank: 'joker',
  color: 'red',
  suit: null,
  id: 'joker-red-1',
}

// Example: Black joker, using 2J asset
const blackJoker: Card = {
  rank: 'joker',
  color: 'black',
  suit: null,
  id: 'joker-black-1',
}
```

**Naming Clarification**:

- **1J / 2J** refer to asset files or design variants (potentially separate artwork)
- **Red / Black** refer to the joker's color (rendering property)
- A single joker asset file (e.g., `1J.svg`) might represent both red and black variants with color theming applied

---

## File Organization by Game Family

### Asset Directory Structure

```
apps/{game-name}/
├── public/
│   └── assets/
│       ├── cards/
│       │   ├── 2H.svg, 2D.svg, 2C.svg, 2S.svg
│       │   ├── 3H.svg, 3D.svg, ... [all 52 standard cards]
│       │   ├── KH.svg, KD.svg, KC.svg, KS.svg
│       │   ├── 1B.svg               [Card back — black]
│       │   ├── 2B.svg               [Card back — red]
│       │   ├── 1J.svg               [Joker variant #1]
│       │   └── 2J.svg               [Joker variant #2 (optional)]
│       └── icons/
│           └── [other assets]
```

### Alternative: Shared Card Asset Package

For maximum reuse, games can import card graphics from `@games/card-assets`:

```typescript
import { getCardAssetUrl, CardBackType, JokerVariant } from '@games/card-assets'

// Get standard card
const cardUrl = getCardAssetUrl('2H') // → /cards/2H.svg

// Get card back
const backUrl = getCardAssetUrl('1B' as CardBackType) // → /cards/1B.svg

// Get joker
const jokerUrl = getCardAssetUrl('1J' as JokerVariant) // → /cards/1J.svg
```

---

## Usage by Game Type

### Blackjack, Poker, Baccarat

- Uses: Standard 52-card deck + card backs (1B or 2B)
- Jokers: NOT used unless specified variant

### Go Fish, Gin Rummy

- Uses: Standard 52-card deck
- Jokers: Typically not used
- Card backs: Required for face-down cards

### Euchre, Pinochle

- Uses: Subset of 52-card deck (e.g., 9–A only)
- Jokers: Sometimes included (variant-dependent)
- Card backs: Required for face-down cards

### Joker-Inclusive Games (e.g., War with Jokers)

- Uses: 52-card deck + 2–4 jokers
- Jokers: 1J and optionally 2J
- Jokers represented in card data with `rank: 'joker'` and `color: 'red' | 'black'`

### Custom Card Sets (Tarot, Mahjong)

- These use specialized card systems and are defined separately
- Outside scope of standard playing card nomenclature

---

## Type Definitions & Exports (from @games/card-deck-core)

```typescript
/**
 * Card back type — selects which back design asset to display
 * 1B = Black-backed cards (standard Bicycle)
 * 2B = Red-backed cards (alternative variant)
 */
export type CardBackType = '1B' | '2B'

/**
 * Joker variant — selects which joker design asset to display
 * 1J = Joker variant #1 (primary joker design)
 * 2J = Joker variant #2 (alternate joker design)
 */
export type JokerVariant = '1J' | '2J'

/**
 * Asset identifier for cards, backs, and jokers
 */
export type CardAssetId = Rank | CardBackType | JokerVariant
```

---

## Code Reference Examples

### Example 1: Rendering a Card Face-Down (Show Back)

```typescript
import { CardBackType } from '@games/card-deck-core'

interface CardDisplayProps {
  face: 'up' | 'down'
  card?: Card
  cardBack?: CardBackType
}

export const CardDisplay: React.FC<CardDisplayProps> = ({
  face,
  card,
  cardBack = '1B'  // Default to black back
}) => {
  if (face === 'down') {
    return <img src={`/cards/${cardBack}.svg`} alt="Card Back" />
  }

  // Face-up card
  return <img src={`/cards/${card.rank}${card.suit[0].toUpperCase()}.svg`} alt={formatCard(card)} />
}
```

### Example 2: Creating Deck with Jokers

```typescript
import { createDeck, DECK_WITH_2_JOKERS } from '@games/card-deck-core'

// This creates a 54-card deck (52 standard + 2 jokers)
// Jokers will have rank='joker', color='red' and color='black'
const deck = createDeck(DECK_WITH_2_JOKERS)

// Rendering a joker uses the joker asset
const jokerAssetId = deck.cards
  .filter((c) => c.rank === 'joker')
  .map((_, idx) => (idx === 0 ? '1J' : '2J'))
```

### Example 3: Theming Card Back for Different Variants

```typescript
import { CardBackType } from '@games/card-deck-core'

type DeckVariant = 'classic' | 'premium'

const getCardBackForVariant = (variant: DeckVariant): CardBackType => {
  switch (variant) {
    case 'classic':
      return '1B' // Black back (standard)
    case 'premium':
      return '2B' // Red back (alternative)
  }
}
```

---

## Migration Guide for Existing Games

### For Games Currently Using Hardcoded Card Names

```typescript
// OLD (avoid):
const cardAsset = `card_${card.suit}_${card.rank}`

// NEW (standard):
const cardAsset = `${card.rank}${getSuitCode(card.suit)}`
// Or use helper:
const cardAsset = formatCardAssetId(card)
```

### For Games With Custom Back Designs

If your game currently uses a custom back system:

```typescript
// OLD:
type BackDesign = 'standard' | 'ornate' | 'minimal'

// NEW (unified):
type CardBackType = '1B' | '2B' // Plus theme/cosmetic differences via CSS
```

If you need more than 2 back variants, consider:

- CSS theming for each back type (color, pattern, styling)
- Dynamic back design selection via game settings
- Or propose extension to `CardBackType` with PR to card-deck-core

---

## Validation & Testing

### Checklist for Card-Based Games

- [ ] All standard card ranks use correct codes (2–9, 10, A, J, Q, K)
- [ ] All suit codes use single-character format (H, D, C, S)
- [ ] Card back assets named `1B.svg` and/or `2B.svg`
- [ ] Joker assets named `1J.svg` and/or `2J.svg` (if game uses jokers)
- [ ] Code imports `CardBackType` and `JokerVariant` types from card-deck-core
- [ ] Card rendering function respects card-back nomenclature
- [ ] Assets organized in standard directory structure (`public/assets/cards/`)
- [ ] Tests verify card asset URLs are correctly formatted

---

## References

- **Card Deck Core**: `@games/card-deck-core` (types, operations, configurations)
- **Card Assets Package**: `@games/card-assets` (shared asset URLs and lookups)
- **Game-Specific Rules**: Each game's rules file documents how cards are used
- **Blackjack Rules**: [BLACKJACK_RULES_INGESTED.md](../../apps/blackjack/BLACKJACK_RULES_INGESTED.md)

---

## Questions & Clarifications

**Q: Why not use suit names (e.g., "Heart", "Club") instead of codes?**  
A: Single-character codes are industry-standard (poker, bridge, bridge, contract bridge). They're shorter, consistent, and match common deck notations.

**Q: Can we add more card backs (3B, 4B, etc.)?**  
A: Yes, but requires coordination. Submit a PR to `card-deck-core` to extend `CardBackType`. Current standard is 2 variants to balance reusability with simplicity.

**Q: What if my game doesn't use jokers?**  
A: Jokers are optional. Don't include 1J/2J assets if not needed. Most trick-taking and rummy games don't use jokers.

**Q: How do I support both styles of card back in the same game?**  
A: Store `cardBack: CardBackType` in game state or user preferences. Render accordingly at display time.

---

**Last Updated**: April 5, 2026  
**Next Review**: Q3 2026 (or when significant games added)
