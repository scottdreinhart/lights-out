/**
 * ShipPlacementForm — Test component for form validation framework
 * Demonstrates form validation in battleship app
 */

import React, { useState } from 'react'
import {
  useFormValidation,
  ValidationSchema,
  ValidationError,
} from '@games/ui-utils'
import styles from './ShipPlacementForm.module.css'

export interface ShipPlacementFormProps {
  onSubmit?: (values: { playerName: string; boardSize: string }) => void
  onCancel?: () => void
}

export function ShipPlacementForm({
  onSubmit,
  onCancel,
}: ShipPlacementFormProps) {
  const { values, errors, touched, handleSubmit, reset } = useFormValidation(
    { playerName: '', boardSize: '10' },
    {
      playerName: [
        ValidationSchema.required('Captain name is required'),
        ValidationSchema.minLength(2, 'Minimum 2 characters'),
        ValidationSchema.maxLength(25, 'Maximum 25 characters'),
      ],
      boardSize: [
        ValidationSchema.required('Select board size'),
        ValidationSchema.pattern(/^(8|10|12)$/, 'Board size must be 8, 10, or 12'),
      ],
    },
    async (values) => {
      console.log('Battle setup:', values)
      onSubmit?.(values)
      reset()
    },
  )

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h2 className={styles.title}>⚓ Battleship</h2>
      <p className={styles.subtitle}>Prepare for naval combat</p>

      <div className={styles.field}>
        <label htmlFor="playerName" className={styles.label}>
          Captain Name
        </label>
        <input
          id="playerName"
          type="text"
          value={values.playerName}
          placeholder="Admiral, Commander, etc."
          className={`${styles.input} ${errors.playerName ? styles.error : ''}`}
        />
        {touched.playerName && errors.playerName && (
          <ValidationError errors={errors.playerName} severity="warning" />
        )}
      </div>

      <div className={styles.field}>
        <label htmlFor="boardSize" className={styles.label}>
          Battle Grid Size
        </label>
        <select
          id="boardSize"
          value={values.boardSize}
          className={`${styles.select} ${errors.boardSize ? styles.error : ''}`}
        >
          <option value="8">8×8 (Beginner)</option>
          <option value="10">10×10 (Standard)</option>
          <option value="12">12×12 (Expert)</option>
        </select>
        {touched.boardSize && errors.boardSize && (
          <ValidationError errors={errors.boardSize} severity="error" />
        )}
      </div>

      <div className={styles.actions}>
        <button type="submit" className={styles.battleButton}>
          Set Sail
        </button>
        <button
          type="button"
          onClick={() => {
            onCancel?.()
            reset()
          }}
          className={styles.cancelButton}
        >
          Harbor
        </button>
      </div>

      <p className={styles.info}>
        ✅ Form validation from @games/ui-utils (Phase 8.3)
      </p>
    </form>
  )
}
