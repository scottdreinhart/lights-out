# Core Development Priorities

**Date**: April 29, 2026  
**Status**: Active Platform Development  
**Focus**: Game features, platform capabilities, performance, accessibility

---

## 📊 Current Platform Status

### Completed Games (51 total)

| Category | Count | Status |
|----------|-------|--------|
| Puzzle Games | 8 | ✅ Complete |
| Card Games | 6 | ✅ Complete |
| Dice Games | 15 | ✅ Complete |
| Board Games | 8 | ✅ Complete |
| Arcade Games | 8 | ✅ Complete |
| Real-Time Games | 6 | ✅ Complete |

### Games in Development

| Game | Completion | Category | Key Work |
|------|-----------|----------|----------|
| **Battleship** | 65% | Strategy | AI enhancement, UI completion |
| **Bingo Variants** | 85% | Card | Multiplayer mode, animations |
| Other Games | 90%+ | Various | Refinements, accessibility |

### Platform Architecture

✅ **Complete**:
- CLEAN architecture (domain/app/ui layers)
- React 19 + TypeScript 5.9
- Vite 7 build system
- Comprehensive test framework (Vitest + Playwright)
- ESLint + Prettier quality gates
- Multi-platform support (web, desktop, mobile)

✅ **Standardized**:
- Script standards (220/220 scripts, 100%)
- Test file naming (enforced)
- Component hierarchy (atoms, molecules, organisms)

---

## 🎯 Priority Matrix

### **TIER 1: BLOCKING ISSUES** (Do First)

These are holding up development or user experience.

#### 1.1: Complete Battleship Implementation

**Current Status**: 65% complete  
**What's Done**:
- ✅ Board system (10×10 grid)
- ✅ Ship placement validation
- ✅ Hit/miss detection
- ✅ Basic AI

**What's Missing**:
- ❌ Advanced AI strategies (hunt + target modes)
- ❌ Mobile gesture support for placement
- ❌ Sound effects and animations
- ❌ Performance optimization for large grids

**Effort**: 8-12 hours  
**Impact**: Complete a major 2-player game  
**Blocking**: No, but high-value

---

#### 1.2: Multi-Player Game Support (Foundation)

**Current State**: Single-player only across platform  
**Requirement**: Architecture for local + online multiplayer

**What's Needed**:
- [ ] Game state synchronization protocol
- [ ] Turn/action queuing system
- [ ] Conflict resolution (simultaneous actions)
- [ ] Game state versioning
- [ ] Rollback/undo support

**Scope**: ~20-30 hours (research + implementation)  
**Impact**: Enables competitive games (Battleship, Checkers, etc.)  
**Blocking**: No, but gates multiplayer features

---

### **TIER 2: HIGH-VALUE FEATURES** (Next Sprint)

Features that significantly enhance platform capabilities.

#### 2.1: Performance Optimization

**Current**: Most games render at 60 FPS, but some optimizations possible

**Opportunities**:
- [ ] Memoization of expensive calculations
- [ ] Virtual scrolling for large lists
- [ ] Lazy loading of game assets
- [ ] Bundle size optimization (target <200KB per game)
- [ ] CSS animation performance (transform + opacity only)

**Effort**: 4-6 hours  
**Impact**: Faster load times, smoother gameplay  
**Tools**: Lighthouse, Chrome DevTools, Bundle analyzer

**Target Metrics**:
- FCP < 1.8s (First Contentful Paint)
- LCP < 2.5s (Largest Contentful Paint)
- CLS < 0.1 (Cumulative Layout Shift)

---

#### 2.2: Accessibility Enhancements (WCAG AA → AAA)

**Current**: WCAG 2.1 AA compliant (good baseline)  
**Goal**: Upgrade to AAA (highest standard)

**Gaps to Address**:
- [ ] Keyboard navigation for all games (full coverage)
- [ ] High contrast mode support
- [ ] Screen reader announcements for game events
- [ ] Reduced motion support for animations
- [ ] Focus management in modals/menus
- [ ] Color blindness friendly palettes

**Effort**: 12-16 hours  
**Impact**: Accessible to broader audience, legal compliance  
**Testing**: axe DevTools, WAVE, manual testing

---

#### 2.3: Sound & Music System

**Current**: No audio integration  
**Goal**: Unified audio system with volume/mute controls

**Components Needed**:
- [ ] Audio engine abstraction (Web Audio API wrapper)
- [ ] Sound effect library (UI sounds, game effects)
- [ ] Background music system (per-game themes)
- [ ] Volume control UI
- [ ] Mute on visibility lost
- [ ] Audio settings persistence

**Integration Point**: `@games/audio-engine` package (already exists)

**Effort**: 8-10 hours  
**Impact**: Significantly enhances game feel and immersion

---

### **TIER 3: PLATFORM CAPABILITIES** (Nice to Have)

Enhancements that improve developer experience or user features.

#### 3.1: Offline-First Architecture

**Current**: Online only (with localStorage caching)  
**Enhancement**: True offline support with sync

**What's Needed**:
- [ ] Service Worker optimization
- [ ] Offline game state persistence
- [ ] Sync queue for online actions (when reconnected)
- [ ] Conflict-free replicated data types (CRDT) for sync
- [ ] Battery/memory aware operation

**Effort**: 16-20 hours  
**Impact**: Play games anywhere (planes, trains, etc.)

---

#### 3.2: Game Customization & Theming

**Current**: Fixed themes, limited personalization  
**Enhancement**: Player-driven customization

**Options**:
- [ ] Custom color schemes
- [ ] Custom tile sizes (accessibility)
- [ ] Difficulty adjustment per-game
- [ ] Custom rules/variants
- [ ] Player profiles & preferences

**Effort**: 10-12 hours  
**Impact**: Increased engagement, accessibility

---

#### 3.3: Analytics & Telemetry

**Current**: Basic stats tracking  
**Enhancement**: Comprehensive usage analytics

**Metrics to Track**:
- [ ] Game play frequency per game
- [ ] Average session duration
- [ ] Win/loss rates
- [ ] Feature usage patterns
- [ ] Performance metrics per game
- [ ] Error/crash rates

**Effort**: 6-8 hours (non-intrusive implementation)  
**Impact**: Data-driven feature decisions

---

### **TIER 4: GAME COMPLETIONS** (Ongoing)

Currently pending games and enhancements.

#### 4.1: Battleship AI Enhancement

**Current**: Basic random + simple targeting  
**Enhancement**: Smarter AI strategies

**Strategies**:
- [ ] Hunt phase: Random targeting until hit
- [ ] Target phase: Systematic search around hit
- [ ] Learning: Track successful patterns
- [ ] Difficulty scaling: Easy/Normal/Hard/Expert

**Effort**: 4-6 hours  
**Impact**: Better opponent, replay value

---

#### 4.2: Bingo Multiplayer & Animations

**Current**: 85% complete, single-player mode  
**Missing**:
- [ ] Local multiplayer (pass-and-play)
- [ ] Card animation on mark
- [ ] Celebration animations on win
- [ ] Sound effects (card mark, bingo call, win)
- [ ] Tournament mode (bracket brackets)

**Effort**: 6-8 hours  
**Impact**: Complete a major game family

---

#### 4.3: Fire-TV Platform Enhancements

**Current**: Basic Fire TV support (§ 32, AGENTS.md)  
**Enhancement**: Full feature parity

**Remaining Work**:
- [ ] Gamepad optimization (10-foot UI)
- [ ] Voice search integration
- [ ] Fire TV app store submission
- [ ] Closed captioning support
- [ ] Performance optimization for Fire TV hardware

**Effort**: 12-16 hours  
**Impact**: Mobile game distribution channel

---

## 📈 Recommended Development Sequence

### **This Week (4-6 hours)**
1. ✅ Complete script standards (DONE)
2. Start Battleship AI enhancement (2-3 hours)
3. Document performance optimization targets (1 hour)

### **This Sprint (16-20 hours)**
1. Complete Battleship implementation
2. Performance optimization push (Lighthouse audit + fixes)
3. Accessibility audit (WCAG AA → AAA gap analysis)

### **Next Sprint (20-24 hours)**
1. Implement multi-player foundation
2. Sound system integration
3. Bingo multiplayer mode

### **Next Month (40-50 hours)**
1. Full accessibility upgrade (WCAG AAA)
2. Offline-first implementation
3. Analytics system
4. Fire-TV polish

---

## 🎮 Game-Specific Work

### High-Priority Games

#### **Battleship** (65% → 100%, 8-12 hrs)
- Advanced AI strategies
- Mobile gesture support
- Sound effects
- UI polish

**Next Steps**:
1. Review domain logic completeness
2. Implement hunt + target AI modes
3. Add mobile touch handling
4. Add sound effects
5. Polish UI/animations

---

#### **Bingo Variants** (85% → 100%, 6-8 hrs)
- Multiplayer mode
- Animations
- Sound effects
- Tournament system

**Next Steps**:
1. Implement local multiplayer turn management
2. Add celebration animations
3. Integrate sound effects
4. Create tournament bracket UI

---

### Medium-Priority Games

- **Checkers**: Add AI difficulty levels
- **Memory Game**: Add time attack mode
- **Simon Says**: Add multiplayer mode
- **Lights Out**: Add custom puzzle generation

---

## 🔧 Technical Debt & Refactoring

### Code Quality

- [ ] Remove unused components (audit all apps)
- [ ] Consolidate duplicate utilities
- [ ] Refactor large components (>300 lines)
- [ ] Improve TypeScript type coverage
- [ ] Remove legacy code/comments

**Effort**: 8-12 hours  
**Priority**: Medium (after feature work)

---

### Testing

- [ ] Increase component test coverage (target: 80%+)
- [ ] Add integration tests for game flow
- [ ] Add E2E tests for critical paths
- [ ] Performance testing (Lighthouse + custom)

**Effort**: 10-15 hours  
**Priority**: High (alongside development)

---

### Documentation

- [ ] Update game READMEs with latest features
- [ ] Create architecture guides per game type
- [ ] Document multiplayer state sync (when built)
- [ ] Create performance optimization guide

**Effort**: 4-6 hours  
**Priority**: Medium (as work completes)

---

## 🎯 Recommended Focus

### **If You Have 4 Hours**
Start Battleship AI enhancement (2-3 hrs) + document approach (1 hr)

### **If You Have 8 Hours**
Complete Battleship (+ polish) OR start performance optimization across all games

### **If You Have 16+ Hours**
Tackle both Battleship completion + accessibility audit + start sound system

---

## 📞 Decision Points

**Choose Your Focus**:

1. **Game Completions** → Finish Battleship + Bingo multiplayer (~14 hrs)
2. **Platform Capabilities** → Multi-player foundation + offline-first (~40 hrs)
3. **Quality & Performance** → Accessibility AAA + perf optimization (~20 hrs)
4. **Mixed Approach** → Battleship (4 hrs) + Perf optimization (6 hrs) + Accessibility audit (4 hrs)

**What would maximize platform value most right now?**

---

## 📊 Metrics to Track

Once you start work:
- Code coverage (target: 80%+)
- Bundle size per game (target: <200KB)
- Lighthouse score (target: 90+)
- E2E test pass rate (target: 100%)
- Accessibility violations (target: 0)

---

## Resources

- [AGENTS.md](../AGENTS.md) — Architecture & governance
- [ARCHITECTURE.md](../ARCHITECTURE.md) — Technical details
- [docs/SCRIPT-STANDARDS.md](../docs/SCRIPT-STANDARDS.md) — Script guidelines
- [.github/skills/](../.github/skills/) — Development skills & patterns

Next: **What would you like to focus on?**
