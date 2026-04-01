/**
 * Card Deck Core - Example Usage & Test Cases
 * Demonstrates all major features of the card deck system
 */

import {
  // Types
  type Card,
  type Deck,
  type CardShoe,

  // Deck operations
  createDeck,
  shuffleDeck,
  dealCards,
  peekCards,
  burnCards,
  resetDeck,
  getDeckStatistics,
  getCardsByRank,
  getCardsBySuit,

  // Shoe operations
  createShoe,
  getCurrentDeck,
  dealFromShoe,
  burnFromShoe,
  getCurrentDeckPenetration,
  reshuffleCurrentDeck,
  getShoeStatistics,

  // Card values
  getCardValue,
  formatCard,
  isSameRank,
  isSameSuit,
  compareRanks,

  // Configurations
  STANDARD_DECK,
  DECK_WITH_2_JOKERS,
  BLACKJACK_SIX_DECK,
} from './index'

// ============================================================================
// EXAMPLE 1: Basic Deck Operations
// ============================================================================

console.log('=== EXAMPLE 1: Basic Deck Operations ===\n')

// Create a standard 52-card deck
const basicDeck = createDeck(STANDARD_DECK)
console.log(`Created deck with ${basicDeck.totalCards} cards`)
console.log(`Remaining: ${basicDeck.remainingCards.length}`)
console.log(`Dealt: ${basicDeck.dealtCards.length}\n`)

// Shuffle the deck
shuffleDeck(basicDeck)
console.log('Shuffled deck')

// Deal 5 cards and show them
const dealResult = dealCards(basicDeck, 5)
console.log(`\nDealt ${dealResult.cards.length} cards:`)
dealResult.cards.forEach((card) => {
  console.log(`  ${formatCard(card)}`)
})
console.log(`Remaining cards: ${dealResult.remaining}`)

// Peek at next 3 cards without dealing
const peeked = peekCards(basicDeck, 3)
console.log(`\nPeeked at next ${peeked.length} cards:`)
peeked.forEach((card) => {
  console.log(`  ${formatCard(card)}`)
})

// ============================================================================
// EXAMPLE 2: Card Values & Comparisons
// ============================================================================

console.log('\n=== EXAMPLE 2: Card Values & Comparisons ===\n')

const testCards: Card[] = [
  { suit: 'hearts', rank: 'A', id: 'hearts_A_0_0' },
  { suit: 'diamonds', rank: '5', id: 'diamonds_5_0_1' },
  { suit: 'clubs', rank: 'K', id: 'clubs_K_0_2' },
  { suit: 'spades', rank: 'J', id: 'spades_J_0_3' },
  { rank: 'joker', suit: null, id: 'joker_red_0_52', color: 'red' },
]

testCards.forEach((card) => {
  const value = getCardValue(card)
  console.log(
    `${formatCard(card).padEnd(15)} →` +
      `  Primary: ${value.primaryValue}` +
      (value.alternateValue !== undefined ? `, Alternate: ${value.alternateValue}` : '') +
      `  [Face: ${value.isFaceCard}, Joker: ${value.isJoker}]`,
  )
})

// Compare ranks
console.log('\nRank Comparisons:')
console.log(`  Ace vs King: ${compareRanks('A', 'K')} (1 = Ace higher)`)
console.log(`  Ace vs King (Ace-low): ${compareRanks('A', 'K', true)} (-1 = King higher)`)
console.log(`  5 vs 5: ${compareRanks('5', '5')} (0 = equal)`)

// ============================================================================
// EXAMPLE 3: Deck with Jokers
// ============================================================================

console.log('\n=== EXAMPLE 3: Deck with Jokers ===\n')

const deckWithJokers = createDeck(DECK_WITH_2_JOKERS)
console.log(`Created deck with ${deckWithJokers.totalCards} cards (includes jokers)`)

shuffleDeck(deckWithJokers)
const { cards: first10 } = dealCards(deckWithJokers, 10)

console.log('First 10 cards dealt:')
first10.forEach((card) => {
  console.log(`  ${formatCard(card)}`)
})

// ============================================================================
// EXAMPLE 4: Queries (Get cards by rank/suit)
// ============================================================================

console.log('\n=== EXAMPLE 4: Finding Specific Cards ===\n')

const queryDeck = createDeck(STANDARD_DECK)
const hearts = getCardsBySuit(queryDeck, 'hearts')
console.log(`Total hearts in full deck: ${hearts.length}`)

const aces = getCardsByRank(queryDeck, 'A')
console.log(`Total aces in full deck: ${aces.length}`)

const tens = getCardsByRank(queryDeck, '10')
console.log(`Total 10s in full deck: ${tens.length}`)

// ============================================================================
// EXAMPLE 5: Deck Statistics & Penetration
// ============================================================================

console.log('\n=== EXAMPLE 5: Deck Statistics ===\n')

const statsDeck = createDeck(STANDARD_DECK)
shuffleDeck(statsDeck)

// Deal 13 cards (1/4 of deck)
dealCards(statsDeck, 13)

const stats = getDeckStatistics(statsDeck)
console.log(`Total cards: ${stats.totalCards}`)
console.log(`Cards dealt: ${stats.cardsDealt}`)
console.log(`Cards remaining: ${stats.cardsRemaining}`)
console.log(`Penetration: ${stats.penetrationPercent}%`)
console.log(`\nCards remaining by rank:`)
Object.entries(stats.cardsByRank).forEach(([rank, count]) => {
  if (count > 0) {
    console.log(`  ${rank}: ${count}`)
  }
})

// ============================================================================
// EXAMPLE 6: Reset & Reuse
// ============================================================================

console.log('\n=== EXAMPLE 6: Reset & Reuse ===\n')

const resetableDeck = createDeck(STANDARD_DECK)
shuffleDeck(resetableDeck)
dealCards(resetableDeck, 20)

console.log(`Before reset: ${resetableDeck.remainingCards.length} remaining`)
resetDeck(resetableDeck)
console.log(`After reset: ${resetableDeck.remainingCards.length} remaining`)
// Note: Reset returns cards but doesn't reshuffle

// ============================================================================
// EXAMPLE 7: Multi-Deck Shoe (Blackjack)
// ============================================================================

console.log('\n=== EXAMPLE 7: Multi-Deck Shoe ===\n')

const shoe = createShoe([BLACKJACK_SIX_DECK])
console.log(`Created shoe with 6 decks`)
console.log(`Total cards: ${shoe.decks.reduce((sum, d) => sum + d.totalCards, 0)}`)

// Deal some cards
dealFromShoe(shoe, 4) // Dealer + Player initial cards
console.log(`\nAfter dealing 4 cards: ${getCurrentDeckPenetration(shoe) * 100}% penetration`)

// Deal more cards to reach higher penetration
for (let i = 0; i < 5; i++) {
  dealFromShoe(shoe, 52) // Deal nearly a full deck worth
}

console.log(`After dealing more: ${(getCurrentDeckPenetration(shoe) * 100).toFixed(2)}% penetration`)

// Get full shoe stats
const shoeStats = getShoeStatistics(shoe)
console.log(`\nShoe Statistics:`)
console.log(`  Current deck: ${shoeStats.currentDeckIndex}`)
console.log(`  Total cards dealt across shoe: ${shoeStats.totalCardsDealt}`)
console.log(`  Total remaining: ${shoeStats.totalRemainingCards}`)
console.log(`  Shoe state: ${shoeStats.shoeState}`)

// ============================================================================
// EXAMPLE 8: Burn Cards (Common in shoe games)
// ============================================================================

console.log('\n=== EXAMPLE 8: Burning Cards ===\n')

const burnDeck = createDeck(STANDARD_DECK)
shuffleDeck(burnDeck)

console.log(`Before burn: ${burnDeck.remainingCards.length} remaining`)

const burned = burnCards(burnDeck, 3)
console.log(`\nBurned ${burned.length} cards:`)
burned.forEach((card) => {
  console.log(`  ${formatCard(card)}`)
})

const stats2 = getDeckStatistics(burnDeck)
console.log(`\nAfter burn:`)
console.log(`  Remaining: ${stats2.cardsRemaining}`)
console.log(`  Burned: ${stats2.burnedCards}`)
console.log(`  Dealt: ${stats2.cardsDealt}`)

// ============================================================================
// EXAMPLE 9: Suit & Rank Matching (For matching games)
// ============================================================================

console.log('\n=== EXAMPLE 9: Card Matching ===\n')

const card1: Card = { suit: 'hearts', rank: '5', id: 'hearts_5_0_0' }
const card2: Card = { suit: 'hearts', rank: '7', id: 'hearts_7_0_1' }
const card3: Card = { suit: 'spades', rank: '5', id: 'spades_5_0_2' }

console.log(`${formatCard(card1)} and ${formatCard(card2)}:`)
console.log(`  Same suit? ${isSameSuit(card1, card2)} (both hearts)`)
console.log(`  Same rank? ${isSameRank(card1, card2)} (5 vs 7)`)

console.log(`\n${formatCard(card1)} and ${formatCard(card3)}:`)
console.log(`  Same suit? ${isSameSuit(card1, card3)} (hearts vs spades)`)
console.log(`  Same rank? ${isSameRank(card1, card3)} (both 5s)`)

// ============================================================================
// SUMMARY
// ============================================================================

console.log('\n=== SUMMARY ===\n')
console.log('Card Deck Core provides:')
console.log('  ✓ Single-deck management with shuffle, deal, burn, peek')
console.log('  ✓ Multi-deck shoe support with penetration tracking')
console.log('  ✓ Card value system with primary/alternate values')
console.log('  ✓ Rank comparison and suit matching')
console.log('  ✓ Joker support (53/54 card decks)')
console.log('  ✓ Pre-configured deck types for common games')
console.log('  ✓ Unique card tracking across entire shoe')
console.log('\nReady to use in any card game on the platform!')
