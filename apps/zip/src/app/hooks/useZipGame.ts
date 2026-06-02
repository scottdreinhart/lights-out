/**
 * Zip App Layer
 * React hooks and context for Zip maze game
 */

import { useCallback, useEffect, useState } from 'react'

import type { Difficulty, Direction, Move, Position, ZipState } from '@/domain'
import { getDirectionDelta, makeMove, resetGame } from '@/domain'
import {
  ensureWasmReady,
  findOptimalPathAi,
  findOptimalPathAsync,
  generateSolvableMazeAi,
  generateSolvableMazeAsync,
  getHintMoveAi,
  getHintMoveAsync,
} from '../aiEngine'

type AiEngineSource = 'wasm' | 'js' | null

type AiRunSummary = {
  optimalMoves: number
  replayTimeMs: number
  playerMoves: number
  playerTimeSeconds: number
  savedMoves: number
  savedSeconds: number
}

const AI_REPLAY_STEP_MS = 120

const wait = (ms: number): Promise<void> =>
  new Promise((resolve) => {
    setTimeout(resolve, ms)
  })

const isSamePosition = (a: Position, b: Position): boolean => a.row === b.row && a.col === b.col

const resolveReplaySolution = async (
  baselineState: ZipState,
): Promise<{
  engine: AiEngineSource
  moves: Move[] | null
}> => {
  try {
    const solved = await findOptimalPathAsync(baselineState)
    return {
      engine: solved.engine,
      moves: solved.data?.moves ?? null,
    }
  } catch {
    const fallback = findOptimalPathAi(baselineState)
    return {
      engine: fallback.engine,
      moves: fallback.data?.moves ?? null,
    }
  }
}

type ReplayStepHandlers = {
  onRunnerPosition: (position: Position) => void
  onReplayMoves: (moves: Move[]) => void
  onCollectedItems: (items: Position[]) => void
}

const playReplayMoves = async (
  baselineState: ZipState,
  moves: Move[],
  handlers: ReplayStepHandlers,
): Promise<void> => {
  let collected: Position[] = []
  let replayMoves: Move[] = []

  for (const move of moves) {
    await wait(AI_REPLAY_STEP_MS)
    handlers.onRunnerPosition(move.to)
    replayMoves = [...replayMoves, move]
    handlers.onReplayMoves(replayMoves)

    const isItem = baselineState.items.some((item) => isSamePosition(item, move.to))
    if (isItem && !collected.some((item) => isSamePosition(item, move.to))) {
      collected = [...collected, move.to]
      handlers.onCollectedItems(collected)
    }
  }
}

export const useZipGame = (difficulty: Difficulty = 'medium') => {
  const [gameState, setGameState] = useState<ZipState>(
    () => generateSolvableMazeAi(difficulty).data,
  )
  const [gameTime, setGameTime] = useState(0)
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [moveCount, setMoveCount] = useState(0)
  const [isAiBusy, setIsAiBusy] = useState(false)
  const [lastAiLatencyMs, setLastAiLatencyMs] = useState<number | null>(null)
  const [lastAiEngine, setLastAiEngine] = useState<AiEngineSource>(null)
  const [isAiReplayRunning, setIsAiReplayRunning] = useState(false)
  const [aiRunnerPosition, setAiRunnerPosition] = useState<Position | null>(null)
  const [aiReplayCollectedItems, setAiReplayCollectedItems] = useState<Position[]>([])
  const [aiReplayMoves, setAiReplayMoves] = useState<Move[]>([])
  const [lastAiRunSummary, setLastAiRunSummary] = useState<AiRunSummary | null>(null)

  useEffect(() => {
    void ensureWasmReady()
  }, [])

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null

    if (isTimerRunning && !gameState.isComplete) {
      interval = setInterval(() => {
        setGameTime((prev) => prev + 1)
      }, 1000)
    }

    return () => {
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [isTimerRunning, gameState.isComplete])

  useEffect(() => {
    if (moveCount > 0 && !isTimerRunning && !gameState.isComplete) {
      setIsTimerRunning(true)
    }
  }, [moveCount, isTimerRunning, gameState.isComplete])

  const makePlayerMove = useCallback(
    (direction: Direction) => {
      if (gameState.isComplete) {
        return
      }

      setGameState((prevState) => {
        const newState = makeMove(prevState, direction)
        if (newState.moves.length > prevState.moves.length) {
          setMoveCount((prev) => prev + 1)
        }
        return newState
      })
    },
    [gameState.isComplete],
  )

  const canMove = useCallback(
    (direction: Direction): boolean => {
      const currentPos = gameState.playerPosition
      const delta = getDirectionDelta(direction)
      const newPos: Position = {
        row: currentPos.row + delta.row,
        col: currentPos.col + delta.col,
      }

      return (
        newPos.row >= 0 &&
        newPos.row < gameState.maze.length &&
        newPos.col >= 0 &&
        newPos.col < gameState.maze[0].length &&
        gameState.maze[newPos.row][newPos.col].type !== 'wall'
      )
    },
    [gameState],
  )

  const newPuzzle = useCallback(async () => {
    setIsAiBusy(true)
    const startedAt = performance.now()
    try {
      const nextState = await generateSolvableMazeAsync(difficulty)
      setGameState(nextState.data)
      setLastAiEngine(nextState.engine)
      setIsAiReplayRunning(false)
      setAiRunnerPosition(null)
      setAiReplayCollectedItems([])
      setAiReplayMoves([])
      setLastAiRunSummary(null)
    } catch {
      const fallback = generateSolvableMazeAi(difficulty)
      setGameState(fallback.data)
      setLastAiEngine(fallback.engine)
      setIsAiReplayRunning(false)
      setAiRunnerPosition(null)
      setAiReplayCollectedItems([])
      setAiReplayMoves([])
      setLastAiRunSummary(null)
    } finally {
      setGameTime(0)
      setIsTimerRunning(false)
      setMoveCount(0)
      setLastAiLatencyMs(Math.round(performance.now() - startedAt))
      setIsAiBusy(false)
    }
  }, [difficulty])

  const resetCurrentGame = useCallback(() => {
    setGameState((prevState) => resetGame(prevState))
    setGameTime(0)
    setIsTimerRunning(false)
    setMoveCount(0)
    setIsAiReplayRunning(false)
    setAiRunnerPosition(null)
    setAiReplayCollectedItems([])
    setAiReplayMoves([])
    setLastAiRunSummary(null)
  }, [])

  const getHint = useCallback(async (): Promise<Position | null> => {
    setIsAiBusy(true)
    const startedAt = performance.now()
    try {
      const hint = await getHintMoveAsync(gameState)
      setLastAiEngine(hint.engine)
      return hint.data
    } catch {
      const fallback = getHintMoveAi(gameState)
      setLastAiEngine(fallback.engine)
      return fallback.data
    } finally {
      setLastAiLatencyMs(Math.round(performance.now() - startedAt))
      setIsAiBusy(false)
    }
  }, [gameState])

  const solveCompletely = useCallback(async () => {
    setIsAiBusy(true)
    const startedAt = performance.now()
    try {
      const solution = await findOptimalPathAsync(gameState)
      setLastAiEngine(solution.engine)
      const solvedPath = solution.data
      if (!solvedPath) {
        return
      }

      let currentState = { ...gameState }
      for (const move of solvedPath.moves) {
        currentState = makeMove(currentState, move.direction)
      }
      setGameState(currentState)
      setMoveCount((prev) => prev + solvedPath.moves.length)
    } catch {
      const fallback = findOptimalPathAi(gameState)
      const fallbackSolution = fallback.data
      setLastAiEngine(fallback.engine)
      if (!fallbackSolution) {
        return
      }

      let currentState = { ...gameState }
      for (const move of fallbackSolution.moves) {
        currentState = makeMove(currentState, move.direction)
      }
      setGameState(currentState)
      setMoveCount((prev) => prev + fallbackSolution.moves.length)
    } finally {
      setLastAiLatencyMs(Math.round(performance.now() - startedAt))
      setIsAiBusy(false)
    }
  }, [gameState])

  const changeDifficulty = useCallback(
    async (nextDifficulty: Difficulty) => {
      setIsAiBusy(true)
      const startedAt = performance.now()
      try {
        const nextState = await generateSolvableMazeAsync(nextDifficulty)
        setGameState(nextState.data)
        setLastAiEngine(nextState.engine)
      } catch {
        const fallback = generateSolvableMazeAi(nextDifficulty)
        setGameState(fallback.data)
        setLastAiEngine(fallback.engine)
      } finally {
        setGameTime(0)
        setIsTimerRunning(false)
        setMoveCount(0)
        setIsAiReplayRunning(false)
        setAiRunnerPosition(null)
        setAiReplayCollectedItems([])
        setAiReplayMoves([])
        setLastAiRunSummary(null)
        setLastAiLatencyMs(Math.round(performance.now() - startedAt))
        setIsAiBusy(false)
      }
    },
    [],
  )

  const runAiReplay = useCallback(async () => {
    if (isAiBusy || isAiReplayRunning || !gameState.isComplete) {
      return
    }

    const baselineState = resetGame(gameState)
    const replayStartedAt = performance.now()

    setIsAiReplayRunning(true)
    setAiRunnerPosition(baselineState.playerPosition)
    setAiReplayCollectedItems([])
    setAiReplayMoves([])

    try {
      const replaySolution = await resolveReplaySolution(baselineState)
      setLastAiEngine(replaySolution.engine)

      const replayMoves = replaySolution.moves ?? []

      await playReplayMoves(baselineState, replayMoves, {
        onRunnerPosition: setAiRunnerPosition,
        onReplayMoves: setAiReplayMoves,
        onCollectedItems: setAiReplayCollectedItems,
      })

      const replayTimeMs = Math.round(performance.now() - replayStartedAt)
      const replayTimeSeconds = replayTimeMs / 1000
      setLastAiRunSummary({
        optimalMoves: replayMoves.length,
        replayTimeMs,
        playerMoves: moveCount,
        playerTimeSeconds: gameTime,
        savedMoves: Math.max(moveCount - replayMoves.length, 0),
        savedSeconds: Math.max(gameTime - replayTimeSeconds, 0),
      })
    } catch (error) {
      console.error('AI replay failed:', error)
      setAiRunnerPosition(null)
      setAiReplayCollectedItems([])
      setAiReplayMoves([])
      setLastAiRunSummary(null)
    } finally {
      setIsAiReplayRunning(false)
    }
  }, [gameState, gameTime, isAiBusy, isAiReplayRunning, moveCount])

  return {
    aiRunnerPosition,
    aiReplayCollectedItems,
    aiReplayMoves,
    canMove,
    gameState,
    gameTime,
    changeDifficulty,
    getHint,
    isAiBusy,
    isAiReplayRunning,
    lastAiEngine,
    lastAiLatencyMs,
    lastAiRunSummary,
    makePlayerMove,
    moveCount,
    newPuzzle,
    resetCurrentGame,
    runAiReplay,
    solveCompletely,
  }
}
