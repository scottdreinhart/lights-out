import type { Board } from '@/domain'
import { SHIP_DEFS } from '@/domain'

import { cx } from '@/ui/utils/cssModules'
import styles from './ShipList.module.css'

interface ShipListProps {
  readonly board: Board
  readonly label: string
  readonly owner?: 'player' | 'cpu'
}

function buildHeadingId(label: string): string {
  return `${label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-ships`
}

export function ShipList({ board, label, owner }: ShipListProps) {
  const headingId = buildHeadingId(label)

  const isHitForOwner = (shipOwner: 'player' | 'cpu', cellState: string) => {
    return shipOwner === 'cpu' ? cellState === 'playerHit' : cellState === 'cpuHit'
  }

  const shipRows = SHIP_DEFS.map((def) => {
    const ship = board.ships.find((s) => s.def.name === def.name && (!owner || s.owner === owner))
    const hitCount = ship
      ? ship.cells.reduce(
          (total, c) => total + (isHitForOwner(ship.owner, board.grid[c.row][c.col]) ? 1 : 0),
          0,
        )
      : 0
    const isSunk = ship !== undefined && hitCount >= def.length

    return {
      def,
      hitCount,
      isSunk,
      remainingSegments: Math.max(0, def.length - hitCount),
    }
  })

  return (
    <section className={styles.list} aria-labelledby={headingId}>
      <h3 id={headingId} className={styles.heading}>
        {label}
      </h3>
      {shipRows.map(({ def, isSunk, remainingSegments }) => {
        return (
          <div key={def.name} className={cx(styles.ship, isSunk && styles.sunk)}>
            <span className={cx(styles.name, isSunk && styles.nameSunk)}>{def.name}</span>
            <span className={styles.dots} aria-hidden="true">
              {Array.from({ length: remainingSegments }, (_, i) => (
                <span key={i} className={cx(styles.dot, styles.dotIntact)} />
              ))}
            </span>
          </div>
        )
      })}
    </section>
  )
}
