import type { BingoCard as BingoCardType } from '@/domain'

interface BingoCardProps {
  card: BingoCardType
  patterns?: string[]
  hintPositions?: { row: number; col: number }[]
  showHints?: boolean
}

function hasHint(
  hintPositions: { row: number; col: number }[],
  row: number,
  col: number,
  showHints: boolean,
): boolean {
  return showHints && hintPositions.some((position) => position.row === row && position.col === col)
}

export function BingoCard({
  card,
  patterns = [],
  hintPositions = [],
  showHints = false,
}: BingoCardProps) {
  return (
    <section
      className={`bingo-card ${patterns.length > 0 ? 'winner' : ''}`}
      aria-label="Bingo card"
    >
      <div className="bingo-head">
        {['B', 'I', 'N', 'G', 'O'].map((letter) => (
          <div key={letter} className="bingo-head-cell">
            {letter}
          </div>
        ))}
      </div>
      <div className="bingo-grid">
        {card.grid.flatMap((row, rowIndex) =>
          row.map((cell, colIndex) => {
            const isHint = hasHint(hintPositions, rowIndex, colIndex, showHints)
            const classes = ['bingo-cell']
            if (cell.marked) {
              classes.push('marked')
            }
            if (cell.isFreeSpace) {
              classes.push('free')
            }
            if (isHint) {
              classes.push('hint')
            }

            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={classes.join(' ')}
                aria-label={
                  cell.isFreeSpace
                    ? `Free space, ${cell.marked ? 'marked' : 'unmarked'}`
                    : `Number ${cell.number}, ${cell.marked ? 'marked' : 'unmarked'}`
                }
              >
                {cell.isFreeSpace ? 'FREE' : cell.number}
              </div>
            )
          }),
        )}
      </div>
      {patterns.length > 0 && (
        <div className="winner-banner" role="status">
          BLACKOUT!
        </div>
      )}
    </section>
  )
}
