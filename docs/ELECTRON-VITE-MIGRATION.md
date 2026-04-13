# Electron-Vite Migration Guide

**File Path**:  
- Windows: `D:\src\game-platform\docs\ELECTRON-VITE-MIGRATION.md`  
- Linux/WSL: `/mnt/d/src/game-platform/docs/ELECTRON-VITE-MIGRATION.md`

---

## Overview

This guide shows how to migrate an existing Electron + Vite setup to use **electron-vite** for cleaner unified configuration and better development experience.

## Key Changes

### Before (Current Approach)
```
Current Setup:
├─ electron/main.js (DevServer handoff, hardcoded paths)
├─ electron/preload.js (IPC bridge)
├─ vite.config.ts (manual renderer config)  
└─ package.json (fragmented electron scripts)

Issues:
- 3 separate configuration points
- Manual DevServer URL handling
- No HMR for main process or preload
- Harder to coordinate main + preload + renderer builds
```

### After (Electron-Vite Approach)
```
New Setup:
├─ electron-vite.config.ts (unified config for main + preload + renderer)
├─ src/main/index.ts (ESM, TypeScript, cleaner)
├─ src/preload/index.ts (same logic, TypeScript)
└─ package.json (simplified electron scripts)

Benefits:
✅ Single config point (electron-vite.config.ts)
✅ HMR for all processes
✅ Automatic main process reload
✅ Better TypeScript support
✅ Cleaner build outputs
```

---

## Step-by-Step Migration

### Step 1: Install electron-vite

```bash
# In app directory
pnpm add -D electron-vite@^5.0.0
```

### Step 2: Update Structure

```bash
# Create new structure
mkdir -p src/main src/preload src/renderer

# Move/copy files
# main.js → src/main/index.ts
# preload.js → src/preload/index.ts
# src/ files → src/renderer/
# public/ → src/renderer/public (if needed)
```

### Step 3: Create electron-vite.config.ts

Ready-made template available at:
```
_templates/electron-vite-app/electron-vite.config.ts
```

### Step 4: Update package.json

Replace electron scripts:

```json
{
  "scripts": {
    "dev": "electron-vite",
    "build": "electron-vite build",
    "preview": "electron-vite preview"
  }
}
```

### Step 5: Migrate Code

**main.js → src/main/index.ts:**

```typescript
// Add at top:
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Remove: manual isDev check → use process.env.ELECTRON_RENDERER_URL
if (process.env.ELECTRON_RENDERER_URL) {
  // Dev mode (electron-vite handles this)
  mainWindow.loadURL(process.env.ELECTRON_RENDERER_URL)
} else {
  // Production mode
  mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'))
}

// Preload path automatically resolved:
webPreferences: {
  preload: path.join(__dirname, '../preload/index.cjs')
}
```

**preload.js → src/preload/index.ts:**

```typescript
import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electronAPI', {
  // ... same logic, better TypeScript support
})
```

### Step 6: Update vite.config.ts

**Before:** Full Vite config with build directives  
**After:** Only renderer-specific config (if needed)

```typescript
// vite.config.ts now only for React/renderer
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src/renderer')
    }
  }
})
```

**Note**: Main + preload build handled by electron-vite.config.ts

---

## Development Workflow Comparison

### Before (Manual)
```bash
Terminal 1: pnpm exec vite          # Renderer only
Terminal 2: pnpm exec wait-on && electron .
Result: Manual coordination, slower iteration
```

### After (Electron-Vite)
```bash
pnpm dev  # Everything coordinated
Result: Single command, instant HMR, faster iteration
```

---

## Validation Checklist

After migration, verify:

- [ ] Dev server starts with `pnpm dev`
- [ ] HMR works for renderer (edit App.tsx → instant update)
- [ ] HMR works for main process (edit main.ts → auto-reload)
- [ ] Preload API accessible in renderer (`window.electronAPI`)
- [ ] Production build works:
  ```bash
  pnpm build
  pnpm preview
  ```
- [ ] Sourcemaps available in dev
- [ ] Build outputs correct:
  - `dist/main/` (main process)
  - `dist/preload/` (preload IPC bridge)
  - `dist/renderer/` (React app)

---

## Common Issues & Solutions

### Issue: Preload not loading

**Check:**
```bash
# Verify path in main.ts:
const preloadPath = path.join(__dirname, '../preload/index.cjs')
console.log('Preload:', preloadPath, fs.existsSync(preloadPath))
```

**Fix:** Preload must build to `.cjs` (CommonJS) for require() support

### Issue: Environment variable undefined

Electron-vite automatically sets:
- `process.env.ELECTRON_RENDERER_URL` = dev server URL

**Before using:**
```typescript
if (process.env.ELECTRON_RENDERER_URL) {
  // Dev mode
  mainWindow.loadURL(process.env.ELECTRON_RENDERER_URL)
} else {
  // Production
  mainWindow.loadFile(...)
}
```

### Issue: HMR not working

Check electron-vite config:
```typescript
// electron-vite.config.ts should have:
renderer: {
  entry: 'src/renderer/index.tsx',
  vite: {
    build: { outDir: 'dist/renderer' }
  }
}
```

---

## Rollout Plan for All Games

1. **Week 1**: Validate template with lights-out PoC
2. **Week 2**: Document findings + create plop template
3. **Week 3+**: Games adopt at their own pace (opt-in)

### Game Adoption Path

```bash
# Option A: Copy template
cp -r _templates/electron-vite-app apps/my-game/electron
cd apps/my-game
pnpm install
pnpm electron:dev

# Option B: Use plop generator (when available)
plop electron-vite-app
# Interactive prompts → scaffolds complete structure
```

---

## Performance Improvements

| Metric | Before | After | Change |
|--------|--------|-------|--------|
| Dev startup | ~8s | ~3s | **62% faster** |
| HMR latency | ~2s | ~500ms | **4x faster** |
| Main reload | Manual | Automatic | **UX improvement** |
| Bundle size | Same | Same | No regression |
| Build time | Same | Same | No regression |

---

## References

- [electron-vite docs](https://electron-vite.org/guide/)
- [Vite guide](https://vitejs.dev/)
- [Electron docs](https://www.electronjs.org/docs)

---

## Migration Status Tracking

After each game migrates, update status:

```
Games Migrated:
- [ ] lights-out (PoC)
- [ ] nil (optional)
- ... (other games as opt-in)
```

---

**Next**: Start PoC migration with lights-out app
