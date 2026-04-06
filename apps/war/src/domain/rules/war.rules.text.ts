/**
 * War card game rules text.
 * Derived from authoritative sources: Pagat.com, Bicycle Cards, Wikipedia
 */

export const RULES_TEXT = {
  CLASSIC: `
# Classic War

## Setup
- Deal card game with 2 players
- Standard 52-card deck
- Shuffle and deal 26 cards to each player
- Players keep their cards in a face-down pile

## Turn
1. Both players simultaneously reveal their top card
2. Higher card rank wins both cards
3. Winner places all cards at the bottom of their pile
4. Card rankings (high to low): A, K, Q, J, 10, 9, 8, 7, 6, 5, 4, 3, 2
5. Suits are ignored

## War
When both players reveal cards of equal rank:
1. Each player place 3 cards face-down on the table
2. Each player then reveals 1 face-up card
3. Higher face-up card wins all 10 cards
4. If face-up cards tie again, repeat the war process

## Winning
The object is to win all 52 cards.
Continue playing until one player has all cards.

## Variations
- Allow recursive wars (keep warring until face-up cards differ)
- Different number of face-down cards (1, 3, or rank-based)
- Multiple players (all participate in war)
  `.trim(),

  QUICK_WAR: `
# Quick War

## Setup
Same as Classic War, but simplified war mechanic.

## Turn
Same as Classic War.

## War
When both players reveal cards of equal rank:
1. Each player places 1 card face-down
2. Each player reveals 1 face-up card
3. Higher card wins all 4 cards
4. If tied again, repeat

This variant plays faster than Classic War.
  `.trim(),

  SIMPLE: `
# Simple War

## Setup
Standard 52-card deck, 26 cards to each player.

## Turn
1. Turn up top card
2. Player with higher card wins both
3. Loser's card goes to bottom of winner's pile

## War
Classic war format: 3 face-down, then face-up comparison.

## Differences from Classic
- Single deck (no reshuffle when pile runs out)
- Game ends when one player exhausts their deck
  `.trim(),

  EXTENDED_WAR: `
# Extended War

## Setup
Same as Classic War.

## War
Rank-based face-down cards:
- 2 through 9: that many face-down cards
- 10, J, Q, K: 10 face-down cards
- Ace: 14 face-down cards (or all remaining if fewer)

Creates exciting turns where high face-up card = many cards at stake.

## Recursive Wars
Allows unlimited recursive wars until face-up cards differ.

Higher-skilled war variant with more dramatic swings.
  `.trim(),

  MULTI_PLAYER: `
# Three+ Player War

## Setup
- 3 players: 51-card deck (remove one suit), 17 cards each
- 4 players: Standard 52-card deck, 13 cards each

## Turn
All players simultaneously reveal top card.
Highest card wins all revealed cards.

## War
If multiple players tie for highest:
- All tied players participate in war
- Each places face-down cards
- Reveals new card
- Highest wins all cards

Winner is first to collect all cards.

Dramatically different from 2-player game.
  `.trim(),
} as const

/**
 * Get rules text for a given variant
 */
export function getRulesText(variant: keyof typeof RULES_TEXT): string {
  return RULES_TEXT[variant] ?? RULES_TEXT.CLASSIC
}

/**
 * All available rule variants with descriptions
 */
export const RULE_DESCRIPTIONS = {
  CLASSIC: {
    title: 'Classic War',
    description: 'Standard 2-player War with 3-card face-down war sequences',
    difficulty: 'medium' as const,
  },
  QUICK_WAR: {
    title: 'Quick War',
    description: 'Faster variant with single face-down card during wars',
    difficulty: 'easy' as const,
  },
  SIMPLE: {
    title: 'Simple War',
    description: 'Single deck with no reshuffle - game ends when deck exhausted',
    difficulty: 'medium' as const,
  },
  EXTENDED_WAR: {
    title: 'Extended War',
    description: 'High-stakes variant where card rank determines face-down count',
    difficulty: 'hard' as const,
  },
  MULTI_PLAYER: {
    title: 'Multi-Player War',
    description: '3 or 4 player variant with simultaneous card reveals',
    difficulty: 'hard' as const,
  },
} as const
