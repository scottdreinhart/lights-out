import React, { useEffect, useRef } from 'react'

import type { Notification } from '../../domain/types.ts'
import { cx } from '../utils/cssModules.ts'
import styles from './NotificationBanner.module.css'

interface NotificationBannerProps {
  notification: Notification | null
  onDismiss: () => void
  onAction?: () => void
}

const NotificationBanner: React.FC<NotificationBannerProps> = ({
  notification,
  onDismiss,
  onAction,
}) => {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const nId = notification?.id
  const nDuration = notification?.duration ?? 0

  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }

    if (!nId || nDuration <= 0) {
      return
    }

    timerRef.current = setTimeout(onDismiss, nDuration)

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
        timerRef.current = null
      }
    }
  }, [nId, nDuration, onDismiss])

  if (!notification) {
    return null
  }

  return (
    <div
      className={cx(
        styles.root,
        notification.variant === 'win' && styles.win,
        notification.variant === 'loss' && styles.loss,
        notification.variant === 'draw' && styles.draw,
        notification.variant === 'countdown' && styles.countdown,
        notification.variant === 'info' && styles.info,
      )}
      role="status"
      aria-live="polite"
      aria-atomic="true"
      key={notification.id}
    >
      <p className={styles.message}>{notification.message}</p>
      {notification.hasAction && onAction && (
        <button type="button" className={styles.action} onClick={onAction}>
          Reset Now
        </button>
      )}
    </div>
  )
}

export default NotificationBanner
