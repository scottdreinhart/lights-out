# Phase B: WASM Implementation for Battleship

This document tracks the implementation of actual WebAssembly computation for the Battleship CPU move calculation.

## What Was Created

### 1. AssemblyScript Source Code
- **File**: `assembly/index.ts` (290 lines)
- **Content**: Complete `getCpuMove` function translated to AssemblyScript
- **Exports**: 
  - `getCpuMove(boardSize, gridFlat, difficulty)` — Main entry point
  - Helper functions for game logic (untried cells, unsunk hits, adjacent cells)
- **Features**:
  - Searches for unsunk hits to target
  - Uses checkerboard pattern for medium difficulty
  - Implements smart search for hard difficulty
  - Returns `[row, col]` as i32 array

### 2. WASM Configuration
- **File**: `assembly/tsconfig.json`
- **Settings**: 
  - Optimization level 3 (O3)
  - Shrink level 2 (S2)
  - Target ES2020
  - Strict mode enabled

### 3. WASM Loader
- **File**: `src/wasm-loader.ts` (100 lines)
- **Exports**:
  - `getCpuMoveWasm(boardSize, gridFlat, difficulty)` — Async WASM caller
  - `isWasmAvailable()` — Feature detection
- **Features**:
  - Base64-embeds WASM binary (no separate .wasm file)
  - Lazy initialization on first use
  - Memory allocation/deallocation
  - Error handling with fallback

### 4. Build Script
- **File**: `scripts/build-wasm.mjs` (105 lines)
- **Steps**:
  1. Compile AssemblyScript to WASM using `asc` compiler
  2. Encode WASM binary as base64
  3. Embed base64 in `src/wasm-loader.ts`
  4. Compile TypeScript with `tsc`
- **Output**: `dist/` with .d.ts and .js files

### 5. Worker Integration
- **File**: `src/battleship.worker.ts` (99 lines)
- **Updated**:
  - Now imports `getCpuMoveWasm` from wasm-loader
  - Converts Board to flattened array for WASM
  - Maps difficulty strings to numbers (0-2)
  - Calls WASM function in async message handler
  - Returns computed move to main thread
- **Message Protocol**: Unchanged — same request/response types

### 6. Package Configuration
- **File**: `package.json`
- **Updates**:
  - Added `assemblyscript` to devDependencies
  - Added wasm-loader export (conditional)
  - Changed build script to call `build-wasm.mjs`
  - Kept TypeScript compilation as `build:ts` for fallback

## Design: No App Code Changes

**Key Design Principle**: Phase B implementation happens entirely in the worker + WASM layer.

- ✅ No changes to `useGame.ts` hook
- ✅ No changes to `useBattleshipWorker.ts` hook
- ✅ No changes to React component code
- ✅ Same message protocol (Board input, Coord output)
- ✅ Same hook API (async/sync with fallback pattern)

### Why?

The message protocol acts as a contract:
- Main thread (hook) sends: `{ type: 'getMove', board: Board, difficulty: string }`  
- Worker receives, calls WASM
- Worker returns: `{ type: 'moveReady', move: Coord }`

WASM is an implementation detail inside the worker. No consumer code needs to know about it.

## Data Flow

```
useGame.ts (mainThread)
  ↓ awaits getMoveAsync()
useBattleshipWorker hook
  ↓ postMessage({ type: 'getMove', board, difficulty })
battleship.worker.ts
  ↓ receives 'getMove' message
wasm-loader.ts
  ↓ getCpuMoveWasm(boardSize, gridFlat, difficulty)
assembly/index.ts (WASM binary)
  ↓ getCpuMove(boardSize, gridFlat, difficulty)
  → returns { row, col } (computed in WebAssembly)
wasm-loader.ts
  ↓ returns { row, col } Promise
battleship.worker.ts
  ↓ postMessage({ type: 'moveReady', move })
useBattleshipWorker hook
  ↓ resolves getMoveAsync() Promise
useGame.ts
  ↓ has computed move in ~3-5ms (no blocking)
```

## Build Process

### Command
```bash
pnpm --filter @games/battleship-wasm build
```

### Steps
1. **asc compiler**: `assembly/index.ts` → `build/battleship.wasm` (binary)
2. **Base64 encode**: `build/battleship.wasm` → base64 string
3. **Embed in loader**: Replace placeholder in `src/wasm-loader.ts`
4. **TypeScript**: Compile all TypeScript files
5. **Output**: `dist/` with compiled JavaScript and type definitions

### Success Indicators
```
✅ [1/4] Compiling AssemblyScript...
✅ [2/4] Encoding WASM to base64...
✅ [3/4] Embedding WASM in loader...
✅ [4/4] Building TypeScript...
✨ WASM build complete!
```

## Testing

### 1. Verify Build
```bash
pnpm --filter @games/battleship-wasm build
# Expected: No errors, dist/ created with .js and .d.ts files
```

### 2. Check Worker Bundling
```bash
pnpm -C apps/battleship build
# Expected: battleship.worker-*.js in dist/assets/
```

### 3. Manual Testing
```bash
pnpm -C apps/battleship dev
# Open http://localhost:5173
# Play game, observe CPU moves (from WASM)
# Check console for timing: ~3-5ms per move
```

### 4. Fallback Testing (Optional)
To test sync fallback (if WASM fails):
- Comment out `getCpuMoveWasm` import in worker
- Worker will return placeholder
- Hook's fallback will compute sync move
- Game continues to work (slower but correct)

## Performance Targets

| Metric | Target | Actual (Expected) |
|--------|--------|---|
| WASM computation | <2ms | <1ms (AssemblyScript optimized) |
| Message overhead | 1-2ms | 1-2ms |
| Total async path | 3-5ms | 3-4ms |
| Worker startup | <500ms | ~100ms (one-time) |
| Fallback sync | 5-50ms | 5-30ms (JavaScript) |

## Troubleshooting

### Build Fails: asc command not found
**Cause**: AssemblyScript not installed  
**Fix**: `pnpm install` (already in root devDependencies)

### WASM Binary Too Large
**Cause**: Optimization level too low  
**Fix**: Verify `assembly/tsconfig.json` has `optimizeLevel: 3`, `shrinkLevel: 2`

### Worker Reports Error
**Cause**: WASM instantiation failed  
**Fix**: Check browser console for WebAssembly error, verify base64 string in wasm-loader.ts

### Fallback Always Used
**Cause**: WASM module not initializing  
**Fix**: Check that `getCpuMoveWasm` is imported correctly in worker, verify browser supports WebAssembly

## Future Enhancements

- [ ] Add WASM-specific unit tests (vitest + WASM instantiation)
- [ ] Profile WASM vs JavaScript performance per difficulty
- [ ] Add debug mode to log computation steps
- [ ] Consider multi-threading (separate worker per difficult game variant)
- [ ] Optimize board packing (current: i32 per cell, could use bitpacking)

## References

- **AssemblyScript Docs**: https://www.assemblyscript.org
- **WebAssembly MDN**: https://developer.mozilla.org/en-US/docs/WebAssembly
- **Worker Message Protocol**: `battleship-wasm/src/types.ts`
- **Phase A Documentation**: See parent README for hook and worker overview

---

**Status**: ✅ Implementation complete, ready for build & test
