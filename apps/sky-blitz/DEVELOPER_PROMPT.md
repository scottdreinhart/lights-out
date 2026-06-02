# Developer Prompt — Sky Blitz

You are implementing the Side Scroller family game shell in this app.

## Product Direction
Push forward through scrolling hazard waves and keep flight momentum alive.

## Non-Negotiable Mechanics
- Forward pressure loop with hazard cadence
- Boost and stability management under scrolling tension
- Distance-driven progression represented by progress score

## Dynamics To Preserve
- Momentum management and recovery windows
- High-tempo risk spikes during barrel roll bursts

## Reuse Targets
- SideScrollCamera
- HazardSpawner
- CheckpointSystem

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
