import type { Code, Guess, Feedback, GameState, Color } from './types'
import { COLORS } from './constants'

// Simple AI that uses a basic strategy: try all possible combinations systematically
export const generateAiGuess = (state: GameState): Guess => {
  const { guesses, codeLength, availableColors } = state

  if (guesses.length === 0) {
    // First guess: use first few colors
    return availableColors.slice(0, codeLength) as Guess
  }

  // For subsequent guesses, try a different combination
  // This is a simplified strategy - in a real implementation,
  // we'd use more sophisticated algorithms like Knuth's algorithm
  const lastGuess = guesses[guesses.length - 1].guess
  const nextGuess = [...lastGuess]

  // Simple increment strategy
  for (let i = codeLength - 1; i >= 0; i--) {
    const currentColorIndex = availableColors.indexOf(nextGuess[i])
    if (currentColorIndex < availableColors.length - 1) {
      nextGuess[i] = availableColors[currentColorIndex + 1]
      break
    } else {
      nextGuess[i] = availableColors[0]
    }
  }

  return nextGuess
}

// Check if a guess is possible given previous feedback
export const isPossibleGuess = (
  candidate: Guess,
  previousGuesses: Array<{ guess: Guess; feedback: Feedback }>
): boolean => {
  return previousGuesses.every(({ guess, feedback }) => {
    const candidateFeedback = calculateFeedback(candidate, guess)
    return candidateFeedback.correctPosition === feedback.correctPosition &&
           candidateFeedback.correctColor === feedback.correctColor
  })
}

// Calculate feedback for two codes (used by AI)
const calculateFeedback = (guess: Guess, secret: Guess): Feedback => {
  const secretCopy = [...secret]
  const guessCopy = [...guess]
  let correctPosition = 0
  let correctColor = 0

  // First pass: count correct position and color
  for (let i = 0; i < guess.length; i++) {
    if (guess[i] === secret[i]) {
      correctPosition++
      secretCopy[i] = null as any
      guessCopy[i] = null as any
    }
  }

  // Second pass: count correct color, wrong position
  for (let i = 0; i < guess.length; i++) {
    if (guessCopy[i] !== null) {
      const secretIndex = secretCopy.indexOf(guessCopy[i])
      if (secretIndex !== -1) {
        correctColor++
        secretCopy[secretIndex] = null as any
      }
    }
  }

  return { correctPosition, correctColor }
}

// Generate all possible codes for a given configuration
export const generateAllPossibleCodes = (codeLength: number, availableColors: Color[]): Code[] => {
  if (codeLength === 0) return [[]]

  const smallerCodes = generateAllPossibleCodes(codeLength - 1, availableColors)
  const result: Code[] = []

  for (const color of availableColors) {
    for (const code of smallerCodes) {
      result.push([color, ...code])
    }
  }

  return result
}

// Advanced AI using Knuth's algorithm (simplified version)
export const generateOptimalGuess = (state: GameState): Guess => {
  const { guesses, codeLength, availableColors } = state

  if (guesses.length === 0) {
    // First guess: use first color for first half, second color for second half
    const firstColor = availableColors[0]
    const secondColor = availableColors[1] || firstColor
    const midPoint = Math.ceil(codeLength / 2)

    return Array(codeLength).fill(null).map((_, i) =>
      i < midPoint ? firstColor : secondColor
    ) as Guess
  }

  // For now, use a simpler strategy
  // In a full implementation, this would use information theory
  // to choose the guess that minimizes the maximum number of remaining possibilities
  return generateAiGuess(state)
}

// Get hint for current game state
export const getHint = (state: GameState): Guess | null => {
  if (!isGameActive(state)) return null

  // Generate a reasonable hint based on previous guesses
  const possibleGuesses = generateAllPossibleCodes(state.codeLength, state.availableColors)
    .filter(code => isPossibleGuess(code, state.guesses))

  if (possibleGuesses.length === 0) return null

  // Return a random possible guess as hint
  const randomIndex = Math.floor(Math.random() * possibleGuesses.length)
  return possibleGuesses[randomIndex]
}

// Check if the game can be solved with current information
export const isSolvable = (state: GameState): boolean => {
  const possibleCodes = generateAllPossibleCodes(state.codeLength, state.availableColors)
    .filter(code => isPossibleGuess(code, state.guesses))

  return possibleCodes.length > 0
}

// Get the solution (for debugging/testing)
export const getSolution = (state: GameState): Code => {
  return state.secretCode
}