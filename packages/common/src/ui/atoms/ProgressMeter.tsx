interface ProgressMeterProps {
  label: string
  value: number
  fillClassName: string
  styles: Record<string, string>
}

const meterStyle = (value: number) => ({ width: `${value}%` })

export const ProgressMeter = ({ label, value, fillClassName, styles }: ProgressMeterProps) => (
  <div className={styles.meterRow}>
    <span>{label}</span>
    <div className={styles.meterTrack}>
      <div className={fillClassName} style={meterStyle(value)} />
    </div>
  </div>
)
