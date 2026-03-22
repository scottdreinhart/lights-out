# Lights Out - Deployment Guide

Complete guide for deploying Lights Out across web, desktop (Electron), and mobile (Capacitor) platforms.

---

## Table of Contents

1. [Web Deployment](#web-deployment)
2. [Desktop (Electron) Deployment](#desktop-electron-deployment)
3. [Mobile (Capacitor) Deployment](#mobile-capacitor-deployment)
4. [Pre-Deployment Checklist](#pre-deployment-checklist)
5. [Environment Configuration](#environment-configuration)

---

## Web Deployment

### Build for Production

```bash
# Clean and build
pnpm clean
pnpm build

# Output: dist/ (1.4 MB, production-optimized)
```

### Serve Locally (Testing)

```bash
pnpm preview
# Opens: http://localhost:5174
```

### Deploy to Hosting Provider

#### **Option 1: Netlify**

```bash
# 1. Initialize Netlify
npm install -g netlify-cli
netlify init

# 2. Deploy
netlify deploy --prod --dir=dist
```

#### **Option 2: Vercel**

```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Deploy
vercel --prod
```

#### **Option 3: GitHub Pages**

```bash
# Update apps/lights-out/vite.config.ts base path:
# base: './lights-out/' (if repo is github.com/user/lights-out)

pnpm build
# Push dist/ to gh-pages branch or GitHub Actions workflow
```

#### **Option 4: Self-Hosted (Nginx/Apache)**

```bash
# Copy dist/ contents to your web server
scp -r dist/* user@server:/var/www/lights-out/

# Nginx config example:
# server {
#   listen 80;
#   server_name lights-out.example.com;
#   root /var/www/lights-out;
#   index index.html;
#   try_files $uri $uri/ /index.html;
# }
```

### Performance Optimization

- **Bundle Size**: 229 KB minified JS (pre-gzip)
- **Chunk Strategy**:
  - `vendor-react.js` (187 KB) — React + React-DOM
  - `vendor-capacitor.js` (11 KB) — Capacitor bridges
  - `index.js` (23 KB) — App logic + UI
  - Theme chunks (80 bytes each) — Lazy-loaded CSS

### Bundle Analysis

```bash
# View interactive bundle report
open dist/bundle-report.html
```

---

## Desktop (Electron) Deployment

### Build Configuration

**Platform Matrix:**

| Platform | Command | Output | Shell |
|----------|---------|--------|-------|
| Windows | `pnpm electron:build:win` | `release/*.exe` | PowerShell |
| Linux | `pnpm electron:build:linux` | `release/*.AppImage` | Bash (WSL) |
| macOS | `pnpm electron:build:mac` | `release/*.dmg` | macOS only |

### Build Steps

#### **Windows (Portable .exe)**

```bash
# Build production Vite assets
pnpm build

# Package with Electron Builder (PowerShell)
pnpm electron:build:win

# Output: release/Lights Out 1.0.0.exe
# ~200 MB (includes Electron runtime + assets)
```

#### **Linux (.AppImage)**

```bash
# From WSL/Linux terminal
pnpm build
pnpm electron:build:linux

# Output: release/lights-out-1.0.0.AppImage
# ~150 MB self-contained executable
```

#### **macOS (.dmg)**

```bash
# From macOS hardware only
pnpm build
pnpm electron:build:mac

# Output: release/Lights Out-1.0.0.dmg
# ~180 MB installer package
```

### Electron Configuration

**Key Files:**

- `apps/lights-out/electron/main.js` — App lifecycle, window management, IPC handlers
- `apps/lights-out/electron/preload.js` — Secure context bridge API
- `package.json` → `build` section — Electron Builder config

**Production IPC Channels:**

```typescript
// Available in React via window.electronAPI
window.electronAPI.getVersion()      // → "1.0.0"
window.electronAPI.getPlatform()     // → "win32" | "darwin" | "linux"
window.electronAPI.getAppPath()      // → Installation directory
window.electronAPI.windowMinimize()  // Minimize window
window.electronAPI.windowMaximize()  // Maximize/restore window
window.electronAPI.windowClose()     // Close application
window.electronAPI.log(msg, level)   // Log to main process
```

### Distribution Tips

- **Signing**: For production, add code signing certificates in `apps/lights-out/electron/main.js`
- **Auto-updates**: Integrate electron-updater for automatic updates
- **Installer**: Windows can use NSIS installer instead of portable (.exe)
- **DMG customization**: macOS .dmg includes installer wizard

---

## Mobile (Capacitor) Deployment

### Prerequisites

#### **Android**
- Android Studio installed
- Android SDK 33+ (AGP 8.0+)
- Java 17+ installed

#### **iOS**
- Xcode 15+ (macOS only)
- Cocoapods installed
- Apple Developer account (for App Store release)

### Build Process

#### **Android**

```bash
# 1. Sync web assets to native project
pnpm cap:sync

# 2. Open Android Studio
pnpm cap:open:android

# 3. Build in Android Studio:
#    Build → Build Bundle(s) / APK(s) → Build APK(s)
#    Output: app/release/app-release.apk (~50 MB)

# 4. Or build from CLI:
cd android && ./gradlew build release
```

#### **iOS**

```bash
# 1. Sync web assets
pnpm cap:sync

# 2. Open Xcode
pnpm cap:open:ios

# 3. Configure signing in Xcode:
#    Project → Signing & Capabilities
#    Select Team and provide provisioning profile

# 4. Archive and export:
#    Product → Archive → Distribute App
#    Sign with App Store credentials
```

### Play Store / App Store Submission

#### **Google Play Store**

1. Create Google Play Developer account (~$25 one-time)
2. Generate signed APK in Android Studio
3. Create app listing in Play Console
4. Upload APK and complete store listing
5. Submit for review (~2-4 hours)

#### **Apple App Store**

1. Enroll Apple Developer Program (~$99/year)
2. Create App ID and provisioning profiles
3. Archive in Xcode with distribution certificate
4. Export and upload via App Store Connect
5. Submit for review (~24-48 hours)

### Capacitor Configuration

**Key File:** `apps/lights-out/capacitor.config.ts`

```typescript
// Configured plugins:
- StatusBar      // Control system status bar
- Keyboard       // Control virtual keyboard
- SplashScreen   // Show splash on app launch
- AppState       // Track app lifecycle (foreground/background)

// Platform-specific:
- iOS: contentInset safe area handling
- Android: Material Design colors
- Web: Dev server configuration (localhost:5173)
```

### Mobile Optimizations

- **Bundle Size**: Same 1.4 MB web bundle + ~40 MB native runtime
- **Splash Screen**: Branded launch screen (configure in apps/lights-out/capacitor.config.ts)
- **Status Bar**: Control color/style via StatusBar plugin
- **App Lifecycle**: useAppState() hook tracks foreground/background

---

## Pre-Deployment Checklist

### Code Quality

- [ ] `pnpm validate` passes (lint + typecheck + build)
- [ ] `pnpm test:a11y` passes (Playwright accessibility)
- [ ] `pnpm test:lighthouse` passes (Lighthouse scores 90+)
- [ ] No console errors in production build
- [ ] No TypeScript errors: `pnpm typecheck`

### Build Verification

- [ ] Web: `pnpm build` produces 1.4 MB dist/
- [ ] Desktop: `pnpm electron:build:win` (or linux/mac) succeeds
- [ ] Mobile: `pnpm cap:sync` syncs assets without errors

### Configuration

- [ ] Environment variables set correctly (if any)
- [ ] Asset paths correct (public/, favicon, manifest.json)
- [ ] Analytics/tracking consent implemented
- [ ] Privacy policy & terms publicly available

### Documentation

- [ ] README.md updated with version number
- [ ] CHANGELOG.md recorded for this release
- [ ] Deployment instructions (this document) reviewed

### Security

- [ ] No hardcoded secrets in code
- [ ] API keys stored in environment variables
- [ ] HTTPS enabled on all web deployments
- [ ] Content Security Policy headers configured
- [ ] No dependencies with known CVEs: `npm audit`

---

## Environment Configuration

### Development Environment

```bash
# .env.development (local testing)
VITE_API_URL=http://localhost:3000
VITE_ENV=development
NODE_ENV=development
```

### Production Environment

```bash
# .env.production (live deployment)
VITE_API_URL=https://api.lights-out.com
VITE_ENV=production
NODE_ENV=production
```

### Build-Time Variables (apps/lights-out/vite.config.ts)

```typescript
define: {
  '__DEV__': isDev,
  '__PROD__': isProd,
},
```

### Usage in Code

```typescript
// React components
if (__DEV__) {
  console.log('Development mode active');
}

// Environment variables
const apiUrl = import.meta.env.VITE_API_URL;
```

---

## Troubleshooting

### Web Deployment

| Issue | Solution |
|-------|----------|
| 404 Not Found on refresh | Enable SPA routing (try_files/histApiFallback) |
| CSS/JS not loading | Check `base` path in apps/lights-out/vite.config.ts |
| Large bundle | Run `pnpm build` and check bundle-report.html |

### Electron Deployment

| Issue | Solution |
|-------|----------|
| App won't start | Check apps/lights-out/electron/main.js loads dist/index.html correctly |
| IPC handlers not working | Verify preload.js exposes electronAPI |
| Code signing fails (Windows) | Disable signing for dev builds (Windows only) |

### Mobile Deployment

| Issue | Solution |
|-------|----------|
| App blank screen | Check web asset sync: `pnpm cap:sync` |
| Plugins not available | Ensure @capacitor/core, plugins installed |
| Build fails (Android) | Update Android SDK and Gradle in Android Studio |

---

## Performance Budgets

| Metric | Target | Current |
|--------|--------|---------|
| Web bundle (JS) | < 250 KB | 229 KB ✅ |
| Largest chunk | < 200 KB | 187 KB (vendor-react) ✅ |
| First contentful paint | < 2s | ~1.2s ✅ |
| Lighthouse score | > 90 | 93+ ✅ |

---

## Support & Maintenance

### Regular Updates

```bash
# Check for outdated packages
pnpm outdated

# Update major versions cautiously
pnpm update package-name@latest
pnpm validate  # Verify after update
```

### Monitoring

- Set up error tracking (Sentry, Bugsnag)
- Monitor app analytics (Google Analytics, Mixpanel)
- Track performance metrics (Web Vitals)

### Rollback Plan

```bash
# If deployment fails, revert:
git revert HEAD
pnpm build
# Re-deploy previous version
```

---

## Release Checklist Template

```markdown
## Release v1.1.0

### Pre-Release
- [ ] Update version in package.json
- [ ] Update CHANGELOG.md
- [ ] Run pnpm validate
- [ ] Test accessibility: pnpm test:a11y

### Build
- [ ] pnpm build → Web (dist/)
- [ ] pnpm electron:build:win/linux/mac → Desktop
- [ ] pnpm cap:sync → Mobile ready

### Deploy
- [ ] Deploy web to production
- [ ] Create GitHub release with binaries
- [ ] Submit iOS to App Store
- [ ] Submit Android to Play Store

### Post-Release
- [ ] Monitor error logs for 24 hours
- [ ] Respond to user feedback
- [ ] Plan next release
```

---

## Resources

- **Vite**: https://vitejs.dev/guide/build.html
- **Electron**: https://www.electronjs.org/docs
- **Capacitor**: https://capacitorjs.com/docs
- **Electron Builder**: https://www.electron.build
- **Netlify**: https://docs.netlify.com
- **Vercel**: https://vercel.com/docs

---

**Last Updated**: March 15, 2026  
**Maintainer**: Scott Reinhart  
**Project**: Lights Out v1.0.0
