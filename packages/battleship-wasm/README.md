# @games/battleship-wasm

Web Worker for Battleship CPU move calculation.

## Usage

This package provides a Web Worker that handles async move calculation for the Battleship CPU player. It wraps the synchronous `getCpuMove` function in an async message-based interface.

### Future Upgrade Path

Currently, the worker wraps synchronous JS logic. In the future, this can be upgraded to use actual WASM implementation:

1. Implement `assembly/battleship.ts` in AssemblyScript
2. Build to WASM and embed as base64 in the worker
3. No API changes needed — same message interface

## Message Protocol

### Main Thread → Worker

```ts
{
  type: 'getMove'
  board: Board
  difficulty: Difficulty
  requestId: string
}
```

### Worker → Main Thread

```ts
{
  type: 'moveReady'
  requestId: string
  move: Coord
  timeTaken: number
  difficulty: Difficulty
}
```

## Performance

Current implementation (sync wrapped in worker):

- Move calculation: ~5-50ms depending on difficulty
- Worker overhead: ~2-5ms

Future WASM implementation should reduce move calculation to <2ms.
