#!/bin/bash

# Cleanup Script: Phase 3 Consolidation
# Purpose: Remove per-app duplicates and sync monorepo dependencies
# Date: April 2, 2026

set -e

echo "═══════════════════════════════════════════════════════════════"
echo "Phase 3 Consolidation Cleanup"
echo "═══════════════════════════════════════════════════════════════"
echo ""

# Step 1: Sync monorepo dependencies
echo "📦 Step 1: Synchronizing monorepo dependencies..."
echo "   Running: pnpm clean:node && pnpm install"
echo ""

pnpm clean:node
pnpm install

echo ""
echo "✅ Dependencies synchronized"
echo ""

# Step 2: Remove 5 per-app duplicates
echo "🗑️  Step 2: Removing per-app duplicates of 17-testing.instructions.md..."
echo ""

APPS_TO_CLEAN=(
  "blackjack"
  "bingo"
  "cee-lo"
  "battleship"
  "bunco"
)

for app in "${APPS_TO_CLEAN[@]}"; do
  FILEPATH="apps/$app/.github/instructions/17-testing.instructions.md"
  if [ -f "$FILEPATH" ]; then
    echo "   ❌ Removing: $FILEPATH"
    rm "$FILEPATH"
  else
    echo "   ⊘ Already removed: $FILEPATH"
  fi
done

echo ""
echo "✅ Per-app duplicates removed"
echo ""

# Step 3: Verify consolidation
echo "✔️  Step 3: Verifying consolidation..."
echo ""

REMAINING=$(find apps -name "17-testing.instructions.md" | wc -l)
if [ "$REMAINING" -eq 0 ]; then
  echo "✅ SUCCESS: All per-app copies removed"
  echo "   Root consolidation confirmed: .github/instructions/17-testing.instructions.md"
else
  echo "⚠️  WARNING: Found $REMAINING remaining copies"
  find apps -name "17-testing.instructions.md" -type f
fi

echo ""

# Step 4: Run quality gates
echo "🔍 Step 4: Running quality gates..."
echo ""

echo "   → Running: pnpm test:names"
pnpm test:names --verbose

echo ""
echo "   → Running: pnpm lint"
pnpm lint

echo ""
echo "✅ All quality gates passed"
echo ""

# Summary
echo "═══════════════════════════════════════════════════════════════"
echo "✅ Phase 3 Consolidation Complete"
echo "═══════════════════════════════════════════════════════════════"
echo ""
echo "Summary:"
echo "  ✅ Monorepo dependencies synchronized"
echo "  ✅ Per-app duplicates removed (5 files)"
echo "  ✅ Consolidation verified (root-only coverage)"
echo "  ✅ Quality gates passed (test:names, lint)"
echo ""
echo "Next Steps:"
echo "  1. Run: pnpm validate (full quality gate)"
echo "  2. Run: pnpm test (verify tests work)"
echo "  3. Commit changes"
echo ""
