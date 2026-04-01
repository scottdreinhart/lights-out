import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useGame } from '@/app'

describe('useGame Hook', () => {
  it('should initialize game state', () => {
    const { result } = renderHook(() => useGame('easy'))
    expect(result.current.gameState).toBeDefined()
    expect(result.current.isComplete).toBe(false)
  })

  it('should track elapsed time', () => {
    const { result } = renderHook(() => useGame('easy'))
    expect(result.current.elapsedTime).toBeGreaterThanOrEqual(0)
  })

  it('should handle cell changes', () => {
    const { result } = renderHook(() => useGame('easy'))
    act(() => {
      result.current.handleCellChange(0, 0, 1)
    })
    expect(result.current.gameState.moves).toHaveLength(1)
  })

  it('should reset game', () => {
    const { result } = renderHook(() => useGame('easy'))
    const initialMoves = result.current.gameState.moves.length

    act(() => {
      result.current.handleCellChange(0, 0, 1)
      result.current.resetGame()
    })

    expect(result.current.gameState.moves).toHaveLength(0)
    expect(result.current.isComplete).toBe(false)
  })
})
