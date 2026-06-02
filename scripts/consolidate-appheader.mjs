#!/usr/bin/env node
import { readdirSync, existsSync, writeFileSync } from 'fs'
import { join } from 'path'

const appDir = 'apps'
const dirs = readdirSync(appDir)

let updatedTs = 0

for (const dir of dirs) {
  const platformDir = join(appDir, dir, 'src/ui/organisms/platform')
  if (!existsSync(platformDir)) continue

  // Update AppHeader.tsx to re-export from @games/ui-utils
  const appHeaderTs = join(platformDir, 'AppHeader.tsx')
  if (existsSync(appHeaderTs)) {
    const content = 'export { AppHeader, type AppHeaderProps } from \'@games/ui-utils\'\n'
    writeFileSync(appHeaderTs, content, 'utf-8')
    updatedTs++
  }
}

console.log(`Total TypeScript files updated: ${updatedTs}`)
