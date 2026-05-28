#!/usr/bin/env node
import { readdirSync, rmSync, existsSync } from 'fs'
import { join } from 'path'

const appDir = '/mnt/d/src/game-platform/apps'
const dirs = readdirSync(appDir)

let removed = 0
for (const dir of dirs) {
  const modalPath = join(appDir, dir, 'src/ui/organisms/platform/Modal.module.css')
  if (existsSync(modalPath)) {
    try {
      rmSync(modalPath)
      console.log(`Removed: ${modalPath}`)
      removed++
    } catch (e) {
      console.error(`Failed to remove: ${modalPath}`, e.message)
    }
  }
}

console.log(`\nTotal files removed: ${removed}`)
