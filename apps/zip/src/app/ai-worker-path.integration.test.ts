import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { Difficulty, Solution, ZipState } from '../domain'
import {
  findOptimalPathAsync,
  generateSolvableMazeAsync,
  getHintMoveAsync,
  terminateAsyncAi,
} from './aiEngine'

const createStateFixture = (): ZipState => ({
  maze: [
    [{ type: 'start' }, { type: 'empty' }, { type: 'goal' }],
    [{ type: 'wall' }, { type: 'empty' }, { type: 'item' }],
  ],
  playerPosition: { row: 0, col: 0 },
  startPosition: { row: 0, col: 0 },
  goalPosition: { row: 0, col: 2 },
  items: [{ row: 1, col: 2 }],
  collectedItems: [],
  moves: [],
  isComplete: false,
})

class WorkerMock {
  public onmessage: ((event: MessageEvent) => void) | null = null

  public postMessage(message: { id: number; command: string; payload: unknown }): void {
    if (!this.onmessage) {
      return
    }

    if (message.command === 'hint') {
      this.onmessage({
        data: {
          id: message.id,
          ok: true,
          engine: 'wasm',
          data: { row: 0, col: 1 },
        },
      } as MessageEvent)
      return
    }

    if (message.command === 'solve') {
      const solution: Solution = {
        path: [
          { row: 0, col: 0 },
          { row: 0, col: 1 },
          { row: 0, col: 2 },
        ],
        moves: [
          {
            from: { row: 0, col: 0 },
            to: { row: 0, col: 1 },
            direction: 'right',
          },
          {
            from: { row: 0, col: 1 },
            to: { row: 0, col: 2 },
            direction: 'right',
          },
        ],
        collectedItems: [],
        totalCost: 2,
      }

      this.onmessage({
        data: {
          id: message.id,
          ok: true,
          engine: 'wasm',
          data: solution,
        },
      } as MessageEvent)
      return
    }

    this.onmessage({
      data: {
        id: message.id,
        ok: true,
        engine: 'js',
        data: createStateFixture(),
      },
    } as MessageEvent)
  }

  public terminate(): void {}
}

describe('ai worker path integration', () => {
  beforeEach(() => {
    vi.stubGlobal('Worker', WorkerMock)
  })

  afterEach(() => {
    terminateAsyncAi()
    vi.unstubAllGlobals()
  })

  it('returns worker hint result with engine metadata', async () => {
    const state = createStateFixture()

    const result = await getHintMoveAsync(state)

    expect(result.engine).toBe('wasm')
    expect(result.data).toEqual({ row: 0, col: 1 })
  })

  it('returns worker solve result with path and moves', async () => {
    const state = createStateFixture()

    const result = await findOptimalPathAsync(state)

    expect(result.engine).toBe('wasm')
    expect(result.data?.moves).toHaveLength(2)
    expect(result.data?.path).toHaveLength(3)
  })

  it('returns generated state from worker path', async () => {
    const result = await generateSolvableMazeAsync('medium' as Difficulty)

    expect(result.engine).toBe('js')
    expect(result.data.playerPosition).toEqual({ row: 0, col: 0 })
    expect(result.data.goalPosition).toEqual({ row: 0, col: 2 })
  })
})
