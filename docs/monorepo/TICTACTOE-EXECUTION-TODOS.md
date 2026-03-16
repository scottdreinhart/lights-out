# TicTacToe Absorption — Execution TODOs

Status values: `todo` | `in-progress` | `blocked` | `done`

## Sprint Board

| ID | Status | Task | Owner | Command / Artifact | Done When |
|---|---|---|---|---|---|
| T-001 | todo | Create migration branch | @you | `git checkout -b feat/monorepo-absorb-tictactoe` | Branch exists |
| T-002 | todo | Tag rollback point | @you | `git tag monorepo-pre-tictactoe` | Tag visible in `git tag` |
| T-003 | done | Copy source repo into app package | @you | `rsync -av --exclude='.git' --exclude='node_modules' --exclude='dist' --exclude='coverage' --exclude='release' ../tictactoe/ apps/tictactoe/` | `apps/tictactoe/package.json` exists |
| T-004 | done | Set package identity | @you | edit `apps/tictactoe/package.json` name → `@games/tictactoe` | `pnpm --filter @games/tictactoe` resolves |
| T-005 | done | Add missing script aliases | @you | add `web:build`, `cap:build:android`, `cap:build:ios` | scripts present in package.json |
| T-006 | done | Add report scripts | @you | add `report:lint/typecheck/test/coverage/a11y/lighthouse/security/build` | all `report:*` scripts present |
| T-007 | done | Create report dirs | @you | `mkdir -p apps/tictactoe/reports/{lint,typecheck,test,coverage,a11y,lighthouse,security,build}` | all folders exist |
| T-008 | done | Validate core contract | @you | `pnpm --filter @games/tictactoe lint && pnpm --filter @games/tictactoe typecheck && pnpm --filter @games/tictactoe test && pnpm --filter @games/tictactoe validate` | all pass |
| T-009 | todo | Validate web/desktop build paths | @you | `pnpm --filter @games/tictactoe web:build` + desktop scripts | web + linux pass locally |
| T-010 | todo | Validate mobile contract scripts | @you | `pnpm --filter @games/tictactoe cap:sync && pnpm --filter @games/tictactoe cap:build:android` | scripts execute without contract errors |
| T-011 | todo | Add CI matrix entry for app | @you | update workflow matrix with `@games/tictactoe` | CI runs tictactoe jobs |
| T-012 | todo | Upload report artifacts in CI | @you | workflow artifact step for `apps/tictactoe/reports/**` | reports downloadable in CI |
| T-013 | todo | PR review + merge gate | @you | open PR with checklist | all checks green, PR approved |

## First 5 Tasks (Do These Now)

- [ ] T-001 Create migration branch
- [ ] T-002 Tag rollback point
- [x] T-003 Copy source repo into `apps/tictactoe`
- [x] T-004 Set package identity to `@games/tictactoe`
- [x] T-005 Add missing script aliases

## PR Merge Gate (Must all be true)

- [x] `pnpm --filter @games/tictactoe validate` passes
- [x] Required scripts exist for web/iOS/android/linux/windows/macos routes
- [x] Reports generated under `apps/tictactoe/reports/*`
- [ ] CI matrix includes `tictactoe`
- [ ] No boundary/lint/type regressions
