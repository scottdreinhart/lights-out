/**
 * CQRS Infrastructure - Public API
 *
 * Exports:
 * - CommandBus, QueryBus (command/query dispatchers)
 * - Command types: CreatePuzzleCommand, AssignValueCommand, etc.
 * - Query types: GetPuzzleStateQuery, IsCompletedQuery, etc.
 * - Event types: PuzzleCreatedEvent, ValueAssignedEvent, etc.
 * - Type guards for discriminated unions
 */

// Infrastructure
export { CommandBus, QueryBus, EventStore, SnapshotStore } from './infrastructure'
export type {
  Command,
  CommandResult,
  DomainEvent,
  Query,
  QueryResult,
  CommandHandler,
  QueryHandler,
  Snapshot,
} from './infrastructure'

// Commands
export {
  isAssignValueCommand,
  isClearCellCommand,
  isUndoCommand,
  isRedoCommand,
  isCreatePuzzleCommand,
  isPauseGameCommand,
  isQuitGameCommand,
} from './commands'
export type {
  AssignValueCommand,
  ClearCellCommand,
  UndoCommand,
  RedoCommand,
  CreatePuzzleCommand,
  LoadPuzzleCommand,
  RestartPuzzleCommand,
  MakeMoveCommand,
  RequestHintCommand,
  RevealSolutionCommand,
  PauseGameCommand,
  ResumeGameCommand,
  QuitGameCommand,
  ChangeSettingsCommand,
  SelectDifficultyCommand,
  RecordStatsCommand,
  UpdateStreakCommand,
  PuzzleCommand,
} from './commands'

// Queries
export {
  isGetPuzzleStateQuery,
  isGetCellValueQuery,
  isIsCompletedQuery,
  isGetGameStatsQuery,
  isGetMoveHistoryQuery,
  isGetNextHintQuery,
  isCanUndoQuery,
  isCanRedoQuery,
} from './queries'
export type {
  GetPuzzleStateQuery,
  GetCellValueQuery,
  IsCompletedQuery,
  GetGameStatsQuery,
  GetMoveHistoryQuery,
  GetDifficultyQuery,
  GetInitialStateQuery,
  GetMoveCountQuery,
  GetUndoStackQuery,
  GetRedoStackQuery,
  CanUndoQuery,
  CanRedoQuery,
  GetCellCandidatesQuery,
  GetConflictingCellsQuery,
  HasConstraintViolationQuery,
  IsValidQuery,
  IsSolvableQuery,
  GetSolutionQuery,
  GetElapsedTimeQuery,
  GetHintCountQuery,
  GetGameStateQuery,
  GetDifficultyScoreQuery,
  GetRemainingConstraintsQuery,
  GetResolvedConstraintsQuery,
  EstimateSolveTimeQuery,
  GetNextHintQuery,
  GetCandidatesForCellQuery,
  GetConstraintTechniqueQuery,
  GetSettingsQuery,
  GetThemeQuery,
  PuzzleQuery,
} from './queries'

// Events
export {
  isPuzzleCreatedEvent,
  isValueAssignedEvent,
  isPuzzleCompletedEvent,
  isConstraintViolationEvent,
  isStatsRecordedEvent,
} from './events'
export type {
  PuzzleCreatedEvent,
  PuzzleLoadedEvent,
  PuzzleCompletedEvent,
  PuzzleAbandonedEvent,
  ValueAssignedEvent,
  ValueUnassignedEvent,
  ConstraintViolationDetectedEvent,
  ConstraintResolvedEvent,
  MoveUndoneEvent,
  MoveRedoneEvent,
  HintProvidedEvent,
  SolutionRevealedEvent,
  GamePausedEvent,
  GameResumedEvent,
  GameRestartedEvent,
  StatsRecordedEvent,
  StreakUpdatedEvent,
  PuzzleEvent,
} from './events'
