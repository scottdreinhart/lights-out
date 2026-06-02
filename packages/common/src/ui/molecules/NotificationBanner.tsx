import styles from './NotificationBanner.module.css'

export type NotificationBannerVariant =
  | 'win'
  | 'loss'
  | 'draw'
  | 'countdown'
  | 'info'
  | 'setup'
  | 'turn'
  | 'sink'

interface NotificationBannerProps {
  message: string
  variant?: NotificationBannerVariant
  notificationKey?: string | number
  layout?: 'overlay' | 'inline'
  onAction?: () => void
  actionLabel?: string
  className?: string
  role?: 'status' | 'alert'
  ariaLive?: 'off' | 'polite' | 'assertive'
}

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(' ')
}

export function NotificationBanner({
  message,
  variant = 'info',
  notificationKey,
  layout = 'inline',
  onAction,
  actionLabel = 'Reset Now',
  className,
  role = 'status',
  ariaLive = 'polite',
}: NotificationBannerProps) {
  return (
    <div
      key={notificationKey}
      className={cx(
        styles.root,
        layout === 'overlay' ? styles.overlay : styles.inline,
        styles[variant],
        className,
      )}
      role={role}
      aria-live={ariaLive}
      aria-atomic="true"
    >
      <p className={styles.message}>{message}</p>
      {onAction && (
        <button type="button" className={styles.action} onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  )
}

export type { NotificationBannerProps }