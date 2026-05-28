# Vector Assault Prototype Acceptance Criteria

## Movement Feel
- [ ] Ship rotates and thrusts forward only along facing direction.
- [ ] Momentum persists; no instant stop/frictionless strafe baseline.
- [ ] Repositioning requires vector planning under pressure.

## Arena and Threats
- [ ] Playfield is single-screen and wraps at edges.
- [ ] Large hazards split to medium, medium split to small.
- [ ] Fragmentation increases local danger and score opportunity.
- [ ] Later waves include occasional hunter/ranged threats.

## Combat
- [ ] Primary fire cadence is intentionally constrained.
- [ ] Overdrive Burst provides temporary power spike and recovery window.
- [ ] Panic reposition ability exists with explicit risk/tradeoff.

## Escalation
- [ ] Wave pressure scales by measurable factors (count, speed, overlap, special frequency).
- [ ] Progression has minimal downtime between waves.
- [ ] Late run is materially harder, not just visually different.

## Loop and UX
- [ ] Score/Lives/Tick-Wave always visible.
- [ ] Death reason is clear and readable.
- [ ] Restart is immediate and preserves score-attack rhythm.

## Presentation
- [ ] Vector style is high-contrast bright outlines on black.
- [ ] Silhouette readability remains intact at high density.
- [ ] Audio supports pulse-like urgency (not cinematic ambience).

## Architecture
- [ ] Gameplay rules live in domain layer.
- [ ] Rendering/HUD remain in UI layer.
- [ ] App layer handles orchestration/state only.
- [ ] Simulation loop remains deterministic and tunable.

