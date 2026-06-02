#!/usr/bin/env node
/* eslint-disable no-undef */

import fs from 'node:fs'
import path from 'node:path'
import zlib from 'node:zlib'

// ANSI color codes
const COLORS = {
  CYAN: '\x1b[96m',
  GREEN: '\x1b[92m',
  RED: '\x1b[91m',
  BLUE: '\x1b[94m',
  RESET: '\x1b[0m',
  BOLD: '\x1b[1m',
}

const distDir = path.resolve(process.cwd(), 'dist')
const targetExtensions = new Set(['.js', '.css', '.html'])

const listFiles = (dir) => {
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  return entries.flatMap((entry) => {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      return listFiles(fullPath)
    }
    return [fullPath]
  })
}

const writeCompressedPair = (filePath) => {
  const source = fs.readFileSync(filePath)
  const gzip = zlib.gzipSync(source, { level: zlib.constants.Z_BEST_COMPRESSION })
  const brotli = zlib.brotliCompressSync(source, {
    params: {
      [zlib.constants.BROTLI_PARAM_QUALITY]: 11,
    },
  })

  fs.writeFileSync(`${filePath}.gz`, gzip)
  fs.writeFileSync(`${filePath}.br`, brotli)
}

if (!fs.existsSync(distDir)) {
  console.error(`${COLORS.RED}${COLORS.BOLD}❌ dist directory not found at ${distDir}${COLORS.RESET}`)
  process.exit(1)
}

const candidates = listFiles(distDir).filter((filePath) => targetExtensions.has(path.extname(filePath)))
for (const filePath of candidates) {
  writeCompressedPair(filePath)
}

console.log(`${COLORS.GREEN}✅ Compression complete: generated .gz and .br for ${candidates.length} files.${COLORS.RESET}`)
