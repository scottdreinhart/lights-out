import type { SimonColor, SimonGameState, SimonRuleConfig } from '@/domain'
import { getColorSequence, SIMON_COLOR_VALUES } from '@/domain'
import { useEffect, useState } from 'react'
import { SimonPad } from '../atoms/SimonPad'
import styles from './GameBoard.module.css'
import { RulesModal } from './RulesModal'

interface GameBoardProps {
  state: SimonGameState
  rules: SimonRuleConfig
  showRules: boolean
  onColorClick: (color: SimonColor) => void
  onStart: () => void
  onPlaySequence: () => Promise<any>
  onReset: () => void
  onToggleRules: () => void
  onCloseRules: () => void
}

export function GameBoard({
  state,
  rules,
  showRules,
  onColorClick,
  onStart,
  onPlaySequence,
  onReset,
  onToggleRules,
  onCloseRules,
}: GameBoardProps) {
  const colors = getColorSequence(rules.colorCount)
  const [isPlayingSequence, setIsPlayingSequence] = useState(false)

  useEffect(() => {
    if (state.phase === 'deviceTurn' && !isPlayingSequence) {
      setIsPlayingSequence(true)
      onPlaySequence().then(() => {
        setIsPlayingSequence(false)
      })
    }
  }, [state.phase, isPlayingSequence, onPlaySequence])

  const isGameInProgress =
    state.phase === 'playing' || state.phase === 'playerTurn' || state.phase === 'deviceTurn'

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.titleRow}>
          <h1 className={styles.title}>Simon</h1>
          <button
            className={styles.rulesButton}
            onClick={onToggleRules}
            aria-label="Show rules"
            title="Rules"
          >
            ?
          </button>
        </div>
        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.label}>Round</span>
            <span className={styles.value}>{state.currentRound}</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.label}>Score</span>
            <span className={styles.value}>{state.score}</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.label}>High Score</span>
            <span className={styles.value}>{state.highScore}</span>
          </div>
        </div>
      </div>

      {/* Main play area */}
      <div className={styles.playArea}>
        <SimonPad
          colors={colors}
          onColorClick={onColorClick}
          activeColor={state.activeColor}
          colorValues={SIMON_COLOR_VALUES}
          disabled={!isGameInProgress || isPlayingSequence}
        />
      </div>

      {/* Message */}
      <div className={styles.message}>
        {state.message}
        {state.error && <div className={styles.error}>{state.error}</div>}
      </div>

      {/* Controls */}
      <div className={styles.controls}>
        {!isGameInProgress ? (
          <button className={styles.primaryButton} onClick={onStart}>
            Start Game
          </button>
        ) : (
          <button className={styles.primaryButton} disabled>
            Playing...
          </button>
        )}
        {state.gameOver && (
          <button className={styles.secondaryButton} onClick={onReset}>
            Play Again
          </button>
        )}
      </div>

      {/* Game over modal */}
      {state.gameOver && (
        <div className={styles.gameOverModal}>
          <div className={styles.modalContent}>
            <h2 className={styles.modalTitle}>
              {state.winner === 'player' ? '🎉 Victory!' : '❌ Game Over'}
            </h2>
            <div className={styles.stats}>
              <div className={styles.stat}>
                <span className={styles.label}>Final Score</span>
                <span className={styles.value}>{state.score}</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.label}>Rounds</span>
                <span className={styles.value}>{state.currentRound - 1}</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.label}>Reason</span>
                <span className={styles.value}>{state.gameOverReason || 'Unknown'}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Rules Modal */}
      <RulesModal
        isOpen={showRules}
        onClose={onCloseRules}
        rules={rules}
        variant={ruleVariantFromConfig(rules)}
      />
    </div>
  )
}

function ruleVariantFromConfig(rules: SimonRuleConfig): string {
  if (rules.playerAddsMode) return 'PLAYER_ADDS'
  if (rules.multiplayerMode) return 'MULTIPLAYER'
  if (rules.inputTimeoutMs === 3000) return 'TIMED_MODE'
  if (rules.inputMode === 'gesture') return 'SIMON_AIR'
  if (rules.inputMode === 'swipe') return 'SIMON_SWIPE'
  return 'CLASSIC'
}
