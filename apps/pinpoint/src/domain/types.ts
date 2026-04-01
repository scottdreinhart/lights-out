export type Color = 'red' | 'blue' | 'green' | 'yellow' | 'purple' | 'orange'

export type Peg = Color

export type Code = Peg[]

export type Guess = Code

export type Feedback = {
  correctPosition: number // Black pegs - correct color and position
  correctColor: number    // White pegs - correct color, wrong position
}

export type GuessResult = {
  guess: Guess
  feedback: Feedback
}

export type Difficulty = 'easy' | 'medium' | 'hard'

export type GameState = {
  secretCode: Code
  guesses: GuessResult[]
  maxGuesses: number
  codeLength: number
  numColors: number
  difficulty: Difficulty
  isGameWon: boolean
  isGameLost: boolean
  availableColors: Color[]
}

export type GameConfig = {
  codeLength: number
  numColors: number
  maxGuesses: number
  difficulty: Difficulty
}