# Developer Prompt — Neon Hop

You are implementing the Platform Physics family game shell in this app.

## Product Direction
Time jumps and recoveries with precision to keep a kinetic platform run alive.

## Non-Negotiable Mechanics
- Jump-timing cadence and landing discipline
- Airborne risk represented by intensity growth
- Chain hops trade safety for speed and score

## Dynamics To Preserve
- Precision rhythm under increasing speed
- Recovery decisions after risky hops

## Reuse Targets
- KinematicBody2D
- GroundDetector
- JumpTuningProfile

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
