# Monchola Root Script Verification — 2026-03-16

## Executed in current environment

| Script | Result | Exit Code | Note |
|---|---:|---:|---|
| monchola:web:lint | PASS | 0 | Verified via `docs/monorepo/script-run/monchola_web_lint.ec` / `monchola_lint_repro.ec` |
| monchola:web:typecheck | PASS | 0 | Verified via `docs/monorepo/script-run/monchola_web_typecheck.ec` |
| monchola:web:check | PASS | 0 | Retry verified via `docs/monorepo/script-run/monchola_web_check_retry.ec` |
| monchola:web:build | PASS | 0 | Verified via `docs/monorepo/script-run/monchola_web_build.ec` |
| monchola:wasm:build | PASS | 0 | Verified via `docs/monorepo/script-run/monchola_wasm_build.ec` |
| monchola:check:input | PASS | 0 | Verified via `docs/monorepo/script-run/monchola_check_input.ec` |
| mancala:web:typecheck | PASS | 0 | Verified via legacy artifact `docs/monorepo/script-run/moncala_web_typecheck.ec` |
| mancala:web:build | PASS | 0 | Verified via legacy artifact `docs/monorepo/script-run/moncala_web_build.ec` |
| mancala:web:check | PASS | 0 | Final isolated run verified via legacy artifact `docs/monorepo/script-run/moncala_web_check_final.ec` |

## Follow-up code fix applied

- Removed `@typescript-eslint/no-explicit-any` usage in `apps/monchola/src/app/useResponsiveState.ts` by introducing a typed `LegacyMediaQueryList` fallback.
- Verified no editor diagnostics for that file after patch.

## Platform-routed scripts (not executed in this pass)

| Script | Status | Reason |
|---|---:|---|
| monchola:windows:build | SKIPPED | Requires PowerShell Windows route |
| mancala:windows:build | SKIPPED | Requires PowerShell Windows route |
| monchola:mac:build | SKIPPED | Requires macOS route |
| mancala:mac:build | SKIPPED | Requires macOS route |
| monchola:ios:dev | SKIPPED | Requires macOS/Xcode route |
| monchola:ios:run | SKIPPED | Requires macOS/Xcode route |
| mancala:ios:dev | SKIPPED | Requires macOS/Xcode route |
| mancala:ios:run | SKIPPED | Requires macOS/Xcode route |
