import { ActionButton } from '../atoms/ActionButton'

interface ActionButtonsProps {
  primaryLabel: string
  secondaryLabel: string
  tertiaryLabel: string
  onAction: (action: 'primary' | 'secondary' | 'tertiary') => void
  styles: Record<string, string>
}

export const ActionButtons = ({
  primaryLabel,
  secondaryLabel,
  tertiaryLabel,
  onAction,
  styles,
}: ActionButtonsProps) => (
  <div className={styles.actions}>
    <ActionButton label={primaryLabel} onClick={() => onAction('primary')} />
    <ActionButton label={secondaryLabel} onClick={() => onAction('secondary')} />
    <ActionButton label={tertiaryLabel} onClick={() => onAction('tertiary')} />
  </div>
)
