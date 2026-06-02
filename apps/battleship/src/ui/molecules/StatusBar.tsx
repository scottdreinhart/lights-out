import { NotificationBanner } from '@games/common'
import styles from './StatusBar.module.css'

interface StatusBarProps {
  message: string
  phase: string
}

type BannerVariant = 'info' | 'setup' | 'turn' | 'sink' | 'win' | 'loss' | 'draw'

interface VariantRule {
  variant: BannerVariant
  match: (normalizedMessage: string) => boolean
}

const VARIANT_RULES: VariantRule[] = [
  { variant: 'draw', match: (text) => text.includes('draw') },
  { variant: 'sink', match: (text) => text.includes('sank') },
  {
    variant: 'setup',
    match: (text) =>
      text.includes('place your') ||
      text.includes('fire at enemy waters') ||
      text.includes("can't place"),
  },
  {
    variant: 'turn',
    match: (text) => text.includes('turn') || text.includes('hit') || text.includes('miss'),
  },
]

function getBannerVariant(message: string, phase: string): BannerVariant {
  const normalized = message.toLowerCase()

  if (phase === 'gameOver') {
    return normalized.includes('cpu wins') ? 'loss' : 'win'
  }

  const matchedRule = VARIANT_RULES.find((rule) => rule.match(normalized))
  return matchedRule?.variant ?? 'info'
}

export function StatusBar({ message, phase }: StatusBarProps) {
  const variant = getBannerVariant(message, phase)

  return (
    <div className={styles.host}>
      <NotificationBanner
        message={message}
        variant={variant}
        notificationKey={`${phase}-${message}`}
        layout="inline"
        role="status"
        ariaLive="polite"
      />
    </div>
  )
}
