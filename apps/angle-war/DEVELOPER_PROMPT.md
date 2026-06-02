# Developer Prompt — Angle War

You are implementing the Artillery / Ballistics family game shell in this app.

## Product Direction
Tune trajectory and force, then commit to high-value artillery shots.

## Non-Negotiable Mechanics
- Angle and power control loop abstracted into action cadence
- Turn pressure simulated via intensity accumulation
- Salvo mechanics provide high-risk scoring bursts

## Dynamics To Preserve
- Deliberate setup versus aggressive volleys
- Turn-by-turn tension escalation

## Reuse Targets
- TurnManager
- BallisticsSolver
- ExplosionResolver

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
