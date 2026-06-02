/**
 * PlayerSetupForm — Test component for form validation framework
 * Demonstrates form validation in checkers app (turn-based game)
 */

import React from 'react'
import {
  useFormValidation,
  ValidationSchema,
  ValidationError,
} from '@games/ui-utils'
import styles from './PlayerSetupForm.module.css'

export interface PlayerSetupFormProps {
  onSubmit?: (values: { player1: string; player2: string }) => void
  onCancel?: () => void
}

export function PlayerSetupForm({
  onSubmit,
  onCancel,
}: PlayerSetupFormProps) {
  const { values, errors, touched, handleSubmit, reset } = useFormValidation(
    { player1: '', player2: '' },
    {
      player1: [
        ValidationSchema.required('Player 1 name is required'),
        ValidationSchema.minLength(2, 'Minimum 2 characters'),
        ValidationSchema.maxLength(15, 'Maximum 15 characters'),
      ],
      player2: [
        ValidationSchema.required('Player 2 name is required'),
        ValidationSchema.minLength(2, 'Minimum 2 characters'),
        ValidationSchema.maxLength(15, 'Maximum 15 characters'),
        ValidationSchema.custom(
          (value) => value !== values.player1,
          'Player names must be different',
        ),
      ],
    },
    async (values) => {
      console.log('Players registered:', values)
      onSubmit?.(values)
      reset()
    },
  )

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h2 className={styles.title}>Checkers Setup</h2>
      <p className={styles.subtitle}>Enter player names to begin</p>

      <div className={styles.field}>
        <label htmlFor="player1" className={styles.label}>
          Player 1
        </label>
        <input
          id="player1"
          type="text"
          value={values.player1}
          placeholder="Red player name"
          className={`${styles.input} ${errors.player1 ? styles.error : ''}`}
        />
        {touched.player1 && errors.player1 && (
          <ValidationError errors={errors.player1} />
        )}
      </div>

      <div className={styles.field}>
        <label htmlFor="player2" className={styles.label}>
          Player 2
        </label>
        <input
          id="player2"
          type="text"
          value={values.player2}
          placeholder="Black player name"
          className={`${styles.input} ${errors.player2 ? styles.error : ''}`}
        />
        {touched.player2 && errors.player2 && (
          <ValidationError errors={errors.player2} />
        )}
      </div>

      <div className={styles.actions}>
        <button type="submit" className={styles.playButton}>
          Play
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
