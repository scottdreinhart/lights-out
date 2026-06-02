import { beforeEach, describe, expect, it } from 'vitest'
import { getWinningPatterns } from './card'
import { ALL_NUMBERS, BINGO_COLUMNS, MAX_NUMBER } from './constants'
import { createGameState, drawNumber, resetGame } from './rules'

describe('bingo-pattern (Pattern-Based 5x5 Bingo) - Integration Tests', () => {
  let gameState: ReturnType<typeof createGameState>

  beforeEach(() => {
    gameState = createGameState()
  })

  describe('Game Initialization', () => {
    it('should create a valid initial game state', () => {
      expect(gameState).toBeDefined()
      expect(gameState.drawnNumbers).toBeInstanceOf(Set)
      expect(gameState.drawnNumbers.size).toBe(0)
      expect(gameState.gameActive).toBe(true)
      expect(gameState.winners).toEqual([])
    })

    it('should have a correctly sized board (5x5)', () => {
      expect(gameState.card.length).toBe(5)
      gameState.card.forEach((row) => {
        expect(row.length).toBe(5)
      })
    })
  })

  describe('BINGO Column Distribution', () => {
    it('should distribute numbers according to BINGO column ranges', () => {
      const card = gameState.card
      const columns = [
        card.map((row) => row[0]), // B
        card.map((row) => row[1]), // I
        card.map((row) => row[2]), // N
        card.map((row) => row[3]), // G
        card.map((row) => row[4]), // O
      ]

      // Check B column (1-15)
      columns[0].forEach((cell) => {
        if (cell.number !== 0) {
          expect(cell.number).toBeGreaterThanOrEqual(BINGO_COLUMNS.B.min)
          expect(cell.number).toBeLessThanOrEqual(BINGO_COLUMNS.B.max)
        }
      })

      // Check I column (16-30)
      columns[1].forEach((cell) => {
        if (cell.number !== 0) {
          expect(cell.number).toBeGreaterThanOrEqual(BINGO_COLUMNS.I.min)
          expect(cell.number).toBeLessThanOrEqual(BINGO_COLUMNS.I.max)
        }
      })

      // Check N column (31-45)
      columns[2].forEach((cell) => {
        if (cell.number !== 0) {
          expect(cell.number).toBeGreaterThanOrEqual(BINGO_COLUMNS.N.min)
          expect(cell.number).toBeLessThanOrEqual(BINGO_COLUMNS.N.max)
        }
      })

      // Check G column (46-60)
      columns[3].forEach((cell) => {
        if (cell.number !== 0) {
          expect(cell.number).toBeGreaterThanOrEqual(BINGO_COLUMNS.G.min)
          expect(cell.number).toBeLessThanOrEqual(BINGO_COLUMNS.G.max)
        }
      })

      // Check O column (61-75)
      columns[4].forEach((cell) => {
        if (cell.number !== 0) {
          expect(cell.number).toBeGreaterThanOrEqual(BINGO_COLUMNS.O.min)
          expect(cell.number).toBeLessThanOrEqual(BINGO_COLUMNS.O.max)
        }
      })
    })

    it('should have valid BINGO_COLUMNS constant', () => {
      expect(BINGO_COLUMNS).toBeDefined()
      expect(BINGO_COLUMNS.B).toBeDefined()
      expect(BINGO_COLUMNS.I).toBeDefined()
      expect(BINGO_COLUMNS.N).toBeDefined()
      expect(BINGO_COLUMNS.G).toBeDefined()
      expect(BINGO_COLUMNS.O).toBeDefined()
    })
  })

  describe('Number Drawing', () => {
    it('should draw valid numbers between 1 and 75', () => {
      for (let i = 0; i < 5; i++) {
        gameState = drawNumber(gameState)
        const drawnArray = Array.from(gameState.drawnNumbers)
        const lastDrawn = drawnArray[drawnArray.length - 1]

        expect(lastDrawn).toBeGreaterThanOrEqual(1)
        expect(lastDrawn).toBeLessThanOrEqual(MAX_NUMBER)
      }
    })

    it('should accumulate drawn numbers without duplicates', () => {
      const previousNumbers = new Set<number>()

      for (let i = 0; i < 10; i++) {
        gameState = drawNumber(gameState)
        const current = Array.from(gameState.drawnNumbers)
        const lastDrawn = current[current.length - 1]

        expect(previousNumbers.has(lastDrawn)).toBe(false)
        previousNumbers.add(lastDrawn)
      }
    })

    it('should mark matching numbers on the card', () => {
      // Initial state: only center (FREE) should be marked
      let initialMarked = 0
      gameState.card.forEach((row) => {
        row.forEach((cell) => {
          if (cell.marked) {
            initialMarked++
          }
        })
      })
      expect(initialMarked).toBe(1) // Only center is marked initially

      // Draw a number
      gameState = drawNumber(gameState)
      const drawnNum = Array.from(gameState.drawnNumbers)[0]

      // Check if the drawn number exists on the card
      let numberExistsOnCard = false
      gameState.card.forEach((row) => {
        row.forEach((cell) => {
          if (cell.number === drawnNum) {
            numberExistsOnCard = true
          }
        })
      })

      // Count marked cells after draw
      let markedAfter = 0
      gameState.card.forEach((row) => {
        row.forEach((cell) => {
          if (cell.marked) {
            markedAfter++
          }
        })
      })

      // If number exists on card, it should be marked
      // At minimum, center (FREE) should still be marked
      if (numberExistsOnCard) {
        expect(markedAfter).toBeGreaterThan(initialMarked)
      } else {
        expect(markedAfter).toBe(initialMarked) // Only center still marked
      }
    })
  })

  describe('Pattern Detection', () => {
    it('should check for winning patterns', () => {
      const patterns = getWinningPatterns(gameState.card)
      expect(Array.isArray(patterns)).toBe(true)
    })
  })

  describe('Game Reset', () => {
    it('should reset game state correctly', () => {
      // Play a few moves
      for (let i = 0; i < 3; i++) {
        gameState = drawNumber(gameState)
      }

      // Reset
      gameState = resetGame(gameState)

      expect(gameState.drawnNumbers.size).toBe(0)
      expect(gameState.gameActive).toBe(true)
      expect(gameState.winners).toEqual([])
    })
  })

  describe('Constants Validation', () => {
    it('should have ALL_NUMBERS constant with correct length', () => {
      expect(ALL_NUMBERS).toBeDefined()
      expect(ALL_NUMBERS.length).toBe(MAX_NUMBER)
    })

    it('should have ALL_NUMBERS containing values 1 through 75', () => {
      expect(ALL_NUMBERS[0]).toBe(1)
      expect(ALL_NUMBERS[MAX_NUMBER - 1]).toBe(MAX_NUMBER)
    })
  })

  describe('Game Flow', () => {
    it('should support extended play scenarios', () => {
      // Draw more than half the numbers
      for (let i = 0; i < 40; i++) {
        if (gameState.gameActive) {
          gameState = drawNumber(gameState)
        }
      }

      expect(gameState.drawnNumbers.size).toBeLessThanOrEqual(MAX_NUMBER)
      expect(gameState.drawnNumbers.size).toBeGreaterThan(0)
    })

    it('should maintain game state consistency during play', () => {
      // Draw several numbers
      for (let i = 0; i < 5; i++) {
        gameState = drawNumber(gameState)
      }

      // Card structure should remain valid
      expect(gameState.card.length).toBe(5)
      gameState.card.forEach((row) => {
        expect(row.length).toBe(5)
        row.forEach((cell) => {
          expect(typeof cell.marked).toBe('boolean')
          expect(typeof cell.number).toBe('number')
        })
      })
    })
  })

  describe('Grid Configuration', () => {
    it('should have 25 cells total (5x5)', () => {
      let totalCells = 0
      gameState.card.forEach((row) => {
        totalCells += row.length
      })
      expect(totalCells).toBe(25)
    })

    it('should start with center marked as free', () => {
      const centerCell = gameState.card[2][2]
      expect(centerCell.number).toBe(0) // FREE = 0
      expect(centerCell.marked).toBe(true) // Center is pre-marked
    })
  })
})
