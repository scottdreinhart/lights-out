import { useGame, useResponsiveState, useSoundContext, useStats, vibrate } from '@/app'
import type { GamePhase } from '@/domain'
import { getRevealedWord, MAX_WRONG_GUESSES, remainingLives } from '@/domain'
import { SplashScreen } from '@/ui'
import { ActionBar, Button, CounterBadge, StatsBar } from '@games/assets-shared'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

type AppPhase = 'splash' | 'playing' | 'help'

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
const DIFFICULTY_LEVELS = ['easy', 'medium', 'hard'] as const

const formatDifficultyLabel = (difficulty: (typeof DIFFICULTY_LEVELS)[number]): string =>
  `${difficulty.slice(0, 1).toUpperCase()}${difficulty.slice(1)}`

const getLetterColumns = (responsive: { isMobile: boolean; isTablet: boolean }): number =>
  responsive.isMobile ? 6 : responsive.isTablet ? 7 : 8

const getStatusTone = (phase: GamePhase): string =>
  phase === 'won' || phase === 'lost' ? 'game-over' : ''

const getStatusMessage = (phase: GamePhase, word: string, livesLeft: number): string => {
  if (phase === 'won') {
    return 'You won!'
  }

  if (phase === 'lost') {
    return `You lost! Word: ${word}`
  }

  return `Lives left: ${livesLeft}`
}

const getLetterButtonVariant = (used: boolean): 'primary' | 'secondary' =>
  used ? 'secondary' : 'primary'

function useHangmanOutcomeTracking(
  phase: 'idle' | 'playing' | 'won' | 'lost',
  recordWin: () => void,
  recordLoss: () => void,
): void {
  const hasRecordedOutcomeRef = useRef(false)

  useEffect(() => {
    if (phase === 'won') {
      if (!hasRecordedOutcomeRef.current) {
        recordWin()
        hasRecordedOutcomeRef.current = true
      }
    } else if (phase === 'lost') {
      if (!hasRecordedOutcomeRef.current) {
        recordLoss()
        hasRecordedOutcomeRef.current = true
      }
    } else {
      hasRecordedOutcomeRef.current = false
    }
  }, [phase, recordLoss, recordWin])
}

function HelpScreen({ onBack, maxWrongGuesses }: { onBack: () => void; maxWrongGuesses: number }) {
  return (
    <div className="help-screen">
      <h2 className="screen-title">How to Play Hangman</h2>
      <p className="screen-copy">
        Guess letters to reveal a hidden word before the stick figure completes.
      </p>
      <p className="screen-copy">Wrong guesses remaining: {maxWrongGuesses} per round.</p>
      <ActionBar className="actions">
        <Button type="button" variant="primary" onClick={onBack}>
          Back to Game
        </Button>
      </ActionBar>
    </div>
  )
}

function GameScreen() {
  const { state, difficulty, guessedLettersArray, setDifficulty, guessLetter, resetGame } =
    useGame()
  const { stats, recordWin, recordLoss, resetStats } = useStats()
  const { soundEnabled, toggleSound } = useSoundContext()
  const responsive = useResponsiveState()
  useHangmanOutcomeTracking(state.phase, recordWin, recordLoss)

  const guessedLettersSet = useMemo(() => new Set(guessedLettersArray), [guessedLettersArray])
  const wrongGuesses = useMemo(
    () => guessedLettersArray.filter((letter) => !state.word.includes(letter)),
    [guessedLettersArray, state.word],
  )
  const revealedWord = getRevealedWord(state)
  const livesLeft = remainingLives(state)
  const letterColumns = getLetterColumns(responsive)
  const difficultyLabel = formatDifficultyLabel(difficulty)
  const handleGuess = (letter: string) => {
    if (state.phase === 'playing' && !guessedLettersSet.has(letter)) {
      guessLetter(letter)
      if (!state.word.includes(letter)) {
        vibrate(20)
      }
    }
  }

  const handleNewRound = () => {
    resetGame()
  }

  return (
    <div className="app">
      <header className="hero">
        <div className="hero-copy">
          <h1 className="screen-title">Hangman</h1>
          <p className="screen-copy">
            Guess letters to reveal a hidden word before the stick figure completes.
          </p>
        </div>

        <StatsBar className="stats">
          <CounterBadge tone="shared" label="Difficulty" value={difficultyLabel} />
          <CounterBadge tone="player" label="Lives" value={livesLeft} />
          <CounterBadge tone="ai" label="Wrong" value={wrongGuesses.length} />
          <CounterBadge tone="default" label="Wins" value={stats.wins} />
        </StatsBar>
      </header>

      <div className="controls">
        <div className="control-group">
          <span className="control-label">Difficulty</span>
          <ActionBar className="control-row">
            {DIFFICULTY_LEVELS.map((level) => (
              <Button
                key={level}
                type="button"
                size="sm"
                variant={difficulty === level ? 'primary' : 'secondary'}
                onClick={() => setDifficulty(level)}
              >
                {formatDifficultyLabel(level)}
              </Button>
            ))}
          </ActionBar>
        </div>
        <div className="control-group">
          <span className="control-label">Sound</span>
          <Button
            type="button"
            size="sm"
            variant={soundEnabled ? 'primary' : 'secondary'}
            onClick={toggleSound}
          >
            {soundEnabled ? 'On' : 'Off'}
          </Button>
        </div>
      </div>

      <div className={`status ${getStatusTone(state.phase)}`} aria-live="polite">
        {getStatusMessage(state.phase, state.word, livesLeft)}
      </div>

      <h2 className="screen-word">{revealedWord}</h2>

      <p className="wrong-guesses">
        Wrong guesses: {wrongGuesses.length > 0 ? wrongGuesses.join(', ') : 'None'}
      </p>

      <div
        className="letter-grid"
        style={{ gridTemplateColumns: `repeat(${letterColumns}, minmax(0, 1fr))` }}
      >
        {ALPHABET.map((letter) => {
          const used = guessedLettersSet.has(letter)
          const disabled = used || state.phase !== 'playing'
          return (
            <Button
              key={letter}
              type="button"
              size="sm"
              variant={getLetterButtonVariant(used)}
              className="letter-button"
              onClick={() => handleGuess(letter)}
              disabled={disabled}
            >
              {letter}
            </Button>
          )
        })}
      </div>

      <ActionBar className="actions">
        <Button type="button" variant="primary" onClick={handleNewRound}>
          New Round
        </Button>
        <Button type="button" variant="secondary" onClick={resetStats}>
          Reset Stats
        </Button>
      </ActionBar>

      <div className="move-counter">
        Wins: {stats.wins} · Losses: {stats.losses} · Streak: {stats.streak} · Best:{' '}
        {stats.bestStreak}
      </div>
    </div>
  )
}

export function App() {
  const [phase, setPhase] = useState<AppPhase>('splash')

  const handleSplashComplete = useCallback(() => {
    setPhase('playing')
  }, [])

  const handleHowToPlay = useCallback(() => {
    setPhase('help')
  }, [])

  const handleLetsPlay = useCallback(() => {
    setPhase('playing')
  }, [])

  if (phase === 'splash') {
    return (
      <SplashScreen
        onComplete={handleSplashComplete}
        onHowToPlay={handleHowToPlay}
        onLetsPlay={handleLetsPlay}
      />
    )
  }

  if (phase === 'help') {
    return <HelpScreen onBack={handleLetsPlay} maxWrongGuesses={MAX_WRONG_GUESSES} />
  }

  return <GameScreen />
}

export default App
