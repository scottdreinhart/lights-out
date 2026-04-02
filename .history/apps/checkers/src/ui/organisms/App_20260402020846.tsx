import { useCallback, useEffect, useMemo, useState } from 'react'

import {
  computeAiMoveAsync,
  enableGameVerboseLogging,
  load,
  logGameEvent,
  save,
  useGameDebug,
  useResponsiveState,
  useSoundContext,
  useSoundEffects,
  useStats,
  useTheme,
  vibrate,
} from '@/app'
import {
  applyMove,
  countPieces,
  CPU_DELAY_MS,
  CPU_PLAYER,
  createInitialBoard,
  formatMove,
  getLegalMoves,
  getOpponent,
  getPieceAt,
  getWinner,
  HUMAN_PLAYER,
  isMoveForPosition,
  isMoveTarget,
  type Move,
  type OpponentMode,
  type Player,
  type Position,
} from '@/domain'
import { OfflineIndicator, SplashScreen } from '@/ui/atoms'
import { BoardView, ControlPanel } from '@/ui/molecules'

import styles from './App.module.css'

const OPPONENT_MODE_STORAGE_KEY = 'checkers:opponent-mode'
const createFreshBoard = () => createInitialBoard()

// Development: Uncomment to enable verbose game logging
// window.__checksVerboseLogging = true

export default function App() {
  const [showSplash, setShowSplash] = useState(true)
  const [board, setBoard] = useState(createFreshBoard)
  const [currentPlayer, setCurrentPlayer] = useState<Player>(HUMAN_PLAYER)
  const [opponentMode, setOpponentMode] = useState<OpponentMode>(() =>
    load<OpponentMode>(OPPONENT_MODE_STORAGE_KEY, 'cpu'),
  )
  const [selected, setSelected] = useState<Position | null>(null)
  const [winner, setWinner] = useState<Player | null>(null)
  const [lastMove, setLastMove] = useState<Move | null>(null)
  const [history, setHistory] = useState<string[]>([])

  const { stats, recordLoss, recordWin, resetStats } = useStats()
  const { soundEnabled, toggleSound } = useSoundContext()
  const { onClick, onConfirm, onCpuMove, onLose, onSelect, onWin } = useSoundEffects()
  const responsive = useResponsiveState()
  const {
    colorTheme,
    mode,
    colorblind,
    colorThemes,
    modes,
    colorblindModes,
    setColorTheme,
    setMode,
    setColorblind,
  } = useTheme()

  const legalMoves = useMemo(
    () => (winner ? [] : getLegalMoves(board, currentPlayer)),
    [board, currentPlayer, winner],
  )
  const selectedMoves = useMemo(
    () => (selected ? legalMoves.filter((move) => isMoveForPosition(move, selected)) : []),
    [legalMoves, selected],
  )
  const thinking = opponentMode === 'cpu' && currentPlayer === CPU_PLAYER && !winner
  const redPieces = countPieces(board, 'red')
  const blackPieces = countPieces(board, 'black')
  const mandatoryJump = legalMoves.some((move) => move.captures.length > 0)
  const currentPlayerLabel = currentPlayer === 'red' ? 'Red' : 'Black'
  const winnerLabel = winner === 'red' ? 'Red' : 'Black'

  const finishGame = useCallback(
    (nextWinner: Player) => {
      setWinner(nextWinner)
      setSelected(null)

      if (opponentMode === 'cpu') {
        if (nextWinner === HUMAN_PLAYER) {
          recordWin()
          onWin()
          return
        }

        recordLoss()
        onLose()
        return
      }

      if (nextWinner === HUMAN_PLAYER) {
        onWin()
        return
      }

      onLose()
    },
    [onLose, onWin, opponentMode, recordLoss, recordWin],
  )

  const commitMove = useCallback(
    (move: Move, player: Player) => {
      const result = applyMove(board, move)
      const nextBoard = result.board

      setBoard(nextBoard)
      setSelected(null)
      setLastMove(move)
      setHistory((previous) =>
        [`${player === 'red' ? 'Red' : 'Black'} ${formatMove(move)}`, ...previous].slice(0, 10),
      )

      const cpuTurn = opponentMode === 'cpu' && player === CPU_PLAYER

      if (!cpuTurn) {
        if (move.captures.length > 0) {
          vibrate([22, 28, 22])
        } else {
          vibrate(16)
        }
        onConfirm()
      } else {
        onCpuMove()
      }

      const nextWinner = getWinner(nextBoard)
      if (nextWinner) {
        finishGame(nextWinner)
        return
      }

      setCurrentPlayer(getOpponent(player))
    },
    [board, finishGame, onConfirm, onCpuMove, opponentMode],
  )

  useEffect(() => {
    if (!selected) {
      return
    }

    const pieceStillMovable = legalMoves.some((move) => isMoveForPosition(move, selected))
    if (!pieceStillMovable) {
      setSelected(null)
    }
  }, [legalMoves, selected])

  useEffect(() => {
    if (!thinking) {
      return
    }

    let cancelled = false

    const timeoutId = window.setTimeout(() => {
      computeAiMoveAsync(board, CPU_PLAYER).then((move) => {
        if (cancelled) {
          return
        }

        if (!move) {
          finishGame(HUMAN_PLAYER)
          return
        }

        commitMove(move, CPU_PLAYER)
      })
    }, CPU_DELAY_MS)

    return () => {
      cancelled = true
      window.clearTimeout(timeoutId)
    }
  }, [board, commitMove, finishGame, thinking])

  useEffect(() => {
    save<OpponentMode>(OPPONENT_MODE_STORAGE_KEY, opponentMode)
  }, [opponentMode])

  const handleSquarePress = (position: Position) => {
    if (winner || thinking) {
      return
    }

    const piece = getPieceAt(board, position)
    if (piece?.player === currentPlayer) {
      if (selected && selected.row === position.row && selected.col === position.col) {
        setSelected(null)
        return
      }

      const hasMove = legalMoves.some((move) => isMoveForPosition(move, position))
      if (hasMove) {
        setSelected(position)
        onSelect()
      }
      return
    }

    if (!selected) {
      return
    }

    const chosenMove = selectedMoves.find((move) => isMoveTarget(move, position))
    if (!chosenMove) {
      return
    }

    commitMove(chosenMove, currentPlayer)
  }

  const resetGame = useCallback((nextMode: OpponentMode) => {
    setBoard(createFreshBoard())
    setCurrentPlayer(HUMAN_PLAYER)
    setOpponentMode(nextMode)
    setSelected(null)
    setWinner(null)
    setLastMove(null)
    setHistory([])
  }, [])

  const handleNewGame = () => {
    resetGame(opponentMode)
    onClick()
  }

  const handleOpponentModeChange = (nextMode: OpponentMode) => {
    resetGame(nextMode)
    onClick()
  }

  const status = winner
    ? opponentMode === 'cpu'
      ? winner === HUMAN_PLAYER
        ? 'You cleared the board. Victory.'
        : 'The CPU locked you out. Defeat.'
      : `${winnerLabel} wins the local match.`
    : thinking
      ? 'CPU is planning the next jump.'
      : mandatoryJump
        ? `${currentPlayerLabel} must take the available capture.`
        : selected
          ? 'Choose a destination square.'
          : `${currentPlayerLabel} to move.`

  const instructions = (): string | null => {
    if (selected) return null
    if (thinking) return null
    if (winner) return null
    return mandatoryJump
      ? `If a jump exists, you must take it.`
      : 'Select a red piece, then choose its destination.'
  }

  return (
    <>
      {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
      <div
        className={[
          styles.app,
          responsive.compactViewport ? styles.compact : '',
          responsive.shortViewport ? styles.short : '',
          responsive.touchOptimized ? styles.touchOptimized : '',
          responsive.ultrawideViewport ? styles.ultrawide : '',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <OfflineIndicator />
        <main className={styles.frame}>
          <header className={styles.header}>
            <div className={styles.titleBlock}>
              <h1 className={styles.title}>Checkers</h1>
              {instructions() && <p className={styles.instructions}>{instructions()}</p>}
            </div>
          </header>

          <div
            className={[
              styles.layout,
              responsive.gridColumns === 1 ? styles.layoutStacked : styles.layoutSplit,
              responsive.navMode === 'sidebar' ? styles.layoutSidebar : '',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            <section className={styles.boardColumn}>
              <BoardView
                board={board}
                legalMoves={legalMoves}
                selected={selected}
                lastMove={lastMove}
                disabled={thinking}
                compactViewport={responsive.compactViewport}
                shortViewport={responsive.shortViewport}
                touchOptimized={responsive.touchOptimized}
                supportsHover={responsive.supportsHover}
                prefersReducedMotion={responsive.prefersReducedMotion}
                contentDensity={responsive.contentDensity}
                onSquarePress={handleSquarePress}
              />


            </section>

            <ControlPanel
              status={status}
              winner={winner}
              redPieces={redPieces}
              blackPieces={blackPieces}
              stats={stats}
              history={history}
              soundEnabled={soundEnabled}
              colorTheme={colorTheme}
              mode={mode}
              colorblind={colorblind}
              opponentMode={opponentMode}
              colorThemes={colorThemes}
              modes={modes}
              colorblindModes={colorblindModes}
              compactViewport={responsive.compactViewport}
              shortViewport={responsive.shortViewport}
              touchOptimized={responsive.touchOptimized}
              supportsHover={responsive.supportsHover}
              contentDensity={responsive.contentDensity}
              navMode={responsive.navMode}
              onNewGame={handleNewGame}
              onResetStats={resetStats}
              onToggleSound={toggleSound}
              onOpponentModeChange={handleOpponentModeChange}
              onThemeChange={setColorTheme}
              onModeChange={setMode}
              onColorblindChange={setColorblind}
            />
          </div>
        </main>
      </div>
    </>
  )
}
