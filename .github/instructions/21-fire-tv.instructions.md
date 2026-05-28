# 📺 Amazon Fire TV Web App Instructions

> **Scope**: Fire TV web app and hybrid app behavior, remote/controller input, lifecycle handling, debugging, packaging/testing, and cache/security guidance.
> Subordinate to `AGENTS.md` § 0 (Non-Negotiable Rules), § 19 (Input Controls), and § 32 (Amazon Fire TV Web App Governance).
> **BASELINE**: Before Fire TV work, read `AGENTS.md` § 0. Preserve remote-first UX and focus behavior. Quality gates mandatory.

---

## 1. Platform Model

Fire TV supports:

- **Web apps** (hosted or packaged ZIP)
- **Hybrid apps** (native shell using Android/Amazon WebView)

Prefer existing architecture and semantic-action input model; do not create Fire-TV-only parallel input systems.

---

## 2. Input and Navigation (Remote-First)

Mandatory key mappings for Fire TV compatibility:

- Left: `37`
- Up: `38`
- Right: `39`
- Down: `40`
- Select/Confirm: `13`
- Back: `4`
- Play/Pause: `179`
- Rewind: `227`
- Fast Forward: `228`

Non-capturable for third-party web apps:

- Home
- Menu
- Voice Search

Rules:

- Every interactive element must be reachable using directional navigation.
- Preserve visible focus at all times in TV mode.
- Back must always unwind context (modal -> menu -> screen -> exit route).
- Handle Play/Pause for media, and pause/resume gameplay where relevant.

---

## 3. Focus, Lifecycle, and Voice Search Interruption

Fire TV apps must handle focus changes explicitly:

- `pause` / `resume` events (Amazon platform events)
- `visibilitychange` (`document.hidden` / `webkitHidden`)

Required behavior:

- Pause/mute audio and gameplay loops when app is backgrounded or voice-search overlay interrupts focus.
- Restore UI to a coherent focus state on resume.
- For media playback, ensure UI state (controls/playback indicator) is correct after resume.

---

## 4. Display and UX Baseline

- Target **1080p** (`1920x1080`) as primary layout.
- Keep TV-specific focus visuals explicit; do not rely on browser defaults.
- If migrating from 720p, scale or redesign to 1080p-first rather than preserving undersized surfaces.
- Preserve 10-foot UI readability: large text, high contrast, remote-navigable control density.

---

## 5. Fire TV Testing Workflow

Use **Web App Tester** for Fire TV validation:

1. Install Web App Tester on device.
2. Connect with ADB (USB or Wi-Fi).
3. Load hosted URL or packaged ZIP.
4. Run app and test remote/controller input flows.

Debug with Chrome DevTools:

- Run app in Web App Tester
- Use `chrome://inspect` from development machine
- Verify focus transitions, key handling, media pause/resume, and runtime errors

---

## 6. Packaging Modes

- **Hosted app**: assets served remotely, easier rapid updates.
- **Packaged app**: ZIP bundle, better offline/local performance.
- **Hybrid app**: native wrapper + WebView, adds platform-native capability access.

Do not duplicate app logic across modes; keep one core app path and adapt platform integration points only.

---

## 7. Cache and Sensitive Data Guidance

For sensitive/authenticated responses, use cache headers:

- `Cache-Control: no-store` (preferred for sensitive responses)
- `Cache-Control: no-cache`
- `Pragma: no-cache` (backward compatibility)

When Amazon web app cache APIs are available, you may clear app-scoped cache/cookies on logout:

- `amzn_wa.Cache.clearAppCache()`
- `amzn_wa.Cache.clearAllCookies()`
- `amzn_wa.Cache.clearSessionCookies()`
- plus related form/history methods

Always guard calls behind platform readiness checks and existence checks.

---

## 8. Copilot/Agent Implementation Checklist (Fire TV)

- [ ] Input mapping supports Fire TV remote/controller keys (`37/38/39/40/13/4/179/227/228`)
- [ ] Home/Menu/Voice Search not relied on for app behavior
- [ ] Focus never disappears in TV surfaces
- [ ] Back behavior is predictable and consistent across app states
- [ ] Audio/gameplay pauses on focus loss and resumes cleanly
- [ ] 1080p layout validated for 10-foot UI readability
- [ ] Web App Tester + `chrome://inspect` debugging workflow used for Fire TV regressions
- [ ] Sensitive responses use no-store/no-cache strategy where applicable

---

## 9. References

- Fire TV Getting Started with Web Apps
- Fire TV Hybrid Apps Overview
- Fire TV Supporting Controllers in Web Apps
- Fire TV Customizing Your Web App
- Fire TV Migrating Your Web App
- Fire TV Web App HTTP Caching
- Fire TV Web App Tester
- Fire TV Debugging with Chrome DevTools

