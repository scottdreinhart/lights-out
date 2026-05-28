import { ProgressMeter } from '../atoms/ProgressMeter'

interface ProgressMetersProps {
  intensity: number
  focus: number
  progress: number
  styles: Record<string, string>
}

export const ProgressMeters = ({ intensity, focus, progress, styles }: ProgressMetersProps) => (
  <div className={styles.meters}>
    <ProgressMeter
      fillClassName={styles.meterFillDanger}
      label="Intensity"
      styles={styles}
      value={intensity}
    />
    <ProgressMeter
      fillClassName={styles.meterFillFocus}
      label="Focus"
      styles={styles}
      value={focus}
    />
    <ProgressMeter
      fillClassName={styles.meterFillProgress}
      label="Progress"
      styles={styles}
      value={progress}
    />
  </div>
)
