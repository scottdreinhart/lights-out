# Quick Decision Card — Cross-Platform Tech Strategy

**File Path**:  
- Windows: `D:\src\game-platform\TECH-STRATEGY-QUICK-DECISION-2026-04-13.md`  
- Linux/WSL: `/mnt/d/src/game-platform/TECH-STRATEGY-QUICK-DECISION-2026-04-13.md`

---

## TL;DR: Three Opportunities, One Per Category

### 🚀 DESKTOP BUILD TOOLS

**Electron-Vite** ✅ **DO THIS NOW**

```
Current:  Electron + manual Vite config (verbose)
New:      electron-vite wrapper (cleaner, HMR better)
Benefit:  Faster development, smaller config, instant HMR
Effort:   2-3 hours per game (template → migrate)
Risk:     Low (backward compatible)
Timeline: 1-2 weeks to template + migrate test apps
```

**Why**: Electron-Vite solves the exact problem you have (Electron + Vite confusion). Direct upgrade, no risks.

---

### 🎯 SHARED UI COMPONENTS

**Gluestack UI** ✅ **VALIDATE THIS WEEK, THEN DECIDE**

```
Current:  52 games × 2 shells = 104 UI implementations (duplicated)
New:      52 games × Gluestack (React + React Native unified)
Benefit:  2x code reuse, accessibility built-in, responsive native
Effort:   1-2 week validation pilot
Risk:     Medium (need to validate 6 critical questions)
Timeline: 1 week pilot → decision → 6 weeks rollout (if yes)
```

**Why**: Gluestack is the only component library that **supports both React AND React Native with the same components**. Matches your dual-shell strategy perfectly.

**Critical Questions to Validate:**
1. Can Gluestack handle TV + D-Pad navigation? (TBD)
2. Can you theme per game? (Needs testing)
3. What's the RN bundle size impact? (Measure)
4. WCAG AA keyboard navigation + semantics? (Verify)
5. Responsive 5-tier breakpoints working? (Likely yes)
6. Startup/performance acceptable? (Benchmark)

**Next Action**: Create minimal test app this week → answer 6 questions → bring recommendations next week.

---

### 🔬 ALTERNATIVE DESKTOP RUNTIME

**Tauri v2** 🔬 **MONITOR Q3 2026**

```
Current:  Electron (200MB+ bundles, proven, works)
Alternative:  Tauri v1 (600KB bundles, Rust backend)
Upcoming: Tauri v2 with mobile bundler (Q3 2026)
Fit:      Strong for desktop; mobile story incomplete now
Risk:     Rust requirement breaks JS-only workflow
Timeline: Wait for v2 release; reassess then
```

**Why Not Now:**
- Electron works fine for games (no blocker)
- Mobile bundler not ready (core to your strategy)
- Rust requirement risky without team experience
- v2 coming soon; better to wait for complete picture

**Why Monitor:**
- Bundle size 99.7% smaller interesting long-term
- Security (Rust backend) valuable
- Low-risk to keep on radar
- Can pivot Q3 2026 if performance becomes critical

**Action**: Quarterly check-ins; no implementation now.

---

## Stack Comparison

| Capability | Current | With Electron-Vite | With Gluestack | + Tauri Alt |
|-----------|---------|-------------------|----------------|------------|
| **Desktop Build** | Electron + Vite | ✅ Cleaner | (no change) | 600KB bundles |
| **Shared UI (Web)** | Custom atoms | (no change) | ✅ Gluestack | ✅ Gluestack |
| **Shared UI (Mobile)** | Capacitor + custom | (no change) | ✅ Gluestack | (no change) |
| **Responsive** | Custom 5-tier | (no change) | ✅ Built-in | ✅ Built-in |
| **Accessibility** | Per-game | (no change) | ✅ Built-in | ✅ Built-in |
| **Mobile Platform** | Capacitor | (no change) | Capacitor | (pending) |
| **Desktop Performance** | Electron | Same | Same | Better (pending) |

---

## Decision Timeline

```
THIS WEEK                    Next Week              Late April          May
Apr 13                       Apr 20                 Apr 27              May 11
│                            │                      │                   │
├─ Gluestack pilot START     └─ Pilot COMPLETE      Pilot games         Rollout DECISION
│  (8-16 hours)               (report findings)     in progress         (proceed or refine)
│
├─ Electron-Vite plan        Electron-Vite READY
│  (2 hours)                 for opt-in adoption
│
└─ Tauri monitoring START
   (1 hour)
```

---

## Your Decision Gates

### Gate 1: Electron-Vite (Immediate) ✅
- **Question**: Is cleaner Electron build config worth 1-2 weeks effort?
- **Data Needed**: None (clear case)
- **Recommendation**: YES → Create template now
- **Decision Point**: This sprint (start immediately)

### Gate 2: Gluestack (Next Week) ⏳
- **Question**: Can Gluestack unify UI across 52 games + 2 shells?
- **Data Needed**: Validation pilot results (6 questions)
- **Recommendation**: TBD (after pilot report)
- **Decision Point**: Next week (after pilot findings)

### Gate 3: Tauri (Q3 2026) 🔬
- **Question**: Is Tauri v2 viable as desktop alternative?
- **Data Needed**: v2 release status + team capability assessment
- **Recommendation**: Monitor; reassess Q3
- **Decision Point**: Q3 2026 (when v2 ships)

---

## Immediate Action Items

### Today (Apr 13)
- [ ] Read: `CROSS-PLATFORM-TECH-STRATEGY-2026-04-13.md` (full analysis)
- [ ] Decide: Should we pursue these three paths?

### This Week (Apr 13-19)
- [ ] **Start Gluestack Validation**
  - [ ] Create minimal Gluestack + React + React Native test app
  - [ ] Test 6 critical questions
  - [ ] Measure RN bundle impact
  - [ ] Document findings
- [ ] **Plan Electron-Vite Migration**
  - [ ] Review electron-vite documentation (2 hours)
  - [ ] Design template structure
  - [ ] Start migration draft

### Next Week (Apr 20-26)
- [ ] **Gluestack Validation Complete**
  - [ ] Present pilot findings (pass/fail on 6 questions)
  - [ ] Make go/no-go decision
  - [ ] If YES: Start integration layer
  - [ ] If NO: Continue custom UI system
- [ ] **Electron-Vite Template Ready**
  - [ ] Create `_templates/electron-vite-app/`
  - [ ] Migrate test game as PoC
  - [ ] Document pattern

### Late April (Apr 27-May 3)
- [ ] **If Gluestack validated**: Start Phase 3 pilot games
- [ ] **Electron-Vite available** for opt-in adoption across games
- [ ] Weekly check-ins on progress

### May (Ongoing)
- [ ] Gluestack rollout to 1-2 pilot games
- [ ] Collect metrics (bundle size, startup time, DX)
- [ ] Tauri quarterly monitoring (passive)

---

## Why These Three Matter

| Tech | Why It Matters | What Breaks If Not Done |
|-----|----------------|------------------------|
| **Electron-Vite** | Better DX for developers | Nothing breaks; future setups harder to maintain |
| **Gluestack** | UI duplication across 52 games + 2 shells | Continued custom UI maintenance; slow feature velocity |
| **Tauri** | Future desktop option if perf critical | Nothing (Electron works); just limits options |

---

## Success Criteria

### Electron-Vite Success
- ✅ Template created and documented
- ✅ Test game migrated + working
- ✅ HMR + sourcemaps verified
- ✅ Other games can opt-in

### Gluestack Success
- ✅ Pilot validation complete
- ✅ 4+ of 6 critical questions answered YES
- ✅ Integration layer designed
- ✅ 1-2 pilot games showing 50%+ code reuse vs custom UI
- ✅ Bundle size impact acceptable (<10% increase)

### Tauri Success
- ✅ Quarterly monitoring in place
- ✅ Q3 2026: v2 status clear
- ✅ Decision point with team (expand or maintain Electron)

---

## Key Reminders

- **Gluestack is NOT a requirement** — It's an opportunity to reduce code duplication
- **Electron-Vite is upgrade-only** — Existing code keeps working; just cleaner configuration
- **Tauri is strategic inventory** — Keep options open; decide when v2 ships
- **Your current approach works** — These are optimizations, not emergency fixes
- **Node 24.14.1 is solid** — Just fixed this; ready for any of these techs

---

## Reference

- **Full Analysis**: See `CROSS-PLATFORM-TECH-STRATEGY-2026-04-13.md` (20+ pages)
- **Session Context**: `PROJECT-STATUS-MODERNIZATION-2026-04-13.md`
- **Platform Strategy**: `AGENTS.md` § 12, § 17
- **Current Status**: 52 games ✅ | 37 packages ✅ | Node 24.14.1 ✅

---

**Next Step**: Review this card + full strategy doc, then decide: Should we move forward with these three opportunities?

