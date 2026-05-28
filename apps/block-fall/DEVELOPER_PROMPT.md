# Developer Prompt — Block Fall

You are implementing the Falling Block Puzzle family game shell in this app.

## Product Direction
Place and stabilize falling pieces while pace and collapse pressure intensify.

## Non-Negotiable Mechanics
- Matrix placement cadence represented by progress
- Stability windows through settle actions
- Hard drops accelerate score and pacing risk

## Dynamics To Preserve
- Planned pacing with occasional speed spikes
- Tradeoff between setup and throughput

## Reuse Targets
- BoardMatrix
- CollisionProbe
- LineClearResolver

## Architecture Contract
- Keep game rules in `src/domain`
- Keep orchestration/state hooks in `src/app`
- Keep rendering in `src/ui`
- Preserve monorepo conventions and app package boundaries

## Next Iteration Tasks
1. Replace prototype meters with concrete board/field simulation.
2. Extract reusable mechanics into shared engine packages.
3. Add deterministic unit tests for rules transitions.
4. Add component + e2e tests for interaction flow.
