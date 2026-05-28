# 🎛️ THEME SYSTEM STYLEGUIDE

**Codename:** *Neon Terminal Doctrine*
**Influences:** William Gibson, J. R. R. Tolkien (reinterpreted through cyberpunk lens), retro arcade systems, VT100 terminals, synthwave aesthetics

---

# 1. 🧠 THEME ARCHITECTURE MODEL

## 1.1 Layered Token System (MANDATORY)

```
[ RAW PALETTE ]
    ↓
[ SEMANTIC TOKENS ]
    ↓
[ COMPONENT TOKENS ]
    ↓
[ RUNTIME ADAPTATION ]
```

### WHY THIS MATTERS

* Prevents hardcoded colors in UI
* Enables accessibility transformations (colorblind modes)
* Enables cross-platform rendering (Web / Electron / Mobile / Canvas)

---

# 2. 🎨 CORE COLOR SYSTEM

## 2.1 Base Palette (from your catalog)

Each theme MUST define:

```ts
type ThemePalette = {
  accent: string
  background: string
  surface: string
  primary: string
  secondary: string
  muted: string
  danger: string
  warning: string
  success: string
}
```

---

## 2.2 Example: `chiba-city`

**Philosophy:** Terminal hacker / green phosphor CRT

```
accent:     #00ff41
background: #020403
surface:    #04110a
primary:    #00ff41
secondary:  #00cc33
muted:      #0f2a1a
danger:     #ff0040
warning:    #ffaa00
success:    #00ff88
```

---

## 2.3 Example: `vaporwave`

**Philosophy:** Synthetic nostalgia / corrupted memory

```
accent:     #f43f5e
background: #0b0014
surface:    #14002a
primary:    #ff71ce
secondary:  #01cdfe
muted:      #3a1c4a
danger:     #ff0055
warning:    #ffcc00
success:    #00f5d4
```

---

# 3. 🧬 SEMANTIC TOKENS (CRITICAL)

These are what UI actually consumes.

```ts
type SemanticTokens = {
  text: {
    primary: string
    secondary: string
    disabled: string
    inverse: string
  }

  background: {
    base: string
    elevated: string
    overlay: string
  }

  border: {
    subtle: string
    strong: string
    focus: string
  }

  state: {
    hover: string
    active: string
    selected: string
    disabled: string
  }
}
```

---

## 3.1 RULES

* ❌ NEVER use raw palette in UI
* ✅ ALWAYS use semantic tokens
* ✅ Semantic tokens must adapt for:

  * display mode
  * colorblind mode

---

# 4. 🧱 COMPONENT TOKEN SYSTEM

Each UI primitive gets derived tokens:

## 4.1 Button

```ts
type ButtonTokens = {
  bg: string
  text: string
  border: string
  hoverBg: string
  activeBg: string
  focusRing: string
}
```

---

## 4.2 Panel / Card

```ts
type PanelTokens = {
  bg: string
  border: string
  shadow: string
}
```

---

## 4.3 Game Tile (IMPORTANT FOR YOUR PLATFORM)

```ts
type TileTokens = {
  bg: string
  border: string
  highlight: string
  correct: string
  incorrect: string
}
```

---

# 5. 🖥️ DISPLAY MODES

## 5.1 Modes

* `system`
* `light`
* `dark`

---

## 5.2 Behavior Rules

| Mode   | Behavior                        |
| ------ | ------------------------------- |
| system | Mirrors OS                      |
| light  | Soft contrast, reduced glow     |
| dark   | High glow, neon intensification |

---

## 5.3 Cyberpunk Rule

> Dark mode is the **primary canonical mode**.
> Light mode is a *degraded simulation of reality*.

---

# 6. 👁️ COLORBLIND TRANSFORMATION ENGINE

## 6.1 Required Modes

* protanopia
* deuteranopia
* tritanopia
* achromatopsia

---

## 6.2 Implementation Strategy

Instead of redefining themes:

```
finalColor = applyColorTransform(baseColor, mode)
```

---

## 6.3 Rules

* ❌ Do NOT maintain separate palettes per mode
* ✅ Use transformation matrices
* ✅ Preserve contrast ratios

---

# 7. 💡 LIGHTING & GLOW SYSTEM

## 7.1 Neon Glow Tokens

```ts
type GlowTokens = {
  intensity: number
  radius: number
  color: string
}
```

---

## 7.2 Theme Behavior

| Theme       | Glow               |
| ----------- | ------------------ |
| chiba-city  | CRT phosphor bleed |
| neon-core   | soft bloom         |
| neon-arcade | hard edge glow     |
| vaporwave   | diffuse haze       |
| synthwave   | gradient glow      |

---

## 7.3 CSS Example

```css
.neon {
  text-shadow:
    0 0 4px var(--accent),
    0 0 8px var(--accent),
    0 0 16px var(--accent);
}
```

---

# 8. 🔤 TYPOGRAPHY SYSTEM

## 8.1 Font Classes

| Role     | Style                     |
| -------- | ------------------------- |
| UI       | Clean sans                |
| Terminal | Monospace                 |
| Arcade   | Pixel                     |
| Lore     | Serif (Tolkien influence) |

---

## 8.2 Terminal Mode

```css
font-family: "IBM Plex Mono", "Fira Code", monospace;
letter-spacing: 0.05em;
```

---

## 8.3 Cyberpunk Rule

> Text is not neutral—it is *signal*.
> UI text should feel like output from a system, not decoration.

---

# 9. 🧊 SURFACE & DEPTH SYSTEM

## 9.1 Elevation Model

```
Base → Surface → Elevated → Overlay → Modal
```

---

## 9.2 Depth Effects

| Layer    | Effect          |
| -------- | --------------- |
| Base     | flat            |
| Surface  | subtle gradient |
| Elevated | glow edge       |
| Overlay  | blur + opacity  |
| Modal    | heavy contrast  |

---

# 10. 🎮 GAME-SPECIFIC THEMING RULES

## 10.1 Board Visibility (from your requirements)

* Entire board must be visible
* No scroll (unless mechanic requires it)

---

## 10.2 Feedback Colors

| State   | Meaning            |
| ------- | ------------------ |
| Accent  | active interaction |
| Success | correct            |
| Danger  | failure            |
| Muted   | inactive           |

---

## 10.3 Animation Style

| Theme       | Motion        |
| ----------- | ------------- |
| chiba-city  | scanlines     |
| neon-arcade | bounce + snap |
| synthwave   | smooth easing |
| gridline    | rigid         |

---

# 11. 🧠 RUNTIME THEME ENGINE

## 11.1 Hook Contract

```ts
useTheme(): {
  themeId: ThemeId
  mode: DisplayMode
  colorblindMode: ColorblindMode
  tokens: SemanticTokens
}
```

---

## 11.2 Provider

```tsx
<ThemeProvider
  theme="chiba-city"
  mode="dark"
  colorblind="none"
/>
```

---

# 12. 🔐 GOVERNANCE RULES (CRITICAL FOR YOUR SYSTEM)

## 12.1 HARD RULES

* ❌ No hardcoded colors
* ❌ No inline styles for color
* ❌ No component-local palettes

---

## 12.2 REQUIRED

* ✅ All colors come from tokens
* ✅ All components consume tokens
* ✅ ESLint rule enforces usage

---

## 12.3 Suggested ESLint Rule

* `no-raw-colors`
* `theme-token-required`

---

# 13. 🧩 FILE STRUCTURE

```
packages/
  theme-contract/
    src/index.ts        ← canonical tokens

src/
  ui/theme/
    themeRegistry.ts    ← runtime mapping
    transforms/
      colorblind.ts
      lighting.ts
```

---

# 14. 🧠 DESIGN PHILOSOPHY (IMPORTANT)

### Gibson Layer

* Systems over aesthetics
* Interfaces feel *alive and dangerous*

### Tolkien Layer

* Themes are *worlds*, not skins
* Each palette has narrative identity

---

# 15. 🔥 EXTENDED THEME PERSONALITIES

| Theme          | Identity               |
| -------------- | ---------------------- |
| chiba-city     | hacker terminal        |
| neon-core      | modern SaaS neon       |
| neon-arcade    | retro cabinet          |
| night-district | dystopian alley        |
| gridline       | minimalist system grid |
| vaporwave      | corrupted nostalgia    |
| synthwave      | cinematic future       |
| high-contrast  | accessibility-first    |

---

# 16. 🚀 FUTURE EXTENSIONS

* Dynamic theme mutation (AI-driven palettes)
* Per-game theme overrides
* Shader-based rendering for WebGL games
* Audio-reactive themes

---

# 17. 🧨 FINAL PRINCIPLE

> A theme is not color.
> A theme is **behavior, feedback, and identity encoded into the UI layer**.

---
