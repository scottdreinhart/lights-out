export {
  GAME_META,
  INITIAL_STATE,
  LANE_COUNT,
  LANE_POSITION_MAP,
  PROGRESS_TARGET,
  RUNNER_FLOW_PROFILE,
  SIMULATION_CONFIG,
  STACK_ADDITIONS,
  TICK_INTERVAL_MS,
} from './constants'
export { reduceGameState } from './rules'
export type { GameAction } from './rules'
export { applyRunnerCommand, stepRunnerSimulation } from './simulation'
export { SOUND_PROFILE } from './soundProfile'
export type {
  DifficultyCurve,
  GameMeta,
  GamePhase,
  GameState,
  InputCommand,
  LaneIndex,
  Obstacle,
  ObstacleKind,
  ObstaclePattern,
  RunnerFlowProfile,
  RunnerState,
  SimulationConfig,
  StackAdditions,
} from './types'
