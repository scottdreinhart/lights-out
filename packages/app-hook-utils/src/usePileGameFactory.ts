import { useCallback, useEffect, useRef, useState } from 'react'

export interface PileMove {
  pileId: number
  removeCount: number
}

export interface PileGameState<TMode extends string, TPlayer extends string, TWinner> {
  mode: TMode
  currentPlayer: TPlayer
  isGameOver: boolean
  winner: TWinner
}

export interface UsePileGameResult<
  TMode extends string,
  TPlayer extends string,
  TWinner,
  TState extends PileGameState<TMode, TPlayer, TWinner>,
> {
  state: TState
  selectedPileId: number | null
  selectedCount: number
  handleObjectClick: (pileId: number, index: number) => void
  confirmMove: () => void
  resetGame: () => void
  setMode: (mode: TMode) => void
  updateSetup: (newCounts: number[]) => void
}

interface CreateUsePileGameHookConfig<
  TMode extends string,
  TPlayer extends string,
  TWinner,
  TState extends PileGameState<TMode, TPlayer, TWinner>,
  TMove extends PileMove,
> {
  createInitialBoard: (setup: number[], currentPlayer: TPlayer, mode: TMode) => TState
  applyMove: (state: TState, move: TMove) => TState
  checkGameOver: (state: TState) => boolean
  getWinner: (state: TState) => TWinner
  selectMove: (state: TState) => TMove
  createWorker: (onMove: (move: TMove) => void) => Worker | null
  initialMode: TMode
  humanPlayer: TPlayer
  cpuPlayer: TPlayer
  cpuDelayMs?: number
}

export const createUsePileGameHook = <
  TMode extends string,
  TPlayer extends string,
  TWinner,
  TState extends PileGameState<TMode, TPlayer, TWinner>,
  TMove extends PileMove,
>({
  createInitialBoard,
  applyMove,
  checkGameOver,
  getWinner,
  selectMove,
  createWorker,
  initialMode,
  humanPlayer,
  cpuPlayer,
  cpuDelayMs = 1000,
}: CreateUsePileGameHookConfig<TMode, TPlayer, TWinner, TState, TMove>) => {
  return (
    initialCounts: number[] = [3, 4, 5],
  ): UsePileGameResult<TMode, TPlayer, TWinner, TState> => {
    const [setup, setSetup] = useState<number[]>(initialCounts)
    const [state, setState] = useState<TState>(() => createInitialBoard(initialCounts, humanPlayer, initialMode))
    const [selectedPileId, setSelectedPileId] = useState<number | null>(null)
    const [selectedCount, setSelectedCount] = useState<number>(0)
    const workerRef = useRef<Worker | null>(null)
    const executeMoveRef = useRef<(move: TMove) => void>(() => {})

    useEffect(() => {
      const worker = createWorker((move) => {
        executeMoveRef.current(move)
      })

      workerRef.current = worker
      return () => {
        worker?.terminate()
        workerRef.current = null
      }
    }, [createWorker])

    const updateSetup = useCallback(
      (newCounts: number[]) => {
        setSetup(newCounts)
        setState(createInitialBoard(newCounts, humanPlayer, state.mode))
      },
      [createInitialBoard, humanPlayer, state.mode],
    )

    const setMode = useCallback((mode: TMode) => {
      setState((prev) => ({
        ...prev,
        mode,
      }))
    }, [])

    const resetGame = useCallback(() => {
      setState((prev) => createInitialBoard(setup, humanPlayer, prev.mode))
      setSelectedPileId(null)
      setSelectedCount(0)
    }, [createInitialBoard, humanPlayer, setup])

    const executeMove = useCallback(
      (move: TMove) => {
        setState((prev) => {
          const nextState = applyMove(prev, move)
          const isGameOver = checkGameOver(nextState)
          const winner = getWinner(nextState)

          return {
            ...nextState,
            isGameOver,
            winner,
            currentPlayer: isGameOver
              ? prev.currentPlayer
              : prev.currentPlayer === humanPlayer
                ? cpuPlayer
                : humanPlayer,
          }
        })

        setSelectedPileId(null)
        setSelectedCount(0)
      },
      [applyMove, checkGameOver, cpuPlayer, getWinner, humanPlayer],
    )

    executeMoveRef.current = executeMove

    const handleObjectClick = useCallback(
      (pileId: number, index: number) => {
        if (state.currentPlayer !== humanPlayer || state.isGameOver) {
          return
        }

        if (selectedPileId !== null && selectedPileId !== pileId) {
          setSelectedPileId(pileId)
          setSelectedCount(1)
        } else {
          setSelectedPileId(pileId)
          setSelectedCount(index + 1)
        }
      },
      [humanPlayer, selectedPileId, state.currentPlayer, state.isGameOver],
    )

    const confirmMove = useCallback(() => {
      if (selectedPileId !== null && selectedCount > 0) {
        executeMove({ pileId: selectedPileId, removeCount: selectedCount } as TMove)
      }
    }, [executeMove, selectedCount, selectedPileId])

    useEffect(() => {
      if (state.currentPlayer === cpuPlayer && !state.isGameOver) {
        const timer = globalThis.setTimeout(() => {
          const worker = workerRef.current
          if (worker) {
            worker.postMessage({ state })
          } else {
            executeMove(selectMove(state))
          }
        }, cpuDelayMs)

        return () => globalThis.clearTimeout(timer)
      }
    }, [cpuDelayMs, cpuPlayer, executeMove, selectMove, state])

    return {
      state,
      selectedPileId,
      selectedCount,
      handleObjectClick,
      confirmMove,
      resetGame,
      setMode,
      updateSetup,
    }
  }
}

export const createUseStandardPileGameHook = <
  TMode extends string,
  TWinner,
  TState extends PileGameState<TMode, 'human' | 'cpu', TWinner>,
  TMove extends PileMove,
>(
  config: Omit<
    CreateUsePileGameHookConfig<TMode, 'human' | 'cpu', TWinner, TState, TMove>,
    'initialMode' | 'humanPlayer' | 'cpuPlayer'
  > & {
    initialMode?: TMode
  },
) => {
  return createUsePileGameHook<TMode, 'human' | 'cpu', TWinner, TState, TMove>({
    ...config,
    initialMode: config.initialMode ?? ('misere' as TMode),
    humanPlayer: 'human',
    cpuPlayer: 'cpu',
  })
}