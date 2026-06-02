# Endless Runner Prompt Pack

This pack provides copy-paste assets for deterministic endless runner generation
with explicit directional flow, camera model, traversal mode, and input mapping.

## Files

- `generator-template.txt` — master prompt template with fixed output contract
- `compact-template.txt` — ultra-compact generation template for quick passes
- `schema/endless-runner.schema.json` — JSON schema for config validation
- `presets/subway-forward-3lane.json`
- `presets/side-autorun-single-plane.json`
- `presets/terrain-side-momentum.json`
- `presets/grid-forward-isometric.json`

## Usage

1. Pick a preset JSON or create a config that matches the schema.
2. Paste `generator-template.txt` into your coding model.
3. Replace placeholders with your config values.
4. Enforce section order and architecture constraints from `22-endless-runner.instructions.md`.

## Locked Generation Guarantees

Generated output must always define:

- exact scroll direction
- exact camera behavior
- exact movement/lane model
- explicit input-to-action mapping
- obstacle categories + spawn behavior
- measurable difficulty progression
- readable failure condition
- simulation/rendering separation
