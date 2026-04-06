import type { Board } from '@/domain'
import { SHIP_DEFS } from '@/domain'

import { cx } from '@/ui/utils/cssModules'
import styles from './ShipList.module.css'

interface ShipListProps {
  readonly board: Board
  readonly label: string
  readonly owner?: 'player' | 'cpu'
}

export function ShipList({ board, label, owner }: ShipListProps) {
  // Helper to check if a cell is a hit
  const isHit = (cellState: string) => cellState === 'playerHit' || cellState === 'cpuHit'

  return (
    <div className={styles.list}>
      <h3 className={styles.heading}>{label}</h3>
      {SHIP_DEFS.map((def) => {
        const ship = board.ships.find(
          (s) => s.def.name === def.name && (!owner || s.owner === owner),
        )
        const isSunk =
          ship !== undefined && ship.cells.every((c) => isHit(board.grid[c.row][c.col]))
        return (
          <div key={def.name} className={cx(styles.ship, isSunk && styles.sunk)}>
            <span className={styles.name}>{def.name}</span>
            <span className={styles.dots}>
              {Array.from({ length: def.length }, (_, i) => (
                <span key={i} className={styles.dot} />
              ))}
            </span>
          </div>
        )
      })}
    </div>
  )
}
