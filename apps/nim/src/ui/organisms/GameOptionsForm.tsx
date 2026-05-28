/**
 * GameOptionsForm — Test component for form validation framework
 * Demonstrates form validation in nim app
 */

import React from 'react'
import {
  useFormValidation,
  ValidationSchema,
  ValidationError,
} from '@games/ui-utils'
import styles from './GameOptionsForm.module.css'

export interface GameOptionsFormProps {
  onSubmit?: (values: { playerName: string; difficulty: string }) => void
  onCancel?: () => void
}

export function GameOptionsForm({
  onSubmit,
  onCancel,
}: GameOptionsFormProps) {
  const { values, errors, touched, handleSubmit, reset } = useFormValidation(
    { playerName: '', difficulty: 'medium' },
    {
      playerName: [
        ValidationSchema.required('Player name is required'),
        ValidationSchema.minLength(2, 'Minimum 2 characters'),
        ValidationSchema.maxLength(20, 'Maximum 20 characters'),
        ValidationSchema.pattern(
          /^[a-zA-Z\s\-_]+$/,
          'Only letters, spaces, hyphens, and underscores allowed',
        ),
      ],
      difficulty: [ValidationSchema.required('Select difficulty')],
    },
    async (values) => {
      console.log('Game options selected:', values)
      onSubmit?.(values)
      reset()
    },
  )

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h2 className={styles.title}>Nim Game Setup</h2>
      <p className={styles.subtitle}>Configure your game</p>

      <div className={styles.field}>
        <label htmlFor="playerName" className={styles.label}>
          Your Name
        </label>
        <input
          id="playerName"
          type="text"
          value={values.playerName}
          placeholder="Enter your name"
          className={`${styles.input} ${errors.playerName ? styles.error : ''}`}
        />
        {touched.playerName && errors.playerName && (
          <ValidationError errors={errors.playerName} />
        )}
      </div>

      <div className={styles.field}>
        <label htmlFor="difficulty" className={styles.label}>
          Difficulty Level
        </label>
        <select
          id="difficulty"
          value={values.difficulty}
          className={`${styles.select} ${errors.difficulty ? styles.error : ''}`}
        >
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
          <option value="expert">Expert</option>
        </select>
        {touched.difficulty && errors.difficulty && (
          <ValidationError errors={errors.difficulty} />
        )}
      </div>

      <div className={styles.actions}>
        <button type="submit" className={styles.playButton}>
          Play Nim
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
