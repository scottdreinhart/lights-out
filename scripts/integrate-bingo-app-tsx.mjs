#!/usr/bin/env node

/**
 * Bingo HamburgerMenu App.tsx Integration Script
 * Integrates HamburgerMenu into App.tsx for ready bingo games
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const appsDir = path.join(__dirname, '..', 'apps')

const GAMES = ['bingo-30', 'bingo-80', 'bingo-pattern', 'bingo-progressive']

function updateAppTsx(gameName) {
  const appTsxPath = path.join(appsDir, gameName, 'src/ui/organisms/App.tsx')
  
  if (!fs.existsSync(appTsxPath)) {
    console.log(`  ❌ App.tsx not found: ${appTsxPath}`)
    return false
  }

  let content = fs.readFileSync(appTsxPath, 'utf-8')
  
  // Check if already integrated
  if (content.includes('HamburgerMenu')) {
    console.log(`  ⏭️  HamburgerMenu already integrated`)
    return false
  }

  // 1. Add HamburgerMenu import to existing imports
  const importRegex = /^import\s*{([^}]+)}\s*from\s*['"]@\/ui\/organisms['"][;\n]/m
  const match = content.match(importRegex)
  
  if (match) {
    const imports = match[1]
    if (!imports.includes('HamburgerMenu')) {
      const newImports = imports.trim().endsWith(',') 
        ? `${imports}\n  HamburgerMenu,`
        : `${imports},\n  HamburgerMenu,`
      content = content.replace(match[0], `import {\n${newImports}\n} from '@/ui/organisms';\n`)
      console.log(`  ✅ Added HamburgerMenu import`)
    }
  } else {
    console.log(`  ⚠️  Could not find @/ui/organisms import - skipping`)
    return false
  }

  // 2. Add modal state variables after cardCount
  const statePattern = /const \[cardCount, setCardCount\] = useState\(1\)/
  if (content.match(statePattern) && !content.includes('const [showRules')) {
    content = content.replace(
      statePattern,
      `const [cardCount, setCardCount] = useState(1)
  const [showRules, setShowRules] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showAbout, setShowAbout] = useState(false)`
    )
    console.log(`  ✅ Added modal state variables`)
  }

  // 3. Add HamburgerMenu to header (find the main return statement)
  if (!content.includes('HamburgerMenu') && content.includes('bingoContainer')) {
    // Simple structure - add after h1 or in controls area
    content = content.replace(
      /(<h1[^>]*>[^<]*<\/h1>)/,
      `$1
        <HamburgerMenu
          onRules={() => setShowRules(true)}
          onSettings={() => setShowSettings(true)}
          onAbout={() => setShowAbout(true)}
        />`
    )
    console.log(`  ✅ Added HamburgerMenu to header`)
  }

  // 4. Add modal components before final closing tag
  if (!content.includes('showRules &&')) {
    const closingDiv = /(  <\/div>)\n\)$/m
    const modalsHtml = `      {showRules && (
        <div onClick={() => setShowRules(false)} style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div onClick={e => e.stopPropagation()} style={{
            backgroundColor: 'white', padding: '2rem', borderRadius: '0.5rem',
            maxWidth: '500px', maxHeight: '80vh', overflow: 'auto'
          }}>
            <h2>How to Play Bingo</h2>
            <p>Mark off numbers on your cards as they are called. Form patterns to win.</p>
            <button onClick={() => setShowRules(false)}>Close</button>
          </div>
        </div>
      )}
      {showSettings && (
        <div onClick={() => setShowSettings(false)} style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div onClick={e => e.stopPropagation()} style={{
            backgroundColor: 'white', padding: '2rem', borderRadius: '0.5rem',
            maxWidth: '500px', maxHeight: '80vh', overflow: 'auto'
          }}>
            <h2>Settings</h2>
            <p>Game settings and preferences.</p>
            <button onClick={() => setShowSettings(false)}>Close</button>
          </div>
        </div>
      )}
      {showAbout && (
        <div onClick={() => setShowAbout(false)} style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div onClick={e => e.stopPropagation()} style={{
            backgroundColor: 'white', padding: '2rem', borderRadius: '0.5rem',
            maxWidth: '500px', maxHeight: '80vh', overflow: 'auto'
          }}>
            <h2>About</h2>
            <p>Bingo Game on the Game Platform</p>
            <button onClick={() => setShowAbout(false)}>Close</button>
          </div>
        </div>
      )`
    
    content = content.replace(closingDiv, `      $1\n${modalsHtml}\n    )`)
    console.log(`  ✅ Added modal components`)
  }

  fs.writeFileSync(appTsxPath, content)
  console.log(`  ✅ Updated App.tsx`)
  return true
}

console.log('\n📋 BINGO APP.TSX HAMBURGER MENU INTEGRATION\n')

for (const game of GAMES) {
  console.log(`📦 ${game}`)
  try {
    updateAppTsx(game)
  } catch (err) {
    console.log(`  ❌ Error: ${err.message}`)
  }
}

console.log('\n✅ Integration complete. Run: pnpm lint to validate.\n')
