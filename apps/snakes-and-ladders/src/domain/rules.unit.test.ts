import { applyTurn, createInitialState, resolveBoardEffect } from './rules'

describe('snakes-and-ladders rules', () => {
  it('moves player to ladder destination when landing at ladder base', () => {
    const initial = createInitialState([
      { id: 'human', name: 'You', position: 1 },
      { id: 'cpu', name: 'CPU', position: 1 },
    ])

    const next = applyTurn(initial, 3) // 1 -> 4, ladder 4 -> 14

    expect(next.players[0].position).toBe(14)
    expect(next.lastTurn?.effect?.type).toBe('ladder')
    expect(next.lastTurn?.effect?.from).toBe(4)
    expect(next.lastTurn?.effect?.to).toBe(14)
  })

  it('moves player to snake destination when landing on snake head', () => {
    const initial = createInitialState([
      { id: 'human', name: 'You', position: 16 },
      { id: 'cpu', name: 'CPU', position: 1 },
    ])

    const next = applyTurn(initial, 1) // 16 -> 17 (no snake) then next player
    const afterCpu = applyTurn(next, 6) // CPU 1 -> 7
    const forced = {
      ...afterCpu,
      players: [
        { ...afterCpu.players[0], position: 46 }, // human lands on 47
        afterCpu.players[1],
      ],
      currentPlayerIndex: 0,
    }
    const landedOnSnake = applyTurn(forced, 1)

    expect(landedOnSnake.players[0].position).toBe(26)
    expect(landedOnSnake.lastTurn?.effect?.type).toBe('snake')
  })

  it('keeps player in place when roll overshoots 100', () => {
    const initial = createInitialState([
      { id: 'human', name: 'You', position: 98 },
      { id: 'cpu', name: 'CPU', position: 1 },
    ])

    const next = applyTurn(initial, 5)
    expect(next.players[0].position).toBe(98)
    expect(next.lastTurn?.overshotFinish).toBe(true)
    expect(next.phase).toBe('playing')
  })

  it('ends game when player lands exactly on 100', () => {
    const initial = createInitialState([
      { id: 'human', name: 'You', position: 94 },
      { id: 'cpu', name: 'CPU', position: 1 },
    ])

    const next = applyTurn(initial, 6)
    expect(next.players[0].position).toBe(100)
    expect(next.phase).toBe('game-over')
    expect(next.winnerId).toBe('human')
  })

  it('returns null effect for normal squares', () => {
    expect(resolveBoardEffect(2)).toBeNull()
  })

  it('throws on invalid roll', () => {
    const initial = createInitialState()
    expect(() => applyTurn(initial, 0)).toThrow()
    expect(() => applyTurn(initial, 7)).toThrow()
  })
})
