# Developer Prompt — Circuit Maze

You are implementing the Maze Runner family game shell in this app.

## Product Direction
Collect all nodes in a hostile grid while pressure rises from roaming sentinels.

## Non-Negotiable Mechanics
- Grid navigation with pickup completion objective
- Pursuit pressure simulated through rising intensity
- Power state represented by temporary focus burst

## Dynamics To Preserve
- Route planning under escalating pressure
- Risk/reward choices between safe clears and burst dashes

## Reuse Targets
- GridMap
- Pathfinder
- CollectibleLayer
- EnemyStateMachine

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
