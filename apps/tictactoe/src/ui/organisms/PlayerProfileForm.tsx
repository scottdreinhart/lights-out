/**
 * PlayerProfileForm — Test component for form validation framework  
 * Demonstrates form validation in tictactoe app
 */

import React from 'react'
import {
  useFormValidation,
  ValidationSchema,
  ValidationError,
} from '@games/ui-utils'
import styles from './PlayerProfileForm.module.css'

export interface PlayerProfileFormProps {
  onSubmit?: (values: { username: string; email: string }) => void
  onCancel?: () => void
}

export function PlayerProfileForm({
  onSubmit,
  onCancel,
}: PlayerProfileFormProps) {
  const { values, errors, touched, handleSubmit, reset } = useFormValidation(
    { username: '', email: '' },
    {
      username: [
        ValidationSchema.required('Username is required'),
        ValidationSchema.minLength(3, 'Minimum 3 characters'),
        ValidationSchema.maxLength(20, 'Maximum 20 characters'),
        ValidationSchema.pattern(
          /^[a-zA-Z0-9_\-]+$/,
          'Only alphanumeric, underscore, and hyphen allowed',
        ),
      ],
      email: [
        ValidationSchema.required('Email is required'),
        ValidationSchema.email('Invalid email format'),
      ],
    },
    async (values) => {
      console.log('Profile updated:', values)
      onSubmit?.(values)
      reset()
    },
  )

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h2 className={styles.title}>Player Profile</h2>
      <p className={styles.subtitle}>Update your profile information</p>

      <div className={styles.field}>
        <label htmlFor="username" className={styles.label}>
          Username
        </label>
        <input
          id="username"
          type="text"
          value={values.username}
          placeholder="Enter username"
          className={`${styles.input} ${errors.username ? styles.error : ''}`}
        />
        {touched.username && errors.username && (
          <ValidationError errors={errors.username} />
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
          placeholder="your@email.com"
          className={`${styles.input} ${errors.email ? styles.error : ''}`}
        />
        {touched.email && errors.email && (
          <ValidationError errors={errors.email} severity="warning" />
        )}
      </div>

      <div className={styles.actions}>
        <button type="submit" className={styles.saveButton}>
          Save Profile
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
