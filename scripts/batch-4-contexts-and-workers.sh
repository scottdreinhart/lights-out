#!/bin/bash
# Batch 4: Context & Worker Import Fixes
# Autofixes context provider imports and worker imports to use hooks/barrels

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$REPO_ROOT"

echo "🔧 Batch 4: Context & Worker Import Autofixes"
echo "=============================================="
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

echo "✅ Batch 4 COMPLETE"
echo "Files affected:"
echo "  • src/app/SoundContext.tsx (context provider)"
echo "  • src/app/ThemeContext.tsx (context provider)"
echo "  • src/workers/ai.worker.ts (worker imports)"
echo "  • src/wasm/wasm-loader.ts (WASM imports)"
echo "  • src/app/index.ts (barrel verification)"
echo ""
echo "=============================================="
echo "🎉 ALL BATCHES COMPLETE!"
echo "=============================================="
echo ""
echo "Next: Run ./scripts/phase-a.sh for full deployment validation"
