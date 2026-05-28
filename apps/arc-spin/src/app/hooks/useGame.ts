import type { GameAction, GameState } from '@/domain'
import { GAME_META, INITIAL_STATE, reduceGameState } from '@/domain'
import {
  createUseTickingReducerGameHook,
  type UseTickingReducerGameResult,
} from '@games/app-hook-utils'

export type UseGameResult = UseTickingReducerGameResult<GameState, GameAction, typeof GAME_META>

export const useGame = createUseTickingReducerGameHook<GameState, GameAction, typeof GAME_META>({
  initialState: INITIAL_STATE,
  reduceState: reduceGameState,
  tickAction: 'tick',
  tickIntervalMs: 1400,
  meta: GAME_META,
})
