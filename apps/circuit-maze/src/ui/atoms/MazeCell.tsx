import type { TileKind } from '@/domain'
import styles from './MazeCell.module.css'

interface MazeCellProps {
  tile: TileKind
  hasNode: boolean
  hasPlayer: boolean
  hasSentinel: boolean
  isExitUnlocked: boolean
}

export const MazeCell = ({
  tile,
  hasNode,
  hasPlayer,
  hasSentinel,
  isExitUnlocked,
}: MazeCellProps) => {
  const classes = [styles.cell]
  if (tile === 'wall') {
    classes.push(styles.wall)
  } else {
    classes.push(styles.floor)
  }
  if (tile === 'exit') {
    classes.push(isExitUnlocked ? styles.exitOpen : styles.exitLocked)
  }

  return (
    <div className={classes.join(' ')}>
      {hasNode && <span className={styles.node} aria-label="Energy node" />}
      {hasSentinel && <span className={styles.sentinel} aria-label="Sentinel" />}
      {hasPlayer && <span className={styles.player} aria-label="Player" />}
    </div>
  )
}
