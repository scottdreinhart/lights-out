// Bingo card generation and validation logic

import type { BingoCard, BingoNumber, BingoVariantConfig, CardGenerationOptions } from './types.js'

const getWebCrypto = (): Crypto => {
  if (
    typeof globalThis !== 'undefined' &&
    typeof globalThis.crypto?.getRandomValues === 'function'
  ) {
    return globalThis.crypto
  }

  throw new Error('Web Crypto API is unavailable')
}

const secureRandomInt = (maxExclusive: number): number => {
  const upperBound = Math.floor(maxExclusive)
  if (upperBound <= 0) {
    return 0
  }

  const crypto = getWebCrypto()
  const values = new Uint32Array(1)
  const limit = Math.floor(0x100000000 / upperBound) * upperBound

  let value = 0
  do {
    crypto.getRandomValues(values)
    value = values[0]
  } while (value >= limit)

  return value % upperBound
}

const secureShuffle = <T>(values: readonly T[]): T[] => {
  const shuffled = [...values]

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = secureRandomInt(index + 1)
    ;[shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]]
  }

  return shuffled
}

const mixSeed = (value: number, seed: number): number => {
  let mixed = (value + seed) >>> 0
  mixed ^= mixed >>> 16
  mixed = Math.imul(mixed, 0x7feb352d)
  mixed ^= mixed >>> 15
  mixed = Math.imul(mixed, 0x846ca68b)
  mixed ^= mixed >>> 16
  return mixed >>> 0
}

const orderWithSeed = <T>(array: T[], seed: number): T[] =>
  array
    .map((value, index) => ({ value, sortKey: mixSeed(index, seed) }))
    .sort((left, right) => left.sortKey - right.sortKey)
    .map(({ value }) => value)

// Generate a bingo card for the given variant
export function generateBingoCard(options: CardGenerationOptions): BingoCard {
  const { variant, seed } = options

  const { rows, cols } = variant.cardSize
  const { min, max } = variant.numberRange

  // Create empty card
  const card: BingoCard = Array(rows)
    .fill(null)
    .map(() => Array(cols).fill(0))

  // Generate unique numbers for the card
  const availableNumbers = generateAvailableNumbers(min, max)
  const selectedNumbers = (
    seed === undefined ? secureShuffle(availableNumbers) : orderWithSeed(availableNumbers, seed)
  ).slice(0, rows * cols)

  // Fill the card
  let numberIndex = 0
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      // Skip free space if defined
      if (variant.freeSpace && variant.freeSpace.row === row && variant.freeSpace.col === col) {
        card[row][col] = 0 // 0 represents free space
      } else {
        card[row][col] = selectedNumbers[numberIndex++]
      }
    }
  }

  return card
}

// Generate array of available numbers for a variant
function generateAvailableNumbers(min: number, max: number): BingoNumber[] {
  const numbers: BingoNumber[] = []
  for (let i = min; i <= max; i++) {
    numbers.push(i)
  }
  return numbers
}

// Validate that a card follows variant rules
export function validateBingoCard(card: BingoCard, variant: BingoVariantConfig): boolean {
  const { rows, cols } = variant.cardSize
  const { min, max } = variant.numberRange

  // Check dimensions
  if (card.length !== rows) {
    return false
  }
  if (card.some((row) => row.length !== cols)) {
    return false
  }

  // Collect all numbers (excluding free spaces)
  const numbers: BingoNumber[] = []
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const num = card[row][col]
      if (num !== 0) {
        // 0 is free space
        // Check range
        if (num < min || num > max) {
          return false
        }
        numbers.push(num)
      }
    }
  }

  // Check for duplicates
  const uniqueNumbers = new Set(numbers)
  if (uniqueNumbers.size !== numbers.length) {
    return false
  }

  // Check free space position
  if (variant.freeSpace) {
    const { row, col } = variant.freeSpace
    if (row < 0 || row >= rows || col < 0 || col >= cols) {
      return false
    }
    if (card[row][col] !== 0) {
      return false
    }
  }

  return true
}

// Create multiple unique cards for a game
export function generateBingoCards(count: number, options: CardGenerationOptions): BingoCard[] {
  const cards: BingoCard[] = []
  const usedSeeds = new Set<number>()

  for (let i = 0; i < count; i++) {
    let seed: number
    do {
      seed = secureRandomInt(1000000)
    } while (usedSeeds.has(seed))

    usedSeeds.add(seed)
    const card = generateBingoCard({ ...options, seed })
    cards.push(card)
  }

  return cards
}

// Utility to format card for display
export function formatBingoCard(card: BingoCard): string {
  return card
    .map((row) =>
      row.map((num) => (num === 0 ? 'FREE' : num.toString().padStart(2, ' '))).join(' | '),
    )
    .join('\n' + '-'.repeat(card[0].length * 6 - 1) + '\n')
}

// Check if two cards are identical
export function areCardsEqual(card1: BingoCard, card2: BingoCard): boolean {
  if (card1.length !== card2.length) {
    return false
  }
  if (card1[0].length !== card2[0].length) {
    return false
  }

  for (let row = 0; row < card1.length; row++) {
    for (let col = 0; col < card1[0].length; col++) {
      if (card1[row][col] !== card2[row][col]) {
        return false
      }
    }
  }

  return true
}

// Get all numbers on a card (excluding free spaces)
export function getCardNumbers(card: BingoCard): BingoNumber[] {
  const numbers: BingoNumber[] = []
  for (const row of card) {
    for (const num of row) {
      if (num !== 0) {
        numbers.push(num)
      }
    }
  }
  return numbers.sort((a, b) => a - b)
}
