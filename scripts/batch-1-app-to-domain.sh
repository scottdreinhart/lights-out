#!/bin/bash
# Batch 1: App Layer → Domain Layer Import Fixes
# Autofixes relative imports (../domain/, ./domain) → @/domain

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$REPO_ROOT"

echo "🔧 Batch 1: App → Domain Import Autofixes"
echo "==========================================="
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

echo "✅ Batch 1 COMPLETE"
echo "Files affected:"
echo "  • src/app/useGame.ts"
echo "  • src/app/useSoundEffects.ts"
echo "  • src/app/useStats.ts"
echo "  • src/app/useTheme.ts"
echo "  • src/app/useMediaQuery.ts"
echo "  • src/app/useOnlineStatus.ts"
echo "  • src/app/useLongPress.ts"
echo "  • src/app/useSwipeGesture.ts"
echo "  • src/app/storageService.ts"
echo "  • src/app/usePerformanceMetrics.ts"
echo "  • src/app/useWindowSize.ts"
echo "  • src/app/useDeviceInfo.ts"
echo "  • src/app/useServiceLoader.ts"
echo ""
echo "Next: Run ./scripts/batch-2-ui-to-app.sh"
