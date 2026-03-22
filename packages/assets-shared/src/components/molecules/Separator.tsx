import React from 'react'
import clsx from 'clsx'
import styles from './Separator.module.css'

export interface SeparatorProps extends React.HTMLAttributes<HTMLHRElement> {
  variant?: 'line' | 'space'
}

/**
 * Separator molecule — divider line with consistent spacing.
 * Used to visually separate sections in settings, menus, and dialogs.
 */
export const Separator: React.FC<SeparatorProps> = ({ className, variant = 'line', ...rest }) => {
  return <hr className={clsx(styles.separator, styles[variant], className)} {...rest} />
}

Separator.displayName = 'Separator'
