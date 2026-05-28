# @games/ui-hooks

Consolidated UI/presentation hooks for game apps. This package standardizes and consolidates common UI hook patterns across 60+ game applications.

## Overview

### What's Included

- **useTheme**: Theme/mode/colorblind mode management with persistence
- **useSoundEffects**: Sound effect integration with audio context support
- **useStats**: Game statistics tracking and storage
- **useResponsiveState**: Responsive breakpoint detection (width-based)

### Why This Package?

These four hooks are used in 54+ apps with nearly identical implementation patterns. This package:
- ✅ Provides factory functions for creating standardized instances
- ✅ Reduces per-app boilerplate by 40-50 lines
- ✅ Ensures consistent behavior and API across all games
- ✅ Maintains type safety while supporting app-specific configuration

## Usage

### useTheme

Create a theme hook for your app with customized colors, storage key, and DOM sync:

```tsx
import { createUseThemeHook } from '@games/ui-hooks'

export const useTheme = createUseThemeHook({
  storageKey: 'my-app-theme-settings',
  defaultSettings: DEFAULT_SETTINGS,
  colorThemes: COLOR_THEMES,
  themeColors: SHARED_THEME_COLORS,
  createThemeLoaders: createSharedThemeLoaders,
  load,
  save,
  getLayerStack,
  layerStackToCssVars,
  getBackgroundCssValue,
  preloadAllSprites,
  gameboardCssVars: getGameboardCssVars(),
})

// In your component:
function MyComponent() {
  const { theme, setTheme } = useTheme()
  return <div>{theme.mode}</div>
}
```

### useSoundEffects

Create a sound effects hook with app-specific sound functions:

```tsx
import { createUseSoundEffectsHook } from '@games/ui-hooks'
import { useSoundContext } from '@games/sound-context'
import { playSelect, playConfirm, playWin } from './sounds'

export const useSoundEffects = createUseSoundEffectsHook({
  useSoundContext,
  sounds: {
    playSelect,
    playConfirm,
    playWin,
    // ... other sound functions
  },
})

// In your component:
function MyComponent() {
  const { playSelect } = useSoundEffects()
  return <button onClick={() => playSelect()}>Click</button>
}
```

### useStats

Create a stats hook for your game with typed stats and persistence:

```tsx
import { createUseStatsHook } from '@games/ui-hooks'
import type { GameStats } from '@/domain'

export const useStats = createUseStatsHook<GameStats>({
  // Implementation provided by @games/app-hook-utils factory
})

// In your component:
function StatsDisplay() {
  const { stats, recordWin, recordLoss, resetStats } = useStats()
  return <div>Wins: {stats.wins}, Losses: {stats.losses}</div>
}
```

### useResponsiveState

Built-in hook from `@games/app-hook-utils`, exported for consistency:

```tsx
import { useResponsiveState } from '@games/ui-hooks'

function MyComponent() {
  const state = useResponsiveState()
  return <div className={state.breakpoint}>{/* ... */}</div>
}
```

## Migration Guide

If your app currently imports these directly from `@games/app-hook-utils`:

### Before
```tsx
import { createUseThemeHook, createUseSoundEffectsHook } from '@games/app-hook-utils'
```

### After
```tsx
import { createUseThemeHook, createUseSoundEffectsHook } from '@games/ui-hooks'
```

Both imports work — `@games/app-hook-utils` maintains backward compatibility. However, new apps should use `@games/ui-hooks` for better semantic clarity.

## API Reference

### Factories

All factories return hooks with type-safe configurations:

- **`createUseThemeHook<T>`** → `(config: ThemeConfig) => UseThemeHook`
- **`createUseSoundEffectsHook`** → `(config: SoundConfig) => UseSoundEffectsHook`
- **`createUseStatsHook<T>`** → `(config: StatsConfig) => UseStatsHook`
- **`useResponsiveState`** → `() => ResponsiveState`

See source code and `@games/app-hook-utils` for detailed type definitions.

## Best Practices

1. **Create hooks in `src/app/hooks/`** — Keep UI hooks co-located with components
2. **Export from a single file** — Define `useTheme`, `useSoundEffects`, `useStats` in dedicated files
3. **Pass app-specific config** — Keep sounds, themes, and stats types app-specific
4. **Use at app shell level** — Wrap your app with context providers, use hooks in root/shell components
5. **Respect `prefers-reduced-motion`** — Sound effects and theme loaders should respect user preferences

## Architecture

```
@games/ui-hooks/
├── src/
│   ├── index.ts              # Main exports + re-exports from app-hook-utils
│   ├── factories.ts          # Factory re-exports with documentation
│   └── utilities.ts          # Setup helpers and configuration types
├── tsconfig.json
├── package.json
└── README.md (this file)
```

## Contributing

When adding new UI hooks to this package:
1. Implement in `@games/app-hook-utils` first
2. Export from `factories.ts` or `index.ts` in this package
3. Update this README with usage examples
4. Ensure backward compatibility with `@games/app-hook-utils`

## See Also

- [app-hook-utils](../app-hook-utils) — Hook factories and implementations
- [sound-context](../sound-context) — Sound context provider
- [ui-board-core](../ui-board-core) — Board UI components
