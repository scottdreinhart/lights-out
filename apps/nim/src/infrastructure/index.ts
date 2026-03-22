// Platform contracts and detection
export * from './platform'

// Infrastructure services
export { playClick, playConfirm, playCpuMove, playLose, playSelect, playWin } from './audio'
export { crashLogger } from './diagnostics'
export { haptics } from './haptics'
export { clear, load, remove, save } from './storage'
