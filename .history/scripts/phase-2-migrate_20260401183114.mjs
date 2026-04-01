#!/usr/bin/env node

/**
 * Phase 2 Batch Migrate: Update all storage services to use @games/storage-utils
 * 
 * This script:
 * 1. Updates each app's tsconfig.json to include @games/storage-utils path
 * 2. Replaces storageService.ts files with re-export pattern (24 simple apps)
 * 3. Reports on nim (special case for manual handling)
 * 4. Provides batch summary and validation steps
 */

const fs = require('fs');
const path = require('path');

const appsDir = path.join(__dirname, '..', 'apps');
const packagesDir = path.join(__dirname, '..', 'packages');

const SIMPLE_APPS = [
  'battleship', 'bunco', 'cee-lo', 'checkers', 'chicago', 'cho-han',
  'connect-four', 'farkle', 'hangman', 'liars-dice', 'lights-out', 'mancala',
  'memory-game', 'mexico', 'minesweeper', 'monchola', 'pig', 'reversi',
  'rock-paper-scissors', 'ship-captain-crew', 'shut-the-box', 'simon-says',
  'snake', 'tictactoe'
];

const SPECIAL_APPS = ['nim'];

const STORAGE_SERVICE_TEMPLATE = `/**
 * Storage Service — Persistent state via localStorage
 * 
 * Re-exports generic utilities from @games/storage-utils for consistency.
 * Provides: load, save, remove — all with error handling and type safety.
 */

// Re-export shared utilities with familiar names
export {
  loadWithFallback as load,
  loadNullable,
  removeKey as remove,
  saveJson as save,
} from '@games/storage-utils'
`;

// Function to find storageService location in an app
function findStorageService(appName) {
  const appDir = path.join(appsDir, appName);
  const possiblePaths = [
    path.join(appDir, 'src', 'app', 'storageService.ts'),
    path.join(appDir, 'src', 'app', 'services', 'storageService.ts'),
  ];

  for (const filePath of possiblePaths) {
    if (fs.existsSync(filePath)) {
      return filePath;
    }
  }
  return null;
}

// Function to update tsconfig.json
function updateTsconfig(appName) {
  const tsconfigPath = path.join(appsDir, appName, 'tsconfig.json');
  
  if (!fs.existsSync(tsconfigPath)) {
    return { status: 'skip', reason: 'tsconfig.json not found' };
  }

  try {
    const config = JSON.parse(fs.readFileSync(tsconfigPath, 'utf8'));
    
    // Ensure structure exists
    if (!config.compilerOptions) config.compilerOptions = {};
    if (!config.compilerOptions.paths) config.compilerOptions.paths = {};
    
    // Check if already added
    if (config.compilerOptions.paths['@games/storage-utils']) {
      return { status: 'skip', reason: 'path mapping already exists' };
    }
    
    // Add the path mapping
    config.compilerOptions.paths['@games/storage-utils'] = ['../../packages/storage-utils/src'];
    
    // Write back
    fs.writeFileSync(tsconfigPath, JSON.stringify(config, null, 2) + '\n');
    
    return { status: 'ok', message: 'path mapping added' };
  } catch (e) {
    return { status: 'error', reason: e.message };
  }
}

// Function to migrate storageService.ts file
function migrateStorageService(appName, isSimple = true) {
  const filePath = findStorageService(appName);
  
  if (!filePath) {
    return { status: 'skip', reason: 'storageService.ts not found' };
  }

  try {
    // Backup original
    const backupPath = filePath + '.backup';
    if (!fs.existsSync(backupPath)) {
      fs.copyFileSync(filePath, backupPath);
    }
    
    // Write new version
    if (isSimple) {
      fs.writeFileSync(filePath, STORAGE_SERVICE_TEMPLATE);
    } else {
      // For complex services like nim, we report but don't replace
      const originalSize = fs.readFileSync(filePath).toString().split('\n').length;
      return { status: 'defer', reason: `Complex service (${originalSize} lines), manual refactoring needed`, filePath };
    }
    
    const newSize = fs.readFileSync(filePath).toString().split('\n').length;
    return { status: 'ok', message: `Migrated (${newSize} lines)`, filePath };
  } catch (e) {
    return { status: 'error', reason: e.message };
  }
}

// Main execution
console.log('╔════════════════════════════════════════════════════════════════════╗');
console.log('║ PHASE 2: Services Consolidation — Storage Utils Adoption           ║');
console.log('╚════════════════════════════════════════════════════════════════════╝');
console.log('');

// Step 1: Update all tscofig.json files
console.log('STEP 1: Update tsconfig.json files');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('');

let tsConfigOk = 0;
const allApps = [...SIMPLE_APPS, ...SPECIAL_APPS];

for (const app of allApps) {
  const result = updateTsconfig(app);
  if (result.status === 'ok') {
    console.log(`  ✅ ${app}: ${result.message}`);
    tsConfigOk++;
  } else if (result.status === 'skip') {
    console.log(`  ⏭️  ${app}: ${result.reason}`);
  } else {
    console.log(`  ❌ ${app}: ${result.reason}`);
  }
}

console.log('');
console.log(`Summary: ${tsConfigOk}/${allApps.length} apps updated`);
console.log('');

// Step 2: Migrate simple apps
console.log('STEP 2: Migrate 24 simple apps to re-export pattern');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('');

let simpleOk = 0;

for (const app of SIMPLE_APPS) {
  const result = migrateStorageService(app, true);
  if (result.status === 'ok') {
    console.log(`  ✅ ${app}: ${result.message}`);
    simpleOk++;
  } else if (result.status === 'skip') {
    console.log(`  ⏭️  ${app}: ${result.reason}`);
  } else {
    console.log(`  ❌ ${app}: ${result.reason}`);
  }
}

console.log('');
console.log(`Summary: ${simpleOk}/${SIMPLE_APPS.length} simple apps migrated`);
console.log('');

// Step 3: Report on special cases
console.log('STEP 3: Special cases (deferred for manual handling)');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('');

for (const app of SPECIAL_APPS) {
  const result = migrateStorageService(app, false);
  if (result.status === 'defer') {
    console.log(`  ⏳ ${app}: ${result.reason}`);
    console.log(`     File: ${result.filePath}`);
  } else if (result.status === 'skip') {
    console.log(`  ⏭️  ${app}: ${result.reason}`);
  } else {
    console.log(`  ❌ ${app}: ${result.reason}`);
  }
}

console.log('');
console.log('╔════════════════════════════════════════════════════════════════════╗');
console.log('║ PHASE 2 BATCH MIGRATION: COMPLETE                                 ║');
console.log('║                                                                    ║');
console.log(`║ ✅ Updated: ${tsConfigOk}/${allApps.length} apps' tsconfig.json`);
console.log(`║ ✅ Migrated: ${simpleOk}/${SIMPLE_APPS.length} simple apps`);
console.log('║ ⏳ Deferred: 1 app (nim) for manual refactoring                     ║');
console.log('║                                                                    ║');
console.log('║ NEXT STEPS:                                                        ║');
console.log('║ 1. Run: pnpm typecheck (verify all types resolve)                  ║');
console.log('║ 2. Run: pnpm lint (check code style)                               ║');
console.log('║ 3. Manually refactor: apps/nim/src/app/services/storageService.ts  ║');
console.log('║ 4. Commit: "refactor(apps): Migrate to @games/storage-utils"       ║');
console.log('╚════════════════════════════════════════════════════════════════════╝');
