/**
 * Farkle game board component
 * Uses @games/ui-dice-system for dice rendering and selection
 */

import { DiceArea, SelectedDice } from '@games/ui-dice-system'
import type { DieValue } from '@games/common'
import { useResponsiveState } from '@games/app-hook-utils'
import styles from './GameBoard.module.css'

interface GameBoardProps {
  allDice: DieValue[]
  selectedIndices: Set<number>
  heldDice: DieValue[]
  bankedScore: number
  atRiskScore: number
  isRolling: boolean
  phase: 'rolling' | 'selecting' | 'banking'
  humanScore: number
  cpuScore: number
  currentPlayer: 'human' | 'cpu'
  onDieClick: (index: number) => void
  onRoll: () => void
  onBank: () => void
  onEndTurn: () => void
}

export function GameBoard({
  allDice,
  selectedIndices,
  heldDice,
  bankedScore,
  atRiskScore,
  isRolling,
  phase,
  humanScore,
  cpuScore,
  currentPlayer,
  onDieClick,
  onRoll,
  onBank,
  onEndTurn,
}: GameBoardProps) {
  const { isMobile, isDesktop } = useResponsiveState()
  const selectedDice = Array.from(selectedIndices).map((i) => allDice[i])
  const displayDice = allDice.filter((_, i) => !selectedIndices.has(i))

  const feedback =
    phase === 'selecting' && displayDice.length > 0
      ? {
          type: ('success' as const),
          text: atRiskScore > 0 ? `+${atRiskScore} points at risk` : 'Select scoreable dice',
        }
      : phase === 'rolling'
        ? { type: ('neutral' as const), text: 'Roll the dice!' }
        : { type: ('warning' as const), text: `Banking: ${bankedScore} points` }

  return (
    <div className={styles.root}>
      {/* Score display */}
      <div className={styles.scoreBoard}>
        <div className={styles.score}>
          <div className={styles.label}>You</div>
          <div className={styles.value}>{humanScore}</div>
        </div>
        <div className={styles.divider} />
        <div className={styles.score}>
          <div className={styles.label}>CPU</div>
          <div className={styles.value}>{cpuScore}</div>
        </div>
      </div>

      {/* Current phase info */}
      <div className={styles.phaseInfo}>
        <h2>
          {currentPlayer === 'human' ? 'Your Turn' : "CPU's Turn"}
        </h2>
        {phase === 'selecting' && (
          <p>Select dice to score: {selectedDice.length > 0 ? `${selectedDice.length} selected` : 'None yet'}</p>
        )}
      </div>

      {/* Dice area - unselected dice */}
      <div className={styles.diceSection}>
        <label>Roll ({displayDice.length})</label>
        <DiceArea
          dice={displayDice.length > 0 ? displayDice : null}
          isRolling={isRolling}
          feedback={feedback}
          dieSize={isMobile ? 56 : isDesktop ? 80 : 68}
          onDieClick={currentPlayer === 'human' && phase === 'selecting' ? onDieClick : undefined}
          emptySlots={6}
        />
      </div>

      {/* Selected dice - being scored */}
      {selectedDice.length > 0 && (
        <div className={styles.selectedSection}>
          <label>Selected for Scoring</label>
          <SelectedDice
            dice={selectedDice}
            dieSize={isMobile ? 56 : isDesktop ? 80 : 68}
            label={`Score: ${atRiskScore} points`}
          />
        </div>
      )}

      {/* Held dice display */}
      {heldDice.length > 0 && (
        <div className={styles.heldSection}>
          <label>Held Dice ({heldDice.length})</label>
          <SelectedDice
            dice={heldDice}
            dieSize={isMobile ? 48 : 64}
            label="Banked"
          />
        </div>
      )}

      {/* Scoring summary */}
      <div className={styles.scoringSummary}>
        <div className={styles.scoreItem}>
          <span>Banked This Round:</span>
          <strong>{bankedScore}</strong>
        </div>
        {atRiskScore > 0 && (
          <div className={styles.scoreItem} style={{ color: '#ff9800' }}>
            <span>At Risk:</span>
            <strong>{atRiskScore}</strong>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className={styles.actions}>
        {phase === 'rolling' && (
          <button onClick={onRoll} className={styles.primaryButton}>
            🎲 Roll
          </button>
        )}

        {phase === 'selecting' && selectedDice.length > 0 && (
          <>
            <button onClick={onBank} className={styles.secondaryButton}>
              ✓ Score
            </button>
            <button onClick={onRoll} className={styles.tertiaryButton}>
              Roll Remaining
            </button>
          </>
        )}

        {phase === 'banking' && (
          <>
            <button onClick={onEndTurn} className={styles.primaryButton}>
              ✓ End Turn (Bank {bankedScore})
            </button>
            <button onClick={onRoll} className={styles.secondaryButton}>
              Roll Again
            </button>
          </>
        )}
      </div>

      {/* AI Player indicator */}
      {currentPlayer === 'cpu' && (
        <div className={styles.aiIndicator}>
          CPU is thinking... <span className={styles.spinner}>⌛</span>
        </div>
      )}
    </div>
  )
}
