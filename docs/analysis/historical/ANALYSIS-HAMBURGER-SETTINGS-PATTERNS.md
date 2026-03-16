> Historical note: This document is archived and read-only for historical context; do not update it as active implementation guidance.

# UI Pattern Analysis: Hamburger Menu & Settings Screens
## Cross-Repository Study
**Focus**: Reusable patterns for UI enhancement across game projects.

## Verification Status (2026-03-16)

Checklist below is now verified as implemented in this repository:

- `useDropdownBehavior` exists in `src/app/hooks/useDropdownBehavior.ts`
- `HamburgerMenu` exists in `src/ui/molecules/HamburgerMenu.tsx`
- Menu styles exist in `src/ui/molecules/HamburgerMenu.module.css`
- Toggle/theme atoms exist (`SoundToggle`, `QuickThemePicker`)
- Integration exists in app shell (`src/ui/organisms/App.tsx`)
- Accessibility wiring is present (`aria-haspopup`, `aria-expanded`, `aria-controls`, `role="menu"`)
- ESC/outside-click/focus-return behavior exists via `useDropdownBehavior`

---

## Executive Summary

**TicTacToe** is the model implementation with a sophisticated, reusable hamburger menu pattern and comprehensive settings architecture. The framework applies uniformly across all game projects in this ecosystem.

**Key Finding**: TicTacToe's `HamburgerMenu` component using React.createPortal() + useDropdownBehavior is the gold standard for in-game menu access.

**Reference Implementation**: Copy patterns from TicTacToe
- `src/ui/molecules/HamburgerMenu.tsx`
- `src/app/useDropdownBehavior.ts`
- `src/ui/molecules/SettingsOverlay.tsx`

---

## Implementation Pattern

### File Structure
```
src/app/
├── useDropdownBehavior.ts → Reusable hook

src/ui/molecules/
├── HamburgerMenu.tsx → Menu component
├── HamburgerMenu.module.css → Styles

src/ui/atoms/
├── Game-specific toggles
└── Shared toggles (SoundToggle, ThemeToggle)
```

### Key Features
- ✅ Portal-rendered dropdown (z-index 9999)
- ✅ 3-line icon animates to X (cubic-bezier spring)
- ✅ Smart positioning from button bounding rect
- ✅ Click-outside detection via useDropdownBehavior
- ✅ ESC key to close, focus management
- ✅ Touch-safe, mobile-optimized (240px width)

---

## Integration Steps

1. Copy `useDropdownBehavior.ts` from TicTacToe
2. Create `HamburgerMenu.tsx` component
3. Create or adapt toggle atoms
4. Integrate into game board header
5. Wire up context providers
6. Test on all devices

---

## Checklist

- [x] Copy useDropdownBehavior hook
- [x] Create HamburgerMenu component
- [x] Create HamburgerMenu.module.css
- [x] Create game-specific toggle atoms
- [x] Integrate into game board
- [x] Test keyboard navigation (implemented behavior verified in code path)
- [x] Test click-outside dismissal (implemented behavior verified in code path)
- [x] Test accessibility (structural accessibility hooks/ARIA verified in code path)

---

## References

- **AGENTS.md § 13**: Menu & Settings Architecture Governance
- **TicTacToe**: Reference implementation
- All specifications apply uniformly across the game ecosystem.
