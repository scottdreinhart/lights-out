# 🧪 BROWSER TESTING ACTION PLAN

**Status**: Dependency installation in progress...  
**Date**: April 2, 2026  
**Goal**: Verify all 38 game apps display correctly in a browser

---

## ⏱️ What's Happening Now

```bash
pnpm install
# Installing dependencies for all 38 apps
# This ensures each app has node_modules available
# ETA: 2-5 minutes
```

---

## 🚀 Step-by-Step Testing Plan

### Step 1: Wait for Install to Complete ✅

```bash
# Check status:
ps aux | grep "pnpm install"
# If no output: install is done!
```

### Step 2: Start with Phase 1 (5 Verified Apps)

These apps have passed compliance validation and are most stable:

**Option A: Test One App**

```bash
cd c:\Users\scott\game-platform

# Test checkers
pnpm --filter @games/checkers dev

# When dev server starts, open browser:
# http://localhost:5173

# Verify:
# ✅ Page loads
# ✅ Game board visible
# ✅ No red errors in console (F12)
# ✅ Controls/buttons clickable

# When done: Ctrl+C to stop dev server
```

**Option B: Test Multiple Apps in Parallel**

```bash
# Open 3 separate terminals:

# Terminal 1
pnpm --filter @games/checkers dev
# Opens on http://localhost:5173

# Terminal 2
pnpm --filter @games/connect-four dev
# Can't use same port - will fail
# This is OK - test sequential instead

# Terminal 1: (Ctrl+C to stop)
# Terminal 2: Run next app
```

### Step 3: Update Tracking Document

After testing each app, update:

```
c:\Users\scott\game-platform\BROWSER-TESTING-LOG.md
```

Mark each app as:

- ✅ PASS - Loads correctly, displays properly
- ❌ FAIL - Build error or display issue
- ⚠️ PARTIAL - Loads but has issues

### Step 4: Run Full Build Check

Once install completes:

```bash
bash /mnt/c/Users/scott/game-platform/scripts/test-browser-phase1.sh
```

This will:

1. Build all 5 Phase 1 apps
2. Show results
3. List build errors (if any)

---

## 📋 Recommended Testing Sequence

### Phase 1 (5 apps - TEST FIRST)

```bash
pnpm --filter @games/checkers dev
pnpm --filter @games/connect-four dev
pnpm --filter @games/monchola dev
pnpm --filter @games/reversi dev
pnpm --filter @games/tictactoe dev
```

### Phase 2 (27 apps - AFTER PHASE 1)

Test these one by one after Phase 1 succeeds:

- battleship, bunco, cee-lo, chicago, cho-han, crossclimb
- farkle, hangman, liars-dice, lights-out, mancala, memory-game
- mexico, minesweeper, mini-sudoku, nim, pig, pinpoint
- queens, rock-paper-scissors, ship-captain-crew, shut-the-box
- simon-says, snake, sudoku, tango, zip

### Phase 3 (6 apps - TEST LAST)

Test the newly added apps:

- bingo, blackjack, dominoes, go-fish, snakes-and-ladders, war

---

## 🛠️ Troubleshooting

### Problem: Port 5173 in use

```bash
# Kill the port and try again
kill-port 5173 || killall node

# Then retry
pnpm --filter @games/[app-name] dev
```

### Problem: Build fails with TypeScript errors

```bash
# Check the specific error
pnpm --filter @games/[app-name] build

# Or run typecheck directly
pnpm --filter @games/[app-name] typecheck
```

### Problem: App loads but shows blank screen

```bash
# Open DevTools: F12
# Check Console tab for JavaScript errors

# Common fixes:
# 1. Hard refresh browser: Ctrl+Shift+R
# 2. Clear browser cache: Ctrl+Shift+Delete
# 3. Check Network tab for failed requests
```

### Problem: ELIFECYCLE errors

```bash
# Dependencies might be incomplete
# Run full install again
pnpm install

# Then retry the build
pnpm --filter @games/[app-name] build
```

---

## ✅ Success Criteria

For each app to be marked as **PASS**:

- [ ] Dev server starts without errors
- [ ] App loads at http://localhost:5173
- [ ] No JavaScript console errors
- [ ] Game board/UI visible and complete
- [ ] Controls/buttons are interactive
- [ ] Responsive design works (test F12 mobile view)
- [ ] No broken layout or missing assets

---

## 📊 Quick Status Command

Check overall app health anytime:

```bash
pnpm validate:compliance:detailed
```

This shows:

- Total apps: 38
- Passed: 5
- Fixed: 27
- Pending: 6

---

## 💡 Pro Tips

1. **Open multiple browser tabs** instead of windows - easier to switch between apps
2. **Keep DevTools open** while testing (F12)
3. **Test mobile view** via DevTools (F12 → Toggle Device Toolbar)
4. **Take notes** on any visual issues or missing features
5. **Run builds sequentially** (not in parallel) to avoid port conflicts

---

## 🎯 Next Commands (Copy & Paste Ready)

Once install completes:

```bash
# Test Phase 1 - Single app
cd c:\Users\scott\game-platform
pnpm --filter @games/checkers dev

# Test Phase 1 - All builds
bash /mnt/c/Users/scott/game-platform/scripts/test-browser-phase1.sh

# Validate compliance
pnpm validate:compliance:detailed

# View test log
cat c:\Users\scott\game-platform\BROWSER-TESTING-LOG.md
```

---

## 📞 Got Issues?

If build or dev fails:

1. Save the error output
2. Check `/tmp/<app-name>-build.log`
3. Run `pnpm install` again
4. Try `pnpm lint` in the specific app directory
5. Check if `src/main.tsx` exists in the app

---

**Ready?** Wait for `pnpm install` to complete, then start with:

```bash
pnpm --filter @games/checkers dev
```
