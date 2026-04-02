# Phase 8: AI Framework Performance Optimization

**Date**: April 1, 2026  
**Status**: In Progress  
**Goal**: Profile minimax engine, establish baselines, identify WASM-worthy hotspots

---

## 1. Minimax Performance Targets

### Decision Time Budgets (per game, main thread)

| Difficulty | Target | Fallback | Strategy |
|------------|--------|----------|----------|
| **Easy** | < 50ms | < 100ms | Shallow depth (1-2) |
| **Medium** | < 200ms | < 500ms | Moderate depth (3-4) |
| **Hard** | < 1000ms | < 2000ms | Deep search (5-6) + worker |

### Metrics to Track

```typescript
interface MinimaxMetrics {
  decisionTimeMs: number        // Total time to find move
  nodesEvaluated: number        // Total board positions evaluated
  nodeThroughput: number        // nodes/ms (higher = faster)
  pruningEfficiency: number     // prunesCut / (prunesCut + nodesEvaluated)
  memoHitRate: number           // memoHits / (memoHits + misses)
  moveOrderingQuality: number   // How early best move was found (0-1)
}
```

---

## 2. Current Baseline (TicTacToe as Reference)

### TicTacToe Performance Characteristics

| Setup | Depth | Nodes | Time (JS) | Time (WASM) |
|-------|-------|-------|-----------|------------|
| Empty board | 6 | ~255,000 | ~80ms | ~8ms |
| Mid-game (4 moves) | 6 | ~150,000 | ~50ms | ~5ms |
| Late-game (7 moves) | 6 | ~5,000 | ~2ms | ~0.2ms |

**Note**: WASM is 10x faster due to native compilation. Target for heavy games (Checkers, Connect-Four).

---

## 3. Games Needing Performance Analysis

### Tier 1: High Priority (Minimax intensive)
- **Checkers**: 8x8 board, ~10 pieces, high branching factor
  - Baseline: 3-4 depth for < 200ms target
  - Decision: JS minimax for easy/medium, WASM for hard
  
- **Connect-Four**: 7x6 board, < 42 positions, medium branching
  - Baseline: 5-6 depth achievable in < 200ms
  - Decision: Keep JS minimax, no WASM needed (fast enough)

- **Reversi**: 8x8 board, ~30 pieces, medium-high branching
  - Baseline: TBD (estimate 3-4 depth)
  - Decision: Monitor, WASM if > 200ms

### Tier 2: Lower Priority (Simple or non-minimax)
- TicTacToe: Already WASM-optimized ✅
- Monchola: Non-minimax (no AI needed)
- Puzzle games (Sudoku, Queens): Solvers, not minimax

---

## 4. WASM Compilation for Minimax

### Feasibility Assessment

**Challenges**:
- Generic types in TypeScript don't compile to WASM
- Board representation is game-specific
- Solution: Create game-specific WASM adapters

**Approach**:

```
AssemblyScript WASM Layer (per game):
┌─────────────────────────────────────┐
│ game-specific minimax (AS)          │  ← Compiled to .wasm
│ - evaluateBoard()                   │
│ - getLegalMoves()                   │
│ - applyMove()                       │
│ - minimax loop                      │
└─────────────────────────────────────┘
         ↓ Call from JS
┌─────────────────────────────────────┐
│ Game wrapper (TypeScript)           │  ← Implements GameAI<Board, Move, Player>
│ - Load WASM module                  │
│ - Marshal board → i32 array         │
│ - Call WASM minimax                 │
│ - Unmarshal result → Move           │
└─────────────────────────────────────┘
```

### Priority Ranking
1. **Checkers**: Highest ROI (complex board, heavy eval)
2. **Reversi**: Medium ROI (if profiling shows > 200ms)
3. **Connect-Four**: Low ROI (JS already fast)

---

## 5. Benchmarking Framework

### Script: `pnpm benchmark:ai`

```bash
# Run benchmarks for all games
pnpm benchmark:ai

# Run for specific game
pnpm --filter @games/checkers benchmark:ai

# Profile with detailed metrics
pnpm benchmark:ai -- --profile
```

### Benchmark Categories

```typescript
// 1. Decision Time (wall-clock)
measure('decision-time-easy', () => move = minimax(..., depth=1))
measure('decision-time-medium', () => move = minimax(..., depth=4))
measure('decision-time-hard', () => move = minimax(..., depth=6))

// 2. Throughput (nodes/ms)
measure('throughput', () => { ... }, { units: 'nodes/ms' })

// 3. Memory (peak usage)
measure('memory-peak', () => { ... }, { units: 'bytes' })

// 4. Pruning efficiency
measure('pruning-ratio', () => { ... }, { units: 'ratio' })
```

---

## 6. Performance Optimization Checklist

- [ ] **Checkers**: Profile minimax decision times at all difficulties
- [ ] **Connect-Four**: Verify < 200ms target met
- [ ] **Reversi**: Profile when AI implementation complete
- [ ] **Move Ordering**: Measure alpha-beta pruning benefit
- [ ] **Memoization**: Profile with/without position caching
- [ ] **Node Limit**: Test maxNodes safety valve effectiveness
- [ ] **WASM Decision**: Create Checkers WASM adapter if > 200ms

### Success Metrics

| Game | Easy | Medium | Hard | Status |
|------|------|--------|------|--------|
| TicTacToe | ✅ <10ms | ✅ <20ms | ✅ <80ms | WASM deployed |
| Checkers | ⏳ TBD | ⏳ TBD | ⏳ TBD | Pending profile |
| Connect-Four | ⏳ TBD | ⏳ TBD | ⏳ TBD | Pending profile |
| Reversi | ⏳ TBD | ⏳ TBD | ⏳ TBD | Pending profile |

---

## 7. Next Steps

1. **Immediate** (This session):
   - Run compliance audit to validate all integrations
   - Create benchmark harness

2. **Short-term** (Next session):
   - Profile Checkers performance at all difficulties
   - Decision point: WASM or optimize JS path?

3. **Medium-term**:
   - Implement Checkers WASM if needed
   - Extend to Reversi if needed
   - Document final performance baseline

---

## Resources

- **TicTacToe WASM**: `apps/tictactoe/assembly/index.ts` (reference implementation)
- **Build Script**: `pnpm wasm:build`
- **Instructions**: `.github/instructions/05-wasm.instructions.md`
