#!/bin/bash
set -e
PARENT="/mnt/c/Users/scott"

commit_and_push() {
  local repo="$1"
  local msg="$2"
  echo "=== $repo ==="
  cd "$PARENT/$repo"
  git add -A
  if git diff --cached --quiet; then
    echo "  No changes to commit"
  else
    git commit -m "$msg"
    git push
    echo "  Pushed"
  fi
  echo ""
}

commit_and_push "tictactoe" "chore: add barrel index.ts files and align tsconfig to shared baseline"
commit_and_push "connect-four" "chore: align tsconfig.json to shared baseline"
commit_and_push "minesweeper" "chore: align pnpm-workspace.yaml and capacitor.config.ts to shared baseline"

echo "=== Cleaning up nim temp scripts ==="
cd "$PARENT/nim"
rm -f scripts/audit-repos.sh scripts/audit-details.sh scripts/check-diffs.sh scripts/list-ttt.sh
git add -A
if git diff --cached --quiet; then
  echo "  No changes to commit"
else
  git commit -m "chore: remove temporary audit scripts"
  git push
  echo "  Pushed"
fi

echo ""
echo "Done!"
