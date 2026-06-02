# Tower Rise

Tower Rise is a fixed-screen vertical arcade platformer inspired by classic single-screen climbers.
The player starts at the bottom of a tower and must reach a top goal by navigating staggered
platforms, ladders, and hazards.

## Gameplay Source of Truth

- Single static screen (no camera scrolling): the full tower is always visible.
- Tight deterministic controls: move left/right, fixed-arc jump, climb up/down when ladder-aligned.
- Zig-zag ascent routing: repeated back-and-forth traversal while climbing.
- Rolling descending hazards from upper levels; readable patterns with limited route variance.
- Secondary roaming enemies that pressure otherwise safe routes.
- Classic arcade loop: lives, score, bonus timer, fast retries, increasing difficulty.

## Core Objective

Reach the top goal point while surviving hazards and enemy pressure. Clearing the stage advances to
harder layouts/variants with greater speed, spawn density, and route overlap.

## Design Intent

Tower Rise should feel:

- Immediate and precise (not floaty or physics-heavy)
- Readable and pattern-driven
- Skill-based, replayable, and retro arcade in pacing

## Guardrails

Do not reinterpret Tower Rise as:

- Endless runner
- Roguelike
- Metroidvania
- Modern floaty-physics platformer

Treat this README and `DEVELOPER_PROMPT.md` as behavior-level guidance for future implementation.

## Implementation Stack (Locked for Tower Rise)

- **React** for menus, HUD, overlays, settings
- **PixiJS** for 2D rendering: https://pixijs.com/
- **@pixi/react** for React binding: https://react.pixijs.io/
- **Custom deterministic domain engine** for simulation (fixed timestep)
- **Zustand** for lightweight app/UI state: https://zustand.docs.pmnd.rs/
- **Howler.js** for sound effects/music: https://howlerjs.com/

### Architecture Mapping

- `src/domain` -> simulation, entities, collisions, scoring, progression
- `src/app` -> orchestration hooks/session state
- `src/ui` -> HUD/menus/overlays
- `src/infrastructure` -> Pixi renderer/input/audio adapters

### Critical Rule

React is the UI shell, not the game loop. The deterministic simulation must run in the domain
engine, with Pixi responsible for frame rendering.

## Official References

- PixiJS API docs: https://pixijs.download/release/docs/index.html
- @pixi/react repo: https://github.com/pixijs/pixi-react
- Zustand repo: https://github.com/pmndrs/zustand
- Howler.js repo: https://github.com/goldfire/howler.js
- Phaser (alternative): https://phaser.io/ and https://photonstorm.github.io/phaser3-docs/
