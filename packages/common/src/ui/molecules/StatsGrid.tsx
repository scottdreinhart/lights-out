import { StatTile } from '../atoms/StatTile'

interface StatsGridProps {
  score: number
  lives: number
  tick: number
  styles: Record<string, string>
}

export const StatsGrid = ({ score, lives, tick, styles }: StatsGridProps) => (
  <dl className={styles.stats}>
    <StatTile label="Score" value={score} />
    <StatTile label="Lives" value={lives} />
    <StatTile label="Tick" value={tick} />
  </dl>
)
