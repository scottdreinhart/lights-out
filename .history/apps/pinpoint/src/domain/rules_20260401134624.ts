import type { Code, Guess, Feedback, GameState, Difficulty, GuessResult } from './types'
import { DIFFICULTY_CONFIGS, COLORS } from './constants'

export const generateSecretCode = (difficulty: Difficulty): Code => {
  const config = DIFFICULTY_CONFIGS[difficulty]
  const availableColors = COLORS.slice(0, config.numColors)
  const code: Code = []

  for (let i = 0; i < config.codeLength; i++) {
    const randomIndex = Math.floor(Math.random() * availableColors.length)
    code.push(availableColors[randomIndex])
  }

  return code
}

export const createInitialState = (difficulty: Difficulty): GameState => {
  const config = DIFFICULTY_CONFIGS[difficulty]
  const availableColors = COLORS.slice(0, config.numColors)

  return {
    secretCode: generateSecretCode(difficulty),
    guesses: [],
    maxGuesses: config.maxGuesses,
    codeLength: config.codeLength,
    numColors: config.numColors,
    difficulty,
    isGameWon: false,
    isGameLost: false,
    availableColors
  }
}

export const isValidGuess = (guess: Guess, codeLength: number): boolean => {
  return guess.length === codeLength && guess.every(peg => COLORS.includes(peg))
}

export const calculateFeedback = (guess: Guess, secretCode: Code): Feedback => {
  const secretCopy = [...secretCode]
  const guessCopy = [...guess]
  let correctPosition = 0
  let correctColor = 0

  // First pass: count correct position and color (black pegs)
  for (let i = 0; i < guess.length; i++) {
    if (guess[i] === secretCode[i]) {
      correctPosition++
      secretCopy[i] = null as any // Mark as used
      guessCopy[i] = null as any // Mark as used
    }
  }

  // Second pass: count correct color, wrong position (white pegs)
  for (let i = 0; i < guess.length; i++) {
    if (guessCopy[i] !== null) {
      const secretIndex = secretCopy.indexOf(guessCopy[i])
      if (secretIndex !== -1) {
        correctColor++
        secretCopy[secretIndex] = null as any // Mark as used
      }
    }
  }

  return { correctPosition, correctColor }
}

export const makeGuess = (state: GameState, guess: Guess): GameState => {
  if (!isValidGuess(guess, state.codeLength)) {
    throw new Error('Invalid guess')
  }

  if (state.isGameWon || state.isGameLost) {
    throw new Error('Game is already finished')
  }

  if (state.guesses.length >= state.maxGuesses) {
    throw new Error('Maximum guesses reached')
  }

  const feedback = calculateFeedback(guess, state.secretCode)
  const guessResult: GuessResult = { guess, feedback }
  const newGuesses = [...state.guesses, guessResult]

  const isGameWon = feedback.correctPosition === state.codeLength
  const isGameLost = !isGameWon && newGuesses.length >= state.maxGuesses

  return {
    ...state,
    guesses: newGuesses,
    isGameWon,
    isGameLost
  }
}

export const resetGame = (difficulty: Difficulty): GameState => {
  return createInitialState(difficulty)
}

export const getRemainingGuesses = (state: GameState): number => {
  return state.maxGuesses - state.guesses.length
}

export const isGameActive = (state: GameState): boolean => {
  return !state.isGameWon && !state.isGameLost
}

export const isGameActive = (state: GameState): boolean => {
  return !state.isGameWon && !state.isGameLost
}