import styles from './PressureMeter.module.css'

interface PressureMeterProps {
  pressure: number
  lockdownTicksRemaining: number | null
}

export const PressureMeter = ({ pressure, lockdownTicksRemaining }: PressureMeterProps) => {
  const fillClass =
    pressure >= 75 ? styles.fillHigh : pressure >= 40 ? styles.fillMedium : styles.fillLow

  return (
    <div className={styles.container}>
      <div className={styles.row}>
        <span className={styles.label}>Pressure</span>
        <strong className={styles.value}>{Math.round(pressure)}%</strong>
      </div>
      <div className={styles.track} aria-label="Pressure meter">
        <div className={`${styles.fill} ${fillClass}`} style={{ width: `${pressure}%` }} />
      </div>
      <p className={styles.caption}>
        {lockdownTicksRemaining !== null
          ? `LOCKDOWN: ${Math.max(0, lockdownTicksRemaining)} ticks remaining`
          : pressure >= 75
            ? 'Warning: security escalation active'
            : 'Steady intrusion pressure'}
      </p>
    </div>
  )
}
