import { useSnakesAndLaddersGame } from '@/app'
import { BOARD_SIZE, LADDERS, SNAKES } from '@/domain'
import { SplashScreen } from '@/ui'
import { useCallback, useMemo, useState } from 'react'

interface CellData {
  number: number
  hasLadder: boolean
  hasSnake: boolean
  humanHere: boolean
  cpuHere: boolean
}

function buildBoardRows(humanPosition: number, cpuPosition: number): CellData[][] {
  const rows: CellData[][] = []

  for (let row = 9; row >= 0; row--) {
    const start = row * 10 + 1
    const numbers = Array.from({ length: 10 }, (_, index) => start + index)
    const serpentine = row % 2 === 0 ? numbers : numbers.reverse()

    rows.push(
      serpentine.map((number) => ({
        number,
        hasLadder: Boolean(LADDERS[number]),
        hasSnake: Boolean(SNAKES[number]),
        humanHere: humanPosition === number,
        cpuHere: cpuPosition === number,
      })),
    )
  }

  return rows
}

export function App() {
  const [showSplash, setShowSplash] = useState(true)
  const { state, isRolling, rollForHuman, resetGame } = useSnakesAndLaddersGame()

  const handleSplashComplete = useCallback(() => {
    setShowSplash(false)
  }, [])

  const human = state.players[0]
  const cpu = state.players[1]
  const boardRows = useMemo(
    () => buildBoardRows(human.position, cpu.position),
    [cpu.position, human.position],
  )

  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />
  }

  return (
    <div className="app">
      <header className="header">
        <h1>Snakes and Ladders</h1>
        <p className="subheading">Race to square {BOARD_SIZE}. Ladders help; snakes punish.</p>
      </header>

      <section className="statusCard" aria-live="polite">
        <p>
          <strong>Current turn:</strong> {state.players[state.currentPlayerIndex]?.name}
        </p>
        <p>
          <strong>You:</strong> {human.position} &nbsp;|&nbsp; <strong>CPU:</strong> {cpu.position}
        </p>
        {state.lastTurn && (
          <p>
            <strong>Last roll:</strong> {state.lastTurn.playerId === 'human' ? 'You' : 'CPU'} rolled{' '}
            {state.lastTurn.roll} and moved to {state.lastTurn.endPosition}
            {state.lastTurn.effect
              ? ` via ${state.lastTurn.effect.type} ${state.lastTurn.effect.from}→${state.lastTurn.effect.to}`
              : ''}
            {state.lastTurn.overshotFinish ? ' (overshot 100, stayed put)' : ''}
          </p>
        )}
        {state.phase === 'game-over' && (
          <p className="winnerMessage">
            Winner: <strong>{state.winnerName}</strong>
          </p>
        )}
      </section>

      <div className="controls">
        <button
          type="button"
          onClick={rollForHuman}
          disabled={
            isRolling ||
            state.phase !== 'playing' ||
            state.players[state.currentPlayerIndex]?.id !== 'human'
          }
        >
          {isRolling ? 'Rolling...' : 'Roll Dice'}
        </button>
        <button type="button" onClick={resetGame}>
          New Game
        </button>
      </div>

      <section className="board" role="grid" aria-label="Snakes and Ladders board">
        {boardRows.map((row, rowIndex) => (
          <div key={`row-${rowIndex}`} className="boardRow" role="row">
            {row.map((cell) => (
              <div
                key={cell.number}
                className="cell"
                role="gridcell"
                aria-label={`Square ${cell.number}`}
              >
                <span className="cellNumber">{cell.number}</span>
                <div className="cellBadges">
                  {cell.hasLadder && <span title="Ladder">🪜</span>}
                  {cell.hasSnake && <span title="Snake">🐍</span>}
                </div>
                <div className="tokens">
                  {cell.humanHere && <span className="token human">You</span>}
                  {cell.cpuHere && <span className="token cpu">CPU</span>}
                </div>
              </div>
            ))}
          </div>
        ))}
      </section>
    </div>
  )
}
