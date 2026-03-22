# Peer Candidate Selection Checklist

Use this checklist before starting any per-repo absorption PR.

## Inputs

- Absorption queue: `docs/monorepo/MONOREPO-ABSORPTION-QUEUE.md`
- Scaffold ranking: `docs/monorepo/SIBLING-REPO-SCAFFOLD-RANKING-2026-03-16.md`
- Candidate blueprint/runbook for selected repo

## Required Evidence

- [ ] Candidate set documented (at least 3 peer repos compared)
- [ ] Comparison criteria recorded:
  - completeness
  - merge safety / blast radius
  - shared-package ROI
  - script/reporting contract fit
- [ ] Winner rationale documented with tradeoffs
- [ ] Tie-breaker rationale documented (if scaffold ranking used)
- [ ] Nim handling note documented when Nim is in candidate set

## Selection Decision Record (Template)

- Date:
- Evaluated candidates:
- Selected candidate:
- Why selected now:
- Why not selected peers (short):
- Linked artifacts (queue/ranking/runbook/PR):

## Gate

Do not start migration copy steps until all required evidence boxes above are checked.
