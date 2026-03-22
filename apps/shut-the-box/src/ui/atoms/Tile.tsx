import type { Tile } from '@/domain'
import { cx } from '@/ui/utils/cssModules'
import styles from './Tile.module.css'

interface TileProps {
  number: Tile
  isOpen: boolean
  isSelected: boolean
  isValidMove?: boolean
  onClick: () => void
}

export function TileComponent({
  number,
  isOpen,
  isSelected,
  isValidMove = false,
  onClick,
}: TileProps) {
  return (
    <div className={styles.tileContainer}>
      <button
        className={cx(
          styles.tile,
          !isOpen && styles.closed,
          isSelected && styles.selected,
          isValidMove && styles.validMove,
        )}
        onClick={onClick}
        disabled={!isOpen}
        aria-label={`Number ${number}, ${isOpen ? 'open' : 'closed'}, ${isSelected ? 'selected' : ''}`}
        aria-pressed={isSelected}
        type="button"
      >
        <div className={styles.tileInner}>
          <div className={styles.front} aria-hidden="true">
            {number}
          </div>
          <div className={styles.back} aria-hidden="true">
            Closed
          </div>
        </div>
      </button>
    </div>
  )
}
