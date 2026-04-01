import { useState, useCallback } from 'react'
import type { GameState, Guess, Difficulty } from '@/domain'
import {
  createInitialState,
  makeGuess,
  resetGame,
  getHint,
  generateAiGuess,
  isGameActive
} from '@/domain'

export const usePinpointGame = () => {
  const [gameState, setGameState] = useState<GameState>(() => createInitialState('easy'))
  const [currentGuess, setCurrentGuess] = useState<Guess>([])
  const [showHint, setShowHint] = useState(false)
  const [hintGuess, setHintGuess] = useState<Guess | null>(null)

  const makePlayerGuess = useCallback(() => {
    if (currentGuess.length !== gameState.codeLength) return

    try {
      const newState = makeGuess(gameState, currentGuess)
      setGameState(newState)
      setCurrentGuess([])
      setShowHint(false)
      setHintGuess(null)
    } catch (error) {
      console.error('Invalid guess:', error)
    }
  }, [gameState, currentGuess])

  const addPegToGuess = useCallback((color: string) => {
    if (currentGuess.length >= gameState.codeLength) return
    if (!gameState.availableColors.includes(color as any)) return

    setCurrentGuess(prev => [...prev, color as any])
  }, [currentGuess, gameState.codeLength, gameState.availableColors])

  const removePegFromGuess = useCallback((index: number) => {
    setCurrentGuess(prev => prev.filter((_, i) => i !== index))
  }, [])

  const clearCurrentGuess = useCallback(() => {
    setCurrentGuess([])
  }, [])

  const requestHint = useCallback(() => {
    const hint = getHint(gameState)
    setHintGuess(hint)
    setShowHint(true)
  }, [gameState])

  const makeAiGuess = useCallback(() => {
    if (!isGameActive(gameState)) return

    const aiGuess = generateAiGuess(gameState)
    try {
      const newState = makeGuess(gameState, aiGuess)
      setGameState(newState)
      setShowHint(false)
      setHintGuess(null)
    } catch (error) {
      console.error('AI guess failed:', error)
    }
  }, [gameState])

  const startNewGame = useCallback((difficulty: Difficulty) => {
    const newState = resetGame(difficulty)
    setGameState(newState)
    setCurrentGuess([])
    setShowHint(false)
    setHintGuess(null)
  }, [])

  const resetCurrentGame = useCallback(() => {
    const newState = resetGame(gameState.difficulty)
    setGameState(newState)
    setCurrentGuess([])
    setShowHint(false)
    setHintGuess(null)
  }, [gameState.difficulty])

  return {
    gameState,
    currentGuess,
    showHint,
    hintGuess,
    makePlayerGuess,
    addPegToGuess,
    removePegFromGuess,
    clearCurrentGuess,
    requestHint,
    makeAiGuess,
    startNewGame,
    resetCurrentGame,
    isGameActive: isGameActive(gameState),
    canMakeGuess: currentGuess.length === gameState.codeLength,
    remainingGuesses: gameState.maxGuesses - gameState.guesses.length
  }
}