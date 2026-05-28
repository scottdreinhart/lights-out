# Audio System Governance & Architecture

**Authority**: AGENTS.md § 35
**Scope**: All arcade applications and shared audio engines.

---

## 1. Modular Responsibilities

This repository enforces a strict separation between **playback** and **synthesis**.

| Concern           | Engine            | Responsibility                                      |
| ----------------- | ----------------- | --------------------------------------------------- |
| **Playback**      | Howler.js         | MP3/OGG loops, long music tracks, audio sprites.    |
| **Synthesis**     | Web Audio API     | Procedural bleeps, chip-synth, dynamic arpeggios.   |
| **Orchestration** | `@games/audio-engine` | Shared React context, volume management, and hooks. |

---

## 2. Infrastructure Layer Rules

1.  **No Direct Howler**: Applications MUST not import `howler` directly. Use `@games/audio-engine` hooks.
2.  **Asset Management**: Music loops MUST use the `loop: true` property in the `AudioAsset` definition.
3.  **Intensity Layers**: High-action games MUST implement intensity cross-fading via `useMusic`.

---

## 3. App Layer Rules (Hooks)

- Use `useAudio` for general orchestration.
- Use `useSynth` for programmatic sound effects (no asset files required).
- Use `useSfx` for audio sprite triggers (high performance).

---

## 4. UI Layer Rules (Presentation)

- The UI layer MUST NOT contain audio logic or playback triggers in `useEffect` without hook mediation.
- All games MUST be wrapped in the `<AudioProvider>` at the root.

---

## 5. Composition Checklist

- [ ] Does the game have a background loop?
- [ ] Are UI clicks routed through `useAudio` or `useSynth`?
- [ ] Does the game handle the "Victory" stinger?
- [ ] Is `prefers-reduced-motion` respected (handled automatically by `AudioProvider`)?
