#!/usr/bin/env node

/**
 * Automated Lighthouse Accessibility Test
 * Runs accessibility audit on localhost:5173 and outputs JSON + HTML report
 * Usage: pnpm test:lighthouse
 */

import { spawn } from 'child_process'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

async function runLighthouse() {
  const URL = 'http://localhost:5173'
  const reportDir = path.join(process.cwd(), '.lighthouse-reports')

  if (!fs.existsSync(reportDir)) {
    fs.mkdirSync(reportDir, { recursive: true })
  }

  const timestamp = new Date().toISOString().split('T')[0].replace(/-/g, '') + '_' + Date.now()
  const jsonFile = path.join(reportDir, `lighthouse-${timestamp}.json`)
  const htmlFile = path.join(reportDir, `lighthouse-${timestamp}.html`)

  console.log('🎯 Starting Lighthouse accessibility audit...')
  console.log(`📍 Testing URL: ${URL}`)
  console.log(`📁 Reports will be saved to: ${reportDir}\n`)

  return new Promise((resolve, reject) => {
    const lighthouse = spawn('pnpm', [
      'exec',
      'lighthouse',
      URL,
      '--only-categories=accessibility',
      `--output-path=${jsonFile.replace(/\.json$/, '')}`,
      '--output=json,html',
      '--chrome-flags="--headless"',
    ])

    let output = ''
    let error = ''

    lighthouse.stdout.on('data', (data) => {
      output += data.toString()
      process.stdout.write(data)
    })

    lighthouse.stderr.on('data', (data) => {
      error += data.toString()
      process.stderr.write(data)
    })

    lighthouse.on('close', (code) => {
      if (code === 0) {
        try {
          const extension = fs.existsSync(jsonFile) ? '.json' : '.json'
          const actualJsonFile = jsonFile.replace(/\.json$/, '') + extension
          
          if (fs.existsSync(actualJsonFile)) {
            const report = JSON.parse(fs.readFileSync(actualJsonFile, 'utf-8'))
            const score = Math.round(report.categories.accessibility.score * 100)

            console.log('\n✅ Audit Complete!\n')
            console.log(`📊 Accessibility Score: ${score}/100`)

            if (score >= 90) {
              console.log('🟢 PASS: Score meets WCAG AA threshold (90+)\n')
            } else {
              console.log('🟡 WARNING: Score below 90\n')
            }

            console.log(`📄 Reports saved:`)
            console.log(`   JSON: ${actualJsonFile}`)
            
            const htmlPattern = path.join(reportDir, `lighthouse-${timestamp}*.html`)
            const htmlGlob = require('child_process').execSync(`ls ${htmlPattern} 2>/dev/null || echo ""`, { encoding: 'utf-8' }).trim()
            if (htmlGlob) {
              console.log(`   HTML: ${htmlGlob}`)
            }

            resolve(score)
          } else {
            console.error('Could not find generated report file')
            reject(new Error('Report file not found'))
          }
        } catch (e) {
          console.error('Error parsing report:', e)
          reject(e)
        }
      } else {
        console.error(`❌ Lighthouse failed with code ${code}`)
        reject(new Error(`Lighthouse exited with code ${code}`))
      }
    })
  })
}

runLighthouse()
  .then((score) => {
    process.exit(score >= 90 ? 0 : 1)
  })
  .catch((e) => {
    console.error('❌ Error:', e.message)
    process.exit(1)
  })
