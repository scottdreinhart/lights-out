import { selectNimSumMove } from '@games/domain-shared'
import type { GameState, Move } from './types'

export const selectMove = (state: GameState): Move => selectNimSumMove(state)
