# ✅ App Store & Google Play Compliance Governance

**Authority**: Subordinate to `AGENTS.md` § 0 (Non-Negotiable Rules) and § 15 (Compliance). Defines all app store submission requirements and compliance verification steps.

**BASELINE**: Before submitting to app stores, read `AGENTS.md` § 0. No fake compliance. Preserve all required features. Quality gates mandatory.

**Scope**: iOS (App Store), Android (Google Play). Both require identical baseline compliance.

> **Platform Note**: Code examples use Nim as an illustrative reference. Replace all app-specific identifiers (bundle IDs, storage keys, archive names) with your app's own values.

---

## 1. UI/UX Compliance

### 1.1 Touch Target Sizing (Mandatory)

**Requirement**: All interactive elements must have **minimum 44× 44 px** touch target on mobile.

**Applies to**:
- Buttons (primary, secondary, icon)
- Input fields
- Toggles and switches
- Menu items
- Tabs
- Icon buttons
- Sliders and controls

**Implementation**:

```css
/* Enforce minimum touch target */
button, a[role="button"], input[type="checkbox"], input[type="radio"] {
  min-width: 44px;
  min-height: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

/* Icon-only buttons need padding to reach 44×44 */
.icon-button {
  width: 44px;
  height: 44px;
  border-radius: 8px;
}

/* Tap-friendly spacing between targets (recommend 8px min) */
button + button {
  margin-left: 8px;
}
```

**Verification**:
```bash
# Inspect DevTools (mobile viewport):
# 1. Open to iPhone 14 Pro (390px width)
# 2. Select any button/input
# 3. Check computed dimensions
# 4. Verify all interactive elements ≥ 44×44 px
```

**Checklist**:
- [ ] All buttons: 44×44 px minimum
- [ ] All icon buttons: 44×44 px minimum
- [ ] All form inputs: 44px minimum height
- [ ] Tab targets: 44px minimum height
- [ ] Spacing between targets: 8px minimum
- [ ] No elements <44×44 px that are interactive

---

### 1.2 Safe-Area Handling (Mandatory)

**Requirement**: Content must adapt to device safe areas (notches, home indicators, gesture nav bars).

**Applies to**:
- iOS 11+: Dynamic Island, notch, home indicator
- Android 9+: Gesture navigation bar, rounded corners
- Landscape orientations on all devices

**Implementation** (already applied):

```css
/* Root container safe-area padding */
.appContainer {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  
  /* Safe-area padding for iPhone notches + Android system UI */
  padding-top: max(8px, env(safe-area-inset-top));
  padding-left: max(8px, env(safe-area-inset-left));
  padding-right: max(8px, env(safe-area-inset-right));
  padding-bottom: max(8px, env(safe-area-inset-bottom));
}

/* Fixed headers/footers also need safe-area */
.appHeader {
  padding-left: max(8px, env(safe-area-inset-left));
  padding-right: max(8px, env(safe-area-inset-right));
  padding-top: max(8px, env(safe-area-inset-top));
}
```

**Verification Checklist**:
- [ ] **iOS notch device** (iPhone 14 Pro): Content not obscured by Dynamic Island
- [ ] **iOS home indicator** (iPhone SE 2023): Content not obscured by home bar
- [ ] **Android gesture nav** (Pixel 7): Content not obscured by system gesture area
- [ ] **Landscape orientation**: Safe areas adjust correctly
- [ ] **Rotation animation**: Layout reflows smoothly
- [ ] **Headers/footers**: Positioned inside safe areas
- [ ] **Portrait → Landscape**: No content repositioning needed

**Device Matrix** (minimum testing):
| Device | Form | Safe Areas | Notes |
|--------|------|-----------|-------|
| iPhone 14 Pro | 6.1" | Notch (44px top) | Dynamic Island |
| iPhone SE 2023 | 4.7" | Home bar (34px bottom) | Older form factor |
| Pixel 7 | 6.1" | Gesture bar (36px) | Android standard |
| Samsung Galaxy S23 | 6.1" | Gesture bar + rounded | Android variant |

---

## 2. Accessibility Compliance (WCAG 2.1 AA)

### 2.1 Color Contrast (Mandatory)

**Requirement**: All text and UI controls must meet WCAG AA minimum contrast ratios.

**Standards**:
- **Text**: 4.5:1 (normal), 3:1 (large, 18pt+)
- **UI Controls** (focus indicators, borders): 3:1 minimum

**Verification**:
```bash
# Use WebAIM contrast checker or Lighthouse
# Inspect any text element:
# 1. DevTools → Accessibility panel
# 2. Check computed contrast ratio
# 3. Verify ≥ 4.5:1 for body text, ≥ 3:1 for large text
```

**Checklist**:
- [ ] Body text: 4.5:1 contrast minimum
- [ ] Large text (18pt+): 3:1 contrast minimum
- [ ] UI borders/focus indicators: 3:1 contrast minimum
- [ ] Interactive controls (buttons): 3:1 minimum
- [ ] No color as sole indicator (pair with icon/text/pattern)

---

### 2.2 Keyboard Navigation (Mandatory)

**Requirement**: App must be fully navigable with keyboard/hardware buttons.

**Applies to**:
- Tab order (Tab key cycles through elements)
- Escape key (closes dialogs, menus)
- Enter key (activates buttons, submits forms)
- Arrow keys (navigate lists, options)
- Focus indicators (visible on all interactive elements)

**Implementation**:

```tsx
/* Ensure all interactive elements are tab-able */
button, input, select, textarea, a[href], [role="button"] {
  outline: 2px solid var(--focus-color);  /* Visible focus indicator */
  outline-offset: 2px;
}

/* Focus trap in modals */
export function useDropdownBehavior({
  open,
  onClose,
  triggerRef,
  panelRef,
}: DropdownConfig) {
  useEffect(() => {
    if (!open) return

    const focusableElements = panelRef.current?.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    if (!focusableElements?.length) return

    const firstElement = focusableElements[0] as HTMLElement
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

    // Focus trap: Tab at end → wraps to first
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return
      
      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault()
        lastElement.focus()
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault()
        firstElement.focus()
      }
    }

    panelRef.current?.addEventListener('keydown', handleKeyDown)
    firstElement.focus()

    return () => {
      panelRef.current?.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])
}
```

**Checklist**:
- [ ] Tab key navigates all interactive elements
- [ ] Tab order is logical (left→right, top→bottom)
- [ ] Focus indicator visible on all elements (≥ 3:1 contrast)
- [ ] Escape key closes dialogs/menus
- [ ] Enter key activates buttons
- [ ] Arrow keys navigate lists/tabs
- [ ] Focus trap in modals (tab doesn't escape)
- [ ] Initial focus set on modal open

---

### 2.3 Screen Reader Support (Mandatory)

**Requirement**: App must work with VoiceOver (iOS) and TalkBack (Android).

**Implementation**:

```tsx
/* Semantic HTML first */
<button aria-label="Back to menu">✕</button>
<button aria-label="Settings" aria-haspopup="true" aria-expanded={open}>
  ⋮
</button>

/* Form labels */
<label htmlFor="difficulty">CPU Difficulty</label>
<select id="difficulty">
  <option>Easy</option>
  <option>Medium</option>
  <option>Hard</option>
</select>

/* ARIA attrs for custom widgets */
<div role="menu" aria-label="Settings">
  <button role="menuitem">Theme</button>
  <button role="menuitem">Sound</button>
</div>

/* Live regions for dynamic content */
<div aria-live="polite" aria-atomic="true">
  Game Over: {winner} wins
</div>
```

**Checklist**:
- [ ] All buttons have descriptive labels (aria-label or text)
- [ ] Form fields have associated labels
- [ ] Interactive regions have proper roles (button, menuitem, etc.)
- [ ] Status messages use aria-live regions
- [ ] Headings properly nested (h1 → h2 → h3)
- [ ] Lists use semantic `<ul>` / `<ol>` / `<li>`
- [ ] Icons have aria-label if they convey meaning
- [ ] Divs/spans with click handlers have role=button

---

## 3. Performance Compliance

### 3.1 Launch Performance

**Requirement**: App must launch (to interactive) in **< 3 seconds** on mid-range devices.

**Baseline Device**: Pixel 6 (mid-range Android, ~2020 tier)

**Measurement**:
```bash
# Use Lighthouse CI or Chrome DevTools Performance tab
# Metric targets:
# - First Contentful Paint (FCP): < 1.5s
# - Largest Contentful Paint (LCP): < 2.5s
# - Time to Interactive (TTI): < 3.0s
```

**Optimization Checklist**:
- [ ] Bundle size < 150KB gzipped
- [ ] Lazy-load non-critical features
- [ ] Splash screen shown ≤ 1.2s
- [ ] Game board interactive by 2.5s
- [ ] No blocking network requests on startup

---

### 3.2 Interaction Responsiveness

**Requirement**: User interactions must have visual feedback in **< 100ms**.

**Applies to**:
- Button tap → visual feedback
- Move confirmation → game update
- Menu navigation → panel appear
- Settings change → theme apply

**Measurement**:
```bash
# DevTools Profiler:
# 1. Record interaction (button tap, etc.)
# 2. Check frame rendering timeline
# 3. Verify <100ms until paint completes
```

**Checklist**:
- [ ] Button tap feedback: <100ms
- [ ] Move confirmation: <100ms
- [ ] Menu open animation: <300ms (perceived snappy)
- [ ] Settings apply: <50ms (no animation lag)
- [ ] No 60ms+ frames during gameplay

---

### 3.3 Memory Usage

**Requirement**: Peak memory must stay **< 50MB** on low-end Android.

**Baseline Device**: Samsung Galaxy A50 (low-end Android, ~2019 tier)

**Monitoring**:
```bash
# Android Studio Profiler:
# 1. Run app on low-end device
# 2. Play 10 games
# 3. Navigate menus
# 4. Monitor memory graph
# 5. Verify peak < 50MB
```

**Checklist**:
- [ ] Idle memory: < 30MB
- [ ] Active gameplay: < 50MB
- [ ] No memory leaks (memory plateau over time)
- [ ] Event listeners cleaned up
- [ ] Large images lazy-loaded

---

## 4. Offline & Persistence Compliance

### 4.1 Work Offline (Mandatory)

**Requirement**: App must work **completely offline** without errors.

**Verification**:
```bash
# Airplane mode test on iOS/Android:
# 1. Disconnect network (Airplane mode)
# 2. Launch app
# 3. Play 3 games start-to-finish
# 4. View stats
# 5. Change settings
# 6. Close app
# 7. Reopen
# 8. Verify all data persisted
```

**Checklist**:
- [ ] App launches without network
- [ ] Game plays completely offline
- [ ] Moves save without network
- [ ] Stats update offline
- [ ] Settings persist offline
- [ ] No "network error" messages
- [ ] No required API calls on startup

---

### 4.2 State Persistence (Mandatory)

**Requirement**: Critical state must survive app suspension and termination.

**Implementation** (already verified):

```typescript
// Game state persisted via useGame hook
const [state, setState] = useState<GameState>(() => load('nim-game', ...))

const updateState = useCallback((newState: GameState) => {
  setState(newState)
  save('nim-game', newState)  // Persist immediately
}, [])

// Stats persisted via useStats hook
const [stats, setStats] = useState(() => load('nim-stats', DEFAULT))

const updateStats = useCallback((next: GameStats) => {
  setStats(next)
  save('nim-stats', next)  // Persist immediately
}, [])

// Theme persisted via useTheme hook
const saveSettings = (settings: ThemeSettings) => {
  save('nim-theme', settings)  // Persist immediately
}
```

**Verification Checklist**:
- [ ] **Play game, suspend (home button)**
  - [ ] Resume app
  - [ ] Game board shows exact same state
  - [ ] No data lost

- [ ] **Play game, close app completely**
  - [ ] Reopen app
  - [ ] Game state restored exactly
  - [ ] Can continue from saved position

- [ ] **Play game, force close (task manager)**
  - [ ] Reopen app
  - [ ] State recovered (or graceful reset)
  - [ ] Stats still saved

- [ ] **Win/lose game, close immediately**
  - [ ] Reopen app
  - [ ] Stats show correct win/loss count
  - [ ] Streak preserved

- [ ] **Change settings, close app**
  - [ ] Reopen
  - [ ] Theme, colorblind mode, difficulty all remembered

---

### 4.3 Capacitor Lifecycle Events (Mandatory)

**Requirement**: App must handle native lifecycle events (pause, resume, back button).

**Implementation** (already added):

```typescript
// In App.tsx
useEffect(() => {
  // Handle app pause (native app suspension)
  const unlistenPause = CapacitorApp.addListener('pause', () => {
    // Game state is already persisted via hooks
    // No additional action needed
    console.debug('[Capacitor] App paused - state auto-persisted')
  })

  // Handle app resume
  const unlistenResume = CapacitorApp.addListener('resume', () => {
    // Could re-initialize services if needed
    console.debug('[Capacitor] App resumed')
  })

  // Handle Android back button
  const unlistenBackButton = CapacitorApp.addListener('backButton', async () => {
    if (phase === 'playing') {
      handleBackToMenu()
    } else if (phase === 'settings') {
      handleCloseSettings()
    }
    // Else allow OS to handle (app exit)
  })

  return () => {
    unlistenPause.remove()
    unlistenResume.remove()
    unlistenBackButton.remove()
  }
}, [phase])
```

**Verification**:
- [ ] **Suspend app (home button)** → State persists
- [ ] **Resume app** → State is restored
- [ ] **Android back button on menu** → App exits properly
- [ ] **Android back button in game** → Returns to menu (not exit)
- [ ] **Android back button in settings** → Closes settings (not exit)
- [ ] **Force close (task manager)** → Stats still saved on reopen

---

## 5. Platform-Specific Requirements

### 5.1 iOS (App Store)

**Requirements**:
- ✅ Safe-area handling (notch, home indicator)
- ✅ Gesture navigation support
- ✅ Dark mode + light mode support
- ✅ Touch target 44×44 px minimum
- ✅ Full keyboard navigation
- ✅ VoiceOver support

**Checklist**:
- [ ] Tested on iPhone 14 Pro (notch)
- [ ] Tested on iPhone SE 2023 (no notch)
- [ ] Tested iPad (landscape orientation)
- [ ] Dark mode working
- [ ] Light mode working
- [ ] Reduced motion respected (no animations if enabled)
- [ ] Split view supported (iPad)
- [ ] VoiceOver verified

**Submission Metadata**:
- **App Name**: \<your app name\>
- **Bundle ID**: `com.scottreinhart.<app-id>` (per app)
- **Min iOS Version**: 13.0 (Capacitor minimum)
- **Device Family**: iPhone + iPad
- **Orientation**: Portrait + Landscape
- **Requires Full Screen**: No

---

### 5.2 Android (Google Play)

**Requirements**:
- ✅ Safe-area handling (gesture nav, rounded corners)
- ✅ Touch target 44×48 dp minimum (Android standard, ~44px)
- ✅ Full keyboard/D-pad navigation
- ✅ TalkBack support
- ✅ System dark mode support
- ✅ Back button handling

**Checklist**:
- [ ] Tested on Pixel 7 (Android 13)
- [ ] Tested on low-end device (Android 10)
- [ ] Gesture navigation working
- [ ] Back button behavior correct
- [ ] Dark mode working
- [ ] TalkBack verified
- [ ] No deprecated APIs used
- [ ] Min SDK 22 (Capacitor minimum)

**Submission Metadata**:
- **Package Name**: `com.scottreinhart.<app-id>` (per app)
- **Min SDK**: 22
- **Target SDK**: 34+
- **Permissions**: INTERNET (optional, offline-first)
- **Screen Orientations**: Portrait + Landscape

---

## 6. Quality Assurance Checklist

### 6.1 Code Quality (Pre-Submission)

```bash
# Run full validation
pnpm validate

# Should output:
# ✅ Lint: 0 errors
# ✅ Format: OK
# ✅ Typecheck: OK
# ✅ Build: OK (no warnings)
```

**Checklist**:
- [ ] `pnpm validate` passes completely
- [ ] Zero ESLint warnings
- [ ] Zero TypeScript errors
- [ ] Zero console warnings on startup
- [ ] Zero console errors during gameplay
- [ ] No memory leaks (DevTools Profiler)
- [ ] No deprecation warnings

---

### 6.2 Manual Testing Matrix

| Test Case | iOS | Android | Status |
|-----------|-----|---------|--------|
| **Startup** | Launch time < 3s | Launch time < 3s | □ |
| **Gameplay** | 10 moves no lag | 10 moves no lag | □ |
| **Offline** | Works offline | Works offline | □ |
| **Stats Persistence** | Survives close | Survives close | □ |
| **Safe-Area** | No notch overlap | No gesture nav overlap | □ |
| **Touch Targets** | 44×44 minimum | 48×48 dp minimum | □ |
| **Accessibility** | VoiceOver works | TalkBack works | □ |
| **Dark Mode** | Renders correctly | Renders correctly | □ |
| **Keyboard Nav** | Tab works fully | D-pad works fully | □ |
| **Back Button** | N/A (iOS) | Returns to menu | □ |

---

### 6.3 Device Testing Matrix

**Minimum Testing Required**:

| Category | Device | Version | OS Version | Notes |
|----------|--------|---------|-----------|-------|
| **iOS premium** | iPhone 14 Pro | 6.1" | 17.0 | Dynamic Island |
| **iOS standard** | iPhone SE 2023 | 4.7" | 17.0 | Home button |
| **iOS tablet** | iPad Air 5 | 10.9" | 17.0 | Landscape |
| **Android premium** | Pixel 7 | 6.1" | 13+ | Gesture nav |
| **Android standard** | Samsung A50 | 6.4" | 12 | Physical buttons |
| **Android low-end** | Moto E5 | 5.7" | 10 | Low memory |

---

## 7. Deployment Checklist

**Before submitting to App Store / Google Play:**

### Pre-Submission (Internal QA)

- [ ] Code Quality
  - [ ] `pnpm validate` passes
  - [ ] Zero console errors
  - [ ] Zero TypeScript errors
  - [ ] All new code reviewed

- [ ] Mobile Testing
  - [ ] Tested on iOS device (simulator + real phone if possible)
  - [ ] Tested on Android device (simulator + real phone if possible)
  - [ ] All manual tests passed (see 6.2)
  - [ ] Device matrix tested (see 6.3)

- [ ] Offline & Persistence
  - [ ] Game state survives app suspension
  - [ ] Stats persist across sessions
  - [ ] Settings remembered after close
  - [ ] Works 100% offline
  - [ ] Capacitor events handled

- [ ] Accessibility
  - [ ] Safe-area tested on notched devices
  - [ ] Touch targets 44×44 px verified
  - [ ] Keyboard navigation complete
  - [ ] Screen reader tested (VoiceOver, TalkBack)
  - [ ] WCAG AA contrast verified

- [ ] Performance
  - [ ] App launch < 3 seconds
  - [ ] Move response < 100ms
  - [ ] Memory < 50MB (low-end Android)
  - [ ] No jank during gameplay

---

### App Store Submission (iOS)

**Requirements**:
- [ ] Xcode project configured
- [ ] Code signing certificate obtained
- [ ] Provisioning profile created
- [ ] Bundle ID matches `com.scottreinhart.nim`
- [ ] Screenshots prepared (3-5 app preview images)
- [ ] App description written
- [ ] Keywords selected
- [ ] Support URL provided
- [ ] Privacy policy provided

**Build**:
```bash
cd ios/App
xcodebuild -workspace App.xcworkspace \
  -scheme App \
  -configuration Release \
  -archivePath ./build/Nim.xcarchive \
  archive
```

---

### Google Play Submission (Android)

**Requirements**:
- [ ] Gradle build configured
- [ ] Signing key generated
- [ ] `keystore` file backed up (critical!)
- [ ] Package name matches `com.scottreinhart.nim`
- [ ] Screenshots prepared (4-5 images, localized)
- [ ] App description written (short + full)
- [ ] Keywords selected
- [ ] Contact info provided
- [ ] Privacy policy provided

**Build**:
```bash
cd android
./gradlew bundleRelease
# Output: android/app/build/outputs/bundle/release/app-release.aab
```

---

## 8. Post-Launch Monitoring

** Monitor for 1 week after launch**:

- [ ] Crash reports (< 0.01% crash rate)
- [ ] ANR reports (< 0.5% ANR rate)
- [ ] User reviews (address feedback)
- [ ] Performance metrics (LCP, TTI targets met)
- [ ] Memory usage (no memory leak trends)

---

## Compliance Verification Signature

**Verified By**: [Your Name]  
**Date**: [YYYY-MM-DD]  
**Checklist Status**: ☐ All items passed

---

## 9. Cross-Platform Approval Validation References

Use these external docs as approval-validation guidance for non-store distribution platforms.

### Meta (Instant Games / Platform)

- [https://developers.facebook.com/docs/games/instant-games](https://developers.facebook.com/docs/games/instant-games)
- [https://developers.facebook.com/docs/games/instant-games/guides](https://developers.facebook.com/docs/games/instant-games/guides)
- [https://developers.facebook.com/docs/games/instant-games/guides/publishing](https://developers.facebook.com/docs/games/instant-games/guides/publishing)
- [https://developers.facebook.com/docs/games/instant-games/guides/quality](https://developers.facebook.com/docs/games/instant-games/guides/quality)
- [https://developers.facebook.com/docs/games/instant-games/guides/performance](https://developers.facebook.com/docs/games/instant-games/guides/performance)
- [https://developers.facebook.com/docs/games/instant-games/guides/monetization](https://developers.facebook.com/docs/games/instant-games/guides/monetization)
- [https://developers.facebook.com/docs/games/instant-games/guides/ads](https://developers.facebook.com/docs/games/instant-games/guides/ads)
- [https://developers.facebook.com/docs/games/instant-games/sdk](https://developers.facebook.com/docs/games/instant-games/sdk)
- [https://developers.facebook.com/docs/games/instant-games/reference](https://developers.facebook.com/docs/games/instant-games/reference)
- [https://developers.facebook.com/policy](https://developers.facebook.com/policy)
- [https://developers.facebook.com/terms](https://developers.facebook.com/terms)

### Twitch (Extensions / Integrations)

- [https://dev.twitch.tv/docs/extensions](https://dev.twitch.tv/docs/extensions)
- [https://dev.twitch.tv/docs/extensions/guidelines-and-policies](https://dev.twitch.tv/docs/extensions/guidelines-and-policies)
- [https://dev.twitch.tv/docs/extensions/monetization](https://dev.twitch.tv/docs/extensions/monetization)
- [https://dev.twitch.tv/docs/extensions/frontend](https://dev.twitch.tv/docs/extensions/frontend)
- [https://dev.twitch.tv/docs/extensions/backend](https://dev.twitch.tv/docs/extensions/backend)
- [https://dev.twitch.tv/docs/extensions/building](https://dev.twitch.tv/docs/extensions/building)
- [https://dev.twitch.tv/docs/extensions/reference](https://dev.twitch.tv/docs/extensions/reference)
- [https://dev.twitch.tv/docs/policy](https://dev.twitch.tv/docs/policy)
- [https://dev.twitch.tv/docs/authentication](https://dev.twitch.tv/docs/authentication)

### CrazyGames

- [https://docs.crazygames.com/](https://docs.crazygames.com/)
- [https://docs.crazygames.com/requirements/intro](https://docs.crazygames.com/requirements/intro)
- [https://docs.crazygames.com/requirements/gameplay](https://docs.crazygames.com/requirements/gameplay)
- [https://docs.crazygames.com/requirements/quality](https://docs.crazygames.com/requirements/quality)
- [https://docs.crazygames.com/requirements/technical](https://docs.crazygames.com/requirements/technical)
- [https://docs.crazygames.com/requirements/monetization](https://docs.crazygames.com/requirements/monetization)
- [https://docs.crazygames.com/sdk](https://docs.crazygames.com/sdk)
- [https://docs.crazygames.com/sdk/html5](https://docs.crazygames.com/sdk/html5)
- [https://docs.crazygames.com/publishing/submit](https://docs.crazygames.com/publishing/submit)
- [https://www.crazygames.com/publish](https://www.crazygames.com/publish)

### Discord (Games / Activities)

- [https://discord.com/developers/docs/intro](https://discord.com/developers/docs/intro)
- [https://discord.com/developers/docs/activities/overview](https://discord.com/developers/docs/activities/overview)
- [https://docs.discord.com/developers/activities/building-an-activity](https://docs.discord.com/developers/activities/building-an-activity)
- [https://docs.discord.com/developers/activities/how-activities-work](https://docs.discord.com/developers/activities/how-activities-work)
- [https://docs.discord.com/developers/activities/development-guides/local-development](https://docs.discord.com/developers/activities/development-guides/local-development)
- [https://docs.discord.com/developers/activities/development-guides/networking](https://docs.discord.com/developers/activities/development-guides/networking)
- [https://docs.discord.com/developers/activities/development-guides/user-actions](https://docs.discord.com/developers/activities/development-guides/user-actions)
- [https://docs.discord.com/developers/developer-tools/embedded-app-sdk](https://docs.discord.com/developers/developer-tools/embedded-app-sdk)
- [https://docs.discord.com/developers/interactions/application-commands#entry-point-commands](https://docs.discord.com/developers/interactions/application-commands#entry-point-commands)
- [https://discord.com/developers/docs/game-sdk/sdk-starter-guide](https://discord.com/developers/docs/game-sdk/sdk-starter-guide)
- [https://discord.com/developers/build](https://discord.com/developers/build)
- [https://support-dev.discord.com/hc/en-us/articles/360025028592-Game-Submission-Guidelines](https://support-dev.discord.com/hc/en-us/articles/360025028592-Game-Submission-Guidelines)
- [https://support-dev.discord.com/hc/en-us/articles/21204423970071-Introducing-the-Embedded-App-SDK](https://support-dev.discord.com/hc/en-us/articles/21204423970071-Introducing-the-Embedded-App-SDK)
- [https://github.com/discord/getting-started-activity](https://github.com/discord/getting-started-activity)
- [https://threejs.org/](https://threejs.org/)
- [https://threejs.org/docs/](https://threejs.org/docs/)
- [https://threejs.org/manual/#en/creating-a-scene](https://threejs.org/manual/#en/creating-a-scene)
- [https://get.webgl.org/](https://get.webgl.org/)
- [https://get.webgl.org/webgl2/](https://get.webgl.org/webgl2/)
- [https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API)
- [https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices)
- [https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/webglcontextlost_event](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/webglcontextlost_event)
- [https://robojs.dev/discord-activities/getting-started](https://robojs.dev/discord-activities/getting-started)
- [https://robojs.dev/discord-activities/beginner-guide](https://robojs.dev/discord-activities/beginner-guide)
- [https://colyseus.io/blog/discord-embedded-sdk/](https://colyseus.io/blog/discord-embedded-sdk/)
- [https://github.com/colyseus/discord-activity](https://github.com/colyseus/discord-activity)
- [https://doc.photonengine.com/realtime/current/connection-and-authentication/discord-activities](https://doc.photonengine.com/realtime/current/connection-and-authentication/discord-activities)
- [https://phaser.io/news/2024/11/build-a-discord-activity-with-phaser](https://phaser.io/news/2024/11/build-a-discord-activity-with-phaser)
- [https://www.supertorio.dev/creating-a-unity-discord-activity/](https://www.supertorio.dev/creating-a-unity-discord-activity/)
- [https://discord.com/build-case-studies/frvr](https://discord.com/build-case-studies/frvr)
- [https://discord.com/guidelines](https://discord.com/guidelines)
- [https://discord.com/terms](https://discord.com/terms)

### Telegram (Games / Bots)

- [https://core.telegram.org/bots](https://core.telegram.org/bots)
- [https://core.telegram.org/bots/games](https://core.telegram.org/bots/games)
- [https://core.telegram.org/bots/api](https://core.telegram.org/bots/api)
- [https://core.telegram.org/bots/inline](https://core.telegram.org/bots/inline)
- [https://core.telegram.org/bots/payments](https://core.telegram.org/bots/payments)
- [https://www.mava.app/blog/how-to-build-a-telegram-game-a-comprehensive-guide](https://www.mava.app/blog/how-to-build-a-telegram-game-a-comprehensive-guide)
- [https://games.themindstudios.com/post/how-to-make-a-game-for-telegram/](https://games.themindstudios.com/post/how-to-make-a-game-for-telegram/)
- [https://www.algoryte.com/blogs/how-to-build-engaging-telegram-games-that-users-cant-stop-playing/](https://www.algoryte.com/blogs/how-to-build-engaging-telegram-games-that-users-cant-stop-playing/)
- [https://telegram.org/tos](https://telegram.org/tos)
- [https://telegram.org/privacy](https://telegram.org/privacy)

### Steam (Steamworks / Steam Direct)

- [https://partner.steamgames.com/](https://partner.steamgames.com/)
- [https://partner.steamgames.com/steamdirect](https://partner.steamgames.com/steamdirect)
- [https://partner.steamgames.com/doc/store](https://partner.steamgames.com/doc/store)
- [https://partner.steamgames.com/doc/store/page](https://partner.steamgames.com/doc/store/page)
- [https://partner.steamgames.com/doc/store/review_process](https://partner.steamgames.com/doc/store/review_process)
- [https://partner.steamgames.com/doc/gettingstarted](https://partner.steamgames.com/doc/gettingstarted)
- [https://partner.steamgames.com/doc/sdk](https://partner.steamgames.com/doc/sdk)
- [https://partner.steamgames.com/doc/features](https://partner.steamgames.com/doc/features)
- [https://partner.steamgames.com/doc/marketing](https://partner.steamgames.com/doc/marketing)
- [https://store.steampowered.com/subscriber_agreement](https://store.steampowered.com/subscriber_agreement)

### Priority Parse Order (Minimum Critical)

- Meta: `guides/quality`, `guides/performance`
- Twitch: `guidelines-and-policies`
- CrazyGames: `requirements/*`
- Discord: `Game-Submission-Guidelines`
- Steam: `doc/store/review_process`

---

## 10. Ingested Approval Validation Baseline (Content-Derived)

Last content ingestion pass: **2026-04-19**

This section captures approval-facing requirements extracted from platform documentation and is intended for validation workflows (not just link storage).

### 10.1 Meta Instant Games (content-derived)

Source basis:
- `.../docs/games/build/instant-games/quality-guidelines`
- `.../docs/games/build/instant-games/game-performance`
- `.../docs/games/instant-games` and `.../docs/games/instant-games/guides`

Validation baseline:
- Approved Partner + quality review are required for platform submission.
- Quality gates include honesty/promotion, monetization UX, usability, playability/retention, and design/aesthetics.
- Core functionality must avoid major progression-blocking issues (crashes, freeze, save failures, non-responsive controls).
- Performance baseline includes instant start expectations: initial loading should target <=5s and avoid secondary wait screens after 100%.
- Initial content loading guidance targets ~6MB for startup; defer non-critical assets.
- Loading progress should be reported via platform APIs (`setProgress` guidance).
- Monetization must not be overly disruptive or required for progression.
- Notification quality constraints apply (relevance, readability, language alignment, no misleading/abusive formatting patterns).

### 10.2 Twitch Extensions (content-derived)

Source basis:
- `https://dev.twitch.tv/docs/extensions/guidelines-and-policies`
- `https://dev.twitch.tv/docs/extensions/monetization`

Validation baseline:
- Review channels must be live during review and extension must load/configure without errors.
- Technical restrictions include: no Flash, no iframes, no keyboard shortcuts for core extension functionality.
- JS submitted for review must be human-readable; obfuscated/eval-heavy dependencies must be separately source-identifiable.
- Dynamic AJAX data must not be injected directly into DOM without validation/processing.
- Extension helper inclusion/order and full asset packaging requirements must be satisfied.
- Mobile-enabled extension baseline includes initial load size and load-time constraints (<=1MB initial page load from Twitch CDN, ~<3s at ~500Kb/s).
- Bits monetization requires feature-flag handling (`isBitsEnabled`) and must degrade safely when unavailable.
- Monetization and content behavior must comply with policy restrictions (including prohibited ad/content patterns and restricted wagering/loot-box use cases).

### 10.3 CrazyGames (content-derived)

Source basis:
- `https://docs.crazygames.com/requirements/intro`
- `https://docs.crazygames.com/requirements/gameplay`
- `https://docs.crazygames.com/requirements/technical`
- `https://docs.crazygames.com/requirements/quality`
- `https://docs.crazygames.com/requirements/ads`

Validation baseline:
- Submission model distinguishes Basic Launch vs Full Launch; Full requires broader SDK integration.
- Technical limits: initial download and total size budgets, file-count limits, and relative-path constraints.
- Gameplay quality requires readable UI across target viewport sizes, stable controls, smooth performance, and PEGI-12 suitability.
- Cross-promotion is restricted; App Store links are disallowed in-game.
- CrazyGames fullscreen is platform-provided; custom fullscreen controls are prohibited.
- SDK `gameplayStart`/`gameplayStop` events and required integration points must be correctly emitted for full implementation.
- Ads must be SDK-based only; no disruptive ads, no deceptive triggers, no chained ads, and proper pause/mute/error handling around ad lifecycle.
- AdBlock users must retain playable core experience (no hard-blocking from gameplay).

### 10.4 Discord Activities (content-derived + access note)

Source basis:
- `https://discord.com/developers/docs/activities/overview`
- `https://docs.discord.com/developers/activities/building-an-activity`
- `https://docs.discord.com/developers/activities/how-activities-work`
- `https://docs.discord.com/developers/activities/development-guides/local-development`
- `https://docs.discord.com/developers/activities/development-guides/networking`
- `https://docs.discord.com/developers/activities/development-guides/user-actions`
- `https://docs.discord.com/developers/developer-tools/embedded-app-sdk`
- `https://docs.discord.com/developers/interactions/application-commands#entry-point-commands`
- `https://github.com/discord/getting-started-activity`
- `https://threejs.org/`
- `https://threejs.org/docs/`
- `https://threejs.org/manual/#en/creating-a-scene`
- `https://get.webgl.org/`
- `https://get.webgl.org/webgl2/`
- `https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API`
- `https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices`
- `https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/webglcontextlost_event`
- `https://robojs.dev/discord-activities/getting-started`
- `https://robojs.dev/discord-activities/beginner-guide`
- `https://discord.com/developers/build`
- Submission-guideline and support-dev SDK article URLs currently returned access block (403) in ingestion runs.
- Secondary implementation references: Robo.js, Colyseus, Photon, Phaser, Unity, and Discord case studies.

Validation baseline:
- Activity architecture is iframe-hosted web app across desktop/mobile/web clients using Embedded App SDK.
- Approval validation must verify Embedded App SDK command/event integration, multi-client behavior, and connected-user flow correctness.
- Build flow baseline includes: developer mode enabled, app registration in Discord Developer Portal, activity URL mapping, local secure tunnel for development, and user authorization via SDK-backed flow.
- Activity launch paths must support both: Entry Point launch and interaction response with `LAUNCH_ACTIVITY` callback.
- Runtime lifecycle must follow: iframe init -> SDK handshake (`ready`) -> authorize/authenticate -> scoped commands/events -> close/error handling.
- Networking must comply with Discord proxy model (`{clientId}.discordsays.com` patterns, URL mappings, CSP constraints, external URL remap/patch patterns).
- Local development must be HTTPS-capable on web/desktop and should prefer tunnel-backed proxy testing with URL mapping parity.
- User-action flows must enforce Discord-mediated UX: external links via SDK modal, invite dialogs with permission checks, and entry-point command configuration.
- Entry-point command governance must align with Discord `PRIMARY_ENTRY_POINT` semantics and handler configuration.
- SDK command usage must be scope-aware and platform-aware (web/iOS/android support differences).
- Implementation stacks may vary (HTML5/Canvas/WebGL, React/Vite starters, realtime networking like Colyseus/Photon), but compliance checks remain SDK and policy driven.
- Activity launch and runtime behavior must remain consistent for embedded iframe contexts and Discord client lifecycle events.
- Because submission-guideline endpoint and some support-dev pages were access-blocked during ingestion, final release checklist must include manual review pass of Discord submission policy by a logged-in reviewer.
- WebGL/3D activities must include capability checks and graceful fallback when WebGL/WebGL2 is unavailable or disabled.
- Rendering implementations must handle WebGL context lifecycle events (`webglcontextlost`/`webglcontextrestored`) and recover cleanly.
- WebGL extensions and limits must be treated as device-variable; feature-gate optional capabilities and avoid hard assumptions.
- WebGL performance hygiene is required: eliminate runtime GL errors, avoid blocking GPU readbacks/queries in hot paths, and bound VRAM usage.

Implementation guidance (secondary, non-authoritative):
- Use official starter templates to reduce auth/bootstrap drift.
- Keep multiplayer session state deterministic and reconnect-safe for channel-based launches.
- Prioritize low-friction onboarding and fast initial activity readiness within Discord.
- Prefer simple tunnel + URL mapping workflows during iteration; maintain production URL mapping parity before submission.
- For Three.js stacks, prefer progressive enhancement (WebGL2 -> WebGL1 -> non-3D fallback UX) and monitor device constraints early.
- Treat client-provided Discord context as untrusted for security-critical decisions; validate privileged facts server-side using OAuth-backed API calls.
- Case-study and community templates can guide architecture choices, but must not override official Discord platform rules.

### 10.5 Telegram Bots/Games (content-derived)

Source basis:
- `https://core.telegram.org/bots/games`
- `https://core.telegram.org/bots/api`
- `https://core.telegram.org/bots/inline`
- `https://core.telegram.org/bots`
- `https://www.mava.app/blog/how-to-build-a-telegram-game-a-comprehensive-guide`
- `https://games.themindstudios.com/post/how-to-make-a-game-for-telegram/`
- `https://www.algoryte.com/blogs/how-to-build-engaging-telegram-games-that-users-cant-stop-playing/`

Validation baseline:
- HTML5 game lifecycle is bot-mediated (`/newgame` via BotFather + callback flow + game URL delivery).
- Game launch button requirements apply (game-launch button placement constraints in inline keyboard; game launch button must be the first button in the first row for launch callbacks).
- Experience must be responsive across Telegram clients/platforms.
- Share score flows must be user-initiated (no non-consensual invocation).
- Bot API transport requirements (HTTPS endpoint + tokenized method calls) and update handling reliability remain required.
- Score-sharing and challenge loops must remain explicit and user-initiated (`shareScore`-style interactions only after gameplay events).
- Telegram platform params (`tg*` query/hash/init data) must be parsed safely and treated as untrusted input.

Implementation guidance (secondary, non-authoritative):
- Keep session loops short and mobile-first for chat-native usage patterns.
- Prioritize frictionless onboarding (fast start, minimal pre-game steps).
- Favor social replay/challenge loops and clear return-to-chat pathways.
- Keep UI lightweight and bandwidth-conscious for instant launch behavior on constrained networks.

Authority note:
- Compliance gates must remain anchored to official Telegram docs (`core.telegram.org`) and Telegram legal pages.
- Third-party guides inform product strategy and UX heuristics, but do not override platform compliance requirements.

### 10.6 Steamworks / Steam Direct (content-derived)

Source basis:
- `https://partner.steamgames.com/doc/store/review_process`

Validation baseline:
- Review lead time: submission review typically 3-5 business days; plan >=7 business days.
- Store page must reflect launch-available features/content only (no misleading future-content presentation).
- Capsule assets require readable title/logo; screenshots must show gameplay only.
- Store description must be coherent/detailed and avoid prohibited outbound link patterns in description text.
- Build must launch correctly on all declared supported operating systems.
- All listed supported features must be present in submitted build.
- In-game transactions must use Steam Wallet-compliant pathways.

### 10.7 Source Availability Notes

- Some originally provided URLs changed pathing over time (notably Meta and CrazyGames publishing endpoints).
- Discord submission guideline endpoint returned 403 during automated fetch.
- Validation pipeline should treat such endpoints as **manual-review required** rather than silently dropping platform criteria.

---

## 11. Rejected URL Recovery Map

Use this mapping when automated ingestion fails on a previously referenced endpoint.

| Rejected URL | Failure | Recovery Option(s) | Recovery Status |
|---|---|---|---|
| `https://developers.facebook.com/docs/games/instant-games/guides/quality` | 404 | `https://developers.facebook.com/docs/games/build/instant-games/quality-guidelines` | Recovered |
| `https://developers.facebook.com/docs/games/instant-games/guides/performance` | 404 | `https://developers.facebook.com/docs/games/build/instant-games/game-performance` | Recovered |
| `https://developers.facebook.com/docs/games/instant-games/guides/publishing` | 404 | `https://developers.facebook.com/docs/games/build/instant-games/get-started` and `https://developers.facebook.com/docs/games/instant-games/getting-started/launch-checklist` | Recovered |
| `https://docs.crazygames.com/requirements/monetization` | 404 | `https://docs.crazygames.com/requirements/ads`, `https://docs.crazygames.com/sdk/in-game-purchases`, monetization section in `https://docs.crazygames.com/requirements/intro` | Recovered |
| `https://docs.crazygames.com/publishing/submit` | 404 | `https://developer.crazygames.com/` and launch/process context in `https://docs.crazygames.com/requirements/intro` + `https://docs.crazygames.com/resources/basic-launch-metrics` | Recovered (portal-driven) |
| `https://support-dev.discord.com/hc/en-us/articles/360025028592-Game-Submission-Guidelines` | 403 | `https://discord.com/developers/docs/activities/overview`, `https://discord.com/developers/docs/activities/how-activities-work`, plus policy anchors in `https://discord.com/guidelines` / `https://discord.com/terms` | Partially recovered (manual auth review still required) |
| `https://support.discord.com/hc/en-us/articles/360025028592-Game-Submission-Guidelines` | 403 | Same as above; require signed-in manual retrieval for submission-specific wording | Partially recovered (manual auth review still required) |
| `https://support-dev.discord.com/hc/en-us/articles/21204423970071-Introducing-the-Embedded-App-SDK` | 403 | `https://discord.com/developers/docs/activities/overview`, `https://docs.discord.com/developers/activities/building-an-activity`, `https://docs.discord.com/developers/developer-tools/embedded-app-sdk`, `https://github.com/discord/getting-started-activity` | Partially recovered (manual auth review still required) |
| `https://robojs.dev/discord-activities/tunnels` | 404 | `https://robojs.dev/discord-activities/getting-started`, `https://robojs.dev/discord-activities/beginner-guide` | Recovered (path superseded) |

### 11.1 Operational Recovery Procedure

When a source URL fails during ingestion:

1. Attempt canonical path migration on same domain (e.g., `/instant-games/guides/*` -> `/games/build/instant-games/*`).
2. Fallback to platform top-level docs page and follow nearest equivalent section by topic.
3. Record recovery URL in this map and mark status (`Recovered` or `Partially recovered`).
4. If endpoint is access-restricted (403), flag as `manual auth review required` and capture proxy sources used.
5. Keep validation criteria active from recovered sources; do not drop a platform gate due to fetch failures.

---

## 12. Executable PASS|FAIL Evidence Reporting

Use the approval-evidence pipeline to generate deterministic platform verdicts and proof artifacts.

Commands:

- `pnpm report:platform-approval`  
  Generates machine-readable report artifacts without failing the process.
- `pnpm validate:platform-approval`  
  Enforces strict gate (`PASS` only). Fails on any `FAIL` or `BLOCKED`.
- `pnpm validate:platform-approval:allow-blocked`  
  Enforces strict gate while allowing `BLOCKED` (manual-review pending) cells.

Artifacts:

- `compliance/platform-approval-report.json`  
  Full per-app/per-platform evidence including automated gate checks, manual gates, source URLs, and verdict.
- `compliance/platform-approval-matrix.json`  
  Compact matrix with verdict-only view (`PASS|FAIL|BLOCKED`) plus platform summaries.
- `compliance/platform-manual-evidence.json`  
  Manual-proof input for auth-restricted gates (for example Discord submission guideline review).

Manual evidence expectation:

- For any platform gate marked manual, provide required fields in `compliance/platform-manual-evidence.json`.
- Manual gate remains `BLOCKED` until all required evidence fields are present.

---

**Reference**: AGENTS.md § 23 (Accessibility), § 25 (Performance), WCAG 2.1 AA Standard
