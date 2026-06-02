# Tile System - Marketplace Compliance Constraint

**Effective Date**: April 2, 2026  
**Updated**: April 13, 2026  
**Scope**: ALL 52 games in the platform  
**Authority**: Marketplace & App Store Requirements + 52-App Platform Standard

## Requirement

All interactive tiles must maintain a **minimum size of 58px × 58px** to comply with:

- ✅ **WCAG 2.5.5 Target Size** (Level AAA)
- ✅ **Apple App Store** guidelines
- ✅ **Google Play Store** guidelines
- ✅ **Amazon Appstore** requirements
- ✅ **Web Accessibility Standards**

## Implementation

This constraint is **automatically enforced** through the shared tile system:

```
packages/ui-board-core/src/Tile.module.css
```

All games using the `Tile` component from `@games/ui-board-core` automatically inherit this constraint.

### How It Works

The shared `Tile.module.css` includes:

```css
.tile {
  min-width: 58px;
  min-height: 58px;
}

@media (pointer: coarse) {
  .tile {
    min-width: 58px;
    min-height: 58px;
  }
}
```

This ensures:

- **Desktop/Mouse**: Minimum 58px × 58px
- **Mobile/Touch**: Minimum 58px × 58px (enforced via `pointer: coarse` media query)
- **All breakpoints**: Constraint applies uniformly

## For Game Developers

### ✅ Use the Shared Tile Component

```typescript
import { Tile } from '@games/ui-board-core'

export function GameCell({ position, content, state }) {
  return (
    <Tile
      position={position}
      content={content}
      state={state}
      // Minimum 58px × 58px is AUTOMATIC
    />
  )
}
```

### ✅ Can Increase Size Beyond Minimum

Games can make tiles larger:

```css
/* Game-specific override to make tiles larger */
.myGameBoard {
  /* Tile will be 100px × 100px (larger than 58px minimum) */
  width: 100px;
  height: 100px;
}

/* Touch media query - Tile will still respect 58px minimum */
@media (pointer: coarse) {
  .myGameBoard {
    /* Tile will be at least 58px × 58px */
    width: 50px; /* 58px minimum applies */
    height: 50px; /* 58px minimum applies */
  }
}
```

### ❌ Cannot Reduce Size Below Minimum

The system **prevents** tiles from being smaller than 58px:

```css
/* This will NOT work - 58px minimum is enforced */
.tooSmallTile {
  width: 32px; /* IGNORED - uses 58px minimum instead */
  height: 32px; /* IGNORED - uses 58px minimum instead */
}
```

## Games Currently Affected

The following games have been updated to comply:

| Game          | Status            | Changes                    |
| ------------- | ----------------- | -------------------------- |
| Shut-the-Box  | ✅ Fixed          | Mobile width: 45px → 58px  |
| Battleship    | ✅ Fixed          | Touch minimum: 32px → 58px |
| Zip           | ✅ Fixed          | All sizes: 24-32px → 58px  |
| TicTacToe     | ✅ Compliant      | Already meets requirement  |
| All New Games | ✅ Auto-Compliant | Inherit from shared system |

## Games Still To Audit

The following games need verification:

- Checkers (8×8 grid)
- Sudoku variants (6×6, 9×9)
- Queens game
- Connect-Four
- Minesweeper
- Others

## Audit Script

To check all games for compliance:

```bash
node scripts/audit-tile-sizes.mjs
```

This scans all game CSS files and reports:

- ✅ Conforming (meet 58px minimum)
- ❌ Non-conforming (below minimum)
- ⏳ Needs review (calculated sizing)

## Compliance Verification

Before submitting to any app store or marketplace:

1. **Build the game**: `pnpm --filter @games/YOUR-GAME build`
2. **Test touch targets**: Open on mobile device, confirm tiles are tappable
3. **Responsive test**: Verify minimum 58px at all breakpoints
4. **Accessibility check**: WCAG 2.5.5 compliance

## For Shared System Developers

If you modify `Tile.module.css`:

```css
/* ✅ DO: Ensure minimum is enforced */
.tile {
  min-width: 58px;
  min-height: 58px;
}

/* ✅ DO: Support all device types */
@media (pointer: coarse) {
}
@media (pointer: fine) {
}

/* ❌ DON'T: Remove or reduce the minimum */
/* ❌ DON'T: Add exceptions that bypass the constraint */
```

## Marketplace Submission Checklist

Before any release:

- [ ] All tiles are minimum 58px × 58px
- [ ] Touch targets tested on mobile device
- [ ] Responsive behavior tested at all breakpoints (375px, 600px, 900px, 1200px, 1800px+)
- [ ] WCAG 2.5.5 verified
- [ ] Audit script passes (`audit-tile-sizes.mjs`)
- [ ] Game builds without errors
- [ ] No console warnings about tile sizing

## Questions?

This constraint is non-negotiable for app store compliance.  
Contact the platform team if you have questions about implementation.
