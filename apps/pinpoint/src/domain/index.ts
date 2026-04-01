export type {
  Code,
  Color,
  Difficulty,
  Feedback,
  GameConfig,
  GameState,
  Guess,
  GuessResult,
  Peg,
} from './types'

export {
  BOARD_PADDING,
  COLORS,
  COLOR_DISPLAY_NAMES,
  COLOR_HEX_CODES,
  DIFFICULTY_CONFIGS,
  FEEDBACK_PEG_SIZE,
  GUESS_SPACING,
  PEG_SIZE,
} from './constants'

export {
  calculateFeedback,
  createInitialState,
  generateSecretCode,
  getRemainingGuesses,
  isGameActive,
  isValidGuess,
  makeGuess,
  resetGame,
} from './rules'

export { generateAiGuess, generateOptimalGuess, getHint, getSolution, isSolvable } from './ai'
