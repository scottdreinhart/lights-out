# TicTacToe Code Merge Triage

## Purpose

Track same-name file comparisons between:

- current app: `src/**` (lights-out)
- absorbed app: `apps/tictactoe/src/**`

Goal: identify where to keep, merge, or extract shared code.

## Current Snapshot

- Common relative file paths: **39**
- Identical content: **15**
- Different content (needs triage): **24**

## Immediate Safe Dedupe Completed

- Removed nested duplicate tree: `apps/tictactoe/.github/.github`
- Merged unique nested governance files into canonical: `apps/tictactoe/.github/*`
- Extracted shared theme contract into workspace package: `packages/theme-contract`
   - Both apps now consume shared theme constants/types via `@games/theme-contract`
   - Local domain APIs preserved through non-breaking type aliases in each app's `src/domain/types.ts`
- Extended shared contract with `GameStats` to remove duplicate stats interfaces in both apps

## Divergent Files (Priority Triage Set)

### P1 — likely shared package extraction candidates

- `src/domain/ai.ts`
- `src/domain/board.ts`
- `src/domain/constants.ts`
- `src/domain/index.ts`
- `src/domain/rules.ts`
- `src/domain/themes.ts`
- `src/domain/types.ts`
- `src/workers/ai.worker.ts`

### P1 — input/UI infrastructure candidates

- `src/ui/molecules/HamburgerMenu.tsx`
- `src/ui/molecules/HamburgerMenu.module.css`
- `src/ui/atoms/SoundToggle.tsx`
- `src/ui/atoms/index.ts`
- `src/ui/index.ts`
- `src/ui/utils/cssModules.ts`
- `src/ui/utils/index.ts`

### P2 — app-shell specific, merge carefully

- `src/index.tsx`
- `src/styles.css`
- `src/app/index.ts`
- `src/ui/organisms/App.tsx`
- `src/ui/organisms/index.ts`
- `src/ui/ui-constants.ts`

### P3 — generated/artifact-level divergence

- `src/wasm/ai-wasm.ts`

## Merge Policy (Per File)

For each divergent file:

1. Compare feature sets and bug fixes in both versions.
2. Decide one action:
   - `keep-lights-out`
   - `keep-tictactoe`
   - `merge-both`
   - `extract-shared-package`
3. If merged/extracted, add regression tests before deleting deprecated code.
4. Remove deprecated duplicate implementation after validation.

## Execution Order

1. Domain + worker files (highest shared ROI)
2. Input/UI infrastructure files
3. App-shell files
4. Generated artifacts last

## Next Concrete Step

- Implement T-005 script alias completion in `apps/tictactoe/package.json`
- Then run T-008 contract validation commands
