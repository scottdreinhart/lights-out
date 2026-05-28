/**
 * BetConfigForm — Test component for form validation framework
 * Demonstrates form validation in blackjack app
 */

import React from 'react'
import {
  useFormValidation,
  ValidationSchema,
  ValidationError,
} from '@games/ui-utils'
import styles from './BetConfigForm.module.css'

export interface BetConfigFormProps {
  minBet?: number
  maxBet?: number
  onSubmit?: (values: { playerName: string; betAmount: string }) => void
  onCancel?: () => void
}

export function BetConfigForm({
  minBet = 10,
  maxBet = 1000,
  onSubmit,
  onCancel,
}: BetConfigFormProps) {
  const { values, errors, touched, handleSubmit, reset } = useFormValidation(
    { playerName: '', betAmount: '50' },
    {
      playerName: [
        ValidationSchema.required('Player name is required'),
        ValidationSchema.minLength(2, 'Minimum 2 characters'),
        ValidationSchema.maxLength(30, 'Maximum 30 characters'),
      ],
      betAmount: [
        ValidationSchema.required('Bet amount is required'),
        ValidationSchema.numeric('Must be a number'),
        ValidationSchema.custom(
          (value) => {
            const num = parseInt(value)
            return num >= minBet && num <= maxBet
          },
          `Bet must be between ${minBet} and ${maxBet}`,
        ),
      ],
    },
    async (values) => {
      console.log('Game started:', values)
      onSubmit?.(values)
      reset()
    },
  )

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h2 className={styles.title}>♠️ Blackjack ♠️</h2>
      <p className={styles.subtitle}>Configure your bet</p>

      <div className={styles.field}>
        <label htmlFor="playerName" className={styles.label}>
          Player Name
        </label>
        <input
          id="playerName"
          type="text"
          value={values.playerName}
          placeholder="Your name"
          className={`${styles.input} ${errors.playerName ? styles.error : ''}`}
        />
        {touched.playerName && errors.playerName && (
          <ValidationError errors={errors.playerName} />
        )}
      </div>

      <div className={styles.field}>
        <label htmlFor="betAmount" className={styles.label}>
          Bet Amount (${minBet} - ${maxBet})
        </label>
        <input
          id="betAmount"
          type="number"
          value={values.betAmount}
          min={minBet}
          max={maxBet}
          className={`${styles.input} ${errors.betAmount ? styles.error : ''}`}
        />
        {touched.betAmount && errors.betAmount && (
          <ValidationError errors={errors.betAmount} severity="error" />
        )}
      </div>

      <div className={styles.actions}>
        <button type="submit" className={styles.dealButton}>
          Deal Hand
        </button>
        <button
          type="button"
          onClick={() => {
            onCancel?.()
            reset()
          }}
          className={styles.cancelButton}
        >
          Cancel
        </button>
      </div>

      <p className={styles.info}>
        ✅ Form validation from @games/ui-utils (Phase 8.3)
      </p>
    </form>
  )
}
