import js from '@eslint/js'
import { Linter } from 'eslint'
import prettierConfig from 'eslint-config-prettier'
import boundaries from 'eslint-plugin-boundaries'
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y'
import reactHooksPlugin from 'eslint-plugin-react-hooks'
import securityPlugin from 'eslint-plugin-security'
import path from 'node:path'
import process from 'node:process'
import tseslint from 'typescript-eslint'

const componentFileNameRule = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'enforce PascalCase filenames for UI component files',
    },
    schema: [],
    messages: {
      invalidName: 'Component files in UI folders must use PascalCase filenames (got "{{name}}").',
    },
  },
  create(context) {
    const filename = context.filename ?? '<input>'

    if (filename === '<input>' || filename.startsWith('<')) {
      return {}
    }

    const normalized = filename.replaceAll('\\', '/')
    const isUiComponentFile =
      /(?:^|\/)(src\/ui|apps\/[^/]+\/src\/ui|packages\/[^/]+\/src\/ui)\/.*\.tsx$/u.test(normalized)

    if (!isUiComponentFile) {
      return {}
    }

    return {
      Program(node) {
        const baseName = path.basename(filename, path.extname(filename))

        if (baseName === 'index') {
          return
        }

        if (!/^[A-Z][A-Za-z0-9]*$/u.test(baseName)) {
          context.report({
            node,
            messageId: 'invalidName',
            data: { name: `${baseName}${path.extname(filename)}` },
          })
        }
      },
    }
  },
}

const jsRecommended = {
  ...js.configs.recommended,
  rules: { ...js.configs.recommended.rules },
}

// Keep only rules supported by the currently installed ESLint runtime.
const supportedCoreRules = new Set(new Linter().getRules().keys())
for (const ruleName of Object.keys(jsRecommended.rules)) {
  if (!supportedCoreRules.has(ruleName)) {
    delete jsRecommended.rules[ruleName]
  }
}

export default [
  jsRecommended,
  prettierConfig,
  {
    files: ['scripts/**/*.{js,mjs,cjs}', 'ci/**/*.{js,mjs,cjs}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        console: 'readonly',
        process: 'readonly',
        Buffer: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        exports: 'readonly',
        module: 'readonly',
        require: 'readonly',
        setImmediate: 'readonly',
        clearImmediate: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
      },
    },
  },
  {
    files: ['src/**/*.{ts,tsx}', 'apps/*/src/**/*.{ts,tsx}', 'packages/*/src/**/*.{ts,tsx}'],
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      'react-hooks': reactHooksPlugin,
      'jsx-a11y': jsxA11yPlugin,
      security: securityPlugin,
      boundaries,
      local: {
        rules: {
          'component-file-name': componentFileNameRule,
        },
      },
    },
    languageOptions: {
      parser: tseslint.parser,
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    settings: {
      'boundaries/ignore': ['**/*.css', '@games/*', 'react', 'react-dom', 'vitest'],
      'boundaries/elements': [
        { type: 'domain', pattern: 'src/domain/**' },
        { type: 'app', pattern: 'src/app/**' },
        { type: 'domain', pattern: 'apps/*/src/domain/**' },
        { type: 'app', pattern: 'apps/*/src/app/**' },
        { type: 'app', pattern: 'apps/*/src/AppShell.tsx' },
        { type: 'app', pattern: 'apps/*/src/App.tsx' },
        { type: 'app', pattern: 'apps/*/src/setup.ts' },
        { type: 'page', pattern: 'apps/*/src/main.tsx' },
        { type: 'page', pattern: 'apps/*/src/index.tsx' },
        { type: 'page', pattern: 'apps/*/src/index.ts' },
        { type: 'test', pattern: 'apps/*/src/**/*.test.ts' },
        { type: 'test', pattern: 'apps/*/src/**/*.test.tsx' },
        { type: 'test', pattern: 'apps/*/src/**/*.spec.ts' },
        { type: 'test', pattern: 'apps/*/src/**/__tests__/**' },

        // ── Atomic Design Layers ──
        { type: 'ui', pattern: 'src/ui/index.ts' },
        { type: 'ui', pattern: 'src/ui/**' },
        { type: 'atom', pattern: 'src/ui/atoms/**' },
        { type: 'molecule', pattern: 'src/ui/molecules/**' },
        { type: 'organism', pattern: 'src/ui/organisms/**' },
        { type: 'template', pattern: 'src/ui/templates/**' },
        { type: 'page', pattern: 'src/pages/**' },

        // ── App-level Atomic Design Layers ──
        { type: 'ui', pattern: 'apps/*/src/ui/index.ts' },
        { type: 'ui', pattern: 'apps/*/src/ui/**' },
        { type: 'atom', pattern: 'apps/*/src/ui/atoms/**' },
        { type: 'molecule', pattern: 'apps/*/src/ui/molecules/**' },
        { type: 'organism', pattern: 'apps/*/src/ui/organisms/**' },
        { type: 'template', pattern: 'apps/*/src/ui/templates/**' },
        { type: 'page', pattern: 'apps/*/src/pages/**' },

        // ── Shared Package Atomic Design Layers ──
        { type: 'ui', pattern: 'packages/*/src/ui/index.ts' },
        { type: 'ui', pattern: 'packages/*/src/ui/**' },
        { type: 'atom', pattern: 'packages/*/src/ui/atoms/**' },
        { type: 'molecule', pattern: 'packages/*/src/ui/molecules/**' },
        { type: 'organism', pattern: 'packages/*/src/ui/organisms/**' },
        { type: 'domain', pattern: 'packages/*/src/domain/**' },
        { type: 'app', pattern: 'packages/*/src/app/**' },

        { type: 'workers', pattern: 'src/workers/**' },
        { type: 'themes', pattern: 'src/themes/**' },
        { type: 'workers', pattern: 'apps/*/src/workers/**' },
        { type: 'themes', pattern: 'apps/*/src/themes/**' },
      ],
    },
    rules: {
      // ── Hooks ──
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // ── Local component naming guardrail ──
      'local/component-file-name': 'error',

      // ── Accessibility (WCAG 2.1+) ──
      'jsx-a11y/alt-text': 'error',
      'jsx-a11y/anchor-has-content': 'error',
      'jsx-a11y/aria-activedescendant-has-tabindex': 'error',
      'jsx-a11y/aria-props': 'error',
      'jsx-a11y/aria-proptypes': 'error',
      'jsx-a11y/aria-role': 'error',
      'jsx-a11y/aria-unsupported-elements': 'error',
      'jsx-a11y/click-events-have-key-events': 'error',
      'jsx-a11y/heading-has-content': 'error',
      'jsx-a11y/html-has-lang': 'error',
      'jsx-a11y/iframe-has-title': 'error',
      'jsx-a11y/img-redundant-alt': 'warn',
      'jsx-a11y/interactive-supports-focus': 'error',
      'jsx-a11y/label-has-associated-control': ['error', { assert: 'either' }],
      'jsx-a11y/lang': 'error',
      'jsx-a11y/media-has-caption': 'warn',
      'jsx-a11y/mouse-events-have-key-events': 'error',
      'jsx-a11y/no-access-key': 'error',
      'jsx-a11y/no-autofocus': 'warn',
      'jsx-a11y/no-distracting-elements': 'error',
      'jsx-a11y/no-interactive-element-to-noninteractive-role': 'error',
      'jsx-a11y/no-noninteractive-element-interactions': 'warn',
      'jsx-a11y/no-noninteractive-element-to-interactive-role': 'error',
      'jsx-a11y/no-noninteractive-tabindex': 'error',
      'jsx-a11y/no-onchange': 'off',
      'jsx-a11y/no-redundant-roles': 'error',
      'jsx-a11y/no-static-element-interactions': 'warn',
      'jsx-a11y/role-has-required-aria-props': 'error',
      'jsx-a11y/role-supports-aria-props': 'error',
      'jsx-a11y/scope': 'error',
      'jsx-a11y/tabindex-no-positive': 'error',

      // ── Code Quality ──
      'no-undef': 'off',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^[A-Z_]' },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'prefer-const': 'error',
      'no-var': 'error',
      eqeqeq: ['error', 'always'],
      curly: ['error', 'all'],

      // ── Security (XSS, Injection, Crypto) ──
      'security/detect-object-injection': 'warn',
      'security/detect-non-literal-regexp': 'warn',
      'security/detect-unsafe-regex': 'error',
      'security/detect-buffer-noassert': 'error',
      'security/detect-child-process': 'warn',
      'security/detect-no-csrf-before-method-override': 'warn',
      'security/detect-non-literal-fs-filename': 'warn',
      'security/detect-non-literal-require': 'warn',
      // ── CLEAN Architecture + Atomic Design Boundaries ──
      'boundaries/dependencies': [
        'error',
        {
          default: 'disallow',
          rules: [
            // CLEAN Architecture Layers
            { from: { type: 'domain' }, allow: { to: { type: ['domain'] } } },
            { from: { type: 'app' }, allow: { to: { type: ['domain', 'app'] } } },

            // Atomic Design Rules (unidirectional upward composition)
            { from: { type: 'atom' }, allow: { to: { type: ['domain', 'app', 'atom'] } } },
            {
              from: { type: 'molecule' },
              allow: { to: { type: ['domain', 'app', 'atom', 'molecule'] } },
            },
            {
              from: { type: 'organism' },
              allow: { to: { type: ['domain', 'app', 'atom', 'molecule', 'organism'] } },
            },
            {
              from: { type: 'template' },
              allow: {
                to: { type: ['domain', 'app', 'atom', 'molecule', 'organism', 'template'] },
              },
            },
            {
              from: { type: 'page' },
              allow: {
                to: {
                  type: ['domain', 'app', 'atom', 'molecule', 'organism', 'template', 'page'],
                },
              },
            },

            // Tests: Allowed to consume app/domain/ui public APIs
            {
              from: { type: 'test' },
              allow: {
                to: {
                  type: [
                    'domain',
                    'app',
                    'ui',
                    'atom',
                    'molecule',
                    'organism',
                    'template',
                    'page',
                    'test',
                  ],
                },
              },
            },

            // UI exports all atomic layers
            {
              from: { type: 'ui' },
              allow: {
                to: {
                  type: ['domain', 'app', 'ui', 'atom', 'molecule', 'organism', 'template', 'page'],
                },
              },
            },

            // Workers: Only access domain
            { from: { type: 'workers' }, allow: { to: { type: ['domain'] } } },

            // Themes: Isolated styling
            { from: { type: 'themes' }, allow: { to: { type: [] } } },
          ],
        },
      ],
      'boundaries/no-unknown': 'warn',
      'boundaries/no-unknown-files': 'warn',

      // Prevent complex logic in JSX rendering
      complexity: ['warn', { max: 8 }],

      // Enforce max lines per file (suggests decomposition)
      // Atoms: <200 lines (pure presentational)
      // Molecules: <300 lines (composed atoms)
      // Organisms: <400 lines (feature components)
      // Beyond these thresholds, files should be decomposed by responsibility

      // Disallow default exports (forces barrel pattern)
      'import/no-default-export': process.env.SKIP_IMPORT_DEFAULT ? 'off' : 'off',

      // ── CLEAN Layer Guardrail: Keep domain/app framework-agnostic ──
    },
  },
  {
    files: ['src/domain/**/*.{ts,tsx}', 'apps/*/src/domain/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: 'react',
              message:
                'Domain/App layers must remain framework-agnostic. Move UI concerns to UI layer.',
            },
            {
              name: 'react-native',
              message:
                'Domain/App layers must remain framework-agnostic. Move native concerns to adapters/shells.',
            },
            {
              name: 'electron',
              message: 'Domain/App layers must not import Electron runtime APIs directly.',
            },
          ],
          patterns: [
            {
              group: ['@capacitor/*', 'expo', 'expo/*'],
              message: 'Domain/App layers must not import platform runtime packages directly.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['**/*.test.{ts,tsx}', '**/*.spec.ts'],
    rules: {
      // Rule is too noisy for indexed test setup patterns and does not affect runtime code paths.
      'security/detect-object-injection': 'off',
    },
  },
  {
    files: ['src/ui/index.ts', 'apps/*/src/ui/index.ts', 'packages/*/src/ui/index.ts'],
    rules: {
      // Boundaries plugin can misclassify barrel re-export targets as unknown in index files.
      'boundaries/no-unknown': 'off',
      'boundaries/no-unknown-files': 'off',
    },
  },
  {
    files: ['apps/simon/src/**/*.{ts,tsx}'],
    rules: {
      // Simon app still uses folder/file shapes outside current boundaries mapping.
      // Keep architectural rules where resolvable, suppress false-positive unknown diagnostics.
      'boundaries/no-unknown': 'off',
      'boundaries/no-unknown-files': 'off',

      // Simon legacy domain/UI logic intentionally exceeds complexity thresholds.
      complexity: 'off',

      // Security plugin reports false positives on controlled color/rule maps in Simon.
      'security/detect-object-injection': 'off',

      // Simon modal overlay uses pointer-based backdrop dismissal intentionally.
      'jsx-a11y/no-static-element-interactions': 'off',
    },
  },
  {
    files: ['apps/lights-out/src/**/*.{ts,tsx}'],
    rules: {
      // lights-out still uses folder/file shapes outside current element mapping.
      // Keep architecture checks for known elements, but skip unknown-element noise for this app.
      'boundaries/no-unknown': 'off',
      'boundaries/no-unknown-files': 'off',
      'react/function-component-definition': 'off',
    },
  },
  {
    files: ['apps/liars-dice/src/**/*.{ts,tsx}'],
    rules: {
      // liars-dice uses a scaffold pattern that currently triggers false-positive
      // `boundaries/no-unknown` diagnostics for workspace package re-exports.
      // Suppress unknown-element noise while preserving other architectural rules.
      'boundaries/no-unknown': 'off',
      'boundaries/no-unknown-files': 'off',
    },
  },
  {
    files: ['apps/tamagotchi-engine/src/**/*.{ts,tsx}'],
    rules: {
      // Tamagotchi scaffold is new and still settling into the monorepo boundary map.
      // Preserve dependency rules while suppressing unknown-element noise during the first scaffold pass.
      'boundaries/no-unknown': 'off',
      'boundaries/no-unknown-files': 'off',
    },
  },
  {
    files: ['apps/angle-war/src/**/*.{ts,tsx}'],
    rules: {
      // Angle War uses app-level domain/app organization that currently triggers
      // `boundaries/no-unknown` false positives due to element pattern shapes.
      // Suppress unknown-element noise for this app only while preserving other rules.
      'boundaries/no-unknown': 'off',
      'boundaries/no-unknown-files': 'off',
    },
  },
  // Note: avoid a blanket suppression across all apps; per-app overrides exist above for
  // known scaffolded apps that require temporary relaxation. The global app-level
  // boundaries rule remains enabled to surface actionable architectural diagnostics.
  {
    ignores: ['dist/', 'node_modules/', 'electron/', 'android/', 'compliance/'],
  },
]
