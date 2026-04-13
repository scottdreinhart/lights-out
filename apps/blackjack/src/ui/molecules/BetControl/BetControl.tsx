import { CHIP_DENOMINATIONS } from '@/domain/constants'
import React, { useCallback, useMemo, useState } from 'react'
import styles from './BetControl.module.css'

export interface BetControlProps {
  /**
   * Current bet amount
   */
  currentBet: number
  /**
   * Minimum bet allowed
   */
  minBet: number
  /**
   * Maximum bet allowed
   */
  maxBet: number
  /**
   * Player balance (available to bet)
   */
  balance: number
  /**
   * Called when player places bet
   */
  onBet: (amount: number) => void
  /**
   * Is betting currently allowed?
   */
  disabled?: boolean
  /**
   * Optional: Chip denominations available at this table.
   * If provided, overrides the default CHIP_DENOMINATIONS.
   * Used for multi-table support (Casual, Mid, High Roller).
   */
  chipSet?: readonly number[]
}

/**
 * BetControl — Chip-based UI for placing bets.
 *
 * Shows current bet using casino chip denominations.
 * Default denominations: 1, 5, 10, 25, 50, 100, 500, 1000.
 * For multi-table support, accepts optional `chipSet` prop (e.g., Casual, Mid, High Roller).
 *
 * Players click chip buttons to add to their bet. Click again with less chips to reduce.
 * Phase 1: Click-based chip selection (COMPLETE).
 * Phase 2 (future): Drag-and-drop chip interface.
 */
export const BetControl = React.memo<BetControlProps>(
  ({ currentBet, minBet, maxBet, balance, onBet, disabled = false, chipSet }) => {
    const [tempBet, setTempBet] = useState(currentBet)

    // Use provided chipSet or fall back to defaults
    const _chipSet = useMemo(() => chipSet || CHIP_DENOMINATIONS, [chipSet])

    /**
     * Add a chip denomination to current bet
     */
    const addChip = useCallback(
      (denomination: number) => {
        const newBet = tempBet + denomination
        if (newBet <= maxBet && newBet <= balance) {
          setTempBet(newBet)
        }
      },
      [tempBet, maxBet, balance],
    )

    /**
     * Remove a chip denomination from current bet
     */
    const _removeChip = useCallback(
      (denomination: number) => {
        const newBet = Math.max(0, tempBet - denomination)
        setTempBet(newBet)
      },
      [tempBet],
    )

    /**
     * Clear all chips (reset bet to 0)
     */
    const clearBet = useCallback(() => {
      setTempBet(0)
    }, [])

    /**
     * Place the current bet
     */
    const handlePlaceBet = useCallback(() => {
      if (tempBet >= minBet && tempBet <= maxBet && tempBet <= balance) {
        onBet(tempBet)
      }
    }, [tempBet, minBet, maxBet, balance, onBet])

    /**
     * Quick double bet (multiply current tempBet by 2, respecting max)
     */
    const quickDouble = useCallback(() => {
      const newBet = Math.min(tempBet * 2, maxBet, balance)
      if (newBet >= minBet) {
        setTempBet(newBet)
      }
    }, [tempBet, maxBet, balance, minBet])

    /**
     * Quick repeat last bet (if currentBet exists, set temp to it)
     */
    const quickRepeat = useCallback(() => {
      if (currentBet >= minBet) {
        setTempBet(currentBet)
      }
    }, [currentBet, minBet])

    const isValidBet = tempBet >= minBet && tempBet <= maxBet && tempBet <= balance
    const insufficientBalance = tempBet > balance
    const belowMinimum = tempBet > 0 && tempBet < minBet
    const exceedsMaximum = tempBet > maxBet

    return (
      <div className={styles.root}>
        {/* Header: Balance and Limits */}
        <div className={styles.header}>
          <div className={styles.infoRow}>
            <span className={styles.label}>Balance:</span>
            <span className={styles.value}>${balance}</span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.label}>Min/Max:</span>
            <span className={styles.value}>
              ${minBet} — ${maxBet}
            </span>
          </div>
        </div>

        {/* Bet Display */}
        <div className={styles.betDisplay}>
          <span className={styles.label}>Current Bet</span>
          <div className={styles.betAmount}>${tempBet}</div>
          {insufficientBalance && <div className={styles.error}>Exceeds balance</div>}
          {belowMinimum && <div className={styles.error}>Below minimum bet</div>}
          {exceedsMaximum && <div className={styles.error}>Exceeds maximum bet</div>}
        </div>

        {/* Chip Button Grid */}
        <div className={styles.chipGrid}>
          {_chipSet.map((denomination) => (
            <div key={denomination} className={styles.chipButtonGroup}>
              <button
                className={`${styles.chipButton} ${styles[`chip${denomination}`]}`}
                onClick={() => addChip(denomination)}
                disabled={
                  disabled || tempBet + denomination > maxBet || tempBet + denomination > balance
                }
                title={`Add $${denomination} chip`}
                aria-label={`Add ${denomination} dollar chip`}
              >
                <div className={styles.chipValue}>${denomination}</div>
              </button>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className={styles.buttonRow}>
          <button
            className={styles.secondaryButton}
            onClick={quickRepeat}
            disabled={disabled || currentBet === 0}
            title="Repeat last bet"
          >
            Repeat
          </button>
          <button
            className={styles.secondaryButton}
            onClick={quickDouble}
            disabled={disabled || tempBet === 0 || tempBet * 2 > maxBet || tempBet * 2 > balance}
            title="Double the current bet"
          >
            ×2
          </button>
          <button
            className={styles.dangerButton}
            onClick={clearBet}
            disabled={disabled || tempBet === 0}
            title="Clear all chips"
          >
            Clear
          </button>
        </div>

        {/* Place Bet Button */}
        <button
          className={styles.placeBetButton}
          onClick={handlePlaceBet}
          disabled={disabled || !isValidBet}
          title={isValidBet ? 'Place bet and start dealing' : 'Invalid bet amount'}
        >
          Place Bet ${tempBet}
        </button>
      </div>
    )
  },
)

BetControl.displayName = 'BetControl'
