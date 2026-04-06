# Mobile Testing Governance — Capacitor Deployment Readiness

**Authority**: Subordinate to `AGENTS.md` § 0 (Non-Negotiable Rules) for all mobile testing decisions.

**BASELINE**: Before mobile testing, read `AGENTS.md` § 0. No fake completion. Preserve safe-area behavior. Quality gates mandatory.

**Scope**: Applies to all Nim project code targeting iOS/Android via Capacitor WebView bridge.

**Status**: Mandatory; part of pre-deployment quality gate.

---

## 1. Pre-Mobile Validation Checklist

### Safe-Area Inset Handling (iPhone Notch/Android System UI)

**Requirement**: All content must respect safe-area insets on notched devices.

**Implementation**:
```tsx
// Apply to root App layout container
style={{
  paddingTop: 'env(safe-area-inset-top)',
  paddingRight: 'env(safe-area-inset-right)',
  paddingBottom: 'env(safe-area-inset-bottom)',
  paddingLeft: 'env(safe-area-inset-left)',
}}

// OR with CSS3 max() to ensure minimum padding even on unsupported devices:
style={{
  paddingTop: 'max(16px, env(safe-area-inset-top))',
  paddingRight: 'max(16px, env(safe-area-inset-right))',
  paddingBottom: 'max(16px, env(safe-area-inset-bottom))',
  paddingLeft: 'max(16px, env(safe-area-inset-left))',
}}
```

**Verification**:
- [ ] Test on iPhone 14 Pro (6.1" notch/dynamic island)
- [ ] Test on iPhone SE (no notch, safe-area still defined by gesture-based nav)
- [ ] Test on Android with gesture navigation (rounded corners + button bar)
- [ ] Verify no content is clipped or obscured by system UI
- [ ] Test both portrait and landscape orientations

**Devices to Test**:
| Device | Screen | Notch Type | Form Factor | Priority |
|--------|--------|-----------|-------------|----------|
| iPhone 14 Pro | 6.1" | Dynamic Island (pill) | Notch | High |
| iPhone SE | 4.7" | Home button | Safe area bottom only | High |
| iPhone 15+ | 6+ | Always-on dynamic island | Notch | High (latest iOS) |
| Pixel 7/8 | 6.1"+ | Punch-hole/rounded corners | Notch | High |
| Android 12+ tablet | 10-12" | Rounded corners | Landscape-first | Medium |

---

### Touch Gesture Validation

#### 1. Swipe Detection (`useSwipeGesture` hook)

**Definition**: Horizontal or vertical finger drag with velocity, not just distance.

**Implementation Status**: ✅ Good (velocity-based, threshold detection)

**Required Testing**:
```
Test Case: Quick Horizontal Swipe
- Drag finger 50+ pixels left within 200ms
- Expected: onSwipe('left') fires
- Actual: [Test must verify]

Test Case: Slow Drag (Not a Swipe)
- Drag finger 100 pixels left over 1500ms
- Expected: onSwipe ignored (too slow)
- Actual: [Test must verify]

Test Case: Vertical Swipe Blocked
- If game only supports horizontal swipes:
  - Drag finger 50+ pixels up within 200ms
  - Expected: onSwipe ignored (wrong direction)
  - Actual: [Test must verify]

Test Case: Diagonal Ambiguity
- Drag 40px right + 30px down simultaneously
- Expected: Direction detected as primary (right)
- Actual: [Test must verify]
```

**Test Execution on Real Devices**:
```bash
# iOS
1. Open app in Capacitor (pnpm cap:open:ios)
2. Deploy to iPhone or simulator
3. Manual swipe testing in game board area
4. Verify no accidental swipes trigger gameplay

# Android
1. Build APK: pnpm cap:init:android && pnpm cap:build:android
2. Install on device or emulator
3. Manual swipe testing with gesture navigation active
4. Verify swipes don't interfere with system navigation (gesture bar)
```

**Performance Gates**:
- Swipe detection must respond within 100ms of release
- No visual lag or frame drops during swipe

---

#### 2. Long-Press Detection (`useLongPress` hook)

**Definition**: Sustained pointer pressure (500ms default) without movement.

**Implementation Status**: ✅ Good with enhancement recommendation

**Required Enhancement**:
```tsx
// Add movement tolerance to prevent accidental long-press from small jitter
const MOVEMENT_THRESHOLD = 5 // pixels

const calculateDistance = (start: Point, current: Point) => {
  const dx = start.x - current.x
  const dy = start.y - current.y
  return Math.sqrt(dx * dx + dy * dy)
}

const handleTouchMove = useCallback((e: React.TouchEvent) => {
  if (!pointerStartRef.current) return
  
  const distance = calculateDistance(
    pointerStartRef.current,
    { x: e.touches[0].clientX, y: e.touches[0].clientY },
  )
  
  // If moved beyond threshold, cancel long-press
  if (distance > MOVEMENT_THRESHOLD && timerRef.current) {
    window.clearTimeout(timerRef.current)
    timerRef.current = null
  }
}, [])
```

**Required Testing**:
```
Test Case: Valid Long-Press
- Touch game board, hold for 500ms without moving
- Expected: onLongPress fires, visual feedback appears
- Actual: [Test must verify]

Test Case: Movement Cancel
- Touch, move finger 5+ pixels before 500ms
- Expected: onLongPress cancelled, no visual feedback
- Actual: [Test must verify]

Test Case: Fast Release
- Touch game board, release before 500ms
- Expected: onLongPress ignored
- Actual: [Test must verify]
```

**Test Execution**:
```bash
# Manual device testing
1. Deploy to iOS simulator/device
2. Tap game board cell and hold for 1 second
3. Verify haptic feedback (if integrated)
4. Release and repeat with movement partway through
5. Verify no erratic long-press firing
```

---

#### 3. Multi-Touch Handling

**Requirement**: Game must handle concurrent multi-touch gracefully (no crashes, clear behavior).

**Test Case**:
```
Test Case: Two-Finger Tap
- Place two fingers on screen simultaneously
- Expected: Behavior is defined (ignore, use first touch, or trigger special action)
- Actual: [Test must verify]

Test Case: Touch + Swipe Interference
- One finger begins swipe while second finger taps
- Expected: Graceful handling (no game state corruption)
- Actual: [Test must verify]
```

---

### Offline Persistence (Critical for Mobile)

**Requirement**: Game state and statistics must persist across app suspension and restart.

**Implementation Status**: ❌ Missing (requires `storageService.ts`)

**Required Implementation**:

Create `src/app/services/storageService.ts`:

```typescript
/**
 * Persistent storage for game state, player stats, and settings.
 * Uses browser localStorage; survives app suspension and device restart.
 */

import type { GameState, Stats, Theme } from '@/domain'

const KEYS = {
  GAME_STATE: 'nim:game:state',
  PLAYER_STATS: 'nim:stats:player',
  THEME: 'nim:settings:theme',
  SOUND_ENABLED: 'nim:settings:sound',
} as const

export const storageService = {
  // Game state
  saveGameState(state: GameState): void {
    try {
      localStorage.setItem(KEYS.GAME_STATE, JSON.stringify(state))
    } catch (e) {
      console.error('[Storage] Failed to save game state:', e)
      // Silently fail on quota exceeded
    }
  },

  loadGameState(): GameState | null {
    try {
      const raw = localStorage.getItem(KEYS.GAME_STATE)
      return raw ? JSON.parse(raw) : null
    } catch (e) {
      console.error('[Storage] Failed to load game state:', e)
      return null
    }
  },

  // Player stats
  saveStats(stats: Stats): void {
    try {
      localStorage.setItem(KEYS.PLAYER_STATS, JSON.stringify(stats))
    } catch (e) {
      console.error('[Storage] Failed to save stats:', e)
    }
  },

  loadStats(): Stats | null {
    try {
      const raw = localStorage.getItem(KEYS.PLAYER_STATS)
      return raw ? JSON.parse(raw) : null
    } catch (e) {
      console.error('[Storage] Failed to load stats:', e)
      return null
    }
  },

  // Theme preference
  saveTheme(theme: Theme): void {
    try {
      localStorage.setItem(KEYS.THEME, JSON.stringify(theme))
    } catch (e) {
      console.error('[Storage] Failed to save theme:', e)
    }
  },

  loadTheme(): Theme | null {
    try {
      const raw = localStorage.getItem(KEYS.THEME)
      return raw ? JSON.parse(raw) : null
    } catch (e) {
      return null
    }
  },

  // Sound preference
  setSoundEnabled(enabled: boolean): void {
    try {
      localStorage.setItem(KEYS.SOUND_ENABLED, JSON.stringify(enabled))
    } catch (e) {
      console.error('[Storage] Failed to save sound setting:', e)
    }
  },

  isSoundEnabled(): boolean {
    try {
      const raw = localStorage.getItem(KEYS.SOUND_ENABLED)
      return raw ? JSON.parse(raw) : true // default enabled
    } catch (e) {
      return true
    }
  },

  // Clear all (logout/reset)
  clearAll(): void {
    try {
      Object.values(KEYS).forEach(key => localStorage.removeItem(key))
    } catch (e) {
      console.error('[Storage] Failed to clear all:', e)
    }
  },
}
```

**Integration Points**:

1. **In `useGame()` hook** (on app load):
   ```tsx
   useEffect(() => {
     const savedGame = storageService.loadGameState()
     if (savedGame) {
       setGameState(savedGame) // Restore saved game
     }
   }, [])
   ```

2. **In game move handler** (on every move):
   ```tsx
   const handleMove = (move: Move) => {
     const newState = makeMove(gameState, move)
     setGameState(newState)
     storageService.saveGameState(newState) // Persist immediately
   }
   ```

3. **In `useStats()` hook** (on game end):
   ```tsx
   const recordResult = (result: GameResult) => {
     const newStats = updateStats(stats, result)
     setStats(newStats)
     storageService.saveStats(newStats)
   }
   ```

**Testing**:
```
Test Case: Game State Persistence
- Play game and make 3 moves
- Close app completely (swipe away from app switcher)
- Reopen app
- Expected: Game board shows move history, can continue from same state
- Actual: [Test must verify]

Test Case: Stats Persistence
- Win a game
- View stats screen → see +1 wins recorded
- Close app
- Reopen app
- Expected: Stats screen still shows updated win count
- Actual: [Test must verify]

Test Case: Storage Quota Exceeded
- Play many games (fill storage)
- Continue playing
- Expected: Graceful degradation (game still plays, just no save)
- Actual: [Test must verify]
```

---

## 2. Performance Baselines (Mobile-Specific)

### Measurement Tools

**Bundle Size**:
```bash
pnpm build
# Check dist/ size
# Target: <350KB gzipped (fits in 5MB app budget after assets)
```

**Runtime Performance**:
```bash
# On iOS/Android device:
# 1. Open Capacitor DevTools
# 2. Enable performance timeline
# 3. Record interaction:
#    - Tap game cell
#    - Measure: tap-to-visual-feedback time
# 4. Target: <100ms per interaction
```

### Performance Targets (Capacitor Deployment)

| Metric | Target | Status | Notes |
|--------|--------|--------|-------|
| App Launch | <3s (including splash) | TBD | Single-threaded JS render |
| Move Response | <100ms (tap to board update) | TBD | DOM paint latency |
| Memory Peak | <50MB (mid-range Android) | TBD | Includes WebView overhead |
| Battery Drain | <1% per hour of play | TBD | Measure on Pixel 6 |
| Gesture Latency | <50ms (swipe/long-press) | TBD | Touch event → callback |

### Measurement Procedure

**iOS Performance Profiling**:
```bash
# 1. Open Simulator / connect real device
pnpm cap:open:ios

# 2. In Xcode > Debug Navigator > CPU + Memory
# 3. Play game for 2 minutes
# 4. Monitor:
#    - CPU usage peak (should <40% on move)
#    - Memory growth (should <10MB over 2 min)
# 5. Record metrics in DEPLOYMENT-CHECKLIST.md
```

**Android Performance Profiling**:
```bash
# 1. Deploy to Pixel device
pnpm cap:run:android

# 2. Open Chrome URL chrome://inspect
# 3. Enable performance timeline in Chrome DevTools
# 4. Record:
#    - Main thread activity (should clear <100ms per move)
#    - Memory heap (should not exceed 50MB)
#    - Frame drops (should 0 during interaction)
```

---

## 3. App Suspension & Lifecycle Management

**Requirement**: App must handle iOS/Android suspend/resume gracefully.

**Capacitor Lifecycle Events**:
```tsx
import { App as CapacitorApp } from '@capacitor/app'

// Listen to app suspend
CapacitorApp.addListener('pause', () => {
  console.log('[Lifecycle] App paused - persisting state')
  storageService.saveGameState(gameState)
  storageService.saveStats(stats)
  // Stop any animations or timers
  stopAnimationTimer()
})

// Listen to app resume
CapacitorApp.addListener('resume', () => {
  console.log('[Lifecycle] App resumed - restoring state')
  const savedGame = storageService.loadGameState()
  if (savedGame) setGameState(savedGame)
  // Resume animations
  startAnimationTimer()
})

// Handle back button (physical Android button)
CapacitorApp.addListener('backButton', () => {
  if (isPlayingGame) {
    // Show pause menu instead of closing app
    setPaused(true)
  } else {
    // Close app (or navigate back)
    CapacitorApp.exitApp()
  }
})
```

**Testing**:
```
Test Case: Suspend During Game
- Tap home button (or swipe to app switcher)
- Wait 5 seconds
- Reopen app
- Expected: Game board identical to when suspended
- Actual: [Test must verify]

Test Case: Pause → Settings → Resume
- In game, open settings overlay
- Change theme or sound
- Close settings, resume game
- Expected: Settings persisted, game state unchanged
- Actual: [Test must verify]

Test Case: Force Close
- Kill app from app switcher (hold ≥1 second)
- Reopen app
- Expected: Resume to last saved game state
- Actual: [Test must verify]
```

---

## 4. Native Feature Integration Testing

### Haptic Feedback (Optional but Recommended)

**Implementation**:
```tsx
import { Haptics } from '@capacitor/haptics'

// Light feedback on valid move
const handleMoveClick = async (move: Move) => {
  try {
    await Haptics.vibrate({ duration: 50 })
  } catch (e) {
    // Fallback on unsupported devices (graceful)
    console.debug('[Haptics] Not available', e)
  }
  
  const newState = makeMove(gameState, move)
  setGameState(newState)
}

// Medium feedback on invalid move
const handleInvalidMove = async () => {
  try {
    await Haptics.vibrate({ duration: 100 })
  } catch (e) {
    // Ignore on unsupported devices
  }
  showErrorMessage('Invalid move')
}
```

**Testing**:
- [ ] Haptics work on physical iOS device (simulator doesn't support)
- [ ] Haptics work on Android API 26+ (vibration permission granted)
- [ ] App doesn't crash if haptics unavailable (graceful)
- [ ] Haptic strength is noticeable but not annoying

---

## 5. Store Submission Preparation

### Pre-Submission Checklist

**App Store (iOS)**:
- [ ] TestFlight beta version deployed (internal testers)
- [ ] App name: "Nim" (or official name)
- [ ] Bundle ID: `com.scottreinhart.nim` (matches provisioning profile)
- [ ] Version: `1.0.0` (semantic versioning)
- [ ] Build number: Increment on each submission
- [ ] Privacy policy: Written and hosted
- [ ] App screenshots: All 5 device sizes at minimum
- [ ] Description: Clear, engaging summary
- [ ] Keywords: "game, strategy, nim, ai, puzzle"
- [ ] Support email: Provided + monitored
- [ ] Age rating: Self-assessed (typically 4+)
- [ ] Export compliance: No encryption (default yes)

**Google Play (Android)**:
- [ ] Play Console account created ($25 once)
- [ ] Signed APK/AAB generated
- [ ] App name: "Nim" (matches iOS for consistency)
- [ ] Package name: `com.scottreinhart.nim`
- [ ] Version code: Increment on each release
- [ ] Version name: `1.0.0` (semantic versioning)
- [ ] Privacy policy: Linked from Play Console
- [ ] App screenshots: Minimum 2, recommended 8
- [ ] App description: Same as iOS for consistency
- [ ] Content rating: Self-assessed
- [ ] Device categories: Phone, Tablet
- [ ] Target API: Android 12+ (API 31+)
- [ ] Permissions justified: Only location (if multiplayer future)

---

## 6. Accessibility Testing (WCAG 2.1 AA)

**Validation Checklist**:
- [ ] All buttons/touches have visible focus state
- [ ] Game board tile focus is clear (border or highlight)
- [ ] Text contrast meets WCAG AA minimum (4.5:1 for body, 3:1 for large text)
- [ ] Screen reader tested (VoiceOver on iOS, TalkBack on Android)
  - [ ] Game state announced ("Move 1 of 5, board state: empty")
  - [ ] Invalid move announced clearly
  - [ ] Settings accessible via voice
- [ ] Text sizing: 1.2x and 1.5x zoom tested
- [ ] Reduced motion: Animations disabled on iOS "Reduce Motion" setting
  - [ ] Game still playable without animations
  - [ ] smooth scrolls become instant (respects prefers-reduced-motion)

---

## 7. Final Deployment Gate

### Code Checklist
```bash
pnpm validate              # Lint + format + typecheck + build
pnpm typecheck             # No TypeScript errors
pnpm lint                  # No linting violations
pnpm build                 # Production build successful
```

### Manual Verification
- [ ] No console errors (`console.error` calls)
- [ ] No console warnings (`console.warn` calls)
- [ ] Safe-area padding visible on notched device
- [ ] All gestures responsive (swipe, long-press, tap)
- [ ] Stats persist correctly across app close/reopen
- [ ] Theme/setting changes persist
- [ ] Offline play works (no network access required)
- [ ] Performance baseline met (app launch <3s, move <100ms)

### Device Testing (Minimum)
- [ ] iOS: iPhone 14/15 (notch)
- [ ] iOS: iPhone SE (home button)
- [ ] Android: Pixel 7+ (gesture nav)
- [ ] Android: Large screen tablet (if supporting)

### Documentation
- [ ] TICTACTOE-DEPLOYMENT-LOG.md updated with test results
- [ ] DEPLOYMENT-CHECKLIST.md signed off by reviewer
- [ ] ROLLOUT-SCHEDULE.md ready (app store submission dates)

---

## 8. Troubleshooting Common Mobile Issues

### Issue: Touch Events Don't Fire on Android
**Solution**: Use Pointer Events API instead of Touch-only
```tsx
// ❌ BAD (touch only)
onTouchStart={handleTouchStart}

// ✅ GOOD (covers all input types)
onPointerDown={handlePointerDown}
```

---

### Issue: Safe-Area Padding Not Applied (iOS)
**Diagnosis**:
- Verify safe-area CSS is in root App container, not nested
- Test with `env()` function directly: `padding-top: env(safe-area-inset-top);`
- Verify on real device (simulator sometimes incorrect)

```tsx
// ✅ Correct in root App:
<div style={{
  paddingTop: 'env(safe-area-inset-top)',
  paddingLeft: 'env(safe-area-inset-left)',
  paddingRight: 'env(safe-area-inset-right)',
  paddingBottom: 'env(safe-area-inset-bottom)',
}}>
  {/* All content inside safe area */}
</div>
```

---

### Issue: Game State Lost on App Close (Android)
**Solution**: Ensure `storageService.saveGameState()` called immediately after move
```tsx
const handleMove = (move: Move) => {
  const newState = makeMove(gameState, move)
  setGameState(newState)
  storageService.saveGameState(newState) // Must be synchronous
}
```

Avoid deferring save to useEffect with dependency array (may not run on close).

---

### Issue: Haptic Feedback Crashes on iOS Simulator
**Solution**: Add try-catch (simulator doesn't support haptics)
```tsx
try {
  await Haptics.vibrate({ duration: 50 })
} catch (e) {
  // Simulator doesn't support haptics, gracefully ignore
}
```

Test on real iOS device instead.

---

## Governance Authority

**These requirements override project feature timelines.** All code must pass this gate before Capacitor deployment.

**Related Governance**:
- § 12 (Responsive Design): Use only `useResponsiveState()` hook
- § 23 (Accessibility): WCAG 2.1 AA minimum
- § 25 (Performance): Measurement-led optimization (real device testing)
- § 27 (Mobile Gestures): Semantic action model for swipe, long-press

---

**Last Updated**: 2026-03-14  
**Review Frequency**: Before each Capacitor deployment  
**Approval**: Code review gate (cannot merge without passing this checklist)
