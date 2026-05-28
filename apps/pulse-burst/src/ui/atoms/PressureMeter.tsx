import styles from './PressureMeter.module.css'

interface PressureMeterProps {
  intensity: number
  speed: number
}

export const PressureMeter = ({ intensity, speed }: PressureMeterProps) => {
  const fillClass =
    intensity >= 75 ? styles.fillHigh : intensity >= 40 ? styles.fillMedium : styles.fillLow

  return (
    <div className={styles.container}>
      <div className={styles.row}>
        <span className={styles.label}>Intensity</span>
        <strong className={styles.value}>{Math.round(intensity)}%</strong>
      </div>
      <div className={styles.track} aria-label="Intensity meter">
        <div className={`${styles.fill} ${fillClass}`} style={{ width: `${intensity}%` }} />
      </div>
      <p className={styles.caption}>
        {intensity >= 75
          ? 'Critical lane pressure. Precision window is tight.'
          : intensity >= 40
            ? `Tempo rising. Scroll speed ${speed.toFixed(2)}`
            : `Stable run. Scroll speed ${speed.toFixed(2)}`}
      </p>
    </div>
  )
}
