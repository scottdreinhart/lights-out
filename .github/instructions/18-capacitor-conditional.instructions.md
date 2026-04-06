# Conditional Capacitor Integration Pattern

> **Status**: Active for nim, lights-out (platform apps with native support)
> **Authority**: Subordinate to `AGENTS.md` § 0 (Non-Negotiable Rules) and § 15 (Capacitor & Mobile Build Governance)
> **BASELINE**: Before conditional Capacitor usage, read `AGENTS.md` § 0. Preserve web-first architecture. No platform-specific branching. Quality gates mandatory.

## Overview

This document describes how to safely use Capacitor APIs while maintaining **web-first hybrid builds**. The platform uses Capacitor **conditionally** for Android and iOS native builds, but games run primarily on **web and mobile web**, with optional Electron and Capacitor support.

## Architecture

```
Web (Primary)
  ├─ Browser-based, works everywhere
  ├─ No Capacitor required
  └─ Best for max audience reach

Mobile Web (Primary)
  ├─ Responsive web on mobile browsers
  ├─ No Capacitor required
  └─ Works on iOS Safari, Android Chrome

Desktop (Secondary)
  ├─ Electron wrapper
  ├─ Can access some Capacitor features
  └─ Windows, Mac, Linux

Native Mobile (Secondary)
  ├─ iOS Safari WebView via Capacitor
  ├─ Android Chrome WebView via Capacitor
  └─ Full Capacitor API access
```

## The Problem

Direct Capacitor imports break web builds:

```typescript
// ❌ BAD: Blocks web builds
import { Capacitor } from '@capacitor/core'
import { SplashScreen } from '@capacitor/splash-screen'

if (Capacitor.isNativePlatform()) { ... }
```

Web builds fail because `@capacitor` packages aren't bundled into Vite output.

## The Solution: Capacitor Adapter

Use the conditional Capacitor adapter from `@games/common`:

```typescript
import { capacitor } from '@games/common'

// ✅ GOOD: Safe on web, native, and Electron
if (capacitor.isNativePlatform()) {
  await capacitor.hideSplashScreen()
}
```

## How It Works

The adapter (`capacitorAdapter.ts`) provides:

1. **Runtime detection** of platform (web vs native)
2. **Lazy loading** of Capacitor modules (only if available)
3. **Graceful fallbacks** (no crashes on web)
4. **Safe API wrappers** for common operations

### Key Methods

```typescript
capacitor.isNativePlatform() // true on Android/iOS via Capacitor
capacitor.isAvailable() // true if Capacitor packages loaded
await capacitor.initialize() // Init on native platforms
await capacitor.hideSplashScreen() // Safe: no-op on web
await capacitor.getDeviceInfo() // Lazy-load Device module
await capacitor.setPreference(k, v) // Lazy-load Preferences
await capacitor.triggerHaptic() // Lazy-load Haptics
```

All methods are **safe to call everywhere** (web, Electron, native).

## Usage Examples

### Initialize App with Capacitor Support

**apps/nim/src/index.tsx**:

```typescript
import React from 'react'
import ReactDOM from 'react-dom/client'
import { capacitor } from '@games/common'
import { App } from './ui/organisms/App'
import './styles.css'

// Initialize Capacitor on native platforms (safe on web)
if (capacitor.isAvailable()) {
  capacitor.initialize().catch(err => console.warn('Capacitor init:', err))
}

// Hide splash screen on native platforms
if (capacitor.isNativePlatform()) {
  setTimeout(() => {
    capacitor.hideSplashScreen().catch(err => console.debug('No splash:', err))
  }, 500)
}

const root = ReactDOM.createRoot(document.getElementById('root')!)
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

### Conditional Features in Components

```typescript
import { capacitor } from '@games/common'
import { useEffect, useState } from 'react'

export function SettingsScreen() {
  const [deviceInfo, setDeviceInfo] = useState(null)

  useEffect(() => {
    // Safely load device info on native platforms
    ;(async () => {
      const info = await capacitor.getDeviceInfo()
      if (info) setDeviceInfo(info)
    })()
  }, [])

  // Haptic feedback only on native
  const handlePress = async () => {
    await capacitor.triggerHaptic() // No-op on web
    play Sound()
  }

  return (
    <div>
      {deviceInfo && <p>Platform: {deviceInfo.platform}</p>}
      <button onClick={handlePress}>Press Me</button>
    </div>
  )
}
```

### Custom Hooks with Capacitor Support

```typescript
import { capacitor } from '@games/common'
import { useEffect } from 'react'

export function useNativeDeviceSettings() {
  // Store game settings in Capacitor Preferences on native
  // Fall back to localStorage on web

  const setSetting = async (key: string, value: string) => {
    if (capacitor.isNativePlatform()) {
      await capacitor.setPreference(key, value)
    } else {
      localStorage.setItem(key, value)
    }
  }

  const getSetting = async (key: string) => {
    if (capacitor.isNativePlatform()) {
      return await capacitor.getPreference(key)
    }
    return localStorage.getItem(key)
  }

  return { setSetting, getSetting }
}
```

## Build Configuration

### Vite Config (Always Works)

No special Vite config needed. The adapter uses lazy imports so Capacitor is **tree-shaken** on web builds.

```typescript
// vite.config.js
export default {
  build: {
    // Standard web build
    // Capacitor imports are lazy and removed if unused
  },
}
```

### Package Dependencies

Capacitor packages are in **devDependencies** (not runtime dependencies):

```json
{
  "devDependencies": {
    "@capacitor/app": "8.1.0",
    "@capacitor/core": "8.2.0",
    "@capacitor/device": "8.1.0",
    "@capacitor/haptics": "8.1.0",
    "@capacitor/keyboard": "8.0.2",
    "@capacitor/preferences": "8.1.1",
    "@capacitor/splash-screen": "8.1.0"
  }
}
```

This allows optional Capacitor use while keeping web builds small.

## When to Use

**✅ Use Capacitor Adapter:**

- Splash screen handling on native
- Device info display
- Native preferences/storage
- Haptic feedback
- Keyboard visibility (iOS)
- App lifecycle events

**❌ Don't Use Capacitor Adapter:**

- Web-only games (just use localStorage, localStorage events)
- Features not needed for your game
- Complex Capacitor integrations (use custom platform modules)

## Testing

### Web Build (Primary)

```bash
cd apps/nim
pnpm build          # Should succeed without Capacitor
pnpm preview        # Should work in browser
```

### Native Build (Capacitor)

```bash
pnpm cap:sync       # Syncs web assets to native
pnpm cap:open:android  # Opens Android Studio
```

### Desktop Build (Electron)

```bash
pnpm electron:dev   # Works with Capacitor adapter
pnpm electron:build:linux
```

## Migration Guide

If you have Capacitor imports scattered in your app:

### Before (Scattered Imports)

```typescript
// Multiple files importing directly
import { Capacitor } from '@capacitor/core'
import { SplashScreen } from '@capacitor/splash-screen'
import { Device } from '@capacitor/device'

if (Capacitor.isNativePlatform()) { ... }
```

### After (Centralized Adapter)

```typescript
// One import everywhere
import { capacitor } from '@games/common'

if (capacitor.isNativePlatform()) { ... }
```

## Adding New Capacitor Features

To add a new Capacitor module to the adapter:

1. **Add to package.json devDependencies** (root):

   ```json
   "@capacitor/new-feature": "8.x.x"
   ```

2. **Add lazy-load method** in `capacitorAdapter.ts`:

   ```typescript
   async loadNewFeatureModule() {
     if (!this.isAvailable()) return null
     try {
       return await import('@capacitor/new-feature')
     } catch {
       return null
     }
   }
   ```

3. **Add safe wrapper** if commonly used:

   ```typescript
   async doNewFeature() {
     const module = await this.loadNewFeatureModule()
     if (module?.NewFeature) {
       return await module.NewFeature.doSomething()
     }
   }
   ```

4. **Use in your app**:
   ```typescript
   const result = await capacitor.doNewFeature()
   ```

## Troubleshooting

### "Error: Could not resolve '@capacitor/...'"

**Cause**: Web build trying to import Capacitor directly  
**Fix**: Use capacitor adapter instead:

```typescript
// ❌ Wrong
import { SplashScreen } from '@capacitor/splash-screen'

// ✅ Right
import { capacitor } from '@games/common'
await capacitor.hideSplashScreen()
```

### "Capacitor methods not working on iOS/Android"

**Cause**: Capacitor not initialized  
**Fix**: Call initialize early in index.tsx:

```typescript
import { capacitor } from '@games/common'

if (capacitor.isAvailable()) {
  capacitor.initialize().catch(console.warn)
}
```

### "Splash screen stays visible"

**Cause**: Not hiding splash screen  
**Fix**: Call hideSplashScreen in your app:

```typescript
if (capacitor.isNativePlatform()) {
  setTimeout(() => {
    capacitor.hideSplashScreen()
  }, 1000)
}
```

## Related Governance

- **AGENTS.md § 5** — Shell Routing (Bash vs PowerShell)
- **AGENTS.md § 15** — Capacitor & Mobile Build Governance
- **AGENTS.md § 20** — Build & Deployment Governance

## Reference

- Capacitor Docs: https://capacitorjs.com/docs
- Capacitor API: https://capacitorjs.com/docs/apis
- Common Package: `packages/common/src/platform/capacitorAdapter.ts`
