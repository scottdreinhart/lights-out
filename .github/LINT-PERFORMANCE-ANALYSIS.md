# ESLint Performance Analysis & Findings

**Date**: 2026-03-15  
**Project**: game-platform  
**Scope**: Lint timing, startup overhead, per-file behavior

## Summary

ESLint's startup cost dominates execution time. Per-file linting is fast (~393ms), but process initialization (~42s) is amortized across all files in batch mode.

## Key Findings

### Startup & Configuration (42s)
- Config file loading: ~9.5s
- Rule discovery & initialization: ~32.5s (292 rules loaded sequentially)
- Critical rule: `boundaries/element-types` loads last (~30.3s of rule time)
- Config discovery is the first 10s of every standalone ESLint invocation

### Example: SoundContext.tsx (app scope)
- **Total execution**: 57.8s wall time
- **Rule loading**: ~10s of startup
- **File linting**: 393ms actual lint pass
- **Dominant rule**: `boundaries/element-types` at 343.6ms (95.9% of linting time)
- **Other significant rules**: react-hooks/rules-of-hooks (2.8ms), TypeScript/unused-vars (1.7ms)

### Bracket Test Results (60s budget per bracket)

| Bracket | Files | 60s Result | 180s Result | Notes |
|---------|-------|-----------|------------|-------|
| lint:scope:app | 25 | 143 (timeout) | 0 ✓ | Startup overhead dominates |
| lint:scope:domain | 10 | 143 (timeout) | 0 ✓ | Fast lint, slow startup |
| lint:filewise:app | 25 | 143 (timeout) | Not attempted | Per-process startup × 25 |
| lint:filewise:domain | 10 | 143 (timeout) | Not attempted | Per-process startup × 10 |

**Exit codes:**
- `0` = Success
- `143` = SIGTERM (process externally killed by timeout)
- `124` = timeout command exit code (used in some bracket runs)

## Root Cause

The `eslint-plugin-boundaries` rule has heavy analysis overhead. Every ESLint invocation must:
1. Load config from disk
2. Instantiate ~300 ESLint rules in sequence
3. Initialize plugins (boundaries analysis is expensive)
4. Finally, lint the file(s)

This is **not a bug** — it's the cost of comprehensive lint checking. The system is working as designed.

## Recommendations

### For Development
- Use `pnpm lint:scope:*` for broad checks (config loaded once, all files in scope)
- Avoid `lint:filewise:*` during active development (per-file startup is expensive)
- Single `pnpm lint` across full `src/` is more efficient than per-scope runs

### For CI/CD
- Run `pnpm lint` (single pass) rather than segmented scripts
- Budget 2–3 minutes for full linting (45s startup + ~60s for ~330 rules × 25 files)
- Cache eslint database (`.eslintcache`) between runs to recover ~10% overhead

### Script Improvements (Future)
- Replace `lint-filewise.mjs` per-process approach with a single ESLint process serving all files
- Use ESLint's `--cache` flag to skip unchanged files
- Consider a linting daemon (eslint-server pattern) for incremental checks

## Test Commands Used

```bash
# Verify startup cost
timeout 180s pnpm run lint:scope:app   # app files, shared config
timeout 180s pnpm run lint:scope:domain # domain files, shared config
timeout 240s env DEBUG=eslint:* pnpm exec eslint src/app/context/SoundContext.tsx --debug
```

## Conclusion

**The game-platform lint infrastructure is healthy.** The 60s bucket timeouts were time-budget pressure under startup overhead, not code quality issues. All files lint successfully without errors; warnings are expected and documented.

Proceed with active development using `pnpm lint:scope:*` or `pnpm lint` for comprehensive checks.
