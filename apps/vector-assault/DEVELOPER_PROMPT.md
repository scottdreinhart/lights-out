# Developer Prompt — Vector Assault

Use this app as a hybrid target:

- **Primary**: Asteroids-like thrust-and-drift movement, fragmentation danger, vector readability.
- **Secondary**: modern arena-survival wave escalation and score-attack pressure.

## Product Direction
Build a single-screen wraparound survival arena where pressure escalates continuously and restart is immediate.

## Non-Negotiable Mechanics
- Rotate + forward thrust + inertia persistence.
- Primary forward fire with governed cadence.
- Fragmentation chain: large -> medium -> small hazards.
- Panic reposition ability with risk/tradeoff.
- Overdrive Burst as short power spike with cooldown/recovery.

## Dynamics To Preserve
- High-pressure survival optimization.
- Fragmentation as risk amplifier, not cosmetic effect.
- Tempo shifts between controlled navigation and burst offense.

## Reuse Targets
- AimVectorController
- ProjectilePool
- WaveDirector
- Wraparound + collision utilities
- Cooldown/charge primitives

## Architecture Contract
- Keep game rules in `src/domain` (deterministic simulation).
- Keep orchestration/state hooks in `src/app`.
- Keep rendering/HUD in `src/ui`.
- Preserve monorepo conventions and package boundaries.

## Canonical Governance References
- `.github/instructions/26-vector-assault.instructions.md`
- `.github/prompts/vector-assault/copilot-build-prompt.txt`
- `.github/prompts/vector-assault/acceptance-criteria.md`

## Next Iteration Tasks
1. Replace prototype meters with concrete hazard/projectile simulation.
2. Implement governed fire cadence + burst cooldown systems.
3. Implement measurable wave escalation factors (count/speed/overlap/special frequency).
4. Add deterministic domain tests for fragmentation + escalation transitions.
5. Add component and e2e tests for complete survive-score-escalate-restart loop.
