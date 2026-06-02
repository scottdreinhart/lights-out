import { useWar } from '@/app'
import { DEFAULT_RULES } from '@/domain'
import { ActionBar, Button, StatPill, StatsBar } from '@games/assets-shared'
import { useState } from 'react'
import { Card } from '../atoms'
import styles from './GameBoard.module.css'
import { RulesModal } from './RulesModal'

export function GameBoard() {
  const { state, nextRound, reset, isOver, winner } = useWar()
  const [showRules, setShowRules] = useState(false)

  const playerDrawSize = state.playerDeck.length
  const computerDrawSize = state.computerDeck.length
  const playerCapturedSize = state.playerWonPile.length
  const computerCapturedSize = state.computerWonPile.length
  const playerTotal = playerDrawSize + playerCapturedSize
  const computerTotal = computerDrawSize + computerCapturedSize
  const totalCards = playerTotal + computerTotal

  const gameProgress = (playerTotal / 52) * 100

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
            <span className={styles.label}>Your Total</span>
            <span className={styles.count}>{playerTotal}</span>
            <span className={styles.label}>
              Draw {playerDrawSize} / Captured {playerCapturedSize}
            </span>
          </div>
          <div className={styles.divider}>⚔️</div>
          <div className={styles.deckSize}>
            <span className={styles.label}>Opponent Total</span>
            <span className={styles.count}>{computerTotal}</span>
            <span className={styles.label}>
              Draw {computerDrawSize} / Captured {computerCapturedSize}
            </span>
          </div>
        </div>

        {/* Game Stats */}
        <StatsBar className={styles.stats}>
          <StatPill label="Rounds Played" value={state.roundsPlayed} />
          <StatPill label="Wars" value={state.warsPlayed} />
          <StatPill label="Cards in Play" value={state.roundCardsWon} />
          <StatPill label="Cards Tracked" value={totalCards} />
        </StatsBar>

        {/* Progress Bar */}
        <div className={styles.progressContainer}>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: `${gameProgress}%` }} />
          </div>
          <span className={styles.progressText}>
            {playerTotal}/52 ({gameProgress.toFixed(0)}%)
          </span>
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
                    <Card key={`fd-p-${i}`} card={null} faceDown size="sm" />
                  ))}
                </div>
                <div className={styles.faceUpCard}>
                  {state.playerCard ? (
                    <Card card={state.playerCard} />
                  ) : (
                    <Card card={null} faceDown />
                  )}
                </div>
              </div>
            ) : (
              <>
                {state.playerCard ? (
                  <Card card={state.playerCard} />
                ) : (
                  <Card card={null} faceDown />
                )}
              </>
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
                    <Card key={`fd-c-${i}`} card={null} faceDown size="sm" />
                  ))}
                </div>
                <div className={styles.faceUpCard}>
                  {state.computerCard ? (
                    <Card card={state.computerCard} />
                  ) : (
                    <Card card={null} faceDown />
                  )}
                </div>
              </div>
            ) : (
              <>
                {state.computerCard ? (
                  <Card card={state.computerCard} />
                ) : (
                  <Card card={null} faceDown />
                )}
              </>
            )}
          </div>
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
            <Button onClick={reset} className={styles.primaryButton} variant="primary">
              Play Again
            </Button>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <ActionBar className={styles.actions}>
        {!isOver && (
          <Button
            onClick={nextRound}
            className={styles.primaryButton}
            variant="primary"
            disabled={state.gameOver}
          >
            {state.phase === 'war' ? 'Continue War' : 'Draw Card'}
          </Button>
        )}
        <Button
          onClick={() => setShowRules(true)}
          className={styles.secondaryButton}
          variant="secondary"
        >
          Rules
        </Button>
      </ActionBar>

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
