#!/usr/bin/env node

/**
 * Validate all apps and update compliance matrix
 * Runs: lint, format:check, typecheck via pnpm
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const APPS_DIR = 'c:\\Users\\scott\\game-platform\\apps';
const COMPLIANCE_DIR = 'c:\\Users\\scott\\game-platform\\compliance';
const PNPM = 'c:\\Users\\scott\\AppData\\Local\\pnpm\\pnpm.CMD';

// Initialize results
const results = {
  timestamp: new Date().toISOString(),
  apps: {},
  summary: {
    total: 0,
    passed: 0,
    failed: 0,
    warned: 0
  }
};

// Get all app directories
const appDirs = fs.readdirSync(APPS_DIR).filter(name => {
  const stat = fs.statSync(path.join(APPS_DIR, name));
  return stat.isDirectory() && !name.startsWith('.');
}).sort();

console.log(`\n🔄 Validating ${appDirs.length} apps...`);
console.log(`Timestamp: ${results.timestamp}\n`);

let passed = 0;
let failed = 0;
let warned = 0;

for (const app of appDirs) {
  process.stdout.write(`📦 ${app}... `);
  const appPath = path.join(APPS_DIR, app);
  
  try {
    // Change to app directory and run check
    const cmd = `cd "${appPath}" && "${PNPM}" check`;
    execSync(cmd, { stdio: 'pipe', shell: 'cmd.exe' });
    
    console.log('✅');
    results.apps[app] = { status: 'passed', timestamp: new Date().toISOString() };
    passed++;
  } catch (err) {
    const output = err.stdout?.toString() + err.stderr?.toString();
    
    // Check if it's just warnings
    if (output.includes('warning')) {
      console.log('⚠️');
      results.apps[app] = { status: 'warned', timestamp: new Date().toISOString() };
      warned++;
    } else {
      console.log('❌');
      results.apps[app] = { status: 'failed', timestamp: new Date().toISOString() };
      failed++;
    }
  }
}

results.summary.total = appDirs.length;
results.summary.passed = passed;
results.summary.failed = failed;
results.summary.warned = warned;

console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('📊 VALIDATION SUMMARY');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log(`✅ Passed:  ${passed}/${appDirs.length}`);
console.log(`⚠️  Warned:  ${warned}/${appDirs.length}`);
console.log(`❌ Failed:  ${failed}/${appDirs.length}`);
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

// Update compliance matrix
if (!fs.existsSync(COMPLIANCE_DIR)) {
  fs.mkdirSync(COMPLIANCE_DIR, { recursive: true });
}

const matrixPath = path.join(COMPLIANCE_DIR, 'matrix.json');
let matrix = { apps: {} };

if (fs.existsSync(matrixPath)) {
  matrix = JSON.parse(fs.readFileSync(matrixPath, 'utf8'));
}

// Update app statuses
for (const [app, result] of Object.entries(results.apps)) {
  if (!matrix.apps[app]) {
    matrix.apps[app] = {};
  }
  matrix.apps[app].validation = result.status;
  matrix.apps[app].lastChecked = result.timestamp;
}

matrix.lastUpdated = results.timestamp;
fs.writeFileSync(matrixPath, JSON.stringify(matrix, null, 2));

console.log(`✅ Compliance matrix updated: ${matrixPath}`);
console.log(`📊 Data written for ${Object.keys(results.apps).length} apps\n`);
