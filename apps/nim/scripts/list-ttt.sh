#!/bin/bash
BASE="/mnt/c/Users/scott/tictactoe/src"
for dir in domain app ui ui/atoms ui/molecules ui/organisms ui/utils; do
  echo "--- $dir ---"
  ls "$BASE/$dir/" 2>/dev/null | grep -E '\.(ts|tsx)$' | grep -v '\.test\.' | grep -v '\.module\.' | sort
done
