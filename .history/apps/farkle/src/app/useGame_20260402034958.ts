/**
 * Farkle game hook
 * Manages game state including dice rolling, selection, and banking
 */

import { useState, useCallback } from 'react'
import type { DieValue, GameState } from '@/domain'
import { calculateScore, hasScoreableDice, isValidSelection } from '@/domain/rules'

// Simple dice roller
function rollDice(count: number): DieValue[] {
  return Array.from({ length: count }, () => (Math.floor(Math.random() * 6) + 1) as DieValue)
}

export function useGame() {
  const [gameState, setGameState] = useState<GameState>({
    phase: 'rolling',
    currentPlayer: 'human',
    dice: {
      allDice: [],
      selectedIndices: new Set(),
      heldDice: [],
      remainingDice: [],
      isRolling: false,
    },
    banking: {
      bankedScore: 0,
      atRiskScore: 0,
      roundScore: 0,
    },
    humanTotal: 0,
    cpuTotal: 0,
    roundHistory: [],
    winner: null,
    isGameOver: false,
  })

  // Roll all dice
  const rollAll = useCallback(() => {
    const newDice = rollDice(6)
    setGameState((prev) => ({
      ...prev,
      dice: {
        ...prev.dice,
        allDice: newDice,
        selectedIndices: new Set(),
        remainingDice: newDice,
        isRolling: false,
      },
      banking: {
        ...prev.banking,
        atRiskScore: 0,
      },
      phase: 'selecting',
    }))
  }, [])

  // Roll remaining dice
  const rollRemaining = useCallback(() => {
    setGameState((prev) => {
      const newRemaining = rollDice(6 - prev.dice.heldDice.length)
      return {
        ...prev,
        dice: {
          ...prev.dice,
          allDice: [...prev.dice.heldDice, ...newRemaining],
          remainingDice: newRemaining,
          selectedIndices: new Set(),
          isRolling: false,
        },
        banking: {
          ...prev.banking,
          atRiskScore: 0,
        },
        phase: 'selecting',
      }
    })
  }, [])

  // Toggle die selection
  const toggleDieSelection = useCallback((index: number) => {
    setGameState((prev) => {
      const newSelected = new Set(prev.dice.selectedIndices)
      if (newSelected.has(index)) {
        newSelected.delete(index)
      } else {
        newSelected.add(index)
      }

      // Calculate new at risk score
      const selectedDice = Array.from(newSelected).map((i) => prev.dice.allDice[i])
      const atRiskScore = calculateScore(selectedDice)

      return {
        ...prev,
        dice: {
          ...prev.dice,
          selectedIndices: newSelected,
        },
        banking: {
          ...prev.banking,
          atRiskScore,
        },
      }
    })
  }, [])

  // Bank current selection
  const bankSelection = useCallback(() => {
    setGameState((prev) => {
      const selectedDice = Array.from(prev.dice.selectedIndices).map((i) => prev.dice.allDice[i])
      const selectionScore = calculateScore(selectedDice)

      if (!isValidSelection(selectedDice)) {
        return prev // Invalid selection
      }

      const newBanked = prev.banking.bankedScore + selectionScore
      const newHeld = prev.dice.allDice.filter((_, i) => !prev.dice.selectedIndices.has(i))

      // If all dice are held, can roll all 6 again
      if (newHeld.length === 0) {
        return {
          ...prev,
          dice: {
            ...prev.dice,
            heldDice: [],
            selectedIndices: new Set(),
            allDice: [],
            remainingDice: [],
          },
          banking: {
            ...prev.banking,
            bankedScore: newBanked,
            atRiskScore: 0,
          },
          phase: 'rolling',
        }
      }

      return {
        ...prev,
        dice: {
          ...prev.dice,
          heldDice: newHeld,
          selectedIndices: new Set(),
        },
        banking: {
          ...prev.banking,
          bankedScore: newBanked,
          atRiskScore: 0,
        },
        phase: 'banking',
      }
    })
  }, [])

  // End turn (bank and pass to next player)
  const endTurn = useCallback(() => {
    setGameState((prev) => {
      if (prev.currentPlayer === 'human') {
        return {
          ...prev,
          humanTotal: prev.humanTotal + prev.banking.bankedScore,
          currentPlayer: 'cpu',
          banking: {
            bankedScore: 0,
            atRiskScore: 0,
            roundScore: 0,
          },
          dice: {
            allDice: [],
            selectedIndices: new Set(),
            heldDice: [],
            remainingDice: [],
            isRolling: false,
          },
          phase: 'rolling',
        }
      } else {
        return {
          ...prev,
          cpuTotal: prev.cpuTotal + prev.banking.bankedScore,
          currentPlayer: 'human',
          banking: {
            bankedScore: 0,
            atRiskScore: 0,
            roundScore: 0,
          },
          dice: {
            allDice: [],
            selectedIndices: new Set(),
            heldDice: [],
            remainingDice: [],
            isRolling: false,
          },
          phase: 'rolling',
        }
      }
    })
  }, [])

  // Farkle! (no scoreable dice)
  const farkle = useCallback(() => {
    setGameState((prev) => ({
      ...prev,
      currentPlayer: prev.currentPlayer === 'human' ? 'cpu' : 'human',
      banking: {
        bankedScore: 0,
        atRiskScore: 0,
        roundScore: 0,
      },
      dice: {
        allDice: [],
        selectedIndices: new Set(),
        heldDice: [],
        remainingDice: [],
        isRolling: false,
      },
      phase: 'rolling',
    }))
  }, [])

  const startGame = useCallback(() => {
    rollAll()
  }, [rollAll])

  return {
    gameState,
    startGame,
    rollAll,
    rollRemaining,
    toggleDieSelection,
    bankSelection,
    endTurn,
    farkle,
  }
}
