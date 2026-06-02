import styles from './HudPill.module.css'

interface HudPillProps {
  label: string
  value: string
}

export const HudPill = ({ label, value }: HudPillProps) => {
  return (
    <div className={styles.pill}>
      <span className={styles.label}>{label}</span>
      <strong className={styles.value}>{value}</strong>
    </div>
  )
}
