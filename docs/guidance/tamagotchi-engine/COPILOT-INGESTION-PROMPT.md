# Tamagotchi Engine Copilot Ingestion Prompt

Use this prompt when asking Copilot to design, extend, or review `apps/tamagotchi-engine`.

## Mission

Build a deterministic Tamagotchi platform engine with a shared core and variant overlays. Do not create separate one-off implementations for Angel, Ocean, Mix/On, Pix, Smart, Uni, or future themed devices. Treat themed devices as capability-driven mutations of the same base pet simulation.

## Architectural Invariants

- Keep simulation in the domain layer.
- Keep orchestration in the app layer.
- Keep rendering and interaction surfaces in the UI layer.
- Keep the engine deterministic, pure where possible, and testable.
- Keep optional runtime accelerators such as WASM fallback-safe.
- Preserve the base pet loop even when adding variant-specific behavior.
- Prefer typed registries, factories, and adapters over app-name branching.
- Avoid hardcoding variant behavior into React components.

## Base Engine Contract

The core engine must support:

- lifecycle state transitions
- timer-driven decay
- care actions
- attention and call handling
- sickness, injury, and death paths
- evolution checks
- hidden variables
- interrupt events
- variant capability flags

## Variant Model

Each variant should declare a capability profile and optional hidden state. Variants may add:

- praise or discipline semantics
- sensor-style or tap-style interrupts
- predator or bat-style events
- harsher or softer decay tuning
- genetics and lineage data
- connection or pairing flows
- network/download state
- camera or touch-capable inputs
- UI page schema and action schema

## Required Engine Abstractions

### 1. Capability Flags

Model variant features with explicit booleans or typed capability objects such as:

- `supportsPraise`
- `supportsSensorTap`
- `supportsPredatorEvents`
- `supportsInjury`
- `supportsGenetics`
- `supportsConnection`
- `supportsNetworkContent`
- `supportsDownloadTickets`
- `supportsCamera`
- `supportsTouchUi`

### 2. Hidden Variable Registry

Do not limit hidden state to hunger, happiness, and discipline. Support variant-specific hidden state such as:

- care mistakes
- Angel Power
- Deeds
- injury count
- lineage traits
- online entitlements
- temporary event flags

### 3. Event-Driven Attention Model

Replace one boolean call-light model with a queue or state machine for events such as:

- hunger low
- happiness low
- prayer window
- bat attack
- predator attack
- sickness
- injury
- stroll return
- social invite
- update available

### 4. Event Resolution Strategy

Each event should define:

- response type
- time window
- accepted input channel
- success effect
- failure effect
- whether it counts as a care mistake
- whether it mutates hidden state

### 5. Variant UI Schema

The UI should be driven by variant metadata:

- which status pages exist
- which primary actions exist
- which alerts can interrupt normal flow
- which inputs are supported
- which social or network screens exist

## Variant-Specific Guidance

### Angel

Angel is not a skin. It is a praise-and-virtue variant with contextual praise windows, reward progress, interrupt handling, and sensor-like input affordances.

### Ocean

Ocean is not a skin. It is a high-difficulty variant with predator interrupts, injury as a distinct state, and aggressive failure pacing.

### Connection / Mix / On / Uni

These variants introduce coupling, trait inheritance, social state, downloadable content, and service-backed features. Treat evolution as lineage-aware when required.

### Pix / Smart

These variants add touch- or camera-style interaction capabilities. Keep input capability composition explicit instead of button-only assumptions.

## UI and UX Rules

- Status UI should be page-based, not one fixed dashboard.
- Action affordances must be contextual.
- Urgent interrupts must visually override passive care screens.
- Input hints must teach the active capability set.
- Online or download features must expose explicit availability states.
- Long-term systems need history, lineage, or profile surfaces.
- Decorative icons or emoji must keep text labels present for accessibility.

## Repo-Targeted Implementation Notes

When changing `apps/tamagotchi-engine`, prefer these touch points:

- `src/domain/variant.interface.ts`
- `src/domain/types.ts`
- `src/domain/constants.ts`
- `src/domain/evolution.engine.ts`
- `src/domain/mood.system.ts`
- `src/domain/pet.state-machine.ts`
- `src/domain/variants/*.ts`
- `src/app/useTamagotchiEngine.ts`
- `src/ui/organisms/TamagotchiScreen.tsx`
- `src/ui/organisms/TamagotchiScreen.module.css`
- `src/ui/molecules/PetMeters.tsx`
- `src/styles.css`
- `src/wasm/pet-kernel.ts`

## Copilot Output Expectations

When Copilot edits this area, it should:

- state the target layer first
- name the variant capability or event being added
- keep changes minimal and localized
- preserve deterministic behavior
- validate after each meaningful edit
- avoid parallel implementations and hidden assumptions

## Source Pack to Ingest First

1. P1 disassembly and baseline behavior references
2. Bandai patent model for calling, discipline, coupling, and offspring flow
3. Hardware and reversing references for device capability evolution
4. Official Angel and Uni pages for present-day confirmed mechanics
5. Community Angel and Ocean care guides for variant-specific behavior feel

## Short Form

Build a deterministic base pet engine plus a capability-driven variant layer, where themed Tamagotchis are data- and event-shaped mutations of the same core simulation.
