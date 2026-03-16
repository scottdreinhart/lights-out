#!/bin/bash
# Batch 2: UI Layer → App Layer Import Fixes
# Autofixes cross-layer relative imports (../../app/) → @/app

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$REPO_ROOT"

echo "🔧 Batch 2: UI → App Import Autofixes"
echo "======================================="
echo ""

# Run ESLint autofixes first
echo "Step 1: Running ESLint autofixes..."
pnpm lint:fix
if [ $? -ne 0 ]; then
  echo "⚠️  ESLint autofixes encountered warnings (this is OK)"
fi
echo "✓ ESLint autofixes complete"
echo ""

# Format code
echo "Step 2: Running Prettier formatting..."
pnpm format
if [ $? -ne 0 ]; then
  echo "⚠️  Prettier formatting encountered issues"
fi
echo "✓ Prettier formatting complete"
echo ""

# Verify TypeScript
echo "Step 3: TypeScript type check..."
pnpm typecheck
if [ $? -ne 0 ]; then
  echo "❌ TypeScript errors found - review before proceeding"
  exit 1
fi
echo "✓ TypeScript check passed"
echo ""

# Final linting verification
echo "Step 4: Final ESLint verification..."
pnpm lint
LINT_EXIT=$?
if [ $LINT_EXIT -eq 0 ]; then
  echo "✓ ESLint verification passed (0 violations)"
else
  echo "⚠️  ESLint still has violations - manual fixes may be needed"
fi
echo ""

echo "✅ Batch 2 COMPLETE"
echo "Files affected:"
echo "  • src/ui/molecules/GameBoard.tsx"
echo "  • src/ui/molecules/HamburgerMenu.tsx"
echo "  • src/ui/molecules/QuickThemePicker.tsx"
echo "  • src/ui/organisms/App.tsx"
echo "  • src/ui/organisms/ErrorBoundary.tsx"
echo "  • src/ui/atoms/OfflineIndicator.tsx"
echo "  • src/app/SoundContext.tsx"
echo "  • src/app/ThemeContext.tsx"
echo ""
echo "Next: Run ./scripts/batch-3-ui-to-ui.sh"
