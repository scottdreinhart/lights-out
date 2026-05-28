# 🏃 Endless Runner Generation Instructions

> **Scope**: Structured generation of endless runner game specifications and implementation prompts.
> Subordinate to `AGENTS.md` § 0 (Non-Negotiable Rules), § 3 (Architecture), § 12 (Responsive), and § 21 (Structure).
> **BASELINE**: Before generating runner specs, read `AGENTS.md` § 0. Do not emit vague mechanics. Directional flow is mandatory.

---

## 1. Purpose

Use this instruction to generate implementation-ready endless runner specs with unambiguous gameplay direction, camera behavior, movement, inputs, and progression.

Every generated runner must define:

- scroll direction
- camera perspective
- traversal model
- input model
- obstacle spawning and categories
- difficulty scaling
- reward loop
- failure conditions
- rendering/simulation separation

---

## 2. Canonical Schema

Use this schema as the source of truth. Do not remove fields.

```json
{
  "game_title": "",
  "genre_family": "endless_runner",
  "scroll_direction": "horizontal_right | horizontal_left | vertical_up | vertical_down | forward | backward | vertical_forward",
  "camera_mode": "side_view | top_down | isometric | third_person_behind | first_person | centered_follow | pseudo_3D_side",
  "lane_model": "3_lane | 2_lane | grid_based | single_plane | free_movement | vertical_free_movement | terrain_physics | fixed_path | group_physics | animation_trigger",
  "movement_model": "auto_run | auto_forward | momentum_based | terrain_based | tap_flight | tilt_steer | swipe_lane_switch | physics_glide",
  "primary_input": "tap | tap_hold | swipe | tilt | directional_buttons | single_button_jump | hold_release",
  "secondary_input": "",
  "core_pattern": "",
  "player_goal": "survive_as_long_as_possible | maximize_score | collect_targets | reach_distance_milestones | defeat_chase_state",
  "obstacle_model": "static | moving | lane_blockers | physics_hazards | enemy_hazards | gap_hazards | traffic_hazards | pattern_sequences",
  "collectible_model": "none | coins | pickups | score_multipliers | powerups | rescue_targets",
  "powerup_model": "none | shield | magnet | speed_boost | smash_mode | revive | weapon_mode",
  "difficulty_curve": "time_based | score_based | distance_based | phase_based | hybrid",
  "failure_condition": "single_hit | stamina_loss | fall_offscreen | collision_meter | swarm_depletion",
  "session_structure": "pure_endless | endless_with_missions | endless_with_boss_phases | endless_with_meta_unlocks",
  "tone": "arcade | cinematic | cute | cyberpunk | minimalist | retro | comedy | horror",
  "world_theme": "",
  "reference_archetypes": [],
  "must_have_systems": [],
  "must_not_have_systems": []
}
```

Machine-consumable JSON schema is provided at:
`.github/prompts/endless-runner/schema/endless-runner.schema.json`

---

## 3. Required Interpretation Rules

1. **Scroll direction must be literal**
   - `forward`: world approaches from horizon toward player.
   - `horizontal_right`: world scrolls right-to-left relative to player progression.
   - `vertical_up`: player ascends while content shifts downward relative to progression.
   - `vertical_forward`: player advances upward/forward over grid/lane rows.

2. **Camera must match direction**
   - `third_person_behind` typically pairs with `forward`.
   - `side_view` typically pairs with `horizontal_*`.
   - `centered_follow` typically pairs with `vertical_up`.
   - `isometric` typically pairs with `vertical_forward`.

3. **Lane model is required**
   - Must explicitly declare lane/grid/free/terrain/jump-only traversal.

4. **Movement model must define feel**
   - Example: `auto_run` vs `momentum_based` vs `swipe_lane_switch`.

5. **Difficulty scaling must be measurable**
   - Spawn frequency, speed, density, route ambiguity, aggression, lane compression.

6. **Failure must be readable**
   - Loss reason is immediate and obvious to the player.

---

## 4. Architecture Constraints (Mandatory)

```text
React is HUD/UI shell only.
Gameplay simulation runs in domain logic outside React.
Rendering uses PixiJS + @pixi/react.
Zustand is app/UI state only.
Howler.js may be used for audio.
No gameplay loop in React reconciliation.
No general-purpose physics unless terrain_physics is explicitly required.
Use fixed-timestep deterministic simulation.
Core gameplay rules live in domain systems.
```

---

## 5. Output Contract (Required Order)

Generated output must contain these sections in this order:

1. Game Identity
2. Directional Flow
3. Camera + Movement Model
4. Player Controls
5. Core Loop
6. Obstacle Systems
7. Collectibles + Power-Ups
8. Difficulty Scaling
9. Fail State
10. Scoring Model
11. Domain Systems Required
12. Rendering Rules
13. Anti-Patterns
14. Copilot Build Prompt

---

## 6. Reusable Assets

Reusable generator and presets live in:

- `.github/prompts/endless-runner/generator-template.txt`
- `.github/prompts/endless-runner/compact-template.txt`
- `.github/prompts/endless-runner/presets/subway-forward-3lane.json`
- `.github/prompts/endless-runner/presets/side-autorun-single-plane.json`
- `.github/prompts/endless-runner/presets/terrain-side-momentum.json`
- `.github/prompts/endless-runner/presets/grid-forward-isometric.json`

---

## 7. Rule Snippet (AGENTS/instruction embedding)

```text
Endless Runner Generation Rules
1. Every generated runner must explicitly define scroll_direction.
2. Every generated runner must explicitly define camera_mode.
3. The prompt must state how the world moves relative to the player.
4. The prompt must state whether movement is lane-based, free, terrain-based, or grid-based.
5. Inputs must be listed as concrete actions, not abstract “mobile controls”.
6. Obstacles must be categorized and tied to spawn rules.
7. Difficulty must scale by specific measurable factors.
8. Failure must be immediate and readable.
9. The game loop must be implementation-ready, not thematic only.
10. React is UI only. Simulation is domain logic only.
11. PixiJS renders the world. React renders HUD and overlays.
12. Generated output must include a Copilot build prompt.
```

---

## 8. Ultra-Compact Generator Form

Use this for fast generation passes:

```text
Generate a complete endless runner game spec.

Required fields:
- scroll_direction
- camera_mode
- lane_model
- movement_model
- primary_input
- obstacle_model
- collectible_model
- powerup_model
- difficulty_curve
- failure_condition

Also include:
- exact world scroll behavior
- exact player control mapping
- exact obstacle spawn categories
- exact score loop
- exact fail loop
- exact domain systems required

Architecture:
- React UI only
- PixiJS rendering
- fixed-step deterministic domain simulation
- no gameplay logic in React
```
