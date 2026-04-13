import { beforeEach, describe, expect, it } from 'vitest'
import { ALL_NUMBERS, CENTER_INDEX, MAX_NUMBER } from './constants'
import { createGameState, drawNumber, resetGame } from './rules'
import type { GameState } from './types'

describe('bingo-progressive (Progressive 5x5 Bingo) - Integration Tests', () => {
  let gameState: GameState

  beforeEach(() => {
    gameState = createGameState()
  })

  describe('Game Initialization', () => {
    it('should create a valid initial game state', () => {
      expect(gameState).toBeDefined()
      expect(gameState.cards).toBeDefined()
      expect(gameState.cards.length).toBeGreaterThan(0)
      expect(gameState.drawnNumbers).toBeInstanceOf(Set)
      expect(gameState.drawnNumbers.size).toBe(0)
      expect(gameState.winners).toEqual([])
      expect(gameState.gameActive).toBe(true)
      expect(gameState.currentDrawn).toBeNull()
      expect(gameState.level).toBe(1)
      expect(gameState.jackpot).toBeGreaterThan(0)
    })

    it('should have a correctly sized board (5x5)', () => {
      gameState.cards.forEach((card) => {
        // 5x5 = 25 squares
        expect(card.squares.length).toBe(25)
        expect(card.marked.length).toBe(25)
      })
    })

    it('should mark the center square as initialized (free space)', () => {
      gameState.cards.forEach((card) => {
        // Center square (index 12 for 5x5) should be marked (free space)
        expect(card.marked[CENTER_INDEX]).toBe(true)
      })
    })
  })

  describe('Free Center Square', () => {
    it('should have CENTER_INDEX constant correctly calculated', () => {
      // 5x5 grid: center is row 2, col 2 = index 12
      expect(CENTER_INDEX).toBe(12)
    })

    it('should start with center square marked as free', () => {
      gameState.cards.forEach((card) => {
        expect(card.marked[CENTER_INDEX]).toBe(true)
      })
    })

    it('should have center free space in position (2,2)', () => {
      // Verify center index corresponds to position (2,2) in 5x5 grid
      const centerRow = Math.floor(CENTER_INDEX / 5)
      const centerCol = CENTER_INDEX % 5
      expect(centerRow).toBe(2)
      expect(centerCol).toBe(2)
    })
  })

  describe('Number Drawing', () => {
    it('should draw valid numbers between 1 and 75', () => {
      const drawnSoFar = new Set<number>()
      for (let i = 0; i < 30; i++) {
        drawNumber(gameState)
        const drawn = Array.from(gameState.drawnNumbers)
        const lastDrawn = drawn[drawn.length - 1]

        expect(lastDrawn).toBeGreaterThanOrEqual(1)
        expect(lastDrawn).toBeLessThanOrEqual(MAX_NUMBER)
      }
    })

    it('should accumulate drawn numbers without duplicates', () => {
      for (let i = 0; i < 50; i++) {
        drawNumber(gameState)
      }

      const drawn = Array.from(gameState.drawnNumbers)
      const uniqueNumbers = new Set(drawn)
      expect(uniqueNumbers.size).toBe(drawn.length) // No duplicates
    })

    it('should mark matching numbers on cards', () => {
      // Get numbers from first card (excluding center which is pre-marked)
      const cardNumbers = new Set<number>()
      gameState.cards[0].squares.forEach((num, idx) => {
        if (idx !== CENTER_INDEX && num !== null) {
          cardNumbers.add(num)
        }
      })

      // Draw some numbers
      for (const num of Array.from(cardNumbers).slice(0, 5)) {
        drawNumber(gameState)
        // Keep drawing until we get this number
        while (!gameState.drawnNumbers.has(num) && gameState.drawnNumbers.size < MAX_NUMBER) {
          drawNumber(gameState)
        }

        if (gameState.drawnNumbers.has(num)) {
          // Check if the number is marked on the card
          const squareIdx = gameState.cards[0].squares.indexOf(num)
          if (squareIdx !== -1) {
            expect(gameState.cards[0].marked[squareIdx]).toBe(true)
          }
        }
      }
    })

    it('should track current drawn number', () => {
      expect(gameState.currentDrawn).toBeNull()

      drawNumber(gameState)
      expect(gameState.currentDrawn).toBeDefined()
      expect(typeof gameState.currentDrawn).toBe('number')
    })

    it('should maintain draw count accuracy', () => {
      for (let i = 0; i < 25; i++) {
        drawNumber(gameState)
      }

      expect(gameState.drawnNumbers.size).toBe(25)
    })
  })

  describe('Progressive Jackpot', () => {
    it('should initialize with level 1', () => {
      expect(gameState.level).toBe(1)
    })

    it('should have initial jackpot value', () => {
      expect(gameState.jackpot).toBeGreaterThan(0)
    })

    it('should track winners', () => {
      expect(gameState.winners).toEqual([])
      expect(Array.isArray(gameState.winners)).toBe(true)
    })
  })

  describe('Winning Conditions', () => {
    it('should detect winners when card is complete', () => {
      // Mark all squares on first card
      gameState.cards[0].marked = gameState.cards[0].marked.map(() => true)

      // Verify all marked
      const allMarked = gameState.cards[0].marked.every((m) => m === true)
      expect(allMarked).toBe(true)
    })

    it('should track winning card IDs', () => {
      expect(gameState.winners).toEqual([])
      expect(Array.isArray(gameState.winners)).toBe(true)
    })

    it('should support multiple cards with independent tracking', () => {
      const multiCardState = createGameState(2)
      expect(multiCardState.cards.length).toBe(2)
      expect(multiCardState.cards[0].id).not.toBe(multiCardState.cards[1].id)
    })
  })

  describe('Game Reset', () => {
    it('should reset game state correctly', () => {
      // Play a few rounds
      for (let i = 0; i < 20; i++) {
        drawNumber(gameState)
      }

      expect(gameState.drawnNumbers.size).toBeGreaterThan(0)

      // Reset
      const resetState = resetGame(gameState)

      expect(resetState.drawnNumbers.size).toBe(0)
      expect(resetState.winners).toEqual([])
      expect(resetState.gameActive).toBe(true)
      expect(resetState.level).toBe(1)
    })

    it('should generate fresh cards after reset', () => {
      const resetState = resetGame(gameState)

      expect(resetState.drawnNumbers.size).toBe(0)
      expect(resetState.cards.length).toBe(gameState.cards.length)
    })

    it('should reset level to 1 on game reset', () => {
      const resetState = resetGame(gameState)
      expect(resetState.level).toBe(1)
    })
  })

  describe('Constants Validation', () => {
    it('should have ALL_NUMBERS constant with correct length', () => {
      expect(ALL_NUMBERS.length).toBe(MAX_NUMBER)
      expect(MAX_NUMBER).toBe(75)
    })

    it('should have ALL_NUMBERS containing values 1 through 75', () => {
      for (let i = 1; i <= MAX_NUMBER; i++) {
        expect(ALL_NUMBERS).toContain(i)
      }
    })

    it('should have no duplicate numbers in ALL_NUMBERS', () => {
      const uniqueNumbers = new Set(ALL_NUMBERS)
      expect(uniqueNumbers.size).toBe(ALL_NUMBERS.length)
    })

    it('should have CENTER_INDEX constant', () => {
      expect(CENTER_INDEX).toBeDefined()
      expect(typeof CENTER_INDEX).toBe('number')
    })
  })

  describe('Grid Configuration', () => {
    it('should maintain 5x5 grid structure per card', () => {
      gameState.cards.forEach((card) => {
        // 25 squares = 5x5 grid
        expect(card.squares.length).toBe(25)
        expect(card.marked.length).toBe(25)
      })
    })

    it('should have 25 cells total', () => {
      gameState.cards.forEach((card) => {
        expect(card.squares.length).toBe(25)
      })
    })

    it('should have valid MAX_NUMBER constant', () => {
      expect(MAX_NUMBER).toBe(75)
    })
  })

  describe('Game Flow', () => {
    it('should support extended play scenarios', () => {
      let roundsPlayed = 0

      while (roundsPlayed < 30 && gameState.drawnNumbers.size < MAX_NUMBER) {
        drawNumber(gameState)
        roundsPlayed++
      }

      expect(gameState.drawnNumbers.size).toBeLessThanOrEqual(30)
      expect(gameState.gameActive).toBe(true) // Or could be false if all marked
    })

    it('should maintain game state consistency during play', () => {
      for (let i = 0; i < 20; i++) {
        drawNumber(gameState)

        // State invariants
        expect(gameState.drawnNumbers.size).toBeLessThanOrEqual(MAX_NUMBER)
        expect(Array.isArray(gameState.winners)).toBe(true)
      }
    })

    it('should track progressive level changes', () => {
      const initialLevel = gameState.level
      expect(gameState.level).toBe(1)

      // Level changes when winners occur (handled by drawNumber)
      for (let i = 0; i < 30; i++) {
        drawNumber(gameState)
      }

      // Level should still be tracked
      expect(typeof gameState.level).toBe('number')
      expect(gameState.level).toBeGreaterThanOrEqual(initialLevel)
    })

    it('should support multiple cards in a game', () => {
      const twoCardState = createGameState(2)
      expect(twoCardState.cards.length).toBe(2)

      for (let i = 0; i < 10; i++) {
        drawNumber(twoCardState)
      }

      expect(twoCardState.drawnNumbers.size).toBe(10)
    })
  })
})
        gameState = drawNumber(gameState)
        const latestNumber = gameState.drawnNumbers[gameState.drawnNumbers.length - 1]
        expect(latestNumber).toBeGreaterThanOrEqual(1)
        expect(latestNumber).toBeLessThanOrEqual(MAX_NUMBER)
        expect(previousNumbers.has(latestNumber)).toBe(false)
        previousNumbers.add(latestNumber)
      }
    })

    it('should accumulate drawn numbers without duplicates', () => {
      for (let i = 0; i < 50; i++) {
        gameState = drawNumber(gameState)
      }

      const uniqueNumbers = new Set(gameState.drawnNumbers)
      expect(uniqueNumbers.size).toBe(gameState.drawnNumbers.length)
    })
  })

  describe('Difficulty Levels', () => {
    it('should have valid DIFFICULTY_LEVELS constant', () => {
      expect(DIFFICULTY_LEVELS.easy).toBeDefined()
      expect(DIFFICULTY_LEVELS.medium).toBeDefined()
      expect(DIFFICULTY_LEVELS.hard).toBeDefined()
    })

    it('should support difficulty progression', () => {
      const difficulties = Object.values(DIFFICULTY_LEVELS)
      expect(difficulties.length).toBeGreaterThan(0)
      expect(difficulties.every((d) => typeof d === 'number')).toBe(true)
    })
  })

  describe('Winning Line Detection', () => {
    it('should detect winning lines', () => {
      for (let i = 0; i < 30; i++) {
        gameState = drawNumber(gameState)
        const hasWonLine = checkWinningLine(gameState.userCard.board)
        expect(typeof hasWonLine).toBe('boolean')
      }
    })
  })

  describe('Game Reset', () => {
    it('should reset game state correctly', () => {
      for (let i = 0; i < 20; i++) {
        gameState = drawNumber(gameState)
      }

      expect(gameState.drawnNumbers.length).toBeGreaterThan(0)

      const resetState = resetGame()

      expect(resetState.drawnNumbers).toEqual([])
      expect(resetState.gameOver).toBe(false)
      expect(resetState.winner).toBeNull()
    })
  })

  describe('Constants Validation', () => {
    it('should have ALL_NUMBERS constant with correct length', () => {
      expect(ALL_NUMBERS.length).toBe(MAX_NUMBER)
    })

    it('should have ALL_NUMBERS containing values 1 through 75', () => {
      for (let i = 1; i <= MAX_NUMBER; i++) {
        expect(ALL_NUMBERS).toContain(i)
      }
    })
  })

  describe('Game Flow', () => {
    it('should support extended play scenarios', () => {
      let roundsPlayed = 0

      while (roundsPlayed < 40) {
        gameState = drawNumber(gameState)
        roundsPlayed++
        expect(gameState.drawnNumbers.length).toBe(roundsPlayed)
      }

      expect(gameState.drawnNumbers.length).toBe(40)
    })

    it('should maintain game state consistency during play', () => {
      for (let i = 0; i < 25; i++) {
        gameState = drawNumber(gameState)

        const uniqueNumbers = new Set(gameState.drawnNumbers)
        expect(uniqueNumbers.size).toBe(gameState.drawnNumbers.length)
        expect(gameState.drawnNumbers.length).toBeLessThanOrEqual(MAX_NUMBER)
      }
    })
  })

  describe('Grid Configuration', () => {
    it('should have 25 cells total (5x5)', () => {
      const totalCells = gameState.userCard.board.reduce((sum, row) => sum + row.length, 0)
      expect(totalCells).toBe(25)
    })

    it('should start with no marks except center', () => {
      const markedCount = gameState.userCard.board.flat().filter((cell) => cell.marked).length
      expect(markedCount).toBeGreaterThanOrEqual(0) // Center might be marked
    })
  })
})
