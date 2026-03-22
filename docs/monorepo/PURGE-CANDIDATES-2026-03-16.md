# Purge Candidates (Executed)

Date: 2026-03-16

This report records the executed purge pass after verifying app-local replacements and scanning active references.

## Inputs Used

- Replacement existence + size/hash: `docs/monorepo/PURGE-GUARD-2026-03-16.csv`
- Active references scan across config/scripts/docs
- Current root runtime entrypoints in `package.json`

## Decision Rule

A root file is purge-eligible only if:

1. replacement exists in app/package location,
2. no active build/runtime scripts depend on root path,
3. app validation passed,
4. purge is approved in a separate step.

## Candidate Matrix

| Root Path | Replacement Path | Replacement Exists | Active Root Dependency | Status |
|---|---|---|---|---|
| `electron/main.js` | `apps/lights-out/electron/main.js` | Yes | No active runtime/build blocker (documentation mentions are informational) | **Purged** |
| `electron/preload.js` | `apps/lights-out/electron/preload.js` | Yes | No active runtime/build blocker (documentation mentions are informational) | **Purged** |
| `electron/types.ts` | `apps/lights-out/electron/types.ts` | Yes | No active runtime/build blocker (documentation mentions are informational) | **Purged** |
| `capacitor.config.ts` | `apps/lights-out/capacitor.config.ts` | Yes | No active runtime/build blocker (documentation mentions are informational) | **Purged** |
| `assembly/index.ts` | `apps/lights-out/assembly/index.ts` | Yes | No active runtime/build blocker (documentation mentions are informational) | **Purged** |
| `assembly/tsconfig.json` | `apps/lights-out/assembly/tsconfig.json` | Yes | No active runtime/build blocker (documentation mentions are informational) | **Purged** |
| `tests/accessibility.spec.ts` | `apps/lights-out/tests/accessibility.spec.ts` | Yes | No active runtime/build blocker (documentation mentions are informational) | **Purged** |
| `index.html` | `apps/lights-out/index.html` | Yes | No active runtime/build blocker (documentation mentions are informational) | **Purged** |
| `vite.config.js` | `apps/lights-out/vite.config.ts` | Yes | No active runtime/build blocker (documentation mentions are informational) | **Purged** |
| `public/icon.svg` | `apps/lights-out/public/icon.svg` | Yes | No active runtime/build blocker (documentation mentions are informational) | **Purged** |
| `public/manifest.json` | `apps/lights-out/public/manifest.json` | Yes | No active runtime/build blocker (documentation mentions are informational) | **Purged** |
| `public/offline.html` | `apps/lights-out/public/offline.html` | Yes | No active runtime/build blocker (documentation mentions are informational) | **Purged** |
| `public/sw.js` | `apps/lights-out/public/sw.js` | Yes | No active runtime/build blocker (documentation mentions are informational) | **Purged** |

## Conclusion

- **Purge executed:** all candidates listed above were removed from root.
- **Reason:** active runtime/build dependencies were cleared and replacement evidence was validated before deletion.

## Required Before Any Purge

1. Re-run validation (`apps/lights-out` + delegated root workflows).
2. Keep guard manifest updated with post-purge state.

## Safety Statement

Purge executed in a separate pass after evidence verification.
