#!/usr/bin/env node

import { promises as fs } from 'fs'
import path from 'path'
import { execSync } from 'child_process'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '..')
const appsDir = path.join(rootDir, 'apps')
const complianceDir = path.join(rootDir, 'compliance')

console.log('🔍 Starting parallel lint validation of all 38 apps...\n')

// Get all app directories (exclude 'ui' shared package)
const appDirs = (await fs.readdir(appsDir))
  .filter((name) => name !== 'ui')
  .sort()

console.log(`📊 Found ${appDirs.length} apps to validate\n`)

// Lint each app in parallel
const lintResults = await Promise.all(
  appDirs.map(async (appName) => {
    try {
      const appPath = path.join(appsDir, appName)
      const packageJsonPath = path.join(appPath, 'package.json')

      // Check if package.json exists
      try {
        await fs.stat(packageJsonPath)
      } catch {
        return { appName, status: 'skip', reason: 'No package.json' }
      }

      // Run lint command for this app
      try {
        execSync(`pnpm -C ${appPath} lint`, {
          stdio: 'pipe',
          timeout: 30000, // 30 second timeout per app
        })
        return { appName, status: 'pass', port: 5173 }
      } catch (error) {
        return { appName, status: 'fail', error: error.message.slice(0, 100) }
      }
    } catch (error) {
      return { appName, status: 'error', error: error.message.slice(0, 100) }
    }
  })
)

// Organize results
const results = {
  timestamp: new Date().toISOString(),
  totalApps: appDirs.length,
  passed: lintResults.filter((r) => r.status === 'pass').length,
  failed: lintResults.filter((r) => r.status === 'fail').length,
  skipped: lintResults.filter((r) => r.status === 'skip').length,
  apps: lintResults,
}

// Write results to JSON file
const resultsFile = path.join(complianceDir, 'app-lint-results.json')
await fs.writeFile(resultsFile, JSON.stringify(results, null, 2))

// Print formatted results to terminal
console.log('\n' + '='.repeat(70))
console.log('LINT VALIDATION RESULTS')
console.log('='.repeat(70) + '\n')

console.log(`✅ PASSED (${results.passed})`)
lintResults
  .filter((r) => r.status === 'pass')
  .forEach((r) => console.log(`   • ${r.appName}`))

console.log(`\n❌ FAILED (${results.failed})`)
lintResults
  .filter((r) => r.status === 'fail')
  .forEach((r) => console.log(`   • ${r.appName}`))

console.log(`\n⏭️  SKIPPED (${results.skipped})`)
lintResults
  .filter((r) => r.status === 'skip')
  .forEach((r) => console.log(`   • ${r.appName} (${r.reason})`))

console.log(`\n📊 Summary: ${results.passed} passed, ${results.failed} failed, ${results.skipped} skipped`)
console.log(`💾 Results saved to: ${resultsFile}\n`)

// Generate dashboard HTML
const dashboardHtml = generateDashboard(results)
const dashboardFile = path.join(complianceDir, 'app-lint-dashboard.html')
await fs.writeFile(dashboardFile, dashboardHtml)

console.log(`🌐 Dashboard created: ${dashboardFile}`)
console.log(`   Open in browser: http://localhost:8080/app-lint-dashboard.html\n`)

process.exit(0)

function generateDashboard(results) {
  const passedApps = results.apps.filter((a) => a.status === 'pass')
  const failedApps = results.apps.filter((a) => a.status === 'fail')
  const skippedApps = results.apps.filter((a) => a.status === 'skip')

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>App Lint Validation Dashboard</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      padding: 2rem;
    }
    
    .container {
      max-width: 1200px;
      margin: 0 auto;
    }
    
    .header {
      background: white;
      padding: 2rem;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      margin-bottom: 2rem;
    }
    
    .header h1 {
      color: #333;
      margin-bottom: 0.5rem;
      font-size: 2rem;
    }
    
    .header p {
      color: #666;
      font-size: 0.9rem;
    }
    
    .stats {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1rem;
      margin-top: 1.5rem;
    }
    
    .stat {
      text-align: center;
      padding: 1rem;
      border-radius: 8px;
      font-weight: 600;
    }
    
    .stat.pass {
      background: #d4edda;
      color: #155724;
    }
    
    .stat.fail {
      background: #f8d7da;
      color: #721c24;
    }
    
    .stat.skip {
      background: #e2e3e5;
      color: #383d41;
    }
    
    .stat-number {
      font-size: 1.8rem;
      display: block;
      margin-bottom: 0.5rem;
    }
    
    .stat-label {
      font-size: 0.85rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .apps-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }
    
    .app-card {
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      transition: transform 0.2s, box-shadow 0.2s;
    }
    
    .app-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 12px rgba(0, 0, 0, 0.15);
    }
    
    .app-header {
      padding: 1rem;
      border-bottom: 4px solid #ddd;
    }
    
    .app-header.pass {
      border-bottom-color: #28a745;
      background: #f0f9f5;
    }
    
    .app-header.fail {
      border-bottom-color: #dc3545;
      background: #fdf5f5;
    }
    
    .app-header.skip {
      border-bottom-color: #adb5bd;
      background: #f9f9f9;
    }
    
    .app-name {
      font-size: 1.1rem;
      font-weight: 600;
      color: #333;
      margin-bottom: 0.5rem;
    }
    
    .app-status {
      display: inline-block;
      padding: 0.4rem 0.8rem;
      border-radius: 6px;
      font-size: 0.85rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .app-status.pass {
      background: #28a745;
      color: white;
    }
    
    .app-status.fail {
      background: #dc3545;
      color: white;
    }
    
    .app-status.skip {
      background: #adb5bd;
      color: white;
    }
    
    .app-body {
      padding: 1rem;
    }
    
    .app-link {
      display: inline-block;
      margin-top: 1rem;
      padding: 0.6rem 1rem;
      background: #667eea;
      color: white;
      text-decoration: none;
      border-radius: 6px;
      font-size: 0.9rem;
      font-weight: 600;
      transition: background 0.2s;
    }
    
    .app-link:hover {
      background: #5568d3;
    }
    
    .app-link.disabled {
      background: #ccc;
      cursor: not-allowed;
      pointer-events: none;
    }
    
    .section {
      margin-bottom: 3rem;
    }
    
    .section-title {
      color: white;
      font-size: 1.5rem;
      font-weight: 600;
      margin-bottom: 1.5rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    
    .section-title.empty {
      margin-bottom: 1rem;
      font-size: 1rem;
      color: rgba(255, 255, 255, 0.7);
    }
    
    .footer {
      text-align: center;
      color: rgba(255, 255, 255, 0.8);
      padding: 2rem;
      font-size: 0.9rem;
    }
    
    .emoji {
      font-size: 1.2em;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🧪 App Lint Validation Dashboard</h1>
      <p>Real-time linting status for all game applications</p>
      <div class="stats">
        <div class="stat pass">
          <span class="stat-number">${results.passed}</span>
          <span class="stat-label">Passed</span>
        </div>
        <div class="stat fail">
          <span class="stat-number">${results.failed}</span>
          <span class="stat-label">Failed</span>
        </div>
        <div class="stat skip">
          <span class="stat-number">${results.skipped}</span>
          <span class="stat-label">Skipped</span>
        </div>
      </div>
    </div>
    
    ${
      passedApps.length > 0
        ? `
    <div class="section">
      <h2 class="section-title">
        <span class="emoji">✅</span>
        Passed (${passedApps.length})
      </h2>
      <div class="apps-grid">
        ${passedApps
          .map(
            (app) => `
        <div class="app-card">
          <div class="app-header pass">
            <div class="app-name">${app.appName}</div>
            <span class="app-status pass">Passed</span>
          </div>
          <div class="app-body">
            <p style="font-size: 0.9rem; color: #666; margin-bottom: 1rem;">Ready to launch</p>
            <a href="http://localhost:5173" class="app-link" target="_blank">
              🚀 Launch Dev Server
            </a>
            <br>
            <a href="http://localhost:5173" class="app-link" style="background: #764ba2;" target="_blank">
              📱 Open in Browser
            </a>
          </div>
        </div>
        `
          )
          .join('')}
      </div>
    </div>
    `
        : `<div class="section"><h2 class="section-title empty">✅ No passed apps yet</h2></div>`
    }
    
    ${
      failedApps.length > 0
        ? `
    <div class="section">
      <h2 class="section-title">
        <span class="emoji">❌</span>
        Failed (${failedApps.length})
      </h2>
      <div class="apps-grid">
        ${failedApps
          .map(
            (app) => `
        <div class="app-card">
          <div class="app-header fail">
            <div class="app-name">${app.appName}</div>
            <span class="app-status fail">Failed</span>
          </div>
          <div class="app-body">
            <p style="font-size: 0.9rem; color: #721c24;">Lint errors detected</p>
            <p style="font-size: 0.8rem; color: #666; margin-top: 0.5rem;">Fix linting issues before launching</p>
          </div>
        </div>
        `
          )
          .join('')}
      </div>
    </div>
    `
        : `<div class="section"><h2 class="section-title empty">❌ No failed apps</h2></div>`
    }
    
    ${
      skippedApps.length > 0
        ? `
    <div class="section">
      <h2 class="section-title">
        <span class="emoji">⏭️</span>
        Skipped (${skippedApps.length})
      </h2>
      <div class="apps-grid">
        ${skippedApps
          .map(
            (app) => `
        <div class="app-card">
          <div class="app-header skip">
            <div class="app-name">${app.appName}</div>
            <span class="app-status skip">Skipped</span>
          </div>
          <div class="app-body">
            <p style="font-size: 0.9rem; color: #383d41;">${app.reason}</p>
          </div>
        </div>
        `
          )
          .join('')}
      </div>
    </div>
    `
        : ''
    }
    
    <div class="footer">
      <p>Generated: ${new Date(results.timestamp).toLocaleString()}</p>
      <p style="margin-top: 0.5rem; font-size: 0.85rem;">
        💾 Results saved to: <code>/compliance/app-lint-results.json</code>
      </p>
    </div>
  </div>
</body>
</html>`
}
