module.exports = {
  forbidden: [
    // Cross-layer imports
    {
      from: ['src/ui'],
      to: ['src/app'],
      message:
        '❌ UI (presentation) cannot import from app (state/hooks). Use props or context instead.',
    },
    {
      from: ['src/ui'],
      to: ['src/domain'],
      message: '❌ UI cannot import domain directly. Pass domain data through app layer via hooks.',
    },
    {
      from: ['src/domain'],
      to: ['src/app'],
      message: '❌ Domain (framework-agnostic) cannot import app (React). Keep domain pure.',
    },
    {
      from: ['src/domain'],
      to: ['src/ui'],
      message: '❌ Domain cannot import UI. Domain is framework-agnostic.',
    },
    {
      from: ['src/workers'],
      to: ['src/ui'],
      message: '❌ Workers cannot import UI. Use message passing only.',
    },
    {
      from: ['src/workers'],
      to: ['src/app'],
      message: '❌ Workers should not import app layer. Limit to domain only.',
    },

    // Relative cross-layer imports
    {
      from: ['src/ui'],
      to: ['../../app', '../../domain'],
      message: '❌ Use path aliases @/app and @/domain, not relative imports.',
    },
    {
      from: ['src/app'],
      to: ['../../domain', '../../ui'],
      message: '❌ Use path aliases @/domain and @/ui, not relative imports.',
    },

    // Internal file imports (must use barrel)
    {
      from: ['src'],
      to: ['**/index.ts'],
      message: "⚠️  Import from barrel (index.ts), but verify you're not importing deep internals.",
    },
  ],

  allowed: [
    // Correct layer hierarchy
    ['src/ui', 'src/ui'], // UI can reference itself
    ['src/app', 'src/app'], // App can reference itself
    ['src/app', 'src/domain'], // App can use domain
    ['src/ui', 'src/app'], // UI can reference app (via hooks/context)
    ['src/domain', 'src/domain'], // Domain can reference itself
    ['src/workers', 'src/domain'], // Workers can reference domain only
  ],

  errorLevel: 'error',

  options: {
    ignoreDeprecations: false,
    reportLoop: true,
  },
}
