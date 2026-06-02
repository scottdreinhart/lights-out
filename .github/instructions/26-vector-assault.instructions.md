# 🎯 Vector Assault Hybrid Arena Shooter Instructions

> **Scope**: Source-grounded implementation rules for `apps/vector-assault`.
> Subordinate to `AGENTS.md` § 0 (Non-Negotiable Rules), § 3 (Architecture), § 8 (Response Contract), and § 21 (Project Structure).
> **BASELINE**: Preserve Asteroids-like inertia, fragmentation danger, and vector readability while using modern arena wave escalation.

---

## 1. Purpose

This instruction locks the game identity for **Vector Assault**:

- Primary reference: **Asteroids** movement feel + threat grammar + stark vector presentation.
- Secondary reference: **arena survival wave escalation** and score-attack pressure.
- Explicitly **not** a frictionless twin-stick clone.

---

## 2. Core Identity (Non-Negotiable)

1. Movement is **thrust-and-drift** (rotation + forward thrust + momentum persistence).
2. Arena is **single-screen with wraparound** for ship/hazards/projectiles.
3. Hazard loop is **fragmentation-based** (large -> medium -> small).
4. Combat cadence is **governed** (no unrestricted bullet spam).
5. Session loop is **survive -> score -> escalate -> die -> instant restart**.
6. Visual style is **minimal vector contrast** (bright outlines on black).

---

## 3. Movement and Input Model

- Rotate left/right (no strafe baseline).
- Thrust only along facing vector.
- Preserve inertia; do not snap to hard stop.
- Primary fire follows facing direction.
- Include panic reposition ability (hyperspace-like), with clear tradeoff and cooldown/risk.
- Include `Overdrive Burst` as short power spike with recovery/cooldown.

Input verbs (current labels may remain):

- Primary: `Strafe Fire` (implemented as directional fire/reposition cadence, not frictionless twin-stick drift)
- Secondary: `Reposition`
- Tertiary: `Overdrive Burst`

---

## 4. Threat and Wave Rules

Wave pressure must scale by measurable factors:

- object count
- average object speed
- fragmentation density
- cross-angle overlap pressure
- special hunter/ranged threat frequency

Hazard rules:

- large hazards split to medium
- medium hazards split to small
- small hazards terminate
- smaller shards increase danger and score value

Do not add downtime-heavy between-wave pauses.

---

## 5. Combat Cadence Rules

- Keep primary fire rate constrained.
- Prefer projectile cap and/or cadence timers to preserve fire discipline.
- Overdrive Burst must be temporary and tactical.
- Score should reward higher-risk/high-speed/smaller targets.

---

## 6. HUD Contract

HUD remains minimal and always visible:

- Score
- Lives
- Tick/Wave
- Pressure state (Intensity/Focus/Progress labels can remain if useful)

Provide direct actions for:

- Strafe Fire
- Reposition
- Overdrive Burst
- Reset Session

---

## 7. Architecture Contract

- Domain: deterministic simulation rules only (`src/domain`)
- App: orchestration/hooks/state (`src/app`)
- UI: rendering + HUD (`src/ui`)
- Infrastructure: runtime adapters, platform glue (`src/infrastructure`)

Required reusable primitives:

- vector ship entity
- asteroid/hazard entity
- projectile entity
- wraparound utility
- collision utility
- wave generator/director
- scoring rules
- cooldown/charge logic
- HUD widget blocks

Use centralized constants; keep simulation deterministic and framework-agnostic.

---

## 8. Anti-Patterns (Forbidden)

- Frictionless twin-stick baseline movement
- Static no-escalation enemy pacing
- Cosmetic-only fragmentation
- Unlimited bullet spam with no cadence pressure
- Texture-heavy rendering that harms silhouette readability
- Gameplay logic inside React render components

---

## 9. Acceptance Criteria

1. Ship handling clearly feels inertia-based.
2. Fragmentation materially changes danger and scoring.
3. Arena pressure escalates continuously and measurably.
4. Score loop motivates immediate replay.
5. Restart is immediate.
6. Visual readability remains high under late-wave clutter.
7. Outcome feels like “Asteroids-derived survival arena score attack,” not generic shooter skinning.

---

## 10. Sources

- Google Arts & Culture: Asteroids historical framing and vector identity.
- AtariAge manuals (2600/7800): thrust/rotation/fire/hyperspace behavior and cadence constraints.
- Steam / historical arena-shooter descriptions: wave-based score-attack survival framing.

