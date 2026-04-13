#!/bin/bash
set -e

echo "🚀 Installing Orchestration & Validation Tools"
echo "=============================================="
echo ""

cd "$(dirname "$0")/.."

echo "📦 Installing devDependencies..."
pnpm add -D -w \
  husky \
  lint-staged \
  hygen \
  dependency-cruiser \
  knip \
  @ast-grep/cli \
  markdownlint-cli2 \
  cspell \
  --save-exact

echo ""
echo "✅ Dependencies installed!"
echo ""
echo "🔧 Running husky install..."
pnpm exec husky install

echo ""
echo "✅ Husky setup complete!"
echo ""
echo "📋 Tools installed:"
echo "  ✅ husky (git hooks)"
echo "  ✅ lint-staged (pre-commit linting)"
echo "  ✅ hygen (scaffolding)"
echo "  ✅ dependency-cruiser (architecture)"
echo "  ✅ knip (unused code)"
echo "  ✅ @ast-grep/cli (codemods)"
echo "  ✅ markdownlint-cli2 (doc linting)"
echo "  ✅ cspell (spell checking)"
echo ""
echo "Next: Run scripts/setup-generators.sh"
