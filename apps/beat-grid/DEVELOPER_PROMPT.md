# Developer Prompt — Beat Grid

You are implementing the Rhythm Timing family game shell in this app.

## Product Direction
Hit timing windows and sustain combo chains as beat density ramps upward.

## Non-Negotiable Mechanics
- Timing-window judgment loop
- Sync maintenance with penalty recovery path
- Combo push increases reward while narrowing safety

## Dynamics To Preserve
- Cadence mastery and rhythm consistency
- Intentional risk during combo pushes

## Reuse Targets
- BeatClock
- TimingWindowEvaluator
- ComboSystem

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
