# Purge Safety Protocol

## Non-Negotiable Rule

Never delete or purge a root file until a verified replacement exists in-project and has passed app validation.

## Required Order

1. Copy/migrate candidate to target app/package location.
2. Verify both files exist (source and destination).
3. Record size/hash evidence in a purge guard manifest.
4. Run target app `typecheck` and `build`.
5. Only then mark source as eligible for purge.
6. Purge in a separate pass (never in the same step as migration).

## Verification Checklist

For every candidate path:

- [ ] Source exists.
- [ ] Destination exists.
- [ ] Destination is complete (feature parity or intentional superset).
- [ ] Manifest row recorded (path, size, hash for both).
- [ ] Target app passes `typecheck`.
- [ ] Target app passes `build`.

If any check fails, do not purge.

## Dependency Classification Rule

For purge gating, treat only **active runtime/build dependencies** as blockers:

- `package.json` script/entrypoint references
- build/tool config references used by current workflows
- direct imports/loads used at runtime

Documentation-only mentions (historical plans, runbooks, architecture notes) are informational and do not block purge by themselves.

## Safety Controls

- No bulk deletes.
- No delete in same operation as first-time file move.
- No purge without a committed/recorded manifest.
- No purge if validation is red.

## Current Manifest

- `docs/monorepo/PURGE-GUARD-2026-03-16.csv`

## Current Status

- Migration copies are in place for Lights-Out web/platform/runtime files.
- Validation passed for `apps/lights-out`.
- Approved root duplicates were purged in a separate pass.
- Guard manifest reflects post-purge state (`root_exists=false`, `app_exists=true`).
