#!/usr/bin/env node
import { readdirSync, existsSync, rmSync, writeFileSync } from 'fs'
import { join } from 'path'

const appDir = 'apps'
const dirs = readdirSync(appDir)

let removedCss = 0
let updatedTs = 0

for (const dir of dirs) {
  const platformDir = join(appDir, dir, 'src/ui/organisms/platform')
  if (!existsSync(platformDir)) continue

  // Remove CSS files
  const hamburgerCss = join(platformDir, 'HamburgerMenu.module.css')
  const featureCss = join(platformDir, 'FeatureShell.module.css')

  if (existsSync(hamburgerCss)) {
    rmSync(hamburgerCss)
    removedCss++
  }

  if (existsSync(featureCss)) {
    rmSync(featureCss)
    removedCss++
  }

  // Update HamburgerMenu.tsx to re-export from @games/ui-utils
  const hamburgerTs = join(platformDir, 'HamburgerMenu.tsx')
  if (existsSync(hamburgerTs)) {
    const content = 'export { HamburgerMenu, type HamburgerMenuProps, type MenuAction } from \'@games/ui-utils\'\n'
    writeFileSync(hamburgerTs, content, 'utf-8')
    updatedTs++
  }

  // Update FeatureShell.tsx to re-export from @games/ui-utils
  const featureTs = join(platformDir, 'FeatureShell.tsx')
  if (existsSync(featureTs)) {
    const content = 'export { FeatureShell, type FeatureShellProps } from \'@games/ui-utils\'\n'
    writeFileSync(featureTs, content, 'utf-8')
    updatedTs++
  }
}

console.log(`Total CSS files removed: ${removedCss}`)
console.log(`Total TypeScript files updated: ${updatedTs}`)
