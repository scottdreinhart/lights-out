# Developer Prompt — Arc Spin

You are implementing the Paddle / Rotary family game shell in this app.

## Product Direction
Deflect incoming vectors with precision and build combo pressure on clean returns.

## Non-Negotiable Mechanics
- Reflection-focused control loop
- Angle discipline modeled through focus and intensity
- Power spin raises output but also danger

## Dynamics To Preserve
- Combo-oriented precision play
- Controlled aggression during power windows

## Reuse Targets
- PaddleController
- DeflectionResolver
- AngularLaneMap

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
