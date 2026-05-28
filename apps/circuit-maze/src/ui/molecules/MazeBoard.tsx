import type { GameState, Position } from '@/domain'
import { tileAt } from '@/domain'
import { MazeCell } from '@/ui/atoms'
import { useMemo } from 'react'
import styles from './MazeBoard.module.css'

interface MazeBoardProps {
  state: GameState
}

const keyFor = (position: Position): string => `${position.x}:${position.y}`

export const MazeBoard = ({ state }: MazeBoardProps) => {
  const nodeSet = useMemo(
    () => new Set(state.nodesRemaining.map((position) => keyFor(position))),
    [state.nodesRemaining],
  )

  const sentinelSet = useMemo(
    () => new Set(state.sentinels.map((sentinel) => keyFor(sentinel.position))),
    [state.sentinels],
  )

  const gridColumns = state.level.layout[0]?.length ?? 1

  return (
    <section className={styles.boardWrap} aria-label="Maze board">
      <div
        className={styles.board}
        style={{ gridTemplateColumns: `repeat(${gridColumns}, minmax(0, 1fr))` }}
      >
        {state.level.layout.map((row, y) =>
          row.split('').map((_, x) => {
            const position = { x, y }
            const key = keyFor(position)
            const hasNode = nodeSet.has(key)
            const hasSentinel = sentinelSet.has(key)
            const hasPlayer = state.player.position.x === x && state.player.position.y === y
            const tile = tileAt(state.level, position)

            return (
              <MazeCell
                key={key}
                tile={tile}
                hasNode={hasNode}
                hasPlayer={hasPlayer}
                hasSentinel={hasSentinel}
                isExitUnlocked={state.exitUnlocked}
              />
            )
          }),
        )}
      </div>
    </section>
  )
}
