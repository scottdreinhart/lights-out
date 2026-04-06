export { load, remove, save } from './storage'

export const clear = (): void => {
  localStorage.clear()
}
