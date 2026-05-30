# Atomic Design Policy (Web + Native)

## Purpose
Ensure presentation architecture remains modular, scalable, and platform-appropriate while preserving shared design intent.

## Required Hierarchy
1. Atoms
2. Molecules
3. Organisms
4. Templates
5. Pages/Screens

## Rules
- Atoms are primitive building blocks and contain no business logic.
- Molecules combine atoms into small functional UI units.
- Organisms combine molecules/atoms into reusable sections.
- Templates define structural layout and region composition.
- Pages/Screens assemble templates/organisms and connect to application state.

## Cross-Platform Guidance
- Keep shared semantics, naming, and tokens aligned across web and native.
- Allow platform-specific implementations for atoms/molecules/organisms where needed.
- Do not force direct implementation portability between web component libraries and native primitives.

## Boundaries
- Domain and application logic must not be implemented in atoms/molecules.
- Page/screen orchestration must not leak into primitives.
- Platform-specific input/focus/media behavior belongs in shell-level UI or adapters.

## TV Considerations
For TV-capable surfaces, require:
- Explicit focus graph behavior
- D-pad navigation handling
- Remote-first interaction flows
- Large-screen layout and readability
