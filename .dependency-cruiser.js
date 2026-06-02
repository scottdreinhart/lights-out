const config = {
  forbidden: [
    {
      name: 'no-domain-to-app',
      severity: 'error',
      comment: 'Domain must stay framework-agnostic and cannot import app.',
      from: { path: '^src/domain' },
      to: { path: '^src/app' },
    },
    {
      name: 'no-domain-to-ui',
      severity: 'error',
      comment: 'Domain must not import UI.',
      from: { path: '^src/domain' },
      to: { path: '^src/ui' },
    },
    {
      name: 'no-workers-to-ui',
      severity: 'error',
      comment: 'Workers must not import UI.',
      from: { path: '^src/workers' },
      to: { path: '^src/ui' },
    },
    {
      name: 'no-workers-to-app',
      severity: 'error',
      comment: 'Workers must not import app layer.',
      from: { path: '^src/workers' },
      to: { path: '^src/app' },
    },
  ],
  options: {
    doNotFollow: { path: 'node_modules' },
    includeOnly: '^src',
    tsConfig: { fileName: 'tsconfig.json' },
  },
}

export default config
