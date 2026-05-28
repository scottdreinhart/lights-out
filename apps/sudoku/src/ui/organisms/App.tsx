import { useSudokuApp } from '@/app'

import { SudokuSurface } from './SudokuSurface'

const App = () => {
  const app = useSudokuApp()

  return <SudokuSurface app={app} />
}

export default App
