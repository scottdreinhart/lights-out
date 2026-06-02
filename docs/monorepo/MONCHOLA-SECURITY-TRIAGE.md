# Monchola Security Triage

**Date**: 2026-04-16
**Scope**: `apps/monchola`
**Status**: Direct app-level remediation applied; workspace-level advisories remain

## Summary

Monchola's direct security finding from `wait-on` was remediated by upgrading to `wait-on@9.0.5`, which pulls `axios@^1.15.0` and removes the vulnerable axios range that was previously reported through `wait-on > axios`.

## Applied Fix

- Upgraded `wait-on` in [apps/monchola/package.json](../../apps/monchola/package.json) to `9.0.5`
- Re-ran Monchola validation successfully
- Added report helpers so `report:all` no longer fails on missing local scripts or missing lighthouse URL

## Verified Status

- `pnpm --filter @games/monchola validate` passes
- `pnpm --filter @games/monchola test` passes
- `pnpm --filter @games/monchola report:coverage` passes
- `pnpm --filter @games/monchola report:a11y` passes with no local a11y specs present
- `pnpm --filter @games/monchola report:lighthouse` now exits safely when `LIGHTHOUSE_URL` is unset

## Remaining Audit Findings

The current `pnpm audit` output still reports vulnerabilities from workspace-wide and transitive packages that are not unique to Monchola, including:

- `nodemailer`
- `rollup`
- `lighthouse` transitive dependencies
- `commitizen` transitive `lodash`
- Vite advisories in other apps still pinned to older versions

These should be handled in a separate workspace-wide dependency sweep so the remediation stays scoped and traceable.

## Next Step

Run a workspace-wide dependency review for the remaining transitive advisories, starting with packages that appear in shared tooling and then verifying affected apps individually.
