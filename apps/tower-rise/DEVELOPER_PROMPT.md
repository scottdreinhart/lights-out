# Tower Rise — Complete Gameplay Description

Tower Rise is a classic arcade-style vertical platform climbing game in the spirit of early
single-screen platformers such as Donkey Kong. The entire level is visible on one screen at all
times. The player starts near the bottom of a tall tower and must climb upward through staggered
platforms, ladders, gaps, and hazards to reach the goal at the top. The game is about timing,
positioning, hazard pattern reading, and survival.

The playfield is a single static vertical tower made of horizontal walkways stacked above one
another and connected by ladders. Some routes are safer and slower; others are faster and riskier.
The ascent should force repeated left-right traversal while gradually climbing upward. The camera
does not scroll.

Player movement must feel tight, rigid, and deterministic:

- Move left/right with immediate response.
- Jump with a fixed arcade arc.
- Climb up/down only when aligned to ladders.
- Use constant gravity with no floaty smoothing.

Primary hazards are rolling objects spawned near the top. They travel across platforms and continue
downward by edge transitions and route changes. A limited chance of dropping down ladders is allowed
to preserve tension while keeping patterns readable.

Secondary hazards are roaming enemies that patrol and occasionally use ladders. Their behavior is
simple but sufficient to pressure safe routes and force timing decisions.

The objective is to reach the top goal point. On success, advance to harder stages/variants with
increased hazard pressure.

The game loop includes:

- Lives system with fast death/retry.
- Score system with hazard-jump reward and stage clear reward.
- Bonus timer pressure rewarding efficient climbs.
- Increasing difficulty via spawn rate, speed, enemy count, and route complexity.

Visual direction is retro arcade: readability first, strong silhouettes, clear contrast, and direct
state communication. Tower Rise should feel simple to understand and difficult to master.

## Short Copilot-Safe Version

Tower Rise is a fixed-screen vertical arcade platformer inspired by Donkey Kong. The player starts
at the bottom of a tower made of staggered platforms and ladders, then climbs to the top while
avoiding rolling hazards and roaming enemies. The level never scrolls; the whole tower is visible.
Movement is deterministic: left/right, fixed-arc jump, ladder climb when aligned. Hazards descend
from upper levels and create timing/routing pressure. The loop uses lives, score, bonus timer, fast
retries, and increasing difficulty. The feel must remain tight, predictable, readable, and retro.

## Best Prompt Form

Implement Tower Rise exactly as described above. Treat this description as the gameplay source of
truth. Preserve fixed-screen arcade climbing, deterministic movement, ladder traversal, rolling
descending hazards, and score/lives progression. Do not reinterpret this as a modern floaty physics
platformer, roguelike, metroidvania, or endless runner.

## Implementation Stack (Ingested)

Lock this stack for Tower Rise implementation:

- React (UI shell: menus/HUD/overlays/settings)
- PixiJS (2D rendering): https://pixijs.com/
- @pixi/react (React binding): https://react.pixijs.io/
- Custom deterministic fixed-timestep domain engine (movement/ladders/hazards/collision/scoring)
- Zustand (lightweight UI/app state): https://zustand.docs.pmnd.rs/
- Howler.js (audio): https://howlerjs.com/

Architecture target:

- `src/domain` -> simulation + rules (pure, deterministic)
- `src/app` -> orchestration hooks/services
- `src/ui` -> React HUD, menus, overlays
- `src/infrastructure` -> Pixi adapter, input adapter, audio adapter

Hard rule: React must not drive the simulation loop. Domain engine runs the fixed-step simulation,
Pixi renders frames, React presents UI state.

## Official Source Links

- PixiJS website: https://pixijs.com/
- PixiJS API docs: https://pixijs.download/release/docs/index.html
- PixiJS getting started: https://pixijs.com/7.x/guides/basics/getting-started
- @pixi/react docs: https://react.pixijs.io/
- @pixi/react repo: https://github.com/pixijs/pixi-react
- Zustand docs: https://zustand.docs.pmnd.rs/
- Zustand repo: https://github.com/pmndrs/zustand
- Howler.js site: https://howlerjs.com/
- Howler.js repo: https://github.com/goldfire/howler.js
- Phaser site (alternative reference): https://phaser.io/
- Phaser docs (alternative reference): https://photonstorm.github.io/phaser3-docs/
