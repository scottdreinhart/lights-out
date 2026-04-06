#!/usr/bin/env node
import { rm } from 'fs/promises';
import { existsSync } from 'fs';

const paths = process.argv.slice(2).filter(p => p);

if (paths.length === 0) {
  console.error('Usage: cleanup.mjs <path1> [path2] ...');
  process.exit(1);
}

async function cleanup() {
  for (const path of paths) {
    if (existsSync(path)) {
      try {
        await rm(path, { recursive: true, force: true });
        console.log(`✓ Removed ${path}`);
      } catch (err) {
        console.error(`✗ Failed to remove ${path}:`, err.message);
        process.exit(1);
      }
    }
  }
}

cleanup().catch(err => {
  console.error('Cleanup failed:', err);
  process.exit(1);
});
