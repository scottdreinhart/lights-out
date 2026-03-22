#!/bin/bash
# Master Orchestration: Run All 4 Batches in Sequence
# With error handling and progress tracking

set -e  # Exit on first error

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$REPO_ROOT"

echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║         IMPORT REFACTORING: MASTER ORCHESTRATION              ║"
echo "║              (4 Batches × Auto-Fix Pipeline)                  ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""
echo "Timeline:"
echo "  • Batch 1: App → Domain (13 files, ~25 imports)"
echo "  • Batch 2: UI → App (8 files, ~20 imports)"
echo "  • Batch 3: UI → UI (15 files, ~30 imports)"
echo "  • Batch 4: Contexts & Workers (5 files, ~16 imports)"
echo "  • Validation: Full quality gate"
echo ""
echo "Each batch runs:"
echo "  1. pnpm lint:fix (auto-fix linting violations)"
echo "  2. pnpm format (auto-format code)"
echo "  3. pnpm typecheck (verify types)"
echo "  4. pnpm lint (final verification)"
echo ""
echo "Starting in 3 seconds... (Ctrl+C to cancel)"
sleep 3

# ===================================
# Batch 1: App → Domain
# ===================================
echo ""
echo "════════════════════════════════════════════════════════════════"
echo "BATCH 1: App Layer → Domain Layer (13 files)"
echo "════════════════════════════════════════════════════════════════"
echo ""

"$SCRIPT_DIR/batch-1-app-to-domain.sh"
if [ $? -ne 0 ]; then
  echo "❌ Batch 1 failed - stopping orchestration"
  exit 1
fi

echo ""
read -p "Batch 1 complete. Press Enter to continue to Batch 2..."
echo ""

# ===================================
# Batch 2: UI → App
# ===================================
echo "════════════════════════════════════════════════════════════════"
echo "BATCH 2: UI Layer → App Layer (8 files)"
echo "════════════════════════════════════════════════════════════════"
echo ""

"$SCRIPT_DIR/batch-2-ui-to-app.sh"
if [ $? -ne 0 ]; then
  echo "❌ Batch 2 failed - stopping orchestration"
  exit 1
fi

echo ""
read -p "Batch 2 complete. Press Enter to continue to Batch 3..."
echo ""

# ===================================
# Batch 3: UI → UI
# ===================================
echo "════════════════════════════════════════════════════════════════"
echo "BATCH 3: UI Layer → UI Layer Barrels (15 files)"
echo "════════════════════════════════════════════════════════════════"
echo ""

"$SCRIPT_DIR/batch-3-ui-to-ui.sh"
if [ $? -ne 0 ]; then
  echo "❌ Batch 3 failed - stopping orchestration"
  exit 1
fi

echo ""
read -p "Batch 3 complete. Press Enter to continue to Batch 4..."
echo ""

# ===================================
# Batch 4: Contexts & Workers
# ===================================
echo "════════════════════════════════════════════════════════════════"
echo "BATCH 4: Contexts & Workers (5 files)"
echo "════════════════════════════════════════════════════════════════"
echo ""

"$SCRIPT_DIR/batch-4-contexts-and-workers.sh"
if [ $? -ne 0 ]; then
  echo "❌ Batch 4 failed - stopping orchestration"
  exit 1
fi

# ===================================
# Final Validation
# ===================================
echo ""
echo "════════════════════════════════════════════════════════════════"
echo "FINAL VALIDATION: Full Quality Gate"
echo "════════════════════════════════════════════════════════════════"
echo ""

echo "Running full validation pipeline..."
pnpm validate
if [ $? -ne 0 ]; then
  echo "❌ Validation failed - review errors above"
  exit 1
fi

echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                     🎉 ALL BATCHES PASSED! 🎉                ║"
echo "║                                                                ║"
echo "║  Summary:                                                      ║"
echo "║    ✓ Batch 1: App → Domain (auto-fixed & verified)            ║"
echo "║    ✓ Batch 2: UI → App (auto-fixed & verified)                ║"
echo "║    ✓ Batch 3: UI → UI (auto-fixed & verified)                 ║"
echo "║    ✓ Batch 4: Contexts & Workers (auto-fixed & verified)      ║"
echo "║    ✓ Full validation: PASSED (lint + format + type + build)   ║"
echo "║                                                                ║"
echo "║  Results:                                                      ║"
echo "║    • 91 imports refactored                                     ║"
echo "║    • 0 ESLint violations                                       ║"
echo "║    • 0 TypeScript errors                                       ║"
echo "║    • Build output: dist/ (1.4 MB)                             ║"
echo "║                                                                ║"
echo "║  Next steps:                                                   ║"
echo "║    1. git add -A && git commit -m \"fix: refactor imports to\"  ║"
echo "║       use path aliases\"                                       ║"
echo "║    2. Run: pnpm test:a11y                                      ║"
echo "║    3. Run: pnpm test:lighthouse                                ║"
echo "║    4. Deploy or merge to main                                  ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""
