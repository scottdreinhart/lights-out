import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import reactPlugin from 'eslint-plugin-react'
import reactHooksPlugin from 'eslint-plugin-react-hooks'
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y'
import securityPlugin from 'eslint-plugin-security'
import prettierConfig from 'eslint-config-prettier'
import boundaries from 'eslint-plugin-boundaries'

export default [
  js.configs.recommended,
  prettierConfig,
  {
    files: ['src/**/*.{ts,tsx}', 'apps/*/src/**/*.{ts,tsx}', 'packages/*/src/**/*.{ts,tsx}'],
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      'jsx-a11y': jsxA11yPlugin,
      security: securityPlugin,
      boundaries,
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
      react: { version: 'detect' },
      'boundaries/elements': [
        { type: 'domain', pattern: 'src/domain/*' },
        { type: 'app', pattern: 'src/app/*' },
        
        // ── Atomic Design Layers ──
        { type: 'atom', pattern: 'src/ui/atoms/**' },
        { type: 'molecule', pattern: 'src/ui/molecules/**' },
        { type: 'organism', pattern: 'src/ui/organisms/**' },
        { type: 'template', pattern: 'src/ui/templates/**' },
        { type: 'page', pattern: 'src/pages/**' },
        
        // ── App-level Atomic Design Layers ──
        { type: 'atom', pattern: 'apps/*/src/ui/atoms/**' },
        { type: 'molecule', pattern: 'apps/*/src/ui/molecules/**' },
        { type: 'organism', pattern: 'apps/*/src/ui/organisms/**' },
        { type: 'template', pattern: 'apps/*/src/ui/templates/**' },
        { type: 'page', pattern: 'apps/*/src/pages/**' },
        
        // ── Shared Package Atomic Design Layers ──
        { type: 'atom', pattern: 'packages/*/src/ui/atoms/**' },
        { type: 'molecule', pattern: 'packages/*/src/ui/molecules/**' },
        { type: 'organism', pattern: 'packages/*/src/ui/organisms/**' },
        { type: 'domain', pattern: 'packages/*/src/domain/*' },
        { type: 'app', pattern: 'packages/*/src/app/*' },
        
        { type: 'workers', pattern: 'src/workers/*' },
        { type: 'themes', pattern: 'src/themes/*' },
      ],
    },
    rules: {
      // ── React ──
      'react/jsx-uses-vars': 'error',
      'react/react-in-jsx-scope': 'off',
      'react/no-unescaped-entities': 'error',
      'react/prop-types': 'off', // Using TS

      // ── Hooks ──
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

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
      'boundaries/element-types': [
        'error',
        {
          default: 'disallow',
          rules: [
            // CLEAN Architecture Layers
            { from: 'domain', allow: ['domain'] },
            { from: 'app', allow: ['domain', 'app'] },
            
            // Atomic Design Rules (unidirectional upward composition)
            // Atoms: Pure presentational primitives
            { from: 'atom', allow: ['domain', 'app', 'atom'] },
            
            // Molecules: Compose atoms, access domain/app
            { from: 'molecule', allow: ['domain', 'app', 'atom', 'molecule'] },
            
            // Organisms: Compose molecules/atoms, access domain/app
            { from: 'organism', allow: ['domain', 'app', 'atom', 'molecule', 'organism'] },
            
            // Templates: Page-level composition (organisms + atoms/molecules)
            { from: 'template', allow: ['domain', 'app', 'atom', 'molecule', 'organism', 'template'] },
            
            // Pages: Full page applications (templates + everything)
            { from: 'page', allow: ['domain', 'app', 'atom', 'molecule', 'organism', 'template', 'page'] },
            
            // UI exports all atomic layers
            { from: 'ui', allow: ['domain', 'app', 'ui', 'atom', 'molecule', 'organism', 'template', 'page'] },
            
            // Workers: Only access domain
            { from: 'workers', allow: ['domain'] },
            
            // Themes: Isolated styling
            { from: 'themes', allow: [] },
          ],
        },
      ],
      'boundaries/no-unknown': 'error',
      'boundaries/no-unknown-files': 'warn',
      
      // ── Atomic Design Enforcement: Component Responsibility ──
      // Atoms should not compose other atoms into complex hierarchies
      'react/function-component-definition': [
        'warn',
        { namedComponents: 'arrow-function', unnamedComponents: 'arrow-function' },
      ],
      
      // Prevent overly complex JSX (violation of separation of concerns)
      'react/no-array-index-key': 'error',
      'react/no-danger': 'error',
      'react/no-danger-with-children': 'error',
      'react/no-string-refs': 'error',
      'react/no-will-update-set-state': 'error',
      'react/prefer-stateless-function': 'warn',
      
      // Enforce proper memo usage for pure presentational components
      'react/display-name': 'warn',
      
      // Prevent complex logic in JSX rendering
      'complexity': ['warn', { max: 8 }],
      
      // Enforce max lines per file (suggests decomposition)
      // Atoms: <200 lines (pure presentational)
      // Molecules: <300 lines (composed atoms)
      // Organisms: <400 lines (feature components)
      // Beyond these thresholds, files should be decomposed by responsibility
      
      // Disallow default exports (forces barrel pattern)
      'import/no-default-export': process.env.SKIP_IMPORT_DEFAULT ? 'off' : 'off',

      // ── CLEAN Layer Guardrail: Keep domain/app framework-agnostic ──
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: 'react',
              message: 'Domain/App layers must remain framework-agnostic. Move UI concerns to UI layer.',
            },
            {
              name: 'react-native',
              message: 'Domain/App layers must remain framework-agnostic. Move native concerns to adapters/shells.',
            },
            {
              name: 'electron',
              message: 'Domain/App layers must not import Electron runtime APIs directly.',
            },
            {
              name: '@capacitor/core',
              message: 'Domain/App layers must not import Capacitor runtime APIs directly.',
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
    ignores: ['dist/', 'node_modules/', 'electron/', 'android/', 'compliance/'],
  },
]
