import type { Tile } from '@/domain'
import { TileComponent } from '@/ui/atoms'
import styles from './TileGrid.module.css'

interface TileGridProps {
  tiles: Record<Tile, boolean>
  selectedTiles: Tile[]
  onTileClick: (tile: Tile) => void
  validMoves?: Tile[][]
  disabled?: boolean
}

export function TileGrid({
  tiles,
  selectedTiles,
  onTileClick,
  validMoves = [],
  disabled = false,
}: TileGridProps) {
  const tileNumbers = (Object.keys(tiles) as unknown as Tile[]).sort((a, b) => a - b)

  const validTiles = new Set<Tile>()
  validMoves.forEach((move) => {
    move.forEach((tile) => validTiles.add(tile))
  })

  return (
    <div className={styles.grid}>
      {tileNumbers.map((tile) => (
        <TileComponent
          key={tile}
          number={tile}
          isOpen={tiles[tile]}
          isSelected={selectedTiles.includes(tile)}
          isValidMove={validTiles.has(tile) && tiles[tile]}
          onClick={() => !disabled && tiles[tile] && onTileClick(tile)}
        />
      ))}
    </div>
  )
}
