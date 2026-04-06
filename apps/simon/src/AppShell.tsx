import { useSimonGame } from '@/app'
import { GameBoard, RulesModal } from '@/ui/organisms'
import { useCallback, useEffect, useState } from 'react'
import styles from './AppShell.module.css'

type GameScreen = 'home' | 'playing' | 'results'

export function AppShell() {
  const [screen, setScreen] = useState<GameScreen>('home')
  const [selectedVariant, setSelectedVariant] = useState('classic')
  const [showRules, setShowRules] = useState(false)

  const {
    gameState,
    rules,
    status,
    score,
    difficulty,
    inputEnabled,
    colorSequence,
    userSequence,
    simonIndex,
    userIndex,
    actions,
  } = useSimonGame(selectedVariant)

  const handleStartGame = useCallback((variant: string) => {
    setSelectedVariant(variant)
    setScreen('playing')
  }, [])

  const handlePlayAgain = useCallback(() => {
    actions.reset()
    setScreen('home')
  }, [actions])

  const handleQuit = useCallback(() => {
    setScreen('home')
    actions.reset()
  }, [actions])

  const handleColorClick = useCallback(
    (colorIndex: number) => {
      if (inputEnabled && gameState) {
        actions.makeMove(colorIndex)
      }
    },
    [inputEnabled, gameState, actions],
  )

  useEffect(() => {
    if (status === 'won' || status === 'lost') {
      setScreen('results')
    }
  }, [status])

  return (
    <div className={styles.root}>
      {screen === 'home' && (
        <MainMenu onStartGame={handleStartGame} onShowRules={() => setShowRules(true)} />
      )}

      {screen === 'playing' && gameState && (
        <div className={styles.gameContainer}>
          <GameBoard
            colorCount={rules.colorCount}
            currentSequence={colorSequence}
            userSequence={userSequence}
            simonIndex={simonIndex}
            userIndex={userIndex}
            inputEnabled={inputEnabled}
            onColorClick={handleColorClick}
            status={status}
            score={score}
            difficulty={difficulty}
            onQuit={handleQuit}
          />
        </div>
      )}

      {screen === 'results' && gameState && (
        <div className={styles.resultsContainer}>
          <div className={styles.resultsCard}>
            <h2>{status === 'won' ? 'You Won!' : 'Game Over'}</h2>
            <p className={styles.finalScore}>Score: {score}</p>
            <p className={styles.sequenceLength}>Sequence Length: {colorSequence.length}</p>
            <div className={styles.resultsActions}>
              <button className={styles.primaryButton} onClick={() => setScreen('home')}>
                Menu
              </button>
              <button
                className={styles.secondaryButton}
                onClick={() => {
                  actions.reset()
                  setScreen('playing')
                }}
              >
                Play Again
              </button>
            </div>
          </div>
        </div>
      )}

      <RulesModal
        isOpen={showRules}
        onClose={() => setShowRules(false)}
        rules={rules}
        variant={selectedVariant}
      />
    </div>
  )
}
