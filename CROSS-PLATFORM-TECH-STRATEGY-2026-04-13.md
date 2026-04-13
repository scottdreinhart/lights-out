# Cross-Platform Technology Strategy — April 13, 2026

**File Path**:  
- Windows: `D:\src\game-platform\CROSS-PLATFORM-TECH-STRATEGY-2026-04-13.md`  
- Linux/WSL: `/mnt/d/src/game-platform/CROSS-PLATFORM-TECH-STRATEGY-2026-04-13.md`

---

## Executive Summary

Three emerging technologies can improve your platform strategy:

1. **Electron-Vite** — Drop-in build tool improvement for Electron ✅ **RECOMMEND NOW**
2. **Gluestack UI** — Unified component library for React + React Native ✅✅ **RECOMMEND AFTER PILOT**
3. **Tauri** — Alternative desktop runtime (Rust-based) 🔬 **MONITOR FOR Q3 2026**

---

## Your Current Platform Strategy

### Core Platform Stack (Live & Operational)
```
Architecture:     React Web + React Native (dual first-class shells)
Build System:     Vite (web) + Metro (RN)
Package Manager:  pnpm ONLY (24 projects)
Quality Gates:    ESLint + Prettier + Vitest + Playwright
Node Runtime:     24.14.1 (just aligned in commit c6b7ff6)
Packaging:        Electron (desktop) + Capacitor (mobile)
UI System:        Custom atoms/molecules/organisms per game
Games:            52 independent applications
Packages:         37 shared utilities & systems
Responsiveness:   5-tier architecture (375px-1800px)
Accessibility:    WCAG 2.1 AA target
Inputs:           Semantic action model (keyboard-first, TV-compatible)
```

### Strategic Tenets
- **Shared-core-first** — Business logic reusable; shell-specific separation
- **Reuse-aggressively** — Never duplicate across 52 games
- **Best-experience-first** — Don't force web wrapper when native better
- **Multi-platform-native** — Each shell optimized for its context
- **pnpm-absolute** — No npm/yarn drift

---

## Technology Analysis

### 1. ELECTRON-VITE: Immediate Upgrade Path ✅

#### What It Solves
Electron development is complex:
- Main process (Node.js) + Renderer (browser) dual-environment
- Hot reloading for both processes
- Pre-loader script setup
- Asset optimization
- Source code protection

**electron-vite consolidates this** into a single configuration.

#### Fit with Your Strategy
| Criterion | Rating | Details |
|-----------|--------|---------|
| **Stack Alignment** | ✅ Perfect | Built on Vite (your foundation) |
| **Node Version** | ✅ Perfect | Requires 20.19+, 22.12+ (you have 24.14.1) |
| **Package Manager** | ✅ Works | npm install but compatible with pnpm |
| **Learning Curve** | ✅ Low | Migration from Electron + Vite is straightforward |
| **Team Impact** | ✅ Improves | Better HMR, cleaner config |
| **Production Readiness** | ✅ High | Used by production apps |

#### Key Features
- **Instant HMR** — Hot reload for renderer instantly
- **Hot reload for main** — Main process auto-reload
- **Multi-threading** — Web Worker support
- **Source protection** — V8 bytecode compilation
- **Clean config** — Single `electron.vite.config.js`

#### Integration Effort
```
Scope:           All games using Electron (test/examples)
Effort:          2-3 hours per game (once template created)
Risk:            Low (backward compatible, cleaner config)
Breaking Change: None (existing code works)
Rollback:        Simple (revert config, keep source)
Timeline:        1-2 weeks to template + migrate test apps
```

#### Migration Path
```javascript
// Before (manual Vite + Electron)
// vite.config.js + electron/main.js + complex build script

// After (electron-vite)
// electron.vite.config.js (all-in-one)
export default {
  main: {
    /* Node.js main process config */
  },
  preload: {
    /* Preload script config */
  },
  renderer: {
    /* Browser renderer config */
  }
}
```

#### Recommendation
**✅ ADOPT IMMEDIATELY**
- Create electron-vite template in `_templates/electron-vite-app/`
- Migrate `apps/lights-out` first (reference)
- Document in `docs/ELECTRON-VITE-MIGRATION.md`
- Offer as opt-in for other games

---

### 2. GLUESTACK UI: Strategic Shared Component System ✅✅

#### What It Offers
Pre-built UI component library with dual platform support:
- **30+ components** (Button, Input, Select, Checkbox, Toast, etc.)
- **React support** ✅
- **React Native support** ✅ ⭐ KEY
- **Responsive by default** (mobile-first, scales to desktop)
- **Accessibility built-in** (WCAG semantics, keyboard nav)
- **Themeable** (CSS-in-JS with variable system)

#### Strategic Opportunity

**Current State:**
```
52 Games × 2 Shells × Custom UI = 104 UI implementation efforts
├─ React Web UI:     Custom atoms/molecules/organisms
├─ React Native:     Duplicate or missing
└─ Responsive:       Per-game responsibility
```

**With Gluestack:**
```
52 Games × Gluestack Components (shared) × 2 Shells = Unified
├─ React Web:     Gluestack components
├─ React Native:  Same Gluestack components (RN version)
└─ Responsive:    Native (5-tier ready)
Benefits:
  • 2x code reuse immediately
  • Accessibility out-of-box
  • Responsive patterns consistent
  • Theme inheritance per game
  • Mobile parity with desktop
```

#### Fit with Your Strategy
| Criterion | Rating | Details |
|-----------|--------|---------|
| **Dual Shell Support** | ✅✅ Excellent | React + React Native (your exact need) |
| **Responsive** | ✅ Good | Mobile-first, desktop patterns built in |
| **Accessibility** | ✅ Good | WCAG semantics included |
| **TV Support** | ⚠️ Needs Testing | D-Pad navigation untested with you |
| **Customization** | ⚠️ Medium | Theme override per game possible but needs validation |
| **Bundle Size** | ⚠️ Unknown | RN impact unknown (critical for games) |
| **Learning Curve** | ⚠️ Medium | Different prop API from raw React |
| **Community** | ✅ Active | Recent updates, good support |

#### Key Components Available
- **Forms** — Input, Select, Checkbox, Radio, TextArea, Switch
- **Buttons** — Button, ButtonGroup, FAB
- **Data Display** — Badge, Avatar, Table concepts
- **Feedback** — Toast, Alert, Spinner
- **Layout** — Box, VStack, HStack, Spacer
- **Overlays** — Modal, Popover, Tooltip
- **Navigation** — Tabs (not ideal for TV?)

#### Critical Questions (Needs Pilot Validation)
1. **TV Input Handling**: Can D-Pad + Confirm work with Gluestack focus system?
2. **Game Theming**: Can you theme differently per game? (e.g., Sudoku theme vs Bingo theme)
3. **Performance**: RN bundle size impact on game startup times?
4. **Customization**: Can you replace Gluestack button shape/color without forking?
5. **Accessibility**: Verified WCAG AA on mobile + keyboard navigation?
6. **Native Modules**: Integration with Capacitor plugins smooth?

#### Implementation Strategy

**Phase 1: Validation (1 week)**
```
1. Create minimal test app: Gluestack + React + React Native
2. Test components:
   ├─ Basic (Button, Input, Text)
   ├─ Forms (Select, Checkbox, TextArea)
   ├─ Accessibility (keyboard nav, focus trap)
   ├─ Responsive (5-tier breakpoints)
   └─ TV/Custom Input (if possible)
3. Test theming: Override colors per game?
4. Measure: RN bundle size delta
5. Decision: Proceed or refine approach
```

**Phase 2: Integration Layer (2 weeks)**
```
If Phase 1 succeeds:
├─ Create `packages/ui-gluestack/` wrapper
├─ Re-export Gluestack components
├─ Add game-specific theme system on top
├─ Document patterns
└─ Build adapter for your existing atoms/molecules
```

**Phase 3: Pilot Games (2 weeks)**
```
Rebuild 1-2 simple games:
├─ Rock-Paper-Scissors (minimal UI)
├─ Or Memory (simple grid + buttons)
Compare metrics:
├─ Bundle size
├─ Development time
├─ Visual parity with original
└─ Responsive performance
```

**Phase 4: Rollout (8+ weeks)**
```
Incremental adoption across 52 games:
├─ Month 1: 5 games
├─ Month 2: 10 games
├─ Month 3: 20 games
├─ Month 4: Remaining 17 games
Keep fallback: Custom atoms/molecules available
```

#### Recommendation
**✅ RECOMMEND AFTER VALIDATION PILOT**

1. **This week**: Create pilot validation app
2. **Next week**: Present findings (pass/fail on 6 critical questions)
3. **If pass**: Proceed with integration layer
4. **If partial**: Adapt approach (e.g., Gluestack atoms only, RN separate)
5. **If fail**: Continue custom UI system (current approach fine)

---

### 3. TAURI: Alternative Desktop Runtime (Strategic Monitoring) 🔬

#### What It Is
Rust-based desktop framework with OS-native renderers (WebKit/WebView2).

#### Technical Comparison

| Aspect | Electron | Tauri v1 | Tauri v2 (Roadmap) |
|--------|----------|----------|--------------------|
| **Bundle Size** | 200MB+ | <600KB | <600KB |
| **Memory (Idle)** | 150-300MB | 50-100MB | 50-100MB |
| **Backend Language** | Node.js | Rust | Rust |
| **API Surface** | JS native | IPC commands | IPC commands |
| **Desktop Platforms** | Win/Mac/Linux ✅ | Win/Mac/Linux ✅ | Win/Mac/Linux ✅ |
| **Mobile** | Capacitor required | External solution | Bundler coming Q3 |
| **Maturity** | Established | Growing | Beta/Roadmap |
| **Team Requirement** | JS + Electron | JS + Rust | JS + Rust |
| **Learning Curve** | Low | High | High |

#### Fit with Your Strategy
| Criterion | Rating | Details |
|-----------|--------|---------|
| **React Compatibility** | ✅ Yes | Any frontend works ("brownfield") |
| **Vite Support** | ✅ Yes | Not built-in; requires manual setup |
| **pnpm Compatible** | ✅ Yes | JavaScript parts only |
| **Rust Requirement** | ❌ Hard | Your team is JS-first |
| **Mobile Story** | ❌ Not Ready | Roadmap only (Q3 2026+) |
| **TV Support** | ❌ Unclear | No documented patterns |
| **Production Flexibility** | ⚠️ Medium | Different debugging, deployment model |
| **Exit Strategy** | ⚠️ Hard | Rebuilding to Electron non-trivial |

#### Strengths (vs. Electron)
- **Bundle size 99.7% smaller** (600KB vs 200MB)
- **Memory efficient** (1/3 of Electron)
- **Security-first** (Rust backend, sandboxed)
- **OS-native rendering** (WebKit/WebView2, hardware accelerated)
- **Self-update built-in**
- **Smaller attack surface** (less code = fewer bugs)

#### Weaknesses (vs. Electron)
- **Rust requirement** (breaks JS-only workflow)
- **Smaller ecosystem** (fewer plugins than Electron)
- **Mobile bundler not ready** (roadmap only, Q3 2026)
- **Different architecture** (IPC model different from Node.js)
- **Less established** (community smaller, fewer SO answers)
- **Harder debugging** (mixed Rust/JS stack)

#### When Tauri Makes Sense
```
IF bundle_size OR memory_footprint IS critical_blocker
  AND team_can_learn_Rust
  AND 6month_wait_for_mobile_acceptable
  THEN consider Tauri for desktop alternative
```

#### Strategic Recommendation: Monitor, Don't Adopt Yet

**Why Not Now:**
1. Electron works for your use case (games)
2. Rust requirement breaks JS-first team
3. Mobile bundler not ready (core part of your dual-shell strategy)
4. Tauri v2 (with mobile) ships Q3 2026; reassess then

**Why Monitor:**
1. Bundle size could matter for 52 games at scale
2. Future mobile option interesting
3. Rust backend security benefits valuable long-term
4. Low-risk to keep on radar

#### Monitoring Plan

**Quarterly Review Points:**
```
Q2 2026: Tauri v2 beta launch?
         ↓ Assess: Mobile bundler progress?
Q3 2026: Tauri v2 release candidate
         ↓ Test: Build 1 game with v2
Q4 2026: Production-ready v2
         ↓ Decision: Expand experimental to 10% of games?
```

**Pilot Decision Gate (If Attempted):**
```
Pick 1 game (lowest complexity):
├─ Rock-Paper-Scissors? (minimal UI)
├─ Rebuild with Tauri v1 or v2 depending on timing
├─ Compare metrics:
│  ├─ Bundle size
│  ├─ Startup time
│  ├─ Memory profile
│  ├─ Development experience
│  └─ Team feedback
└─ Decision: Keep as alternative or abandon
```

#### Recommendation
**🔬 MONITOR ONLY** (no adoption now)

1. Add to tech radar
2. Watch Tauri v2 release timeline
3. Q3 2026: Reassess after v2 ships
4. Optional: Build 1 experimental game if time permits
5. Keep Electron as primary (proven, works well)

---

## Integration Roadmap

### Recommended Adoption Sequence

```
RIGHT NOW (This Week)
├─ Electron-Vite evaluation (1-2 hours)
├─ Create integration plan
└─ Start migration template

NEXT WEEK
├─ Create Gluestack validation pilot (8-16 hours)
├─ Test 6 critical questions
├─ Make Phase 1 decision
└─ Report findings

IF GLUESTACK VALIDATION PASSES
├─ Build integration layer (packages/ui-gluestack/)
├─ Implement adapter for atom/molecule compatibility
├─ Pilot 1-2 games with Gluestack
└─ Timeline: 4-6 weeks to Phase 3

QUARTERLY CHECKPOINTS
├─ Q2 2026: Gluestack rollout progress?
├─ Q3 2026: Tauri v2 available? Assess desktop alternatives
├─ Q4 2026: TV/accessibility validation complete?
└─ 2027: Platform modernization decisions
```

### Timeline Gantt-View

```
Week of Apr 13            Electron-Vite plan + template
                │
Week of Apr 20  │   Gluestack validation pilot
                │   └─ Decision point
                │
Week of Apr 27  │   IF validated:
                │     Gluestack integration layer
                │     └─ Start Phase 3 pilots
                │
Week of May 11  │   Pilot game builds (1-2 games)
                │   └─ Metrics collection
                │
Week of May 25  │   Decision: Proceed rollout or refine
                │
Q2 2026     ┌───┴─ Monitor Tauri v2 progress
            │
Q3 2026     ├─  Tauri v2 available?
            │   Create evaluation game if time permits
            │
Q4 2026     └─  Final modernization decisions for 2027
```

---

## Decision Framework

### Go/No-Go Criteria

#### For Electron-Vite: **YES (Proceed)**
- ✅ Improves DX without risk
- ✅ Aligns perfectly with Vite strategy
- ✅ Node 24.14.1 compatible (just fixed)
- ✅ Low effort (2-3 weeks with template)
- **Decision**: Proceed immediately

#### For Gluestack: **PILOT FIRST**
| Question | Pass Criteria | Action |
|----------|---------------|--------|
| TV/D-Pad support? | Yes or adaptable | Proceed if yes/Yes; modify if adaptable |
| Theming per game? | Yes with <2% LoC overhead | Proceed; document pattern |
| Bundle size impact? | <10% increase per game | Proceed; optimize if needed |
| WCAG AA compliant? | Yes (keyboard nav + semantics) | Proceed; verify on your games |
| RN performance? | Startup time acceptable | Proceed; measure baseline |
| **Overall** | 4-5 pass / 6 | **PROCEED TO PHASE 2** |

#### For Tauri: **WAIT UNTIL Q3 2026**
- ⏳ Mobile bundler not ready
- ⏳ Rust requirement unproven with team
- ⏳ Electron works; no urgent blocker
- **Decision**: Revisit Q3 2026 after v2 ships

---

## Action Items (Next 30 Days)

### PRIORITY 1: Electron-Vite (Immediate)
- [ ] Research electron-vite configuration (2 hours)
- [ ] Create `_templates/electron-vite-app/` scaffolding
- [ ] Generate `docs/ELECTRON-VITE-MIGRATION.md`
- [ ] Migrate `apps/lights-out/electron` as proof-of-concept
- [ ] Verify: build, HMR, preload scripts all work
- [ ] Test: Node 24.14.1 compatibility
- [ ] Document findings, make available for other games
- **Effort**: 1-2 weeks
- **Owner**: Platform team
- **Success**: Cleaner Electron setup, better HMR

### PRIORITY 2: Gluestack Validation (This Week/Next)
- [ ] Create minimal test app: Gluestack + React + React Native
- [ ] Test 6 critical questions (see above):
  - [ ] TV/D-Pad focus handling
  - [ ] Game-specific theming capability
  - [ ] Bundle size impact (RN)
  - [ ] WCAG AA compliance
  - [ ] Responsive 5-tier support
  - [ ] Keyboard accessibility
- [ ] Measure: RN bundle delta, startup time
- [ ] Create `GLUESTACK-VIABILITY-REPORT.md`
- [ ] Present findings to team (pass/fail decision)
- **Effort**: 8-16 hours (spread over 1-2 weeks)
- **Owner**: UI/component team
- **Success**: Clear go/no-go decision with evidence

### PRIORITY 3: Tauri Monitoring (Passive)
- [ ] Add Tauri v2 release timeline to tech radar
- [ ] Subscribe to Tauri blog/Discord
- [ ] Q3 2026: Reassess when v2 ships
- **Effort**: 0 hours now; 4 hours Q3 2026
- **Owner**: Architect (you)
- **Success**: Stay informed without commitment

---

## Questions to Consider

**For Your Team:**
1. Is bundle size a problem for your games? (Does it affect download rates?)
2. Is Electron performance adequate for your game complexity?
3. What's the TV/custom input requirement strength? (Nice-to-have vs. critical?)
4. Can team maintain Rust if Tauri becomes strategic?
5. How important is UI consistency across 52 games?

**For Platform Architecture:**
1. Should shared UI be Gluestack-first, or gradual migration?
2. Can you fork Gluestack components if customization needed?
3. How does Gluestack theming interact with your per-game theme system?
4. Should Electron-Vite be mandatory or optional for new games?

---

## Reference Materials

### Official Documentation
- **Electron-Vite**: https://electron-vite.org/guide/
- **Tauri v1**: https://v1.tauri.app/
- **Tauri Roadmap**: https://github.com/tauri-apps/tauri/discussions/roadmap
- **Gluestack UI**: https://gluestack.io/ui/docs/home/overview/quick-start

### Related Strategy Docs
- Your Platform Strategy: `AGENTS.md` § 12 (Responsive), § 17 (Mobile-First)
- Current Project Status: `PROJECT-STATUS-MODERNIZATION-2026-04-13.md`
- Architecture Docs: `ARCHITECTURE.md`, `ARCHITECTURE_REVIEW_CHECKLIST.md`
- Build Governance: `.github/instructions/01-build.instructions.md`

### Session Context
- Node.js now: 24.14.1 (aligned in commit c6b7ff6) ✅
- pnpm version: 10.31.0 ✅
- Active games: 52 ✅
- Shared packages: 37 ✅
- Platform shells: React Web + React Native ✅

---

## Summary & Next Steps

| Technology | Decision | Timeline | Effort | Next Step |
|-----------|----------|----------|--------|-----------|
| **Electron-Vite** | ✅ ADOPT | Start now | 1-2 weeks | Create template + migrate test app |
| **Gluestack** | ⏳ PILOT | Start this week | 1-2 weeks | Validation report → decision gate |
| **Tauri** | 🔬 MONITOR | Q3 2026 | Passive | Reassess after v2 launch |

**Your immediate action**: 
1. Start Gluestack validation pilot (this week)
2. Plan Electron-Vite migration (parallel)
3. Report findings next week

This positions you to **make data-driven decisions** on shared UI and build tooling without breaking your core platform.

---

**Document Created**: April 13, 2026  
**Valid Until**: May 13, 2026 (After Gluestack pilot decision)  
**Author**: Platform Analysis  
**Status**: Ready for team review and decision
