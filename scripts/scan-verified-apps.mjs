#!/usr/bin/env node

/**
 * Scan all apps and rebuild verified-apps.json
 * Usage: node scripts/scan-verified-apps.mjs
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(__dirname, '..')
const appsDir = path.join(projectRoot, 'apps')

// Get all app directories
const allApps = fs.readdirSync(appsDir)
  .filter(f => fs.statSync(path.join(appsDir, f)).isDirectory())
  .sort()

// Find verified apps (those with .browser-verified file)
const verifiedApps = allApps.filter(app => {
  const markerPath = path.join(appsDir, app, '.browser-verified')
  return fs.existsSync(markerPath)
})

const pendingApps = allApps.filter(app => !verifiedApps.includes(app))

// Update aggregator
const aggregatorPath = path.join(projectRoot, 'compliance', 'verified-apps.json')
const aggregator = {
  metadata: {
    description: 'Central registry of browser-verified game applications',
    'last-updated': new Date().toISOString(),
    'total-apps': allApps.length,
    'verified-count': verifiedApps.length,
    'verification-status': verifiedApps.length === allApps.length ? 'complete' : 'in-progress',
  },
  'verified-apps': verifiedApps,
  'pending-apps': pendingApps,
}

fs.writeFileSync(aggregatorPath, JSON.stringify(aggregator, null, 2))

console.log('✅ Scan complete!')
console.log(`📊 ${verifiedApps.length}/${allApps.length} apps verified`)
console.log(`\n✅ Verified (${verifiedApps.length}):`)
verifiedApps.forEach(app => console.log(`  - ${app}`))
console.log(`\n⏳ Pending (${pendingApps.length}):`)
pendingApps.forEach(app => console.log(`  - ${app}`))
