# Apps Workspace

This directory contains independently releasable game applications.

## Conventions

- One game per folder: `apps/<game-name>`
- Each app has its own `package.json` and independent build scripts
- Each app must implement the monorepo script contract documented in `docs/monorepo/*`
- Each app outputs reports to `apps/<game-name>/reports/*`

## First Planned Absorption

- `apps/tictactoe`
