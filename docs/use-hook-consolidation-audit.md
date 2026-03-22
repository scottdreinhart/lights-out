# Use-Hook Consolidation Audit (`apps/**/src/**/use*.ts`)

Date: 2026-03-17

## Scope and Method

- Scanned all app hook files matching `apps/**/src/**/use*.ts`.
- Excluded `docs/**` backup artifacts from decisions.
- Grouped hooks by:
  - exact duplicate implementations,
  - near-duplicate families (same behavior, different app keys/config),
  - intentionally unique hooks that should remain app-specific.

## Inventory Summary

- Total active hook files: **~120** (plus one docs backup artifact).
- Highest duplication is concentrated in `useGame.ts` (pile-style games), `useTheme.ts`, `useStats.ts`, and `useSoundEffects.ts`.

## Merge-Ready (Exact Duplicates)

### 8 exact duplicate `useGame.ts` files

The following files are functionally/textually identical and represent the clearest consolidation target:

- `apps/cee-lo/src/app/useGame.ts`
- `apps/chicago/src/app/useGame.ts`
- `apps/cho-han/src/app/useGame.ts`
- `apps/farkle/src/app/useGame.ts`
- `apps/liars-dice/src/app/useGame.ts`
- `apps/mexico/src/app/useGame.ts`
- `apps/pig/src/app/useGame.ts`
- `apps/ship-captain-crew/src/app/useGame.ts`

Decision:
- **Consolidate in next phase** into a shared pile-game preset helper (keeping app-level entry files thin).
- Keep app-level `useGame.ts` exports for API stability, but purge duplicated worker/config boilerplate.

## Near-Duplicate Families (Mostly Already Consolidated)

### `useStats.ts`

- Most apps already use `createUseStatsHook(...)` from shared utilities.
- Differences are mostly storage keys and local load/save wrappers.

Decision:
- **Keep app-level wrappers**, as they encode per-app keys and persistence shape.
- No immediate purge needed.

### `useSoundEffects.ts`

- Most apps already use shared sound-effects factory.
- Differences are sound map composition and optional actions.

Decision:
- **Keep wrappers** for per-app sound profiles.
- Standardize signature checks in follow-up, but no broad purge now.

### `useTheme.ts`

- Large repeated `THEME_COLORS` payload appears across many apps.
- Hook scaffolding is similar, but app theme keys/storage IDs vary.

Decision:
- **Consolidate shared color constants** into shared domain package in follow-up.
- Keep app wrappers for app-specific storage key and theme behavior.

## Intentionally Unique Hooks (Do Not Consolidate)

### Nim platform/integration hooks (retain)

These are cross-platform orchestration hooks and should remain app-specific:

- `apps/nim/src/app/hooks/useAppLifecycle.ts`
- `apps/nim/src/app/hooks/useGamePersistence.ts`
- `apps/nim/src/app/hooks/usePlatform.ts`
- `apps/nim/src/app/hooks/useCapacitor.ts`
- `apps/nim/src/app/hooks/useIonicPlatform.ts`
- `apps/nim/src/app/hooks/useIonicToast.ts`
- `apps/nim/src/app/hooks/useHaptics.ts`
- `apps/nim/src/app/hooks/useWasmParticles.ts`

Reason:
- They bind to Capacitor/Electron/Ionic/native capabilities and runtime-specific lifecycle behavior.

### TicTacToe orchestration hooks (retain)

These are game-orchestration specific and should remain app-specific:

- `apps/tictactoe/src/app/useTicTacToe.ts`
- `apps/tictactoe/src/app/useGameOrchestration.ts`
- `apps/tictactoe/src/app/useCpuPlayer.ts`
- `apps/tictactoe/src/app/useGridKeyboard.ts`
- `apps/tictactoe/src/app/useSeries.ts`
- `apps/tictactoe/src/app/useNotificationQueue.ts`
- `apps/tictactoe/src/app/useCoinFlipAnimation.ts`

Reason:
- These hooks encode game-specific state machines and UX flows, not generic infra.

## Gaps / Follow-up Items

- `apps/monchola/src/app/useSoundEffects.ts` is effectively a placeholder and should be implemented or removed.
- Confirm app-level expectations for apps missing expected hooks (`useTheme`, `useStats`, or `useGame`) before forcing parity.

## Recommended Execution Plan

1. **Phase 1 (safe):** consolidate the 8 duplicate pile-game `useGame.ts` implementations via shared preset helper.
2. **Phase 2 (safe):** centralize shared `THEME_COLORS` constants to reduce repeated theme payloads.
3. **Phase 3 (targeted):** patch placeholders/missing hooks (starting with `monchola/useSoundEffects.ts`).
4. **Phase 4 (guardrails):** add lightweight lint/check scripts to flag newly introduced duplicate hook bodies.

## Execution Status (Current)

- **Phase 1 complete:** 8 exact-duplicate pile-game `useGame.ts` files now use shared helper composition via `@games/app-hook-utils`.
- **Phase 2 complete:** repeated local `THEME_COLORS` payloads were centralized to `@games/domain-shared` (`SHARED_THEME_COLORS`) and Nim canonical theme IDs were repaired to cyberpunk IDs (`chiba-city`, `neon-arcade`, `night-district`, `gridline`, `vaporwave`, `synthwave`, `high-contrast`).
- **Phase 2 follow-through complete:** Nim i18n translation keys were also canonicalized (`settings.theme.chiba-city`, `settings.theme.neon-arcade`, `settings.theme.night-district`, `settings.theme.gridline`, `settings.theme.vaporwave`, `settings.theme.synthwave`, `settings.theme.high-contrast`) and picker mapping was updated accordingly.

## Decision Rule Going Forward

For every new `use*.ts` in `apps/`:

- If it differs only by storage key/config → use shared factory + thin wrapper.
- If it includes platform bridges (Capacitor/Electron/Ionic) or game state machine logic → keep app-local and document uniqueness.
- If textually identical across 2+ apps → treat as consolidation candidate by default.
