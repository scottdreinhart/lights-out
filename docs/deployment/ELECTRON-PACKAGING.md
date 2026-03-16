# Electron Packaging & Distribution Guide

Comprehensive guide for packaging and distributing Lights Out as a desktop application across Windows, Linux, and macOS.

---

## Quick Start

```bash
# Build web assets first
pnpm build

# Package for current platform
pnpm electron:build

# Or specific platform:
pnpm electron:build:win     # Windows (PowerShell)
pnpm electron:build:linux   # Linux (Bash/WSL)
pnpm electron:build:mac     # macOS (Apple hardware only)
```

---

## Architecture Overview

### File Structure

```
electron/
├── main.js          # Main process (app lifecycle, windows, IPC)
├── preload.js       # Preload script (secure API bridge)
└── types.ts         # TypeScript definitions (optional)

src/
├── app/
│   ├── useElectron.ts      # React hooks for Electron API
│   └── useCapacitor.ts     # Mobile API (cross-platform)
└── index.tsx        # Entry point (detects Electron vs web)

vite.config.js       # Build config (with Electron plugin support)
package.json         # Scripts, version, electron-builder config
```

### Process Architecture

```
┌─────────────────────────────────────────┐
│         Electron Main Process            │
│  • App lifecycle                         │
│  • Window management                     │
│  • IPC handlers (secure)                 │
│  • Menu, native dialogs                  │
└─────────────────┬───────────────────────┘
                  │
        IPC Bridge (preload.js)
                  │
┌─────────────────▼───────────────────────┐
│       Renderer Process (React)            │
│  • UI components                         │
│  • useElectron() hooks                   │
│  • Call IPC methods safely               │
└─────────────────────────────────────────┘
```

---

## Main Process (electron/main.js)

### Core Responsibilities

1. **App Lifecycle** — Handle app ready, window-all-closed, before-quit
2. **Window Management** — Create, minimize, maximize, close windows
3. **IPC Handlers** — Respond to renderer process requests
4. **Menu System** — File, Edit, View menus (native platform integration)
5. **Security** — Context isolation, preload script, nodeIntegration: false

### IPC Channels

**Implemented Handlers:**

```javascript
// Version info
ipcMain.handle('app:getVersion', () => app.getVersion())

// Platform detection
ipcMain.handle('app:getPlatform', () => process.platform)

// App path
ipcMain.handle('app:getAppPath', () => app.getAppPath())

// Window controls
ipcMain.handle('window:minimize', () => {
  if (mainWindow) mainWindow.minimize()
})
ipcMain.handle('window:maximize', () => {
  if (mainWindow) {
    mainWindow.isMaximized() ? mainWindow.unmaximize() : mainWindow.maximize()
  }
})
ipcMain.handle('window:close', () => {
  if (mainWindow) mainWindow.close()
})

// Logging
ipcMain.handle('app:log', (event, message, level = 'info') => {
  console.log(`[${level.toUpperCase()}]`, message)
})
```

### Window Configuration

```javascript
const mainWindow = new BrowserWindow({
  webPreferences: {
    preload: path.join(__dirname, '../electron/preload.js'),
    contextIsolation: true,
    enableRemoteModule: false,
    nodeIntegration: false,
    sandbox: true,              // ⚠️ CRITICAL: Sandbox enabled
  },
  icon: path.join(__dirname, '../public/icon.png'),
  show: false,                  // Don't show until ready
})

mainWindow.webContents.on('did-finish-load', () => {
  mainWindow.show()             // Show when loaded
})
```

### Preload Script Best Practices

```javascript
// ✅ SAFE: Expose only necessary methods
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  getVersion: () => ipcRenderer.invoke('app:getVersion'),
  getPlatform: () => ipcRenderer.invoke('app:getPlatform'),
  getAppPath: () => ipcRenderer.invoke('app:getAppPath'),
  windowMinimize: () => ipcRenderer.invoke('window:minimize'),
  windowMaximize: () => ipcRenderer.invoke('window:maximize'),
  windowClose: () => ipcRenderer.invoke('window:close'),
  log: (msg, level) => ipcRenderer.invoke('app:log', msg, level),
})

// ❌ UNSAFE: Don't expose entire modules
// contextBridge.exposeInMainWorld('fs', require('fs'))
```

---

## Preload Script (electron/preload.js)

### Purpose

- **Sandbox Boundary**: Runs in renderer context but with main process access
- **Secure API Bridge**: Exposes only necessary functionality
- **Type Safety**: Enables TypeScript definitions in React

### Implementation

**electron/preload.js** (40 lines):

```javascript
const { contextBridge, ipcRenderer } = require('electron')

// Expose safe API to renderer process
contextBridge.exposeInMainWorld('electronAPI', {
  // Async IPC methods
  getVersion: () => ipcRenderer.invoke('app:getVersion'),
  getPlatform: () => ipcRenderer.invoke('app:getPlatform'),
  getAppPath: () => ipcRenderer.invoke('app:getAppPath'),
  windowMinimize: () => ipcRenderer.invoke('window:minimize'),
  windowMaximize: () => ipcRenderer.invoke('window:maximize'),
  windowClose: () => ipcRenderer.invoke('window:close'),
  log: (message, level = 'info') => 
    ipcRenderer.invoke('app:log', message, level),

  // Sync properties (rarely used)
  isElectron: true,
  isDev: process.env.NODE_ENV === 'development',
  platform: process.platform,
})
```

### React Integration

**src/app/useElectron.ts**:

```typescript
// Type-safe hook for Electron API
export const useElectron = () => {
  const api = (window as any).electronAPI
  if (!api) throw new Error('Electron API not available')
  return api
}

// In React component:
const MyComponent = () => {
  const { getVersion, windowClose } = useElectron()
  
  useEffect(() => {
    getVersion().then(version => console.log(version))
  }, [getVersion])
  
  return <button onClick={() => windowClose()}>Close</button>
}
```

---

## Electron Builder Configuration

### Configuration (package.json)

```json
{
  "build": {
    "appId": "com.scottreinhart.lightsout",
    "productName": "Lights Out",
    "directories": {
      "buildResources": "public",
      "output": "release"
    },
    "files": [
      "dist/**/*",
      "electron/**/*",
      "public/**/*"
    ],
    "win": {
      "target": ["portable"],
      "certificateFile": null,
      "signingHashAlgorithms": ["sha256"],
      "sign": null
    },
    "linux": {
      "target": ["AppImage"],
      "icon": "public/icon.png"
    },
    "mac": {
      "target": ["dmg"],
      "category": "public.app-category.games",
      "icon": "public/icon.icns"
    }
  }
}
```

---

## Platform-Specific Packaging

### Windows (.exe)

**Command:**
```bash
pnpm electron:build:win
```

**Output:** `release/Lights Out 1.0.0.exe` (~200 MB)

**Key Settings:**
```javascript
win: {
  target: ['portable'],        // Single .exe file (no installer)
  certificateFile: null,       // Skip code signing for dev
  signingHashAlgorithms: ['sha256']
}
```

**Production Signing:**
```javascript
// Add to package.json build.win for production:
"certificateFile": "path/to/certificate.pfx",
"certificatePassword": process.env.WIN_SIGNING_PASSWORD,
"signingHashAlgorithms": ["sha256"]
```

**Installation:**
- User downloads .exe and runs it
- App extracts to `%APPDATA%/Local/Programs/Lights Out`
- Creates Start Menu. shortcuts automatically

### Linux (.AppImage)

**Command:**
```bash
pnpm electron:build:linux
```

**Output:** `release/lights-out-1.0.0.AppImage` (~150 MB)

**Key Settings:**
```javascript
linux: {
  target: ['AppImage'],
  icon: 'public/icon.png',
  category: 'Game'
}
```

**Installation:**
```bash
# User downloads .AppImage and makes it executable
chmod +x lights-out-1.0.0.AppImage
./lights-out-1.0.0.AppImage

# Or: Install via package manager (deb, rpm, etc.)
```

**Alternative: Snap Package**

```javascript
// In electron-builder config:
snap: {
  summary: 'Lights Out Game',
  category: 'Games'
}
```

### macOS (.dmg)

**Command:**
```bash
pnpm electron:build:mac
```

**Output:** `release/Lights Out-1.0.0.dmg` (~180 MB)

**Requirements:**
- macOS hardware only
- Xcode Command Line Tools installed
- Apple Developer ID (for signed releases)

**Key Settings:**
```javascript
mac: {
  target: ['dmg'],
  icon: 'public/icon.icns',     // Must be .icns format
  category: 'public.app-category.games',
  entitlements: 'path/to/entitlements.plist'  // For notarization
}
```

**Signing & Notarization (Production):**

```json
"mac": {
  "certificateFile": "Developer ID Certificate.p12",
  "certificatePassword": process.env.MAC_SIGNING_PASSWORD,
  "provisioningProfile": "path/to/profile.mobileprovision",
  "notarize": {
    "teamId": "YOUR_TEAM_ID",
    "appleId": "your-id@apple.com",
    "appleIdPassword": process.env.APPLE_ID_PASSWORD
  }
}
```

**User Installation:**
1. User downloads .dmg file
2. Opens .dmg (mounts virtual drive)
3. Drags app to `/Applications`
4. First run: May prompt "Are you sure?" (unsigned apps)

---

## Development Workflow

### Dev Mode

```bash
# 1. Start Vite dev server (runs on localhost:5173)
pnpm dev

# 2. In another terminal, start Electron in dev mode
pnpm electron:dev

# Changes in src/ hot-reload in Electron window
# Changes in electron/ require restart
```

### Preview Before Build

```bash
# 1. Build web assets
pnpm build

# 2. Preview in Electron with dist/ (production-like)
pnpm electron:preview

# 3. Verify app works with production bundle before packaging
```

---

## Debugging

### React Developer Tools

```javascript
// In electron/main.js (dev mode):
if (process.env.NODE_ENV === 'development') {
  mainWindow.webContents.openDevTools()
}
```

### IPC Debugging

```typescript
// In React component, add logging:
const { log } = useElectron()

log(`Event triggered: ${eventName}`, 'debug')
```

### Main Process Logs

```bash
# View main process logs (stdout/stderr)
# Windows: Check terminal where electron:dev was running
# Linux/macOS: Check terminal where electron:dev was running
```

---

## Configuration Checklist

### Before Packaging

- [ ] Update version in `package.json`
- [ ] Update `appId` (unique per app)
- [ ] Update `productName` (displayed in installers/menus)
- [ ] Ensure `dist/` exists: `pnpm build`
- [ ] Test with `pnpm electron:preview`

### Before Distribution

- [ ] Web assets optimized (bundle < 250 KB JS)
- [ ] IPC handlers tested and secured
- [ ] No console errors in app
- [ ] Icons provided (png, icns for macOS)
- [ ] Signing certificates ready (if distributing publicly)

### Platform-Specific

**Windows:**
- [ ] Icon in `public/icon.png` (256×256 or larger)
- [ ] Code signing certificate (optional for internal distribution)

**Linux:**
- [ ] Icon in `public/icon.png`
- [ ] Category set to 'Game' in config

**macOS:**
- [ ] Icon in `public/icon.icns` (1024×1024 minimum)
- [ ] Apple Developer ID (for App Store or notarization)
- [ ] Signing certificate + provisioning profile

---

## Common Issues & Fixes

### Issue: "Cannot find module 'dist/index.html'"

**Cause:** `pnpm build` wasn't run before packaging.

**Fix:**
```bash
pnpm clean
pnpm build
pnpm electron:build:win
```

### Issue: IPC Handler Returns Undefined

**Cause:** Handler not registered or event name mismatch.

**Fix:**
```javascript
// Verify in electron/main.js:
ipcMain.handle('my-channel', () => { /* ... */ })

// Match exactly in preload.js:
ipcRenderer.invoke('my-channel')  // Must match
```

### Issue: "contextBridge is not defined"

**Cause:** contextBridge not imported in preload.js.

**Fix:**
```javascript
const { contextBridge, ipcRenderer } = require('electron')
contextBridge.exposeInMainWorld('electronAPI', { /* ... */ })
```

### Issue: Code Signing Failed (Windows)

**Cause:** Certificate file not found or password incorrect.

**Fix:**
```bash
# For development, skip signing:
pnpm electron:build:win

# Remove certificateFile from config if not signing
```

---

## Advanced Topics

### Auto-Updates

```javascript
import { autoUpdater } from 'electron-updater'

if (isDev === false) {
  autoUpdater.checkForUpdatesAndNotify()
}
```

### Native Menu Integration

```javascript
const { Menu } = require('electron')

Menu.setApplicationMenu(Menu.buildFromTemplate([
  {
    label: 'File',
    submenu: [{ label: 'Exit', click: () => app.quit() }]
  },
  {
    label: 'Edit',
    submenu: [
      { label: 'Undo', accelerator: 'CmdOrCtrl+Z' },
      { label: 'Redo', accelerator: 'CmdOrCtrl+Y' }
    ]
  }
]))
```

### File Dialog

```javascript
// Main process:
ipcMain.handle('file:open', async () => {
  const { filePath } = await dialog.showOpenDialog(mainWindow, {
    title: 'Open File',
    filters: [{ name: 'Text', extensions: ['txt'] }]
  })
  return filePath
})

// React:
const { openFile } = useElectron()
const filePath = await openFile()
```

---

## Distribution Best Practices

### Staged Rollout

1. **Alpha**: Internal testing only
2. **Beta**: Limited release to trusted users
3. **Stable**: Full public release

### Version Tagging

```bash
# Before each release:
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0
```

### Release Notes

```markdown
## v1.0.0 - Initial Release

### Features
- Settings modal with WCAG 2.1 AA compliance
- Hamburger menu for in-game quick settings
- Accessibility tests (45+ Playwright tests)

### Fixes
- Fixed Vite 8.0.0 build compatibility
- Fixed Capacitor plugin integration

### Downloads
- [Windows](https://github.com/user/lights-out/releases/download/v1.0.0/Lights Out 1.0.0.exe)
- [Linux](https://github.com/user/lights-out/releases/download/v1.0.0/lights-out-1.0.0.AppImage)
- [macOS](https://github.com/user/lights-out/releases/download/v1.0.0/Lights Out-1.0.0.dmg)
```

---

## Resources

- **Electron Docs**: https://www.electronjs.org/docs
- **Electron Builder**: https://www.electron.build/configuration/configuration
- **IPC Best Practices**: https://www.electronjs.org/docs/tutorial/ipc
- **Code Signing**: https://www.electronjs.org/docs/tutorial/code-signing
- **Notarization (macOS)**: https://www.electronjs.org/docs/tutorial/mac-app-store-submission-guide

---

**Last Updated**: March 15, 2026  
**Electron Version**: 41.0.2  
**Node**: 24.14.0  
**Tested Platforms**: Windows 10+, Ubuntu 22.04+, macOS 12.0+
