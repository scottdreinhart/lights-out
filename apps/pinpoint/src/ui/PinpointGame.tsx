import React from 'react'
import { usePinpointGame } from '@/app'
import { GuessRow } from './GuessRow'
import { ColorPalette } from './ColorPalette'
import { CurrentGuess } from './CurrentGuess'
import styles from './PinpointGame.module.css'

export const PinpointGame: React.FC = () => {
  const {
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
    isGameActive,
    canMakeGuess,
    remainingGuesses
  } = usePinpointGame()

  const handleColorSelect = (color: string) => {
    addPegToGuess(color)
  }

  const handleMakeGuess = () => {
    makePlayerGuess()
  }

  const handleHint = () => {
    requestHint()
  }

  const handleAiGuess = () => {
    makeAiGuess()
  }

  const handleNewGame = (difficulty: string) => {
    startNewGame(difficulty as any)
  }

  const handleReset = () => {
    resetCurrentGame()
  }

  return (
    <div className={styles.pinpointGame}>
      <div className={styles.gameHeader}>
        <h1 className={styles.title}>Pinpoint</h1>
        <div className={styles.gameInfo}>
          <div className={styles.difficulty}>
            <span className={styles.label}>Difficulty:</span>
            <span className={styles.value}>{gameState.difficulty}</span>
          </div>
          <div className={styles.guesses}>
            <span className={styles.label}>Guesses Left:</span>
            <span className={styles.value}>{remainingGuesses}</span>
          </div>
        </div>
      </div>

      <div className={styles.gameBoard}>
        <div className={styles.guessHistory}>
          {gameState.guesses.map((guessResult, index) => (
            <GuessRow
              key={index}
              guessResult={guessResult}
            />
          ))}
        </div>

        {isGameActive && (
          <div className={styles.currentGuessSection}>
            <h3 className={styles.sectionTitle}>Your Guess</h3>
            <CurrentGuess
              guess={currentGuess}
              codeLength={gameState.codeLength}
              onPegRemove={removePegFromGuess}
            />
            <ColorPalette
              availableColors={gameState.availableColors}
              onColorSelect={handleColorSelect}
              disabled={currentGuess.length >= gameState.codeLength}
            />
            <div className={styles.guessControls}>
              <button
                className={styles.controlButton}
                onClick={handleMakeGuess}
                disabled={!canMakeGuess}
                aria-label="Submit current guess"
              >
                Make Guess
              </button>
              <button
                className={styles.controlButton}
                onClick={clearCurrentGuess}
                disabled={currentGuess.length === 0}
                aria-label="Clear current guess"
              >
                Clear
              </button>
            </div>
          </div>
        )}
      </div>

      <div className={styles.gameControls}>
        <div className={styles.aiControls}>
          <button
            className={styles.aiButton}
            onClick={handleHint}
            disabled={!isGameActive}
            aria-label="Get a hint for the next guess"
          >
            Hint
          </button>
          <button
            className={styles.aiButton}
            onClick={handleAiGuess}
            disabled={!isGameActive}
            aria-label="Let AI make a guess"
          >
            AI Guess
          </button>
        </div>

        <div className={styles.gameManagement}>
          <button
            className={styles.resetButton}
            onClick={handleReset}
            aria-label="Reset current game"
          >
            Reset
          </button>
          <select
            className={styles.difficultySelect}
            onChange={(e) => handleNewGame(e.target.value)}
            value={gameState.difficulty}
            aria-label="Select difficulty for new game"
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
      </div>

      {showHint && hintGuess && (
        <div className={styles.hintDisplay} role="status" aria-live="polite">
          <p>💡 Hint: Try this combination:</p>
          <div className={styles.hintPegs}>
            {hintGuess.map((color, index) => (
              <div
                key={index}
                className={styles.hintPeg}
                style={{ backgroundColor: color }}
                aria-label={`Hint position ${index + 1}: ${color}`}
              />
            ))}
          </div>
        </div>
      )}

      {gameState.isGameWon && (
        <div className={styles.gameResult} role="status" aria-live="polite">
          🎉 Congratulations! You cracked the code in {gameState.guesses.length} guesses!
        </div>
      )}

      {gameState.isGameLost && (
        <div className={styles.gameResult} role="status" aria-live="polite">
          😞 Game Over! The secret code was: {gameState.secretCode.join(', ')}
        </div>
      )}

      <div className={styles.instructions}>
        <p>
          Crack the secret code! Choose colors and submit guesses.
          Black pegs = correct color and position, white pegs = correct color only.
        </p>
      </div>
    </div>
  )
}