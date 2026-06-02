import styles from './RunnerEntity.module.css'

interface RunnerEntityProps {
  kind: 'runner' | 'obstacle'
  heightPercent: number
  topPercent: number
  leftPercent: number
  widthPercent: number
}

export const RunnerEntity = ({
  kind,
  heightPercent,
  topPercent,
  leftPercent,
  widthPercent,
}: RunnerEntityProps) => {
  const classes =
    kind === 'runner' ? `${styles.cell} ${styles.runner}` : `${styles.cell} ${styles.obstacle}`

  return (
    <div
      className={classes}
      style={{
        height: `${heightPercent}%`,
        top: `${topPercent}%`,
        left: `${leftPercent}%`,
        width: `${widthPercent}%`,
      }}
      aria-hidden="true"
    />
  )
}
