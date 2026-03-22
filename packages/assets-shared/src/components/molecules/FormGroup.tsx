import React, { forwardRef } from 'react'
import clsx from 'clsx'
import styles from './FormGroup.module.css'

export interface FormGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string
  error?: string
  required?: boolean
  children: React.ReactNode
  labelHtmlFor?: string
}

/**
 * FormGroup molecule — label + input wrapper with consistent spacing, error handling,
 * and a11y markup. Reused across forms in all applications.
 */
export const FormGroup = forwardRef<HTMLDivElement, FormGroupProps>(
  (
    {
      className,
      label,
      error,
      required = false,
      children,
      labelHtmlFor,
      ...rest
    },
    ref,
  ) => {
    return (
      <div ref={ref} className={clsx(styles.group, className, { [styles.error]: !!error })} {...rest}>
        <label htmlFor={labelHtmlFor} className={styles.label}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
        <div className={styles.inputWrapper}>{children}</div>
        {error && <div className={styles.errorMessage}>{error}</div>}
      </div>
    )
  },
)

FormGroup.displayName = 'FormGroup'
