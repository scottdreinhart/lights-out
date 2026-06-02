# Snakes and Ladders

`@games/snakes-and-ladders` is a fully playable two-player implementation (human vs CPU) of the canonical 100-square race game.

## Rules baseline (canonical implementation)

This app implements the commonly accepted modern ruleset aligned to:

1. [Wikipedia — *Snakes and ladders*](https://en.wikipedia.org/wiki/Snakes_and_ladders) (objective, board flow, ladder/snake behavior)
2. [Yellow Mountain Imports — How to Play Snakes and Ladders](https://www.ymimports.com/pages/how-to-play-snakes-and-ladders) (exact-100 requirement, overshoot handling, turn flow)

Normalized rules implemented in code:

- **Players**: 2 (`You`, `CPU`)
- **Setup**: both players start at square `1`
- **Components**: 10x10 board (`1..100`), one six-sided die, fixed snake/ladder map
- **Turn flow**:
  1. Current player rolls `1..6`
  2. Move forward by rolled amount
  3. If landing on a ladder base, climb to its top
  4. If landing on a snake head, slide to its tail
  5. Turn passes to next player unless game is won
- **Constraints**:
  - Roll must be integer in `1..6`
  - Must land **exactly** on `100` to win
  - Overshoot (`>100`) keeps player in place
- **Scoring / win**: first player to reach square `100` wins immediately
- **Variants**: bounce-back and extra-roll-on-6 are documented variants, not enabled by default

## Architecture

- `src/domain/` — pure game logic and immutable state transitions
  - `constants.ts` (board/dice values + snake/ladder map)
  - `rules.ts` (turn application + win detection)
  - `types.ts` (domain contracts)
- `src/app/` — orchestration hook (`useSnakesAndLaddersGame`)
- `src/ui/` — presentation (`App` organism + shared atoms)

## Quality coverage

- Unit tests: `src/domain/rules.unit.test.ts`
  - ladder climb
  - snake slide
  - overshoot behavior
  - exact-win behavior
  - invalid roll validation

## Scripts

Run from repository root (preferred):

```bash
pnpm --filter @games/snakes-and-ladders dev
pnpm --filter @games/snakes-and-ladders exec vitest run
pnpm --filter @games/snakes-and-ladders exec tsc --noEmit
pnpm --filter @games/snakes-and-ladders build
```
