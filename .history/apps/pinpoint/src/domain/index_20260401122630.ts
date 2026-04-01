export type {
  Color,
  Peg,
  Code,
  Guess,
  Feedback,
  GuessResult,
  Difficulty,
  GameState,
  GameConfig
} from './types'

export {
  COLORS,
  DIFFICULTY_CONFIGS,
  COLOR_DISPLAY_NAMES,
  COLOR_HEX_CODES,
  PEG_SIZE,
  BOARD_PADDING,
  GUESS_SPACING,
  FEEDBACK_PEG_SIZE
} from './constants'

export {
  generateSecretCode,
  createInitialState,
  isValidGuess,
  calculateFeedback,
  makeGuess,
  resetGame,
  getRemainingGuesses,
  isGameActive
} from './rules'

export {
  generateAiGuess,
  generateOptimalGuess,
  getHint,
  isSolvable,
  getSolution
} from './ai'