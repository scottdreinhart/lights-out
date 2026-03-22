# Sibling Repo Scaffold Ranking (2026-03-16)

Purpose: prioritize sibling game-repo migration with scaffolded/minimal-code projects first.

## Method

Complexity score (lower is earlier):

- `score = src_files*3 + src_loc/200 + platform_files + missing_vite*5 + missing_package*20`
- `src_files/src_loc` measured from `src/` (`.ts/.tsx/.js/.jsx/.css/.html`).
- `platform_files` counts files under `electron/`, `assembly/`, `tests/`, `public/`.
- Results are operational heuristics for intake ordering, not quality judgments.

## Ranked Order

| Rank | Repo | Score | src files | src LOC | platform files | has vite config | has package.json |
|---:|---|---:|---:|---:|---:|:---:|:---:|
| 1 | monchola | 160 | 48 | 1834 | 7 | yes | yes |
| 2 | reversi | 184 | 55 | 2325 | 8 | yes | yes |
| 3 | simon-says | 184 | 55 | 2322 | 8 | yes | yes |
| 4 | ship-captain-crew | 186 | 54 | 3235 | 8 | yes | yes |
| 5 | 2048 | 188 | 56 | 2409 | 8 | yes | yes |
| 6 | memory-game | 188 | 56 | 2400 | 8 | yes | yes |
| 7 | hangman | 195 | 58 | 2718 | 8 | yes | yes |
| 8 | pig | 199 | 58 | 3546 | 8 | yes | yes |
| 9 | cee-lo | 203 | 59 | 3618 | 8 | yes | yes |
| 10 | chicago | 203 | 59 | 3618 | 8 | yes | yes |
| 11 | cho-han | 203 | 59 | 3618 | 8 | yes | yes |
| 12 | farkle | 203 | 59 | 3618 | 8 | yes | yes |
| 13 | liars-dice | 203 | 59 | 3618 | 8 | yes | yes |
| 14 | mexico | 203 | 59 | 3618 | 8 | yes | yes |
| 15 | bunco | 221 | 64 | 4270 | 8 | yes | yes |
| 16 | connect-four | 222 | 63 | 5195 | 8 | yes | yes |
| 17 | rock-paper-scissors | 237 | 70 | 3951 | 8 | yes | yes |
| 18 | checkers | 241 | 69 | 5379 | 8 | yes | yes |
| 19 | shut-the-box | 241 | 71 | 4067 | 8 | yes | yes |
| 20 | minesweeper | 248 | 72 | 4817 | 8 | yes | yes |
| 21 | snake | 256 | 72 | 6516 | 8 | yes | yes |
| 22 | battleship | 267 | 78 | 5142 | 8 | yes | yes |
| 23 | mancala | 268 | 76 | 6550 | 8 | yes | yes |
| 24 | tictactoe | 418 | 117 | 10757 | 14 | yes | yes |
| 25 | nim | 475 | 134 | 12134 | 13 | yes | yes |

## Execution Guidance

- Treat all game repos as peer-level candidates.
- Use ranking to seed intake order only after comparison confirms best merge option.
- Treat Nim as a larger-footprint ingestion/restructure wave even if ranking changes over time.
