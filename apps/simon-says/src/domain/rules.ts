import type { SimonColor, SimonRuleConfig } from './rules/simon.rules'
import type { SimonGameState } from './types'
import { isInputCorrect, generateNextColor, getSpeedMultiplier, getFlashDuration, shouldEndGame } from './constants'
import { getColorSequence } from './rules/simon.rules'

/**
 * Start a new game
 */
export function startGame(state: SimonGameState, rules: SimonRuleConfig): SimonGameState {
  return {
    ...state,
    phase: rules.playerAddsMode ? 'playerTurn' : 'deviceTurn',
    gameOver: false,
    gameOverReason: null,
    winner: null,
    message: 'Device playing...',
    startTime: Date.now(),
    error: null,
  }
}

/**
 * Device plays the next color in sequence
 */
export function playDeviceSequence(
  state: SimonGameState,
  rules: SimonRuleConfig,
): { state: SimonGameState; sequence: Array<{ color: SimonColor; duration: number }> } {
  if (state.gameOver) {
    return { state, sequence: [] }
  }

  const colors = getColorSequence(rules.colorCount)
  const speedMult = getSpeedMultiplier(rules.difficultyLevel, state.currentRound, rules.speedIncreaseEnabled)
  const flashDuration = getFlashDuration(500, speedMult)

  // Generate sequence for playback
  const playbackSequence = state.sequence.map(color => ({
    color,
    duration: flashDuration,
  }))

  const newState: SimonGameState = {
    ...state,
    phase: 'playerTurn',
    playerInput: [],
    sequenceIndex: 0,
    activeColor: null,
    message: 'Your turn. Repeat the sequence.',
    error: null,
  }

  return {
    state: newState,
    sequence: playbackSequence,
  }
}

/**
 * Player makes a move
 */
export function playerMove(state: SimonGameState, color: SimonColor, rules: SimonRuleConfig): SimonGameState {
  if (state.gameOver || state.phase !== 'playerTurn') {
    return state
  }

  const newInput = [...state.playerInput, color]
  const inputStatus = isInputCorrect(newInput, state.sequence)

  if (inputStatus === 'mismatch') {
    // Wrong input - fail, handle multiplayer elimination
    const newState: SimonGameState = {
      ...state,
      playerInput: newInput,
      gameOver: true,
      gameOverReason: 'mismatch',
      message: 'Wrong! Game Over.',
      error: 'Incorrect sequence',
    }

    if (rules.multiplayerMode && rules.eliminationMode) {
      // Eliminate current player
      const playersActive = [...state.playersActive]
      playersActive[state.currentPlayer - 1] = false

      // Check if only one player remains
      const activePlayers = playersActive.filter(p => p).length
      if (activePlayers === 1) {
        const winner = playersActive.findIndex(p => p) + 1
        newState.winner = 'player'
        newState.message = `Player ${winner} wins!`
      } else {
        // Move to next active player
        let nextPlayer = (state.currentPlayer % 4) + 1
        while (!playersActive[nextPlayer - 1]) {
          nextPlayer = (nextPlayer % 4) + 1
        }
        newState.currentPlayer = nextPlayer as 1 | 2 | 3 | 4
        newState.gameOver = false
        newState.gameOverReason = null
        newState.phase = 'idle'
        newState.message = `Player ${nextPlayer}'s turn. Press Start.`
        newState.playersActive = playersActive
      }
    }

    return newState
  }

  const updatedState: SimonGameState = {
    ...state,
    playerInput: newInput,
    activeColor: color,
    message: inputStatus === 'incomplete' ? 'Continue...' : 'Correct! Device playing...',
  }

  // Round complete - add to score and generate next device turn
  if (inputStatus === 'correct') {
    updatedState.score += state.currentRound * 10 // Score increases with round
    updatedState.roundsCompleted = state.currentRound

    if (shouldEndGame(state.currentRound, rules.maxSequenceLength)) {
      updatedState.gameOver = true
      updatedState.gameOverReason = 'maxSequence'
      updatedState.winner = 'player'
      updatedState.message = `You won! Final score: ${updatedState.score}`
    } else {
      // Generate next round: add new color to sequence
      const colors = getColorSequence(rules.colorCount)
      const nextColor = generateNextColor(colors)

      updatedState.sequence = [...state.sequence, nextColor]
      updatedState.currentRound = state.currentRound + 1
      updatedState.playerInput = []
      updatedState.phase = 'deviceTurn'
    }
  }

  return updatedState
}

/**
 * Player mode: player adds to sequence (not device)
 */
export function playerAddsColor(state: SimonGameState, color: SimonColor, rules: SimonRuleConfig): SimonGameState {
  if (state.gameOver || state.phase !== 'playerTurn') {
    return state
  }

  // In player-adds mode, player submits sequence themselves
  const newSequence = [...state.sequence, color]

  const newState: SimonGameState = {
    ...state,
    sequence: newSequence,
    playerInput: [],
    currentRound: state.currentRound + 1,
    phase: 'deviceTurn',
    message: 'Device repeating your sequence...',
    score: state.score + state.currentRound * 10,
  }

  if (shouldEndGame(newState.currentRound - 1, rules.maxSequenceLength)) {
    newState.gameOver = true
    newState.gameOverReason = 'maxSequence'
    newState.winner = 'player'
    newState.message = `You won! Final score: ${newState.score}`
  }

  return newState
}

/**
 * Handle timeout (player took too long)
 */
export function handleTimeout(state: SimonGameState, rules: SimonRuleConfig): SimonGameState {
  if (state.gameOver || state.phase !== 'playerTurn') {
    return state
  }

  return {
    ...state,
    gameOver: true,
    gameOverReason: 'timeout',
    message: 'Time is up! Game Over.',
    error: 'Input timeout',
  }
}

/**
 * Reset game
 */
export function resetGame(state: SimonGameState, rules: SimonRuleConfig): SimonGameState {
  const colors = getColorSequence(rules.colorCount)
  const firstColor = colors[Math.floor(Math.random() * colors.length)]

  return {
    ...state,
    sequence: [firstColor],
    playerInput: [],
    currentRound: 1,
    sequenceIndex: 0,
    phase: 'idle',
    gameOver: false,
    gameOverReason: null,
    winner: null,
    score: 0,
    roundsCompleted: 0,
    timeElapsed: 0,
    startTime: null,
    activeColor: null,
    message: 'Press Start to begin',
    error: null,
  }
}

/**
 * Check if game is over
 */
export function isGameOver(state: SimonGameState): boolean {
  return state.gameOver
}

/**
 * Get winner
 */
export function getWinner(state: SimonGameState): 'player' | 'computer' | null {
  return state.winner
}

/**
 * Get display score
 */
export function getDisplayScore(state: SimonGameState): number {
  return state.score
}
