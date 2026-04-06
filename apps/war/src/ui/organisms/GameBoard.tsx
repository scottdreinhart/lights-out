import { useWar, useResponsiveState } from '@/app'
import { DEFAULT_RULES } from '@/domain'
import { useState } from 'react'
import { Card } from '../atoms'
import { RulesModal } from './RulesModal'
import styles from './GameBoard.module.css'

export function GameBoard() {
  const { state, nextRound, reset, isOver, winner } = useWar()
  const [showRules, setShowRules] = useState(false)
  const responsive = useResponsiveState()

  const playerDeckSize = state.playerDeck.length
  const computerDeckSize = state.computerDeck.length
  const totalCards = playerDeckSize + computerDeckSize

  const gameProgress = totalCards > 0 ? ((52 - totalCards) / 52) * 100 : 0

  return (
    <div className={styles.board}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.title}>
          <h1>War</h1>
          <button
            className={styles.rulesButton}
            onClick={() => setShowRules(true)}
            aria-label="Show rules"
            title="View game rules"
          >
            ?
          </button>
        </div>

        {/* Deck Counts */}
        <div className={styles.deckInfo}>
          <div className={styles.deckSize}>
            <span className={styles.label}>Your Pile</span>
            <span className={styles.count}>{playerDeckSize}</span>
          </div>
          <div className={styles.divider}>⚔️</div>
          <div className={styles.deckSize}>
            <span className={styles.label}>Opponent Pile</span>
            <span className={styles.count}>{computerDeckSize}</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className={styles.progressContainer}>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: `${gameProgress}%` }} />
          </div>
          <span className={styles.progressText}>{gameProgress.toFixed(0)}%</span>
        </div>
      </div>

      {/* Main Play Area */}
      <div className={styles.playArea}>
        {/* Player Section */}
        <div className={styles.playerSection}>
          <h2>Your Cards</h2>
          <div className={styles.cardDisplay}>
            {state.phase === 'war' && state.tableCards.player.length > 0 ? (
              <div className={styles.warSequence}>
                <div className={styles.faceDownCards}>
                  {state.tableCards.player.slice(0, -1).map((_, i) => (
                    <div key={`fd-p-${i}`} className={styles.cardBack} />
                  ))}
                </div>
                <div className={styles.faceUpCard}>
                  {state.playerCard && <Card card={state.playerCard} />}
                </div>
              </div>
            ) : (
              state.playerCard && <Card card={state.playerCard} />
            )}
          </div>
        </div>

        {/* Center Status */}
        <div className={styles.centerStatus}>
          {state.phase === 'war' && <div className={styles.warLabel}>WAR!</div>}
          {state.phase !== 'gameOver' && !isOver && (
            <div className={styles.roundInfo}>
              Round {state.roundsPlayed + 1}
              <br />
              {state.playerWins} - {state.computerWins}
            </div>
          )}
        </div>

        {/* Computer Section */}
        <div className={styles.computerSection}>
          <h2>Opponent Cards</h2>
          <div className={styles.cardDisplay}>
            {state.phase === 'war' && state.tableCards.computer.length > 0 ? (
              <div className={styles.warSequence}>
                <div className={styles.faceDownCards}>
                  {state.tableCards.computer.slice(0, -1).map((_, i) => (
                    <div key={`fd-c-${i}`} className={styles.cardBack} />
                  ))}
                </div>
                <div className={styles.faceUpCard}>
                  {state.computerCard && <Card card={state.computerCard} />}
                </div>
              </div>
            ) : (
              state.computerCard && <Card card={state.computerCard} />
            )}
          </div>
        </div>
      </div>

      {/* Game Stats */}
      <div className={styles.stats}>
        <div className={styles.stat}>
          <span className={styles.label}>Rounds Played</span>
          <span className={styles.value}>{state.roundsPlayed}</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.label}>Wars</span>
          <span className={styles.value}>{state.warsPlayed}</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.label}>Cards in Play</span>
          <span className={styles.value}>{state.roundCardsWon}</span>
        </div>
      </div>

      {/* Game Over Screen */}
      {isOver && (
        <div className={styles.gameOverOverlay}>
          <div className={styles.gameOverContent}>
            <h2 className={styles.gameOverTitle}>
              {winner === 'player' ? '🎉 You Win!' : '😢 Opponent Wins!'}
            </h2>
            <div className={styles.finalStats}>
              <p>Rounds: {state.roundsPlayed}</p>
              <p>Your Wins: {state.playerWins}</p>
              <p>Opponent Wins: {state.computerWins}</p>
              <p>Wars: {state.warsPlayed}</p>
            </div>
            <button onClick={reset} className={styles.primaryButton}>
              Play Again
            </button>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className={styles.actions}>
        {!isOver && (
          <button
            onClick={nextRound}
            className={styles.primaryButton}
            disabled={state.gameOver}
          >
            {state.phase === 'war' ? 'Continue War' : 'Draw Card'}
          </button>
        )}
        <button onClick={() => setShowRules(true)} className={styles.secondaryButton}>
          Rules
        </button>
      </div>

      {/* Rules Modal */}
      <RulesModal
        isOpen={showRules}
        onClose={() => setShowRules(false)}
        rules={DEFAULT_RULES}
        variant="CLASSIC"
      />
    </div>
  )
}
