# Electron-Vite App Template

**File Path**:  
- Windows: `D:\src\game-platform\_templates\electron-vite-app\README.md`  
- Linux/WSL: `/mnt/d/src/game-platform/_templates/electron-vite-app/README.md`

---

Minimal Electron-Vite application template for game platform.

## Features

- ✅ Unified Electron-Vite configuration (main + preload + renderer)
- ✅ React + TypeScript
- ✅ Instant HMR for all processes
- ✅ Sourcemaps support
- ✅ Context isolation + preload patterns

## Usage

### Copy template

```bash
plop electron-vite-app
# or manual copy:
cp -r _templates/electron-vite-app apps/my-game/electron
```

### Install

```bash
cd apps/my-game
pnpm install
```

### Development

```bash
pnpm electron:dev
```

HMR will apply changes instantly to both main and renderer processes.

### Build

```bash
pnpm electron:build
```

## File Structure

```
src/
├── main/          # Electron main process (Node.js)
├── preload/       # IPC bridge (sandboxed context)
└── renderer/      # React app (browser context)

electron-vite.config.ts  # Unified build config
```

## Key Improvements Over Manual Vite

| Aspect | Manual | Electron-Vite |
|--------|--------|---------------|
| Config Complexity | 3+ files | 1 file |
| HMR | Manual setup | Built-in ✅ |
| Main Process HMR | Not available | Available ✅ |
| Preload Support | Manual | Built-in ✅ |
| Sourcemaps | Manual | Built-in ✅ |
| Dev Experience | Lower | Excellent ✅ |

## References

- [electron-vite docs](https://electron-vite.org/)
- [Platform Migration Guide](../../../docs/ELECTRON-VITE-MIGRATION.md)
