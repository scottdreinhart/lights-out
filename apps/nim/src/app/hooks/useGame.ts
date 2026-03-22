import { useCallback, useEffect, useRef, useState } from 'react'

import {
  applyMove,
  checkGameOver,
  CPU_DELAY_MS,
  createInitialBoard,
  DEFAULT_COUNTS,
  getWinner,
  selectMove,
  type Difficulty,
  type GameMode,
  type GameState,
  type Move,
  type Opponent,
  type Player,
} from '@/domain'
import { load, save } from '@/infrastructure/storage'

const SETUP_KEY = 'nim-setup'
const MODE_KEY = 'nim-mode'
const DIFFICULTY_KEY = 'nim-difficulty'
const OPPONENT_KEY = 'nim-opponent'
const AI_BENCHMARK_VARIANT_KEY = 'nim-ai-benchmark-variant'
const AI_BENCHMARK_BATCH_SIZE_KEY = 'nim-ai-benchmark-batch-size'

type AiBenchmarkVariant = 'off' | 'control' | 'batch'

interface AiBenchmarkResult {
  variant: 'control' | 'batch'
  batchSize: number
  durationMs: number
}

interface WorkerResponse {
  move: Move
  benchmark?: AiBenchmarkResult
}

export const useGame = (initialCounts: number[] = DEFAULT_COUNTS) => {
  const [setup, setSetup] = useState<number[]>(() => load(SETUP_KEY, initialCounts))
  const [difficulty, setDifficultyState] = useState<Difficulty>(() => load(DIFFICULTY_KEY, 'hard'))
  const [opponent, setOpponentState] = useState<Opponent>(() => load(OPPONENT_KEY, 'cpu'))
  const [state, setState] = useState<GameState>(() =>
    createInitialBoard(load(SETUP_KEY, initialCounts), 'human', load<GameMode>(MODE_KEY, 'misere')),
  )
  const [selectedPileId, setSelectedPileId] = useState<number | null>(null)
  const [selectedCount, setSelectedCount] = useState<number>(0)
  const [cpuThinking, setCpuThinking] = useState(false)
  const [lastAiBenchmark, setLastAiBenchmark] = useState<AiBenchmarkResult | null>(null)
  const workerRef = useRef<Worker | null>(null)
  const executeMoveRef = useRef<(move: Move) => void>(() => {})

  const aiBenchmarkVariant = load<AiBenchmarkVariant>(AI_BENCHMARK_VARIANT_KEY, 'off')
  const aiBenchmarkBatchSize = load<number>(AI_BENCHMARK_BATCH_SIZE_KEY, 64)

  // Initialize Web Worker on mount
  useEffect(() => {
    const worker = new Worker(new URL('@/workers/ai.worker.ts', import.meta.url), {
      type: 'module',
    })
    worker.onmessage = (e: MessageEvent<WorkerResponse>) => {
      executeMoveRef.current(e.data.move)
      if (e.data.benchmark) {
        setLastAiBenchmark(e.data.benchmark)
      }
      setCpuThinking(false)
    }
    workerRef.current = worker
    return () => {
      worker.terminate()
      workerRef.current = null
    }
  }, [])

  const setDifficulty = useCallback((d: Difficulty) => {
    setDifficultyState(d)
    save(DIFFICULTY_KEY, d)
  }, [])

  const setOpponent = useCallback((o: Opponent) => {
    setOpponentState(o)
    save(OPPONENT_KEY, o)
  }, [])

  const updateSetup = useCallback(
    (newCounts: number[]) => {
      setSetup(newCounts)
      save(SETUP_KEY, newCounts)
      setState(createInitialBoard(newCounts, 'human', state.mode))
    },
    [state.mode],
  )

  const setMode = useCallback((mode: GameMode) => {
    save(MODE_KEY, mode)
    setState((prev) => ({
      ...prev,
      mode,
    }))
  }, [])

  const resetGame = useCallback(() => {
    setState((prev) => createInitialBoard(setup, 'human', prev.mode))
    setSelectedPileId(null)
    setSelectedCount(0)
    setCpuThinking(false)
  }, [setup])

  const executeMove = useCallback(
    (move: Move, player?: Player) => {
      setState((prev) => {
        const mover = player ?? prev.currentPlayer
        const newState = applyMove(prev, move)
        const isGameOver = checkGameOver(newState)
        const winner = getWinner(newState, mover)
        const nextPlayer: Player =
          opponent === 'local'
            ? mover === 'human'
              ? 'cpu'
              : 'human'
            : mover === 'human'
              ? 'cpu'
              : 'human'

        return {
          ...newState,
          isGameOver,
          winner,
          currentPlayer: isGameOver ? prev.currentPlayer : nextPlayer,
          lastMove: { pileId: move.pileId, removeCount: move.removeCount, player: mover },
        }
      })
      setSelectedPileId(null)
      setSelectedCount(0)
    },
    [opponent],
  )

  // Keep ref in sync for the worker callback
  executeMoveRef.current = executeMove

  const handleObjectClick = (pileId: number, index: number) => {
    if (state.isGameOver) {
      return
    }
    // In local 2-player, both players are "human" — always allow
    if (opponent === 'cpu' && state.currentPlayer !== 'human') {
      return
    }

    if (selectedPileId !== null && selectedPileId !== pileId) {
      setSelectedPileId(pileId)
      setSelectedCount(1)
    } else {
      setSelectedPileId(pileId)
      setSelectedCount(index + 1)
    }
  }

  const confirmMove = () => {
    if (selectedPileId !== null && selectedCount > 0) {
      executeMove({ pileId: selectedPileId, removeCount: selectedCount })
    }
  }

  // CPU Turn handler — uses Web Worker (WASM-first, JS fallback)
  useEffect(() => {
    if (opponent !== 'cpu') {
      return
    }
    if (state.currentPlayer === 'cpu' && !state.isGameOver) {
      setCpuThinking(true)
      const timer = setTimeout(() => {
        const worker = workerRef.current
        if (worker) {
          worker.postMessage({
            state,
            difficulty,
            experiment: {
              variant: aiBenchmarkVariant,
              batchSize: aiBenchmarkBatchSize,
            },
          })
        } else {
          executeMove(selectMove(state, difficulty))
          setCpuThinking(false)
        }
      }, CPU_DELAY_MS)
      return () => {
        clearTimeout(timer)
        setCpuThinking(false)
      }
    }
  }, [state, executeMove, opponent, difficulty, aiBenchmarkBatchSize, aiBenchmarkVariant])

  return {
    state,
    selectedPileId,
    selectedCount,
    difficulty,
    opponent,
    cpuThinking,
    lastAiBenchmark,
    handleObjectClick,
    confirmMove,
    resetGame,
    setMode,
    setDifficulty,
    setOpponent,
    updateSetup,
    setup,
  }
}
