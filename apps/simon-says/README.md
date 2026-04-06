# SEQUENCE MEMORY (Simon-style)

**Canonical Source**: Wikipedia - Simon (game)  
**Genre**: Memory / Rhythm  
**Players**: 1-2  
**Real-Time**: Yes, with pauses between sequence plays

## Neutral Identity

- **Product Name**: Sequence Master, Color Recall, Tone Memory
- **Symbolism**: 4 colored pads (red, blue, green, yellow) or neutral indicators
- **Theme**: Minimal, colorblind-accessible

## Board Specification

- **Layout**: 4 buttons/pads arranged in square (2×2)
- **Button States**: Idle, Highlighted/Active (light+sound), Pressed (user interaction)
- **No scrolling**: Buttons always fully visible

## Game Objects

1. **Colored Pad** (4 total):
   - States: Idle, Lit, Pressed
   - Visual: Color change on light
   - Audio: Unique tone per pad
   - Tones (Proposed):
     - Red (A): Trumpet high note
     - Blue (E): Low note
     - Green (C♯): Mid note
     - Yellow (G): Low-mid note

## Core Rules

1. **Setup**: Initialize sequence to [random pad]
2. **Game Loop**:
   - **System Phase**: Play sequence (pad by pad, with sound + visual, 1 second per pad + 0.5s gap)
   - **Player Phase**: Player must repeat sequence exactly (pressing pads in correct order)
   - If **correct**: Append random pad to sequence, go to System Phase
   - If **wrong**: End game, display final level/score
3. **Scoring**:
   - Level = sequence length - 1
   - Higher level = higher score
4. **Win Condition**: Reach level 31 (or configurable max)
5. **Loss Condition**: Player repeats sequence incorrectly

## State Machine

```
[Sequence: [Pad-A]]
    ↓ System Plays: Light Pad-A, Sound, Wait
[Waiting for Player Input]
    ↓ Player Presses: Pad-A
[Correct, Level++]
    ↓ Sequence: [Pad-A, Pad-C]
    ↓ System Plays: Light A (1s) + Sound, Wait 0.5s, Light C (1s) + Sound, Wait 0.5s
[Waiting for Player Input]
    ↓ Player Presses: Pad-A, Pad-C
[Correct, Level++]
    ↓ ... continue ...
[Player Presses Wrong Pad OR Wrong Order]
    ↓ [GAME OVER - Display Level, Offer New Game]
```

## Input Model

**Keyboard**:

- Numbers 1-4 or WASD: Press colored pads
- N: New game
- ESC: Quit to menu

**Mouse**:

- Click pad to press it

**Touch**:

- Tap pad to press it

**Accessibility**:

- Optional: No-sound mode with visual-only cues (shape indicators)
- Colorblind: Pair colors with patterns or numbers

## UI Layout Contract

**Top HUD**:

- Level / Score display ("Level: 5")
- Mode indicator (Strict vs Normal if applicable)

**Central Area**:

- 2×2 grid of colored buttons
- Large enough for touch (min 60×60px each)
- Centered on screen, responsive scaling

**Bottom Controls**:

- New Game button
- Settings (sound on/off, strict mode toggle)
- Rules / Help

**Modes**:

1. **Normal**: Can make mistakes, sequence replayed
2. **Strict**: One mistake = game over

## Variants

1. **Standard (Default)**: 4 pads, levels 1-31
2. **Easy Mode**: Longer pauses between sounds, slower sequence playback
3. **Hard Mode**: Faster playback, shorter pauses
4. **8-Button Mode**: 2×4 or similar layout for extended complexity

## Test Requirements

1. **Sequence Generation**: Verify random pad appended each round
2. **Playback**: Verify system plays correct sequence with sounds/visuals
3. **Player Input Validation**: Verify correct vs incorrect input detection
4. **Game Over**: Verify game ends on first wrong input (in strict mode)

## Shared Reuse

- **Colored Button Component**: Reusable (can be used in other games)
- **Sequence Logic**: Reusable pattern/sequence system
- **Audio Engine**: Tone generation (reusable for music/audio effects)

## Legal / Brand Safety

- ✅ **Safe Name**: "Sequence Master" or "Color Recall"
- ✅ **Safe Symbols**: Generic colored buttons
- ✅ **No Copyright Risk**: Game mechanics are public domain
- ❌ **Avoid**: Exact replication of Simon Electronics UI/patents

## Implementation File Structure

```
apps/simon-says/
├── src/
│   ├── domain/
│   │   ├── types.ts          # Sequence, GameState, Pad
│   │   ├── rules.ts          # validateInput, nextLevel
│   │   ├── sequence.ts       # Sequence generation
│   │   ├── audio.ts          # Tone generation
│   │   └── index.ts          # barrel
│   ├── app/
│   │   ├── useSimonGame.ts
│   │   ├── useSequencePlayback.ts
│   │   ├── useAudio.ts
│   │   └── index.ts
│   ├── ui/
│   │   ├── atoms/PadButton.tsx
│   │   ├── molecules/PadGrid.tsx, HUD.tsx
│   │   ├── organisms/SimonGameScreen.tsx
│   │   └── index.ts
│   └── styles/
│       └── PadGrid.module.css
├── tests/
│   ├── sequence.unit.test.ts
│   ├── validation.unit.test.ts
│   └── gameplay.e2e.spec.ts
└── docs/
    ├── RULES.md
    └── audio-config.json
```
