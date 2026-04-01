#!/usr/bin/env node

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');
const appsDir = join(rootDir, 'apps');

const standardTemplate = {
  name: '', // will be set per app
  version: '1.0.0',
  description: '', // will be set per app
  type: 'module',
  private: true,
  license: 'PROPRIETARY',
  author: 'Scott Reinhart',
  packageManager: 'pnpm@10.31.0',
  engines: {
    node: '24.14.0',
    pnpm: '10.31.0'
  },
  main: 'electron/main.js',
  scripts: {
    start: 'pnpm exec vite --host',
    dev: 'pnpm exec kill-port 5173 || true; pnpm exec vite --host',
    build: 'pnpm exec vite build',
    'web:build': 'pnpm build',
    preview: 'pnpm exec vite preview',
    'build:preview': 'pnpm build && pnpm preview',
    lint: 'pnpm exec eslint src/',
    'lint:fix': 'pnpm exec eslint src/ --fix',
    format: 'pnpm exec prettier --write src/',
    'format:check': 'pnpm exec prettier --check src/',
    typecheck: 'pnpm exec tsc',
    test: 'pnpm exec vitest run',
    'test:watch': 'pnpm exec vitest',
    check: 'pnpm lint && pnpm format:check && pnpm typecheck',
    fix: 'pnpm lint:fix && pnpm format',
    validate: 'pnpm check && pnpm build',
    clean: 'pnpm exec rimraf dist release',
    'clean:node': 'pnpm exec rimraf node_modules',
    'clean:all': 'pnpm exec rimraf dist release node_modules',
    reinstall: 'pnpm clean:all && pnpm install',
    prebuild: 'pnpm clean',
    'electron:dev': 'pnpm exec concurrently -k "pnpm exec vite" "pnpm exec wait-on http://localhost:5173 && pnpm exec electron ."',
    'electron:build': 'pnpm exec vite build && pnpm exec electron-builder',
    'electron:build:win': 'pnpm exec vite build && pnpm exec electron-builder --win',
    'electron:build:linux': 'pnpm exec vite build && pnpm exec electron-builder --linux',
    'electron:build:mac': 'pnpm exec vite build && pnpm exec electron-builder --mac',
    'electron:preview': 'pnpm build && pnpm exec electron .',
    'cap:init:android': 'pnpm exec cap add android',
    'cap:init:ios': 'pnpm exec cap add ios',
    'cap:sync': 'pnpm exec vite build && pnpm exec cap sync',
    'cap:build:android': 'pnpm cap:sync',
    'cap:build:ios': 'pnpm cap:sync',
    'cap:open:android': 'pnpm exec cap open android',
    'cap:open:ios': 'pnpm exec cap open ios',
    'cap:run:android': 'pnpm exec cap run android',
    'cap:run:ios': 'pnpm exec cap run ios',
    'wasm:build': 'pnpm exec asc assembly/index.ts --target release',
    'wasm:build:debug': 'pnpm exec asc assembly/index.ts --target debug',
    'report:all': 'pnpm report:lint && pnpm report:typecheck && pnpm report:test && pnpm report:coverage && pnpm report:a11y && pnpm report:lighthouse && pnpm report:security && pnpm report:build',
    'report:lint': 'echo "Lint Report:" && pnpm lint || echo "Lint failed"',
    'report:typecheck': 'echo "Typecheck Report:" && pnpm typecheck || echo "Typecheck failed"',
    'report:test': 'echo "Test Report:" && pnpm test || echo "Test failed"',
    'report:coverage': 'echo "Coverage Report:" && pnpm test:coverage || echo "Coverage failed"',
    'report:a11y': 'echo "Accessibility Report:" && pnpm test:a11y || echo "A11y failed"',
    'report:lighthouse': 'echo "Lighthouse Report:" && pnpm lighthouse || echo "Lighthouse failed"',
    'report:security': 'echo "Security Report:" && pnpm audit || echo "Security failed"',
    'report:build': 'echo "Build Report:" && pnpm build || echo "Build failed"'
  },
  dependencies: {
    'react': '19.2.4',
    'react-dom': '19.2.4'
  },
  devDependencies: {
    '@types/react': '19.2.4',
    '@types/react-dom': '19.2.4',
    '@typescript-eslint/eslint-plugin': '8.57.0',
    '@typescript-eslint/parser': '8.57.0',
    '@vitejs/plugin-react': '4.3.3',
    'assemblyscript': '0.28.10',
    'concurrently': '9.2.1',
    'electron': '40.8.0',
    'electron-builder': '26.8.1',
    'eslint': '10.0.3',
    'eslint-plugin-boundaries': '1.1.0',
    'eslint-plugin-react-hooks': '5.1.0',
    'eslint-plugin-react-refresh': '0.4.16',
    'prettier': '3.8.1',
    'rimraf': '6.1.3',
    'typescript': '5.9.3',
    'vite': '7.3.1',
    'vitest': '4.0.18',
    'wait-on': '8.0.1'
  }
};

function pinVersions(obj) {
  for (const key in obj) {
    if (typeof obj[key] === 'string' && obj[key].startsWith('^')) {
      obj[key] = obj[key].slice(1);
    }
  }
}

function syncPackageJson(appPath) {
  const packagePath = join(appPath, 'package.json');
  const packageJson = JSON.parse(readFileSync(packagePath, 'utf8'));

  // Set name and description if not present
  if (!packageJson.name) {
    const appName = appPath.split('/').pop();
    packageJson.name = `@games/${appName}`;
  }
  if (!packageJson.description) {
    packageJson.description = `${packageJson.name} game`;
  }

  // Add standard fields
  packageJson.type = 'module';
  packageJson.private = true;
  packageJson.license = 'PROPRIETARY';
  packageJson.author = 'Scott Reinhart';
  packageJson.packageManager = 'pnpm@10.31.0';
  packageJson.engines = {
    node: '24.14.0',
    pnpm: '10.31.0'
  };
  packageJson.main = 'electron/main.js';

  // Add standard scripts
  packageJson.scripts = { ...standardTemplate.scripts, ...packageJson.scripts };

  // Pin dependencies
  if (packageJson.dependencies) {
    pinVersions(packageJson.dependencies);
  }
  if (packageJson.devDependencies) {
    pinVersions(packageJson.devDependencies);
  }

  // Remove onlyBuiltDependencies
  delete packageJson.onlyBuiltDependencies;

  // Ensure dependencies are present
  packageJson.dependencies = { ...standardTemplate.dependencies, ...packageJson.dependencies };
  packageJson.devDependencies = { ...standardTemplate.devDependencies, ...packageJson.devDependencies };

  // Write back
  writeFileSync(packagePath, JSON.stringify(packageJson, null, 2) + '\n');
  console.log(`Synced ${packagePath}`);
}

function main() {
  const apps = readdirSync(appsDir).filter(item => statSync(join(appsDir, item)).isDirectory());
  for (const app of apps) {
    const appPath = join(appsDir, app);
    const packagePath = join(appPath, 'package.json');
    if (statSync(packagePath).isFile()) {
      syncPackageJson(appPath);
    }
  }
  console.log('Synchronization complete.');
}

main();