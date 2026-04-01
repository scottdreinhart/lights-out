import { useCallback, useEffect, useRef, useState } from 'react'

import type { Board, Difficulty } from '@/domain'
import { CPU_DELAY_MS, TOKENS } from '@/domain'
import { computeAiMove, ensureWasmReady } from './aiEngine.ts'

interface UseCpuPlayerConfig {
  turn: string
  board: Board
  isGameOver: boolean
  onCpuMove: (index: number) => void
}

interface UseCpuPlayerReturn {
  difficulty: Difficulty
  handleSetDifficulty: (level: Difficulty) => void
  cancelPendingMove: () => void
}

const useCpuPlayer = ({
  turn,
  board,
  isGameOver,
  onCpuMove,
}: UseCpuPlayerConfig): UseCpuPlayerReturn => {
  const [difficulty, setDifficulty] = useState<Difficulty>('medium')
  const cpuTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (turn !== TOKENS.CPU || isGameOver) {
      return
    }

    let cancelled = false

    const scheduleMove = async () => {
      await ensureWasmReady()
      if (cancelled) {
        return
      }
      const { index } = computeAiMove(board, difficulty, TOKENS.CPU, TOKENS.HUMAN)
      cpuTimeoutRef.current = setTimeout(() => {
        onCpuMove(index)
        cpuTimeoutRef.current = null
      }, CPU_DELAY_MS)
    }

    scheduleMove()

    return () => {
      cancelled = true
      if (cpuTimeoutRef.current !== null) {
        clearTimeout(cpuTimeoutRef.current)
        cpuTimeoutRef.current = null
      }
    }
  }, [turn, isGameOver, difficulty, board, onCpuMove])

  useEffect(() => {
    return () => {
      if (cpuTimeoutRef.current !== null) {
        clearTimeout(cpuTimeoutRef.current)
        cpuTimeoutRef.current = null
      }
    }
  }, [])

  const handleSetDifficulty = useCallback((level: Difficulty) => {
    setDifficulty(level)
  }, [])

  const cancelPendingMove = useCallback(() => {
    if (cpuTimeoutRef.current !== null) {
      clearTimeout(cpuTimeoutRef.current)
      cpuTimeoutRef.current = null
    }
  }, [])

  return { difficulty, handleSetDifficulty, cancelPendingMove }
}

export default useCpuPlayer
