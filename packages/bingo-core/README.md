# @games/bingo-core

Shared bingo game logic and components for the game platform. This package provides reusable abstractions for implementing various bingo game variants while minimizing code duplication.

## Features

- 🎯 **Multiple Bingo Variants**: Support for 75-ball, 90-ball, 80-ball, mini bingo, and pattern bingo
- 🎲 **Card Generation**: Reproducible card generation with seeded random numbers
- ✅ **Pattern Checking**: Comprehensive winning pattern validation (lines, shapes, blackout)
- 🎮 **Game Rules**: Configurable rules engine for different bingo styles
- 🔧 **TypeScript**: Full type safety with comprehensive interfaces
- 📦 **Modular**: Easy to extend with new variants and patterns

## Installation

This package is part of the monorepo and should be installed via the workspace:

```bash
pnpm install
```

## Usage

### Basic Setup

```typescript
import {
  getBingoVariant,
  generateBingoCard,
  createBingoRules,
  type BingoGameState,
} from '@games/bingo-core'

// Get a variant configuration
const variant = getBingoVariant('75-ball')

// Generate a bingo card
const card = generateBingoCard({ variant })

// Create rules for the variant
const rules = createBingoRules(variant)

// Initialize game state
const gameState: BingoGameState = {
  card,
  drawnNumbers: new Set(),
  isComplete: false,
}
```

### Available Variants

| Variant        | Key            | Card Size | Numbers | Free Space | Patterns            |
| -------------- | -------------- | --------- | ------- | ---------- | ------------------- |
| 75-Ball Bingo  | `75-ball`      | 5x5       | 1-75    | Center     | Lines, full house   |
| 90-Ball Bingo  | `90-ball`      | 3x9       | 1-90    | None       | Lines, full house   |
| 80-Ball Bingo  | `80-ball`      | 4x4       | 1-80    | None       | Lines, diagonals    |
| Mini Bingo     | `mini`         | 3x3       | 1-25    | None       | All patterns        |
| Pattern Bingo  | `pattern`      | 5x5       | 1-75    | Center     | X, T, L, U, H, etc. |
| Speed Bingo    | `speed`        | 5x5       | 1-75    | Center     | Lines only          |
| Blackout Bingo | `blackout`     | 5x5       | 1-75    | Center     | Full blackout       |
| Four Corners   | `four-corners` | 5x5       | 1-75    | Center     | Four corners        |
| X Bingo        | `x-bingo`      | 5x5       | 1-75    | Center     | X pattern           |
| T Bingo        | `t-bingo`      | 5x5       | 1-75    | Center     | T pattern           |
| U Bingo        | `u-bingo`      | 5x5       | 1-75    | Center     | U pattern           |
| L Bingo        | `l-bingo`      | 5x5       | 1-75    | Center     | L pattern           |
| H Bingo        | `h-bingo`      | 5x5       | 1-75    | Center     | H pattern           |
| Center Cross   | `center-cross` | 5x5       | 1-75    | Center     | Center + diagonals  |
| Inner Square   | `inner-square` | 5x5       | 1-75    | Center     | Inner 3x3           |
| Outer Frame    | `outer-frame`  | 5x5       | 1-75    | Center     | Outer border        |

### Winning Patterns

The package supports comprehensive winning patterns:

- **Lines**: Horizontal, vertical, diagonal
- **Shapes**: X, T, L, U, H patterns
- **Special**: Four corners, center cross, inner square, outer frame
- **Complete**: Full house (all numbers), blackout

### Card Generation

```typescript
import { generateBingoCard, generateBingoCards } from '@games/bingo-core'

// Single card
const card = generateBingoCard({
  variant: getBingoVariant('75-ball'),
  seed: 12345, // Optional: for reproducible cards
})

// Multiple unique cards
const cards = generateBingoCards(10, {
  variant: getBingoVariant('90-ball'),
})
```

### Rules and Validation

```typescript
import { createBingoRules } from '@games/bingo-core'

const rules = createBingoRules(variant)

// Check if a move is valid
const isValid = rules.isValidMove(gameState, 42)

// Check for a win
const hasWon = rules.checkWin(gameState)

// Get available winning patterns
const patterns = rules.getAvailablePatterns(gameState)

// Calculate score
const score = rules.calculateScore(gameState)
```

### Custom Variants

Create your own bingo variants:

```typescript
import type { BingoVariantConfig } from '@games/bingo-core'

const customVariant: BingoVariantConfig = {
  name: 'Custom Bingo',
  description: 'My custom bingo rules',
  cardSize: { rows: 4, cols: 4 },
  numberRange: { min: 1, max: 50 },
  freeSpace: { row: 1, col: 1 },
  patterns: ['line-horizontal', 'line-vertical'],
  rules: ['Custom rules here', '4x4 grid', 'Numbers 1-50'],
}
```

## API Reference

### Types

- `BingoNumber`: Number type for bingo numbers
- `BingoCard`: 2D array representing a bingo card
- `BingoPattern`: Union type of all supported patterns
- `BingoVariantConfig`: Configuration for a bingo variant
- `BingoGameState`: Current state of a bingo game
- `BingoRules`: Interface for game rule implementations

### Functions

#### Card Generation

- `generateBingoCard(options)`: Generate a single bingo card
- `generateBingoCards(count, options)`: Generate multiple unique cards
- `validateBingoCard(card, variant)`: Validate a card against variant rules
- `formatBingoCard(card)`: Format card for console display

#### Rules

- `createBingoRules(variant)`: Create rules instance for a variant

#### Variants

- `getBingoVariant(key)`: Get variant configuration by key
- `getBingoVariantKeys()`: Get all available variant keys
- `getAllBingoVariants()`: Get all variant configurations

## Development

### Building

```bash
pnpm build
```

### Testing

```bash
pnpm test
```

### Linting

```bash
pnpm lint
pnpm lint:fix
```

## Contributing

When adding new variants:

1. Add the variant configuration to `variants.ts`
2. Update the `BINGO_VARIANTS` registry
3. Add appropriate winning patterns if needed
4. Update this README with the new variant

When adding new patterns:

1. Add the pattern to the `BingoPattern` type
2. Implement pattern checking in `StandardBingoRules`
3. Update variant configurations that use the pattern

## Implementation Status

All Bingo variants are now available as standalone game apps:

| Variant                                           | App Path                  | Type          | Grid | Balls | Status                    |
| ------------------------------------------------- | ------------------------- | ------------- | ---- | ----- | ------------------------- |
| [bingo](../../apps/bingo)                         | `apps/bingo/`             | Standard      | 5×5  | 75    | ✅ Original               |
| [bingo-30](../../apps/bingo-30)                   | `apps/bingo-30/`          | Mini          | 3×3  | 30    | ✅ NEW - Quick Games      |
| [bingo-80](../../apps/bingo-80)                   | `apps/bingo-80/`          | Swedish       | 4×4  | 80    | ✅ NEW - European         |
| [bingo-90](../../apps/bingo-90)                   | `apps/bingo-90/`          | British       | 3×9  | 90    | ✅ Existing               |
| [bingo-pattern](../../apps/bingo-pattern)         | `apps/bingo-pattern/`     | Pattern-Based | 5×5  | 75    | ✅ NEW - Special Patterns |
| [bingo-progressive](../../apps/bingo-progressive) | `apps/bingo-progressive/` | Progressive   | 5×5  | 75    | ✅ NEW - Jackpot System   |

### File Locations

```
apps/
├── bingo/                          ← Original 75-ball standard
├── bingo-30/                       ← Mini 3x3 quick games
├── bingo-80/                       ← Swedish 80-ball format
├── bingo-90/                       ← British 90-ball variant
├── bingo-pattern/                  ← Pattern-based winning (X, T, L, etc)
└── bingo-progressive/              ← Progressive jackpot system
```

### Variant Features

**bingo** (Standard 75-Ball)

- Classic 5×5 grid with free center space
- 75 numbered balls (1-75)
- Winning patterns: lines and full house

**bingo-30** (Mini 3×3)

- Quick play format
- 3×3 grid with 30 numbered balls (1-30)
- Perfect for fast, casual games

**bingo-80** (Swedish 80-Ball)

- European format with 4×4 grid
- 80 numbered balls (1-80)
- Commonly used in Scandinavia

**bingo-90** (British 90-Ball)

- Traditional UK format with 3×9 grid
- 90 numbered balls (1-90)
- Multiple winning patterns (one line, two lines, full house)

**bingo-pattern** (Pattern-Based)

- 5×5 grid with pattern-based winning conditions
- Special patterns: X, T, L, U, H shapes, corners, etc.
- Adds strategic depth to classic bingo
- Same 75 balls as standard game

**bingo-progressive** (Progressive Jackpot)

- Escalating jackpot system
- Gets larger as game progresses
- Encourages extended play sessions
- 5×5 grid with 75 balls

## License

Part of the game platform monorepo.
