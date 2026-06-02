/**
 * PlayerNameForm — Test component demonstrating form validation framework
 * 
 * This is a test component showing how to use the new validation framework
 * from @games/ui-utils. It validates player names with custom rules.
 */

import React from 'react'
import {
  useFormValidation,
  ValidationSchema,
  ValidationError,
} from '@games/ui-utils'
import styles from './PlayerNameForm.module.css'

export interface PlayerNameFormProps {
  onSubmit?: (values: { playerName: string; email: string }) => void
  onCancel?: () => void
}

export function PlayerNameForm({
  onSubmit,
  onCancel,
}: PlayerNameFormProps) {
  const { values, errors, touched, handleSubmit, reset, setValue, setTouched } = useFormValidation(
    { playerName: '', email: '' },
    {
      playerName: [
        ValidationSchema.required('Player name is required'),
        ValidationSchema.minLength(2, 'Name must be at least 2 characters'),
        ValidationSchema.maxLength(20, 'Name must be 20 characters or less'),
        ValidationSchema.pattern(
          /^[a-zA-Z0-9_-]+$/,
          'Name can only contain letters, numbers, underscores, and hyphens',
        ),
      ],
      email: [
        ValidationSchema.required('Email is required'),
        ValidationSchema.email('Please enter a valid email address'),
      ],
    },
    async (values) => {
      console.log('Form submitted:', values)
      onSubmit?.(values)
      reset()
    },
  )

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h2 className={styles.title}>Player Registration</h2>

      <div className={styles.field}>
        <label htmlFor="playerName" className={styles.label}>
          Player Name
        </label>
        <input
          id="playerName"
          type="text"
          value={values.playerName}
          onChange={(e) => {
            const input = e.target as HTMLInputElement
            const value = input.value
            setValue('playerName', value)
          }}
          onBlur={(e) => {
            const input = e.target as HTMLInputElement
            setTouched('playerName', true)
          }}
          className={`${styles.input} ${errors.playerName ? styles.error : ''}`}
          placeholder="Enter your player name"
        />
        {touched.playerName && errors.playerName && (
          <ValidationError errors={errors.playerName} />
        )}
      </div>

      <div className={styles.field}>
        <label htmlFor="email" className={styles.label}>
          Email Address
        </label>
        <input
          id="email"
          type="email"
          value={values.email}
          onChange={(e) => {
            const input = e.target as HTMLInputElement
            setValue('email', input.value)
          }}
          className={`${styles.input} ${errors.email ? styles.error : ''}`}
          placeholder="Enter your email"
        />
        {touched.email && errors.email && (
          <ValidationError errors={errors.email} />
        )}
      </div>

      <div className={styles.actions}>
        <button type="submit" className={styles.submitButton}>
          Register
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

      <p className={styles.note}>
        ✅ This component demonstrates the new form validation framework from
        Phase 8.3
      </p>
    </form>
  )
}
