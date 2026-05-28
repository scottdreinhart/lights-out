# Developer Prompt — Dash-Lanes

You are implementing the Endless Runner family game shell in this app.

## Product Direction
Maintain lane-read rhythm while obstacle cadence and speed pressure increase.

## Non-Negotiable Mechanics
- Forced-forward style progression
- Lane management represented by focus recovery
- Dash surges create high-output risk windows

## Dynamics To Preserve
- Reaction-window play and pacing control
- Burst scoring under obstacle pressure

## Reuse Targets
- ForwardMotionController
- LaneSwitcher
- ObstacleSequencer

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
